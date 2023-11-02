<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import DownloadLinks from "@/components/DownloadLinks.vue";
import Loading from "@/components/Loading.vue";
import Pane from "@/components/Pane.vue";
import usePageState, { State } from "@/PageState";
import { computed, onMounted, ref, type Ref } from "vue";

import { useApi } from "@/BakrepApi";
import { type BaktaResult } from "@/model/BaktaResults";
import type { CheckmResult } from "@/model/CheckmResults";
import type { Dataset } from "@/model/Dataset";
import type { GtdbtkResult } from "@/model/GtdbtkResult";
import type { MlstResult } from "@/model/MlstResults";
import router from "@/router";
import { useRoute } from "vue-router";
import BaktaAnnotationTable from "./bakta/BaktaAnnotationTable.vue";
import BaktaGenomeViewer from "./bakta/BaktaGenomeViewer.vue";
import SummaryPane from "@/views/show-results/SummaryPane.vue";
import type { Metadata } from "@/model/Metadata";
import MetadataCard from "./metadata/MetadataCard.vue";

const route = useRoute();
const id = computed(() => route.params.id as string);
const api = useApi();
const dataset: Ref<Dataset | undefined> = ref();

const baktaResult: Ref<BaktaResult | undefined> = ref();
const gtdbtkResult: Ref<GtdbtkResult | undefined> = ref();
const checkmResult: Ref<CheckmResult | undefined> = ref();
const mlstResult: Ref<MlstResult | undefined> = ref();
const metadata: Ref<Metadata | undefined> = ref();

function loadData() {
  return api
    .getDataset(id.value)
    .then((x) => {
      dataset.value = x;
      return Promise.all([
        api.fetchBaktaResult(x).then((r) => (baktaResult.value = r)),
        api.fetchGtdbtkResult(x).then((r) => (gtdbtkResult.value = r)),
        api.fetchCheckmResult(x).then((r) => (checkmResult.value = r)),
        api.fetchMlstResult(x).then((r) => (mlstResult.value = r)),
        api.fetchMetadata(x).then((r) => (metadata.value = r)),
      ]).then(() => {
        state.value.setState(State.Main);
      });
    })
    .catch((err) => state.value.setError(err));
}

onMounted(loadData);

export type Tab = { id: string; name: string };

const tabs: Tab[] = [
  { id: "summary", name: "Summary" },
  { id: "annotation-table", name: "Features" },
  { id: "genome-viewer", name: "Genome Viewer" },
  { id: "metadata", name: "Metadata" },
  { id: "download", name: "Download" },
];

const active_tab: Ref<string> = ref(route.params.tab as string);

function updateTab(newTab: string) {
  active_tab.value = newTab;
  router.push({ name: "result", params: { tab: newTab }, replace: true });
}

const state = usePageState();
state.value.setState(State.Loading);
</script>

<template>
  <main class="container">
    <div class="row">
      <h2>Dataset: {{ id }}</h2>
    </div>
    <Loading :state="state">
      <Pane
        :items="tabs"
        :activeItem="active_tab"
        @update:value="(newValue) => updateTab(newValue)"
      >
        <template v-if="active_tab === 'genome-viewer'">
          <BaktaGenomeViewer :data="baktaResult" />
        </template>
        <template v-if="active_tab === 'annotation-table'">
          <BaktaAnnotationTable :data="baktaResult" />
        </template>
        <template
          v-if="
            active_tab == 'summary' &&
            baktaResult &&
            gtdbtkResult &&
            checkmResult &&
            mlstResult
          "
        >
          <SummaryPane
            :id="id"
            :bakta="baktaResult"
            :gtdbtk="gtdbtkResult"
            :checkm="checkmResult"
            :mlst="mlstResult"
          />
        </template>
        <template v-if="active_tab == 'metadata'">
          <MetadataCard :metadata="metadata" />
        </template>
        <template v-if="active_tab == 'download'">
          <DownloadLinks :dataset="dataset" />
        </template>
      </Pane>
    </Loading>
  </main>
</template>
