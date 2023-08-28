<template>
  <table v-if="annotation" class="table">
    <tr>
      <th scope="row">Genus</th>
      <td>{{ annotation.genome.genus }}</td>
    </tr>
    <tr>
      <th scope="row">Species</th>
      <td>{{ annotation.genome.species }}</td>
    </tr>
    <tr>
      <th scope="row">Strain</th>
      <td>{{ annotation.genome.strain }}</td>
    </tr>
    <tr>
      <th scope="row">Complete</th>
      <td>{{ annotation.genome.complete }}</td>
    </tr>
    <tr>
      <th scope="row">Gram</th>
      <td>{{ annotation.genome.gram }}</td>
    </tr>
    <tr>
      <th scope="row">Translation Table</th>
      <td>{{ annotation.genome.translation_table }}</td>
    </tr>
    <tr>
      <th scope="row">No Sequences</th>
      <td>{{ annotation.stats.no_sequences }}</td>
    </tr>
    <tr>
      <th scope="row">Size</th>
      <td>{{ annotation.stats.size }}</td>
    </tr>
    <tr>
      <th scope="row">GC Ratio</th>
      <td>{{ ratioToPercentage(annotation.stats.gc) }}</td>
    </tr>
    <tr>
      <th scope="row">n Ratio</th>
      <td>
        <NRatio :value="annotation.stats.n_ratio"></NRatio>
      </td>
    </tr>
    <tr>
      <th scope="row">n50</th>
      <td>{{ annotation.stats.n50 }}</td>
    </tr>
    <tr>
      <th scope="row">Coding Ratio</th>
      <td>
        {{ ratioToPercentage(annotation.stats.coding_ratio) }}
      </td>
    </tr>
  </table>
  <div v-else>No bakta result provided</div>
</template>
<script setup lang="ts">
import NRatio from "@/components/NRatio.vue";
import type { BaktaResult } from "@/model/BaktaResults";
import { ratioToPercentage } from "@/util";
import type { PropType } from "vue";
defineProps({
  annotation: { type: Object as PropType<BaktaResult>, default: undefined },
});
</script>

<style>
th {
  font-weight: bold;
}

td {
  font-weight: bold;
  color: gray;
}
</style>
