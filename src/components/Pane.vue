<script setup lang="ts">
import type { Tab } from "@/views/show-results/ResultView.vue";
import Panetab from "./PaneTab.vue";
import type { PropType } from "vue";

defineProps({
  activeItem: { type: String },
  items: { type: Array as PropType<Array<Tab>>, required: true },
});

const emits = defineEmits(["update:value"]);
</script>

<template>
  <!-- Tabbed Navigation -->
  <div class="shadow-sm p-4">
    <ul class="nav nav-pills py-3">
      <Panetab @click="$emit('update:value', item.id)" :tab="item" :active="activeItem == item.id" v-for="item in items" :key="item.id" />
    </ul>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>
