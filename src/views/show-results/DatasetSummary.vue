<template>
  <table class="table statstable">
    <template v-if="annotation">
      <tr>
        <th scope="row">ID:</th>
        <td><a class="fw-bold p-0" style="color: gray" :href="'https://www.ebi.ac.uk/biosamples/samples/' + id" target="_blank">{{ id }}</a></td>
      </tr>
      <tr>
        <th scope="row">Species:</th>
        <td>{{ annotation.genome.genus + " " + annotation.genome.species }}</td>
      </tr>
      <tr>
        <th scope="row">Strain:</th>
        <td>{{ annotation.genome.strain }}</td>
      </tr>
      <tr>
        <th scope="row">Genome size:</th>
        <td>{{ annotation.stats.size.toLocaleString('gb') + " bp" }}</td>
      </tr>
      <tr>
        <th scope="row">GC:</th>
        <td>{{ ratioToPercentage(annotation.stats.gc) }}</td>
      </tr>
    </template>
    <template v-else>
      <tr>
        <th scope="row">There is no bakta file availabe.</th>
      </tr>
    </template>
    <template v-if="checkm">
      <tr>
        <th scope="row">Completeness:</th>
        <td>{{ checkm.quality.completeness + " %" }}</td>
      </tr>
      <tr>
        <th scope="row">Contamination:</th>
        <td>{{ checkm.quality.contamination + " %" }}</td>
      </tr>
    </template>
    <template v-else>
      <tr>
        <th scope="row">There is no checkm file available.</th>
      </tr>
    </template>
  </table>
</template>
<script setup lang="ts">
import type { BaktaResult } from "@/model/BaktaResults";
import type { CheckmResult } from "@/model/CheckmResults";
import { ratioToPercentage } from "@/util";
import { computed, type PropType } from "vue";

const props = defineProps({
  annotation: { type: Object as PropType<BaktaResult> },
  checkm: { type: Object as PropType<CheckmResult> },
  id: { type: String },
});
</script>
