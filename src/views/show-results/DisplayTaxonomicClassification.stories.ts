import type { Meta, StoryObj } from "@storybook/vue3";

import DisplayTaxonomicClassification from "./DisplayTaxonomicClassification.vue";
const meta: Meta<typeof DisplayTaxonomicClassification> = {
  component: DisplayTaxonomicClassification,
};

export default meta;
type Story = StoryObj<typeof DisplayTaxonomicClassification>;

export const Default: Story = {
  args: {
    gtdb: {
      classification: {
        domain: "Bacteria",
        phylum: "Bacillota_A",
        class: "Clostridia",
        order: "Tissierellales",
        family: "Peptoniphilaceae",
        genus: "Anaerococcus",
        species: "Anaerococcus octavius",
      },
      closest_genome_reference: "GCF_900445265.1",
      classification_method: "ani_screen",
      warnings: "NaN",
    },
  },
};

export const Missing: Story = {
  args: {},
};
