<template>
  <div class="row">
    <div class="label" :class="labelClass">{{ label }}</div>
    <div class="value" :class="valueClass">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps({
  label: { type: String, default: "" },
  value: { type: [String, Number, Boolean], default: "" },
  break: { type: Number, default: 4 },
});

const labelClass = computed(() => "col-" + props.break);
const valueClass = computed(() => "col-" + (12 - props.break));
</script>

<style scoped>
.label {
  font-weight: bold;
}
.value {
  font-weight: bold;
  color: gray;
}
</style>
