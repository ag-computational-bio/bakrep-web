<template>
  <span
    class="bi"
    :class="icon"
    @click="toggleSort"
    style="cursor: pointer"
  ></span>
</template>
<script setup lang="ts">
import type { SortOption, SortDirection } from "@/model/Search";
import { computed, type PropType } from "vue";

const props = defineProps({
  ordering: { type: Array as PropType<SortOption[]>, default: () => [] },
  sortkey: { type: String },
});
const emit = defineEmits<{
  (e: "update:ordering", key: string, direction: SortDirection | null): void;
}>();

const direction = computed(() => {
  const field = props.ordering.find((o) => o.field === props.sortkey);
  if (!field) return "none";
  return field.ord;
});
const icon = computed(() =>
  direction.value === "asc"
    ? "bi-sort-up"
    : direction.value === "desc"
    ? "bi-sort-down"
    : "bi-arrow-down-up",
);

function toggleSort() {
  if (props.sortkey) {
    if (direction.value == "desc") {
      emit("update:ordering", props.sortkey, "asc");
    } else if (direction.value == "asc")
      emit("update:ordering", props.sortkey, null);
    else emit("update:ordering", props.sortkey, "desc");
  }
}
</script>
