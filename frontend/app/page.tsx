// Startseite unserer Recipe App im Frontend
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Recipe App</h1>
        <p className="text-slate-300">
          Next.js + Tailwind sind erfolgreich eingerichtet
        </p>
        <p className="text-sm text-slate-400">
           
        </p>
        <Link
          href="/recipes"
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-slate-900 hover:bg-emerald-400 transition"
        >
          Zur Rezeptliste
        </Link>
      </div>
    </main>
  );
}
