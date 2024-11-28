<template>
  <div class="w-100" ref="canvas"></div>
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
    <template v-if="selected">
      <h6>{{ selected.id }}</h6>
      <table class="table table-sm text-end">
        <tbody>
          <tr>
            <td>Length</td>
            <td>{{ formatBp(selected.length) }} bp</td>
          </tr>
          <tr>
            <td>&Sigma; Length</td>
            <td>{{ formatBp(selected.before + selected.length) }} bp</td>
          </tr>

          <tr v-if="!('contigs' in selected)">
            <td>GC-Content</td>
            <td>{{ formatGc(selected.gc) }}</td>
          </tr>
          <template v-if="'contigs' in selected">
            <tr>
              <td>Contigs</td>
              <td>{{ selected.contigs }}</td>
            </tr>
            <tr>
              <td>Length range</td>
              <td>
                {{ formatBp(selected.lengthRange[0]) }} bp -
                {{ formatBp(selected.lengthRange[1]) }} bp
              </td>
            </tr>
            <tr>
              <td>Gc range</td>
              <td>
                {{ formatGc(selected.gcRange[0]) }} -
                {{ formatGc(selected.gcRange[1]) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <h6>Featurecounts</h6>

      <table
        v-if="selected.featureCounts.length > 0"
        class="table table-sm text-end"
      >
        <tbody>
          <tr
            v-for="f of selected.featureCounts.toSorted(sortFeatures)"
            :key="f.type"
          >
            <td>{{ f.type }}</td>
            <td class="text-start">{{ f.count }}</td>
          </tr>
        </tbody>
      </table>
      <template v-else> No features on this contig </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import * as d3 from "d3";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";

import type { Feature } from "@/model/BaktaResults";
import sortByOrder from "@/util/sort";
import { formatBp, formatGc } from "../formatters";
const props = withDefaults(
  defineProps<
    {
      data: ContigBarEntry[];
    } & Partial<ChartConfig>
  >(),
  {
    width: 1000,
    height: 350,
    minContigDisplayWidth: 1,
    margin: (x) => ({
      top: 0,
      bottom: 0,
      left: 4,
      right: 4,
      ...x,
    }),
  },
);
const canvas = useTemplateRef("canvas");

watch(
  () => [
    props.data,
    props.minContigDisplayWidth,
    canvas.value,
    props.height,
    props.margin,
  ],
  () => updatePlot(),
);
export type Margin = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type ChartConfig = {
  width: number;
  height: number;
  margin: Margin;
  minContigDisplayWidth: number;
};
type D3Selection = d3.Selection<SVGSVGElement, undefined, null, undefined>;
type D3ChildSelection = d3.Selection<SVGGElement, undefined, null, undefined>;

const _data = computed(() => ({
  totalLength: props.data.reduce((a, v) => a + v.length, 0),
  entries: props.data.toSorted((a, b) => b.length - a.length),
}));

export type ContigBarEntry = {
  id: string;
  length: number;
  featureCounts: { type: string; count: number }[];
  gc: number;
};

type VisEntry = ContigBarEntry & { before: number };

type VisRemainEntry = VisEntry & {
  contigs: number;
  lengthRange: [number, number];
  gcRange: [number, number];
};

let svg: D3Selection | undefined;
let _width: number = 1000;
function updateSvgCanvas(immediate = false): D3Selection {
  // Create the SVG container.
  if (svg == undefined) {
    svg = d3
      .create("svg")
      .attr("width", _width)
      .attr("height", props.height)
      .attr("viewBox", [0, 0, _width, props.height])
      .attr("style", "max-width: 100%; height: auto;");
  } else {
    if (immediate)
      svg
        .attr("width", _width)
        .attr("height", props.height)
        .attr("viewBox", `0,0,${_width},${props.height}`)
        .attr("style", "max-width: 100%; height: auto;");
    else
      svg
        .transition()
        .attr("width", _width)
        .attr("height", props.height)
        .attr("viewBox", `0,0,${_width},${props.height}`)
        .attr("style", "max-width: 100%; height: auto;");
  }
  return svg;
}

let xScale: d3.ScaleLinear<number, number, number>;
let lenScale: d3.ScaleLinear<number, number, number>;

function updateScales() {
  xScale = d3
    .scaleLinear()
    .domain([0, _data.value.totalLength])
    .range([
      props.margin.left,
      _width - props.margin.left - props.margin.right,
    ]);
  lenScale = d3
    .scaleLinear()
    .domain([0, _data.value.totalLength])
    .range([0, _width - 2 * props.margin.left - props.margin.right]);
}

let xAxisEl: D3ChildSelection;
function updateAxis(immediate = false) {
  if (svg == undefined) throw "svg not initialized";
  if (xAxisEl == undefined)
    xAxisEl = svg
      .append("g")
      .attr("transform", "translate(0, 53)")
      .attr("class", "x-axis")
      .call(d3.axisBottom(xScale));
  else if (immediate) xAxisEl.call(d3.axisBottom(xScale));
  else xAxisEl.transition().call(d3.axisBottom(xScale));
}

let marksEl: D3ChildSelection;
function updateMarks(immediate = false) {
  if (svg == undefined) throw "svg not initialized";
  const domain_width = xScale.domain()[1] - xScale.domain()[0];
  if (marksEl == undefined) {
    marksEl = svg
      .append("g")
      .attr("class", "marks")
      .attr("transform", "translate(0, 20)")
      .attr("font-size", 10);
  }
  marksEl.call((g) => {
    const marks = [50, 90];
    g.selectAll("line")
      .data(marks)
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("x1", (d) => xScale((domain_width * d) / 100))
            .attr("x2", (d) => xScale((domain_width * d) / 100))
            .attr("y1", 2)
            .attr("y2", 10)
            .attr("stroke", "black"),
        (update) =>
          immediate
            ? update
                .attr("x1", (d) => xScale((domain_width * d) / 100))
                .attr("x2", (d) => xScale((domain_width * d) / 100))
            : update
                .transition()
                .attr("x1", (d) => xScale((domain_width * d) / 100))
                .attr("x2", (d) => xScale((domain_width * d) / 100)),
      );
    g.selectAll("text")
      .data(marks)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("x", (d) => xScale((domain_width * d) / 100))
            .attr("y", 0)
            .style("text-anchor", "middle")
            .text((d) =>
              new Intl.NumberFormat("en", { style: "percent" }).format(d / 100),
            ),
        (update) =>
          immediate
            ? update.attr("x", (d) => xScale((domain_width * d) / 100))
            : update
                .transition()
                .attr("x", (d) => xScale((domain_width * d) / 100)),
      );
  });
}

let contigsEl: D3ChildSelection;
function updateData(immediate = false) {
  if (svg == undefined) throw "svg not initialized";

  let positions: VisEntry[] = [];
  for (const e of _data.value.entries) {
    if (positions.length == 0) positions.push({ before: 0, ...e });
    else {
      const last = positions[positions.length - 1];
      positions.push({
        before: last.before + last.length,
        ...e,
      });
    }
  }

  // All contigs with less than 10px should be collected in a summary element
  const lenCutoff = lenScale.invert(props.minContigDisplayWidth);
  const visdata: VisEntry[] = [];

  let remain: VisRemainEntry | undefined;
  let remainFeatureCounts: Record<string, number> = {};
  for (const e of positions) {
    if (e.length >= lenCutoff) visdata.push(e);
    else if (remain == undefined)
      remain = {
        before: e.before,
        featureCounts: [],
        gc: 0,
        id: "Short contigs",
        length: e.length,
        contigs: 1,
        lengthRange: [e.length, e.length],
        gcRange: [e.gc, e.gc],
      };
    else {
      for (const f of e.featureCounts) {
        if (!(f.type in remainFeatureCounts)) remainFeatureCounts[f.type] = 0;
        remainFeatureCounts[f.type] = remainFeatureCounts[f.type] + f.count;
      }

      remain.length = remain.length + e.length;
      remain.contigs = remain.contigs + 1;
      remain.lengthRange = [
        Math.min(remain.lengthRange[0], e.length),
        Math.max(remain.lengthRange[1], e.length),
      ];
      remain.gcRange = [
        Math.min(remain.gcRange[0], e.gc),
        Math.max(remain.gcRange[1], e.gc),
      ];
    }
  }
  if (remain != undefined) {
    remain.featureCounts = Object.keys(remainFeatureCounts).map((k) => ({
      type: k,
      count: remainFeatureCounts[k],
    }));
    visdata.push(remain);
  }

  if (contigsEl == undefined)
    contigsEl = svg
      .append("g")
      .attr("class", "contigs")
      .attr("transform", "translate(0, 30)");

  /**
   * Highlights N50 an N90 Contigs. The remainder group is colored black and all other contigs are colored white
   * @param d
   */
  const contigColor: (v: VisEntry) => string = (d) =>
    "contigs" in d
      ? "black"
      : d.before <= _data.value.totalLength * 0.5 &&
          d.before + d.length >= _data.value.totalLength * 0.5
        ? "lightgray"
        : d.before <= _data.value.totalLength * 0.9 &&
            d.before + d.length >= _data.value.totalLength * 0.9
          ? "lightgray"
          : "white";

  function updateTooltipPosition(x: number, y: number) {
    if (tooltipEl.value) {
      const tooltip = d3.select(tooltipEl.value);
      const node = tooltip.node();
      if (node == null) return;
      const tooltipWidth = node.offsetWidth;
      const tooltipHeight = node.offsetHeight;

      const posX = x + tooltipWidth > window.innerWidth ? x - tooltipWidth : x;
      const posY =
        y + tooltipHeight > window.innerHeight ? y - tooltipHeight : y;
      d3.select(tooltipEl.value)
        .style("left", posX + 5 + "px")
        .style("top", posY + 5 + "px");
    }
  }
  contigsEl
    .selectAll("rect")
    .data(visdata)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("x", (d) => xScale(d.before))
          .attr("y", 0)
          .attr("width", (d) => {
            return lenScale(d.length);
          })
          .attr("height", 20)
          .attr("fill", contigColor)
          .attr("stroke", "black")
          .on("mouseenter", function (evt, d) {
            d3.select(this).attr("fill", "#bbb");
            selected.value = d;
            d3.select(tooltipEl.value).style("display", "block");
            const [x, y] = [evt.clientX, evt.clientY];
            updateTooltipPosition(x, y);
          })
          .on("mousemove", (evt) => {
            const [x, y] = [evt.clientX, evt.clientY];
            updateTooltipPosition(x, y);
          })
          .on("mouseleave", function (evt, d) {
            d3.select(this).attr("fill", contigColor(d));
            selected.value = undefined;
            d3.select(tooltipEl.value).style("display", "none");
          }),
      (update) =>
        immediate
          ? update
              .attr("x", (d) => xScale(d.before))
              .attr("y", props.margin.top)
              .attr("width", (d) => {
                return lenScale(d.length);
              })
              .attr("fill", contigColor)
          : update
              .transition()
              .attr("x", (d) => xScale(d.before))
              .attr("y", props.margin.top)
              .attr("width", (d) => {
                return lenScale(d.length);
              })
              .attr("fill", contigColor),
    );
}
function updatePlot(immediate = false) {
  const svg = updateSvgCanvas(immediate);
  updateScales();
  updateAxis(immediate);
  updateMarks(immediate);
  updateData(immediate);

  return svg.node();
}

const featursOrder = [
  "tRNA",
  "tmRNA",
  "rRNA",
  "ncRNA",
  "ncRNA-region",
  "crispr",
  "cds",
  "sorf",
  "oriC",
  "oriV",
  "oriT",
  "gap",
];

const sortFeatures = sortByOrder<Pick<Feature, "type">>(
  featursOrder.reduce(
    (a, v, i) => {
      a[v] = i;
      return a;
    },
    {} as Record<string, number>,
  ),
  (x) => x.type,
);

const tooltipEl = useTemplateRef("tooltip");
const selected = ref<VisEntry | VisRemainEntry>();
let resizeObserver: ResizeObserver;
onMounted(() => {
  if (canvas.value) {
    _width = canvas.value.offsetWidth;
    resizeObserver = new ResizeObserver(() => {
      if (canvas.value) {
        _width = canvas.value.offsetWidth;
        updatePlot(true);
      }
    });
    resizeObserver.observe(canvas.value);
  }

  const node = updatePlot();
  if (node) canvas.value?.append(node);
});
onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
</script>
