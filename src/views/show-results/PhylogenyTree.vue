<template>
  <div v-for="(entry, index) in entries" :key="index" :title="entry.level">
    <a
      :style="{ 'margin-left': index + 'rem' }"
      :href="entry.url"
      target="_blank"
    >
      {{ entry.label }}
    </a>
  </div>
</template>

<script setup lang="ts">
import type { GtdbtkResult } from "@/model/GtdbtkResult";
import type { PropType } from "vue";
import { computed } from "vue";

const props = defineProps({
  gtdb: { type: Object as PropType<GtdbtkResult>, default: undefined },
});

const mapping: Record<string, string> = {
  domain: "d__",
  phylum: "p__",
  class: "c__",
  order: "o__",
  family: "f__",
  genus: "g__",
  species: "s__",
};

type TreeEntry = {
  url: string;
  level: string;
  label: string;
};

function toEntry(level: string, value: string): TreeEntry {
  if (!(level in mapping)) throw `Unsupported taxonomy level: ${level}`;
  return {
    url: "https://gtdb.ecogenomic.org/tree?r=" + mapping[level] + value,
    level: level,
    label: value,
  };
}

const entries = computed(() => {
  if (props.gtdb) {
    const c = props.gtdb.classification;
    return [
      toEntry("domain", c.domain ? c.domain : ""),
      toEntry("phylum", c.phylum ? c.phylum : ""),
      toEntry("class", c.class ? c.class : ""),
      toEntry("order", c.order ? c.order : ""),
      toEntry("family", c.family ? c.family : ""),
      toEntry("genus", c.genus ? c.genus : ""),
      toEntry("species", c.species ? c.species : ""),
    ];
  }
  return [];
});
</script>
