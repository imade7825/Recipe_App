import { notFound } from "next/navigation";
import RecipeDetailClient from "./RecipeDetailClient";

// Types passend zu dem Backend-Response
type Category = { id: number; name: string };
type IngredientLink = {
  id: number;
  recipeId: number;
  ingredientId: number;
  quantity: string;
  unit: string;
};
type Ingredient = { id: number; name: string };

type Recipe = {
  id: number;
  title: string;
  description: string;
  instructions: string;
  durationMinutes: number;
  imageUrl: string | null;
  categories: Category[];
  // abhängig davon, was /recipes/:id zurückgibt
  ingredients?: IngredientLink[];
};

// Hilfsfunktion: lädt EIN Rezept vom Backend
async function fetchRecipe(id: number): Promise<Recipe | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const response = await fetch(`${baseUrl}/recipes/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    // Backend sagt: dieses Rezept gibt es nicht
    return null;
  }

  if (!response.ok) {
    // Andere Fehler (500, 400, usw.)
    throw new Error("error by loading");
  }

  return response.json();
}

// generateMetadata lassen wir für Ticket 9 weg, um es einfach zu halten
// Wenn du später Lust hast, können wir das wieder einbauen.

// Detailseite für ein Rezept
export default async function RecipeDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  // In deiner Next-Version ist params ein Promise -> hier entpacken
  const { id: idRaw } = await props.params;
  const id = Number(idRaw);

  // Wenn die ID keine Zahl ist -> 404
  if (Number.isNaN(id)) {
    notFound();
  }

  let recipe: Recipe | null = null;
  let errorMessage: string | null = null;

  try {
    recipe = await fetchRecipe(id);
  } catch (error: any) {
    errorMessage = error?.message ?? "Unknown error by loading a Recipe";
  }

  // Wenn kein Rezept gefunden, aber auch kein Fehler -> 404
  if (!recipe && !errorMessage) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-3xl p-4 md:p-8 space-y-6">
        {/* Fehlerbox, falls Backend kaputt o.ä. */}
        {errorMessage && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
            <p className="font-semibold">Fehler beim Laden dieses Rezepts</p>
            <p>{errorMessage}</p>
          </div>
        )}

        {recipe && (
          <RecipeDetailClient
            initialRecipe={recipe}
            apiBaseUrl={
              process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"
            }
          />
        )}
      </div>
    </main>
  );
}
