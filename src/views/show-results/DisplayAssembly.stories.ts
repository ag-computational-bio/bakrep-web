import type { Meta, StoryObj } from "@storybook/vue3";

import DisplayAssembly from "./DisplayAssembly.vue";
import { fn } from "storybook/test";
import { ref } from "vue";
const meta: Meta<typeof DisplayAssembly> = {
  component: DisplayAssembly,
};

export default meta;
type Story = StoryObj<typeof DisplayAssembly>;

export const Default: Story = {
  args: {
    checkm: {
      calculation: { model: "", notes: "", translation_table: 11 },
      quality: { completeness: 90, contamination: 10 },
    },
    bakta: {
      run: {
        start: "",
        end: "",
      },
      sequences: [],
      version: {
        bakta: "",
        db: { type: "", version: "" },
      },
      features: [],
      genome: {},
      stats: {
        coding_ratio: 1,
        gc: 0.44,
        n50: 123456,
        n_ratio: 0,
        no_sequences: 23,
        size: 254634,
      },
    },
  },
};
