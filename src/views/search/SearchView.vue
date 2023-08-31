<script setup lang="ts">
import { useApi } from "@/BakrepApi";
import ResultTable from "./ResultTable.vue";
import type { BakrepSearchResultEntry } from "@/model/BakrepSearchResult";
import { onMounted, ref, type Ref } from "vue";

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

  api
    .search({
      query: query,
      sort: [{ field: "bakta.stats.no_sequences", ord: "asc" }],
      offset: 0,
      limit: 10,
    })
    .then((r) => (entries.value = r.results));
}
function handleKey(evt: KeyboardEvent) {
  console.log(evt);
  if (evt.key === "Enter") {
    console.log("Search");
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
            v-model.lazy="searchText"
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

    <div class="row py-3 my-5">
      <ResultTable :entries="entries" />
    </div>
  </main>
</template>

<style></style>
