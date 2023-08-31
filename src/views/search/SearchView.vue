<script setup lang="ts">
import { useApi } from "@/BakrepApi";
import ResultTable from "./ResultTable.vue";
import type { BakrepSearchResultEntry } from "@/model/BakrepSearchResult";
import { onMounted, ref, type Ref } from "vue";
import usePageState, { State } from "@/PageState";
import Loading from "@/components/Loading.vue";
import CenteredLargeSpinner from "@/components/CenteredLargeSpinner.vue";
const state = usePageState();
const entries: Ref<BakrepSearchResultEntry[]> = ref([]);

const api = useApi();

const searchText = ref("");
function search() {
  let query;
  if (!searchText.value) query = {};
  else
    query = {
      field: "gtdbtk.classification.species",
      op: "~",
      value: searchText.value,
    };

  state.value.setState(State.Loading);

  api
    .search({
      query: query,
      sort: [{ field: "bakta.stats.no_sequences", ord: "asc" }],
      offset: 0,
      limit: 10,
    })
    .then((r) => {
      entries.value = r.results;
      state.value.setState(State.Main);
    });
}
function handleKey(evt: KeyboardEvent) {
  if (evt.key === "Enter") {
    search();
    evt.preventDefault();
  }
}
onMounted(search);
</script>

<template>
  <main class="container pt-5">
    <div class="row">
      <div class="p-3 rounded bg-body-tertiary">
        <div class="input-group">
          <input
            type="text"
            v-model="searchText"
            placeholder="search bakrep for..."
            class="form-control"
            aria-describedby="button-search"
            aria-label="Search Button"
            @keydown="handleKey"
          />
          <button
            @click="search"
            class="btn btn-outline-secondary"
            type="button"
            id="button-search"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <Loading :state="state">
      <template v-slot:loading>
        <CenteredLargeSpinner />
      </template>
      <template v-slot:content>
        <div class="row py-3 my-5">
          <ResultTable :entries="entries" />
        </div>
      </template>
    </Loading>
  </main>
</template>

<style></style>
