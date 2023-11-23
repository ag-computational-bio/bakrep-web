<script setup lang="ts">
import type { Metadata } from "@/model/Metadata";
import type { PropType } from "vue";

const props = defineProps({
  id: { type: String },
  metadata: { type: Object as PropType<Metadata>, required: true },
});

function getText(value: string | undefined): string {
  return value ? value : "?";
}
</script>

<template>
  <table>
    <tbody>
      <tr>
        <th class="text-end">Collection Date:</th>
        <td class="ps-5">
          {{ getText(metadata.sample?.collection_date) }}
        </td>
      </tr>
      <tr>
        <th class="text-end">Country:</th>
        <td class="ps-5">
          {{ getText(metadata.sample?.country) }}
        </td>
      </tr>
      <tr>
        <th class="text-end">Environment:</th>
      </tr>
      <tr class="ps-2">
        <th class="text-end">Biome:</th>
        <td class="ps-5">
          {{ getText(metadata.sample?.environment?.biome) }}
        </td>
      </tr>
      <tr>
        <th class="text-end">Feature:</th>
        <td class="ps-5">
          {{ getText(metadata.sample?.environment?.feature) }}
        </td>
      </tr>
      <tr>
        <th class="text-end">Material:</th>
        <td class="ps-5">
          {{ getText(metadata.sample?.environment?.material) }}
        </td>
      </tr>
      <tr>
        <th class="text-end">Isolation Source:</th>
        <td class="ps-5">
          {{ getText(metadata.sample?.isolation_source) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
