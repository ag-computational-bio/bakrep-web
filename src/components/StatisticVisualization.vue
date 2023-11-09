<script setup lang="ts">
import { type StatisticData } from "@/model/StatisticData";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout } from "plotly.js-dist-min";
import { computed, type ComputedRef, onMounted, ref, onBeforeUnmount } from "vue";
import type { PropType } from "vue";
import { z } from "zod";


const props = defineProps({
  inputData: { type: Object as PropType<StatisticData>, required: true },
});

let data: Data[] = [];

const reversedData: ComputedRef<StatisticData> = computed(() => props.inputData.reverse())

data.push({
  y: reversedData.value.map((item) => item.key),
  x: reversedData.value.map((item) => item.count),
  type: "bar",
  orientation: "h",
  name: "count",
} as Data);

const layout = {
  height: 800,
  yaxis: {
    automargin: true,
  },
  xaxis: {
    type: "log",
    // autorange: true,
  },
} as Layout;

const plot = ref()


onMounted(() => {
  Plotly.newPlot(plot.value, data, layout);
});

onBeforeUnmount(() => {
  Plotly.purge(plot.value)
})
</script>

<template>
  <div ref="plot"></div>
</template>
