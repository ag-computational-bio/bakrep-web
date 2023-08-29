<template>
  <table v-if="annotation" class="table">
    <tr>
      <th scope="row" class="label">Genus</th>
      <td class="value">{{ annotation.genome.genus }}</td>
    </tr>
    <tr>
      <th scope="row" class="label">Species</th>
      <td class="value">{{ annotation.genome.species }}</td>
    </tr>
    <tr>
      <th scope="row" class="label">Strain</th>
      <td class="value">{{ annotation.genome.strain }}</td>
    </tr>
    <tr>
      <th scope="row" class="label">Complete</th>
      <td class="value">{{ annotation.genome.complete }}</td>
    </tr>
    <tr>
      <th scope="row" class="label">Size</th>
      <td class="value">{{ annotation.stats.size }}</td>
    </tr>
    <tr>
      <th scope="row" class="label">GC Ratio</th>
      <td class="value">{{ ratioToPercentage(annotation.stats.gc) }}</td>
    </tr>
    <tr>
      <th scope="row" class="label">n Ratio</th>
      <td class="value">
        <NRatio :value="annotation.stats.n_ratio"></NRatio>
      </td>
    </tr>
    <tr>
      <th scope="row" class="label">Coding Ratio</th>
      <td class="value">
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
