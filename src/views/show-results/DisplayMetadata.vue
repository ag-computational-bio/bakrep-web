<script setup lang="ts">
import type { Metadata } from "@/model/Metadata";
import type { PropType } from "vue";
import EnvironmentMetadata from "@/components/EnvironmentMetadata.vue";

const props = defineProps({
  id: { type: String },
  metadata: { type: Object as PropType<Metadata>, required: true },
});
</script>

<template>
  <table>
    <tbody>
      <tr>
        <th class="text-end">Collection Date:</th>
        <td class="ps-5" v-if="metadata.sample?.collection_date">
          {{ metadata.sample?.collection_date }}
        </td>
        <td class="ps-5" v-else>?</td>
      </tr>
      <tr>
        <th class="text-end">Country:</th>
        <td class="ps-5" v-if="metadata.sample?.country">
          {{ metadata.sample?.country }}
        </td>
        <td class="ps-5" v-else>?</td>
      </tr>
      <tr>
        <th class="text-end">Environment:</th>
      </tr>
      <template v-if="metadata.sample">
        <EnvironmentMetadata :environment="metadata.sample.environment" />
      </template>
      <tr>
        <th class="text-end">Isolation Source:</th>
        <td class="ps-5" v-if="metadata.sample?.isolation_source">
          {{ metadata.sample?.isolation_source }}
        </td>
        <td class="ps-5" v-else>?</td>
      </tr>
    </tbody>
  </table>
</template>
