<template>
  <GridTable v-if="mlst">
    <GridTitleCell>MLST sequence type:</GridTitleCell>
    <GridCell>{{ mlst[0].sequence_type }}</GridCell>
    <GridTitleCell class="grid-cell text-end fw-bold">Alleles:</GridTitleCell>
    <GridCell>
      <template v-if="!mlst[0].alleles"> - </template>
      <ul v-else class="ps-0 mb-0" style="list-style: none">
        <li v-for="e of Object.entries(mlst[0].alleles)" :key="e[0]">
          {{ e[0] }}: {{ e[1] }}
        </li>
      </ul>
    </GridCell>
    <GridTitleCell class="grid-cell text-end fw-bold">Schema:</GridTitleCell>
    <GridCell>{{ mlst[0].scheme }}</GridCell>
  </GridTable>
  <div v-else>No MLST typing information available</div>
</template>
<script setup lang="ts">
import GridCell from "@/components/GridCell.vue";
import GridTable from "@/components/GridTable.vue";
import GridTitleCell from "@/components/GridTitleCell.vue";
import type { MlstResult } from "@/model/MlstResults";

const props = defineProps<{
  mlst: MlstResult;
}>();
const emit = defineEmits<{}>();
</script>
