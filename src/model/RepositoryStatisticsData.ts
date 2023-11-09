import { z } from "zod";

const RepositoryStatisticsDataSchema = z.object({
  genera: z.number(),
  datasets: z.number(),
  species: z.number(),
});

export type RepositoryStatisticsData = z.infer<
  typeof RepositoryStatisticsDataSchema
>;

export { RepositoryStatisticsDataSchema };
