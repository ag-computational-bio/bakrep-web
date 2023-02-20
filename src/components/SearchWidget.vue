<script lang="ts">
export default {
  emits: ['update:modelValue'],
  data() {
    return {
      searchInput: ""
    }
  },
  methods: {
    searchRepository(input: string) {
      let testResults = [{
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
      this.$emit('update:modelValue', testResults)
    }
  }
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