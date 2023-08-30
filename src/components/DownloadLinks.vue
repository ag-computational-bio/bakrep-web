<template>
  <ul v-if="dataset">
    <li v-for="result in dataset.results" :key="result.md5">
      <a :href="result.url" target="_blank" download>
        {{ getUrlTitle(result.url) }}
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Dataset } from '@/model/Dataset';
import type { PropType } from 'vue';

defineProps({
  dataset: { type: Object as PropType<Dataset> },
});

function getUrlTitle(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1];
}
</script>
