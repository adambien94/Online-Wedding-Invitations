import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  // Get authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid auth token" });
  }

  const token = authHeader.substring(7);

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );

  try {
    // Verify token and get user
    const {
      data: { user },
      error: authError,
    } = await sb.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user's events with their drafts
    const { data: events, error: eventsError } = await sb
      .from("events")
      .select(
        "id, type, slug, status, event_date, created_at, updated_at, published_at, event_drafts(config, version, updated_at)",
      )
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (eventsError) {
      console.error("get-events error:", eventsError);
      return res.status(500).json({ message: "Failed to fetch events" });
    }

    return res.status(200).json({ events: events || [] });
  } catch (err: any) {
    console.error("get-events error:", err?.message || err);
    return res.status(500).json({ message: "Server error" });
  }
}
