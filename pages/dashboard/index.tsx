import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";

/**
 * Entry point after login/register.
 * Ensures the user has exactly one wedding event, then opens the editor.
 */
export default function DashboardPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const bootstrap = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) {
        setError("Nie jesteś zalogowany");
        return;
      }

      try {
        const eventsRes = await fetch("/api/get-events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!eventsRes.ok) {
          setError("Nie udało się załadować danych");
          return;
        }

        const { events } = await eventsRes.json();

        if (events?.length > 0) {
          router.replace(
            `/dashboard/${events[0].id}?tab=przeglad`,
          );
          return;
        }

        const resRes = await fetch("/api/get-reservation", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resRes.ok) {
          setError("Nie udało się załadować rezerwacji");
          return;
        }

        const { reservation } = await resRes.json();
        if (!reservation || reservation.status !== "reserved") {
          setError(
            "Brak aktywnej rezerwacji subdomeny. Zarejestruj się ponownie lub skontaktuj się z pomocą.",
          );
          return;
        }

        const createRes = await fetch("/api/events/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reservationId: reservation.id }),
        });

        const createData = await createRes.json();
        if (!createRes.ok || !createData.event?.id) {
          setError(createData.message ?? "Nie udało się utworzyć wesela");
          return;
        }

        router.replace(
          `/dashboard/${createData.event.id}?tab=przeglad`,
        );
      } catch (err) {
        console.error("Dashboard bootstrap failed:", err);
        setError("Nie udało się załadować danych");
      }
    };

    bootstrap();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard — Nasz Dzień</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {error ? (
        <div className="min-h-screen flex items-center justify-center px-4">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}
