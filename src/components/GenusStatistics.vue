<script setup lang="ts">
import { on } from "events";
import Plotly from "plotly.js-dist-min";
import type { Data } from "plotly.js-dist-min";
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

var data = [
  {
    x: props.inputData.map((item) => item.key),
    y: props.inputData.map((item) => item.count),
    type: "bar",
    name: "count",
  },
] as Data[];

onMounted(() => {
  Plotly.newPlot("genusChart", data);
});
</script>

<template>
  <div id="genusChart"></div>
</template>
