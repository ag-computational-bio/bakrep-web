<template>
  <div v-if="gtdb && mlst">
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
          <td>{{ gtdb.fastani_reference }}</td>
        </tr>
        <tr>
          <th>Classification Method:</th>
          <td>{{ gtdb.classification_method }}</td>
        </tr>
        <tr>
          <th scope="row">Sequence Type</th>
          <td>{{ mlst[0].sequence_type }}</td>
        </tr>
        <tr>
          <th scope="row">ST type</th>
          <td>{{ mlst[0].scheme }}</td>
        </tr>
        <tr>
          <th scope="row">Alleles</th>
          <td>{{ mlst[0].allels }}</td>
        </tr>
      </table>
    </div>

    <div class="warning">
      <template v-if="gtdb.warnings != 'NaN'">
        {{ gtdb.warnings }}
      </template>
    </div>
  </div>
  <div v-else>No gtdbtk result available.</div>
</template>
<script setup lang="ts">
import type { GtdbtkResult } from "@/model/GtdbtkResult";
import type { MlstResult } from "@/model/MlstResults";
import type { PropType } from "vue";
import { computed } from "vue";
const props = defineProps({
  gtdb: { type: Object as PropType<GtdbtkResult>, default: undefined },
  mlst: { type: Object as PropType<MlstResult>, default: undefined },
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
