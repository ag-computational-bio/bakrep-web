import { z } from "zod";

export const StringCompletionResultSchema = z.array(z.string());

export type StringCompletionResult = z.infer<
  typeof StringCompletionResultSchema
>;
