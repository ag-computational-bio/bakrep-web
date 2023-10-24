<template>
  <div class="card">
    <div class="card-header">Metadata</div>
    <div class="card-body" v-if="metadata">
      <h5>Project</h5>
      <table class="mb-3">
        <tbody>
          <tr v-for="(e, idx) of project_entries" :key="idx">
            <th class="text-end">{{ e.key }}:</th>
            <td class="ps-5">{{ e.value }}</td>
          </tr>
        </tbody>
      </table>
      <h5>Sample</h5>
      <table class="mb-3">
        <tbody>
          <tr v-for="(e, idx) of sample_entries" :key="idx">
            <th class="text-end">{{ e.key }}:</th>
            <td class="ps-5">{{ e.value }}</td>
          </tr>
        </tbody>
      </table>
      <h5>Sequencing</h5>
      <table class="mb-3">
        <tbody>
          <tr v-for="(e, idx) of sequencing_entries" :key="idx">
            <th class="text-end">{{ e.key }}:</th>
            <td class="ps-5">{{ e.value }}</td>
          </tr>
        </tbody>
      </table>
      <h5>Study</h5>
      <table>
        <tbody>
          <tr v-for="(e, idx) of study_entries" :key="idx">
            <th class="text-end">{{ e.key }}:</th>
            <td class="ps-5">{{ e.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-body" v-else>No metadata available</div>
  </div>
</template>
<script setup lang="ts">
import { type Metadata } from "@/model/Metadata";
import { computed, type PropType } from "vue";
import type JSONPointer from "jsonpointer";
import { compile } from "jsonpointer";

const props = defineProps({
  metadata: { type: Object as PropType<Metadata>, required: false },
});

type EntryDefinition = {
  key: JSONPointer;
  label: string;
};
type Entry = {
  key: string;
  value: unknown;
};
function entry(key: string, label: string) {
  return { key: compile(key), label: label };
}
const sample_entries_definition = [
  entry("/accession", "Accession"),
  entry("/alias", "Alias"),
  entry("/collected_by", "Collected by"),
  entry("/collection_date", "Collection date"),
  entry("/country", "Country"),
  entry("/culture_collection", "Culture collection"),
  entry("/bio_material", "Bio Material"),
  entry("/environment/feature", "Environment feature"),
  entry("/environment/biome", "Environment Biome"),
  entry("/environment/material", "Environment material"),
  entry("/environmental_package", "Environmental package"),
  entry("/environmental_sample", "Environmental sample"),
  entry("/host/sex", "Host sex"),
  entry("/host/status", "Host status"),
  entry("/host/tax_id", "Host taxid"),
  entry("/host/name", "Host"),
  entry("/isolate", "Isolate"),
  entry("/isolation_source", "Isolation source"),
  entry("/location", "Location"),
  entry("/secondary_accession", "Secondary accession"),
  entry("/serotype", "Serotype"),
  entry("/serovar", "Serovar"),
  entry("/strain", "Strain"),
  entry("/sub_strain", "Substrain"),
];

function extractEntries(
  definitions: EntryDefinition[],
  obj: Record<string, unknown> | undefined,
): Entry[] {
  if (obj === undefined) return [];
  const out = [];
  for (const entry of definitions) {
    const value = entry.key.get(obj);
    if (value !== undefined) out.push({ key: entry.label, value: value });
  }

  return out;
}

const sample_entries = computed(() =>
  extractEntries(sample_entries_definition, props.metadata?.sample),
);

const project_entries_definition = [
  entry("/first_public", "First public"),
  entry("/project_name", "Project name"),
  entry("/center_name", "Center name"),
  entry("/broker_name", "Broker name"),
  entry("/submission_accession", "Submission accession"),
];
const project_entries = computed(() =>
  extractEntries(project_entries_definition, props.metadata),
);
const sequencing_entries_definition = [
  entry("/accession", "Accession"),
  entry("/instrument_platform", "Instrument Platform"),
  entry("/instrument_model", "Instrument Model"),
  entry("/depth", "Depth"),
];
const sequencing_entries = computed(() =>
  extractEntries(sequencing_entries_definition, props.metadata?.sequencing),
);
const study_entries_definition = [
  entry("/accession", "Accession"),
  entry("/alias", "Alias"),
  entry("/secondary_accession", "Secondary Accession"),
  entry("/title", "Title"),
];
const study_entries = computed(() =>
  extractEntries(study_entries_definition, props.metadata?.study),
);
</script>
