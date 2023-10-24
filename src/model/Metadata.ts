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
  name: z.optional(z.string()),
});
const SampleSchema = z.object({
  alias: z.optional(z.string()),
  accession: z.optional(z.string()),
  country: z.optional(z.string()),
  collection_date: z.optional(z.string()),
  bio_material: z.optional(z.string()),
  collected_by: z.optional(z.string()),
  culture_collection: z.optional(z.string()),
  isolate: z.optional(z.string()),
  isolation_source: z.optional(z.string()),
  serotype: z.optional(z.string()),
  serovar: z.optional(z.string()),
  strain: z.optional(z.string()),
  sub_strain: z.optional(z.string()),
  secondary_accession: z.optional(z.string()),

  location: z.optional(LocationSchema),
  environmental_sample: z.optional(z.boolean()),
  environmental_package: z.optional(z.string()),
  environment: z.optional(EnvironmentSchema),
  host: z.optional(HostSchema),
});
const StudySchema = z.object({
  alias: z.optional(z.string()),
  accession: z.optional(z.string()),
  title: z.optional(z.string()),
  secondary_accession: z.optional(z.string()),
});
const SequencingSchema = z.object({
  accession: z.optional(z.string()),
  instrument_platform: z.optional(z.string()),
  instrument_model: z.optional(z.string()),
  depth: z.optional(z.number()),
});
export const MetadataSchema = z.object({
  id: z.string(),
  first_public: z.optional(z.string()),
  project_name: z.optional(z.string()),
  center_name: z.optional(z.string()),
  broker_name: z.optional(z.string()),
  submission_accession: z.optional(z.string()),
  sample: z.optional(SampleSchema),
  study: z.optional(StudySchema),
  sequencing: z.optional(SequencingSchema),
});

export type Metadata = z.infer<typeof MetadataSchema>;
export type Sequencing = z.infer<typeof SequencingSchema>;
export type Study = z.infer<typeof StudySchema>;
export type Sample = z.infer<typeof SampleSchema>;
export type Host = z.infer<typeof HostSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;
export type Location = z.infer<typeof LocationSchema>;
