<template>
  <ul
    v-for="(group, key) of groups"
    class="fw-bold text-secondary"
    style="list-style-type: none"
  >
    <li>
      {{ key }}
      <ul v-for="r of group" class="fw-normal">
        <a :href="r.url" target="_blank" download>
          {{ getUrlTitle(r.url) }}
        </a>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Dataset, Result } from "@/model/Dataset";
import { computed, type PropType } from "vue";

const props = defineProps({
  dataset: { type: Object as PropType<Dataset> },
});

function getUrlTitle(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1];
}

const groups = computed(() => {
  const o: Record<string, Result[]> = {};
  if (props.dataset) {
    props.dataset.results.forEach((r) => {
      const type = r.attributes.type;
      if (!(type in o)) o[type] = [];
      o[r.attributes.type].push(r);
    });
  }
  return o;
});
</script>
