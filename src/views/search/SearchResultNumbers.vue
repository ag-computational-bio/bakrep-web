<template>
  <div class="col-12 d-flex justify-content-between align-items-end">
    <div class="fs-tiny">
      Showing search results {{ positionInResults.firstElement }}-{{
        positionInResults.lastElement
      }}
      of {{ pagination.total }} results
    </div>
    <div v-if="pagination.total > 0">
      <button
        class="btn btn-sm btn-link link-secondary"
        @click="performExport"
        :disabled="exportInProgress"
      >
        Export as tsv
      </button>
    </div>
  </div>
  <div class="col-12">
    <ExportProgress v-if="progress" :progress="progress" :error="exportError" />
  </div>
</template>
<script setup lang="ts">
import type { BakrepApi } from "@/BakrepApi";
import {
  toPosition,
  type PaginationData,
  type PositionInResult,
} from "@/components/pagination/Pagination";
import type { Query } from "@/model/Search";
import { useExportTsv } from "./ExportTsv";
import { computed, onUnmounted } from "vue";
import ExportProgress from "./ExportProgress.vue";

const props = defineProps<{
  pagination: PaginationData;
  api: BakrepApi;
  query: Query;
}>();

const emit = defineEmits<{
  (e: "exporting"): void;
  (e: "exportDone"): void;
  (e: "exportFailed", err: unknown): void;
}>();

const positionInResults = computed<PositionInResult>(() =>
  toPosition(props.pagination),
);
const {
  cancelTsvExport,
  exportError,
  exportInProgress,
  exportTsv,
  progress,
  resetTsvExport,
} = useExportTsv(props.api);

onUnmounted(() => {
  cancelTsvExport();
});

function performExport() {
  emit("exporting");
  exportTsv(props.query, props.pagination)
    .then(() => emit("exportDone"))
    .catch((err) => emit("exportFailed", err));
}
defineExpose({ resetTsvExport });
</script>
