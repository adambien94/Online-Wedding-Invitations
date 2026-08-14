import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { slug } = req.body || {};
  const s = (typeof slug === "string" ? slug : "").trim();
  if (!s) return res.status(400).json({ message: "Missing slug" });

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );

  try {
    const { data, error } = await sb
      .from("subdomain_reservations")
      .insert({ slug: s, status: "reserved" })
      .select("id")
      .limit(1);

    if (error) {
      // unique violation or other
      return res.status(409).json({ success: false, message: error.message });
    }

    const id = data?.[0]?.id;
    return res.status(200).json({ success: true, id });
  } catch (err: any) {
    console.error("reserve-slug error", err?.message || err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
