import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET" && req.method !== "PATCH")
    return res.status(405).json({ message: "Method not allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.slice(7);
  const eventId = req.query.id as string;

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const {
    data: { user },
    error: authError,
  } = await sb.auth.getUser(token);

  if (authError || !user)
    return res.status(401).json({ message: "Unauthorized" });

  // Verify the event belongs to this user
  const { data: event, error: eventError } = await sb
    .from("events")
    .select("id, owner_id, slug, status, event_date, published_at")
    .eq("id", eventId)
    .single();

  if (eventError || !event)
    return res.status(404).json({ message: "Event nie istnieje" });

  if (event.owner_id !== user.id)
    return res.status(403).json({ message: "Brak dostępu" });

  if (req.method === "GET") {
    const { data: draft, error: draftError } = await sb
      .from("event_drafts")
      .select("id, event_id, config, version, updated_at")
      .eq("event_id", eventId)
      .single();

    if (draftError || !draft)
      return res.status(404).json({ message: "Draft nie istnieje" });

    return res.status(200).json({
      draft,
      event: {
        id: event.id,
        slug: event.slug,
        status: event.status,
        event_date: event.event_date,
        published_at: event.published_at,
      },
      user: { email: user.email },
    });
  }

  // PATCH — partial update of config
  const { config } = req.body || {};
  if (!config)
    return res.status(400).json({ message: "Brak config w body" });

  const { data: updated, error: updateError } = await sb
    .from("event_drafts")
    .update({ config })
    .eq("event_id", eventId)
    .select("id, event_id, config, version, updated_at")
    .single();

  if (updateError || !updated)
    return res
      .status(500)
      .json({ message: updateError?.message ?? "Błąd zapisu draftu" });

  return res.status(200).json({ draft: updated });
}
