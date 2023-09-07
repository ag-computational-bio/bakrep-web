<template>
  <div class="input-group mb-3">
    <span class="input-label input-group-text">{{ label }}:</span>
    <input
      class="form-control"
      type="text"
      v-model.number="min"
      @change="$emit('update:modelValue', {from: min, to: max})"
    />
    <span class="input-group-text">Min</span>
    <input
      class="form-control"
      type="text"
      v-model.number="max"
      @change="$emit('update:modelValue', {from: min, to: max})"
    />
    <span class="input-group-text">Max</span>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from "vue";
import type { filterTouple } from "@/views/BrowseView.vue";

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: Object as PropType<filterTouple>, required: true },
});

const emits = defineEmits<{
  (e: "update:modelValue", value: filterTouple): void;
}>();

const min = ref(props.modelValue.from);
const max = ref(props.modelValue.to);
</script>

<style scoped>
.input-label {
  width: 8.5rem;
}
</style>
