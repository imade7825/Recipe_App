"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// =======================
// Types
// =======================
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

type Ingredient = { id: number; name: string };

type IngredientGroup = {
  id: number;
  name: string;
  ingredients: Ingredient[];
};

// =======================
// Debounce Hook
// =======================
// Idee: nicht bei jedem Tastendruck sofort fetchen,
// sondern erst nach 400ms Pause.
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}

// =======================
// API: grouped ingredients
// =======================
async function fetchIngredientGroups(): Promise<IngredientGroup[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  // Backend: GET /ingredients/grouped
  const res = await fetch(`${baseUrl}/ingredients/grouped`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to load ingredient groups");
  return res.json();
}

// =======================
// API: recipes with filters
// =======================
async function fetchRecipes(filters: {
  search?: string;
  category?: string;
  maxDuration?: number;
  ingredientIds?: number[];
  maxMissing?: number;
}): Promise<Recipe[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const params = new URLSearchParams();

  // Textsuche
  if (filters.search && filters.search.trim() !== "") {
    params.set("search", filters.search.trim());
  }

  // Kategorie
  if (filters.category && filters.category.trim() !== "") {
    params.set("category", filters.category.trim());
  }

  // Max Dauer
  if (
    typeof filters.maxDuration === "number" &&
    !Number.isNaN(filters.maxDuration)
  ) {
    params.set("maxDuration", String(filters.maxDuration));
  }

  // Fridge Filter (Zutaten + Toleranz)
  if (filters.ingredientIds && filters.ingredientIds.length > 0) {
    params.set("ingredientIds", filters.ingredientIds.join(","));
    params.set("maxMissing", String(filters.maxMissing ?? 2));
  }

  const queryString = params.toString();
  const url = `${baseUrl}/recipes${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Loading error");

  return response.json();
}

// =======================
// Page
// =======================
export default function RecipesPage() {
  // -----------------------
  // Linke Filter
  // -----------------------
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxDuration, setMaxDuration] = useState<number | undefined>(undefined);

  const debouncedSearch = useDebouncedValue(search, 400);

  // -----------------------
  // Ingredients-Menü State
  // -----------------------
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);

  const [groups, setGroups] = useState<IngredientGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState<string | null>(null);

  // Accordion open/close (multi-open)
  const [openGroupIds, setOpenGroupIds] = useState<Set<number>>(new Set());

  // ausgewählte Zutaten
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Toleranz (wie viele Zutaten fehlen dürfen)
  const [maxMissing, setMaxMissing] = useState<number>(2);

  // -----------------------
  // Rezepte State
  // -----------------------
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // -----------------------
  // Ingredient Gruppen laden
  // -----------------------
  useEffect(() => {
    async function loadGroups() {
      setGroupsLoading(true);
      setGroupsError(null);

      try {
        const data = await fetchIngredientGroups();
        setGroups(data);
      } catch (err: any) {
        setGroupsError(err?.message ?? "Unknown error loading ingredients");
      } finally {
        setGroupsLoading(false);
      }
    }

    loadGroups();
  }, []);

  // -----------------------
  // Zutat togglen
  // -----------------------
  function toggleIngredient(ingredientId: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(ingredientId)) next.delete(ingredientId);
      else next.add(ingredientId);
      return next;
    });
  }

  // -----------------------
  // Gruppe togglen
  // -----------------------
  function toggleGroup(groupId: number) {
    setOpenGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  // -----------------------
  // Alles schließen
  // -----------------------
  function collapseAllGroups() {
    setOpenGroupIds(new Set());
    setIsIngredientsOpen(false);
  }

  // -----------------------
  // Auswahl leeren
  // -----------------------
  function clearSelection() {
    setSelectedIds(new Set());
  }

  // -----------------------
  // Filter Objekt
  // -----------------------
  const filters = useMemo(() => {
    return {
      search: debouncedSearch,
      category,
      maxDuration,
      ingredientIds: Array.from(selectedIds),
      maxMissing,
    };
  }, [debouncedSearch, category, maxDuration, selectedIds, maxMissing]);

  // -----------------------
  // Rezepte laden, wenn Filter sich ändern
  // -----------------------
  useEffect(() => {
    async function loadRecipes() {
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

    loadRecipes();
  }, [filters]);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      {/*
        WICHTIG:
        - Navbar nutzt: mx-auto max-w-6xl px-4 md:px-8
        - Wir nutzen hier exakt dasselbe, damit rechte Kanten übereinstimmen.
        - Vertikales Padding separat: py-4 md:py-8
      */}
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-8 md:py-8">
        {/* Desktop: links Content + rechts freie 320px Spalte */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* =======================
              LEFT COLUMN
             ======================= */}
          <div className="space-y-6">
            {/* Header: links Button/Status, rechts Ingredients */}
            <header className="grid grid-cols-[1fr_auto] items-start gap-4">
              {/* LINKS: New Recipe + Status */}
              <div className="space-y-3">
                <Link
                  href="/recipes/new"
                  className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
                >
                  + New Recipe
                </Link>

                <span className="block text-sm text-slate-300">
                  Fridge: {selectedIds.size} selected · maxMissing {maxMissing}
                </span>
              </div>

              {/* RECHTS: Ingredients + Collapse/Clear */}
              <div className="flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIngredientsOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 text-sm font-semibold hover:bg-slate-700/80 border border-slate-700/60"
                >
                  Ingredients{" "}
                  <span className="text-slate-300">
                    {isIngredientsOpen ? "▾" : "▸"}
                  </span>
                </button>

                <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-4 py-2 border border-slate-700/50">
                  <button
                    type="button"
                    onClick={collapseAllGroups}
                    className="text-xs text-slate-300 hover:text-slate-100"
                  >
                    Collapse
                  </button>

                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-xs text-slate-300 hover:text-slate-100"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </header>

            {/* Ingredients Panel (unter dem Header) */}
            {isIngredientsOpen && (
              <section className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4">
                {/* maxMissing */}
                <div className="space-y-1">
                  <label className="block text-sm text-slate-300">
                    maxMissing (tolerance)
                  </label>

                  <select
                    className="w-full rounded-xl bg-slate-900/60 p-2 text-sm ring-1 ring-slate-700"
                    value={maxMissing}
                    onChange={(e) => setMaxMissing(Number(e.target.value))}
                  >
                    <option value={0}>0 (strict)</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>

                  <p className="text-xs text-slate-400">
                    0 = nur Rezepte, wo du alles hast. 2 = es dürfen 2 Zutaten
                    fehlen.
                  </p>
                </div>

                {/* Loading / Error */}
                {groupsLoading && (
                  <p className="mt-4 text-sm text-slate-300">
                    Loading ingredients...
                  </p>
                )}

                {groupsError && (
                  <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
                    <p className="font-semibold">Ingredients failed</p>
                    <p className="text-xs">{groupsError}</p>
                    <p className="mt-2 text-xs text-slate-300">
                      Check: GET /ingredients/grouped exists in backend.
                    </p>
                  </div>
                )}

                {/* Accordion */}
                {!groupsLoading && !groupsError && (
                  <div className="mt-4 space-y-2">
                    {groups.map((g) => {
                      const isOpen = openGroupIds.has(g.id);

                      return (
                        <div
                          key={g.id}
                          className="rounded-xl border border-slate-700/60 bg-slate-900/40"
                        >
                          <button
                            type="button"
                            onClick={() => toggleGroup(g.id)}
                            className="w-full flex items-center justify-between px-3 py-2 text-left"
                          >
                            <span className="text-sm font-semibold text-slate-200">
                              {g.name}
                            </span>
                            <span className="text-slate-300 text-sm">
                              {isOpen ? "▾" : "▸"}
                            </span>
                          </button>

                          {isOpen && (
                            <div className="px-3 pb-3 space-y-1">
                              {g.ingredients.map((ing) => {
                                const checked = selectedIds.has(ing.id);

                                return (
                                  <label
                                    key={ing.id}
                                    className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleIngredient(ing.id)}
                                      className="h-4 w-4"
                                    />
                                    <span className="truncate">{ing.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Search & Filter UI */}
            <section className="grid gap-4 rounded-2xl bg-slate-800/70 p-4 md:grid-cols-3">
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
              </div>

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

            {/* Status */}
            <div className="text-sm text-slate-300">
              {loading ? "Lade Rezepte..." : `${recipes.length} Rezepte gefunden`}
            </div>

            {/* Errors */}
            {errorMessage && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
                <p className="font-semibold">Fehler beim Laden der Rezepte</p>
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Empty */}
            {!errorMessage && !loading && recipes.length === 0 && (
              <p className="text-slate-400">Keine passenden Rezepte gefunden.</p>
            )}

            {/* Recipes grid */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="flex flex-col overflow-hidden rounded-2xl bg-slate-800/80 shadow-lg shadow-black/30 border border-slate-700/60 hover:border-emerald-500/60 transition"
                >
                  {recipe.imageUrl && (
                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-4 space-y-2">
                    <h2 className="text-lg font-semibold">{recipe.title}</h2>

                    <p className="text-sm text-slate-300 line-clamp-2">
                      {recipe.description}
                    </p>

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

          {/* =======================
              RIGHT COLUMN (nur Spacer)
              -> Absichtlich leer, damit Desktop rechts "Luft" bleibt,
                 aber Header/Filter nicht bis ganz rechts laufen.
             ======================= */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </main>
  );
}
