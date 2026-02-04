"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  // Token state: bestimmt, ob Login/Register oder Logout gezeigt wird
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 1) Beim Start Token aus localStorage lesen
    setToken(localStorage.getItem("accessToken"));

    // 2) Handler: Token neu einlesen, wenn sich Auth ändert
    const handleAuthChanged = () => {
      setToken(localStorage.getItem("accessToken"));
    };

    // 3) Custom Event (für gleiche Seite / gleichen Tab)
    window.addEventListener("authChanged", handleAuthChanged);

    // 4) storage Event (für andere Tabs)
    window.addEventListener("storage", handleAuthChanged);

    // Cleanup
    return () => {
      window.removeEventListener("authChanged", handleAuthChanged);
      window.removeEventListener("storage", handleAuthChanged);
    };
  }, []);

  function logout() {
    // Token löschen
    localStorage.removeItem("accessToken");

    // Navbar sofort updaten (ohne Refresh)
    window.dispatchEvent(new Event("authChanged"));

    // Weiterleitung zum Login
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      {/* Gleicher Container wie deine Recipes-Page */}
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-8">
        {/*
          Desktop-Grid wie in der Page:
          - Spalte 1: 1fr (Content)
          - Spalte 2: 320px (Spacer)
        */}
        <div className="grid items-center lg:grid-cols-[1fr_320px]">
          {/*
            ✅ WICHTIG:
            Wir packen Logo + Navigation zusammen in Spalte 1
            und machen dort "justify-between".
            Dadurch sitzt Navigation NICHT in der 320px-Spalte,
            sondern endet an der rechten Kante der 1fr-Spalte
            (gleiche Kante wie Ingredients / max.Dauer).
          */}
          <div className="flex items-center justify-between">
            {/* Links: Logo */}
            <Link href="/recipes" className="text-lg font-bold text-slate-100">
              Recipe App
            </Link>

            {/* Rechts: Nav-Buttons (aber innerhalb Spalte 1) */}
            <nav className="flex items-center gap-3 text-sm">
              {!token ? (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white hover:bg-emerald-500"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/recipes"
                    className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700"
                  >
                    Recipes
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-lg bg-red-600/80 px-3 py-2 font-semibold text-white hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Spalte 2 bleibt absichtlich leer (Spacer) */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </header>
  );
}
