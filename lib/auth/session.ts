import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

/**
 * Single-owner admin auth. A password (ADMIN_PASSWORD) unlocks an encrypted
 * iron-session cookie; SESSION_SECRET seals it. No database, no user table —
 * there is exactly one admin (the site owner).
 */

export type AdminSession = {
  isLoggedIn?: boolean;
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "",
  cookieName: "mansi_admin",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

/** Read/write the admin session from a Server Component or Route Handler. */
export async function getSession() {
  return getIronSession<AdminSession>(await cookies(), sessionOptions);
}

/**
 * Constant-time password check against ADMIN_PASSWORD. Returns false if the
 * env var is missing so a misconfigured deploy fails closed.
 */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = new TextEncoder().encode(input);
  const b = new TextEncoder().encode(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}
