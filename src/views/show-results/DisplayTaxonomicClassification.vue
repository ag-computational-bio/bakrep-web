<template>
  <GridTable v-if="gtdb">
    <GridTitleCell class="mb-3">Taxonomy:</GridTitleCell>
    <GridCell class="mb-3">
      <PhylogenyTree :gtdb="gtdb" />
    </GridCell>
    <GridTitleCell>Reference genome:</GridTitleCell>
    <GridCell>
      <a
        class="link-secondary"
        :href="
          'https://www.ncbi.nlm.nih.gov/datasets/genome/' +
          gtdb.closest_genome_reference
        "
        target="_blank"
        >{{ gtdb.closest_genome_reference }}</a
      >
    </GridCell>
    <GridTitleCell>Classification method:</GridTitleCell>
    <GridCell>{{ gtdb.classification_method }}</GridCell>
  </GridTable>
  <div v-else>No taxonomic classification available</div>
</template>
<script setup lang="ts">
import type { GtdbtkResult } from "@/model/GtdbtkResult";
import PhylogenyTree from "./PhylogenyTree.vue";
import GridTable from "@/components/GridTable.vue";
import GridTitleCell from "@/components/GridTitleCell.vue";
import GridCell from "@/components/GridCell.vue";

const props = defineProps<{
  gtdb: GtdbtkResult;
}>();
const emit = defineEmits<{}>();
</script>
