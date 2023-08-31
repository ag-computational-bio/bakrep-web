import { z } from "zod";

const QualitySchema = z.object({
  completeness: z.number(),
  contamination: z.number(),
});

const CalculationSchema = z.object({
  model: z.string(),
  translation_table: z.number(),
  notes: z.string(),
});

const CheckmResultSchema = z.object({
  quality: QualitySchema,
  calculation: CalculationSchema,
});

export type Quality = z.infer<typeof QualitySchema>;
export type Calculation = z.infer<typeof CalculationSchema>;
export type CheckmResult = z.infer<typeof CheckmResultSchema>;

export { CheckmResultSchema, QualitySchema, CalculationSchema };
