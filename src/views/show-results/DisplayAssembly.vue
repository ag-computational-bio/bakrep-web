<template>
  <table v-if="bakta && checkm" class="table">
    <tr>
      <th scope="row">Size</th>
      <td>{{ bakta.stats.size }}</td>
    </tr>
    <tr>
      <th scope="row">No. Sequences</th>
      <td>{{ bakta.stats.no_sequences }}</td>
    </tr>
    <tr>
      <th scope="row">Completeness</th>
      <td>{{ checkm.quality.completeness }}</td>
    </tr>
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
  </table>
  <h3>Contig Lengths:</h3>
  <div v-if="bakta">
    <ContigBar :sequences="bakta.sequences" :length="bakta.stats.size" :n50="bakta.stats.n50" />
  </div>
</template>

<script setup lang="ts">
import type { BaktaResult } from '@/model/BaktaResults';
import type { CheckmResult } from '@/model/CheckmResults';
import type { PropType } from 'vue';
import ContigBar from '@/components/ContigBar.vue';

defineProps({
  bakta: { type: Object as PropType<BaktaResult>, default: undefined },
  checkm: { type: Object as PropType<CheckmResult>, default: undefined },
});
</script>
