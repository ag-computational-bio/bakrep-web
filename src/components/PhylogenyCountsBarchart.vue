<script setup lang="ts">
import { type KeywordCountData } from "@/model/KeywordCountData";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout } from "plotly.js-dist-min";
import {
  computed,
  type ComputedRef,
  onMounted,
  ref,
  onBeforeUnmount,
} from "vue";
import type { PropType } from "vue";

const props = defineProps({
  inputData: { type: Object as PropType<KeywordCountData>, required: true },
});

let data: Data[] = [];

const reversedData: ComputedRef<KeywordCountData> = computed(() =>
  [...props.inputData].reverse(),
);

data.push({
  y: reversedData.value.map((item) => item.key),
  x: reversedData.value.map((item) => item.count),
  type: "bar",
  orientation: "h",
  name: "count",
});

const layout: Partial<Layout> = {
  height: 800,
  yaxis: {
    automargin: true,
  },
  xaxis: {
    type: "log",
    // autorange: true,
  },
};

const plot = ref();

onMounted(() => {
  Plotly.newPlot(plot.value, data, layout);
});

onBeforeUnmount(() => {
  Plotly.purge(plot.value);
});
</script>

<template>
  <div ref="plot"></div>
</template>
