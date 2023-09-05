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
  return Math.round(entry.bakta.stats.size / 1000).toLocaleString("en") + " KB";
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

let drag = false;

function passOrdering(sortkey: string, newdirection: SortDirection | null) {
  emit("update:ordering", sortkey, newdirection);
}

</script>

<template>
  <div class="rounded bg-light shadow-sm">
    <table class="mt-3 table table-hover">
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
              sortkey="gtdbtk.classification.species.keyword"
              @update:ordering="passOrdering"
            />
          </th>
          <th scope="col">
            ST Type
            <SortSymbol
              :ordering="ordering"
              sortkey="mlst.sequence_type.keyword"
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
        </tr>
      </thead>
      <tbody>
        <template v-for="entry in entries" :key="entry.id">
          <tr
            @mousedown="drag = false"
            @mousemove="drag = true"
            @mouseup="
              if (!drag) {
                $router.push({
                  name: 'result',
                  params: { id: entry.id, title: entry.id },
                });
              }
            "
            class="pointer"
          >
            <td scope="row">{{ entry.id }}</td>
            <td>{{ gc(entry) }}</td>
            <td>{{ contigs(entry) }}</td>
            <td>
              {{ genomeSize(entry) }}
            </td>
            <td>{{ species(entry) }}</td>
            <td class="text-nowrap">{{ sequenceType(entry) }}</td>
            <td>{{ completeness(entry) }} %</td>
            <td>{{ contamination(entry) }} %</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style>
.pointer {
  cursor: pointer;
}
</style>
