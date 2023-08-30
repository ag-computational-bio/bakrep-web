<template>
  <table v-if="annotation" class="table statstable">
    <tr>
      <th scope="row">Genus:</th>
      <td>{{ annotation.genome.genus }}</td>
    </tr>
    <tr>
      <th scope="row">Species:</th>
      <td>{{ annotation.genome.species }}</td>
    </tr>
    <tr>
      <th scope="row">Strain:</th>
      <td>{{ annotation.genome.strain }}</td>
    </tr>
    <tr>
      <th scope="row">Complete:</th>
      <td>{{ annotation.genome.complete }}</td>
    </tr>
    <tr>
      <th scope="row">Genome size:</th>
      <td>{{ annotation.stats.size }}</td>
    </tr>
    <tr>
      <th scope="row">GC:</th>
      <td>{{ ratioToPercentage(annotation.stats.gc) }}</td>
    </tr>
    <tr>
      <th scope="row">N ratio:</th>
      <td>
        <NRatio :value="annotation.stats.n_ratio"></NRatio>
      </td>
    </tr>
    <tr>
      <th scope="row">Coding ratio:</th>
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
