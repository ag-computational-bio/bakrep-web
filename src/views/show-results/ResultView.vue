<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from "vue";
import usePageState, { State } from "@/PageState";
import Loading from "@/components/Loading.vue";
import Modal from "@/components/Modal.vue";
import Pane from "@/components/Pane.vue";

import { useApi } from "@/BakrepApi";
import type { Dataset } from "@/model/Dataset";
import { useRoute } from "vue-router";
import DatasetSummary from "./DatasetSummary.vue";
import GtdbtkTaxonomy from "./GtdbtkTaxonomy.vue";
import DisplayAssembly from "./DisplayAssembly.vue";
import type { BaktaResult } from "@/model/BaktaResults";
import type { GtdbtkResult } from "@/model/GtdbtkResult";
import type { CheckmResult } from "@/model/CheckmResults";
import FeatureTable from "./FeatureTable.vue";
import BaktaAnnotationTable from "./bakta/BaktaAnnotationTable.vue";
import BaktaGenomeViewer from "./bakta/BaktaGenomeViewer.vue";
import BaktaStats from "./bakta/BaktaStats.vue";
import CenteredLargeSpinner from "@/components/CenteredLargeSpinner.vue";
import type { MlstResult } from "@/model/MlstResults";
const route = useRoute();
const id = computed(() => route.params.id as string);
const api = useApi();
const dataset: Ref<Dataset | undefined> = ref();

const baktaResult: Ref<BaktaResult | undefined> = ref();
const gtdbtkResult: Ref<GtdbtkResult | undefined> = ref();
const checkmResult: Ref<CheckmResult | undefined> = ref();
const mlstResult: Ref<MlstResult | undefined> = ref();

function loadData() {
  return api.getDataset(id.value).then((x) => {
    dataset.value = x;
    return Promise.all([
      api.fetchBaktaResult(x).then((r) => (baktaResult.value = r)),
      api.fetchGtdbtkResult(x).then((r) => (gtdbtkResult.value = r)),
      api.fetchCheckmResult(x).then((r) => (checkmResult.value = r)),
      api.fetchMlstResult(x).then((r) => (mlstResult.value = r)),
    ]).then(() => {
      active_tab.value = "summary";
      state.value.setState(State.Main);
    });
  });
}

onMounted(loadData);

const featureTable = ref(false);
const toggle = ref({
  annotation: true,
  taxonomy: true,
  checkm: true,
});

const tabs = [
  "summary",
  "annotation",
  "assembly",
  "taxonomy",
  "bakta-annotation-table",
  "bakta-genome-viewer",
  "bakta-stats",
];

type Tab = (typeof tabs)[number];

const active_tab: Ref<Tab> = ref("summary");

const state = usePageState();
state.value.setState(State.Loading);

const showActionModal = ref(false);
</script>

<template>
  <main class="container">
    <div class="row">
      <h2>Dataset: {{ id }}</h2>
    </div>

    <Loading :state="state">
      <template v-slot:loading>
        <CenteredLargeSpinner />
      </template>
      <template v-slot:content>
        <Pane :action="{ title: 'Download' }" :items="tabs" :activeItem="active_tab"
          @update:value="(newValue) => (active_tab = newValue)">
          <template v-if="active_tab === 'bakta-genome-viewer'">
            <BaktaGenomeViewer :data="baktaResult" />
          </template>
          <template v-if="active_tab === 'bakta-stats'">
            <BaktaStats :data="baktaResult" />
          </template>
          <template v-if="active_tab === 'bakta-annotation-table'">
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
          <template v-if="active_tab == 'annotation'">
            <!-- <div class="h5" @click="toggle.annotation = !toggle.annotation"><i class="bi"
                :class="toggle.annotation ? 'bi-caret-down' : 'bi-caret-right'"></i>Annotation</div> -->
            <div v-if="toggle.annotation">
              <DatasetSummary :annotation="baktaResult" :id="id" :checkm="checkmResult" />
              <button class="my-4 btn btn-primary" @click="featureTable = !featureTable">
                <template v-if="featureTable"> Hide Table </template>
                <template v-else> Show Table </template>
              </button>
              <FeatureTable v-if="featureTable" :features="baktaResult?.features" />
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
          <template v-slot:action>
            <div class="btn btn-primary ms-auto" @click="showActionModal = true">
              Download
            </div>
            <Modal v-if="showActionModal == true" @close="showActionModal = false">
              <template v-slot:header>
                <h2>Download Dataset</h2>
              </template>
              <template v-slot:body>
                <ul>
                  <li>Link to One</li>
                  <li>Link to Two</li>
                  <li>Link to Three</li>
                  <li>Link to All?</li>
                </ul>
              </template>
            </Modal>
          </template>
        </Pane>
      </template>
    </Loading>
  </main>
</template>
