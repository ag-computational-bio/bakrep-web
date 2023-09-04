import { z } from "zod";

const MlstEntrySchema = z.object({
  alleles: z.optional(z.nullable(z.record(z.string()))),
  id: z.string(),
  sequence_type: z.string(),
  scheme: z.string(),
  filename: z.string(),
});

const MlstResultSchema = z.array(MlstEntrySchema);

export type MlstEntry = z.infer<typeof MlstEntrySchema>;
export type MlstResult = z.infer<typeof MlstResultSchema>;

export { MlstResultSchema, MlstEntrySchema };
