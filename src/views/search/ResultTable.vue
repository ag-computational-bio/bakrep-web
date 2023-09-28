<script setup lang="ts">
import type { BakrepSearchResultEntry } from "@/model/BakrepSearchResult";
import { computed, type PropType } from "vue";
import type { SortDirection, SortOption } from "@/model/Search";
import SortSymbol from "./SortSymbol.vue";

const props = defineProps({
  entries: {
    type: Array as PropType<BakrepSearchResultEntry[]>,
    default: () => [],
  },
  ordering: {
    type: Array as PropType<SortOption[]>,
    default: () => [],
  },
});

const emit = defineEmits<{
  (e: "update:ordering", key: string, direction: SortDirection | null): void;
}>();

function gc(entry: BakrepSearchResultEntry): string {
  if (!entry.bakta) return "?";
  return (entry.bakta.stats.gc * 100).toFixed(2) + " %";
}
function contigs(entry: BakrepSearchResultEntry): string {
  if (!entry.bakta) return "?";
  return "" + entry.bakta.stats.no_sequences;
}
function genomeSize(entry: BakrepSearchResultEntry): string {
  if (!entry.bakta) return "?";
  return (
    (Math.round(entry.bakta.stats.size / 10000) / 100).toLocaleString("en") +
    " Mbp"
  );
}
function species(entry: BakrepSearchResultEntry): string {
  if (!entry.gtdbtk || !entry.gtdbtk.classification.species) return "?";
  return entry.gtdbtk.classification.species;
}
function sequenceType(entry: BakrepSearchResultEntry): string {
  if (!entry.mlst) return "?";
  return entry.mlst.sequence_type;
}
function completeness(entry: BakrepSearchResultEntry): string {
  if (!entry.checkm2) return "?";
  return entry.checkm2.quality.completeness + "";
}
function contamination(entry: BakrepSearchResultEntry): string {
  if (!entry.checkm2) return "?";
  return entry.checkm2.quality.contamination + "";
}

function passOrdering(sortkey: string, newdirection: SortDirection | null) {
  emit("update:ordering", sortkey, newdirection);
}

const showFeatures = computed(() =>
  props.entries.some((x) => x.bakta && x.bakta.features !== undefined),
);
</script>

<template>
  <table class="mt-3 table table-hover table-striped">
    <thead>
      <tr>
        <th scope="col">
          Id
          <SortSymbol
            :ordering="ordering"
            sortkey="id"
            @update:ordering="passOrdering"
          />
        </th>
        <th scope="col">
          GC
          <SortSymbol
            :ordering="ordering"
            sortkey="bakta.stats.gc"
            @update:ordering="passOrdering"
          />
        </th>
        <th scope="col">
          Contigs
          <SortSymbol
            :ordering="ordering"
            sortkey="bakta.stats.no_sequences"
            @update:ordering="passOrdering"
          />
        </th>
        <th scope="col">
          Genome Size
          <SortSymbol
            :ordering="ordering"
            sortkey="bakta.stats.size"
            @update:ordering="passOrdering"
          />
        </th>
        <th scope="col">
          Species
          <SortSymbol
            :ordering="ordering"
            sortkey="gtdbtk.classification.species"
            @update:ordering="passOrdering"
          />
        </th>
        <th scope="col">
          ST Type
          <SortSymbol
            :ordering="ordering"
            sortkey="mlst.sequence_type"
            @update:ordering="passOrdering"
          />
        </th>
        <th scope="col">
          Completeness
          <SortSymbol
            :ordering="ordering"
            sortkey="checkm2.quality.completeness"
            @update:ordering="passOrdering"
          />
        </th>
        <th scope="col">
          Contamination
          <SortSymbol
            :ordering="ordering"
            sortkey="checkm2.quality.contamination"
            @update:ordering="passOrdering"
          />
        </th>
        <th v-if="showFeatures">Features</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="entry in entries" :key="entry.id">
        <tr>
          <td scope="row">
            <router-link
              :to="{
                name: 'result',
                params: { id: entry.id, tab: 'summary' },
              }"
            >
              {{ entry.id }}
            </router-link>
          </td>
          <td>{{ gc(entry) }}</td>
          <td>{{ contigs(entry) }}</td>
          <td>
            {{ genomeSize(entry) }}
          </td>
          <td>{{ species(entry) }}</td>
          <td class="text-nowrap">{{ sequenceType(entry) }}</td>
          <td>{{ completeness(entry) }} %</td>
          <td>{{ contamination(entry) }} %</td>
          <td v-if="showFeatures">
            <ul class="nostyle" v-if="entry.bakta && entry.bakta.features">
              <li v-for="(f, idx) of entry.bakta.features" :key="idx">
                {{ f.gene }} - {{ f.product }}
              </li>
            </ul>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style>
.pointer {
  cursor: pointer;
}
</style>
