import { z } from "zod";

export const createPostSchema = z.object({
  title:       z.string().min(5, "Title too short (min 5 chars)").max(120, "Title too long (max 120 chars)"),
  content:     z.string().min(10, "Post too short (min 10 chars)").max(5000),
  tab:         z.enum(["ask", "rant", "beware"]),
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

export const updateProfileSchema = z.object({
  first_name: z.string().max(100).optional().nullable(),
  home_city:  z.string().max(100).optional().nullable(),
  instagram:  z.string().max(100).optional().nullable(),
});
