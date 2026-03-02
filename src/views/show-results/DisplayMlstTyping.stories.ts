import type { Meta, StoryObj } from "@storybook/vue3";

import DisplayMlstTyping from "./DisplayMlstTyping.vue";
import { fn } from "storybook/test";
import { ref } from "vue";
const meta: Meta<typeof DisplayMlstTyping> = {
  component: DisplayMlstTyping,
};

export default meta;
type Story = StoryObj<typeof DisplayMlstTyping>;

export const Default: Story = {
  args: {
    mlst: [
      {
        id: "x",
        filename: "",
        scheme: "my-scheme",
        sequence_type: "123",
        alleles: {
          xxx: "asd",
          xxy: "12",
        },
      },
    ],
  },
};
export const Missing: Story = {
  args: {},
};
