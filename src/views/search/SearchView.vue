<script setup lang="ts">
import { useApi } from "@/BakrepApi";
import usePageState, { State } from "@/PageState";
import type { LookupCompletionFunction } from "@/components/AutocompleteInput.vue";
import Loading from "@/components/Loading.vue";
import { empty, type PaginationData } from "@/components/pagination/Pagination";
import Pagination from "@/components/pagination/Pagination.vue";
import QueryBuilder from "@/components/querybuilder/QueryBuilder.vue";
import {
  defaultOptions,
  type LeafRule,
  type NestedRule,
  type Rule,
} from "@/components/querybuilder/Rule";
import type { BakrepSearchResultEntry } from "@/model/BakrepSearchResult";
import { isClassificationKey } from "@/model/GtdbtkResult";
import type {
  CompoundQuery,
  SearchInfo,
  SearchInfoField,
  SortDirection,
  SortOption,
} from "@/model/Search";
import { computed, onMounted, ref, unref, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ResultTable from "./ResultTable.vue";
import SearchResultNumbers from "./SearchResultNumbers.vue";
const pageState = usePageState();
const searchState = usePageState();
const entries: Ref<BakrepSearchResultEntry[]> = ref([]);

const api = useApi();
const route = useRoute();
const router = useRouter();

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
    .then(populateVariables)
    .catch((err) => pageState.value.setError(err));
}

function encodeQuery(): string {
  return btoa(JSON.stringify({ query: query.value, ordering: ordering.value }));
}

function decodeQuery(encodedQuery: string): {
  query: CompoundQuery;
  ordering: SortOption[];
} {
  return JSON.parse(atob(encodedQuery));
}

function populateVariables() {
  if (route.query.query) {
    const decodedQuery = decodeQuery(route.query.query as string);
    query.value = decodedQuery.query;
    ordering.value = decodedQuery.ordering;
    pagination.value.offset = Number.parseInt(route.query.offset as string);
    pagination.value.limit = Number.parseInt(route.query.limit as string);
    search(pagination.value.offset);
  }
}

watch(
  () => route.query,
  () => {
    populateVariables();
  },
);

function updateQuery(offset = 0) {
  router.push({
    name: "search",
    query: {
      offset: offset,
      limit: pagination.value.limit,
      query: encodeQuery(),
    },
  });
}

function searchinfo2querybuilderrules(f: SearchInfoField): Rule {
  const config = fieldNames[f.field];
  const field = config ? config.label : f.field;
  const group = config ? config.group : "";

  if (f.type === "nested") {
    const nestedRule: NestedRule = {
      group: group,
      field: f.field,
      label: field,
      type: "nested",
      rules: f.fields.map(searchinfo2querybuilderrules),
    };
    return nestedRule;
  } else {
    const leafRule: LeafRule = {
      group: group,
      field: f.field,
      label: field,
      type: f.type as "number" | "text",
      ops: f.ops.map((o) => ({ label: o, description: o })),
      completionPath: f.completionPath,
      min: f.min,
      max: f.max,
    };
    return leafRule;
  }
}

const rules: Ref<Rule[]> = computed(() => {
  let out: Rule[] = [];
  out = searchinfo.value.fields.map(searchinfo2querybuilderrules);
  return out;
});

type FieldConfiguration = {
  label: string;
  group?: string;
};

function fc(
  label: string,
  group: string | undefined = undefined,
): FieldConfiguration {
  return {
    label: label,
    group: group,
  };
}

const fieldNames: Record<string, FieldConfiguration> = {
  id: fc("Dataset id"),
  "bakta.stats.size": fc("Assembly size", "Bakta results"),
  "bakta.stats.no_sequences": fc("Number of contigs", "Bakta results"),
  "bakta.stats.gc": fc("GC content", "Bakta results"),
  "bakta.stats.n_ratio": fc("N ratio", "Bakta results"),
  "bakta.stats.n50": fc("N50", "Bakta results"),
  "bakta.stats.coding_ratio": fc("Coding ratio", "Bakta results"),
  "bakta.genome.strain": fc("Strain", "Bakta results"),
  "gtdbtk.classification.domain": fc("Domain", "Gtdbtk results"),
  "gtdbtk.classification.phylum": fc("Phylum", "Gtdbtk results"),
  "gtdbtk.classification.class": fc("Class", "Gtdbtk results"),
  "gtdbtk.classification.order": fc("Order", "Gtdbtk results"),
  "gtdbtk.classification.family": fc("Family", "Gtdbtk results"),
  "gtdbtk.classification.genus": fc("Genus", "Gtdbtk results"),
  "gtdbtk.classification.species": fc("Species", "Gtdbtk results"),
  "mlst.sequence_type": fc("MLST Sequence type", "Mlst results"),
  "checkm2.quality.completeness": fc("Completeness", "Checkm2 results"),
  "checkm2.quality.contamination": fc("Contamination", "Checkm2 results"),
  "bakta.features": fc("Annotated features", "Bakta results"),
  "metadata.accession": fc("Accession", "Source metadata"),
  "metadata.collected_by": fc("Collected by", "Source metadata"),
  "metadata.collection_date": fc("Collection date", "Source metadata"),
  "metadata.country": fc("Country", "Source metadata"),
  "metadata.host": fc("Host", "Source metadata"),
  "metadata.host_sex": fc("Host sex", "Source metadata"),
  "metadata.host_status": fc("Host status", "Source metadata"),
  "metadata.host_tax_id": fc("Host taxid", "Source metadata"),
  "metadata.instrument_model": fc("Instrument model", "Source metadata"),
  "metadata.instrument_platform": fc("Instrument platform", "Source metadata"),
  "metadata.isolate": fc("Isolate", "Source metadata"),
  "metadata.isolation_source": fc("Isolation source", "Source metadata"),
  "metadata.location": fc("Location", "Source metadata"),
  "metadata.project_name": fc("Project name", "Source metadata"),
  "metadata.sample_alias": fc("Sample alias", "Source metadata"),
  "metadata.secondary_sample_accession": fc(
    "Secondary sample accession",
    "Source metadata",
  ),
  "metadata.secondary_study_accession": fc(
    "Secondary study accession",
    "Source metadata",
  ),
  "metadata.serotype": fc("Serotype", "Source metadata"),
  "metadata.serovar": fc("Serovar", "Source metadata"),
  "metadata.strain": fc("Strain", "Source metadata"),
  "metadata.study_accession": fc("Study accession", "Source metadata"),
  "metadata.submission_accession": fc(
    "Submission accession",
    "Source metadata",
  ),
};

function search(offset = 0) {
  searchState.value.setState(State.Loading);
  if (exportComponent.value) exportComponent.value.resetTsvExport();
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
      updateQuery(r.offset);
    })
    .catch((err) => pageState.value.setError(err));
}

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

const exportComponent = ref<typeof SearchResultNumbers>();
const exportInProgress = ref(false);

onMounted(init);

function createLookupFn(r: Rule): LookupCompletionFunction {
  if (r.field.startsWith("gtdbtk.classification.")) {
    const field = r.field.replace("gtdbtk.classification.", "");
    if (isClassificationKey(field))
      return (p) => api.completeClassficationText(field, p);
  }
  if (r.field === "gene" || r.field === "product") {
    const f = r.field;
    return (p) => api.completeFeatureText(f, p);
  }

  throw "Unsupported completable text field";
}
</script>

<template>
  <main class="container pt-5">
    <Loading :state="pageState">
      <div class="row">
        <div class="col-12">
          <QueryBuilder
            v-model:query="query"
            :rules="rules"
            :options="defaultOptions({ lookupFn: createLookupFn })"
            @submit="search"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="d-flex mt-2 mb-5 justify-content-end">
            <button
              @click="search(0)"
              class="btn btn-secondary"
              type="button"
              id="button-search"
              :disabled="exportInProgress"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <Loading :state="searchState">
        <div class="row">
          <SearchResultNumbers
            ref="exportComponent"
            :api="api"
            :pagination="pagination"
            :query="query"
            @exporting="exportInProgress = true"
            @export-done="exportInProgress = false"
            @export-failed="exportInProgress = false"
          />
          <div class="col-12">
            <ResultTable
              :ordering="ordering"
              :entries="entries"
              @update:ordering="updateOrdering"
            />
          </div>
          <Pagination
            v-if="pagination.total > 0"
            class="mt-3"
            :value="pagination"
            @update:offset="updateQuery"
          />
        </div>
      </Loading>
    </Loading>
  </main>
</template>

<style></style>
