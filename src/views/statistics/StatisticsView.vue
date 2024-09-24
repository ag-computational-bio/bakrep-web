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
  </Loading>
</template>
