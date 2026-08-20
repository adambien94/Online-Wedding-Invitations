import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserPlus, Palette, Globe2, QrCode } from "lucide-react";

export default function Steps() {
  const steps = [
    {
      title: "Załóż konto",
      desc: "Szybka rejestracja i gotowe.",
      icon: UserPlus,
    },
    {
      title: "Nadajcie jej Wasz styl",
      desc: "Wybierzcie kolor, zdjęcia i układ.",
      icon: Palette,
    },
    {
      title: "Wybierzcie własny adres",
      desc: "Personalizowany adres strony.",
      icon: Globe2,
    },
    {
      title: "Pobierzcie gotowy kod QR",
      desc: "Udostępnijcie go na stołach i zaproszeniach.",
      icon: QrCode,
    },
  ];

  return (
    <section className=" border-t border-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl text-center font-serif font-base text-gray-900">
          Wy przygotowujecie stronę. Goście wypełniają ją wspomnieniami.
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Wy zachowujecie wszystkie wspomnienia.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.title}>
                <CardHeader className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border text-neutral-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{s.title}</CardTitle>
                    <CardDescription>{s.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
