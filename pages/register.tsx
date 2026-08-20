import Head from "next/head";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const validateSlug = (s: string) => {
  if (!s) return "Adres nie może być pusty";
  if (s.length < 3 || s.length > 50) return "Adres musi mieć 3–50 znaków";
  if (!/^[a-z0-9-]+$/.test(s))
    return "Adres może zawierać tylko: a-z, 0-9 i myślnik";
  if (/--/.test(s)) return "Adres nie może zawierać podwójnych myślników";
  if (/^-|-$/.test(s))
    return "Adres nie może zaczynać się ani kończyć myślnikiem";
  return null;
};

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slug, setSlug] = useState("");
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "error"
  >("idle");
  const [slugMessage, setSlugMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const normalized = slug.trim();

    if (!normalized) {
      setSlugStatus("idle");
      setSlugMessage("");
      return;
    }

    const validationError = validateSlug(normalized);
    if (validationError) {
      setSlugStatus("error");
      setSlugMessage(validationError);
      return;
    }

    const timeout = setTimeout(async () => {
      setSlugStatus("checking");
      setSlugMessage("Sprawdzamy dostępność...");

      try {
        const res = await fetch("/api/slug-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: normalized }),
        });

        const data = await res.json();

        if (res.ok && data.available) {
          setSlugStatus("available");
          setSlugMessage("Adres jest dostępny.");
          return;
        }

        setSlugStatus("taken");
        setSlugMessage(data?.message || "Ten adres jest już zajęty.");
      } catch (err) {
        setSlugStatus("error");
        setSlugMessage("Nie udało się sprawdzić dostępności adresu.");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [slug]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSlugError(null);

    if (password.length < 10) {
      setError("Hasło musi mieć minimum 10 znaków");
      setLoading(false);
      return;
    }

    const slugValue = slug.trim();
    const slugValidation = validateSlug(slugValue);
    if (slugValidation) {
      setSlugError(slugValidation);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/slug-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slugValue }),
      });
      const data = await res.json();
      if (!res.ok || data.available === false) {
        setSlugError(data?.message || "Ten adres jest już zajęty");
        setLoading(false);
        return;
      }
    } catch (err) {
      setSlugError("Błąd podczas sprawdzania dostępności adresu");
      setLoading(false);
      return;
    }

    let reservationId: string | null = null;
    try {
      const r = await fetch("/api/reserve-slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slugValue }),
      });
      const jr = await r.json();
      if (!r.ok || !jr.success) {
        setSlugError(jr?.message || "Ten adres jest już zajęty");
        setLoading(false);
        return;
      }
      reservationId = jr.id;
    } catch (err) {
      setSlugError("Błąd rezerwacji adresu");
      setLoading(false);
      return;
    }

    const { data: signData, error: signError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { reservation_id: reservationId },
      },
    });

    if (signError) {
      if (reservationId) {
        try {
          await fetch("/api/release-reservation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reservationId }),
          });
        } catch (e) {
          console.warn("release failed", e);
        }
      }
      setError(signError.message);
      setLoading(false);
      return;
    }

    try {
      const userId = signData?.user?.id;
      if (reservationId && userId) {
        await fetch("/api/claim-reservation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reservationId, userId }),
        });
      }
    } catch (e) {
      console.warn("claim reservation failed", e);
    }

    setEmailSent(true);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Rejestracja — Nasz Dzień</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-start h-16">
              <div className="flex items-center">
                <Link href="/" className="text-4xl font-serif text-neutral-900">
                  Weseleo
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md shadow-xl">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <CardTitle className="text-4xl font-bold font-serif">
                  Zaczynamy
                </CardTitle>
                <CardDescription className="text-sm">
                  Wprowadź swoje dane, aby stworzyć stronę dla Waszego ślubu.
                </CardDescription>
              </div>

              {!emailSent ? (
                <form className="space-y-5" onSubmit={handleRegister}>
                  {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Adres e-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="kontakt@naszdzien.app"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Adres Twojego zaproszenia</Label>
                    <div className="flex">
                      <Input
                        id="slug"
                        type="text"
                        placeholder="ania-piotr"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase())}
                        required
                      />
                      <span className="inline-flex items-center pr-3 pl-1 text-sm text-muted-foreground">
                        .weseleo.pl
                      </span>
                    </div>

                    {slugStatus === "checking" ||
                    slugStatus === "available" ||
                    slugStatus === "taken" ||
                    slugStatus === "error" ? (
                      <p
                        className={
                          slugStatus === "available"
                            ? "text-sm text-emerald-600"
                            : slugStatus === "taken" || slugStatus === "error"
                              ? "text-sm text-red-700"
                              : "text-sm text-muted-foreground"
                        }
                      >
                        {slugMessage}
                      </p>
                    ) : null}

                    {!slugError &&
                    slugStatus !== "checking" &&
                    slugStatus !== "taken" &&
                    slugStatus !== "error" &&
                    slug ? (
                      <p className="text-sm text-muted-foreground">
                        Twoje zaproszenie będzie dostępne pod: <br />{" "}
                        <span className="underline">
                          https://
                          {slug.trim() || "..."}.weseleo.pl
                        </span>
                      </p>
                    ) : null}

                    {slugError ? (
                      <p className="text-sm text-red-700">{slugError}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Hasło</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimum 10 znaków"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <label className="flex gap-3 leading-relaxed text-xs text-muted-foreground">
                    <input type="checkbox" required />
                    <span>
                      Akceptuję{" "}
                      <a
                        href="#"
                        className="font-medium underline underline-offset-2"
                      >
                        regulamin
                      </a>{" "}
                      oraz{" "}
                      <a
                        href="#"
                        className="font-medium underline underline-offset-2"
                      >
                        politykę prywatności
                      </a>{" "}
                      i potwierdzam zapoznanie się z zasadami przetwarzania
                      danych.
                    </span>
                  </label>

                  <Button className="w-full" disabled={loading} type="submit">
                    {loading ? "Rejestrowanie..." : "Utwórz konto"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                    Sprawdziliśmy — wysłaliśmy wiadomość na adres{" "}
                    <strong>{email}</strong>. Kliknij link w mailu, aby
                    aktywować konto. Po potwierdzeniu zostaniesz przekierowany
                    na pulpit.
                  </div>

                  <div className="flex gap-3">
                    <Link href="/login">
                      <Button variant="outline">Przejdź do logowania</Button>
                    </Link>
                  </div>
                </div>
              )}

              <p className="text-center text-sm text-muted-foreground">
                Masz już konto?{" "}
                <Link href="/login" className="underline">
                  Zaloguj się
                </Link>
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
