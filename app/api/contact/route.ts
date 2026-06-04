import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactSchema } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

const TO_ADDRESS = process.env.CONTACT_TO_EMAIL ?? SITE.email;
const FROM_ADDRESS =
  process.env.CONTACT_FROM_EMAIL ?? `${SITE.shortName} Studio <onboarding@resend.dev>`;

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "anonymous";
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // Honeypot: silently accept and discard so bots get a 200.
  if (parsed.data.company && parsed.data.company.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const ip = getClientIp(req);

  // Turnstile: prove a human before we touch the mail service. Optional —
  // when no secret is configured we fall back to the honeypot + rate limit,
  // so the form still works. When configured, a valid token is required.
  const token = (body as { turnstileToken?: unknown }).turnstileToken;
  const turnstile = await verifyTurnstile(
    typeof token === "string" ? token : undefined,
    ip,
  );
  if (!turnstile.ok && turnstile.reason !== "missing-secret") {
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 403 },
    );
  }

  const limit = rateLimit(`contact:${ip}`, {
    limit: 3,
    windowMs: 60 * 60 * 1000, // 3 submissions per hour per IP
  });
  if (!limit.ok) {
    const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Too many requests. Try again in an hour." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY not configured");
    return NextResponse.json(
      { error: "Mail service not configured. Please email me directly." },
      { status: 503 },
    );
  }

  const { name, email, subject, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `[Studio inquiry] ${subject}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr />
        <p style="white-space: pre-wrap">${escapeHtml(message)}</p>
      `,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
    });

    if (error) {
      console.error("[contact] resend error", error);
      return NextResponse.json(
        { error: "Could not send. Try again shortly." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] send threw", err);
    return NextResponse.json(
      { error: "Could not send. Try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
