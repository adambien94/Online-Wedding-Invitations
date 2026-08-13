import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import NavBar from "@/components/NavBar";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 10) {
      setError("Hasło musi mieć minimum 10 znaków");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Don't redirect immediately — inform user to confirm via email
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
        <NavBar />

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
                    Sprawdziliśmy — wysłaliśmy wiadomość na adres <strong>{email}</strong>.
                    Kliknij link w mailu, aby aktywować konto. Po potwierdzeniu zostaniesz przekierowany na pulpit.
                  </div>

                  <div className="flex gap-3">
                    <Link href="/login">
                      <Button variant="outline">Przejdź do logowania</Button>
                    </Link>
                  </div>
                </div>
              )}

              <p className="text-center text-sm text-muted-foreground">
                Masz już konto?{' '}
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
