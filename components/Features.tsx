import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Features() {
  const items = [
    {
      title: "Galeria od gości",
      desc: "Zdjęcia i filmy przesyłane prosto z telefonu.",
    },
    {
      title: "Plan dnia i menu",
      desc: "Harmonogram, karta dań i karta drinków.",
    },
    {
      title: "Dojazd jednym kliknięciem",
      desc: "Adres kościoła i sala z nawigacją.",
    },
    {
      title: "Prosty panel pary",
      desc: "Zarządzanie treścią i zdjęciami bez pomocy technicznej.",
    },
  ];

  return (
    <section id="features" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-serif font-base text-gray-900">
          Goście wiedzą, co dzieje się dalej
        </h2>
        <p className="mt-2 text-muted-foreground">
          Wy zachowujecie wszystkie wspomnienia.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((it) => (
            <Card key={it.title}>
              <CardHeader>
                <CardTitle className="text-rose-900 ">{it.title}</CardTitle>
                <CardDescription>{it.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
