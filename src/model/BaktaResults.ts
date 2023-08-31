import { z } from "zod";

export const GenomeSchema = z.object({
  genus: z.string(),
  species: z.string(),
  strain: z.string(),
  complete: z.boolean(),
  gram: z.string(),
  translation_table: z.number(),
});

export const StatsSchema = z.object({
  no_sequences: z.number(),
  size: z.number(),
  gc: z.number(),
  n_ratio: z.number(),
  n50: z.number(),
  coding_ratio: z.number(),
});

// TODO features is far from complete
const FeatureSchema = z.object({
  type: z.string(),
  contig: z.string(),
  start: z.number(),
  stop: z.number(),
  strand: z.string(),
  gene: z.optional(z.nullable(z.string())),
  product: z.optional(z.nullable(z.string())),
  start_type: z.optional(z.string()),
  rbs_motif: z.optional(z.nullable(z.string())),
  db_xrefs: z.optional(z.array(z.string())),
  frame: z.optional(z.number()),
  aa: z.optional(z.string()),
  aa_hexdigest: z.optional(z.string()),
  nt: z.optional(z.string()),
  //TODO
  // ups
  // ips
  // psc
  // pscc
  // trna attributes
  id: z.string(),
  locus: z.optional(z.string()),
});

const SequenceSchema = z.object({
  id: z.string(),
  description: z.string(),
  sequence: z.string(),
  length: z.number(),
  complete: z.boolean(),
  type: z.string(),
  topology: z.string(),
  simple_id: z.string(),
});

const RunSchema = z.object({
  start: z.string(),
  end: z.string(),
});

const VersionSchema = z.object({
  bakta: z.string(),
  db: z.string(),
});

const BaktaResultSchema = z.object({
  genome: GenomeSchema,
  stats: StatsSchema,
  features: z.array(FeatureSchema),
  sequences: z.array(SequenceSchema),
  run: RunSchema,
  version: VersionSchema,
});

export type Genome = z.infer<typeof GenomeSchema>;
export type Stats = z.infer<typeof StatsSchema>;
export type Feature = z.infer<typeof FeatureSchema>;
export type Sequence = z.infer<typeof SequenceSchema>;
export type Run = z.infer<typeof RunSchema>;
export type Version = z.infer<typeof VersionSchema>;
export type BaktaResult = z.infer<typeof BaktaResultSchema>;

export { BaktaResultSchema };
