<script setup lang="ts">
import type { Sequence } from "@/model/BaktaResults";
import { computed } from "vue";
const props = defineProps({
  sequences: { type: Array<Sequence>, required: true },
  length: { type: Number, required: true },
  n50: { type: Number, required: true },
});

const colors = [
  "bg-primary",
  "bg-secondary",
  "bg-info",
  "bg-success",
  "bg-danger",
  "bg-warning",
];

const sorted_sequences = computed(() =>
  [...props.sequences].sort((a, b) => a.length - b.length).reverse()
);
</script>

<template>
  <div class="progress">
    <div
      v-for="(sequence, index) in sorted_sequences"
      :key="index"
      class="progress-bar"
      :class="[colors[index % 6]]"
      :style="{ width: (sequence.length / props.length) * 100 + '%' }"
    ></div>
  </div>

  <!-- <div class="float-end overlay-box bi-caret-up"></div> -->
</template>

<style>
.overlay-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  background: #666666;
  opacity: 0.8;
  z-index: 1000;
}
</style>
