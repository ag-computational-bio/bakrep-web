<script setup lang="ts">
import DownloadLinks from "@/components/DownloadLinks.vue";
import Loading from "@/components/Loading.vue";
import Pane from "@/components/Pane.vue";
import usePageState, { State } from "@/PageState";
import { computed, onMounted, ref, type Ref } from "vue";

import { useApi } from "@/BakrepApi";
import type { BaktaResult } from "@/model/BaktaResults";
import type { CheckmResult } from "@/model/CheckmResults";
import type { Dataset } from "@/model/Dataset";
import type { GtdbtkResult } from "@/model/GtdbtkResult";
import type { MlstResult } from "@/model/MlstResults";
import { useRoute } from "vue-router";
import BaktaAnnotationTable from "./bakta/BaktaAnnotationTable.vue";
import BaktaGenomeViewer from "./bakta/BaktaGenomeViewer.vue";
import BaktaStats from "./bakta/BaktaStats.vue";
import DatasetSummary from "./DatasetSummary.vue";
import DisplayAssembly from "./DisplayAssembly.vue";
import FeatureTable from "./FeatureTable.vue";
import GtdbtkTaxonomy from "./GtdbtkTaxonomy.vue";
const route = useRoute();
const id = computed(() => route.params.id as string);
const api = useApi();
const dataset: Ref<Dataset | undefined> = ref();

const baktaResult: Ref<BaktaResult | undefined> = ref();
const gtdbtkResult: Ref<GtdbtkResult | undefined> = ref();
const checkmResult: Ref<CheckmResult | undefined> = ref();
const mlstResult: Ref<MlstResult | undefined> = ref();

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
      ]).then(() => {
        state.value.setState(State.Main);
      });
    })
    .catch((err) => state.value.setError(err));
}

onMounted(loadData);

const featureTable = ref(false);
const toggle = ref({
  annotation: true,
  taxonomy: true,
  checkm: true,
});

export type Tab = { id: string; name: string };

const tabs: Tab[] = [
  { id: "summary", name: "Summary" },
  { id: "assembly", name: "Assembly" },
  { id: "taxonomy", name: "Taxonomy" },
  { id: "annotation-stats", name: "Annotation" },
  { id: "annotation-table", name: "Features" },
  { id: "genome-viewer", name: "Genome Viewer" },
  { id: "download", name: "Download" },
];

const active_tab: Ref<string> = ref(route.params.tab as string);

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
        @update:value="(newValue) => (active_tab = newValue)"
      >
        <template v-if="active_tab === 'genome-viewer'">
          <BaktaGenomeViewer :data="baktaResult" />
        </template>
        <template v-if="active_tab === 'annotation-stats'">
          <BaktaStats :data="baktaResult" />
        </template>
        <template v-if="active_tab === 'annotation-table'">
          <BaktaAnnotationTable :data="baktaResult" />
        </template>
        <template v-if="active_tab == 'summary'">
          <div class="col-4">
            <DatasetSummary
              :annotation="baktaResult"
              :id="id"
              :checkm="checkmResult"
            />
          </div>
        </template>
        <template v-if="active_tab == 'download'">
          <DownloadLinks :dataset="dataset" />
        </template>
        <template v-if="active_tab == 'annotation'">
          <!-- <div class="h5" @click="toggle.annotation = !toggle.annotation"><i class="bi"
                :class="toggle.annotation ? 'bi-caret-down' : 'bi-caret-right'"></i>Annotation</div> -->
          <div v-if="toggle.annotation">
            <DatasetSummary
              :annotation="baktaResult"
              :id="id"
              :checkm="checkmResult"
            />
            <button
              class="my-4 btn btn-primary"
              @click="featureTable = !featureTable"
            >
              <template v-if="featureTable"> Hide Table </template>
              <template v-else> Show Table </template>
            </button>
            <FeatureTable
              v-if="featureTable"
              :features="baktaResult?.features"
            />
          </div>
        </template>
        <template v-if="active_tab == 'taxonomy'">
          <!-- <div class="h5" @click="toggle.taxonomy = !toggle.taxonomy"><i class="bi"
                :class="toggle.taxonomy ? 'bi-caret-down' : 'bi-caret-right'"></i>Taxonomy</div> -->
          <GtdbtkTaxonomy :gtdb="gtdbtkResult" :mlst="mlstResult" />
        </template>
        <template v-if="active_tab == 'assembly'">
          <DisplayAssembly :checkm="checkmResult" :bakta="baktaResult" />
        </template>
      </Pane>
    </Loading>
  </main>
</template>
