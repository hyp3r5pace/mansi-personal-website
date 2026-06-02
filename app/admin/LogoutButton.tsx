"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
      }}
      className="text-char-ink/60 hover:text-marigold-deep font-mono text-xs uppercase tracking-widest transition-colors"
    >
      Sign out
    </button>
  );
}
