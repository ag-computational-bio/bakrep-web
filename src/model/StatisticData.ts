import { z } from "zod";

const StatisticDataEntrySchema = z.object({
  keywordCounts: z.number(),
  keyword: z.string(),
});

const StatisticDataSchema = z.array(StatisticDataEntrySchema);

export type StatisticDataEntry = z.infer<typeof StatisticDataEntrySchema>;
export type StatisticData = z.infer<typeof StatisticDataSchema>;

export { StatisticDataEntrySchema, StatisticDataSchema };
