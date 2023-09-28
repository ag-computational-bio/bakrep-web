<script setup lang="ts">
import { useApi } from "@/BakrepApi";
import usePageState, { State } from "@/PageState";
import Loading from "@/components/Loading.vue";
import QueryFilter from "@/components/QueryFilter.vue";
import {
  empty,
  toPosition,
  type PaginationData,
  type PositionInResult,
} from "@/components/pagination/Pagination";
import Pagination from "@/components/pagination/Pagination.vue";
import type { BakrepSearchResultEntry } from "@/model/BakrepSearchResult";
import type { SortOption, SortDirection } from "@/model/Search";
import ResultTable from "@/views/search/ResultTable.vue";
import { computed, onMounted, ref, type Ref } from "vue";
const searchState = usePageState();
const entries: Ref<BakrepSearchResultEntry[]> = ref([]);
const api = useApi();
const pagination: Ref<PaginationData> = ref(empty());

export type FilterTuple = {
  from: number;
  to: number;
};

const sizeTuple = ref<FilterTuple>({ from: 0, to: 9999999 });
const gcTuple = ref<FilterTuple>({ from: 0, to: 100 });
const contigTuple = ref<FilterTuple>({ from: 0, to: 1000 });
const qualityTuple = ref<FilterTuple>({ from: 0, to: 100 });
const contaminationTuple = ref<FilterTuple>({ from: 0, to: 100 });

function filter(offset = 0) {
  let query;
  query = {
    op: "and",
    value: [
      // Size Filter

      {
        field: "bakta.stats.size",
        op: "[]",
        value: sizeTuple.value,
      },

      {
        field: "bakta.stats.gc",
        op: "[]",
        value: { from: gcTuple.value.from / 100, to: gcTuple.value.to / 100 },
      },
      // Contig Count Filter

      {
        field: "bakta.stats.no_sequences",
        op: "[]",
        value: contigTuple.value,
      },

      // Quality Filter

      {
        field: "checkm2.quality.completeness",
        op: "[]",
        value: qualityTuple.value,
      },

      // Contamination Filter

      {
        field: "checkm2.quality.contamination",
        op: "[]",
        value: contaminationTuple.value,
      },
    ],
  };

  searchState.value.setState(State.Loading);

  api
    .search({
      query: query,
      sort: ordering.value,
      offset: offset,
      limit: 10,
    })
    .then((r) => {
      entries.value = r.results;
      searchState.value.setState(State.Main);
      if (r.offset) pagination.value.offset = r.offset;
      pagination.value.total = r.total;
    })
    .catch((err) => searchState.value.setError(err));
}

const ordering: Ref<SortOption[]> = ref([{ field: "id", ord: "asc" }]);

const positionInResults: Ref<PositionInResult> = computed(() =>
  toPosition(pagination.value),
);

function updateOrdering(sortkey: string, direction: SortDirection | null) {
  const idx = ordering.value.findIndex((s) => s.field === sortkey);
  if (direction == null) {
    if (idx > -1) ordering.value.splice(idx, 1);
  } else {
    if (idx > -1) ordering.value[idx].ord = direction;
    else
      ordering.value = [{ field: sortkey, ord: direction }, ...ordering.value];
  }
  filter();
}

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
          <QueryFilter label="GC" v-model="gcTuple" />
          <QueryFilter label="Contigs" v-model="contigTuple" />
          <QueryFilter label="Genome Size" v-model="sizeTuple" />
          <QueryFilter label="Completeness" v-model="qualityTuple" />
          <QueryFilter label="Contamination" v-model="contaminationTuple" />
          <button class="btn btn-light w-100" @click="filter()">
            Apply Filter
          </button>
        </div>
      </div>
    </div>
    <Loading :state="searchState">
      <div class="row px-3">
        Showing results {{ positionInResults.firstElement }}-{{
          positionInResults.lastElement
        }}
        of {{ pagination.total }} results
        <ResultTable
          :ordering="ordering"
          :entries="entries"
          @update:ordering="updateOrdering"
        />
        <Pagination class="mt-3" :value="pagination" @update:offset="filter" />
      </div>
    </Loading>
  </main>
</template>
<style></style>
