// Seite: /recipes
//Diese Seite lädt alle Rezepte aus dem NestJS-Backend
//und zeigt sie als einfache Kartenliste + Search/Filter UI

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Category = { id: number; name: string };

type Recipe = {
  id: number;
  title: string;
  description: string;
  instructions: string;
  durationMinutes: number;
  imageUrl: string | null;
  categories: Category[];
};

//Kleiner Hook, um Eingaben zu "entprellen" (debounce):
//Wert wird erst nach delay ms aktualisiert > verhindert zu viele Requests
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
  return debounced;
}

//Hilfsfunktion holt Rezepte vom Backend
async function fetchRecipes(filters: {
  search?: string;
  category?: string;
  maxDuration?: number;
}): Promise<Recipe[]> {
  //Basis-URL aus der env.local lesen
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  //Query-String sauber bauen (nur Parameter setzen, die wirklich existieren)
  const params = new URLSearchParams();
  if (filters.search && filters.search.trim() !== "") {
    params.set("search", filters.search.trim());
  }
  if (filters.category && filters.category.trim() !== "") {
    params.set("category", filters.category.trim());
  }
  if (
    typeof filters.maxDuration == "number" &&
    !Number.isNaN(filters.maxDuration)
  ) {
    params.set("maxDuration", String(filters.maxDuration));
  }

  const queryString = params.toString();
  const url = `${baseUrl}/recipes${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    //Kein Caching, damit immer die aktuellen Daten bekommen})
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Loading error");
  }
  return response.json();
}

//Server Component(async), damit wir direkt auf dem Server fetchen können
export default function RecipesPage() {
  //UI-State für Search/Filter
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxDuration, setMaxDuration] = useState<number | undefined>(undefined);

  //Daten-State
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //Search entprellen, damit nicht jeder Tastendruck fetch auslöst
  const debouncedSearch = useDebouncedValue(search, 400);

  //Filter-Objekt, das wir an fetchRecipes geben
  const filters = useMemo(() => {
    return {
      search: debouncedSearch,
      category,
      maxDuration,
    };
  }, [debouncedSearch, category, maxDuration]);

  //Immer wenn Filter sich ändert > neue Rezepte laden
  useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const data = await fetchRecipes(filters);
        setRecipes(data);
      } catch (error: any) {
        setErrorMessage(error?.message ?? "Unknown error by loading");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-5xl p-4 md:p-8 space-y-6">
        {/* Kopfbereich der Seite */}
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Rezepte</h1>
          
          <Link
            href="/recipes/new"
            className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
          >
            + New Recipe
          </Link>
        </header>

        {/*Ticket 10: Search & Filter UI */}
        <section className="grid gap-4 rounded-2xl bg-slate-800/70 p-4 md:grid-cols-3">
          {/* Suche */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Suche (Titel / Beschreibung)
            </label>
            <input
              type="text"
              placeholder="z.B. Pasta, Curry..."
              className="w-full rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Kategorie */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Kategorie
            </label>
            <input
              type="text"
              placeholder="z.B. Quick, Vegan..."
              className="w-full rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            {/* Coach-Hinweis:
                Später können wir daraus ein Dropdown machen,
                sobald du Kategorien dynamisch aus dem Backend lädst. */}
          </div>

          {/* maxDuration */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Max. Dauer (Minuten)
            </label>
            <input
              type="number"
              min={0}
              placeholder="z.B. 20"
              className="w-full rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={maxDuration ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setMaxDuration(undefined);
                  return;
                }
                const num = Number(val);
                setMaxDuration(Number.isNaN(num) ? undefined : num);
              }}
            />
          </div>
        </section>

        {/* Statuszeile */}
        <div className="text-sm text-slate-300">
          {loading ? "Lade Rezepte..." : `${recipes.length} Rezepte gefunden`}
        </div>

        {/* Fehlermeldung, falls das Backend nicht erreichbar ist */}
        {errorMessage && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
            <p className="font-semibold">Fehler beim Laden der Rezepte</p>
            <p>{errorMessage}</p>
            <p className="mt-2 text-xs text-red-200">
              Läuft dein Backend unter http://localhost:3000?
            </p>
          </div>
        )}

        {/* Hinweis, falls (noch) keine Rezepte da sind */}
        {!errorMessage && !loading && recipes.length === 0 && (
          <p className="text-slate-400">Keine passenden Rezepte gefunden.</p>
        )}

        {/* Grid mit Rezeptkarten */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="flex flex-col overflow-hidden rounded-2xl bg-slate-800/80 shadow-lg shadow-black/30 border border-slate-700/60 hover:border-emerald-500/60 transition"
            >
              {/* Bildbereich (falls vorhanden) */}
              {recipe.imageUrl && (
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Textbereich */}
              <div className="flex flex-1 flex-col p-4 space-y-2">
                <h2 className="text-lg font-semibold">{recipe.title}</h2>

                <p className="text-sm text-slate-300 line-clamp-2">
                  {recipe.description}
                </p>

                {/* Fußzeile der Karte: Dauer + Kategorien */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="inline-flex items-center rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-200">
                    ⏱ {recipe.durationMinutes} min
                  </span>

                  <div className="flex flex-wrap gap-1">
                    {recipe.categories?.map((cat) => (
                      <span
                        key={cat.id}
                        className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-[11px] text-emerald-300"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
