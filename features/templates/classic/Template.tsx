import type { InvitationConfig } from "@/lib/invitation-config";

interface Props {
  config: InvitationConfig;
}

export default function ClassicTemplate({ config }: Props) {
  const { couple, event, hero, ceremony, reception, schedule, faq, sections } =
    config;

  const coupleNames =
    couple.person1 && couple.person2
      ? `${couple.person1} & ${couple.person2}`
      : "Imię & Imię";

  return (
    <div
      className="font-serif bg-[#faf8f3] text-[#3b3228] min-h-screen"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* Hero */}
      {sections.hero && (
        <section className="relative text-center py-20 px-6 border-b border-[#d4b896]">
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/ornament.svg')] bg-center bg-no-repeat bg-cover" />
          <p className="uppercase tracking-[0.3em] text-xs text-[#9c7c5c] mb-4">
            Zaproszenie na ślub
          </p>
          <h1 className="text-4xl sm:text-5xl font-normal text-[#3b3228]">
            {coupleNames}
          </h1>
          {hero.subtitle && (
            <p className="mt-4 text-[#7a6650] text-lg">{hero.subtitle}</p>
          )}
          {event.date && (
            <p className="mt-6 text-sm tracking-widest uppercase text-[#9c7c5c]">
              {new Date(event.date).toLocaleDateString("pl-PL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {event.time && ` · ${event.time}`}
            </p>
          )}
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-px bg-[#d4b896]" />
          </div>
        </section>
      )}

      {/* Miejsca */}
      {sections.locations && (ceremony.name || reception.name) && (
        <section className="py-16 px-6 max-w-xl mx-auto text-center space-y-10">
          {ceremony.name && (
            <div>
              <p className="uppercase tracking-widest text-xs text-[#9c7c5c] mb-2">
                Ceremonia
              </p>
              <p className="text-xl">{ceremony.name}</p>
              {ceremony.address && (
                <p className="text-sm text-[#7a6650] mt-1">{ceremony.address}</p>
              )}
            </div>
          )}
          {reception.name && (
            <div>
              <p className="uppercase tracking-widest text-xs text-[#9c7c5c] mb-2">
                Wesele
              </p>
              <p className="text-xl">{reception.name}</p>
              {reception.address && (
                <p className="text-sm text-[#7a6650] mt-1">{reception.address}</p>
              )}
            </div>
          )}
        </section>
      )}

      {/* Harmonogram */}
      {sections.schedule && schedule.length > 0 && (
        <section className="py-16 px-6 bg-[#f2ece0] border-t border-b border-[#d4b896]">
          <div className="max-w-md mx-auto">
            <p className="uppercase tracking-widest text-xs text-[#9c7c5c] mb-8 text-center">
              Plan dnia
            </p>
            <ul className="space-y-4">
              {schedule.map((item, i) => (
                <li key={i} className="flex gap-6 items-start">
                  <span className="text-sm text-[#9c7c5c] w-14 flex-none pt-0.5">
                    {item.time}
                  </span>
                  <span className="text-[#3b3228]">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      {sections.faq && faq.length > 0 && (
        <section className="py-16 px-6 max-w-xl mx-auto">
          <p className="uppercase tracking-widest text-xs text-[#9c7c5c] mb-8 text-center">
            Często zadawane pytania
          </p>
          <ul className="space-y-6">
            {faq.map((item, i) => (
              <li key={i}>
                <p className="font-medium text-[#3b3228]">{item.question}</p>
                <p className="mt-1 text-sm text-[#7a6650]">{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
