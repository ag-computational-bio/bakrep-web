import type { Meta, StoryObj } from "@storybook/vue3";

import BaktaLinearPlot from "./BaktaLinearPlot.vue";
import baktaResult from "@/example-data/bakta-result.json";

import { ref } from "vue";
import type { BaktaResult } from "@/model/BaktaResults";
const meta: Meta<typeof BaktaLinearPlot> = {
  component: BaktaLinearPlot,
};

const result: BaktaResult = baktaResult as BaktaResult;

export default meta;
type Story = StoryObj<typeof BaktaLinearPlot>;

export const Default: Story = {
  args: { sequence: result.sequences[0], features: result.features },
  render: (args) => ({
    components: { BaktaLinearPlot },
    setup() {
      let cur = 0;
      const seq = ref(result.sequences[0]);
      const feat = ref(
        result.features.filter((x) => x.contig === seq.value.id),
      );
      function nextSequence() {
        cur = (cur + 1) % result.sequences.length;
        seq.value = result.sequences[cur];
        feat.value = result.features.filter((x) => x.contig === seq.value.id);
      }
      return { seq, feat, nextSequence, args };
    },
    template:
      '<button @click="nextSequence">Toggle</button><BaktaLinearPlot v-bind="args" :sequence="seq" :features="feat" />',
  }),
};
