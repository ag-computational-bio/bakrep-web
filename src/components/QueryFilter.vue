<template>
  <div class="rounded bg-body-secondary p-4 mb-4">
    <div class="input-group mb-3">
      <span class="input-label input-group-text">Size:</span>
      <input class="form-control" type="text" v-model="sizeMin" />
      <span class="input-group-text">Min</span>
      <input class="form-control" type="text" v-model="sizeMax" />
      <span class="input-group-text">Max</span>
    </div>

    <div class="input-group mb-3">
      <span class="input-label input-group-text">Contig Count:</span>
      <input class="form-control" type="text" v-model="contigMin" />
      <span class="input-group-text">Min</span>
      <input class="form-control" type="text" v-model="contigMax" />
      <span class="input-group-text">Max</span>
    </div>

    <div class="input-group mb-3">
      <span class="input-label input-group-text">GC Ratio:</span>
      <input class="form-control" type="text" v-model="gcMin" />
      <span class="input-group-text">Min</span>
      <input class="form-control" type="text" v-model="gcMax" />
      <span class="input-group-text">Max</span>
    </div>

    <div class="input-group mb-3">
      <div class="input-label input-group-text">Quality:</div>
      <input class="form-control" type="text" v-model="qualityMin" />
      <div class="input-group-text">Min</div>
      <input class="form-control" type="text" v-model="qualityMax" />
      <div class="input-group-text">Max</div>
    </div>

    <div class="input-group mb-3">
      <div class="input-label input-group-text">Contamination:</div>
      <input class="form-control" type="text" v-model="contaminationMin" />
      <div class="input-group-text">Min</div>
      <input class="form-control" type="text" v-model="contaminationMax" />
      <div class="input-group-text">Max</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const sizeMin = ref();
const sizeMax = ref();

const gcMin = ref();
const gcMax = ref();

const qualityMin = ref();
const qualityMax = ref();

const contaminationMin = ref();
const contaminationMax = ref();

const contigMin = ref();
const contigMax = ref();
</script>

<style scoped>
.input-label {
  width: 8.5rem;
}
</style>
