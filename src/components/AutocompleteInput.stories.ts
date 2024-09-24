import type { Meta, StoryObj } from "@storybook/vue3";

import AutocompleteInput from "./AutocompleteInput.vue";
import { fn } from "@storybook/test";
import { ref } from "vue";
const meta: Meta<typeof AutocompleteInput> = {
  component: AutocompleteInput,
  render: (args) => ({
    components: { AutocompleteInput },
    setup() {
      const value = ref(args.modelValue);
      return { value, args };
    },
    template: '<AutocompleteInput v-bind="args" v-model:="value" />',
  }),
};

export default meta;
type Story = StoryObj<typeof AutocompleteInput>;

const options = [
  "test1",
  "test2",
  "test3",
  "test4",
  "test5",
  "test6",
  "abc3",
  "bcd",
];
function lookup(prefix: string): Promise<string[]> {
  const res: string[] = [];
  for (const x of options) {
    if (x.toLowerCase().startsWith(prefix.toLowerCase())) {
      res.push(x);
      if (res.length >= 5) return Promise.resolve(res);
    }
  }
  return Promise.resolve(res);
}

export const Default: Story = {
  args: {
    modelValue: "test",
    lookupFn: lookup,
    "onUpdate:modelValue": fn(),
  },
};
