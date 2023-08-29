<template>
  <div ref="igvref"></div>
</template>

<script setup lang="ts">
import type { BaktaResult, Feature, Sequence } from "@/model/BaktaResults";
import type { IGVBrowser } from "igv";
import igv from "igv";
import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
  type PropType,
  type Ref,
} from "vue";
import bakta from "./bakta-helper";
import cog from "./cog-helper";

const props = defineProps({
  data: { type: Object as PropType<BaktaResult> },
});
const igvObj: Ref<IGVBrowser | undefined> = ref();

function color(feature: Feature) {
  if (feature.type === "cds") return cog.lookupCogColor(lookupCog(feature));
  if (feature.type === "tRNA") return "rgb(255,0,0)";
  if (feature.type === "rRNA") return "rgb(0,255,100)";
  return "rgb(100,0,0)";
}
function lookupCog(feature: Feature): string[] {
  return bakta.lookupCogFunctionalCategories(feature);
}

type IgvFeature = {
  chr: string;
  start: number;
  end: number;
  strand: string;
  type: string;
  color: string;
  locus?: string;
  gene?: string;
  product?: string;
  name?: string;
  cog?: string;
};
function createFeatures(
  baktaEntry: Feature,
  sequences: Sequence[],
): IgvFeature | IgvFeature[] {
  const feature: IgvFeature = {
    chr: baktaEntry.contig,
    // Bakta coordinates are 1-based closed intervals, but igvjs uses zero based open intervals
    // so we need to transform them here
    start: baktaEntry.start - 1,
    end: baktaEntry.stop,
    strand: baktaEntry.strand,
    type: baktaEntry.type,
    color: color(baktaEntry),
  };

  if ("locus" in baktaEntry && baktaEntry)
    feature.locus = baktaEntry.locus || "";
  if ("gene" in baktaEntry) feature.gene = baktaEntry.gene || "";

  if ("product" in baktaEntry) feature.product = baktaEntry.product || "";
  if ("product" in baktaEntry) feature.name = baktaEntry.product || "";
  if ("cds" === baktaEntry.type) {
    const cogs = lookupCog(baktaEntry);
    if (cogs.length > 0) feature.cog = cog.lookupCogLabels(cogs).join("<br>");
  }

  // split into two feature when end < start
  if (baktaEntry.stop < baktaEntry.start) {
    const seq = sequences.filter((s) => baktaEntry.contig === s.id)[0];
    return [
      { ...feature, start: feature.start, end: seq.length },
      { ...feature, start: 0, end: feature.end },
    ];
  }
  return feature;
}
const igvref = ref();
function setupIgv() {
  const track = (name: string, types: string[]) => ({
    name: name,
    types: types,
  });
  const featuretracks = [
    track("CDS/sORF", ["cds", "sorf"]),
    track("tRNA/tmRNA/rRNA", ["tRNA", "tmRNA", "rRNA"]),
    track("ncRNA", ["ncRNA"]),
    track("ncRNA-region", ["ncRNA-region"]),
    track("CRISPR", ["crispr"]),
    track("Gap", ["gap"]),
    track("oriC/oriV/oriT", ["oriC", "oriV", "oriT"]),
  ];
  const tracks = [];
  for (let t of featuretracks) {
    const ftrs =
      features.value.filter((x) => t.types.some((y) => x.type === y)) || [];
    tracks.push({
      name: t.name,
      type: "annotation",
      features: ftrs,
    });
  }

  const config = {
    reference: {
      id: genus.value,
      fastaURL: fastaUrl.value,
      indexed: false,
      tracks: tracks,
      wholeGenomeView: false,
    },
    loadDefaultGenomes: false,
  };
  igv.createBrowser(igvref.value, config).then((x) => {
    igvObj.value = x;
  });
}
function destroyIgv() {
  if (igvObj.value) {
    igv.removeBrowser(igvObj.value);
  }
}

function refresh() {
  if (igvObj.value) igvObj.value.visibilityChange();
}

const features = computed(() => {
  if (props.data === undefined) return [];
  const res = props.data;
  return props.data.features
    .map((x) => {
      return createFeatures(x, res.sequences);
    })
    .flat();
});

const seqEntries = computed(() => {
  if (props.data === undefined) return [];
  return props.data.sequences.map((x) => {
    return { name: x.id, seq: x.sequence };
  });
});

const fastaData = computed(() => {
  return seqEntries.value.map((x) => `>${x.name}\n${x.seq}`).join("\n");
});
const fastaUrl = computed(() => {
  const blob = new Blob([fastaData.value], { type: "text/plain" });
  return URL.createObjectURL(blob);
});
const genus = computed(() => {
  if (props.data) return props.data.genome.genus;
  return "";
});
watch(() => props.data, refresh);
onMounted(setupIgv);
onBeforeUnmount(destroyIgv);
</script>
