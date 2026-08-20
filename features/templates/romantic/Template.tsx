import type { InvitationConfig } from "@/lib/invitation-config";

interface Props {
  config: InvitationConfig;
}

export default function RomanticTemplate({ config }: Props) {
  const { couple, event, hero, ceremony, reception, schedule, faq, sections } =
    config;

  const coupleNames =
    couple.person1 && couple.person2
      ? `${couple.person1} & ${couple.person2}`
      : "Imię & Imię";

  return (
    <div
      className="min-h-screen bg-[#faf4f6] text-[#3d2a32]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {sections.hero && (
        <section className="relative px-6 py-28 text-center">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#f0dce4] to-transparent" />
          <div className="relative mx-auto max-w-lg">
            <div className="mx-auto mb-8 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-[#d4a5b5]" />
              <span className="size-1.5 rotate-45 border border-[#b87a90]" />
              <span className="h-px w-8 bg-[#d4a5b5]" />
            </div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.4em] text-[#b87a90]">
              Zaproszenie na ślub
            </p>
            <h1 className="text-4xl font-normal italic leading-tight text-[#3d2a32] sm:text-5xl">
              {coupleNames}
            </h1>
            {hero.subtitle && (
              <p className="mt-6 text-lg leading-relaxed text-[#7a5a66]">
                {hero.subtitle}
              </p>
            )}
            {event.date && (
              <p className="mt-8 text-sm tracking-[0.2em] text-[#b87a90]">
                {new Date(event.date).toLocaleDateString("pl-PL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {event.time && ` · ${event.time}`}
              </p>
            )}
          </div>
        </section>
      )}

      {sections.locations && (ceremony.name || reception.name) && (
        <section className="px-6 py-16">
          <div className="mx-auto flex max-w-2xl flex-col gap-10 sm:flex-row sm:gap-0">
            {ceremony.name && (
              <div className="flex-1 px-4 text-center sm:px-8">
                <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-[#b87a90]">
                  Ceremonia
                </p>
                <p className="text-xl text-[#3d2a32]">{ceremony.name}</p>
                {ceremony.address && (
                  <p className="mt-2 text-sm leading-relaxed text-[#7a5a66]">
                    {ceremony.address}
                  </p>
                )}
              </div>
            )}
            {ceremony.name && reception.name && (
              <div className="hidden w-px self-stretch bg-[#e8cdd6] sm:block" />
            )}
            {reception.name && (
              <div className="flex-1 px-4 text-center sm:px-8">
                <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-[#b87a90]">
                  Wesele
                </p>
                <p className="text-xl text-[#3d2a32]">{reception.name}</p>
                {reception.address && (
                  <p className="mt-2 text-sm leading-relaxed text-[#7a5a66]">
                    {reception.address}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {sections.schedule && schedule.length > 0 && (
        <section className="bg-[#f3e6eb] px-6 py-16">
          <div className="mx-auto max-w-md">
            <p className="mb-10 text-center text-[11px] uppercase tracking-[0.3em] text-[#b87a90]">
              Plan dnia
            </p>
            <ul className="space-y-0">
              {schedule.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-6 border-b border-[#e0c4cf]/60 py-4 last:border-0"
                >
                  <span className="w-14 flex-none pt-0.5 text-sm text-[#b87a90]">
                    {item.time}
                  </span>
                  <span className="text-[#3d2a32]">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {sections.faq && faq.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-xl">
            <p className="mb-10 text-center text-[11px] uppercase tracking-[0.3em] text-[#b87a90]">
              Często zadawane pytania
            </p>
            <ul className="space-y-8">
              {faq.map((item, i) => (
                <li key={i} className="text-center sm:text-left">
                  <p className="italic text-[#3d2a32]">{item.question}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#7a5a66]">
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
