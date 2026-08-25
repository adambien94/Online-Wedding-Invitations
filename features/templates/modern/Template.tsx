import type { InvitationConfig } from "@/lib/invitation-config";

interface Props {
  config: InvitationConfig;
}

export default function ModernTemplate({ config }: Props) {
  const { couple, event, hero, ceremony, reception, schedule, faq, sections } =
    config;

  const coupleNames =
    couple.person1 && couple.person2
      ? `${couple.person1} & ${couple.person2}`
      : "Imię & Imię";

  return (
    <div
      className="font-sans bg-white text-gray-900 min-h-screen"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Hero */}
      {sections.hero && (
        <section className="bg-stone-500 text-white text-center py-24 px-6">
          <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-5">
            Zaproszenie na ślub
          </p>
          <h1 className="text-5xl sm:text-6xl font-light">{coupleNames}</h1>
          {hero.subtitle && (
            <p className="mt-5 text-gray-300 text-lg font-light">
              {hero.subtitle}
            </p>
          )}
          {event.date && (
            <div className="mt-8 inline-flex items-center gap-3">
              <div className="w-10 h-px bg-gray-600" />
              <p className="text-sm tracking-widest uppercase text-gray-400">
                {new Date(event.date).toLocaleDateString("pl-PL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {event.time && ` · ${event.time}`}
              </p>
              <div className="w-10 h-px bg-gray-600" />
            </div>
          )}
        </section>
      )}

      {/* Miejsca */}
      {sections.locations && (ceremony.name || reception.name) && (
        <section className="py-16 px-6 bg-stone-500">
          <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-8">
            {ceremony.name && (
              <div className="border rounded-3xl border-gray-200 p-8">
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">
                  Ceremonia
                </p>
                <p className="text-2xl font-light">{ceremony.name}</p>
                {ceremony.address && (
                  <p className="text-sm text-gray-500 mt-2">
                    {ceremony.address}
                  </p>
                )}
              </div>
            )}
            {reception.name && (
              <div className="border rounded-3xl border-gray-200 p-8">
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">
                  Wesele
                </p>
                <p className="text-2xl font-light">{reception.name}</p>
                {reception.address && (
                  <p className="text-sm text-gray-500 mt-2">
                    {reception.address}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Harmonogram */}
      {sections.schedule && schedule.length > 0 && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-lg mx-auto">
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-10 text-center">
              Plan dnia
            </p>
            <ul className="space-y-0 divide-y divide-gray-200">
              {schedule.map((item, i) => (
                <li key={i} className="flex gap-6 items-center py-4">
                  <span className="text-sm font-mono text-gray-400 w-14 flex-none">
                    {item.time}
                  </span>
                  <span className="text-gray-800">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      {sections.faq && faq.length > 0 && (
        <section className="py-16 px-6 max-w-xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-gray-400 mb-10 text-center">
            FAQ
          </p>
          <ul className="space-y-8">
            {faq.map((item, i) => (
              <li key={i} className="border-l-2 border-gray-900 pl-5">
                <p className="font-medium">{item.question}</p>
                <p className="text-sm text-gray-500 mt-1">{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
