import { z } from "zod";

/**
 * Shared zod schema for the contact form. Used by both the client form
 * (react-hook-form resolver) and the API route (server-side re-parse).
 */
export const ContactSchema = z.object({
  name: z.string().trim().min(2, "Tell me your name").max(80),
  email: z.string().trim().email("That doesn't look like an email"),
  subject: z.string().trim().min(3, "A short subject helps").max(120),
  message: z.string().trim().min(20, "A few more words?").max(4000),
  /** Honeypot — must stay empty for legitimate humans. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof ContactSchema>;
