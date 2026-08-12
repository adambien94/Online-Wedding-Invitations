import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Camera, CalendarDays, MapPin, SlidersHorizontal } from "lucide-react";

export default function Features() {
  const items = [
    {
      title: "Galeria",
      desc: "Zdjęcia i filmy przesyłane prosto z telefonu.",
      icon: Camera,
    },
    {
      title: "Plan dnia",
      desc: "Harmonogram, karta dań i karta drinków.",
      icon: CalendarDays,
    },
    {
      title: "Dojazd",
      desc: "Adres kościoła i sala z nawigacją.",
      icon: MapPin,
    },
    {
      title: "Prosty panel",
      desc: "Zarządzanie treścią i zdjęciami bez pomocy technicznej.",
      icon: SlidersHorizontal,
    },
  ];

  return (
    <section id="features" className="pb-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-16">
        <div className="lg:w-1/4">
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-1 gap-4">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <Card key={it.title}>
                  <CardHeader className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-rose-100 text-rose-900">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>{it.title}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <img
            src="/phone.png"
            alt="Phone"
            className="mt-8 h-200 w-132 object-cover"
          />
        </div>

        <div className="lg:w-2/4">
          <h2 className="text-3xl font-serif font-base text-gray-900">
            Goście wiedzą, co dzieje się dalej
          </h2>
          <p className="mt-2 text-muted-foreground">
            Wy zachowujecie wszystkie wspomnienia.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-1 gap-6">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <div key={it.title} className="shadow-none">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-rose-100 text-rose-900">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-base ">{it.title}</h2>
                      <p className="text-muted-foreground text-sm">{it.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
