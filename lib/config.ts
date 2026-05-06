import { z } from "zod";

// Single source of truth for environment variables that the server reads.
// Validated once at module load — missing or malformed required vars will
// crash the server immediately rather than fail later in obscure handlers.
//
// IMPORTANT: this module is server-only. Do not import from `'use client'`
// components. Client-side code should keep reading `process.env.NEXT_PUBLIC_*`
// directly so Next can inline the values at build time.

const envSchema = z.object({
  // --- Required NEXT_PUBLIC_* (also used server-side) ---
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be empty"),

  // --- Optional NEXT_PUBLIC_* with sensible defaults ---
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),
  NEXT_PUBLIC_WW_WHATSAPP: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: z.string().optional(),

  // --- Server-only secrets ---
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(8).optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  EMAIL_FROM: z
    .string()
    .default("Wander Women <noreply@wanderwomen.in>"),
  RESEND_API_KEY: z.string().optional(),
  UNSUBSCRIBE_SECRET: z.string().min(16).optional(),
  FINGERPRINT_SALT: z.string().min(8).optional(),
  GOOGLE_MAPS_API_KEY: z.string().optional(),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join("; ");
  throw new Error(`Invalid environment variables — ${issues}`);
}

export const env = parsed.data;

// Helper for server code that absolutely requires a var the schema treats as
// optional. Keeps the throw-with-context pattern out of every call site.
export function requireEnv<K extends keyof typeof env>(
  key: K,
): NonNullable<(typeof env)[K]> {
  const value = env[key];
  if (value === undefined || value === null || value === "") {
    throw new Error(`Required environment variable ${String(key)} is not set`);
  }
  return value as NonNullable<(typeof env)[K]>;
}
