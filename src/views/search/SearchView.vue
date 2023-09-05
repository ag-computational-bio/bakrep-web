<script setup lang="ts">
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
import { computed, onMounted, ref, unref, type Ref } from "vue";
import ResultTable from "./ResultTable.vue";
import type {
  CompoundQuery,
  SearchInfo,
  SearchInfoField,
  SortDirection,
  SortOption,
} from "@/model/Search";
import type { Rule, NestedRule } from "@/components/querybuilder/Rule";
import QueryBuilder from "@/components/querybuilder/QueryBuilder.vue";
import type { LeafRule } from "@/components/querybuilder/Rule";
const pageState = usePageState();
const searchState = usePageState();
const entries: Ref<BakrepSearchResultEntry[]> = ref([]);

const api = useApi();
const pagination: Ref<PaginationData> = ref(empty());
const query: Ref<CompoundQuery> = ref({ op: "and", value: [] });
const ordering: Ref<SortOption[]> = ref([{ field: "id", ord: "asc" }]);
const searchinfo: Ref<SearchInfo> = ref({ fields: [] });
function init() {
  pageState.value.setState(State.Loading);
  api
    .searchinfo()
    .then((r) => {
      searchinfo.value = r;
      pageState.value.setState(State.Main);
    })
    .catch((err) => pageState.value.setError(err));
}

function searchinfo2querybuilderrules(f: SearchInfoField): Rule {
  if (f.type === "nested") {
    const nestedRule: NestedRule = {
      field: f.field,
      label: f.field in fieldNames ? fieldNames[f.field] : f.field,
      type: "nested",
      rules: f.fields.map(searchinfo2querybuilderrules),
    };
    return nestedRule;
  } else {
    const leafRule: LeafRule = {
      field: f.field,
      label: f.field in fieldNames ? fieldNames[f.field] : f.field,
      type: f.type as "number" | "text",
      ops: f.ops.map((o) => ({ label: o, description: o })),
    };
    return leafRule;
  }
}

const rules: Ref<Rule[]> = computed(() => {
  let out: Rule[] = [];
  out = searchinfo.value.fields.map(searchinfo2querybuilderrules);
  return out;
});

const fieldNames: Record<string, string> = {
  id: "Dataset id",
  "bakta.stats.size": "Assembly size",
  "bakta.stats.no_sequences": "Number of contigs",
  "bakta.stats.gc": "GC content",
  "bakta.stats.n_ratio": "N ratio",
  "bakta.stats.n50": "N50",
  "bakta.stats.coding_ratio": "Coding ratio",
  "bakta.genome.strain": "Strain",
  "gtdbtk.classification.domain": "Domain",
  "gtdbtk.classification.phylum": "Phylum",
  "gtdbtk.classification.class": "Class",
  "gtdbtk.classification.order": "Order",
  "gtdbtk.classification.family": "Family",
  "gtdbtk.classification.genus": "Genus",
  "gtdbtk.classification.species": "Species",
  "mlst.sequence_type": "MLST Sequence type",
  "checkm2.quality.completeness": "Completeness",
  "checkm2.quality.contamination": "Contamination",
  "bakta.features": "Annotated features",
};

function search(offset = 0) {
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
      pagination.value.offset = r.offset;
      pagination.value.total = r.total;
    })
    .catch((err) => pageState.value.setError(err));
}

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
  search();
}

onMounted(init);
</script>

<template>
  <main class="container pt-5">
    <Loading :state="pageState">
      <div class="row">
        <div class="col">
          <QueryBuilder v-model:query="query" :rules="rules" />

          <div class="d-flex mt-2 justify-content-end">
            <button
              @click="search(0)"
              class="btn btn-secondary"
              type="button"
              id="button-search"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <Loading :state="searchState">
        <div class="row py-3 my-5">
          Showing search results {{ positionInResults.firstElement }}-{{
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
            @update:offset="search"
          />
        </div>
      </Loading>
    </Loading>
  </main>
</template>

<style></style>
