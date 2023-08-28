import { z } from "zod";

const AllelSchema = z.set(z.string());

const MlstEntrySchema = z.object({
  allels: z.object({
    AllelSchema,
  }),
  id: z.string(),
  sequence_tye: z.string(),
  scheme: z.string(),
  filename: z.string(),
});

const MlstResultSchema = z.array(MlstEntrySchema);

export type Allels = z.infer<typeof AllelSchema>;
export type MlstEntry = z.infer<typeof MlstEntrySchema>;
export type MlstResult = z.infer<typeof MlstResultSchema>;

export { MlstResultSchema, AllelSchema, MlstEntrySchema };
