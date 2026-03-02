<template>
  <GridTable>
    <template v-if="bakta">
      <GridTitleCell>Genome size:</GridTitleCell>
      <GridCell>{{ bakta.stats.size.toLocaleString("gb") + " bp" }}</GridCell>

      <GridTitleCell>GC:</GridTitleCell>
      <GridCell>{{ ratioToPercentage(bakta.stats.gc) }}</GridCell>

      <GridTitleCell>No. sequences:</GridTitleCell>
      <GridCell>{{ bakta.stats.no_sequences }}</GridCell>

      <GridTitleCell>N50:</GridTitleCell>
      <GridCell>{{ bakta.stats.n50.toLocaleString("gb") + " bp" }}</GridCell>
    </template>
    <template v-if="checkm">
      <GridTitleCell>Completeness:</GridTitleCell>
      <GridCell>{{ checkm.quality.completeness + " %" }}</GridCell>

      <GridTitleCell>Contamination:</GridTitleCell>
      <GridCell>{{ checkm.quality.contamination + " %" }}</GridCell>
    </template>
  </GridTable>
</template>

<script setup lang="ts">
import type { BaktaResult } from "@/model/BaktaResults";
import type { CheckmResult } from "@/model/CheckmResults";
import type { PropType } from "vue";
import { ratioToPercentage } from "@/util";
import GridTable from "@/components/GridTable.vue";
import GridCell from "@/components/GridCell.vue";
import GridTitleCell from "@/components/GridTitleCell.vue";

defineProps({
  bakta: { type: Object as PropType<BaktaResult> },
  checkm: { type: Object as PropType<CheckmResult> },
});
</script>
