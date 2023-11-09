import { z } from "zod";

const KeywordCountEntrySchema = z.object({
  count: z.number(),
  key: z.string(),
});

const KeywordCountDataSchema = z.array(KeywordCountEntrySchema);

export type KeywordCountEntry = z.infer<typeof KeywordCountEntrySchema>;
export type KeywordCountData = z.infer<typeof KeywordCountDataSchema>;

export { KeywordCountEntrySchema, KeywordCountDataSchema };
