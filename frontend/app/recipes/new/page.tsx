"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Hilfsfunktion: Token aus localStorage holen
function getToken(): string | null {
  // Wenn wir auf dem Server wären, gibt es kein localStorage
  if (typeof window === "undefined") return null;

  // Token aus dem Browser-Speicher lesen
  return localStorage.getItem("accessToken");
}

export default function NewRecipe() {
  const router = useRouter();

  // Form State: hier speichern wir die Eingaben des Users
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructions: "",
    durationMinutes: "20",
    imageUrl: "",
  });

  // UX States: Ladezustand + Fehleranzeige
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Token prüfen: ohne Login darf man nicht erstellen
  const token = getToken();
  if (!token) {
    // Wenn kein Token existiert -> zum Login schicken
    router.push("/login");
    return null;
  }

  // Helper: Input-Felder updaten
  function updateField(key: keyof typeof form, value: string) {
    // Wir kopieren das vorherige Objekt und überschreiben nur das Feld "key"
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Submit Handler: POST ans Backend
  async function onCreate() {
    // Vorherige Fehlermeldung löschen
    setErrorMessage(null);

    // Minimale Validierung: Title muss gesetzt sein
    if (form.title.trim() === "") {
      setErrorMessage("Title is required.");
      return;
    }

    // Dauer muss eine positive Zahl sein
    const durationNum = Number(form.durationMinutes);
    if (Number.isNaN(durationNum) || durationNum <= 0) {
      setErrorMessage("Duration must be a positive number.");
      return;
    }

    // UI in "Saving"-Zustand setzen
    setIsSaving(true);

    try {
      // Base URL vom Backend (Env oder localhost fallback)
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

      // POST Request ans Backend
      const res = await fetch(`${apiBaseUrl}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // JWT Token mitsenden -> Backend prüft Auth
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          instructions: form.instructions.trim(),
          durationMinutes: durationNum,
          // leeres Feld -> null (sauber im Backend)
          imageUrl: form.imageUrl.trim() === "" ? null : form.imageUrl.trim(),
        }),
      });

      // Token ungültig/abgelaufen -> ausloggen + login page
      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        router.push("/login");
        return;
      }

      // andere HTTP Fehler
      if (!res.ok) {
        throw new Error("Create failed");
      }

      // Backend gibt neu erstelltes Rezept zurück (inkl. id)
      const created = await res.json();

      // Nach Erfolg -> auf Detailseite navigieren
      router.push(`/recipes/${created.id}`);

      // Optional: refresh, damit Server Components up-to-date sind
      router.refresh();
    } catch (err: any) {
      // Fehlertext anzeigen (oder fallback)
      setErrorMessage(err?.message ?? "Unknown error during create");
    } finally {
      // Saving Zustand wieder beenden
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      {/*
        WICHTIG (Layout-Fix):
        - Navbar läuft bei dir mit max-w-6xl + px-4/md:px-8
        - Damit Recipes/Logout optisch NICHT "weiter rechts" sind,
          muss diese Seite denselben Container benutzen.
        - Zusätzlich nutzen wir rechts einen leeren 320px Spacer,
          wie auf der Recipes-Seite, damit die "rechte Kante" gleich wirkt.
      */}
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-8 md:py-8">
        {/* Desktop Grid: links Inhalt, rechts nur Spacer (wie RecipesPage) */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* =======================
              LEFT COLUMN (Inhalt)
             ======================= */}
          <div className="space-y-6">
            {/* Header */}
            <header className="space-y-2">
              <h1 className="text-3xl font-bold">New Recipe</h1>
              <p className="text-slate-300">
                Erstelle ein neues Rezept und speichere es im Backend.
              </p>
            </header>

            {/* Fehlerbox */}
            {errorMessage && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
                <p className="font-semibold">Create failed</p>
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Formular */}
            <div className="space-y-4 rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-300">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full rounded-xl bg-slate-900/60 p-3 outline-none ring-1 ring-slate-700"
                  placeholder="e.g. Tomato Pasta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-slate-300">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full min-h-[90px] rounded-xl bg-slate-900/60 p-3 outline-none ring-1 ring-slate-700"
                  placeholder="Short summary..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-slate-300">Instructions</label>
                <textarea
                  value={form.instructions}
                  onChange={(e) => updateField("instructions", e.target.value)}
                  className="w-full min-h-[140px] rounded-xl bg-slate-900/60 p-3 outline-none ring-1 ring-slate-700"
                  placeholder="Steps..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-slate-300">
                  Duration (minutes)
                </label>
                <input
                  value={form.durationMinutes}
                  onChange={(e) => updateField("durationMinutes", e.target.value)}
                  className="w-full rounded-xl bg-slate-900/60 p-3 outline-none ring-1 ring-slate-700"
                  placeholder="20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-slate-300">
                  Image URL (optional)
                </label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => updateField("imageUrl", e.target.value)}
                  className="w-full rounded-xl bg-slate-900/60 p-3 outline-none ring-1 ring-slate-700"
                  placeholder="https://..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={onCreate}
                  disabled={isSaving}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Create"}
                </button>

                <button
                  onClick={() => router.push("/recipes")}
                  disabled={isSaving}
                  className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* =======================
              RIGHT COLUMN (Spacer)
              -> absichtlich leer, damit rechts "Luft" bleibt
              -> dadurch passt die rechte Kante zur RecipesPage
             ======================= */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </main>
  );
}
