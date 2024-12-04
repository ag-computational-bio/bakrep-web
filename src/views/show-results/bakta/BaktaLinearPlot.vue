<template>
  <div ref="canvas"></div>
  <div
    ref="tooltip"
    style="
      position: fixed;
      background-color: white;
      border: black solid 1px;
      padding: 0.3rem;
      display: none;
      z-index: 4000;
    "
  >
    <template v-if="highlight">
      <GcTooltip v-if="'mean' in highlight" :data="highlight" />
      <FeatureTooltip v-else :feature="highlight" />
    </template>
  </div>
</template>
<script setup lang="ts">
import type { Feature, Sequence } from "@/model/BaktaResults";
import * as d3 from "d3";
import { onMounted, ref, useTemplateRef, watch } from "vue";
import { formatGc } from "../formatters";
import baktaHelper from "./bakta-helper";
import { bpScale, formatBp } from "./circluar-plot/formatters";
import { lookupFeatureColor } from "./feature-colors";
import {
  calcGcContent,
  calcGcSkew,
  type SlidingWindowResult,
} from "./gc-content";
import { featureTrack } from "./linear-plot/feature-track";
import FeatureTooltip from "./tooltip/FeatureTooltip.vue";
import type { GcSkewTooltipData, GcTooltipData } from "./tooltip/GcTooltip.vue";
import GcTooltip from "./tooltip/GcTooltip.vue";
import { linearAreaTrack } from "./linear-plot/linear-area-track";

const plot = {
  width: 1000,
  height: 1000,
};

const props = defineProps<{
  sequence: Sequence;
  features: Feature[];
}>();

let svg: d3.Selection<SVGSVGElement, undefined, null, undefined>;
let plotG: d3.Selection<SVGGElement, undefined, null, undefined> | undefined;

/**
 * Scales positions to the screen plot width
 */
let scale: d3.ScaleLinear<number, number, never>;
let scaleFactor = 1;
function createOrGetGroup(
  parent: d3.Selection<SVGGElement, undefined, null, undefined>,
  clz: string,
): d3.Selection<SVGGElement, undefined, null, undefined> {
  let group = parent.select<SVGGElement>(`g.${clz}`);
  if (group.empty()) {
    group = parent.append("g").attr("class", clz);
  }

  return group;
}

function updateTitle(
  seq: Sequence,
  svg: d3.Selection<SVGGElement, undefined, null, undefined>,
) {
  let sel = svg.selectAll<SVGTSpanElement, string>("g.title > text > tspan");
  if (sel.empty())
    sel = svg
      .append("g")
      .attr("class", "title")
      .append("text")
      .selectAll("tspan");
  sel
    .data([
      seq.simple_id,
      formatBp(seq.length, "bp"),
      "GC: " + formatGc(plotData.value.gc.mean),
    ])
    .join("tspan")
    .attr("text-anchor", "middle")
    .attr("y", (d, i) => `${i * 1.2}rem`)
    .attr("x", "0")
    .text((d) => d);
}

type Coordinate = [number, number];
type DeviationSlidingWindowResult = SlidingWindowResult & {
  deviation: Coordinate[];
};

function calcGcDistribution(seq: Sequence) {
  const res = calcGcContent(seq.sequence, 1440, true);
  return {
    ...res,
    deviation: res.data.map((x) => [x[0], x[1] - res.mean] as Coordinate),
  };
}

function calcGcSkewDistribution(seq: Sequence) {
  return calcGcSkew(seq.sequence, 1440, true);
}
type PlotData = {
  sequence: Sequence;
  features: {
    all: Feature[];
    cdsFwd: Feature[];
    cdsRev: Feature[];
    other: Feature[];
  };
  gc: DeviationSlidingWindowResult;
  gcSkew: SlidingWindowResult;
};

const plotData = ref<PlotData>({
  sequence: baktaHelper.createSequence(),
  features: {
    all: [],
    cdsFwd: [],
    cdsRev: [],
    other: [],
  },
  gc: calcGcDistribution(baktaHelper.createSequence()),
  gcSkew: calcGcSkewDistribution(baktaHelper.createSequence()),
});

function computePlotData(sequence: Sequence, features: Feature[]): PlotData {
  return {
    sequence: sequence,
    features: {
      all: features,
      cdsFwd: features.filter((x) => x.type === "cds" && x.strand === "+"),
      cdsRev: features.filter((x) => x.type === "cds" && x.strand === "-"),
      other: features.filter((x) => x.type !== "cds"),
    },
    gc: calcGcDistribution(sequence),
    gcSkew: calcGcSkewDistribution(sequence),
  };
}

const highlight = ref<Feature | GcTooltipData | GcSkewTooltipData>();
const tooltipEl = useTemplateRef("tooltip");

function updateTooltip(
  f: Feature | GcTooltipData | GcSkewTooltipData | undefined,
  evt: any,
) {
  highlight.value = f;
  const [x, y] = [evt.clientX, evt.clientY];
  updateTooltipPosition(x, y, f != undefined);
}

function updateTooltipPosition(x: number, y: number, visible: boolean) {
  if (tooltipEl.value) {
    const tooltip = d3.select(tooltipEl.value);
    const node = tooltip.node();
    if (node == null) return;
    const tooltipWidth = node.offsetWidth;
    const tooltipHeight = node.offsetHeight;

    const posX = x + tooltipWidth > window.innerWidth ? x - tooltipWidth : x;
    const posY = y + tooltipHeight > window.innerHeight ? y - tooltipHeight : y;
    d3.select(tooltipEl.value)
      .style("left", posX + 5 + "px")
      .style("top", posY + 5 + "px")
      .style("display", visible ? "block" : "none");
  }
}

function updatePlot() {
  const margin = { left: 30, right: 10 };
  function updateSvg(
    g:
      | d3.Selection<SVGSVGElement, undefined, null, undefined>
      | d3.Transition<SVGSVGElement, undefined, null, undefined>,
  ) {
    g.attr("width", plot.width);
    g.attr("height", plot.height);
    g.attr("style", "max-width: 100%; height: auto;");
  }

  function handleScale(e: d3.D3ZoomEvent<SVGSVGElement, undefined>) {
    scaleFactor = e.transform.k;
    updatePlot();
  }
  function handleZoom(e: d3.D3ZoomEvent<SVGSVGElement, undefined>) {
    if (plotG) plotG.attr("transform", e.transform.toString());
  }
  let initCall = svg == undefined;

  const scaleFactorZoom = d3
    .zoom<SVGGElement, undefined>()
    .on("zoom", handleScale)
    .filter((e: MouseEvent) => e.ctrlKey && e.type === "wheel");

  const zoom = d3
    .zoom<SVGSVGElement, undefined>()
    .on("zoom", handleZoom)
    .filter(
      (e: MouseEvent) => (!e.ctrlKey && e.type === "wheel") || e.button == 0,
    );
  if (svg == undefined) {
    svg = d3.create("svg").call(updateSvg).call(zoom);
  } else svg.transition().call(updateSvg);

  scale = d3
    .scaleLinear([margin.left, plot.width * scaleFactor - margin.right])
    .domain([0, props.sequence.length]);

  plotG = svg.select("g");
  if (plotG.empty()) plotG = svg.append("g").call(scaleFactorZoom);
  function configureBackground(
    g:
      | d3.Selection<SVGRectElement, undefined, null, undefined>
      | d3.Transition<SVGRectElement, undefined, null, undefined>,
  ) {
    g.attr("class", "background");
    g.attr("fill", "white");
    g.attr("x", 0);
    g.attr("y", 0);
    g.attr("width", plot.width);
    g.attr("height", plot.height);
  }
  let background = plotG.select<SVGRectElement>("rect.background");
  if (background.empty())
    background = plotG.append("rect").call(configureBackground);
  else background.transition().call(configureBackground);

  const axis = d3
    .axisTop(scale)
    .tickFormat((d) => formatBp(d as number, bpScale(scale.domain()[1])));
  createOrGetGroup(plotG, "ruler").call(axis);
  if (initCall) {
    svg.call(zoom.transform as any, d3.zoomIdentity.translate(0, 30));
  }

  const featureColor = (f: Feature) => baktaHelper.lookupCogColorForFeature(f);
  const features = createOrGetGroup(plotG, "features");
  const cdsFwdTrack = featureTrack(
    "cdsFwd",
    scale,
    plotData.value.features.cdsFwd,
  )
    .height(25)
    .color(featureColor)
    .onHighlight(updateTooltip);

  const cdsRevTrack = featureTrack(
    "cdsRev",
    scale,
    plotData.value.features.cdsRev,
  )
    .height(25)
    .color(featureColor)
    .onHighlight(updateTooltip);

  const otherCdsTrack = featureTrack(
    "cdsOther",
    scale,
    plotData.value.features.other,
  )
    .height(25)
    .stroke(lookupFeatureColor)
    .color(lookupFeatureColor)
    .onHighlight(updateTooltip);

  const gcTrack = linearAreaTrack("gc", scale, plotData.value.gc.deviation)
    .title("GC content")
    .height(80)
    .colors({ positive: "#17becf", negative: "#bcbd22" })
    .hover((evt, pos) => {
      if (pos == undefined) {
        updateTooltip(undefined, evt);
        return;
      }
      const gc = plotData.value.gc;
      const p = d3.bisect(
        gc.data.map((x) => x[0]),
        pos,
      );
      if (p >= 0 && p < gc.data.length) {
        const event: GcTooltipData = {
          type: "gc",
          mean: gc.mean,
          pos: [gc.data[p][0] - gc.windowSize, gc.data[p][0] + gc.windowSize],
          value: gc.data[p][1],
          deviation: gc.deviation[p][1],
        };
        updateTooltip(event, evt);
      }
    });
  const gcSkewTrack = linearAreaTrack("gc", scale, plotData.value.gcSkew.data)
    .title("GC skew")
    .height(80)
    .colors({ positive: "#fb9a99", negative: "#cab2d6" })
    .hover((evt, pos) => {
      if (pos == undefined) {
        updateTooltip(undefined, evt);
        return;
      }
      const data = plotData.value.gcSkew;
      const p = d3.bisect(
        data.data.map((x) => x[0]),
        pos,
      );
      if (p >= 0 && p < data.data.length) {
        const event: GcSkewTooltipData = {
          type: "gc-skew",
          mean: data.mean,
          pos: [
            data.data[p][0] - data.windowSize,
            data.data[p][0] + data.windowSize,
          ],
          value: data.data[p][1],
        };
        updateTooltip(event, evt);
      }
    });
  features.call(cdsFwdTrack.top(10).apply);
  features.call(cdsRevTrack.top(40).apply);
  features.call(otherCdsTrack.top(70).apply);
  createOrGetGroup(plotG, "gc").call(gcTrack.top(100).apply);
  createOrGetGroup(plotG, "gc-skew").call(gcSkewTrack.top(200).apply);
  return svg;
}

const canvas = useTemplateRef("canvas");
onMounted(() => {
  plotData.value = computePlotData(props.sequence, props.features);
  const _svg = updatePlot();
  const n = _svg.node();
  if (n && canvas.value) canvas.value.append(n);
});
watch(
  () => [props.features, props.sequence],
  () => {
    plotData.value = computePlotData(props.sequence, props.features);
    updatePlot();
  },
);
</script>
