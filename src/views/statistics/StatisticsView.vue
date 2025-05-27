<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useApi } from "@/BakrepApi";
import PhylogenyCountsBarChart from "./PhylogenyCountsBarchart.vue";
import RepositoryStatistics from "./RepositoryStatistics.vue";
import usePageState, { State } from "@/PageState";
import Loading from "@/components/Loading.vue";
import { useRouter } from "vue-router";
const api = useApi();
const router = useRouter();

const summaryData = ref();
const genusData = ref();
const speciesData = ref();

function loadData() {
  return Promise.all([
    api.fetchSpeciesStatistics().then((r) => {
      speciesData.value = r;
    }),
    api.fetchSummary().then((r) => {
      summaryData.value = r;
    }),
    api.fetchGenusStatistics().then((r) => {
      genusData.value = r;
    }),
  ])
    .then(() => {
      state.value.setState(State.Main);
    })
    .catch(() =>
      state.value.setError(
        "Necessary data couldn't be loaded. Please try again later.",
      ),
    );
}

onMounted(loadData);

const state = usePageState();
state.value.setState(State.Loading);
type Tab =
  | "general"
  | "genus"
  | "species"
  | "krona-high-abundant"
  | "krona-medium-abundant";

const pane = computed(() =>
  router.currentRoute.value.query.view
    ? router.currentRoute.value.query.view
    : "general",
);

const buttons: { key: Tab; label: string }[] = [
  { key: "general", label: "General statistics" },
  { key: "genus", label: "Genus abundances" },
  { key: "species", label: "Species abundances" },
  {
    key: "krona-high-abundant",
    label: "Krona high-abundant species: >6000 datasets",
  },
  {
    key: "krona-medium-abundant",
    label: "Krona medium-abundant species: 400 - 6000 entries",
  },
];

function showTab(tab: Tab) {
  router.push({ query: { view: tab } });
  // pane.value = tab;
}

const kronaUrl1 = import.meta.env.BASE_URL + "/v2_krona_main.html";
const kronaUrl2 = import.meta.env.BASE_URL + "/v2_krona_sub.html";
</script>

<template>
  <Loading :state="state">
    <div class="container-fluid h-100">
      <div class="row">
        <div class="col-lg-2 col-sm-12 px-2">
          <div class="fw-bold text-center mb-3">Select visualization</div>
          <button
            v-for="e of buttons"
            :key="e.key"
            class="btn btn-primary mb-2 w-100"
            :class="{ active: pane === e.key }"
            @click="showTab(e.key)"
          >
            {{ e.label }}
          </button>
        </div>
        <div class="col-lg-10 col-sm-12">
          <div v-if="pane === 'general'" class="ps-5">
            <h3>General Repository Data:</h3>
            <RepositoryStatistics :entries="summaryData" />
          </div>
          <template v-if="pane === 'genus'">
            <div>
              <h3 class="ps-5 pt-2">Genus Composition:</h3>
              <p class="px-5">
                This chart presents the number of entries per genus for all
                genera stored in bakrep. The y-axis shows the genera sorted
                according to their abundance. The x-axis shows the
                logarithmically scaled abundance for the genera.
              </p>
              <p class="px-5">
                The default vertical resolution contains multiple genera per
                visible line. In order to see more details, you can zoom into
                areas of interest. Click on one of the corners of your area of
                interest and drag a selection box to the other corner of your
                interest. Once you release the mouse the plot will be zoomed to
                the selected area. Hovering over a bar will reveal the genus
                that is selected.
              </p>
              <PhylogenyCountsBarChart :inputData="genusData" />
            </div>
          </template>
          <template v-if="pane === 'species'">
            <h3 class="ps-5">Species Composition:</h3>
            <div>
              <p class="px-5">
                This chart presents the number of entries per species for all
                species stored in bakrep. The y-axis shows the species sorted
                according to their abundance. The x-axis shows the
                logarithmically scaled abundance for the species.
              </p>
              <p class="px-5">
                The default vertical resolution contains multiple genera per
                visible line. In order to see more details, you can zoom into
                areas of interest. Click on one of the corners of your area of
                interest and drag a selection box to the other corner of your
                interest. Once you release the mouse the plot will be zoomed to
                the selected area. Hovering over a bar will reveal the genus
                that is selected.
              </p>
              <PhylogenyCountsBarChart :inputData="speciesData" />
            </div>
          </template>
          <div class="w-100 full-height" v-if="pane === 'krona-high-abundant'">
            <iframe :src="kronaUrl1" class="w-100 full-height" />
          </div>
          <div
            class="w-100 full-height"
            v-if="pane === 'krona-medium-abundant'"
          >
            <iframe :src="kronaUrl2" class="w-100 full-height" />
          </div>
        </div>
      </div>
    </div>
  </Loading>
</template>
