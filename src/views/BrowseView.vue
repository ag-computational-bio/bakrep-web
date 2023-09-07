<script setup lang="ts">
import { onMounted, ref, type Ref, computed } from "vue";
import ResultTable from "@/views/search/ResultTable.vue";
import QueryFilter from "@/components/QueryFilter.vue";
import { useApi } from "@/BakrepApi";
import CenteredLargeSpinner from "@/components/CenteredLargeSpinner.vue";
import Loading from "@/components/Loading.vue";
import {
  empty,
  toPosition,
  type PaginationData,
  type PositionInResult,
} from "@/components/pagination/Pagination";
import Pagination from "@/components/pagination/Pagination.vue";
import type { BakrepSearchResultEntry } from "@/model/BakrepSearchResult";
import usePageState, { State } from "@/PageState";
const state = usePageState();
const entries: Ref<BakrepSearchResultEntry[]> = ref([]);

const api = useApi();
const pagination: Ref<PaginationData> = ref(empty());

export type filterTouple = {
  from: number;
  to: number;
};

const sizeTouple = ref<filterTouple>({ from: 0, to: 9999999 });
const gcTouple = ref<filterTouple>({ from: 0, to: 75 });
const contigTouple = ref<filterTouple>({ from: 0, to: 1000 });
const qualityTouple = ref<filterTouple>({ from: 0, to: 100 });
const contaminationTouple = ref<filterTouple>({ from: 0, to: 100 });

function filter(offset = 0) {
  let query;
  query = {
    op: "and",
    value: [
      // Size Filter

      {
        field: "bakta.stats.size",
        op: "[]",
        value: sizeTouple.value,
      },


      {
        field: "bakta.stats.gc",
        op: "[]",
        value: gcTouple.value,
      },
      // Contig Count Filter

      {
        field: "bakta.stats.no_sequences",
        op: "[]",
        value: contigTouple.value,
      },

      // Quality Filter

      {
        field: "checkm2.quality.completeness",
        op: "[]",
        value: qualityTouple.value,
      },

      // Contamination Filter

      {
        field: "checkm2.quality.contamination",
        op: "[]",
        value: contaminationTouple.value,
      },
    ],
  };

  state.value.setState(State.Loading);

  api
    .search({
      query: query,
      sort: [{ field: "bakta.stats.no_sequences", ord: "asc" }],
      offset: offset,
      limit: 10,
    })
    .then((r) => {
      entries.value = r.results;
      state.value.setState(State.Main);
      pagination.value.offset = r.offset;
      pagination.value.total = r.total;
    });
}
const positionInResults: Ref<PositionInResult> = computed(() =>
  toPosition(pagination.value),
);

onMounted(filter);
</script>

<template>
  <main class="container pt-5">
    <div class="row">
      <h2>Browse BakRep Genomes</h2>
    </div>

    <div class="row">
      <div class="col">
        <div class="rounded bg-body-secondary p-4 mb-4">
          <QueryFilter label="Size" v-model="sizeTouple" @update:min="(newValue: number) => (sizeTouple.from = newValue)"
            @update:max="(newValue: number) => (sizeTouple.to = newValue)" />
          <QueryFilter label="GC Ratio" v-model="gcTouple" @update:min="(newValue: number) => (gcTouple.from = newValue)"
            @update:max="(newValue: number) => (gcTouple.to = newValue)" />
          <QueryFilter label="Contig Count" v-model="contigTouple"
            @update:min="(newValue: number) => (contigTouple.from = newValue)"
            @update:max="(newValue: number) => (contigTouple.to = newValue)" />
          <QueryFilter label="Quality" v-model="qualityTouple"
            @update:min="(newValue: number) => (qualityTouple.from = newValue)"
            @update:max="(newValue: number) => (qualityTouple.to = newValue)" />
          <QueryFilter label="Contamination" v-model="contaminationTouple"
            @update:min="(newValue: number) => (contaminationTouple.from = newValue)"
            @update:max="(newValue: number) => (contaminationTouple.to = newValue)" />
          <button class="btn btn-light w-100" @click="filter()">Apply Filter</button>
        </div>
      </div>
    </div>
    <Loading :state="state">
      <template v-slot:loading>
        <CenteredLargeSpinner />
      </template>
      <template v-slot:content>
        <div class="row py-3 my-5">
          Showing results {{ positionInResults.firstElement }}-{{
            positionInResults.lastElement
          }}
          of {{ pagination.total }} results
          <ResultTable :entries="entries" />
          <Pagination class="mt-3" :value="pagination" @update:offset="filter" />
        </div>
      </template>
    </Loading>
  </main>
</template>

<style></style>
