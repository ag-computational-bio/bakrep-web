<template>
  <div>
    <div>
      <span class="fw-bold">Phylogeny:</span>
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
      <table class="table statstable">
        <template v-if="gtdb">
          <tr>
            <th scope="row">Reference genome:</th>
            <td>{{ gtdb.fastani_reference }}</td>
          </tr>
          <tr>
            <th scope="row">Classification method:</th>
            <td>{{ gtdb.classification_method }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <th scope="row">NA</th>
          </tr>
        </template>
        <template v-if="mlst">
          <tr>
            <th scope="row">MLST sequence type:</th>
            <td>{{ mlst[0].sequence_type }}</td>
          </tr>
          <tr>
            <th scope="row">Schema:</th>
            <td>{{ mlst[0].scheme }}</td>
          </tr>
          <tr>
            <th scope="row" class="align-top">Alleles:</th>
            <td>
              <ul v-if="mlst[0].alleles">
                <li v-for="e of Object.entries(mlst[0].alleles)">
                  {{ e[0] }}: {{ e[1] }}
                </li>
              </ul>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <th scope="row">NA</th>
          </tr>
        </template>
      </table>
    </div>

    <div class="warning">
      <template v-if="gtdb && gtdb.warnings != 'NaN'">
        {{ gtdb.warnings }}
      </template>
    </div>
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
