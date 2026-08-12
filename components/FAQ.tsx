import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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
    <section id="faq" className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex">
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-serif font-base">Zanim zaczniecie</h2>
          <p className="mt-2 text-muted-foreground">
            Pytania i odpowiedzi, które mogą się przydać.
          </p>
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
