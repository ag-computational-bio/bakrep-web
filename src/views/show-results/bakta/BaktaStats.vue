<template>
  <div class="row mb-5">
    <div class="col-md-10">
      <div class="row mb-2">
        <div class="col-4">
          <display-tuple
            :break="6"
            label="Total:"
            :value="data?.features.length"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <display-tuple
            :break="6"
            label="tRNA:"
            :value="featureCount['tRNA']"
          />
          <display-tuple
            :break="6"
            label="tmRNA:"
            :value="featureCount['tmRNA']"
          />
          <display-tuple
            :break="6"
            label="rRNA:"
            :value="featureCount['rRNA']"
          />
          <display-tuple
            :break="6"
            label="ncRNA:"
            :value="featureCount['ncRNA']"
          />
        </div>
        <div class="col-md-4">
          <display-tuple
            :break="6"
            label="ncRNA regions:"
            :value="featureCount['ncRNA-region']"
          />
          <display-tuple
            :break="6"
            label="CRISPR:"
            :value="featureCount['crispr']"
          />
          <display-tuple :break="6" label="CDS:" :value="featureCount['cds']" />
          <display-tuple
            :break="6"
            label="sORF:"
            :value="featureCount['sorf']"
          />
        </div>
        <div class="col-md-4">
          <display-tuple
            :break="6"
            label="oriC:"
            :value="featureCount['oriC']"
          />
          <display-tuple
            :break="6"
            label="oriV:"
            :value="featureCount['oriV']"
          />
          <display-tuple
            :break="6"
            label="oriT:"
            :value="featureCount['oriT']"
          />
          <display-tuple :break="6" label="gap:" :value="featureCount['gap']" />
        </div>
        <div class="col-md-3"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaktaResult } from "@/model/BaktaResults";
import { computed, type PropType } from "vue";
import bakta from ".//bakta-helper";
import DisplayTuple from "./DisplayTuple.vue";

const props = defineProps({
  data: { type: Object as PropType<BaktaResult> },
});
const name = computed(() => bakta.genomeName(props.data));
const size = computed(() => bakta.formattedSize(props.data));
const featureCount = computed(() => bakta.featureCount(props.data));
const sequencesCount = computed(() => bakta.sequencesCountString(props.data));
</script>
