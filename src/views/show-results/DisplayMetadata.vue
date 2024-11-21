<script setup lang="ts">
import type { Metadata } from "@/model/Metadata";
defineProps<{
  metadata?: Metadata;
}>();

function getText(value: string | undefined): string {
  return value ? value : "?";
}
</script>

<template>
  <table v-if="metadata">
    <tbody>
      <tr>
        <th class="text-end pe-2">Collection Date:</th>
        <td>
          {{ getText(metadata.sample?.collection_date) }}
        </td>
      </tr>
      <tr>
        <th class="text-end pe-2">Country:</th>
        <td>
          {{ getText(metadata.sample?.country) }}
        </td>
      </tr>
      <tr>
        <th class="text-end pt-3">Environment:</th>
      </tr>
      <tr class="ps-2">
        <th class="text-end pe-2">Biome:</th>
        <td>
          {{ getText(metadata.sample?.environment?.biome) }}
        </td>
      </tr>
      <tr>
        <th class="text-end pe-2">Feature:</th>
        <td>
          {{ getText(metadata.sample?.environment?.feature) }}
        </td>
      </tr>
      <tr>
        <th class="text-end pe-2">Material:</th>
        <td>
          {{ getText(metadata.sample?.environment?.material) }}
        </td>
      </tr>
      <tr>
        <th class="text-end pe-2">Isolation Source:</th>
        <td>
          {{ getText(metadata.sample?.isolation_source) }}
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else>No metadata available</div>
</template>
