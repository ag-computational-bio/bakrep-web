import { z } from "zod";

const RepositoryDataSchema = z.object({
    genera: z.number(),
    datasets: z.number(),
    species: z.number(),
});

export type RepositoryData = z.infer<typeof RepositoryDataSchema>;

export { RepositoryDataSchema };