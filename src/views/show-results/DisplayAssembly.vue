<template>
  <table class="table statstable">
    <template v-if="bakta">
      <tr>
        <th scope="row">Genome size:</th>
        <td>{{ bakta.stats.size.toLocaleString("gb") + " bp" }}</td>
      </tr>
      <tr>
        <th scope="row">GC:</th>
        <td>{{ ratioToPercentage(bakta.stats.gc) }}</td>
      </tr>
      <tr>
        <th scope="row">No. sequences:</th>
        <td>{{ bakta.stats.no_sequences }}</td>
      </tr>
    </template>
    <template v-if="bakta">
      <tr>
        <th scope="row">N50:</th>
        <td>{{ bakta.stats.n50.toLocaleString("gb") + " bp" }}</td>
      </tr>
    </template>
    <template v-else>
      <tr>
        <th scope="row">NA</th>
      </tr>
    </template>
    <template v-if="checkm">
      <tr>
        <th scope="row">Completeness:</th>
        <td>{{ checkm.quality.completeness + " %" }}</td>
      </tr>
    </template>
    <template v-if="checkm">
      <tr>
        <th scope="row">Contamination:</th>
        <td>{{ checkm.quality.contamination + " %" }}</td>
      </tr>
    </template>
    <template v-else>
      <tr>
        <th scope="row">NA</th>
      </tr>
    </template>
  </table>
</template>

<script setup lang="ts">
import type { BaktaResult } from "@/model/BaktaResults";
import type { CheckmResult } from "@/model/CheckmResults";
import type { PropType } from "vue";
import { ratioToPercentage } from "@/util";
import ContigBar from "@/components/ContigBar.vue";

defineProps({
  bakta: { type: Object as PropType<BaktaResult> },
  checkm: { type: Object as PropType<CheckmResult> },
});
</script>
