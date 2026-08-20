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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <>
      <Head>
        <title>Utwórz konto — Nasz Dzień</title>
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
              <div className="md:hidden">{/* mobile menu placeholder */}</div>
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

              <div className="space-y-4">
                <Button variant="outline" size="lg" className="w-full">
                  Kontynuuj z Google
                </Button>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Separator className="h-px flex-1" />
                  <span>lub adresem e-mail</span>
                  <Separator className="h-px flex-1" />
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
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
                    placeholder="Wpisz hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button className="w-full" disabled={loading} type="submit">
                  {loading ? "Logowanie..." : "Zaloguj się"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Nie masz konta?{" "}
                <Link href="/register" className="underline">
                  Zarejestruj się
                </Link>
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
