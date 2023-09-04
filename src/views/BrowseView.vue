<script setup lang="ts">
import { ref } from "vue";
import ResultTable from "@/components/ResultTable.vue";
import QueryFilter from "@/components/QueryFilter.vue";

const entries = ref([{
    "id": "SAMD00000344",
    "GC": 0.75,
    "Contigs": 175,
    "Length": 2359987,
    "Name": "Decumaria L."
  }, {
    "id": "SAMD00000344",
    "GC": 0.23,
    "Contigs": 171,
    "Length": 2359987,
    "Name": "Avicennia germinans (L.) L."
  }, {
    "id": "SAMD00000344",
    "GC": 0.40,
    "Contigs": 19,
    "Length": 2359987,
    "Name": "Cetraria ericetorum Opiz ssp. reticulata (Rasanen) Karnefelt"
  }, {
    "id": "SAMD00000344",
    "GC": 0.61,
    "Contigs": 66,
    "Length": 2359987,
    "Name": "Rudbeckia laciniata L. var. laciniata"
  }, {
    "id": "SAMD00000344",
    "GC": 0.49,
    "Contigs": 170,
    "Length": 2359987,
    "Name": "Tetraclinis articulata (Vahl) Masters"
  }
])

</script>

<template>
  <main class="container pt-5">
    <div class="row">
      <h2>Browse BakRep Genomes</h2>
    </div>

    <div class="row">
      <div class="col">
        <QueryFilter />
      </div>
    </div>

    <div class="row">
      <ResultTable :entries=entries />
    </div>
  </main>
</template>

<style>
</style>
