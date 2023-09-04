<script setup lang="ts">
import type { BakrepSearchResultEntry } from "@/model/BakrepSearchResult";
import type { PropType } from "vue";

defineProps({
  entries: {
    type: Array as PropType<BakrepSearchResultEntry[]>,
    default: () => [],
  },
});

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
</script>

<template>
  <div class="rounded bg-light shadow-sm">
    <table class="mt-3 table table-hover">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">GC</th>
          <th scope="col">Contigs</th>
          <th scope="col">Genome Size</th>
          <th scope="col">Species</th>
          <th scope="col">ST Type</th>
          <th scope="col">Quality & Contamination</th>
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
            <td>{{ completeness(entry) }} % / {{ contamination(entry) }} %</td>
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
