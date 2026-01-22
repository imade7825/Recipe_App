import { notFound } from "next/navigation";

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
          <>
            {/* Titel + Meta-Infos */}
            <header className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">{recipe.title}</h1>

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

            {/* Bild, falls vorhanden */}
            {recipe.imageUrl && (
              <div className="overflow-hidden rounded-3xl border border-slate-700/70 shadow-lg shadow-black/40">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="h-64 w-full object-cover"
                />
              </div>
            )}

            {/* Beschreibung */}
            <section className="space-y-2"> 
              <h2 className="text-xl font-semibold">Beschreibung</h2>
              <p className="text-slate-200">{recipe.description}</p>
            </section>

            {/* Zubereitungsschritte */}
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Zubereitung</h2>
              <p className="whitespace-pre-line text-slate-200">
                {recipe.instructions}
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
