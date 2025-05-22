import { z } from "zod";

const ClassfificationSchema = z.object({
  domain: z.optional(z.string()),
  phylum: z.optional(z.string()),
  class: z.optional(z.string()),
  order: z.optional(z.string()),
  family: z.optional(z.string()),
  genus: z.optional(z.string()),
  species: z.optional(z.string()),
});

const GtdbtkResultSchema = z.object({
  classification: ClassfificationSchema,
  closest_genome_reference: z.union([z.string(), z.nan()]),
  classification_method: z.union([z.nan(), z.string()]),
  warnings: z.string(),
});

export type Classification = z.infer<typeof ClassfificationSchema>;
export type GtdbtkResult = z.infer<typeof GtdbtkResultSchema>;

function isClassificationKey(s: string): s is keyof Classification {
  for (const k of Object.keys(ClassfificationSchema.shape))
    if (s === k) return true;
  return false;
}

export { GtdbtkResultSchema, ClassfificationSchema, isClassificationKey };
