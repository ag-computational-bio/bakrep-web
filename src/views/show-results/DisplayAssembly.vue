<template>
  <table v-if="bakta && checkm" class="table">
    <tr>
      <th scope="row" class="label">Size</th>
      <td class="value">{{ bakta.stats.size }}</td>
    </tr>
    <tr>
      <th scope="row" class="label">No. Sequences</th>
      <td class="value">{{ bakta.stats.no_sequences }}</td>
    </tr>
    <tr>
      <th scope="row" class="label">Completeness</th>
      <td class="value">{{ checkm.quality.completeness }}</td>
    </tr>
    <tr>
      <th scope="row" class="label">n50</th>
      <td class="value">{{ bakta.stats.n50 }}</td>
    </tr>
    <tr>
      <th scope="row" class="label">Translation Table</th>
      <td class="value">{{ bakta.genome.translation_table }}</td>
    </tr>
    <tr>
      <th scope="row" class="label">Gram</th>
      <td class="value">{{ bakta.genome.gram }}</td>
    </tr>
  </table>
  <div v-else class="rounded bg-info">
    We are missing the files to display the content here.
    <ul>
      <li v-if="!bakta">bakta file is missing.</li>
      <li v-if="!checkm">Checkm file is missing.</li>
    </ul>
  </div>
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

<style>
th {
  font-weight: bold;
}

td {
  font-weight: bold;
  color: gray;
}
</style>
