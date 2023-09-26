<script setup lang="ts">
import DownloadLinks from "@/components/DownloadLinks.vue";
import Loading from "@/components/Loading.vue";
import Pane from "@/components/Pane.vue";
import ContigBar from "@/components/ContigBar.vue";
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
import BaktaStats from "./bakta/BaktaStats.vue";
import DisplayAssembly from "./DisplayAssembly.vue";
import GtdbtkTaxonomy from "./GtdbtkTaxonomy.vue";
import PhylogenyTree from "@/components/PhylogenyTree.vue";

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

export type Tab = { id: string; name: string };

const tabs: Tab[] = [
  { id: "summary", name: "Summary" },
  { id: "annotation-table", name: "Features" },
  { id: "genome-viewer", name: "Genome Viewer" },
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
        <template v-if="active_tab == 'summary' && baktaResult">
          <div class="row pb-3">
            <div class="row">
              <h5>Dataset Summary {{ id }}</h5>
              <div class="col-6 h-100">
                <table class="table statstable">
                  <tr>
                    <th>Species:</th>
                    <td>
                      {{ baktaResult.genome.genus }}
                      {{ baktaResult.genome.species }}
                    </td>
                  </tr>
                </table>
              </div>
              <div class="col-6">
                <table class="table statstable">
                  <tr>
                    <th>Strain:</th>
                    <td>{{ baktaResult.genome.strain }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 col-lg-4 col-md-5 p-0">
              <div class="card h-100">
                <div class="card-header">Assembly</div>
                <div class="card-body">
                  <DisplayAssembly
                    :checkm="checkmResult"
                    :bakta="baktaResult"
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-lg-8 col-md-7 p-0 ps-3">
              <div class="card h-100">
                <div class="card-header">Phylogeny</div>
                <div class="card-body">
                  <PhylogenyTree :gtdb="gtdbtkResult" />
                </div>
              </div>
            </div>
          </div>
          <div class="row my-3">
            <div class="col-12 p-0">
              <div class="card h-100">
                <div class="card-header">Taxonomy</div>
                <div class="card-body">
                  <GtdbtkTaxonomy :gtdb="gtdbtkResult" :mlst="mlstResult" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 p-0">
              <h5>Contigs:</h5>
              <ContigBar
                :sequences="baktaResult.sequences"
                :length="baktaResult.stats.size"
                :n50="baktaResult.stats.n50"
              />
            </div>
          </div>
          <div class="row pt-5">
            <div class="col-12 card p-0">
              <div class="card-header">Annotation</div>
              <div class="card-body">
                <h5 class="card-title">Number of features</h5>
                <BaktaStats :data="baktaResult" />
              </div>
            </div>
          </div>
        </template>
        <template v-if="active_tab == 'download'">
          <DownloadLinks :dataset="dataset" />
        </template>
      </Pane>
    </Loading>
  </main>
</template>
