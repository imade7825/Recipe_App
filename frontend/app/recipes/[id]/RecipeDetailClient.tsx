"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// Typen (wie bei dir)
type Category = { id: number; name: string };
type IngredientLink = {
  id: number;
  recipeId: number;
  ingredientId: number;
  quantity: string;
  unit: string;
};
type Recipe = {
  id: number;
  title: string;
  description: string;
  instructions: string;
  durationMinutes: number;
  imageUrl: string | null;
  categories: Category[];
  ingredients?: IngredientLink[];
};

type Props = {
  initialRecipe: Recipe;
  apiBaseUrl: string;
};

// Hilfsfunktion: Token aus localStorage holen
// (Später können wir das sauberer machen, aber fürs Ticket reicht es.)
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export default function RecipeDetailClient({ initialRecipe, apiBaseUrl }: Props) {
  const router = useRouter();

  // "recipe" ist das, was wir gerade anzeigen (kann nach Save aktualisiert werden)
  const [recipe, setRecipe] = useState<Recipe>(initialRecipe);

  // Edit-Modus an/aus
  const [isEditing, setIsEditing] = useState(false);

  // Form-State (wird nur im Edit Mode benutzt)
  const [form, setForm] = useState({
    title: initialRecipe.title,
    description: initialRecipe.description,
    instructions: initialRecipe.instructions,
    durationMinutes: String(initialRecipe.durationMinutes),
    imageUrl: initialRecipe.imageUrl ?? "",
  });

  // Loading + Error für UX
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Wenn kein Token -> du kannst hier direkt Login erzwingen
  const token = useMemo(() => getToken(), []);
  const isLoggedIn = !!token;

  // Wenn du willst: sofort zurück zum Login, wenn nicht eingeloggt
  // (Alternative wäre: Buttons deaktivieren + Hinweis)
  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-100">
        <p className="font-semibold">Login required</p>
        <p>Bitte einloggen, um Rezepte zu sehen oder zu bearbeiten.</p>
      </div>
    );
  }

  // Hilfsfunktion: Input-Updates
  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Cancel: Form zurücksetzen und Edit-Mode verlassen
  function onCancelEdit() {
    setErrorMessage(null);
    setForm({
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      durationMinutes: String(recipe.durationMinutes),
      imageUrl: recipe.imageUrl ?? "",
    });
    setIsEditing(false);
  }

  // Save: PATCH ans Backend
  async function onSave() {
    setErrorMessage(null);

    // Kleine Validierung, damit wir keine kaputten Daten schicken
    const durationNum = Number(form.durationMinutes);
    if (Number.isNaN(durationNum) || durationNum <= 0) {
      setErrorMessage("durationMinutes must be a positive number.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`${apiBaseUrl}/recipes/${recipe.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          instructions: form.instructions,
          durationMinutes: durationNum,
          imageUrl: form.imageUrl.trim() === "" ? null : form.imageUrl.trim(),
        }),
      });

      if (res.status === 401) {
        // Token ungültig/abgelaufen -> ausloggen
        localStorage.removeItem("accessToken");
        router.push("/login");
        return;
      }

      if (res.status === 404) {
        router.push("/recipes");
        return;
      }

      if (!res.ok) {
        throw new Error("Save failed");
      }

      const updated: Recipe = await res.json();
      setRecipe(updated);
      setIsEditing(false);

      // Optional: router.refresh() damit Server Components neu laden
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Unknown error during save");
    } finally {
      setIsSaving(false);
    }
  }

  // Delete: DELETE ans Backend
  async function onDelete() {
    setErrorMessage(null);

    const ok = confirm("Are you sure you want to delete this recipe?");
    if (!ok) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/recipes/${recipe.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        router.push("/login");
        return;
      }

      if (res.status === 404) {
        router.push("/recipes");
        return;
      }

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      // Nach Delete zurück zur Liste
      router.push("/recipes");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Unknown error during delete");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Fehlerbox */}
      {errorMessage && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
          <p className="font-semibold">Action failed</p>
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600"
          >
            Edit
          </button>
        )}

        {isEditing && (
          <>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={onCancelEdit}
              disabled={isSaving}
              className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600 disabled:opacity-60"
            >
              Cancel
            </button>
          </>
        )}

        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500 disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* Detail Content */}
      <header className="space-y-3">
        {isEditing ? (
          <input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full rounded-xl bg-slate-800 p-3 text-2xl font-bold outline-none ring-1 ring-slate-700"
          />
        ) : (
          <h1 className="text-3xl md:text-4xl font-bold">{recipe.title}</h1>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-slate-100">
            ⏱ {recipe.durationMinutes} min
          </span>

          <div className="flex flex-wrap gap-2">
            {recipe.categories?.map((cat) => (
              <span
                key={cat.id}
                className="rounded-full bg-emerald-600/20 px-3 py-1 text-xs text-emerald-300"
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Image */}
      {(isEditing ? form.imageUrl : recipe.imageUrl) && (
        <div className="overflow-hidden rounded-3xl border border-slate-700/70 shadow-lg shadow-black/40">
          <img
            src={isEditing ? form.imageUrl : recipe.imageUrl ?? ""}
            alt={recipe.title}
            className="h-64 w-full object-cover"
          />
        </div>
      )}

      {/* Image Url in edit mode */}
      {isEditing && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Image URL</h2>
          <input
            value={form.imageUrl}
            onChange={(e) => updateField("imageUrl", e.target.value)}
            className="w-full rounded-xl bg-slate-800 p-3 text-sm outline-none ring-1 ring-slate-700"
            placeholder="https://example.com/image.jpg"
          />
        </section>
      )}

      {/* Beschreibung */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Beschreibung</h2>
        {isEditing ? (
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full min-h-[120px] rounded-xl bg-slate-800 p-3 text-sm outline-none ring-1 ring-slate-700"
          />
        ) : (
          <p className="text-slate-200">{recipe.description}</p>
        )}
      </section>

      {/* Zubereitung */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Zubereitung</h2>
        {isEditing ? (
          <textarea
            value={form.instructions}
            onChange={(e) => updateField("instructions", e.target.value)}
            className="w-full min-h-[180px] rounded-xl bg-slate-800 p-3 text-sm outline-none ring-1 ring-slate-700"
          />
        ) : (
          <p className="whitespace-pre-line text-slate-200">
            {recipe.instructions}
          </p>
        )}
      </section>

      {/* Duration in edit mode */}
      {isEditing && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Duration (minutes)</h2>
          <input
            value={form.durationMinutes}
            onChange={(e) => updateField("durationMinutes", e.target.value)}
            className="w-full rounded-xl bg-slate-800 p-3 text-sm outline-none ring-1 ring-slate-700"
            placeholder="20"
          />
        </section>
      )}
    </div>
  );
}
