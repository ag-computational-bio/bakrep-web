import { z } from "zod";

const ClassfificationSchema = z.object({
  domain: z.string().optional().nullable(),
  phylum: z.string().optional().nullable(),
  class: z.string().optional().nullable(),
  order: z.string().optional().nullable(),
  family: z.string().optional().nullable(),
  genus: z.string().optional().nullable(),
  species: z.string().optional().nullable(),
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
