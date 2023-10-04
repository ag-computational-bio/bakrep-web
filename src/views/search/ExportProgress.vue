<template>
  <div class="d-flex justify-content-between align-items-end progress-info">
    <div>
      <div v-if="state === 'loading'">
        <div
          style="width: 12px; height: 12px; border-width: 0.2rem"
          class="spinner-border text-secondary me-1"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
        <label :class="textColor">Preparing tsv data</label>
      </div>
      <div v-if="state === 'failed'">
        <label :class="textColor">
          <span class="bi bi-exclamation-triangle"></span> {{ error }}
        </label>
      </div>
      <div v-if="state === 'finished'">
        <label :class="textColor">
          <span class="bi bi-check-circle"></span> Tsv preparation completed
        </label>
      </div>
    </div>
    <label :class="textColor">{{ progress.count }}/{{ progress.total }}</label>
  </div>
  <div
    class="progress"
    role="progressbar"
    aria-label="Tsv export progress"
    :aria-valuenow="progress.progress"
    aria-valuemin="0"
    aria-valuemax="1"
  >
    <div
      class="progress-bar progress-bar-animated"
      :class="progressColor"
      :style="`width: ${progress.progress * 100}%`"
    >
      {{ Math.floor(progress.progress * 100) }} %
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, type PropType } from "vue";
import { type ProgressEvent } from "./ExportTsv";

const props = defineProps({
  progress: { type: Object as PropType<ProgressEvent>, required: true },
  error: { type: String, required: false },
});

const state = computed(() => {
  if (props.error) return "failed";
  if (props.progress.total === 0 || props.progress.count < props.progress.total)
    return "loading";
  return "finished";
});

const textColor = computed(() => {
  switch (state.value) {
    case "loading":
      return "text-secondary";
    case "failed":
      return "text-danger";
    case "finished":
      return "text-success";
  }
  return "text-secondary";
});
const progressColor = computed(() => {
  switch (state.value) {
    case "loading":
      return "text-bg-secondary";
    case "failed":
      return "text-bg-danger";
    case "finished":
      return "text-bg-success";
  }
  return "text-bg-secondary";
});
</script>
