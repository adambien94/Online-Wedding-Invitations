import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { defaultInvitationConfig } from "@/lib/invitation-config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.slice(7);

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Verify the JWT and get the user
  const {
    data: { user },
    error: authError,
  } = await sb.auth.getUser(token);

  if (authError || !user)
    return res.status(401).json({ message: "Unauthorized" });

  const { person1, person2, eventDate, eventTime, reservationId } =
    req.body || {};

  if (!reservationId)
    return res.status(400).json({ message: "Brakujące pola" });

  // One wedding per user — return existing if already created
  const { data: existingEvents } = await sb
    .from("events")
    .select("id, slug")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1);

  if (existingEvents && existingEvents.length > 0) {
    return res.status(200).json({ success: true, event: existingEvents[0] });
  }

  // Fetch the reservation belonging to this user
  const { data: reservation, error: resError } = await sb
    .from("subdomain_reservations")
    .select("id, slug, status, user_id")
    .eq("id", reservationId)
    .single();

  if (resError || !reservation)
    return res.status(404).json({ message: "Rezerwacja nie istnieje" });

  if (reservation.user_id !== user.id)
    return res.status(403).json({ message: "Brak dostępu do tej rezerwacji" });

  if (reservation.status !== "reserved")
    return res.status(409).json({ message: "Rezerwacja już wykorzystana" });

  // Build event_date value
  let eventDateValue: string | null = null;
  if (eventDate) {
    eventDateValue = eventTime
      ? `${eventDate}T${eventTime}:00`
      : eventDate;
  }

  // Create the event
  const { data: event, error: eventError } = await sb
    .from("events")
    .insert({
      type: "wedding",
      slug: reservation.slug,
      owner_id: user.id,
      status: "draft",
      event_date: eventDateValue,
    })
    .select("id, slug")
    .single();

  if (eventError || !event)
    return res
      .status(500)
      .json({ message: eventError?.message ?? "Błąd tworzenia eventu" });

  // Initial draft — couple/date filled later in the sections editor.
  // Template starts empty so the user must pick one before editing/publishing.
  const draftConfig = {
    ...defaultInvitationConfig,
    couple: {
      person1: typeof person1 === "string" ? person1 : "",
      person2: typeof person2 === "string" ? person2 : "",
    },
    event: {
      date: eventDate ?? "",
      time: eventTime ?? "",
    },
    template: { key: "", version: 0 },
  };

  // Create the event draft
  const { error: draftError } = await sb.from("event_drafts").insert({
    event_id: event.id,
    config: draftConfig,
    version: 1,
  });

  if (draftError)
    return res
      .status(500)
      .json({ message: draftError.message ?? "Błąd tworzenia draftu" });

  // Mark the reservation as claimed
  const { error: claimError } = await sb
    .from("subdomain_reservations")
    .update({
      status: "claimed",
      claimed_event_id: event.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reservationId);

  if (claimError)
    return res
      .status(500)
      .json({ message: claimError.message ?? "Błąd aktualizacji rezerwacji" });

  return res.status(201).json({ success: true, event });
}
