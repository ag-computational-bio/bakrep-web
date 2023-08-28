<template>
  <div v-if="result">
    <div>
      <span class="fw-bold">GTDB Tree:</span>
      <div v-for="(entry, index) in entries" :key="index" :title="entry.level">
        <a
          :style="{ 'margin-left': index * 5 + 'px' }"
          :href="entry.url"
          target="_blank"
        >
          {{ entry.label }}
        </a>
      </div>
    </div>
    <div>
      <table class="table">
        <tr>
          <th>Fastani</th>
          <td>{{ result.fastani_reference }}</td>
        </tr>
        <tr>
          <th>Classification Method:</th>
          <td>{{ result.classification_method }}</td>
        </tr>
      </table>
    </div>

    <div class="warning">
      <template v-if="result.warnings != 'NaN'">
        {{ result.warnings }}
      </template>
    </div>
  </div>
  <div v-else>No gtdbtk result available.</div>
</template>
<script setup lang="ts">
import type { GtdbtkResult } from "@/model/GtdbtkResult";
import type { PropType } from "vue";
import { computed } from "vue";
const props = defineProps({
  result: { type: Object as PropType<GtdbtkResult>, default: undefined },
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
  if (props.result) {
    const c = props.result.classification;
    return [
      toEntry("domain", c.domain),
      toEntry("phylum", c.phylum),
      toEntry("class", c.class),
      toEntry("order", c.order),
      toEntry("family", c.family),
      toEntry("genus", c.genus),
      toEntry("species", c.species),
    ];
  }
  return [];
});
</script>
