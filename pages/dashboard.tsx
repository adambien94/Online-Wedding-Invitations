import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Ładowanie...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard — Nasz Dzień</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <NavBar />

        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold font-serif mb-2">Dashboard</h1>
              <p className="text-gray-600">
                Zalogowany jako: <strong>{user?.email}</strong>
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Wyloguj się
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Witaj na swoim dashboardzie!
            </h2>
            <p className="text-gray-600 mb-6">
              Sprint 1 — Podstawowa autentykacja działa.
            </p>
            <p className="text-sm text-gray-500">
              W następnych sprintach będą tu: wybór subdomeny, tworzenie eventów
              i edytor.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
