<script setup lang="ts">
import type { BaktaResult } from "@/model/BaktaResults";
import type { CheckmResult } from "@/model/CheckmResults";
import type { GtdbtkResult } from "@/model/GtdbtkResult";
import type { MlstResult } from "@/model/MlstResults";
import type { PropType } from "vue";

import BaktaStats from "@/views/show-results/bakta/BaktaStats.vue";
import DisplayAssembly from "@/views/show-results/DisplayAssembly.vue";
import GtdbtkTaxonomy from "@/views/show-results/GtdbtkTaxonomy.vue";
import PhylogenyTree from "@/components/PhylogenyTree.vue";
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
  <div class="row gx-2 gy-2">
    <div class="col-lg-4 col-md-12">
      <div class="card h-100">
        <div class="card-header">Metadata</div>
        <div class="card-body">...</div>
      </div>
    </div>
    <div class="col-lg-4 col-md-12">
      <div class="card h-100">
        <div class="card-header">Assembly</div>
        <div class="card-body">
          <DisplayAssembly :checkm="checkm" :bakta="bakta" />
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-12">
      <div class="card h-100">
        <div class="card-header">Phylogeny</div>
        <div class="card-body">
          <PhylogenyTree :gtdb="gtdbtk" />
        </div>
      </div>
    </div>
  </div>
  <div class="row my-3 gx-2 gy-2">
    <div class="col-12">
      <div class="card h-100">
        <div class="card-header">Taxonomy</div>
        <div class="card-body">
          <GtdbtkTaxonomy :gtdb="gtdbtk" :mlst="mlst" :bakta="bakta" />
        </div>
      </div>
    </div>
  </div>
  <div class="row gx-2 gy-2">
    <div class="col-12">
      <h5>Contigs:</h5>
      <ContigBar
        :sequences="bakta.sequences"
        :length="bakta.stats.size"
        :n50="bakta.stats.n50"
      />
    </div>
  </div>
  <div class="row gx-2 gy-2 pt-4">
    <div class="col-12">
      <div class="card">
        <div class="card-header">Annotation</div>
        <div class="card-body">
          <BaktaStats :data="bakta" />
        </div>
      </div>
    </div>
  </div>
</template>
