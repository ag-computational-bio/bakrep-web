<script setup lang="ts">
import { ref } from 'vue';

const searchInput = ref("")
</script>

<!-- 
  An initial Searchwidget, will need to be refined depending on the search parameters and language
 -->

<template>
  <div class="p-3 rounded bg-body-tertiary">
    <div class="input-group">
      <button class="btn btn-outline-secondary" type="button" id="button-search">Search</button>
      <input type="text" v-model.lazy="searchInput" placeholder="search bakrep for..." class="form-control" aria-describedby="button-search" aria-label="Search Button"/>
    </div>
  </div>
</template>

<style></style>