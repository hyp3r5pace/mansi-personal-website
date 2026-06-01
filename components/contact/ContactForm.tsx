"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { ContactSchema, type ContactInput } from "@/lib/contact-schema";
import { Envelope } from "./Envelope";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // Bumping this remounts the widget to get a fresh, single-use token.
  const [widgetKey, setWidgetKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      company: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (TURNSTILE_SITE_KEY && !token) {
      setStatus("error");
      setErrorMsg("Please complete the verification below.");
      return;
    }
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      // Token is single-use; force a fresh challenge for the next attempt.
      setToken(null);
      setWidgetKey((k) => k + 1);
    }
  });

  if (status === "success") {
    return (
      <div className="border-char-ink/15 bg-paper-deep paper-grain stitch-border flex flex-col items-center gap-6 px-6 py-12 text-center sm:px-12 sm:py-16">
        <Envelope closed className="w-40" />
        <div>
          <p className="font-accent text-rose-madder text-2xl">sent</p>
          <h3 className="font-display text-ink-indigo mt-1 text-3xl tracking-tight italic sm:text-4xl">
            Stitched, sealed, on its way.
          </h3>
          <p className="text-char-ink/70 mt-4 max-w-md text-base">
            I read everything and reply within a week. Often sooner.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-char-ink/60 hover:text-marigold-deep font-mono text-xs uppercase tracking-widest transition-colors"
        >
          send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <Field
        label="Name"
        error={errors.name?.message}
        input={
          <input
            type="text"
            autoComplete="name"
            {...register("name")}
            className={baseInput}
          />
        }
      />

      <Field
        label="Email"
        error={errors.email?.message}
        input={
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className={baseInput}
          />
        }
      />

      <Field
        label="Subject"
        error={errors.subject?.message}
        input={
          <input
            type="text"
            {...register("subject")}
            className={baseInput}
          />
        }
      />

      <Field
        label="Message"
        error={errors.message?.message}
        input={
          <textarea
            rows={6}
            {...register("message")}
            className={cn(baseInput, "resize-y leading-relaxed")}
          />
        }
      />

      {/* Honeypot — visually & a11y hidden, never autofocused */}
      <div aria-hidden className="pointer-events-none absolute -left-[10000px]">
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("company")}
          />
        </label>
      </div>

      {TURNSTILE_SITE_KEY ? (
        <Turnstile
          key={widgetKey}
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={setToken}
          onExpire={() => setToken(null)}
          onError={() => setToken(null)}
          options={{ theme: "light" }}
        />
      ) : null}

      {status === "error" ? (
        <p
          role="alert"
          className="border-rose-madder/40 text-rose-madder bg-rose-madder/5 rounded-sm border px-4 py-3 text-sm"
        >
          {errorMsg ?? "Could not send. Try again shortly."}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-ink-indigo text-paper hover:bg-marigold-deep focus-visible:bg-marigold-deep cursor-pointer rounded-sm px-6 py-3 font-medium transition-colors disabled:cursor-wait disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send the note"}
        </button>
        <p className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
          Replies within a week
        </p>
      </div>
    </form>
  );
}

const baseInput =
  "border-char-ink/25 bg-paper text-ink-indigo focus:border-marigold-deep focus:ring-marigold-deep/30 placeholder:text-char-ink/40 w-full rounded-sm border px-4 py-3 text-base outline-none transition-colors focus:ring-2";

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-char-ink/65 font-mono text-[11px] uppercase tracking-widest">
        {label}
      </span>
      {input}
      {error ? (
        <span role="alert" className="text-rose-madder text-sm">
          {error}
        </span>
      ) : null}
    </label>
  );
}
