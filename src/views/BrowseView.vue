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
import {
  type SortOption,
  type SortDirection,
  type CompoundQuery,
} from "@/model/Search";
import ResultTable from "@/views/search/ResultTable.vue";
import { computed, onMounted, ref, unref, type Ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const searchState = usePageState();
const entries: Ref<BakrepSearchResultEntry[]> = ref([]);

const api = useApi();
const route = useRoute();
const router = useRouter();

const pagination: Ref<PaginationData> = ref(empty());

export type FilterTuple = {
  from: number;
  to: number;
};

const props = defineProps({
  offset: { type: Number, default: 0 },
  limit: { type: Number, default: 10 },
  gc: { type: String, default: "0;100" },
  contig: { type: String, default: "0;1000" },
  size: { type: String, default: "0;9999999" },
  quality: { type: String, default: "0;100" },
  contamination: { type: String, default: "0;100" },
  order: { type: String },
});

const sizeTuple = ref<FilterTuple>(decodeTuple(props.size));
const gcTuple = ref<FilterTuple>(decodeTuple(props.gc));
const contigTuple = ref<FilterTuple>(decodeTuple(props.contig));
const qualityTuple = ref<FilterTuple>(decodeTuple(props.quality));
const contaminationTuple = ref<FilterTuple>(decodeTuple(props.contamination));

function encodeParameters(offset = 0) {
  return {
    offset: offset,
    limit: pagination.value.limit,
    gc: encodeTuple(gcTuple.value),
    size: encodeTuple(sizeTuple.value),
    contig: encodeTuple(contigTuple.value),
    quality: encodeTuple(qualityTuple.value),
    contamination: encodeTuple(contaminationTuple.value),
    order: btoa(JSON.stringify(ordering.value)),
  };
}

const query: Ref<CompoundQuery> = computed(() => {
  return {
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
});

function updateQuery(offset = pagination.value.offset) {
  router.push({
    name: "browse",
    query: encodeParameters(offset),
  });
}

function decodeQuery() {
  if (route.query.qc) {
    gcTuple.value = decodeTuple(route.query.gc as string);
  }
  if (route.query.size) {
    sizeTuple.value = decodeTuple(route.query.size as string);
  }
  if (route.query.contig) {
    contigTuple.value = decodeTuple(route.query.contig as string);
  }
  if (route.query.quality) {
    qualityTuple.value = decodeTuple(route.query.quality as string);
  }
  if (route.query.contamination) {
    contaminationTuple.value = decodeTuple(route.query.contamination as string);
  }
  if (route.query.order) {
    ordering.value = JSON.parse(atob(route.query.order as string));
  }
  if (route.query.limit) {
    pagination.value.limit = Number.parseInt(route.query.limit as string);
  }
  if (route.query.offset) {
    pagination.value.offset = Number.parseInt(route.query.offset as string);
  }
}

function encodeTuple(tuple: FilterTuple): string {
  return `${tuple.from};${tuple.to}`;
}

function decodeTuple(tuple: string): FilterTuple {
  const arr = tuple.split(";");
  return { from: Number.parseInt(arr[0]), to: Number.parseInt(arr[1]) };
}

function populateVariables() {
  decodeQuery();
  filter(pagination.value.offset);
}

watch(
  () => route.query,
  () => {
    populateVariables();
  },
);

function filter(offset = 0) {
  searchState.value.setState(State.Loading);

  api
    .search({
      query: unref(query),
      sort: ordering.value,
      offset: offset,
      limit: pagination.value.limit,
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
  updateQuery();
}

function init() {
  updateQuery();
}

onMounted(init);
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
          <button class="btn btn-light w-100" @click="updateQuery()">
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
        <Pagination
          class="mt-3"
          :value="pagination"
          @update:offset="updateQuery"
        />
      </div>
    </Loading>
  </main>
</template>
<style></style>
