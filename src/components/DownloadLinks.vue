<template>
  <ul
    v-for="group of groups"
    :key="group.key"
    class="fw-bold text-secondary"
    style="list-style-type: none"
  >
    <li>
      {{ group.key }}
      <ul v-for="r of group.value" :key="r.url" class="fw-normal">
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
import sortByOrder from "@/util/sort";

const props = defineProps({
  dataset: { type: Object as PropType<Dataset> },
});

function getUrlTitle(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1];
}

const order = ["assembly", "qc", "annotation", "taxonomy"].reduce(
  (a: Record<string, number>, v: string, i: number) => {
    a[v] = i;
    return a;
  },
  {},
);

const groups = computed(() => {
  const o: Record<string, Result[]> = {};
  if (props.dataset) {
    props.dataset.results.forEach((r) => {
      const type = r.attributes.type ? r.attributes.type : "other";
      if (!(type in o)) o[type] = [];
      o[type].push(r);
    });
  }

  const out = Object.entries(o).map((e) => ({ key: e[0], value: e[1] }));
  out.sort(sortByOrder(order, (x) => x.key));

  return out;
});
</script>
