<template>
  <div class="input-group mb-3">
    <span class="input-label input-group-text">{{ label }}:</span>
    <input class="form-control" type="text" v-model.number="from" />
    <span class="input-group-text">Min</span>
    <input class="form-control" type="text" v-model.number="to" />
    <span class="input-group-text">Max</span>
  </div>
</template>

<script setup lang="ts">
import type { FilterTuple } from "@/views/BrowseView.vue";
import { computed, type PropType } from "vue";

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: Object as PropType<FilterTuple>, required: true },
});

const emits = defineEmits<{
  (e: "update:modelValue", value: FilterTuple): void;
}>();

const from = computed({
  get: () => props.modelValue.from,
  set: (x) => {
    emits("update:modelValue", { ...props.modelValue, from: x });
  },
});
const to = computed({
  get: () => props.modelValue.to,
  set: (x) => {
    emits("update:modelValue", { ...props.modelValue, to: x });
  },
});
</script>

<style scoped>
.input-label {
  width: 8.5rem;
}
</style>
