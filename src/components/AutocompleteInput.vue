<template>
  <div class="autocomplete-input form-control">
    <input
      ref="inputField"
      type="text"
      class="form-control no-form"
      v-model="text"
      @focus="focus"
      @blur="blur"
      @keydown.down.prevent="selectNextItem"
      @keydown.up.prevent="selectPreviousItem"
      @keydown.enter.prevent="emitSelected"
      @keydown.tab="blur"
      @click="focus"
    />
    <div v-if="isFocused && options.length > 0" class="autocomplete-input-list">
      <div
        v-for="(l, idx) of options"
        :class="{ active: idx === selectedIndex }"
        :key="l"
        @mousedown.prevent
        @mouseenter="selectItem(idx)"
        @click="emitSelected"
      >
        {{ l }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
  modelValue: string;
  options: string[];
}>();
const selectedIndex = ref(0);
const isFocused = ref(false);

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const text = computed({
  get: () => props.modelValue,
  set: (x) => emit("update:modelValue", x),
});
function selectNextItem() {
  selectedIndex.value = (selectedIndex.value + 1) % props.options.length;
}
function selectPreviousItem() {
  const next = selectedIndex.value - 1;
  if (next < 0) selectedIndex.value = props.options.length - 1;
  else selectedIndex.value = next;
}
function selectItem(idx: number) {
  selectedIndex.value = idx;
}
function focus() {
  isFocused.value = true;
}
function blur() {
  isFocused.value = false;
}
function emitSelected() {
  emit("update:modelValue", props.options[selectedIndex.value]);
  blur();
}
watch(
  () => props.options,
  (o) => {
    if (selectedIndex.value >= o.length) selectedIndex.value = o.length - 1;
    if (inputField.value === document.activeElement) isFocused.value = true;
  },
);

const inputField = ref<HTMLInputElement>();
</script>
<style>
.autocomplete-input {
  position: relative;
  width: 100%;
  padding: 0;

  input:focus {
    border-bottom: none;
  }
  .autocomplete-input-list {
    position: absolute;
    max-height: 10rem;
    overflow-y: auto;
    z-index: 9;
    border-color: lightgray;
    border-style: solid;
    border-width: 1px;
    border-radius: var(--bs-border-radius);
    width: 100%;
    div {
      padding-left: 0.75rem;
      background-color: white;
    }
    .active {
      background-color: aliceblue;
    }
  }
}
.no-form {
  border: none;
}
</style>
