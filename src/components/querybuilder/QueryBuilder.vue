<template>
  <div class="query-builder">
    <QueryGroup
      :index="0"
      :depth="0"
      :query="query"
      :rules="rules"
      :options="options"
      @update:query="updateQuery"
      @remove:query="removeQuery"
      @submit="emit('submit')"
    />
  </div>
</template>
<script setup lang="ts">
import type { CompoundQuery, Query } from "@/model/Search";
import type { QueryBuilderOptions, Rule, RuleOp } from "./Rule";
import type { PropType } from "vue";
import QueryGroup from "./QueryGroup.vue";

const props = defineProps({
  options: {
    type: Object as PropType<QueryBuilderOptions>,
    default: () => ({
      maxDepth: 3,
      labels: {
        removeRule: "&times;",
        resetGroup: "&circlearrowleft;",
        removeGroup: "&times;",
        matchType: "Type",
        matchTypes: {
          or: "At least one must match",
          and: "All must match",
        },
        addRule: "Add field",
        addGroup: "Add group",
        textInputPlaceholder: "Enter search",
      },
      defaultValue: (r: Rule, op: RuleOp) =>
        r.type === "text"
          ? ""
          : r.type === "number"
          ? op.label === "[]"
            ? { from: 0, to: 0 }
            : 0
          : undefined,
    }),
  },
  rules: { type: Array as PropType<Rule[]>, default: () => [] },
  query: {
    type: Object as PropType<CompoundQuery>,
    default: () => ({ op: "and", value: [] }),
  },
});

const emit = defineEmits<{
  (e: "update:query", v: Query): void;
  (e: "submit"): void;
}>();

function updateQuery(idx: number, newQuery: Query) {
  emit("update:query", newQuery);
}
function removeQuery(toDelete: Query) {
  const newQuery = { ...props.query };
  const idx = newQuery.value.findIndex((x) => x == toDelete);
  newQuery.value.splice(idx, 1);
}
</script>
<style>
.query-builder .query-builder-group .rule-actions {
  margin-bottom: 20px;
}

.query-builder .query-builder-rule {
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: #f5f5f5;
  border-color: #ddd;
  padding: 15px;
}

.query-builder .depth-1 {
  border-left: 2px solid #8bc34a;
}

.query-builder .depth-2 {
  border-left: 2px solid #00bcd4;
}

.query-builder .depth-3 {
  border-left: 2px solid #ff5722;
}

.query-builder .close {
  opacity: 1;
  color: rgb(150, 150, 150);
}

@media (min-width: 768px) {
  .query-builder .query-builder-rule.form-inline .form-group {
    display: block;
  }
}
</style>
