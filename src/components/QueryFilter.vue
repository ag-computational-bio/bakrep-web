<template>
  <div class="input-group mb-3">
    <span class="input-label input-group-text">{{ label }}:</span>
    <input
      class="form-control"
      type="text"
      v-model.number="$props.modelValue.from"
      @change="$emit('update:modelValue', $props.modelValue)"
    />
    <span class="input-group-text">Min</span>
    <input
      class="form-control"
      type="text"
      v-model.number="$props.modelValue.to"
      @change="$emit('update:modelValue', $props.modelValue)"
    />
    <span class="input-group-text">Max</span>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from "vue";
import type { FilterTuple } from "@/views/BrowseView.vue";

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: Object as PropType<FilterTuple>, required: true },
});

const emits = defineEmits<{
  (e: "update:modelValue", value: FilterTuple): void;
}>();
</script>

<style scoped>
.input-label {
  width: 8.5rem;
}
</style>
