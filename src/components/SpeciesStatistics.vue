<script setup lang="ts">
import Plotly from "plotly.js-dist-min";
import type { Data, Layout } from "plotly.js-dist-min";
import { onMounted } from "vue";
import type { PropType } from "vue";
import { z } from "zod";

const entry = z.object({
  key: z.string(),
  count: z.number(),
});

type InputSchema = z.infer<typeof entry>;

const props = defineProps({
  inputData: { type: Object as PropType<InputSchema[]>, required: true },
});

var data: Data[] = [];
const values = props.inputData;
values.reverse();

data.push({
  y: values.map((item) => item.key),
  x: values.map((item) => item.count),
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

onMounted(() => {
  Plotly.newPlot("speciesChart", data, layout);
});
</script>

<template>
  <div id="speciesChart"></div>
</template>
