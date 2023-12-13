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
  type SearchInfo,
} from "@/model/Search";
import ResultTable from "@/views/search/ResultTable.vue";
import { computed, onMounted, ref, unref, type Ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const pageState = usePageState();
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

const sizeTuple = ref<FilterTuple>({ from: 0, to: 10000000 });
const gcTuple = ref<FilterTuple>({ from: 0, to: 100 });
const contigTuple = ref<FilterTuple>({ from: 0, to: 10000 });
const qualityTuple = ref<FilterTuple>({ from: 0, to: 100 });
const contaminationTuple = ref<FilterTuple>({ from: 0, to: 100 });
const searchinfo: Ref<SearchInfo> = ref({ fields: [] });

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

function updateUrl(offset = pagination.value.offset) {
  router.push({
    name: "browse",
    query: encodeParameters(offset),
  });
}

function parseFiltersFromRoute() {
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
  return { from: Number.parseFloat(arr[0]), to: Number.parseFloat(arr[1]) };
}

function populateVariables() {
  parseFiltersFromRoute();
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
  updateUrl();
}

function getTupleRange(field: string): FilterTuple | undefined {
  const info = searchinfo.value.fields.find((o) => o.field === field);
  if (info) {
    if ("min" in info && "max" in info) {
      return { from: info.min, to: info.max };
    }
  }
}

function init() {
  pageState.value.setState(State.Loading);
  api
    .searchinfo()
    .then((r) => {
      searchinfo.value = r;
      pageState.value.setState(State.Main);
    })
    .then(() => {
      // let obj = arr.find(o => o.name === 'string 1');
      sizeTuple.value = getTupleRange("bakta.stats.size") || sizeTuple.value;
      contigTuple.value =
        getTupleRange("bakta.stats.no_sequences") || contigTuple.value;
      qualityTuple.value =
        getTupleRange("checkm.completeness") || qualityTuple.value;
      contaminationTuple.value =
        getTupleRange("checkm.contamination") || contaminationTuple.value;
    })
    .then(() => {
      updateUrl();
      filter(pagination.value.offset);
    })
    .catch((err) => pageState.value.setError(err));
}

onMounted(init);
</script>

<template>
  <main class="container pt-5">
    <div class="row">
      <h2>Browse BakRep Genomes</h2>
    </div>
    <Loading :state="pageState">
      <div class="row">
        <div class="col">
          <div class="rounded bg-body-secondary p-4 mb-4">
            <QueryFilter label="GC" v-model="gcTuple" />
            <QueryFilter label="Contigs" v-model="contigTuple" />
            <QueryFilter label="Genome Size" v-model="sizeTuple" />
            <QueryFilter label="Completeness" v-model="qualityTuple" />
            <QueryFilter label="Contamination" v-model="contaminationTuple" />
            <button class="btn btn-light w-100" @click="updateUrl()">
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
            @update:offset="updateUrl"
          />
        </div>
      </Loading>
    </Loading>
  </main>
</template>
<style></style>
