import type { Meta, StoryObj } from "@storybook/vue3";

import ContigBar from "./ContigBar.vue";
import { fn } from "@storybook/test";
import { computed, ref } from "vue";
import contigs92 from "./92-contigs.json";
import contigs1 from "./1-contig.json";
import contigs6 from "./6-contigs.json";
import contigs9911 from "./9911-contigs.json";
const meta: Meta<typeof ContigBar> = {
  component: ContigBar,
};

export default meta;
type Story = StoryObj<typeof ContigBar>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { ContigBar },
    setup() {
      const datasets = [contigs1, contigs6, contigs92, contigs9911];
      const cur = ref(0);
      const value = computed(() => datasets[cur.value]);

      function toggle() {
        cur.value = (cur.value + 1) % datasets.length;
      }
      return { value, args, toggle };
    },
    template:
      '<button @click="toggle">Toggle dataset</button><ContigBar v-bind="args" :data="value" />',
  }),
};
