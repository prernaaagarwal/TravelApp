import { z } from "zod";

// ─── Reusable sub-schemas ─────────────────────────────────────────────
const slugRegex      = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const yyyyMmDdRegex  = /^\d{4}-\d{2}-\d{2}$/;
const audienceValues = ["foreign-women", "indian-women", "both"] as const;

// hero_image_url: either a fully-qualified URL or a local /public path
const heroImageUrlSchema = z
  .string()
  .min(1, "hero_image_url is required")
  .refine(
    (s) => /^https?:\/\//.test(s) || s.startsWith("/"),
    { message: "hero_image_url must be an http(s) URL or a /public path" }
  );

// tldr: legacy strings array OR new object form
const tldrSchema = z.union([
  z.array(z.string().min(1)),
  z.object({
    summary:      z.string().min(1, "tldr.summary is required"),
    safetyRating: z.string().optional(),
    topTip:       z.string().optional(),
  }),
]);

const neighborhoodSchema = z.object({
  name:         z.string().min(1),
  safetyRating: z.coerce.number().min(0).max(10),
  vibe:         z.string().min(1),
  notes:        z.string().min(1),
  stayHere:     z.string().min(1),
});

const scamSchema = z.object({
  title:    z.string().min(1),
  severity: z.string().min(1), // free-text — values like "critical" / "high" / "medium"
  where:    z.string().min(1),
  what:     z.string().min(1),
  avoid:    z.string().min(1),
});

const transportSchema = z.object({
  mode:       z.string().min(1),
  tip:        z.string().min(1),
  approxCost: z.string().min(1),
});

const hiddenGemSchema = z.object({
  name:       z.string().min(1),
  why:        z.string().min(1),
  type:       z.string().min(1),
  angle:      z.string().min(1),
  approxCost: z.string().min(1),
});

const dosAndDontsSchema = z.object({
  do:   z.array(z.string().min(1)).default([]),
  dont: z.array(z.string().min(1)).default([]),
});

const dailyBudgetSchema = z.object({
  backpacker:  z.coerce.number().int().min(0),
  midRange:    z.coerce.number().int().min(0),
  comfortable: z.coerce.number().int().min(0),
  currency:    z.string().min(1).max(8).optional(),
});

const emergencyNumbersSchema = z.union([
  z.array(z.object({ label: z.string().min(1), number: z.string().min(1) })),
  z.record(z.string(), z.string()),
]);

const affiliateLinksSchema = z.object({
  booking:     z.string().url().optional(),
  worldNomads: z.string().url().optional(),
}).default({});

// ─── Top-level card ───────────────────────────────────────────────────
export const intelCardImportSchema = z.object({
  slug:                   z.string().regex(slugRegex,    "Slug must be lowercase letters, numbers, hyphens (e.g. 'goa-india')").min(2).max(80),
  destination:            z.string().min(2).max(100),
  country:                z.string().min(2).max(60),
  audience:               z.enum(audienceValues).default("both"),
  contributor_slug:       z.string().regex(slugRegex).nullable().optional(),
  last_updated:           z.string().regex(yyyyMmDdRegex, "last_updated must be YYYY-MM-DD"),
  hero_image_url:         heroImageUrlSchema,
  tldr:                   tldrSchema,
  neighborhoods:          z.array(neighborhoodSchema).default([]),
  scams:                  z.array(scamSchema).default([]),
  transport:              z.array(transportSchema).default([]),
  hidden_gems:            z.array(hiddenGemSchema).default([]),
  pre_book_checklist:     z.array(z.string().min(1)).default([]),
  dos_and_donts:          dosAndDontsSchema.default({ do: [], dont: [] }),
  estimated_daily_budget: dailyBudgetSchema.nullable().optional(),
  emergency_numbers:      emergencyNumbersSchema.default([]),
  is_premium:             z.boolean().default(false),
  premium_preview:        z.string().nullable().optional(),
  affiliate_links:        affiliateLinksSchema,
});

export type IntelCardImport = z.infer<typeof intelCardImportSchema>;
