<template>
  <div v-if="annotation">
    <display-tuple label="Genus:" :value="annotation.genome.genus" />
    <display-tuple label="Species:" :value="annotation.genome.species" />
    <display-tuple label="Strain:" :value="annotation.genome.strain" />
    <display-tuple label="Completeness:" :value="annotation.genome.complete" />
    <display-tuple label="Gram:" :value="annotation.genome.gram" />
    <display-tuple
      label="Translation Table:"
      :value="annotation.genome.translation_table"
    />
    <display-tuple label="Genome Size:" :value="annotation.stats.size" />
    <display-tuple label="GC Ratio:" :value="annotation.stats.gc" />
    <display-tuple label="N Ratio" :value="annotation.stats.n_ratio" />
    <display-tuple label="N50" :value="annotation.stats.n50" />
    <display-tuple
      label="Coding Ratio"
      :value="annotation.stats.coding_ratio"
    />
  </div>
  <div v-else>No bakta result provided</div>
</template>
<script setup lang="ts">
import type { BaktaResult } from "@/model/BaktaResults";
import type { PropType } from "vue";
import DisplayTuple from "@/views/show-results/bakta/DisplayTuple.vue";
defineProps({
  annotation: { type: Object as PropType<BaktaResult>, default: undefined },
});
</script>
