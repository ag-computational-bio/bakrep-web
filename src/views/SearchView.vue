<script setup lang="ts">
import { ref } from "vue";
import SearchWidget from "@/components/SearchWidget.vue";
import ResultTable from "@/components/ResultTable.vue";

const entries = ref([])
</script>

<template>
  <main class="container pt-5">
    <div class="row">
      <SearchWidget v-model="entries"/>
    </div>

    <div class="row py-3 my-5">
      <ResultTable :entries=entries />
    </div>
  </main>
</template>

<style>
</style>