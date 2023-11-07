<script setup lang="ts">
import type { Metadata } from "@/model/Metadata";
import type { PropType } from "vue";

const props = defineProps({
  id: { type: String },
  metadata: { type: Object as PropType<Metadata>, required: true },
});
</script>

<template>
  <table>
    <tbody>
      <tr v-if="metadata.project_name">
        <th class="text-end">Project Name:</th>
        <td class="ps-5">{{ metadata.project_name }}</td>
      </tr>
      <tr v-if="metadata.sample?.collection_date">
        <th class="text-end">Collection Date:</th>
        <td class="ps-5">{{ metadata.sample.collection_date }}</td>
      </tr>
      <tr v-if="metadata.sample?.country">
        <th class="text-end">Country:</th>
        <td class="ps-5">{{ metadata.sample.country }}</td>
      </tr>
      <tr v-if="metadata.sequencing?.instrument_model">
        <th class="text-end">Sequencing Instrument:</th>
        <td class="ps-5">{{ metadata.sequencing?.instrument_model }}</td>
      </tr>
    </tbody>
  </table>
</template>
