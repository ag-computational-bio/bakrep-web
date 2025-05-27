import type { Meta, StoryObj } from "@storybook/vue3";

import MetadataCard from "./MetadataCard.vue";
import { fn } from "@storybook/test";
import { ref } from "vue";
const meta: Meta<typeof MetadataCard> = {
  component: MetadataCard,
};

export default meta;
type Story = StoryObj<typeof MetadataCard>;

export const Default: Story = {
  args: {
    metadata: {
      sample: {
        accession: "SAMD00161688",
        secondary_accession: "DRS172409",
        alias: "SAMD00161688",
        collection_date: "2004",
        country: "Japan:Chiba",
        location: {
          type: "Point",
          coordinates: [140.16, 35.58],
        },
        serovar: "Agona",
        strain: "CS04076",
        environment: {
          biome: "anthropogenic",
          feature: "organic",
          material: "organic",
        },
      },
      studies: [
        {
          accession: "PRJDB8025",
          secondary_accession: "DRP006976",
          alias: "DRP006976",
          title:
            "Molecular epidemiology of Salmonella enterica subsp. enterica serovar Agona using whole genome sequence data.",
          project_name: "Salmonella enterica subsp. enterica serovar Agona",
        },
      ],
      runs: [
        {
          accession: "DRR169089",
          instrument: {
            platform: "ILLUMINA",
            model: "NextSeq 500",
          },
          first_public: "2021-03-23",
          submission_accession: "DRA008068",
          center_name: "TUAGRI",
        },
      ],
    },
  },
};
