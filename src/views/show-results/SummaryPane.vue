<script setup lang="ts">
import type { BaktaResult } from "@/model/BaktaResults";
import type { CheckmResult } from "@/model/CheckmResults";
import type { GtdbtkResult } from "@/model/GtdbtkResult";
import type { MlstResult } from "@/model/MlstResults";

import type { Metadata } from "@/model/Metadata";
import BaktaStats from "@/views/show-results/bakta/BaktaStats.vue";
import ContigBar, {
  type ContigBarEntry,
} from "@/views/show-results/contig-bar/ContigBar.vue";
import DisplayAssembly from "@/views/show-results/DisplayAssembly.vue";
import GtdbtkTaxonomy from "@/views/show-results/GtdbtkTaxonomy.vue";
import PhylogenyTree from "@/views/show-results/PhylogenyTree.vue";
import { computed } from "vue";
import DisplayMetadata from "./DisplayMetadata.vue";

const props = defineProps<{
  id: string;
  bakta?: BaktaResult;
  checkm?: CheckmResult;
  gtdbtk?: GtdbtkResult;
  mlst?: MlstResult;
  metadata?: Metadata;
}>();

const contigbarData = computed<ContigBarEntry[]>(() =>
  props.bakta ? extractData(props.bakta) : [],
);

function extractData(bakta: BaktaResult): ContigBarEntry[] {
  // extract feature counts
  const featureCountPerSequence: Record<string, Record<string, number>> = {};
  for (const f of bakta.features) {
    if (!(f.contig in featureCountPerSequence))
      featureCountPerSequence[f.contig] = {};
    if (!(f.type in featureCountPerSequence[f.contig]))
      featureCountPerSequence[f.contig][f.type] = 0;
    featureCountPerSequence[f.contig][f.type] =
      featureCountPerSequence[f.contig][f.type] + 1;
  }

  // extract sequence statistics

  const result: ContigBarEntry[] = [];
  for (const s of bakta.sequences) {
    const id = s.id;

    let featureCounts =
      id in featureCountPerSequence
        ? Object.keys(featureCountPerSequence[id]).map((k) => ({
            type: k,
            count: featureCountPerSequence[id][k],
          }))
        : [];

    let gcCount = 0;
    for (const c of s.sequence) {
      if (c.toLowerCase() == "g" || c.toLocaleLowerCase() == "c") gcCount++;
    }
    const gcContent = gcCount / s.length;
    result.push({
      id: s.id,
      length: s.length,
      featureCounts: featureCounts,
      gc: gcContent,
    });
  }
  return result;
}
</script>

<template>
  <div class="row gx-2 gy-2">
    <div class="col-lg-4 col-md-12">
      <div class="card h-100">
        <div class="card-header">Metadata</div>
        <div class="card-body">
          <DisplayMetadata :metadata="metadata" />
        </div>
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
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-end">
          <span>Contigs</span>
          <span class="fs-tiny text-secondary">
            sorted by length; N50 and N90 contigs are highlighted; more
            information on mouseover
          </span>
        </div>
        <div class="card-body">
          <template v-if="bakta">
            <ContigBar
              :margin="{ left: 5, right: 5, top: 0, bottom: 0 }"
              :height="80"
              :data="contigbarData"
            />
          </template>
          <template v-else> No contig data available </template>
        </div>
      </div>
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
