import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { templateRegistry } from "@/features/templates/registry";
import type { InvitationConfig } from "@/lib/invitation-config";

export default function ChooseTemplatePage() {
  const router = useRouter();
  const { id, from } = router.query as { id: string; from?: string };
  const backPath =
    from === "preview"
      ? `/dashboard/events/${id}/preview`
      : `/dashboard/events/${id}/edit`;
  const supabase = createClient();

  const [config, setConfig] = useState<InvitationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const chooseTemplate = async (key: string, version: number) => {
    if (!config) return;
    setSaving(key);

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
      router.push(backPath);
    } catch {
      setError("Błąd zapisu — spróbuj ponownie");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Ładowanie…</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error ?? "Nieznany błąd"}</p>
      </div>
    );
  }

  const currentKey = config.template?.key ?? "classic";

  return (
    <>
      <Head>
        <title>Wybierz szablon — Nasz Dzień</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <NavBar />

        <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6">
          {/* Header */}
          <div className="mb-10 flex items-center gap-3">
            <button
              onClick={() => router.push(backPath)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {from === "preview" ? "← Podgląd" : "← Edytor"}
            </button>
            <span className="text-gray-300">/</span>
            <h1 className="text-sm">Wybierz szablon</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {templateRegistry.map((tmpl) => {
              const isActive = currentKey === tmpl.key;
              const isSaving = saving === tmpl.key;

              return (
                <div
                  key={tmpl.key}
                  className={`bg-white shadow-md rounded-xl border overflow-hidden flex flex-col transition-all ${
                    isActive ? "" : "hover:shadow-lg"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-4/3 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <TemplateThumbnail tmplKey={tmpl.key} config={config} />
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col gap-3 flex-1 border-t">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-gray-900">
                        {tmpl.name}
                      </h2>
                      {isActive && (
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                          Aktywny
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 flex-1 pb-2">
                      {tmpl.description}
                    </p>
                    <Button
                      size="sm"
                      disabled={isActive || isSaving}
                      className={isActive ? "hidden" : ""}
                      variant="outline"
                      onClick={() =>
                        !isActive && chooseTemplate(tmpl.key, tmpl.version)
                      }
                    >
                      {isSaving
                        ? "Zapisywanie…"
                        : isActive
                          ? "Wybrany"
                          : "Wybierz"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}

/** Mini-podgląd szablonu — skalowany render w iframe-like div */
function TemplateThumbnail({
  tmplKey,
  config,
}: {
  tmplKey: string;
  config: InvitationConfig;
}) {
  const entry = templateRegistry.find((t) => t.key === tmplKey);
  if (!entry) return null;
  const Component = entry.component;

  return (
    <div className="w-full h-full relative overflow-hidden pointer-events-none select-none">
      <div
        className="absolute origin-top-left"
        style={{ transform: "scale(0.3)", width: "333%", height: "333%" }}
      >
        <Component config={config} />
      </div>
    </div>
  );
}
