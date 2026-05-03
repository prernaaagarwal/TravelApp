import { z } from "zod";

// ── beware-cities-data.json ──────────────────────────────────────────────────

export const mapReportJsonSchema = z.object({
  id:       z.string(),
  lat:      z.number().min(-90).max(90),
  lng:      z.number().min(-180).max(180),
  type:     z.enum(["scam", "harassment", "transport", "stay", "safe"]),
  title:    z.string().min(1),
  place:    z.string(),
  desc:     z.string(),
  date:     z.string(),
  confirms: z.number().int().min(0),
  reporter: z.string(),
});

export const cityConfigJsonSchema = z.object({
  slug:   z.string().min(1),
  name:   z.string().min(1),
  center: z.tuple([z.number(), z.number()]),
  zoom:   z.number().int().min(1).max(20),
});

export const cityEntryJsonSchema = z.object({
  config:  cityConfigJsonSchema,
  reports: z.array(mapReportJsonSchema),
});

export const bewareCitiesDataSchema = z.record(z.string(), cityEntryJsonSchema);

export const createPostSchema = z.object({
  title:       z.string().min(5, "Title too short (min 5 chars)").max(120, "Title too long (max 120 chars)"),
  content:     z.string().min(10, "Post too short (min 10 chars)").max(5000),
  tab:         z.enum(["ask", "experiences", "beware"]),
  destination: z.string().max(100).optional().nullable(),
  image_urls:  z.array(z.string().url()).max(5).optional(),
});

export const submitBewareReportSchema = z.object({
  title:            z.string().min(3, "Title required").max(200),
  description:      z.string().min(10, "Description too short").max(2000),
  category:         z.string().max(50).optional().nullable(),
  severity:         z.enum(["low", "medium", "high"]).optional().default("medium"),
  city:             z.string().max(100).optional().nullable(),
  location:         z.string().max(200).optional().nullable(),
  destination_slug: z.string().max(100).optional().nullable(),
  gps_lat:          z.number().min(-90).max(90).optional().nullable(),
  gps_lng:          z.number().min(-180).max(180).optional().nullable(),
});

export const verifyStaySchema = z.object({
  booking_url: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "URL must start with http:// or https://"
    ),
});

export const updateProfileSchema = z.object({
  first_name: z.string().max(100).optional().nullable(),
  home_city:  z.string().max(100).optional().nullable(),
  instagram:  z.string().max(100).optional().nullable(),
});
