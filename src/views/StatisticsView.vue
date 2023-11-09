<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApi } from "@/BakrepApi";
import GenusStatistics from "@/components/GenusStatistics.vue";
import SpeciesStatistics from "@/components/SpeciesStatistics.vue";
import RepositoryStatistics from "@/components/RepositoryStatistics.vue";
import usePageState, { State } from "@/PageState";
import Loading from "@/components/Loading.vue";
const api = useApi();

const summaryData = ref();
const genusData = ref();
const speciesData = ref();

function loadData() {
  return Promise.all([
    api.fetchSpeciesStatistics().then((r) => {speciesData.value = r}),
    api.fetchSummary().then((r) => {summaryData.value = r}),
    api.fetchGenusStatistics().then((r) => {genusData.value = r}),
  ]).then(() => {
    state.value.setState(State.Main);
  });
}

onMounted(loadData);

const state = usePageState();
state.value.setState(State.Loading)

</script>

<template>
  <Loading :state="state">
    <div class="ps-5">
      <h3>General Repository Data:</h3>
      <RepositoryStatistics :entries="summaryData" />
    </div>
    <div>
      <h3 class="ps-5">Genus Composition:</h3>
      <GenusStatistics :inputData="genusData" />
    </div>
    <div>
      <h3 class="ps-5">Species Composition:</h3>
      <SpeciesStatistics :inputData="speciesData" />
    </div>
  </Loading>
</template>
