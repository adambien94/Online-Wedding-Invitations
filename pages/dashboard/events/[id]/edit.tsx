import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NavBar from "@/components/NavBar";
import { createClient } from "@/lib/supabase/client";
import type {
  InvitationConfig,
  ScheduleItem,
  FaqItem,
} from "@/lib/invitation-config";

const AUTOSAVE_DELAY = 1200;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function EditEventPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<InvitationConfig | null>(null);

  const isFirstLoad = useRef(true);
  const debouncedConfig = useDebounce(config, AUTOSAVE_DELAY);

  // Load draft on mount
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) {
        setError("Brak sesji");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/events/${id}/draft`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setError("Nie udało się załadować draftu");
        setLoading(false);
        return;
      }

      const { draft } = await res.json();
      setConfig(draft.config as InvitationConfig);
      setLoading(false);
    };

    load();
  }, [id]);

  // Autosave when debouncedConfig changes (skip on first population)
  useEffect(() => {
    if (!debouncedConfig || !id) return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const save = async () => {
      setSaveStatus("saving");
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        if (!token) throw new Error("Brak sesji");

        const res = await fetch(`/api/events/${id}/draft`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ config: debouncedConfig }),
        });

        if (!res.ok) throw new Error("Błąd zapisu");
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    };

    save();
  }, [debouncedConfig]);

  const update = useCallback(
    <K extends keyof InvitationConfig>(
      section: K,
      value: InvitationConfig[K],
    ) => {
      setConfig((prev) => (prev ? { ...prev, [section]: value } : prev));
    },
    [],
  );

  const updateNested = useCallback(
    <K extends keyof InvitationConfig>(
      section: K,
      field: keyof InvitationConfig[K],
      value: string,
    ) => {
      setConfig((prev) =>
        prev
          ? {
              ...prev,
              [section]: { ...(prev[section] as object), [field]: value },
            }
          : prev,
      );
    },
    [],
  );

  // Schedule helpers
  const addScheduleItem = () => {
    setConfig((prev) =>
      prev
        ? { ...prev, schedule: [...prev.schedule, { time: "", label: "" }] }
        : prev,
    );
  };

  const updateScheduleItem = (
    index: number,
    field: keyof ScheduleItem,
    value: string,
  ) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const updated = prev.schedule.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      );
      return { ...prev, schedule: updated };
    });
  };

  const removeScheduleItem = (index: number) => {
    setConfig((prev) =>
      prev
        ? { ...prev, schedule: prev.schedule.filter((_, i) => i !== index) }
        : prev,
    );
  };

  // FAQ helpers
  const addFaqItem = () => {
    setConfig((prev) =>
      prev
        ? { ...prev, faq: [...prev.faq, { question: "", answer: "" }] }
        : prev,
    );
  };

  const updateFaqItem = (
    index: number,
    field: keyof FaqItem,
    value: string,
  ) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const updated = prev.faq.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      );
      return { ...prev, faq: updated };
    });
  };

  const removeFaqItem = (index: number) => {
    setConfig((prev) =>
      prev ? { ...prev, faq: prev.faq.filter((_, i) => i !== index) } : prev,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Ładowanie...</div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error ?? "Nieznany błąd"}</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edytor zaproszenia — Nasz Dzień</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <NavBar />

        <main className="max-w-2xl mx-auto px-4 py-10 sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Dashboard
              </button>
              <span className="text-gray-300">/</span>
              <h1 className="text-xl font-semibold">Edytor zaproszenia</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {saveStatus === "saving" && "Zapisywanie…"}
                {saveStatus === "saved" && "Zapisano"}
                {saveStatus === "error" && (
                  <span className="text-red-500">Błąd zapisu</span>
                )}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/dashboard/events/${id}/preview`)}
              >
                Podgląd →
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Para */}
            <Section title="Para">
              <Field label="Imię pierwszej osoby">
                <Input
                  value={config.couple.person1}
                  onChange={(e) =>
                    updateNested("couple", "person1", e.target.value)
                  }
                  placeholder="np. Anna"
                />
              </Field>
              <Field label="Imię drugiej osoby">
                <Input
                  value={config.couple.person2}
                  onChange={(e) =>
                    updateNested("couple", "person2", e.target.value)
                  }
                  placeholder="np. Marek"
                />
              </Field>
            </Section>

            {/* Data */}
            <Section title="Data">
              <Field label="Data wesela">
                <Input
                  type="date"
                  value={config.event.date}
                  onChange={(e) =>
                    updateNested("event", "date", e.target.value)
                  }
                />
              </Field>
              <Field label="Godzina (opcjonalnie)">
                <Input
                  type="time"
                  value={config.event.time}
                  onChange={(e) =>
                    updateNested("event", "time", e.target.value)
                  }
                />
              </Field>
            </Section>

            {/* Hero */}
            <Section title="Hero">
              <Field label="Tytuł">
                <Input
                  value={config.hero.title}
                  onChange={(e) =>
                    updateNested("hero", "title", e.target.value)
                  }
                  placeholder="np. Pobieramy się!"
                />
              </Field>
              <Field label="Podtytuł">
                <Input
                  value={config.hero.subtitle}
                  onChange={(e) =>
                    updateNested("hero", "subtitle", e.target.value)
                  }
                  placeholder="np. Będzie nam miło świętować razem z Wami"
                />
              </Field>
            </Section>

            {/* Ceremonia */}
            <Section title="Ceremonia">
              <Field label="Nazwa miejsca">
                <Input
                  value={config.ceremony.name}
                  onChange={(e) =>
                    updateNested("ceremony", "name", e.target.value)
                  }
                  placeholder="np. Kościół Wniebowzięcia NMP"
                />
              </Field>
              <Field label="Adres">
                <Input
                  value={config.ceremony.address}
                  onChange={(e) =>
                    updateNested("ceremony", "address", e.target.value)
                  }
                  placeholder="np. ul. Kościelna 1, Kraków"
                />
              </Field>
            </Section>

            {/* Przyjęcie */}
            <Section title="Przyjęcie">
              <Field label="Nazwa sali">
                <Input
                  value={config.reception.name}
                  onChange={(e) =>
                    updateNested("reception", "name", e.target.value)
                  }
                  placeholder="np. Sala Weselna Róża"
                />
              </Field>
              <Field label="Adres">
                <Input
                  value={config.reception.address}
                  onChange={(e) =>
                    updateNested("reception", "address", e.target.value)
                  }
                  placeholder="np. ul. Parkowa 5, Kraków"
                />
              </Field>
            </Section>

            {/* Harmonogram */}
            {config.sections.schedule && (
              <Section title="Harmonogram">
                <div className="space-y-3">
                  {config.schedule.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Input
                        className="w-24 shrink-0"
                        value={item.time}
                        onChange={(e) =>
                          updateScheduleItem(i, "time", e.target.value)
                        }
                        placeholder="15:00"
                      />
                      <Input
                        value={item.label}
                        onChange={(e) =>
                          updateScheduleItem(i, "label", e.target.value)
                        }
                        placeholder="Ceremonia"
                      />
                      <button
                        onClick={() => removeScheduleItem(i)}
                        className="mt-2 text-gray-400 hover:text-red-500 text-lg leading-none shrink-0"
                        aria-label="Usuń"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addScheduleItem}>
                    + Dodaj pozycję
                  </Button>
                </div>
              </Section>
            )}

            {/* FAQ */}
            {config.sections.faq && (
              <Section title="FAQ">
                <div className="space-y-4">
                  {config.faq.map((item, i) => (
                    <div
                      key={i}
                      className="space-y-2 border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">
                          #{i + 1}
                        </span>
                        <button
                          onClick={() => removeFaqItem(i)}
                          className="text-gray-400 hover:text-red-500 text-lg leading-none"
                          aria-label="Usuń"
                        >
                          ×
                        </button>
                      </div>
                      <Input
                        value={item.question}
                        onChange={(e) =>
                          updateFaqItem(i, "question", e.target.value)
                        }
                        placeholder="Pytanie"
                      />
                      <Input
                        value={item.answer}
                        onChange={(e) =>
                          updateFaqItem(i, "answer", e.target.value)
                        }
                        placeholder="Odpowiedź"
                      />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addFaqItem}>
                    + Dodaj pytanie
                  </Button>
                </div>
              </Section>
            )}

            {/* Widoczność sekcji */}
            <Section title="Widoczność sekcji">
              <p className="text-sm text-muted-foreground -mt-1 mb-2">
                Zdecyduj, które sekcje mają pojawić się w zaproszeniu.
              </p>
              <div className="space-y-3">
                {(
                  [
                    { key: "hero", label: "Hero" },
                    {
                      key: "locations",
                      label: "Lokalizacje (ceremonia i przyjęcie)",
                    },
                    { key: "schedule", label: "Harmonogram" },
                    { key: "rsvp", label: "RSVP" },
                    { key: "faq", label: "FAQ" },
                  ] as {
                    key: keyof InvitationConfig["sections"];
                    label: string;
                  }[]
                ).map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <span className="text-sm text-neutral-900 group-hover:text-neutral-900">
                      {label}
                    </span>
                    <button
                      role="switch"
                      aria-checked={config.sections[key]}
                      onClick={() =>
                        update("sections", {
                          ...config.sections,
                          [key]: !config.sections[key],
                        })
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                        config.sections[key] ? "bg-rose-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
                          config.sections[key]
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </Section>

            {/* Template */}
            <Section title="Szablon zaproszenia">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    {config.template?.key === "modern"
                      ? "Nowoczesny"
                      : "Klasyczny"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Zmień wygląd zaproszenia bez utraty danych
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/dashboard/events/${id}/template`)
                  }
                >
                  Zmień szablon
                </Button>
              </div>
            </Section>

            {/* Preview */}
            <Section title="Podgląd treści">
              <ContentPreview config={config} />
            </Section>
          </div>
        </main>
      </div>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold mb-4 text-neutral-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ContentPreview({ config }: { config: InvitationConfig }) {
  const { couple, event, hero, ceremony, reception, schedule, faq, sections } =
    config;
  const coupleTitle =
    couple.person1 && couple.person2
      ? `${couple.person1} & ${couple.person2}`
      : "—";

  return (
    <div className="space-y-5 text-sm text-neutral-700">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
          Para
        </p>
        <p className="text-lg font-serif font-semibold">{coupleTitle}</p>
      </div>
      {(event.date || event.time) && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Data
          </p>
          <p>
            {event.date
              ? new Date(event.date).toLocaleDateString("pl-PL", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
            {event.time && `, godz. ${event.time}`}
          </p>
        </div>
      )}
      {sections.hero && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Hero
          </p>
          <p className="font-medium">{hero.title || "—"}</p>
          {hero.subtitle && <p className="text-gray-500">{hero.subtitle}</p>}
        </div>
      )}
      {sections.locations && (ceremony.name || ceremony.address) && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Ceremonia
          </p>
          {ceremony.name && <p className="font-medium">{ceremony.name}</p>}
          {ceremony.address && (
            <p className="text-gray-500">{ceremony.address}</p>
          )}
        </div>
      )}
      {sections.locations && (reception.name || reception.address) && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Przyjęcie
          </p>
          {reception.name && <p className="font-medium">{reception.name}</p>}
          {reception.address && (
            <p className="text-gray-500">{reception.address}</p>
          )}
        </div>
      )}
      {sections.schedule && schedule.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Harmonogram
          </p>
          <ul className="space-y-1">
            {schedule.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-14 shrink-0 font-mono text-gray-400">
                  {s.time}
                </span>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {sections.faq && faq.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            FAQ
          </p>
          <ul className="space-y-3">
            {faq.map((f, i) => (
              <li key={i}>
                <p className="font-medium">{f.question}</p>
                <p className="text-gray-500">{f.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
