<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="query-builder-rule card" :class="'depth-' + depth">
    <div class="d-flex justify-content-between">
      <div class="row gy-2 gx-3 align-items-center flex-grow-1">
        <template v-if="rule && 'ops' in rule">
          <label class="col-2">{{ rule.label }}</label>

          <!-- List of operators (e.g. =, !=, >, <) -->
          <div class="col-2">
            <select
              :value="query.op"
              @change="updateOp"
              class="form-select mr-2"
              :disabled="rule.ops.length == 1"
            >
              <option
                v-for="operator in rule.ops"
                :key="operator.label"
                :value="operator.label"
              >
                {{ operator.description }}
              </option>
            </select>
          </div>

          <!-- Basic text input -->
          <div class="col" v-if="rule.type === 'text'">
            <input
              v-model="value"
              class="form-control"
              type="text"
              :placeholder="options.labels.textInputPlaceholder"
              @keydown.enter="$emit('submit')"
            />
          </div>

          <!-- Basic number input -->
          <template v-else-if="rule.type === 'number'">
            <template v-if="isRange(value) && query.op === '[]'">
              <RangeInput v-model:value="value" @submit="$emit('submit')" />
            </template>
            <template v-else>
              <div class="col">
                <input
                  v-model="value"
                  class="form-control"
                  type="number"
                  step="any"
                  @keydown.enter="$emit('submit')"
                />
              </div>
            </template>
          </template>
          <!-- Basic number input -->
          <template v-else>
            {{ rule }}
            {{ query }}
          </template>
        </template>
      </div>
      <div class="col-auto">
        <button
          type="button"
          class="close ml-auto btn"
          @click="remove"
          v-html="options.labels.removeRule"
        ></button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isRange, type LeafQuery, type Query } from "@/model/Search";
import { type PropType, computed, type Ref } from "vue";
import type { LeafRule, QueryBuilderOptions, Rule } from "./Rule";
import { isNumber } from "chart.js/helpers";
import RangeInput from "./input/RangeInput.vue";

const props = defineProps({
  index: { type: Number as PropType<number>, default: 0 },
  depth: { type: Number as PropType<number>, default: 0 },
  query: { type: Object as PropType<LeafQuery>, default: () => {} },
  options: { type: Object as PropType<QueryBuilderOptions>, required: true },
  rules: { type: Array as PropType<Rule[]>, default: () => [] },
});

const emit = defineEmits<{
  (e: "remove:query", i: number): void;
  (e: "update:query", i: number, q: Query): void;
  (e: "submit"): void;
}>();
const rule: Ref<LeafRule | undefined> = computed(() => {
  return props.rules.find(
    (r) =>
      "field" in props.query && r.field === props.query.field && "ops" in r,
  ) as LeafRule;
});

const value = computed({
  get: () => props.query.value,
  set: (value) =>
    emit("update:query", props.index, {
      ...props.query,
      value: value,
    }),
});

function remove() {
  emit("remove:query", props.index);
}

function updateOp(evt: Event) {
  if (evt.target instanceof HTMLSelectElement) {
    const idx = evt.target.selectedIndex;
    const newQuery = { ...props.query };
    if (rule.value) {
      const op = rule.value.ops[idx];
      if (rule.value.type === "number") {
        if (op.label === "[]" && isNumber(newQuery.value)) {
          newQuery.value = props.options.defaultValue(rule.value, op);
        } else if (op.label != "[]" && isRange(newQuery.value)) {
          newQuery.value = props.options.defaultValue(rule.value, op);
        }
      }
      newQuery.op = op.label as any;
    }
    emit("update:query", props.index, newQuery);
  }
}
</script>
