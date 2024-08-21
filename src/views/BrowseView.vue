<script setup lang="ts">
import { useApi } from "@/BakrepApi";
import usePageState, { State } from "@/PageState";
import AutocompleteInput from "@/components/AutocompleteInput.vue";
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
  type CompoundQuery,
  type SearchInfo,
  type SortDirection,
  type SortOption,
} from "@/model/Search";
import ResultTable from "@/views/search/ResultTable.vue";
import { computed, onMounted, ref, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const pageState = usePageState();
const searchState = usePageState();
const entries: Ref<BakrepSearchResultEntry[]> = ref([]);

const api = useApi();
const route = useRoute();
const router = useRouter();

const pagination: Ref<PaginationData> = ref(empty());

export type Range = {
  from: number;
  to: number;
};

type Filter = {
  size: Range;
  gc: Range;
  contigs: Range;
  completeness: Range;
  contamination: Range;
  species: string;
};

const filters = ref<Filter>({
  size: { from: 0, to: 0 },
  gc: { from: 0, to: 0 },
  contigs: { from: 0, to: 0 },
  completeness: { from: 0, to: 0 },
  contamination: { from: 0, to: 0 },
  species: "",
});
const searchinfo: Ref<SearchInfo> = ref({ fields: [] });

function buildFilterQuery(filter: Filter) {
  function c(field: string, range: Range) {
    return {
      field: field,
      op: "[]",
      value: range,
    };
  }
  const q: CompoundQuery = {
    op: "and",
    value: [
      c("bakta.stats.size", filter.size as Range),
      c("bakta.stats.gc", {
        // gc is used in percent in ui, but ranges from 0 to 1 in database
        // so we need to convert here
        from: filter.gc.from / 100,
        to: filter.gc.to / 100,
      }),
      c("bakta.stats.no_sequences", filter.contigs),
      c("checkm2.quality.completeness", filter.completeness),
      c("checkm2.quality.contamination", filter.contamination),
    ],
  };
  if (filter.species)
    q.value.push({
      field: "gtdbtk.classification.species",
      op: "eq",
      value: filter.species,
    });
  return q;
}

function updateUrl(offset = pagination.value.offset) {
  pagination.value.offset = offset;
  const newRouteQuery = encodeQueryForRoute(offset);
  if (
    // route parameters differ from user parameters
    newRouteQuery.contamination != (route.query.contamination as string) ||
    newRouteQuery.completeness != (route.query.completeness as string) ||
    newRouteQuery.gc != (route.query.gc as string) ||
    newRouteQuery.size != (route.query.size as string) ||
    newRouteQuery.order != (route.query.order as string) ||
    newRouteQuery.offset != Number.parseInt(route.query.offset as string) ||
    newRouteQuery.species != (route.query.species as string)
  ) {
    // When the page is opened the first time and the route does not contain the query
    // yet, the route is updated with a default query.
    // In order to avoid an additional browser history item, we replace the history
    // item in that case.
    // In all other cases the changes to the query and the pagination are pushed to the
    // browsers history stack, so the user can use it for navigation between different
    // states of this page.
    if (Object.keys(route.query).length == 0) {
      router.replace({
        name: "browse",
        query: newRouteQuery,
      });
    } else {
      router.push({
        name: "browse",
        query: newRouteQuery,
      });
    }
  } else {
    applyFilter();
  }
}

function encodeQueryForRoute(offset = pagination.value.offset) {
  return {
    offset: offset,
    limit: pagination.value.limit,
    gc: encodeRange(filters.value.gc),
    size: encodeRange(filters.value.size),
    contigs: encodeRange(filters.value.contigs),
    completeness: encodeRange(filters.value.completeness),
    contamination: encodeRange(filters.value.contamination),
    species: filters.value.species,
    order: btoa(JSON.stringify(ordering.value)),
  };
}

function encodeRange(tuple: Range): string {
  return `${tuple.from};${tuple.to}`;
}

function decodeRange(tuple: string): Range {
  const arr = tuple.split(";");
  return { from: Number.parseFloat(arr[0]), to: Number.parseFloat(arr[1]) };
}

function parseFiltersFromRoute() {
  function extract(
    key: keyof Filter,
    field: string,
    round: boolean = false,
    roundingScale: number = 100,
  ) {
    if (key === "species") {
      if (!route.query[key]) {
        filters.value.species = "";
      } else {
        filters.value.species = route.query[key] as string;
      }
    } else {
      if (!route.query[key]) {
        let v = getRangeFromSearchInfo(field);
        if (round) v = roundRange(v, 1, roundingScale);
        filters.value[key] = v;
      } else {
        filters.value[key] = decodeRange(route.query[key] as string);
      }
    }
  }
  extract("size", "bakta.stats.size");
  extract("contigs", "bakta.stats.no_sequences");
  extract("completeness", "checkm2.quality.completeness", true, 1);
  extract("contamination", "checkm2.quality.contamination", true, 1);
  extract("gc", "bakta.stats.gc", true);
  extract("species", "gtdbtk.classification.species");

  if (!route.query.offset) {
    pagination.value.offset = 0;
  } else {
    pagination.value.offset = Number.parseInt(route.query.offset as string);
  }
  if (!route.query.limit) {
    pagination.value.limit = 20;
  } else {
    pagination.value.limit = Number.parseInt(route.query.limit as string);
  }
}

function applyFilter(offset = 0) {
  searchState.value.setState(State.Loading);

  api
    .search({
      query: buildFilterQuery(filters.value),
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

function getRangeFromSearchInfo(field: string): Range {
  const info = searchinfo.value.fields.find((o) => o.field === field);
  if (info) {
    if ("min" in info && "max" in info) {
      return { from: info.min, to: info.max };
    }
  }
  return { from: 0, to: 0 };
}

function roundRange(tuple: Range, decimals: number, scale = 1) {
  return {
    from: Number((tuple.from * scale).toFixed(decimals)),
    to: Number((tuple.to * scale).toFixed(decimals)),
  };
}

function init() {
  pageState.value.setState(State.Loading);
  api
    .searchinfo()
    .then((r) => {
      searchinfo.value = r;
      pageState.value.setState(State.Main);
    })
    .then(parseFiltersFromRoute)
    .then(() => {
      updateUrl();
    })
    .catch((err) => pageState.value.setError(err));
}

watch(
  () => route.query,
  (newQuery) => {
    if (typeof newQuery.size === "string")
      filters.value.size = decodeRange(newQuery.size);
    if (typeof newQuery.contigs === "string")
      filters.value.contigs = decodeRange(newQuery.contigs);
    if (typeof newQuery.gc === "string")
      filters.value.gc = decodeRange(newQuery.gc);
    if (typeof newQuery.completeness === "string")
      filters.value.completeness = decodeRange(newQuery.completeness);
    if (typeof newQuery.contamination === "string")
      filters.value.contamination = decodeRange(newQuery.contamination);
    if (typeof newQuery.species === "string")
      filters.value.species = newQuery.species;
    if (typeof newQuery.order === "string")
      ordering.value = JSON.parse(atob(newQuery.order));
    if (typeof newQuery.limit === "string")
      pagination.value.limit = Number.parseInt(newQuery.limit);
    if (typeof newQuery.offset === "string")
      pagination.value.offset = Number.parseInt(newQuery.offset);
    applyFilter();
  },
);

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
            <QueryFilter label="GC" v-model="filters.gc" />
            <QueryFilter label="Contigs" v-model="filters.contigs" />
            <QueryFilter label="Genome Size" v-model="filters.size" />
            <QueryFilter label="Completeness" v-model="filters.completeness" />
            <QueryFilter
              label="Contamination"
              v-model="filters.contamination"
            />
            <div class="input-group mb-3">
              <span class="input-label input-group-text">Species:</span>
              <AutocompleteInput
                v-model:model-value="filters.species"
                :lookup-fn="(t) => api.completeClassficationText('species', t)"
              />
            </div>
            <button class="btn btn-light w-100" @click="updateUrl(0)">
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
