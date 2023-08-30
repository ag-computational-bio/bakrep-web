<script setup lang="ts">
import type { Tab } from '@/model/Tabs';
import type { PropType } from 'vue';

defineProps({
  tab: { type: Object as PropType<Tab>, required: true },
  active: { type: Boolean, required: false },
});
</script>

<template>
  <li class="nav-item">
    <a class="nav-link" :class="{ active }" href="#">{{ tab.title }}</a>
  </li>
</template>
