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
    <section className="py-18">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-serif leading-tight tracking-tight text-neutral-900 sm:text-4xl text-center">
          Wy przygotowujecie stronę. Goście wypełniają ją wspomnieniami.
        </h2>
        <p className="mt-2 text-center text-neutral-900">
          Wy zachowujecie wszystkie wspomnienia.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4 pt-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title}>
                <CardHeader className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-neutral-400">
                    <Icon className="h-18 w-18" />
                  </div>
                  <div>
                    <CardTitle>{s.title}</CardTitle>
                    <CardDescription className="text-neutral-900">
                      {s.desc}
                    </CardDescription>
                  </div>
                </CardHeader>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
