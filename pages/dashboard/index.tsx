import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { InvitationConfig } from "@/lib/invitation-config";

interface Reservation {
  id: string;
  slug: string;
  status: string;
  created_at: string;
}

interface EventDraftSummary {
  config: InvitationConfig;
  version: number;
  updated_at: string;
}

interface Event {
  id: string;
  type: string;
  slug: string;
  status: string;
  event_date: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  event_drafts: EventDraftSummary[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      await fetchData(user.id);
      setLoading(false);
    };

    const fetchData = async (userId: string) => {
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        if (!token) {
          setError("Nie jesteś zalogowany");
          return;
        }

        // Fetch reservation
        const resRes = await fetch("/api/get-reservation", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resRes.ok) {
          const { reservation } = await resRes.json();
          setReservation(reservation);
        }

        // Fetch events
        const eventsRes = await fetch("/api/get-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (eventsRes.ok) {
          const { events } = await eventsRes.json();
          setEvents(events);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Nie udało się załadować danych");
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleCreateWedding = () => {
    router.push("/dashboard/events/new");
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Head>
        <title>Dashboard — Nasz Dzień</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold font-serif mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Zalogowany jako: <strong>{user?.email}</strong>
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Wyloguj się
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
              {error}
            </div>
          )}

          {/* Reservation section */}
          {reservation && (
            <Card className="mb-8">
              <CardContent>
                <h2 className="text-sm font-medium text-gray-600 mb-1">
                  Twoja subdomena
                </h2>
                <p className="text-2xl font-semibold font-serif">
                  {reservation.slug}.twojadomena.pl
                </p>
              </CardContent>
            </Card>
          )}

          {/* Events section */}
          <div>
            {events.length === 0 ? (
              <Card>
                <CardContent className="pt-8 text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    Nie utworzyłeś jeszcze wesela
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Zacznij od utworzenia swojego pierwszego wesela.
                  </p>
                  <Button onClick={handleCreateWedding} size="lg">
                    Utwórz wesele
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div>
                <h2 className="text-3xl font-serif font-semibold mb-4">
                  Twoje wesela
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => {
                    const draft = event.event_drafts?.[0];
                    const couple = draft?.config?.couple;
                    const coupleTitle =
                      couple?.person1 && couple?.person2
                        ? `${couple.person1} & ${couple.person2}`
                        : "Wesele";
                    return (
                      <Card key={event.id}>
                        <CardContent>
                          <CardTitle className="text-lg mb-1 line-clamp-1">
                            {coupleTitle}
                          </CardTitle>
                          {event.event_date && (
                            <p className="text-sm text-gray-600 mb-2">
                              {new Date(event.event_date).toLocaleDateString(
                                "pl-PL",
                              )}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mb-4">
                            {event.slug}.twojadomena.pl
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() =>
                                router.push(
                                  `/dashboard/events/${event.id}/edit?tab=motyw`,
                                )
                              }
                            >
                              Edytuj
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Goście
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Otwórz
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
