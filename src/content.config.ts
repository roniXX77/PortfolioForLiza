import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      titleUrl: z.url().optional(),
      sectionHeading: z.object({ title: z.string(), url: z.url() }).optional(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      category: z.enum([
        "digital archive",
        "video",
        "photography",
        "participation",
        "canvases",
      ]),
      year: z.number().int().optional(),
      description: z.string(),
      order: z.number(),
      demo: z.boolean().default(true),
      cover: image(),
      coverAlt: z.string().min(1),
      externalUrl: z.url().optional(),
      photoCredit: z.string().optional(),
      media: z.array(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("image"),
            src: image(),
            fit: z.enum(["cover", "contain"]).optional(),
            brightness: z.number().min(1).max(1.3).optional(),
            alt: z.string().min(1),
          }),
          z.object({
            type: z.literal("video"),
            src: z.string(),
            poster: image(),
            alt: z.string().min(1),
            captions: z.string().optional(),
          }),
        ]),
      ),
    }),
});
const publications = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    publication: z.string(),
    year: z.number().int(),
    url: z.url().optional(),
    demo: z.boolean(),
  }),
});
export const collections = { projects, publications };
