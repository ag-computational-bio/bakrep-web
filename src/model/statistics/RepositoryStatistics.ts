import { z } from "zod";

const RepositoryStatisticsSchema = z.object({
  genera: z.number(),
  datasets: z.number(),
  species: z.number(),
});

export type RepositoryStatistics = z.infer<typeof RepositoryStatisticsSchema>;

export { RepositoryStatisticsSchema };
