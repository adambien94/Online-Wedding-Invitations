import Head from "next/head";
import Link from "next/link";
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

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Utwórz konto — Nasz Dzień</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <NavBar />

        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md shadow-xl">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <CardTitle className="text-4xl font-bold font-serif text-rose-900">
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

              <form className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Imię lub nazwa konta</Label>
                  <Input id="name" placeholder="Ania i Piotr" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Adres e-mail</Label>
                  <Input id="email" placeholder="kontakt@naszdzien.app" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Hasło</Label>
                  <Input id="password" placeholder="Minimum 10 znaków" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site">Adres strony</Label>
                  <div className="flex overflow-hidden rounded-3xl border bg-white">
                    <Input
                      id="site"
                      placeholder="ania-piotr"
                      className="border-0 bg-transparent focus-visible:ring-0"
                    />
                    <span className="flex items-center px-3 text-sm text-muted-foreground bg-gray-100">
                      .naszdzien.app
                    </span>
                  </div>
                </div>

                <label className="flex gap-3 leading-relaxed text-xs text-muted-foreground">
                  <input type="checkbox" />
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

                <Button className="w-full ">Utwórz konto</Button>
              </form>

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
