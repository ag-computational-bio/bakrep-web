<script setup lang="ts">
import type { Tab } from "@/model/Tabs";
import PaneTab from "@/components/PaneTab.vue";
import type { PropType } from "vue";

type Action = {
  title: string;
  href: object;
};

defineProps({
  activeItem: { type: String },
  items: { type: Array as PropType<Array<Tab>>, required: true },
  action: { type: Object as PropType<Action>, required: true },
});

const emits = defineEmits(["update:value"]);
</script>

<template>
  <!-- Tabbed Navigation -->
  <div class="shadow-sm p-4">
    <ul class="nav nav-pills py-3">
      <PaneTab @click="$emit('update:value', item.id)" :tab="item" :active="activeItem == item.id" v-for="item in items" :key="item.id" />

      <slot name="action">
        <li class="ms-auto" v-if="action">
          <!-- @TODO: Figure out how to directly download an entry, json? -->
          <a class="btn btn-primary" href="#">{{ action.title }}</a>
        </li>
      </slot>
    </ul>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>
