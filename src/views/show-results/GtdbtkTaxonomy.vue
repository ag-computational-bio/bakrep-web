<template>
  <div class="row">
    <div class="col-lg-6 col-md-12">
      <table class="table statstable">
        <template v-if="bakta">
          <tr>
            <th scope="row">Species:</th>
            <td>{{ bakta.genome.genus }} {{ bakta.genome.species }}</td>
          </tr>
          <tr>
            <th scope="row">Strain:</th>
            <td>{{ bakta.genome.strain ? bakta.genome.strain : "-" }}</td>
          </tr>
        </template>
        <template v-if="gtdb">
          <tr>
            <th scope="row">Reference genome:</th>
            <td>
              <a
                class="fw-bold p-0"
                style="color: gray"
                :href="
                  'https://www.ncbi.nlm.nih.gov/datasets/genome/' +
                  gtdb.fastani_reference
                "
                target="_blank"
                >{{ gtdb.fastani_reference }}</a
              >
            </td>
          </tr>
          <tr>
            <th scope="row">Classification method:</th>
            <td>{{ gtdb.classification_method }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <th scope="row">NA</th>
          </tr>
        </template>
      </table>
    </div>
    <div class="col-lg-6 col-md-12" v-if="mlst">
      <table class="table statstable">
        <template v-if="mlst">
          <tr>
            <th scope="row">MLST sequence type:</th>
            <td>{{ mlst[0].sequence_type }}</td>
          </tr>
          <tr>
            <th scope="row">Schema:</th>
            <td>{{ mlst[0].scheme }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <th scope="row">NA</th>
          </tr>
        </template>
        <tr>
          <th scope="row" class="align-top">Alleles:</th>
          <td>
            <ul v-if="mlst[0].alleles">
              <li v-for="e of Object.entries(mlst[0].alleles)" :key="e[0]">
                {{ e[0] }}: {{ e[1] }}
              </li>
            </ul>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <div class="warning">
    <template v-if="gtdb && gtdb.warnings != 'NaN'">
      {{ gtdb.warnings }}
    </template>
  </div>
</template>
<script setup lang="ts">
import type { BaktaResult } from "@/model/BaktaResults";
import type { GtdbtkResult } from "@/model/GtdbtkResult";
import type { MlstResult } from "@/model/MlstResults";
import type { PropType } from "vue";
const props = defineProps({
  bakta: { type: Object as PropType<BaktaResult>, required: true },
  gtdb: { type: Object as PropType<GtdbtkResult>, required: true },
  mlst: { type: Object as PropType<MlstResult>, required: true },
});
</script>
