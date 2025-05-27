import { z } from "zod";

const LocationSchema = z.object({
  type: z.enum(["Point"]),
  coordinates: z.array(z.number()),
});

const EnvironmentSchema = z.object({
  biome: z.optional(z.string()),
  feature: z.optional(z.string()),
  material: z.optional(z.string()),
});

const HostSchema = z.object({
  sex: z.optional(z.string()),
  status: z.optional(z.string()),
  tax_id: z.optional(z.string()),
  host: z.optional(z.string()),
});
const SampleSchema = z.object({
  accession: z.optional(z.string()),
  secondary_accession: z.optional(z.string()),
  alias: z.optional(z.string()),
  collection_date: z.optional(z.string()),
  collected_by: z.optional(z.string()),
  culture_collection: z.optional(z.string()),
  isolation_source: z.optional(z.string()),
  country: z.optional(z.string()),
  location: z.optional(LocationSchema),
  bio_material: z.optional(z.string()),
  isolate: z.optional(z.string()),
  serovar: z.optional(z.string()),
  serotype: z.optional(z.string()),
  strain: z.optional(z.string()),
  sub_strain: z.optional(z.string()),
  environmental_sample: z.optional(z.boolean()),
  environment: z.optional(EnvironmentSchema),
  host: z.optional(HostSchema),
});
const StudySchema = z.object({
  accession: z.optional(z.string()),
  secondary_accession: z.optional(z.string()),
  alias: z.optional(z.string()),
  title: z.optional(z.string()),
  project_name: z.optional(z.string()),
});
const InstrumentSchema = z.object({
  platform: z.optional(z.string()),
  model: z.optional(z.string()),
});
const SequencingRunSchema = z.object({
  accession: z.optional(z.string()),
  instrument: z.optional(InstrumentSchema),
  depth: z.optional(z.string()),
  first_public: z.optional(z.string()),
  submission_accession: z.optional(z.string()),
  center_name: z.optional(z.string()),
});
export const MetadataSchema = z.object({
  sample: SampleSchema,
  studies: z.array(StudySchema),
  runs: z.array(SequencingRunSchema),
});

export type Metadata = z.infer<typeof MetadataSchema>;
export type SequencingRun = z.infer<typeof SequencingRunSchema>;
export type Study = z.infer<typeof StudySchema>;
export type Sample = z.infer<typeof SampleSchema>;
export type Host = z.infer<typeof HostSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Instrument = z.infer<typeof InstrumentSchema>;
