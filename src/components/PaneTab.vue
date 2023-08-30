<script setup lang="ts">
import type { Tab } from '@/views/show-results/ResultView.vue'
import type { PropType } from 'vue';

defineProps({
  tab: { type: Object as PropType<Tab>, required: true },
  active: { type: Boolean, required: false },
});
</script>

<template>
  <li class="nav-item">
    <a class="nav-link" :class="{ active }" href="#">{{ tab.name }}</a>
  </li>
</template>
