import { notFound } from "next/navigation";
import RecipeDetailClient from "./RecipeDetailClient";

// =======================
// Types passend zu deinem Backend
// =======================
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

// =======================
// Hilfsfunktion: lädt EIN Rezept vom Backend
// =======================
async function fetchRecipe(id: number): Promise<Recipe | null> {
  // Basis-URL vom Backend (ENV oder fallback localhost)
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  // Rezept laden
  const response = await fetch(`${baseUrl}/recipes/${id}`, {
    cache: "no-store", // wichtig: immer frisch laden (kein Cache)
  });

  // Wenn Backend 404 liefert -> Rezept existiert nicht
  if (response.status === 404) return null;

  // Andere Fehler (500, 400, etc.)
  if (!response.ok) {
    throw new Error("error by loading");
  }

  // Rezept JSON zurückgeben
  return response.json();
}

// =======================
// Detailseite für ein Rezept
// =======================
export default async function RecipeDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  // Next liefert params bei dir als Promise -> wir entpacken es
  const { id: idRaw } = await props.params;

  // ID aus der URL in Zahl umwandeln
  const id = Number(idRaw);

  // Wenn keine Zahl -> 404
  if (Number.isNaN(id)) {
    notFound();
  }

  // Rezept & Fehler-Handling
  let recipe: Recipe | null = null;
  let errorMessage: string | null = null;

  try {
    recipe = await fetchRecipe(id);
  } catch (error: any) {
    errorMessage = error?.message ?? "Unknown error by loading a Recipe";
  }

  // Wenn kein Rezept gefunden und kein Fehler -> 404
  if (!recipe && !errorMessage) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      {/*
        WICHTIG (Layout Fix):
        - Wir verwenden exakt den gleichen Container wie auf der Recipes-Page
          -> max-w-6xl + px-4 md:px-8
        - Und wir verwenden das gleiche Grid mit rechter "Spacer"-Spalte (320px)
          -> damit endet die rechte Kante des Inhalts NICHT am Bildschirmrand,
             sondern genau dort, wo auch Ingredients / Filter enden.
      */}
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-8 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* =======================
              LEFT COLUMN (Inhalt)
             ======================= */}
          <div className="space-y-6">
            {/* Fehlerbox, falls Backend kaputt o.ä. */}
            {errorMessage && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
                <p className="font-semibold">Fehler beim Laden dieses Rezepts</p>
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Client-Komponente nur rendern, wenn Rezept existiert */}
            {recipe && (
              <RecipeDetailClient
                initialRecipe={recipe}
                apiBaseUrl={
                  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"
                }
              />
            )}
          </div>

          {/* =======================
              RIGHT COLUMN (Spacer)
              -> bleibt absichtlich leer, damit die rechte Kante gleich bleibt
             ======================= */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </main>
  );
}
