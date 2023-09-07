<template>
  <div class="input-group mb-3">
    <span class="input-label input-group-text">{{ label }}:</span>
    <input
      class="form-control"
      type="text"
      v-model.lazy.number="min"
      @change="$emit('update:min', min)"
    />
    <span class="input-group-text">Min</span>
    <input
      class="form-control"
      type="text"
      v-model.lazy.number="max"
      @change="$emit('update:max', max)"
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
  (e: "update:min", min: number): void;
  (e: "update:max", max: number): void;
}>();

const min = ref(props.modelValue.min);
const max = ref(props.modelValue.max);
</script>

<style scoped>
.input-label {
  width: 8.5rem;
}
</style>
