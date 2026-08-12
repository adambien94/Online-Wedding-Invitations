import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { BadgeQuestionMark } from "lucide-react";

export default function FAQ() {
  const items = [
    {
      q: "Czy goście muszą coś instalować?",
      a: "Nie, wszystko działa w przeglądarce.",
    },
    {
      q: "Czy zdjęcia są od razu publiczne?",
      a: "Możesz włączyć moderację przed publikacją.",
    },
    {
      q: "Czy można zwiększyć limit galerii?",
      a: "Tak — wybierz wyższy plan.",
    },
    {
      q: "Czy goście muszą coś instalować lorem ipsum?",
      a: "Nie, wszystko działa w przeglądarce.",
    },
    {
      q: "Czy zdjęcia są od razu publiczne?",
      a: "Możesz włączyć moderację przed publikacją.",
    },
  ];

  return (
    <section id="faq" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex">
        <div className="lg:w-1/2 flex gap-4">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-rose-100 text-rose-900">
            <BadgeQuestionMark className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-base">Zanim zaczniecie</h2>
            <p className="mt-2 text-muted-foreground">
              Pytania i odpowiedzi, które mogą się przydać.
            </p>
          </div>
        </div>

        <div className="mt-6 lg:mt-0 lg:w-1/2">
          <Accordion>
            {items.map((it) => (
              <AccordionItem key={it.q} value={it.q}>
                <AccordionTrigger>{it.q}</AccordionTrigger>
                <AccordionContent>{it.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
