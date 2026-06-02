import { NextResponse } from "next/server";
import { getSession, verifyPassword } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = (body as { password?: unknown }).password;

  if (typeof password !== "string" || !verifyPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();
  return NextResponse.json({ ok: true });
}
