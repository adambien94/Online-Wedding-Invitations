import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const RESERVED = [
  "www",
  "app",
  "admin",
  "api",
  "dashboard",
  "login",
  "register",
  "assets",
  "static",
  "support",
  "help",
  "blog",
  "demo",
  "pricing",
  "account",
  "settings",
];

function validateSlug(s: string) {
  if (!s) return "Brak adresu";
  if (s.length < 3 || s.length > 50) return "Adres musi mieć 3–50 znaków";
  if (!/^[a-z0-9-]+$/.test(s))
    return "Adres może zawierać tylko: a-z, 0-9 i myślnik";
  if (/--/.test(s)) return "Adres nie może zawierać podwójnych myślników";
  if (/^-|-$/.test(s))
    return "Adres nie może zaczynać się ani kończyć myślnikiem";
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { slug } = req.body || {};
  const s = (typeof slug === "string" ? slug : "").trim();

  const validation = validateSlug(s);
  if (validation)
    return res.status(400).json({ available: false, message: validation });

  if (RESERVED.includes(s))
    return res
      .status(200)
      .json({ available: false, message: "Ten adres jest zarezerwowany" });

  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    );

    const { data, error } = await sb
      .from("subdomain_reservations")
      .select("id")
      .eq("slug", s)
      .limit(1);

    if (error) {
      console.warn("slug-check supabase error:", error.message);
      return res.status(200).json({ available: true });
    }

    if (data && data.length > 0) {
      return res
        .status(200)
        .json({ available: false, message: "Ten adres jest już zajęty" });
    }

    return res.status(200).json({ available: true });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ available: true });
  }
}
