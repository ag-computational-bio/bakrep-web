<template>
  <div class="col">
    <div class="input-group">
      <label class="input-group-text">From</label>
      <input
        v-model="from"
        class="form-control"
        type="number"
        step="any"
        @keydown.enter="$emit('submit')"
      />
    </div>
  </div>
  <div class="col">
    <div class="input-group">
      <label class="input-group-text">To</label>
      <input
        v-model="to"
        class="form-control"
        type="number"
        step="any"
        @keydown.enter="$emit('submit')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { type PropType, computed } from "vue";
import { type Range } from "@/model/Search";

const props = defineProps({
  value: { type: Object as PropType<Range>, required: true },
});
const emit = defineEmits<{
  (e: "update:value", v: Range): void;
  (e: "submit"): void;
}>();
const from = computed({
  get: () => props.value.from,
  set: (value) => {
    emit("update:value", { ...props.value, from: value });
  },
});
const to = computed({
  get: () => props.value.to,
  set: (value) => {
    emit("update:value", { ...props.value, to: value });
  },
});
</script>
