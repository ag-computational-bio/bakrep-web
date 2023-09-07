<template>
  <div class="card query-builder-group" :class="'depth-' + depth">
    <div class="card-header">
      <div v-if="title">
        <label>{{ title }}</label>
      </div>
      <div class="d-flex justify-content-between">
        <div class="row gy-2 gx-3 align-items-center">
          <div class="col-auto">
            <label class="me-2">
              {{ options.labels.matchType }}
            </label>
          </div>
          <div class="col-auto">
            <select
              id="query-builder-match-type"
              v-model="op"
              class="form-select"
            >
              <option value="or">{{ options.labels.matchTypes.or }}</option>
              <option value="and">{{ options.labels.matchTypes.and }}</option>
            </select>
          </div>
        </div>
        <button
          v-if="depth > 0"
          type="button"
          class="close ml-auto btn"
          @click="emit('remove:query', index)"
          v-html="options.labels.removeGroup"
        ></button>
        <button
          v-if="depth == 0"
          type="button"
          class="close ml-auto btn"
          @click="resetGroup"
          v-html="options.labels.resetGroup"
        ></button>
      </div>
    </div>

    <div class="card-body">
      <div class="rule-actions">
        <div class="row gy-2 gx-3 align-items-center">
          <div class="col-auto">
            <select v-model="selectedRule" class="form-select mr-2">
              <option v-for="(rule, idx) in rules" :key="idx" :value="idx">
                {{ rule.label }}
              </option>
            </select>
          </div>
          <div class="col-auto">
            <button
              type="button"
              class="btn btn-secondary mr-2"
              @click="addRule"
            >
              {{ options.labels.addRule }}
            </button>
          </div>
          <div class="col-auto">
            <button
              v-if="depth < options.maxDepth"
              type="button"
              class="btn btn-secondary"
              @click="addGroup"
            >
              {{ options.labels.addGroup }}
            </button>
          </div>
        </div>
      </div>

      <QueryGroupChildren
        :children="query.value"
        :depth="depth"
        :options="options"
        :rules="rules"
        @update:children="updateChildren"
        @submit="emit('submit')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { CompoundQuery, Query } from "@/model/Search";
import { ref, type PropType, computed } from "vue";
import type { QueryBuilderOptions, Rule } from "./Rule";
import QueryGroupChildren from "./QueryGroupChildren.vue";

const props = defineProps({
  index: { type: Number as PropType<number>, required: true },
  depth: { type: Number as PropType<number>, required: true },
  query: { type: Object as PropType<CompoundQuery>, required: true },
  options: { type: Object as PropType<QueryBuilderOptions>, required: true },
  rules: { type: Array as PropType<Rule[]>, default: () => [] },
  title: { type: String, default: "" },
});

const emit = defineEmits<{
  (e: "update:query", i: number, v: CompoundQuery): void;
  (e: "remove:query", i: number): void;
  (e: "submit"): void;
}>();

const op = computed({
  get: () => props.query.op,
  set: (v) => emit("update:query", props.index, { ...props.query, op: v }),
});

const selectedRule = ref(0);

function addGroup() {
  const newQuery = {
    ...props.query,
    value: [...props.query.value, { op: "and", value: [] }],
  };
  emit("update:query", props.index, newQuery);
}
function addRule() {
  if (selectedRule.value !== undefined) {
    const rule = props.rules[selectedRule.value];

    if (rule.type === "nested") {
      const newQuery = {
        ...props.query,
        value: [
          ...props.query.value,
          {
            field: rule.field,
            op: "nested",
            value: {
              op: "and",
              value: [],
            },
          },
        ],
      };

      emit("update:query", props.index, newQuery);
    } else if ("ops" in rule) {
      const newQuery = {
        ...props.query,
        value: [
          ...props.query.value,
          {
            field: rule.field,
            op: rule.ops[0].label,
            value: props.options.defaultValue(rule, rule.ops[0]),
          },
        ],
      };

      emit("update:query", props.index, newQuery);
    }
  }
}

function updateChildren(newChildren: Query[]) {
  const newQuery = {
    ...props.query,
    value: newChildren,
  };
  emit("update:query", props.index, newQuery);
}
function resetGroup() {
  const newQuery = {
    ...props.query,
    value: [],
  };
  emit("update:query", props.index, newQuery);
}
</script>
<style></style>
