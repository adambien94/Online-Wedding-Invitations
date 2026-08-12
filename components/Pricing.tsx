import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Pricing() {
  const plans = [
    {
      title: "Klasyczny",
      price: "99,50 zł",
      features: [
        "Do 200 zdjęć lub filmów",
        "Kod QR",
        "Podstawowe wsparcie",
        "Do 200 zdjęć lub filmów",
        "Kod QR",
        "Podstawowe wsparcie",
      ],
    },
    {
      title: "Rozszerzony",
      price: "149 zł",
      features: [
        "Do 500 zdjęć",
        "Więcej opcji personalizacji",
        "Pełne wsparcie i eksport",
        "Do 200 zdjęć lub filmów",
        "Kod QR",
        "Podstawowe wsparcie",
      ],
    },
    {
      title: "Maksymalny",
      price: "199,50 zł",
      features: [
        "Do 200 zdjęć lub filmów",
        "Kod QR",
        "Podstawowe wsparcie",
        "Do 1000 zdjęć",
        "Pełne wsparcie i eksport",
        "Cuda w personalizacji",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-16 bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-serif font-base">
          Wybierzcie pojemność Waszej galerii.
        </h2>
        <p className="mt-2 text-muted-foreground">
          Każdy wariant obejmuje jedną stronę wydarzenia i wszystkie funkcje.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card key={p.title}>
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription className="text-3xl text-rose-900 font-bold">
                  {p.price}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {p.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Zaczynamy
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
