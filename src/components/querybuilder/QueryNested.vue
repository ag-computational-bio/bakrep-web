<template>
  <QueryGroup
    :title="rule.label"
    :index="index"
    :query="query.value as CompoundQuery"
    :options="options"
    :rules="nestedRules"
    :depth="depth + 1"
    @update:query="updateQuery"
    @remove:query="removeQuery"
  />
</template>
<script setup lang="ts">
import type { CompoundQuery, NestedQuery, Query } from "@/model/Search";
import { computed, type PropType } from "vue";
import QueryGroup from "./QueryGroup.vue";
import type { NestedRule, QueryBuilderOptions, Rule } from "./Rule";

const props = defineProps({
  index: { type: Number as PropType<number>, default: 0 },
  depth: { type: Number as PropType<number>, default: 0 },
  query: { type: Object as PropType<NestedQuery>, default: {} },
  options: { type: Object as PropType<QueryBuilderOptions>, default: 0 },
  rules: { type: Array as PropType<Rule[]>, default: [] },
});

const emit = defineEmits<{
  (e: "update:query", i: number, v: Query): void;
  (e: "remove:query", i: number): void;
}>();

const rule = computed(
  () => props.rules.find((r) => props.query.field === r.field) as NestedRule,
);
const nestedRules = computed(() => rule.value.rules);
function updateQuery(idx: number, query: Query) {
  emit("update:query", props.index, { ...props.query, value: query });
}
function removeQuery(idx: number) {
  emit("remove:query", props.index);
}
</script>
