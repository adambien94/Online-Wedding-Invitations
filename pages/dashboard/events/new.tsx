import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NavBar from "@/components/NavBar";
import Spinner from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Reservation {
  id: string;
  slug: string;
  status: string;
}

export default function NewEventPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [person1, setPerson1] = useState("");
  const [person2, setPerson2] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) {
        setError("Brak sesji");
        setLoading(false);
        return;
      }

      const resRes = await fetch("/api/get-reservation", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resRes.ok) {
        const { reservation } = await resRes.json();
        if (!reservation || reservation.status !== "reserved") {
          setError(
            "Nie masz aktywnej rezerwacji subdomeny. Wróć do dashboardu i zarezerwuj subdomenę.",
          );
        } else {
          setReservation(reservation);
        }
      } else {
        setError("Nie udało się załadować rezerwacji");
      }

      setLoading(false);
    };

    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) return;

    setSubmitting(true);
    setError(null);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Brak sesji");

      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          person1,
          person2,
          eventDate: eventDate || null,
          eventTime: eventTime || null,
          reservationId: reservation.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Coś poszło nie tak");
        return;
      }

      router.push(`/dashboard/events/${data.event.id}/edit?tab=motyw`);
    } catch (err: any) {
      setError(err.message ?? "Błąd sieci");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Head>
        <title>Utwórz wesele — Nasz Dzień</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <NavBar />

        <main className="max-w-lg mx-auto px-4 py-12 sm:px-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
          >
            ← Dashboard
          </button>

          <h1 className="text-4xl font-bold font-serif mb-2">Utwórz wesele</h1>

          {reservation && (
            <p className="text-sm text-gray-500 mb-8">
              Subdomena:{" "}
              <span className="font-medium text-gray-700">
                {reservation.slug}.twojadomena.pl
              </span>
            </p>
          )}

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="person1">Imię pierwszej osoby *</Label>
                <Input
                  id="person1"
                  placeholder="np. Anna"
                  value={person1}
                  onChange={(e) => setPerson1(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="person2">Imię drugiej osoby *</Label>
                <Input
                  id="person2"
                  placeholder="np. Marek"
                  value={person2}
                  onChange={(e) => setPerson2(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDate">Data wesela</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventTime">
                  Godzina{" "}
                  <span className="text-gray-400 font-normal">
                    (opcjonalnie)
                  </span>
                </Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Tworzenie..." : "Utwórz wesele"}
              </Button>
            </form>
          )}
        </main>
      </div>
    </>
  );
}
