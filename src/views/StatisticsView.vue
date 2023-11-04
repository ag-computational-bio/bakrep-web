<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "@/BakrepApi";
const api = useApi();

const repositoryData = ref({});
const genusData = ref({});
const speciesData = ref({});

api.fetchLocalUrlContentAsJson("/stats/summary").then((r) => {
  repositoryData.value = r;
});

api.fetchLocalUrlContentAsJson("/stats/genus").then((r) => {
  genusData.value = r;
});

api.fetchLocalUrlContentAsJson("/stats/species").then((r) => {
  speciesData.value = r;
});
</script>

<template>
  <div>
    <GenusStatistics :inputData="genusData" />
  </div>
  <div>
    <RepositoryStatistics class="" :entries="repositoryData" />
  </div>
</template>
