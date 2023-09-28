import { z } from "zod";
import { GenomeSchema, StatsSchema } from "./BaktaResults";
import { QualitySchema } from "./CheckmResults";
import { ClassfificationSchema } from "./GtdbtkResult";

const SimpleFeatureSchema = z.object({
  gene: z.optional(z.nullable(z.string())),
  product: z.optional(z.nullable(z.string())),
});

const SimpleGtdbtkSchema = z.object({
  classification: ClassfificationSchema,
});
const SimpleMlstEntrySchema = z.object({
  sequence_type: z.string(),
});
const SimpleCheckm2Schema = z.object({
  quality: QualitySchema,
});

const BakrepSearchEntrySchema = z.object({
  id: z.string(),
  bakta: z.optional(
    z.object({
      genome: GenomeSchema,
      stats: StatsSchema,
      features: z.optional(z.array(SimpleFeatureSchema)),
    }),
  ),
  gtdbtk: z.optional(SimpleGtdbtkSchema),
  mlst: z.optional(SimpleMlstEntrySchema),
  checkm2: z.optional(SimpleCheckm2Schema),
});

const BakrepSearchResultSchema = z.object({
  offset: z.optional(z.number()),
  search_after: z.array(
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
  total: z.number(),
  results: z.array(BakrepSearchEntrySchema),
});

export type BakrepSearchResultEntry = z.infer<typeof BakrepSearchEntrySchema>;
export type BakrepSearchResult = z.infer<typeof BakrepSearchResultSchema>;

export { BakrepSearchEntrySchema, BakrepSearchResultSchema };
