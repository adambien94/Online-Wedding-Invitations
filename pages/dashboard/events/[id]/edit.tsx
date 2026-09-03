import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/Spinner";
import SectionEditorCard from "@/components/dashboard/SectionEditorCard";
import TemplatePicker from "@/components/dashboard/TemplatePicker";
import { createClient } from "@/lib/supabase/client";
import InvitationRenderer from "@/features/templates/InvitationRenderer";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  CircleHelp,
  Clock3,
  Heart,
  ImageIcon,
  LayoutGrid,
  MapPin,
  Monitor,
  Paintbrush,
  Settings,
  Smartphone,
  Users,
} from "lucide-react";
import type {
  InvitationConfig,
  ScheduleItem,
  FaqItem,
} from "@/lib/invitation-config";

type SectionId =
  | "couple"
  | "event"
  | "hero"
  | "locations"
  | "schedule"
  | "faq"
  | "rsvp";

const AUTOSAVE_DELAY = 1200;

type WorkspaceTab = "motyw" | "sekcje" | "publikacja";

const TABS: {
  id: WorkspaceTab;
  label: string;
  icon: typeof Paintbrush;
}[] = [
  { id: "motyw", label: "Motyw", icon: Paintbrush },
  { id: "sekcje", label: "Sekcje", icon: LayoutGrid },
  { id: "publikacja", label: "Publikacja", icon: Settings },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function parseTab(value: unknown): WorkspaceTab | null {
  if (value === "motyw" || value === "sekcje" || value === "publikacja") {
    return value;
  }
  return null;
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
  const [savingTemplate, setSavingTemplate] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("motyw");
  const [expandedSection, setExpandedSection] = useState<SectionId | null>(
    "couple",
  );

  const isFirstLoad = useRef(true);
  const tabInitialized = useRef(false);
  const updatingUrl = useRef(false);
  const debouncedConfig = useDebounce(config, AUTOSAVE_DELAY);

  const hasTemplate = Boolean(config?.template?.key);

  const setTab = useCallback(
    (tab: WorkspaceTab) => {
      if (!id) return;
      setActiveTab(tab);
      const nextUrl = `/dashboard/events/${id}/edit?tab=${tab}`;
      if (router.asPath === nextUrl) return;
      updatingUrl.current = true;
      router.replace(nextUrl, undefined, { shallow: true }).finally(() => {
        updatingUrl.current = false;
      });
    },
    [id, router],
  );

  // Read initial tab from URL once data is ready
  useEffect(() => {
    if (!router.isReady || !config || tabInitialized.current) return;
    tabInitialized.current = true;

    const fromQuery = parseTab(router.query.tab);
    if (
      fromQuery &&
      !(
        (fromQuery === "sekcje" || fromQuery === "publikacja") &&
        !config.template?.key
      )
    ) {
      setActiveTab(fromQuery);
      return;
    }

    setTab("motyw");
  }, [router.isReady, config, setTab]);

  // Browser back/forward only — ignore our own shallow URL writes
  useEffect(() => {
    const onRoute = (url: string) => {
      if (updatingUrl.current) return;
      const match = url.match(/[?&]tab=([^&]+)/);
      const fromQuery = parseTab(match?.[1] ?? null);
      if (!fromQuery) return;
      if (
        (fromQuery === "sekcje" || fromQuery === "publikacja") &&
        !hasTemplate
      ) {
        setTab("motyw");
        return;
      }
      setActiveTab(fromQuery);
    };

    router.events.on("routeChangeComplete", onRoute);
    return () => router.events.off("routeChangeComplete", onRoute);
  }, [router.events, hasTemplate, setTab]);

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

  const toggleExpanded = (id: SectionId) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  const toggleSectionVisibility = (
    key: keyof InvitationConfig["sections"],
    visible: boolean,
  ) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            sections: { ...prev.sections, [key]: visible },
          }
        : prev,
    );
  };

  const chooseTemplate = async (key: string, version: number) => {
    if (!config || !id) return;
    setSavingTemplate(key);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Brak sesji");

      const updatedConfig: InvitationConfig = {
        ...config,
        template: { key, version },
      };

      const res = await fetch(`/api/events/${id}/draft`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ config: updatedConfig }),
      });

      if (!res.ok) throw new Error("Błąd zapisu");

      setConfig(updatedConfig);
      // Avoid autosave treating this as a dirty first edit
      isFirstLoad.current = true;
      setTab("sekcje");
    } catch {
      setError("Błąd zapisu — spróbuj ponownie");
    } finally {
      setSavingTemplate(null);
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    setPublishing(true);
    setPublishSuccess(false);
    setError(null);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Brak sesji");

      const res = await fetch(`/api/events/${id}/publish`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Błąd publikacji");
      setPublishSuccess(true);
    } catch {
      setError("Błąd publikacji — spróbuj ponownie");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error && !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Nieznany błąd</div>
      </div>
    );
  }

  const templateKey = config.template?.key || "classic";

  return (
    <>
      <Head>
        <title>Edytor zaproszenia — Nasz Dzień</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="h-screen flex flex-col overflow-hidden bg-mauve-100">
        {/* Shared header + tabs */}
        <div className="shrink-0 bg-white">
          <div className="max-w-[1440px] w-full mx-auto px-4 py-4 pb-0 sm:px-6 lg:px-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl italic font-serif mb-2 text-neutral-900">
                  Weseleo.
                </h1>
                {/* <p className="text-sm text-muted-foreground">
                  Zarządzaj swoją stroną ślubną
                </p> */}
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                ← Powrót
              </Button>
            </div>

            <nav className="flex gap-6" aria-label="Kroki edycji">
              {TABS.map(({ id: tabId, label, icon: Icon }) => {
                const locked =
                  (tabId === "sekcje" || tabId === "publikacja") &&
                  !hasTemplate;
                const isActive = activeTab === tabId;

                return (
                  <button
                    key={tabId}
                    type="button"
                    disabled={locked}
                    onClick={() => !locked && setTab(tabId)}
                    className={cn(
                      "flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors pr-1",
                      isActive
                        ? "border-neutral-900 text-neutral-900"
                        : "border-transparent text-muted-foreground hover:text-neutral-700",
                      locked &&
                        "opacity-40 cursor-not-allowed hover:text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {error && (
          <div className="mx-auto max-w-[1440px] w-full px-4 pt-4 sm:px-6 lg:px-8 shrink-0">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div
          className={cn(
            "flex-1 min-h-0 overflow-y-auto",
            activeTab === "motyw" ? "block" : "hidden",
          )}
          aria-hidden={activeTab !== "motyw"}
        >
          <TemplatePicker
            config={config}
            savingKey={savingTemplate}
            onChoose={chooseTemplate}
          />
        </div>

        <div
          className={cn(
            "flex-1 min-h-0 w-full",
            activeTab === "sekcje" ? "flex" : "hidden",
          )}
          aria-hidden={activeTab !== "sekcje"}
        >
          {/* Form drawer — white extends to viewport left; content aligns with header */}
          <aside className="shrink-0 flex overflow-y-auto scrollbar-none shadow-xl z-10 bg-background">
            <div
              className="shrink-0 w-[max(0px,calc((100vw-1440px)/2))]"
              aria-hidden
            />
            <div className="w-128 px-4 py-8 sm:px-6 lg:px-8 space-y-0">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-neutral-900">
                  Sekcje strony
                </h2>
                <p className="mt-1 text-sm text-neutral-900">
                  Rozwiń sekcję, aby edytować treść. Przełącznikiem włączysz lub
                  ukryjesz ją na stronie.
                </p>
              </div>

              <SectionEditorCard
                title="Para"
                icon={Users}
                open={expandedSection === "couple"}
                onOpenChange={() => toggleExpanded("couple")}
              >
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="couple-person1">Imię pierwszej osoby</Label>
                    <Input
                      id="couple-person1"
                      value={config.couple.person1}
                      onChange={(e) =>
                        updateNested("couple", "person1", e.target.value)
                      }
                      placeholder="np. Anna"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="couple-person2">Imię drugiej osoby</Label>
                    <Input
                      id="couple-person2"
                      value={config.couple.person2}
                      onChange={(e) =>
                        updateNested("couple", "person2", e.target.value)
                      }
                      placeholder="np. Marek"
                    />
                  </div>
                </div>
              </SectionEditorCard>

              <SectionEditorCard
                title="Data"
                icon={CalendarDays}
                open={expandedSection === "event"}
                onOpenChange={() => toggleExpanded("event")}
              >
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Data wesela</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={config.event.date}
                      onChange={(e) =>
                        updateNested("event", "date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Godzina (opcjonalnie)</Label>
                    <Input
                      id="event-time"
                      type="time"
                      value={config.event.time}
                      onChange={(e) =>
                        updateNested("event", "time", e.target.value)
                      }
                    />
                  </div>
                </div>
              </SectionEditorCard>

              <SectionEditorCard
                title="Nagłówek"
                icon={ImageIcon}
                open={expandedSection === "hero"}
                onOpenChange={() => toggleExpanded("hero")}
                visible={config.sections.hero}
                onVisibleChange={(visible) =>
                  toggleSectionVisibility("hero", visible)
                }
              >
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Tytuł</Label>
                    <Input
                      id="hero-title"
                      value={config.hero.title}
                      onChange={(e) =>
                        updateNested("hero", "title", e.target.value)
                      }
                      placeholder="np. Pobieramy się!"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Podtytuł</Label>
                    <Input
                      id="hero-subtitle"
                      value={config.hero.subtitle}
                      onChange={(e) =>
                        updateNested("hero", "subtitle", e.target.value)
                      }
                      placeholder="np. Będzie nam miło świętować razem z Wami"
                    />
                  </div>
                </div>
              </SectionEditorCard>

              <SectionEditorCard
                title="Lokalizacje"
                icon={MapPin}
                open={expandedSection === "locations"}
                onOpenChange={() => toggleExpanded("locations")}
                visible={config.sections.locations}
                onVisibleChange={(visible) =>
                  toggleSectionVisibility("locations", visible)
                }
              >
                <div className="space-y-5">
                  <div className="space-y-5">
                    <p className="text-sm text-neutral-800">Ceremonia</p>
                    <div className="space-y-2">
                      <Label htmlFor="ceremony-name">Nazwa miejsca</Label>
                      <Input
                        id="ceremony-name"
                        value={config.ceremony.name}
                        onChange={(e) =>
                          updateNested("ceremony", "name", e.target.value)
                        }
                        placeholder="np. Kościół Wniebowzięcia NMP"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ceremony-address">Adres</Label>
                      <Input
                        id="ceremony-address"
                        value={config.ceremony.address}
                        onChange={(e) =>
                          updateNested("ceremony", "address", e.target.value)
                        }
                        placeholder="np. ul. Kościelna 1, Kraków"
                      />
                    </div>
                  </div>
                  <div className="space-y-5">
                    <p className="text-sm text-neutral-800">Przyjęcie</p>
                    <div className="space-y-2">
                      <Label htmlFor="reception-name">Nazwa sali</Label>
                      <Input
                        id="reception-name"
                        value={config.reception.name}
                        onChange={(e) =>
                          updateNested("reception", "name", e.target.value)
                        }
                        placeholder="np. Sala Weselna Róża"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reception-address">Adres</Label>
                      <Input
                        id="reception-address"
                        value={config.reception.address}
                        onChange={(e) =>
                          updateNested("reception", "address", e.target.value)
                        }
                        placeholder="np. ul. Parkowa 5, Kraków"
                      />
                    </div>
                  </div>
                </div>
              </SectionEditorCard>

              <SectionEditorCard
                title="Harmonogram"
                icon={Clock3}
                open={expandedSection === "schedule"}
                onOpenChange={() => toggleExpanded("schedule")}
                visible={config.sections.schedule}
                onVisibleChange={(visible) =>
                  toggleSectionVisibility("schedule", visible)
                }
              >
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
                        aria-label={`Godzina pozycji ${i + 1}`}
                      />
                      <Input
                        value={item.label}
                        onChange={(e) =>
                          updateScheduleItem(i, "label", e.target.value)
                        }
                        placeholder="Ceremonia"
                        aria-label={`Opis pozycji ${i + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeScheduleItem(i)}
                        className="mt-2 text-gray-400 hover:text-red-500 text-lg leading-none shrink-0"
                        aria-label="Usuń pozycję harmonogramu"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addScheduleItem}
                  >
                    + Dodaj pozycję
                  </Button>
                </div>
              </SectionEditorCard>

              <SectionEditorCard
                title="FAQ"
                icon={CircleHelp}
                open={expandedSection === "faq"}
                onOpenChange={() => toggleExpanded("faq")}
                visible={config.sections.faq}
                onVisibleChange={(visible) =>
                  toggleSectionVisibility("faq", visible)
                }
              >
                <div className="space-y-4">
                  {config.faq.map((item, i) => (
                    <div key={i} className="space-y-2 rounded-3xl border p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground font-medium">
                          #{i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFaqItem(i)}
                          className="text-gray-400 hover:text-red-500 text-lg leading-none"
                          aria-label="Usuń pytanie FAQ"
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
                        aria-label={`Pytanie ${i + 1}`}
                      />
                      <Input
                        value={item.answer}
                        onChange={(e) =>
                          updateFaqItem(i, "answer", e.target.value)
                        }
                        placeholder="Odpowiedź"
                        aria-label={`Odpowiedź ${i + 1}`}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFaqItem}
                  >
                    + Dodaj pytanie
                  </Button>
                </div>
              </SectionEditorCard>

              <SectionEditorCard
                title="RSVP"
                icon={Heart}
                open={expandedSection === "rsvp"}
                onOpenChange={() => toggleExpanded("rsvp")}
                visible={config.sections.rsvp}
                onVisibleChange={(visible) =>
                  toggleSectionVisibility("rsvp", visible)
                }
              >
                <p className="text-sm text-muted-foreground">
                  Formularz RSVP będzie dostępny w kolejnej wersji. Na razie
                  możesz włączyć lub ukryć tę sekcję na stronie.
                </p>
              </SectionEditorCard>

              {/* <div className="rounded-3xl border border-stone-200/80 bg-white px-4 py-4 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-lg font-semibold text-neutral-900">
                    Szablon
                  </p>
                  <p className="text-sm font-medium">
                    {config.template?.key === "modern"
                      ? "Nowoczesny"
                      : "Klasyczny"}
                  </p>
                  <FieldDescription>
                    Zmień wygląd zaproszenia bez utraty danych
                  </FieldDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTab("motyw")}
                >
                  Zmień szablon
                </Button>
              </div> */}
            </div>
          </aside>

          {/* Live preview panel */}
          <div className="relative flex-1 min-w-0 flex flex-col min-h-0 bg-mauve-100">
            <div className="absolute top-4 right-4 z-10 flex items-center gap-0.5 rounded-lg bg-mauve-100/90 p-0.5 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                aria-label="Podgląd desktop"
                aria-pressed={previewMode === "desktop"}
                className={cn(
                  "rounded-md p-1.5 transition-all",
                  previewMode === "desktop"
                    ? "bg-background text-foreground "
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Monitor className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                aria-label="Podgląd mobile"
                aria-pressed={previewMode === "mobile"}
                className={cn(
                  "rounded-md p-1.5 transition-all",
                  previewMode === "mobile"
                    ? "bg-background text-foreground "
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Smartphone className="size-5" />
              </button>
            </div>
            <div
              className={cn(
                "flex flex-col items-center justify-center p-6 h-full",
                previewMode === "mobile" &&
                  "flex flex-col items-center justify-center p-6 h-full",
              )}
            >
              {previewMode === "mobile" ? (
                <div className="w-[390px] max-h-[790px] flex-1 min-h-0 overflow-y-auto scrollbar-none rounded-4xl border-2 shadow-xl border-neutral-300 ">
                  <InvitationRenderer
                    templateKey={templateKey}
                    config={config}
                  />
                </div>
              ) : (
                <div className="w-9/10 max-h-[90%] flex-1 min-h-0 overflow-y-auto scrollbar-none rounded-xl border-2 shadow-xl border-neutral-300 ">
                  <InvitationRenderer
                    templateKey={templateKey}
                    config={config}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex-1 min-h-0 overflow-y-auto",
            activeTab === "publikacja" ? "block" : "hidden",
          )}
          aria-hidden={activeTab !== "publikacja"}
        >
          <main className="max-w-lg h-3/4 mx-auto px-4 sm:px-6 text-center flex flex-col justify-center items-center">
            <h2 className="text-4xl font-serif font-semibold mb-4">
              Publikacja
            </h2>
            <p className="text-sm text-neutral-900 mb-8">
              Opublikuj stronę, aby była dostępna pod Twoją subdomeną.
            </p>
            <Button
              size="lg"
              className="w-32"
              disabled={publishing}
              onClick={handlePublish}
            >
              {publishing ? "Publikowanie…" : "Publikuj"}
            </Button>
            {publishSuccess && (
              <p className="text-sm text-green-600 mt-4">
                Strona została opublikowana.
              </p>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
