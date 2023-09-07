import type { Meta, StoryObj } from "@storybook/vue3";

import QueryBuilder from "./QueryBuilder.vue";
import type { CompoundQuery } from "@/model/Search";
import { ref } from "vue";

const meta: Meta<typeof QueryBuilder> = {
  component: QueryBuilder,
};

export default meta;
type Story = StoryObj<typeof QueryBuilder>;

export const Empty: Story = {};
export const SingleRule: Story = {
  render: (args) => ({
    components: { QueryBuilder },
    setup() {
      var query = ref(args.query);
      function updateQuery(nq: CompoundQuery) {
        args.query = nq;
      }
      return { args, query, updateQuery };
    },
    template: `<QueryBuilder :query=query v-bind="args" v-on:update:query="updateQuery"/><pre>{{args.query}}</pre>`,
  }),
  args: {
    query: {
      op: "and",
      value: [
        {
          op: "==",
          field: "my.text",
          value: "text",
        },
        {
          op: "[]",
          field: "my.number",
          value: { from: 1, to: 100 },
        },
      ],
    },
    rules: [
      {
        label: "Product",
        field: "my.text",
        ops: [
          { label: "==", description: "Equals" },
          { label: "~", description: "Full text search" },
        ],
        type: "text",
      },
      {
        label: "GC Content",
        field: "my.number",
        ops: [
          { label: "==", description: "Equals (==)" },
          { label: "<=", description: "Less equals (<=)" },
          { label: "[]", description: "Between" },
        ],
        type: "number",
      },
    ],
  },
};
