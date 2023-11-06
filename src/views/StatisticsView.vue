<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApi } from "@/BakrepApi";
import GenusStatistics from "@/components/GenusStatistics.vue";
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
    <div>
      <GenusStatistics :inputData="genusData" />
    </div>
    <div>
      <RepositoryStatistics class="" :entries="summaryData" />
    </div>
  </Loading>
</template>
