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
  ];

  return (
    <section id="faq" className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-xl font-semibold">Zanim zaczniecie</h3>
        <div className="mt-6 space-y-4">
          {items.map((it) => (
            <details key={it.q} className="p-4 border rounded-md bg-white">
              <summary className="font-medium">{it.q}</summary>
              <div className="mt-2 text-sm text-muted-foreground">{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
