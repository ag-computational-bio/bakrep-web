<script setup lang="ts">
import SearchWidget from "@/components/SearchWidget.vue";
import ResultTable from "@/components/ResultTable.vue";

const testEntries = [{
    "id": 2,
    "GC": 0.75,
    "Contigs": 175,
    "Name": "Decumaria L."
  }, {
    "id": 3,
    "GC": 0.23,
    "Contigs": 171,
    "Name": "Avicennia germinans (L.) L."
  }, {
    "id": 4,
    "GC": 0.40,
    "Contigs": 19,
    "Name": "Cetraria ericetorum Opiz ssp. reticulata (Rasanen) Karnefelt"
  }, {
    "id": 5,
    "GC": 0.61,
    "Contigs": 66,
    "Name": "Rudbeckia laciniata L. var. laciniata"
  }, {
    "id": 6,
    "GC": 0.49,
    "Contigs": 170,
    "Name": "Tetraclinis articulata (Vahl) Masters"
  }]
</script>

<template>
  <main class="container">
    <div class="row">
      <SearchWidget />
    </div>

    <div class="row">
      <ResultTable :entries=testEntries />
    </div>
  </main>
</template>

<style>
main {
  min-height: 100vh;
}
</style>