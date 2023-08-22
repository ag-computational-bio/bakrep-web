<script setup lang="ts">
import { ref} from 'vue';

let emit = defineEmits(['update:modelValue'])

let searchInput = ref("")

function searchRepository(input: String) {
  let testResults = [{
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
  }]
  
  emit('update:modelValue', testResults)
}

</script>

<!-- 
  An initial Searchwidget, will need to be refined depending on the search parameters and language
 -->

<template>
  <div class="p-3 rounded bg-body-tertiary">
    <div class="input-group">
      <button @click="searchRepository(searchInput)" class="btn btn-outline-secondary" type="button" id="button-search">Search</button>
      <input type="text" v-model.lazy="searchInput" placeholder="search bakrep for..." class="form-control" aria-describedby="button-search" aria-label="Search Button"/>
    </div>
  </div>
</template>

<style></style>