<template>
  <div v-if="gtdb || mlst">
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
        <div v-if="gtdb">
          <tr>
            <th scope="row" class="label">Fastani</th>
            <td class="value">{{ gtdb.fastani_reference }}</td>
          </tr>
          <tr>
            <th scope="row" class="label">Classification Method:</th>
            <td class="value">{{ gtdb.classification_method }}</td>
          </tr>
        </div>
        <div v-if="mlst">
          <tr>
            <th scope="row" class="label">Sequence Type</th>
            <td class="value">{{ mlst[0].sequence_type }}</td>
          </tr>
          <tr>
            <th scope="row" class="label">ST type</th>
            <td class="value">{{ mlst[0].scheme }}</td>
          </tr>
          <tr>
            <th scope="row" class="label">Alleles</th>
            <td class="value">{{ mlst[0].allels }}</td>
          </tr>
        </div>
      </table>
    </div>

    <div class="warning">
      <template v-if="gtdb && gtdb.warnings != 'NaN'">
        {{ gtdb.warnings }}
      </template>
    </div>
  </div>
  <div v-else>No gtdbtk or mlst result available.</div>
  <div v-if="!mlst || !gtdb" class="rounded bg-info">
    There are missing data to represent all fields:
    <ul>
      <li v-if="!mlst">mlst file is missing.</li>
      <li v-if="!gtdb">gtdb file is missing.</li>
    </ul>
  </div>
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
