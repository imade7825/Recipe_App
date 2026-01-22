"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? "Login failed");
      }

      // Token speichern
      localStorage.setItem("accessToken", data.accessToken);

      router.push("/recipes");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl bg-slate-800 p-6"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        {error && (
          <p className="rounded bg-red-500/20 p-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded bg-slate-700 p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded bg-slate-700 p-2"
        />

        <button
          disabled={loading}
          className="w-full rounded bg-emerald-600 p-2 font-semibold hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-slate-300">
          No account?{" "}
          <Link href="/register" className="text-emerald-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
