<template>
  <div class="rounded bg-body-tertiary p-4 mb-4">
    <div>
      <div><span class="fw-bold">Genome Size:</span> <span>{{ sizeValue[0] + 'kbp' }} - {{ sizeValue[1] + 'kbp' }}</span></div>
      <vue-slider :min="0" :max="100000" v-model="sizeValue" :lazy="true" :interval="500" />
    </div>
    <div>
      <div class="fw-bold">Contig Count:</div>
      <vue-slider :min="1" :max="1000" v-model="contigValue" :lazy="true" />
    </div>
    <div>
      <div class="fw-bold">Quality:</div>
      <vue-slider :min="0" :max="100" v-model="qualityValue" :lazy="true" />
    </div>
    <div>
      <div class="fw-bold">Contamination:</div>
      <vue-slider :min="0" :max="100" v-model="contaminationValue" :lazy="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css'

const sizeValue = ref([0, 100000]);
const contigValue = ref([1, 1000]);
const qualityValue = ref([75, 100]);
const contaminationValue = ref([0, 10]);

</script>
