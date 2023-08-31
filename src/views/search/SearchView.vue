<script setup lang="ts">
import { useApi } from "@/BakrepApi";
import CenteredLargeSpinner from "@/components/CenteredLargeSpinner.vue";
import Loading from "@/components/Loading.vue";
import { empty, type PaginationData } from "@/components/pagination/Pagination";
import Pagination from "@/components/pagination/Pagination.vue";
import type { BakrepSearchResultEntry } from "@/model/BakrepSearchResult";
import usePageState, { State } from "@/PageState";
import { onMounted, ref, type Ref } from "vue";
import ResultTable from "./ResultTable.vue";
const state = usePageState();
const entries: Ref<BakrepSearchResultEntry[]> = ref([]);

const api = useApi();
const pagination: Ref<PaginationData> = ref(empty());
const searchText = ref("");
function search(offset = 0) {
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
      offset: offset,
      limit: 10,
    })
    .then((r) => {
      entries.value = r.results;
      state.value.setState(State.Main);
      pagination.value.offset = r.offset;
      pagination.value.total = r.total;
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
            @click="search(0)"
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
          <Pagination
            class="mt-3"
            :value="pagination"
            @update:offset="search"
          />
        </div>
      </template>
    </Loading>
  </main>
</template>

<style></style>
