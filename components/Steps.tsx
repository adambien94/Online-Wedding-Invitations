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
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-serif font-base text-gray-900">
          Wy przygotowujecie stronę. Goście wypełniają ją wspomnieniami.
        </h2>
        <p className="mt-2 text-muted-foreground">
          Wy zachowujecie wszystkie wspomnienia.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="p-4 text-center">
                <div className="h-12 w-12 mx-auto rounded-full bg-rose-100 text-rose-900 flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mt-3 font-medium">{s.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
