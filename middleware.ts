import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getSlugFromHost(hostname: string) {
  const h = hostname.toLowerCase();
  const RESERVED = new Set([
    "www",
    "app",
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
  ]);

  // Development: <slug>.localhost[:port] -> slug
  if (h.endsWith(".localhost")) {
    const slug = h.slice(0, -".localhost".length);
    if (!slug) return null;
    if (RESERVED.has(slug)) return null;
    if (!/^[a-z0-9-]+$/.test(slug)) return null;
    if (slug.length < 3 || slug.length > 50) return null;
    return slug;
  }

  // Production: <slug>.<root-domain> (we don't know the root domain here)
  const labels = h.split(".").filter(Boolean);
  if (labels.length < 3) return null; // <root-domain> itself -> no slug

  const slug = labels[0];
  if (RESERVED.has(slug)) return null;
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  if (slug.length < 3 || slug.length > 50) return null;
  return slug;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hostHeader = request.headers.get("host") || "";
  const hostname = hostHeader.replace(/:\d+$/, "");

  // Sprint 11: wildcard subdomain -> public invitation (/w/[slug])
  // Keep visible URL as-is (only internal rewrite).
  if (pathname === "/") {
    const slug = getSlugFromHost(hostname);
    if (slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/w/${slug}`;
      url.search = search;
      return NextResponse.rewrite(url);
    }

    // Root URL for the main domain (or non-wildcard hosts) should not incur
    // additional auth calls.
    return NextResponse.next();
  }

  const { supabase, response } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jeśli użytkownik nie jest zalogowany i próbuje dostać się do /dashboard
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jeśli użytkownik jest zalogowany i próbuje dostać się do /login
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  // Middleware runs only where needed:
  // - public wildcard rewrite from root "/"
  // - auth guard for dashboard/login
  matcher: ["/", "/dashboard/:path*", "/login"],
};
