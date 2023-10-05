<script setup lang="ts">
import type { BaktaResult } from "@/model/BaktaResults";
import type { CheckmResult } from "@/model/CheckmResults";
import type { GtdbtkResult } from "@/model/GtdbtkResult";
import type { MlstResult } from "@/model/MlstResults";
import type { PropType } from "vue";

import BaktaStats from "@/views/show-results/bakta/BaktaStats.vue";
import DisplayAssembly from "@/views/show-results/DisplayAssembly.vue";
import GtdbtkTaxonomy from "@/views/show-results/GtdbtkTaxonomy.vue";
import PhylogenyTree from "@/components/PhylogenyTree.vue"
import ContigBar from "@/components/ContigBar.vue";

const props = defineProps({
  id: { type: String },
  bakta: { type: Object as PropType<BaktaResult>, required: true },
  checkm: { type: Object as PropType<CheckmResult>, required: true },
  gtdbtk: { type: Object as PropType<GtdbtkResult>, required: true },
  mlst: { type: Object as PropType<MlstResult>, required: true },
});
</script>

<template>
  <div class="row pb-3">
    <div class="row">
      <h5>Dataset Summary {{ id }}</h5>
      <div class="col-6 h-100">
        <table class="table statstable">
          <tr>
            <th>Species:</th>
            <td>
              {{ bakta.genome.genus }}
              {{ bakta.genome.species }}
            </td>
          </tr>
        </table>
      </div>
      <div class="col-6">
        <table class="table statstable">
          <tr>
            <th>Strain:</th>
            <td>{{ bakta.genome.strain }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-12 col-lg-4 col-md-5 p-0">
      <div class="card h-100">
        <div class="card-header">Assembly</div>
        <div class="card-body">
          <DisplayAssembly :checkm="checkm" :bakta="bakta" />
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-lg-8 col-md-7 p-0 ps-3">
      <div class="card h-100">
        <div class="card-header">Phylogeny</div>
        <div class="card-body">
          <PhylogenyTree :gtdb="gtdbtk" />
        </div>
      </div>
    </div>
  </div>
  <div class="row my-3">
    <div class="col-12 p-0">
      <div class="card h-100">
        <div class="card-header">Taxonomy</div>
        <div class="card-body">
          <GtdbtkTaxonomy :gtdb="gtdbtk" :mlst="mlst" />
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12 p-0">
      <h5>Contigs:</h5>
      <ContigBar
        :sequences="bakta.sequences"
        :length="bakta.stats.size"
        :n50="bakta.stats.n50"
      />
    </div>
  </div>
  <div class="row pt-5">
    <div class="col-12 card p-0">
      <div class="card-header">Annotation</div>
      <div class="card-body">
        <h5 class="card-title">Number of features</h5>
        <BaktaStats :data="bakta" />
      </div>
    </div>
  </div>
</template>
