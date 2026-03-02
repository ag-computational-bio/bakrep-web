import type { Meta, StoryObj } from "@storybook/vue3";

import DisplayMetadata from "./DisplayMetadata.vue";
import { fn } from "storybook/test";
import { ref } from "vue";
const meta: Meta<typeof DisplayMetadata> = {
  component: DisplayMetadata,
};

export default meta;
type Story = StoryObj<typeof DisplayMetadata>;

export const Missing: Story = {
  args: {},
};
export const Empty: Story = {
  args: {
    metadata: {
      runs: [],
      sample: {},
      studies: [],
    },
  },
};
