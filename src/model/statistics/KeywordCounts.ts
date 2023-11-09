import { z } from "zod";

const KeywordCountSchema = z.object({
  count: z.number(),
  key: z.string(),
});

const KeywordCountsSchema = z.array(KeywordCountSchema);

export type KeywordCountEntry = z.infer<typeof KeywordCountSchema>;
export type KeywordCounts = z.infer<typeof KeywordCountsSchema>;

export { KeywordCountSchema, KeywordCountsSchema };
