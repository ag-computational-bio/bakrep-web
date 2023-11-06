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
data.push({
  x: props.inputData.map((item) => item.key),
  y: props.inputData.map((item) => item.count),
  type: "bar",
  orientation: "v",
  name: "count",
} as Data);

const layout = {
  yaxis: {
    type: "log",
    autorange: true,
  },
} as Layout;

onMounted(() => {
  Plotly.newPlot("genusChart", data, layout);
});

</script>

<template>
  <div id="genusChart"></div>
</template>
