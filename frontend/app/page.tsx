// Startseite unserer Recipe App im Frontend
// Hier bauen wir später die UI
export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Recipe App</h1>
        <p className="text-slate-300">
          Next.js + Tailwind sind erfolgreich eingerichtet
        </p>
        <p className="text-sm text-slate-400">
          Als Nächstes verbinden wir die UI mit deinem NestJS Backend und bauen
          die Rezeptübersicht.
        </p>
      </div>
    </main>
  );
}
