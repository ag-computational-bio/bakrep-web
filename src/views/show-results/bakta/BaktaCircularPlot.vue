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
      <h5>{{ highlight.id }}</h5>
      <table class="table table-sm">
        <tbody>
          <tr>
            <td class="text-end">Type</td>
            <td>{{ highlight.type }}</td>
          </tr>
          <tr v-if="highlight.strand">
            <td class="text-end">Strand</td>
            <td>{{ highlight.strand }}</td>
          </tr>
          <tr>
            <td class="text-end">Coordinates</td>
            <td>
              {{
                highlight.strand == "-"
                  ? `${highlight.stop}-${highlight.start}`
                  : `${highlight.start}-${highlight.stop}`
              }}
            </td>
          </tr>
          <tr v-if="highlight.frame">
            <td class="text-end">Frame</td>
            <td>{{ highlight.frame }}</td>
          </tr>

          <tr>
            <td class="text-end">Length</td>
            <td>{{ formatBp(highlight.stop - highlight.start, "bp") }}</td>
          </tr>
          <tr>
            <td class="text-end">Locus</td>
            <td>{{ highlight.locus ?? "-" }}</td>
          </tr>
          <tr>
            <td class="text-end">Gene</td>
            <td>{{ highlight.gene ?? "-" }}</td>
          </tr>
          <tr>
            <td class="text-end">Product</td>
            <td>{{ highlight.product ?? "-" }}</td>
          </tr>

          <tr v-if="highlight.nt">
            <td class="text-end">GC</td>
            <td>{{ formatGc(calcGcContent(highlight.nt, 1, false).mean) }}</td>
          </tr>
          <tr v-if="highlight.rbs_motif">
            <td class="text-end">RBS motif</td>
            <td>{{ highlight.rbs_motif }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>
<script setup lang="ts">
import type { Feature, Sequence } from "@/model/BaktaResults";
import * as d3 from "d3";
import { onMounted, ref, useTemplateRef, watch } from "vue";
import baktaHelper from "./bakta-helper";
import { featureTrack } from "./circluar-plot/feature-track";
import { bpScale, formatBp } from "./circluar-plot/formatters";
import { radialAreaTrack } from "./circluar-plot/radial-area-track";
import { radialAxis } from "./circluar-plot/radial-axis";
import { lookupFeatureColor } from "./feature-colors";
import {
  calcGcContent,
  calcGcSkew,
  type SlidingWindowResult,
} from "./gc-content";
import { formatGc } from "../formatters";

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
 * Main scale for most circular positioning in radians
 */
let radiansScale: d3.ScaleLinear<number, number, never>;

function createOrGetGroup(
  parent: d3.Selection<SVGGElement, undefined, null, undefined>,
  clz: string,
): d3.Selection<SVGGElement, undefined, null, undefined> {
  let group = parent.select<SVGGElement>(`g.${clz}`);
  if (group.empty()) group = parent.append("g").attr("class", clz);
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
  const res = calcGcSkew(seq.sequence, 1440, true);
  return {
    ...res,
    deviation: res.data.map((x) => [x[0], x[1] - res.mean] as Coordinate),
  };
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
  gcSkew: DeviationSlidingWindowResult;
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

const highlight = ref<Feature>();
const tooltipEl = useTemplateRef("tooltip");

function updateTooltip(f: Feature | undefined, evt: any) {
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
  function updateSvg(
    g:
      | d3.Selection<SVGSVGElement, undefined, null, undefined>
      | d3.Transition<SVGSVGElement, undefined, null, undefined>,
  ) {
    g.attr("width", plot.width);
    g.attr("height", plot.height);
    g.attr("style", "max-width: 100%; height: auto;");
  }
  function handleZoom(e: d3.D3ZoomEvent<SVGSVGElement, undefined>) {
    if (plotG) plotG.attr("transform", e.transform.toString());
  }
  let initCall = svg == undefined;
  const zoom = d3.zoom().on("zoom", handleZoom);
  if (svg == undefined) {
    svg = d3
      .create("svg")
      .call(updateSvg)
      .call(zoom as any);
  } else svg.transition().call(updateSvg);

  radiansScale = d3
    .scaleLinear([0, 2 * Math.PI])
    .domain([0, props.sequence.length]);

  plotG = svg.select("g");
  if (plotG.empty()) plotG = svg.append("g");

  function configureBackground(
    g:
      | d3.Selection<SVGRectElement, undefined, null, undefined>
      | d3.Transition<SVGRectElement, undefined, null, undefined>,
  ) {
    g.attr("class", "background");
    g.attr("fill", "white");
    g.attr("x", -plot.width / 2);
    g.attr("y", -plot.width / 2);
    g.attr("width", plot.width);
    g.attr("height", plot.height);
  }
  let background = plotG.select<SVGRectElement>("rect");
  if (background.empty())
    background = plotG.append("rect").call(configureBackground);
  else background.transition().call(configureBackground);

  const axis = radialAxis(radiansScale, plot.width / 2).tickFormat((x, r) =>
    formatBp(x, bpScale(r[1])),
  );

  const featureColor = (f: Feature) => baktaHelper.lookupCogColorForFeature(f);
  const features = createOrGetGroup(plotG, "features");
  const cdsFwdTrack = featureTrack(
    "cdsFwd",
    radiansScale,
    plotData.value.features.cdsFwd,
  )
    .height(25)
    .color(featureColor)
    .onHighlight(updateTooltip);
  const cdsRevTrack = featureTrack(
    "cdsRev",
    radiansScale,
    plotData.value.features.cdsRev,
  )
    .height(25)
    .color(featureColor)
    .onHighlight(updateTooltip);

  const otherCdsTrack = featureTrack(
    "cdsOther",
    radiansScale,
    plotData.value.features.other,
  )
    .height(25)
    .stroke(lookupFeatureColor)
    .color(lookupFeatureColor)
    .onHighlight(updateTooltip);
  const gcTrack = radialAreaTrack(
    "gc",
    radiansScale,
    plotData.value.gc.deviation,
  )
    .title("GC deviation")
    .height(80)
    .colors({ positive: "#17becf", negative: "#bcbd22" });
  const gcSkewTrack = radialAreaTrack(
    "gc-skew",
    radiansScale,
    plotData.value.gcSkew.deviation,
  )
    .title("GC skew deviation")
    .height(80)
    .colors({ positive: "#fb9a99", negative: "#cab2d6" });

  let radius = plot.width / 2;
  const trackMargin = 10;
  createOrGetGroup(plotG, "ruler").call(axis.apply);
  radius = radius - axis.height() - trackMargin;
  features.call(cdsFwdTrack.radius(radius).apply);
  radius = radius - cdsFwdTrack.height() - trackMargin;
  features.call(cdsRevTrack.radius(radius).apply);
  radius = radius - cdsRevTrack.height() - trackMargin;
  features.call(otherCdsTrack.radius(radius).apply);
  radius = radius - otherCdsTrack.height() - trackMargin;
  createOrGetGroup(plotG, "gc").call(gcTrack.radius(radius).apply);
  radius = radius - gcSkewTrack.height() - 2 * trackMargin;
  createOrGetGroup(plotG, "gc-skew").call(gcSkewTrack.radius(radius).apply);
  updateTitle(props.sequence, plotG);

  if (initCall) {
    svg.call(
      zoom.transform as any,
      d3.zoomIdentity.translate(plot.width / 2, plot.height / 2),
    );
  }
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
