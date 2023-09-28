<template>
  <pre>
    <!-- {{ data }} -->
  </pre>
  {{ stats }}
  <div
    class="progress"
    role="progressbar"
    aria-label="Basic example"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="progress-bar progress-bar-striped progress-bar-animated"
      :style="`width: ${progress}%`"
    ></div>
  </div>

  <div><button @click="test">Export</button></div>
</template>
<script setup lang="ts">
import { useApi } from "@/BakrepApi";
import type { Query, SearchAfter, SortOption } from "@/model/Search";
import { computed, ref } from "vue";
import { saveAs } from "file-saver";

type ExportHandler = {
  onProgress: (progress: number) => void;
  onFinished: (tsv: string) => void;
  onError: (err: unknown) => void;
};

type ExportRequest = {
  query: Query;
  sort: SortOption[];
};

const api = useApi();

function countMatches(s: string, substring: string): number {
  let count = 0;
  let idx = s.indexOf(substring, 0);
  while (idx >= 0) {
    count++;
    idx = s.indexOf(substring, idx + 1);
  }
  return count;
}

function test() {
  exportTsv(
    {
      query: {
        op: "and",
        value: [
          {
            field: "gtdbtk.classification.genus",
            op: "==",
            value: "Chlamydia",
          },
        ],
      },
      sort: [{ field: "id", ord: "asc" }],
    },
    {
      onError: console.log,
      onFinished: (d) => {
        data.value = d;
        const blob = new Blob([d], {
          type: "text/tab-separated-values;charset=utf-8",
        });
        saveAs(blob, "bakrep-export.tsv");
      },
      onProgress: (p) => (progress.value = p * 100),
    },
  );
}

const progress = ref(0);
const data = ref<string>();
const stats = computed(() => {
  if (!data.value) return { lines: 0, header: "" };
  const s = data.value.trim().split("\n");
  return { lines: s.length - 1, header: s[0] };
});
function exportTsv(req: ExportRequest, handler: ExportHandler): void {
  let total = 0;
  let count = 0;
  const chunks: string[] = [];
  function sendQuery(searchAfter: SearchAfter = []) {
    api
      .searchTsv({
        search_after: searchAfter,
        limit: 200,
        query: req.query,
        sort: req.sort,
      })
      .then((resp) => {
        if (resp.total !== total) total = resp.total;
        if (chunks.length === 0) chunks.push(resp.header);
        chunks.push(resp.data);
        count = count + countMatches(resp.data, "\n");

        const progress = total === 0 ? 1 : count / total;
        handler.onProgress(progress);
        if (count === total || resp.data.length === 0) {
          // done
          handler.onFinished(chunks.join(""));
        } else {
          // request next chunk
          sendQuery(resp.search_after);
        }
      })
      .catch(handler.onError);
  }
  sendQuery();
}
</script>
