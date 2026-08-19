import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import type { InvitationConfig } from "@/lib/invitation-config";
import { getTemplate } from "@/features/templates/registry";

type DraftRow = {
  config: InvitationConfig;
  version: number;
};

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

  try {
    // Verify token and get user
    const {
      data: { user },
      error: authError,
    } = await sb.auth.getUser(token);

    if (authError || !user)
      return res.status(401).json({ message: "Unauthorized" });

    const eventId = req.query.id as string;

    // Verify event ownership
    const {
      data: event,
      error: eventError,
    } = await sb
      .from("events")
      .select("id, owner_id, slug")
      .eq("id", eventId)
      .single();

    if (eventError || !event)
      return res.status(404).json({ message: "Event not found" });

    if (event.owner_id !== user.id)
      return res.status(403).json({ message: "Forbidden" });

    // Load draft config
    const {
      data: draftRow,
      error: draftError,
    } = await sb
      .from("event_drafts")
      .select("config, version")
      .eq("event_id", eventId)
      .single();

    if (draftError || !draftRow)
      return res.status(404).json({ message: "Draft not found" });

    const draft = draftRow as DraftRow;
    const config = draft.config;

    // ---- Validation step (minimal, server-side) ----
    if (!config?.couple?.person1 || !config?.couple?.person2) {
      return res.status(400).json({ message: "Missing couple data" });
    }

    const templateKey = config.template?.key ?? "classic";
    const templateVersion = config.template?.version ?? 1;

    const template = getTemplate(templateKey);
    if (!template)
      return res.status(400).json({ message: "Invalid template" });
    if (templateVersion !== template.version) {
      return res
        .status(400)
        .json({ message: "Template version mismatch" });
    }

    // ---- Create publication snapshot ----
    const { error: pubError } = await sb.from("event_publications").insert({
      event_id: eventId,
      config,
      template_key: templateKey,
      template_version: templateVersion,
      version: draft.version,
    });

    if (pubError) {
      console.error("publish insert error:", pubError);
      return res.status(500).json({ message: "Failed to create snapshot" });
    }

    // ---- Flip event to published ----
    const nowIso = new Date().toISOString();
    const { error: updateError } = await sb
      .from("events")
      .update({
        status: "published",
        published_at: nowIso,
        updated_at: nowIso,
      })
      .eq("id", eventId);

    if (updateError) {
      console.error("publish update error:", updateError);
      return res.status(500).json({ message: "Failed to mark published" });
    }

    // ---- Invalidate public cache (Sprint 10 requirement) ----
    // The public route is introduced in Sprint 11 (`/w/[slug]`).
    try {
      // Pages router on-demand ISR revalidation.
      // If the method doesn't exist (older Next config) we just no-op.
      const unstableRevalidate = (res as any).unstable_revalidate;
      if (typeof unstableRevalidate === "function") {
        await unstableRevalidate.call(res, `/w/${event.slug}`);
      }
    } catch {
      // no-op (cache invalidation isn't critical for publish to work)
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("publish error:", err?.message || err);
    return res.status(500).json({ message: "Server error" });
  }
}

