import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import Spinner from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import InvitationRenderer from "@/features/templates/InvitationRenderer";
import { cn } from "@/lib/utils";
import { Monitor, Smartphone } from "lucide-react";
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
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );

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
    return <Spinner />;
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

      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <NavBar />

        {/* Toolbar */}
        <div className="w-full mx-auto shrink-0   gap-4  py-3 border-b">
          <div className="max-w-6xl w-full mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 min-w-0 w-full">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap"
              >
                ← Dashboard
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-sm truncate">Edytor zaproszenia</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-gray-400">
                {saveStatus === "saving" && "Zapisywanie…"}
                {saveStatus === "saved" && "Zapisano"}
                {saveStatus === "error" && (
                  <span className="text-red-500">Błąd zapisu</span>
                )}
              </span>
              {/* <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/dashboard/events/${id}/preview`)}
              >
                Pełny podgląd →
              </Button> */}
            </div>
          </div>
        </div>

        {/* Two-column editor */}
        <div className="flex flex-1 min-h-0">
          {/* Form column */}
          <div className="w-1/2 overflow-y-auto scrollbar-none border-r">
            <div className="px-6 py-8 space-y-6 max-w-[630px] mx-auto">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addScheduleItem}
                    >
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
                      <div key={i} className="space-y-2 border rounded-3xl p-3">
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
                      <span
                        className={`text-sm  ${config.sections[key] ? "text-neutral-900" : "text-gray-400"}`}
                      >
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
                          config.sections[key]
                            ? "bg-neutral-900"
                            : "bg-gray-200"
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
                    <p className="text-sm text-neutral-900 font-medium">
                      {config.template?.key === "modern"
                        ? "Nowoczesny"
                        : "Klasyczny"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
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
            </div>
          </div>

          {/* Live preview column */}
          <div className="w-1/2 flex flex-col min-h-0 bg-gray-50">
            <div className="shrink-0 flex items-center justify-between border-b px-4 py-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Podgląd na żywo
              </p>
              <div className="flex items-center gap-0.5 rounded-lg border p-0.5 bg-white">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  aria-label="Podgląd desktop"
                  aria-pressed={previewMode === "desktop"}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    previewMode === "desktop"
                      ? "bg-neutral-900 text-white"
                      : "text-gray-400 hover:text-gray-600",
                  )}
                >
                  <Monitor className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  aria-label="Podgląd mobile"
                  aria-pressed={previewMode === "mobile"}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    previewMode === "mobile"
                      ? "bg-neutral-900 text-white"
                      : "text-gray-400 hover:text-gray-600",
                  )}
                >
                  <Smartphone className="size-4" />
                </button>
              </div>
            </div>
            <div
              className={cn(
                "flex-1 min-h-0",
                previewMode === "mobile"
                  ? "flex flex-col items-center py-6 px-4"
                  : "overflow-y-auto",
              )}
            >
              {previewMode === "mobile" ? (
                <div className="w-[390px] flex-1 min-h-0 overflow-y-auto scrollbar-none rounded-3xl border bg-white shadow-lg">
                  <InvitationRenderer
                    templateKey={config.template?.key ?? "classic"}
                    config={config}
                  />
                </div>
              ) : (
                <InvitationRenderer
                  templateKey={config.template?.key ?? "classic"}
                  config={config}
                />
              )}
            </div>
          </div>
        </div>
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
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
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}
