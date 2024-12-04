<template>
  <h5 v-if="data.type === 'gc'">GC content</h5>
  <h5 v-if="data.type === 'gc-skew'">GC skew</h5>
  <table class="table table-sm">
    <tbody>
      <tr>
        <td class="text-end">Value:</td>
        <td>{{ formatGc(data.value) }}</td>
      </tr>
      <tr v-if="'deviation' in data">
        <td class="text-end">Deviation:</td>
        <td>{{ formatGc(data.deviation) }}</td>
      </tr>
      <tr>
        <td class="text-end">Mean:</td>
        <td>{{ formatGc(data.mean) }}</td>
      </tr>
      <tr>
        <td class="text-end">Window:</td>
        <td>{{ data.pos }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import { formatGc } from "../../formatters";

export type GcSkewTooltipData = {
  type: "gc-skew";
  mean: number;
  pos: [number, number];
  value: number;
};

export type GcTooltipData = {
  type: "gc";
  mean: number;
  pos: [number, number];
  value: number;
  deviation: number;
};

defineProps<{
  data: GcTooltipData | GcSkewTooltipData;
}>();
</script>
