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

    // Get user's subdomain reservation
    const { data: reservation, error: reservationError } = await sb
      .from("subdomain_reservations")
      .select("id, slug, status, created_at")
      .eq("user_id", user.id)
      .single();

    if (reservationError && reservationError.code !== "PGRST116") {
      console.error("get-reservation error:", reservationError);
      return res.status(500).json({ message: "Failed to fetch reservation" });
    }

    return res.status(200).json({ reservation: reservation || null });
  } catch (err: any) {
    console.error("get-reservation error:", err?.message || err);
    return res.status(500).json({ message: "Server error" });
  }
}
