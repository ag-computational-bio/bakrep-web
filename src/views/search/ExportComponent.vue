<template>
  <ExportProgress v-if="progress" :progress="progress" :error="error" />
  <div class="mt-3">
    <button class="btn btn-sm btn-secondary" @click="test">Export</button>
  </div>
</template>
<script setup lang="ts">
import { useApi } from "@/BakrepApi";
import { saveAs } from "file-saver";
import { ref } from "vue";
import ExportProgress from "./ExportProgress.vue";
import { downloadFullTsv, type ProgressEvent } from "./ExportTsv";

const api = useApi();
function test() {
  error.value = undefined;
  progress.value = { total: 0, count: 0, progress: 0 };
  downloadFullTsv(
    api,
    {
      query: {
        op: "and",
        value: [{ field: "bakta.stats.size", op: ">", value: 7000000 }],
      },
      sort: [{ field: "id", ord: "asc" }],
    },
    {
      onError: (e) => (error.value = e as string),
      onFinished: (d) => {
        data.value = d;
        const blob = new Blob([d], {
          type: "text/tab-separated-values;charset=utf-8",
        });
        saveAs(blob, "bakrep-export.tsv");
      },
      onProgress: (p) => (progress.value = p),
    },
  );
}

const progress = ref<ProgressEvent | undefined>();
const data = ref<string>();
const error = ref<string>();
</script>
