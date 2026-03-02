<script setup lang="ts">
import GridCell from "@/components/GridCell.vue";
import GridTable from "@/components/GridTable.vue";
import GridTitleCell from "@/components/GridTitleCell.vue";
import type { Metadata } from "@/model/Metadata";
defineProps<{
  metadata?: Metadata;
}>();

function getText(value: string | undefined): string {
  return value ? value : "?";
}
</script>

<template>
  <GridTable>
    <template v-if="metadata">
      <GridTitleCell>Strain:</GridTitleCell>
      <GridCell>
        {{ getText(metadata.sample?.strain) }}
      </GridCell>
      <GridTitleCell>Sub strain:</GridTitleCell>
      <GridCell>
        {{ getText(metadata.sample?.sub_strain) }}
      </GridCell>

      <GridTitleCell class="mt-2">Collection Date:</GridTitleCell>
      <GridCell class="mt-2">
        {{ getText(metadata.sample?.collection_date) }}
      </GridCell>

      <GridTitleCell>Country:</GridTitleCell>
      <GridCell>
        {{ getText(metadata.sample?.country) }}
      </GridCell>

      <GridTitleCell class="mt-2">Environment</GridTitleCell>
      <GridCell> </GridCell>

      <GridTitleCell>Biome:</GridTitleCell>
      <GridCell>
        {{ getText(metadata.sample?.environment?.biome) }}
      </GridCell>

      <GridTitleCell>Feature:</GridTitleCell>
      <GridCell>
        {{ getText(metadata.sample?.environment?.feature) }}
      </GridCell>

      <GridTitleCell>Material:</GridTitleCell>
      <GridCell>
        {{ getText(metadata.sample?.environment?.material) }}
      </GridCell>

      <GridTitleCell>Isolation Source:</GridTitleCell>
      <GridCell>
        {{ getText(metadata.sample?.isolation_source) }}
      </GridCell>
    </template>
    <template v-else> No metadata available </template>
  </GridTable>
</template>
