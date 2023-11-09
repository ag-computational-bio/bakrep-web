import { z } from "zod";

const StatisticDataEntrySchema = z.object({
    count: z.number(),
    key: z.string(),
});

const StatisticDataSchema = z.array(StatisticDataEntrySchema);

export type StatisticDataEntry = z.infer<typeof StatisticDataEntrySchema>;
export type StatisticData      = z.infer<typeof StatisticDataSchema>;

export { StatisticDataEntrySchema, StatisticDataSchema };