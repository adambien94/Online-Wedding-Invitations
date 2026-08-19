import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Spinner from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import InvitationRenderer from "@/features/templates/InvitationRenderer";
import type { InvitationConfig } from "@/lib/invitation-config";

export default function PreviewPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const supabase = createClient();

  const [config, setConfig] = useState<InvitationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

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

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Brak sesji");

      const res = await fetch(`/api/events/${id}/publish`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Błąd publikacji");

      router.push(`/dashboard/events/${id}`);
    } catch {
      setError("Błąd publikacji — spróbuj ponownie");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error ?? "Nieznany błąd"}</p>
      </div>
    );
  }

  const templateKey = config.template?.key ?? "classic";

  return (
    <>
      <Head>
        <title>Podgląd zaproszenia — Nasz Dzień</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />

        {/* Toolbar */}

        <div className="max-w-4xl w-full mx-auto flex items-center justify-between gap-3 py-10 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push(`/dashboard/events/${id}/edit`)}
              className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap"
            >
              ← Edycja
            </button>
            <span className="text-gray-300 hidden sm:block">/</span>
            <span className="text-sm font-medium text-gray-700 hidden sm:block truncate">
              Podgląd
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/events/${id}/template?from=preview`)
              }
            >
              Zmień szablon
            </Button>
            <Button size="sm" disabled={publishing} onClick={handlePublish}>
              {publishing ? "Publikowanie…" : "Opublikuj"}
            </Button>
          </div>
        </div>

        {/* Invitation preview */}
        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 mb-10">
          <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden ring-1 ring-gray-200 ">
            <InvitationRenderer templateKey={templateKey} config={config} />
          </div>
        </main>
      </div>
    </>
  );
}
