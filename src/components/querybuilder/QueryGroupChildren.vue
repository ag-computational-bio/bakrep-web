<template>
  <template v-for="(child, idx) of children" :key="idx">
    <QueryGroup
      v-if="'op' in child && (child.op == 'and' || child.op == 'or')"
      :index="idx"
      :query="child"
      :options="options"
      :rules="rules"
      :depth="depth + 1"
      @update:query="updateQuery"
      @remove:query="removeQuery"
    />
    <QueryNested
      v-if="'op' in child && child.op == 'nested'"
      :index="idx"
      :query="child"
      :options="options"
      :rules="rules"
      :depth="depth + 1"
      @update:query="updateQuery"
      @remove:query="removeQuery"
    />
    <QueryLeaf
      v-if="isLeafQuery(child)"
      :index="idx"
      :query="child"
      :options="options"
      :rules="rules"
      :depth="depth + 1"
      @update:query="updateQuery"
      @remove:query="removeQuery"
    />
  </template>
</template>
<script setup lang="ts">
import { isLeafQuery, type Query } from "@/model/Search";
import type { PropType } from "vue";
import QueryGroup from "./QueryGroup.vue";
import QueryLeaf from "./QueryLeaf.vue";
import type { NestedRule, QueryBuilderOptions, Rule } from "./Rule";
import QueryBuilder from "./QueryBuilder.vue";
import QueryNested from "./QueryNested.vue";

const props = defineProps({
  children: { type: Array as PropType<Query[]>, default: () => [] },
  depth: { type: Number as PropType<number>, default: 0 },
  options: { type: Object as PropType<QueryBuilderOptions>, default: 0 },
  rules: { type: Array as PropType<Rule[]>, default: [] },
});
const emit = defineEmits<{ (e: "update:children", v: Query[]): void }>();

function updateQuery(index: number, query: Query) {
  const newChildren = [...props.children];
  newChildren[index] = query;
  emit("update:children", newChildren);
}
function removeQuery(index: number) {
  const newChildren = [...props.children];
  newChildren.splice(index, 1);
  emit("update:children", newChildren);
}
</script>
