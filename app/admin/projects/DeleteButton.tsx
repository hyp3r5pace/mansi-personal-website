"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!window.confirm(`Remove “${title}” from the site? This can't be undone.`)) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/projects/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Couldn't remove.");
      }
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Couldn't remove.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      className="text-char-ink/55 hover:text-rose-madder text-xs font-medium transition-colors disabled:opacity-50"
    >
      {busy ? "Removing…" : "Remove"}
    </button>
  );
}
