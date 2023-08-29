<template>
  <table class="table statstable">
    <template v-if="bakta">
      <tr>
        <th scope="row">Size</th>
        <td>{{ bakta.stats.size }}</td>
      </tr>
      <tr>
        <th scope="row">No. Sequences</th>
        <td>{{ bakta.stats.no_sequences }}</td>
      </tr>
    </template>
    <template v-else>
      <tr>
        <th scope="row">There is no bakta file available</th>
      </tr>
    </template>
    <template v-if="checkm">
      <tr>
        <th scope="row">Completeness</th>
        <td>{{ checkm.quality.completeness }}</td>
      </tr>
    </template>
    <template v-else>
      <tr>
        <th scope="row">There is no checkm file available</th>
      </tr>
    </template>
    <template v-if="bakta">
      <tr>
        <th scope="row">n50</th>
        <td>{{ bakta.stats.n50 }}</td>
      </tr>
      <tr>
        <th scope="row">Translation Table</th>
        <td>{{ bakta.genome.translation_table }}</td>
      </tr>
      <tr>
        <th scope="row">Gram</th>
        <td>{{ bakta.genome.gram }}</td>
      </tr>
    </template>
  </table>
  <div v-if="bakta">
    <h3>Contig Lengths:</h3>
    <ContigBar :sequences="bakta.sequences" :length="bakta.stats.size" :n50="bakta.stats.n50" />
  </div>
</template>

<script setup lang="ts">
import type { BaktaResult } from '@/model/BaktaResults';
import type { CheckmResult } from '@/model/CheckmResults';
import type { PropType } from 'vue';
import ContigBar from '@/components/ContigBar.vue';

defineProps({
  bakta: { type: Object as PropType<BaktaResult> },
  checkm: { type: Object as PropType<CheckmResult> },
});
</script>
