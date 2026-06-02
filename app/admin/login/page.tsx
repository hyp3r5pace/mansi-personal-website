"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin/ingest";

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Couldn't sign in.");
      }
      router.replace(from);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't sign in.");
    }
  }

  return (
    <main className="bg-paper flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={onSubmit}
        className="border-char-ink/15 bg-cotton w-full max-w-sm rounded-sm border p-8 shadow-sm"
      >
        <p className="font-accent text-rose-madder text-2xl">studio</p>
        <h1 className="font-display text-ink-indigo mt-1 text-3xl tracking-tight italic">
          Sign in
        </h1>
        <p className="text-char-ink/60 mt-2 text-sm">
          This area is just for you.
        </p>

        <label className="mt-6 block">
          <span className="text-char-ink/65 font-mono text-[11px] uppercase tracking-widest">
            Password
          </span>
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-char-ink/25 bg-paper text-ink-indigo focus:border-marigold-deep focus:ring-marigold-deep/30 mt-2 w-full rounded-sm border px-4 py-3 text-base outline-none transition-colors focus:ring-2"
          />
        </label>

        {status === "error" ? (
          <p
            role="alert"
            className="border-rose-madder/40 text-rose-madder bg-rose-madder/5 mt-4 rounded-sm border px-4 py-2 text-sm"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting" || password.length === 0}
          className="bg-ink-indigo text-paper hover:bg-marigold-deep mt-6 w-full cursor-pointer rounded-sm px-6 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
