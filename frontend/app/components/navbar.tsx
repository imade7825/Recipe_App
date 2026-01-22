"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
  }, []);

  function logout() {
    localStorage.removeItem("accessToken");
    setToken(null);
    // optional: direkt auf login schicken
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/recipes" className="text-lg font-bold text-slate-100">
          Recipe App
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {!token ? (
            <>
              <Link
                href="/login"
                className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white hover:bg-emerald-500"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/recipes"
                className="rounded-lg bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700"
              >
                Recipes
              </Link>
              <button
                onClick={logout}
                className="rounded-lg bg-red-600/80 px-3 py-2 font-semibold text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
