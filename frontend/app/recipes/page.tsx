// Seite: /recipes
//Diese Seite lädt alle Rezepte aus dem NestJS-Backend
//und zeigt sie als einfache Kartenliste

type Category = { id: number; name: string };
type Recipe = {
  id: number;
  title: string;
  description: string;
  durationMinutes: string;
  imageUrl: string;
  categories: Category[];
};

//Hilfsfunktion holt Rezepte vom Backend
async function fetchRecipes(): Promise<Recipe[]> {
  //Basis-URL aus der env.local lesen
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const response = await fetch(`${baseUrl}/recipes`, {
    //Kein Caching, damit immer die aktuellen Daten bekommen})
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Loading error");
  }
  return response.json();
}

//Server Component(async), damit wir direkt auf dem Server fetchen können
export default async function RecipesPage() {
  let recipes: Recipe[] = [];
  let errorMessage: string | null = null;

  try {
    recipes = await fetchRecipes();
  } catch (error: any) {
    errorMessage = error?.message ?? "Unknown error by loading";
  }
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-5xl p-4 md:p-8 space-y-6">
        {/* Kopfbereich der Seite */}
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Rezepte</h1>
          <p className="text-slate-300">
            Diese Liste kommt direkt aus deinem NestJS-Backend.
          </p>
        </header>

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
        {!errorMessage && recipes.length === 0 && (
          <p className="text-slate-400">Noch keine Rezepte vorhanden.</p>
        )}

        {/* Grid mit Rezeptkarten */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <article
              key={recipe.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-slate-800/80 shadow-lg shadow-black/30 border border-slate-700/60"
            >
              {/* Bildbereich (falls vorhanden) */}
              {recipe.imageUrl && (
                <div className="relative h-40 w-full overflow-hidden">
                  {/* Für den Anfang reicht ein normales <img>.
                      Später können wir auf next/image umstellen. */}
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

                <p className="text-sm text-slate-300">{recipe.description}</p>

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
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
