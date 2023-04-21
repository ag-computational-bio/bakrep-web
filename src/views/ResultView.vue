<script setup lang="ts">
import { getDatasetById } from "../Api";
import { defineAsyncComponent, onMounted, ref } from "vue";
import Loading from "../components/Loading.vue";
import Pane from "../components/Pane.vue";
import usePageState from "../PageState";
import { State } from "../PageState";

const Result = defineAsyncComponent({
  loader: () => import('../components/Result.vue'),
});

let props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: false }
});

let dataset = ref();

let state = usePageState();
state.value.setState(State.Loading);

onMounted(() => {
  getDatasetById(props.id)
    .then((res: Dataset) => {
      dataset.value = res;
      return res;
  }).then(() => state.value.setState(State.Main));
});

</script>

<template>
  <main class="container">
    <div class="row">
      <h3>Dataset</h3>
    </div>
    <div class="row">
      <Loading :state="state">
        <template v-slot:loading>
          Loading
        </template>
        <template v-slot:content>
          <div v-for="result in dataset.results">
            {{ result.attributes }}
            {{ result.data }}
          </div>
        </template>
      </Loading>
    </div>
  </main>
</template>

<style></style>