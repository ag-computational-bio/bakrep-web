import { z } from "zod";

const AttributesSchema = z.object({
  type: z.string(),
  filetype: z.string(),
  tool: z.string(),
});
const ResultSchema = z.object({
  md5: z.string(),
  size: z.number(),
  url: z.string(),
  attributes: AttributesSchema,
});
const DatasetSchema = z.object({
  id: z.string(),
  results: z.array(ResultSchema),
});

type Attributes = z.infer<typeof AttributesSchema>;
type Result = z.infer<typeof ResultSchema>;
type Dataset = z.infer<typeof DatasetSchema>;

export type { Attributes, Result, Dataset };
export { AttributesSchema, ResultSchema, DatasetSchema };
