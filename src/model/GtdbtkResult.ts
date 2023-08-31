import { z } from "zod";

const ClassfificationSchema = z.object({
  domain: z.string(),
  phylum: z.string(),
  class: z.string(),
  order: z.string(),
  family: z.string(),
  genus: z.string(),
  species: z.string(),
});

const GtdbtkResultSchema = z.object({
  classification: ClassfificationSchema,
  fastani_reference: z.union([z.string(), z.nan()]),
  classification_method: z.string(),
  warnings: z.string(),
});

export type Classification = z.infer<typeof ClassfificationSchema>;
export type GtdbtkResult = z.infer<typeof GtdbtkResultSchema>;

export { GtdbtkResultSchema, ClassfificationSchema };
