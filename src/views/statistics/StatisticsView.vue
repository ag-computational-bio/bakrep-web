<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApi } from "@/BakrepApi";
import PhylogenyCountsBarChart from "./PhylogenyCountsBarchart.vue";
import RepositoryStatistics from "./RepositoryStatistics.vue";
import usePageState, { State } from "@/PageState";
import Loading from "@/components/Loading.vue";
const api = useApi();

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
</script>

<template>
  <Loading :state="state">
    <div class="ps-5">
      <h3>General Repository Data:</h3>
      <RepositoryStatistics :entries="summaryData" />
    </div>
    <div>
      <h3 class="ps-5">Genus Composition:</h3>
      <p class="px-5">
        This graph displays the genus composition of the bakrep dataset, the
        y-axis shows the different genus while the x-axis displays how often a
        sample of that genus is found in the database.
      </p>
      <p class="px-5">
        Both graphs are interactive, hovering over a bar will reveal the genus
        that is selected. It is also possible to select a zoom rectangle by
        simply dragging inside the graph. More options are available once you
        hover your mouse inside the graph panel.
      </p>
      <PhylogenyCountsBarChart :inputData="genusData" />
    </div>
    <div>
      <h3 class="ps-5">Species Composition:</h3>
      <PhylogenyCountsBarChart :inputData="speciesData" />
    </div>
  </Loading>
</template>
