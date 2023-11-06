<script setup lang="ts">
import { useApi } from "@/BakrepApi";
import usePageState, { State } from "@/PageState";
import Loading from "@/components/Loading.vue";
import {
  empty,
  toPosition,
  type PaginationData,
  type PositionInResult,
} from "@/components/pagination/Pagination";
import Pagination from "@/components/pagination/Pagination.vue";
import QueryBuilder from "@/components/querybuilder/QueryBuilder.vue";
import type {
  LeafRule,
  NestedRule,
  Rule,
} from "@/components/querybuilder/Rule";
import type { BakrepSearchResultEntry } from "@/model/BakrepSearchResult";
import type {
  CompoundQuery,
  SearchInfo,
  SearchInfoField,
  SortDirection,
  SortOption,
} from "@/model/Search";
import { saveAs } from "file-saver";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
  type Ref,
} from "vue";
import ExportProgress from "./ExportProgress.vue";
import { downloadFullTsv, type ProgressEvent } from "./ExportTsv";
import ResultTable from "./ResultTable.vue";
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
  resetTsvExport();
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

let cancelExport: AbortController | undefined = undefined;
const progress = ref<ProgressEvent>();
const exportError = ref<string>();
const exportInProgress = ref(false);
function exportTsv() {
  exportError.value = undefined;
  exportInProgress.value = true;
  progress.value = { total: pagination.value.total, count: 0, progress: 0 };
  cancelExport = downloadFullTsv(
    api,
    {
      query: query.value,
      sort: [{ field: "id", ord: "asc" }],
    },
    {
      onError: (e) => {
        exportError.value = e as string;
        exportInProgress.value = false;
      },
      onFinished: (d) => {
        const blob = new Blob([d], {
          type: "text/tab-separated-values;charset=utf-8",
        });
        saveAs(blob, "bakrep-export.tsv");
        exportInProgress.value = false;
        cancelExport = undefined;
      },
      onProgress: (p) => (progress.value = p),
    },
  );
}
function resetTsvExport() {
  progress.value = undefined;
  exportError.value = undefined;
  exportInProgress.value = false;
}

onMounted(init);
onBeforeUnmount(() => {
  if (cancelExport) cancelExport.abort();
});
</script>

<template>
  <main class="container pt-5">
    <Loading :state="pageState">
      <div class="row">
        <div class="col-12">
          <QueryBuilder v-model:query="query" :rules="rules" @submit="search" />
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
          <div class="col-12 d-flex justify-content-between align-items-end">
            <div class="fs-tiny">
              Showing search results {{ positionInResults.firstElement }}-{{
                positionInResults.lastElement
              }}
              of {{ pagination.total }} results
            </div>
            <div v-if="pagination.total > 0">
              <button
                class="btn btn-sm btn-link link-secondary"
                @click="exportTsv"
                :disabled="exportInProgress"
              >
                Export as tsv
              </button>
            </div>
          </div>
          <div class="col-12">
            <ExportProgress
              v-if="progress"
              :progress="progress"
              :error="exportError"
            />
          </div>
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
            @update:offset="search"
          />
        </div>
      </Loading>
    </Loading>
  </main>
</template>

<style></style>
