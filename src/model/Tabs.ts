import { z } from "zod";

const TabSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const TabsSchema = z.array(TabSchema);

type Tabs = z.infer<typeof TabsSchema>;
type Tab = z.infer<typeof TabSchema>;

export type { Tabs, Tab };
export { TabsSchema, TabSchema };
