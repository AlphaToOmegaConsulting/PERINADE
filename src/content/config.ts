import { defineCollection, z } from "astro:content";

const vinsCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      couleur: z.enum(["Rouge", "Blanc", "Rosé"]),
      couleurTone: z.enum(["Rouge", "Blanc", "Rosé"]),
      appellation: z.string(),
      millesime: z.number().int(),
      volume: z.number().default(75),
      prix: z.number(),
      stock: z.enum(["En stock", "Stock limité", "Rupture de stock"]).default("En stock"),
      description: z.string(),
      badges: z.array(z.string()).default([]),
      image: image(),
      imageAlt: z.string(),
      featured: z.boolean().default(false),
      ordre: z.number().default(99)
    })
});

const visitesCollection = defineCollection({
  type: "content",
  schema: z.object({
    titre: z.string(),
    sousTitre: z.string(),
    prix: z.number(),
    perLabel: z.string().default("/ personne"),
    dureeMinutes: z.number(),
    capaciteMin: z.number().default(1),
    capaciteMax: z.number().default(12),
    langues: z.array(z.string()),
    inclus: z.array(z.string()),
    horaires: z.string(),
    joursOuverts: z.string(),
    politiqueAnnulation: z.string(),
    highlighted: z.boolean().default(false),
    badge: z.string().optional(),
    ordre: z.number().default(99)
  })
});

export const collections = {
  vins: vinsCollection,
  visites: visitesCollection
};
