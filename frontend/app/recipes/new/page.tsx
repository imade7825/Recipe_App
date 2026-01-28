"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

//Hilfsfunktion: Token aus localStorage holen
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export default function NewRecipe() {
  const router = useRouter();

  //Form State: hier speichern wir die Eingaben des Users
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructions: "",
    durationMinutes: "20",
    imageUrl: "",
  });

  //UX States: Ladezustand + Fehleranzeige
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //Token prüfen: ohne Login darf man nicht erstellen
  const token = getToken();
  if (!token) {
    //Wenn kein Token existiert -> zum Login schicken
    router.push("/login");
    return null;
  }

  //Kleine Helper-Funktion: Input-Felder updaten
  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  //Submit Handler: POST ans Backend
  async function onCreate() {
    setErrorMessage(null);

    //Minimale Validierung (damit wir nicht kaputte Daten senden)
    if (form.title.trim() === "") {
      setErrorMessage("Title is required.");
      return;
    }

    const durationNum = Number(form.durationMinutes);
    if (Number.isNaN(durationNum) || durationNum <= 0) {
      setErrorMessage("Duration must be a positive number.");
      return;
    }

    setIsSaving(true);

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

      const res = await fetch(`${apiBaseUrl}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //JWT Token mitsenden -> Backend kann prüfen ob User eingeloggt ist
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          instructions: form.instructions.trim(),
          durationMinutes: durationNum,
          imageUrl: form.imageUrl.trim() === "" ? null : form.imageUrl.trim(),
        }),
      });

      //Wenn Token ungültig/abgelaufen -> ausloggen + login page
      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Create failed");
      }

      //Backend gibt das neu erstellte Rezept zurück (inkl. id)
      const created = await res.json();

      //Nach Erfolg -> auf Detailseite navigieren
      router.push(`/recipes/${created.id}`);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Unknown error during create");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-2xl p-4 md:p-8 space-y-6">
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
            <label className="text-sm text-slate-300">Duration (minutes)</label>
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
    </main>
  );
}
