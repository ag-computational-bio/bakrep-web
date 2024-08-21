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

export const Default: Story = {
  args: {
    modelValue: "test",
    options: ["test1", "test2", "test", "test4", "test5"],
    "onUpdate:modelValue": fn(),
  },
};
