import type { Meta, StoryObj } from "@storybook/vue3";

import Pagination from "./Pagination.vue";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Empty: Story = {};
export const SinglePage: Story = {
  args: {
    value: {
      limit: 20,
      offset: 0,
      total: 10,
    },
  },
};
export const MultiplePages: Story = {
  args: {
    value: {
      limit: 20,
      offset: 200,
      total: 1000,
    },
  },
};
