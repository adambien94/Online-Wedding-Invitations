import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@base-ui/react";
import { Check } from "lucide-react";

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
    <section id="pricing" className="py-16 bg-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-serif leading-tight tracking-tight text-neutral-900 sm:text-4xl text-center">
          Wybierzcie pojemność Waszej galerii.
        </h2>
        <p className="mt-2 text-center text-neutral-900">
          Każdy wariant obejmuje jedną stronę wydarzenia i wszystkie funkcje.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <Card
              key={p.title}
              className="text-neutral-900 bg-orange-100 rounded-none shadow-none"
            >
              <CardHeader>
                <CardTitle className="text-md font-base">{p.title}</CardTitle>
                <CardDescription className="text-4xl text-neutral-900 font-bold">
                  {p.price}
                </CardDescription>
                <p className="text-neutral-900 font-bold text-xs">
                  Do 200 zdjęć lub filmów
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <Separator />
              <CardFooter>
                <Link
                  href="/register"
                  className="w-full inline-flex items-center justify-center bg-neutral-900 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-neutral-700"
                >
                  Zaczynamy
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
