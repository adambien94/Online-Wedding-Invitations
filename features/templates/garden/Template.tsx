import type { InvitationConfig } from "@/lib/invitation-config";

interface Props {
  config: InvitationConfig;
}

export default function GardenTemplate({ config }: Props) {
  const { couple, event, hero, ceremony, reception, schedule, faq, sections } =
    config;

  const coupleNames =
    couple.person1 && couple.person2
      ? `${couple.person1} & ${couple.person2}`
      : "Imię & Imię";

  return (
    <div
      className="min-h-screen bg-[#eef3ee] text-[#2c3a2e]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {sections.hero && (
        <section className="relative overflow-hidden text-center px-6 py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, #7a9a7e 0%, transparent 45%), radial-gradient(circle at 80% 70%, #a8c4a4 0%, transparent 40%)",
            }}
          />
          <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-[#6b856f]">
            Zaproszenie na ślub
          </p>
          <h1 className="text-4xl font-normal tracking-wide text-[#2c3a2e] sm:text-5xl">
            {coupleNames}
          </h1>
          {hero.subtitle && (
            <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-[#5a6f5c]">
              {hero.subtitle}
            </p>
          )}
          {event.date && (
            <p className="mt-8 text-sm uppercase tracking-[0.25em] text-[#6b856f]">
              {new Date(event.date).toLocaleDateString("pl-PL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {event.time && ` · ${event.time}`}
            </p>
          )}
          <div className="mt-10 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#a8c4a4]" />
            <span className="size-1.5 rounded-full bg-[#7a9a7e]" />
            <span className="h-px w-12 bg-[#a8c4a4]" />
          </div>
        </section>
      )}

      {sections.locations && (ceremony.name || reception.name) && (
        <section className="border-t border-[#c5d6c5] px-6 py-16">
          <div className="mx-auto grid max-w-2xl gap-12 sm:grid-cols-2 sm:gap-8">
            {ceremony.name && (
              <div className="text-center">
                <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-[#6b856f]">
                  Ceremonia
                </p>
                <p className="text-xl text-[#2c3a2e]">{ceremony.name}</p>
                {ceremony.address && (
                  <p className="mt-2 text-sm leading-relaxed text-[#5a6f5c]">
                    {ceremony.address}
                  </p>
                )}
              </div>
            )}
            {reception.name && (
              <div className="text-center">
                <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-[#6b856f]">
                  Wesele
                </p>
                <p className="text-xl text-[#2c3a2e]">{reception.name}</p>
                {reception.address && (
                  <p className="mt-2 text-sm leading-relaxed text-[#5a6f5c]">
                    {reception.address}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {sections.schedule && schedule.length > 0 && (
        <section className="bg-[#e2ebe2] px-6 py-16">
          <div className="mx-auto max-w-md">
            <p className="mb-10 text-center text-[11px] uppercase tracking-[0.3em] text-[#6b856f]">
              Plan dnia
            </p>
            <ul className="space-y-5">
              {schedule.map((item, i) => (
                <li key={i} className="flex items-baseline gap-5">
                  <span className="w-14 flex-none text-sm text-[#6b856f]">
                    {item.time}
                  </span>
                  <span className="text-[#2c3a2e]">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {sections.faq && faq.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-xl">
            <p className="mb-10 text-center text-[11px] uppercase tracking-[0.3em] text-[#6b856f]">
              Często zadawane pytania
            </p>
            <ul className="space-y-7">
              {faq.map((item, i) => (
                <li key={i}>
                  <p className="font-medium text-[#2c3a2e]">{item.question}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#5a6f5c]">
                    {item.answer}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
