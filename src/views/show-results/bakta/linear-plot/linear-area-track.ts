import * as d3 from "d3";

export type Coloring = {
  positive: string;
  negative: string;
};
/**
 * @param evt the original mouse event
 * @param pos the position in domain coordinates or undefined when mouse left the track *
 */
type OnHoverFn = (evt: MouseEvent, pos: number | undefined) => void;

export interface LinearAreaPlotGenerator {
  apply(group: d3.Selection<SVGGElement, undefined, null, undefined>): void;
  title(title: string): LinearAreaPlotGenerator;
  top(px: number): LinearAreaPlotGenerator;
  colors(colors: Coloring): LinearAreaPlotGenerator;
  height(px: number): LinearAreaPlotGenerator;
  height(): number;
  hover(fn: OnHoverFn): LinearAreaPlotGenerator;
}

export type Coordinate = [number, number];

class LinearAreaTrack implements LinearAreaPlotGenerator {
  id: string;
  scale: d3.ScaleLinear<number, number>;
  data: Coordinate[];
  #top: number;
  #title: string = "";
  #colors: Coloring = {
    negative: "darkgray",
    positive: "lightgray",
  };
  #height = 50;
  #hover: OnHoverFn | undefined;

  constructor(
    id: string,
    scale: d3.ScaleLinear<number, number>,
    data: Coordinate[],
  ) {
    this.id = id;
    this.scale = scale;
    this.#top = 0;
    this.data = data;
  }

  height(px: number): LinearAreaPlotGenerator;
  height(): number;
  height(px?: number): number | LinearAreaPlotGenerator {
    if (px == undefined) return this.#height;
    this.#height = px;
    return this;
  }
  top(px: number): LinearAreaPlotGenerator {
    this.#top = px;
    return this;
  }
  title(title: string): LinearAreaPlotGenerator {
    this.#title = title;
    return this;
  }

  colors(colors: Coloring): LinearAreaPlotGenerator {
    this.#colors = colors;
    return this;
  }

  hover(fn: OnHoverFn) {
    this.#hover = fn;
    return this;
  }

  get apply() {
    return this._apply.bind(this);
  }

  _apply(g: d3.Selection<SVGGElement, undefined, null, undefined>) {
    const data = this.data;
    const scale = this.scale;
    const colors = this.#colors;
    const title = this.#title;

    const titleSize = 8;
    const titleMargin = 2;
    const tickSize = 6;

    const plotTop = this.#top + titleSize + titleMargin;
    const plotBottom = this.#top + this.#height;

    // the plot layers should be:
    // 1. background orientation lines (lattice)
    // 2. data
    // 3. y-axis
    // 4. x-axis
    // 5. title

    // negative and positive values should be plotted in separate colors
    // so we plot two separate areas
    const positiveData: Coordinate[] = data.map((x) =>
      x[1] < 0 ? [x[0], 0] : x,
    );
    const negativeData: Coordinate[] = data.map((x) =>
      x[1] >= 0 ? [x[0], 0] : x,
    );

    const posMax = d3.max(positiveData, (d) => d[1]) ?? 0;
    const negMin = d3.min(negativeData, (d) => d[1]) ?? 0;
    const deviationMax = d3.max([posMax, -negMin]) ?? 0;

    const yScale = d3
      .scaleLinear([plotBottom, plotTop])
      .domain([-deviationMax, deviationMax])
      .nice();

    let background = g.select<SVGRectElement>("rect.background");
    if (background.empty()) {
      background = g
        .append("rect")
        .attr("class", "background")
        .attr("fill", "#fff0")
        .attr("x", scale.range()[0])
        .attr("width", scale.range()[1] - scale.range()[0])
        .attr("y", yScale.range()[1])
        .attr("height", this.#height);
    }
    // always replace the mouse listener, in case the domain changed
    g.on("mousemove.indicator", (evt) => {
      const [x] = d3.pointer(evt);
      let helper = g.select<SVGLineElement>("line.helper");
      if (helper.empty()) helper = g.append("line").attr("class", "helper");
      helper
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", yScale.range()[0])
        .attr("y2", yScale.range()[1])
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", "1,3")
        .style("pointer-events", "none");
      if (this.#hover) this.#hover(evt, scale.invert(x));
    }).on("mouseleave.indicator", (evt) => {
      const helper = g.select<SVGLineElement>("line.helper");
      if (!helper.empty()) helper.remove();
      if (this.#hover) this.#hover(evt, undefined);
    });

    // draw the background lines
    let backgroundLattice = g.select<SVGGElement>("g.lattice");
    if (backgroundLattice.empty())
      backgroundLattice = g.append("g").attr("class", "lattice");

    function updateLattice(
      g:
        | d3.Selection<SVGLineElement, number, SVGGElement, undefined>
        | d3.Transition<SVGLineElement, number, SVGGElement, undefined>,
    ) {
      g.attr("fill", "none");
      g.attr("stroke", "#ddd");
      g.attr("x1", scale.range()[0]);
      g.attr("x2", scale.range()[1]);
      g.attr("y1", (d) => yScale(d));
      g.attr("y2", (d) => yScale(d));
    }
    backgroundLattice
      .selectAll<SVGLineElement, number>("line")
      .data(yScale.ticks(5))
      .join(
        (enter) => enter.append("line").call(updateLattice),
        (update) => update.transition().call(updateLattice),
      );

    //   // draw the data
    const area = d3
      .area()
      .x((d) => scale(d[0]))
      .y0(yScale(0))
      .y1((d) => yScale(d[1]));
    let dataEl = g.select<SVGGElement>("g.data");
    if (dataEl.empty()) dataEl = g.append("g").attr("class", "data");

    function updateAbove(
      g:
        | d3.Selection<SVGPathElement, undefined, null, undefined>
        | d3.Transition<SVGPathElement, undefined, null, undefined>,
    ) {
      g.attr("fill", colors.negative);
      g.attr("stroke", "none");
      g.attr("stroke-width", 1.5);
      g.attr("d", area(negativeData));
    }
    let aboveEl = dataEl.select<SVGPathElement>("path.below");
    if (aboveEl.empty())
      aboveEl = dataEl.append("path").attr("class", "below").call(updateAbove);
    else aboveEl.transition().call(updateAbove);

    function updateBelow(
      g:
        | d3.Selection<SVGPathElement, undefined, null, undefined>
        | d3.Transition<SVGPathElement, undefined, null, undefined>,
    ) {
      g.attr("fill", colors.positive);
      g.attr("stroke", "none");
      g.attr("stroke-width", 1.5);
      g.attr("d", area(positiveData));
    }
    let belowEl = dataEl.select<SVGPathElement>("path.above");
    if (belowEl.empty())
      belowEl = dataEl.append("path").attr("class", "above").call(updateBelow);
    else belowEl.transition().call(updateBelow);

    // draw the y-axis
    let yAxis = g.select<SVGGElement>("g.y-axis");
    if (yAxis.empty()) yAxis = g.append("g").attr("class", "y-axis");

    function updateYAxis(
      g:
        | d3.Selection<SVGLineElement, undefined, null, undefined>
        | d3.Transition<SVGLineElement, undefined, null, undefined>,
    ) {
      g.attr("x1", scale(0));
      g.attr("x2", scale(0));
      g.attr("y1", yScale.range()[0]);
      g.attr("y2", yScale.range()[1]);
      g.attr("stroke", "black");
    }
    let yLine = yAxis.select<SVGLineElement>("line.y");
    if (yLine.empty())
      yLine = yAxis.append("line").attr("class", "y").call(updateYAxis);
    else yLine.transition().call(updateYAxis);

    function updateYAxisTick(
      g:
        | d3.Selection<SVGLineElement, number, SVGGElement, undefined>
        | d3.Transition<SVGLineElement, number, SVGGElement, undefined>,
    ) {
      g.attr("x1", scale(0));
      g.attr("x2", scale(0) - tickSize);
      g.attr("y1", (d) => yScale(d));
      g.attr("y2", (d) => yScale(d));
      g.attr("stroke", "black");
    }
    yAxis
      .selectAll<SVGLineElement, number>("line.tick")
      .data([yScale.domain()[0], yScale.domain()[1]])
      .join(
        (enter) =>
          enter.append("line").attr("class", "tick").call(updateYAxisTick),
        (update) => update.transition().call(updateYAxisTick),
      );

    type TickLabel = { y: number; text: number };
    function updateTickLabel(
      g:
        | d3.Selection<SVGTextElement, TickLabel, SVGGElement, undefined>
        | d3.Transition<SVGTextElement, TickLabel, SVGGElement, undefined>,
    ) {
      g.attr("x", scale(0) - 6);
      g.attr("text-anchor", "end");
      g.attr("y", (d) => d.y + 3);
      g.attr("font-size", 8);
      g.attr("fill", "black");
      g.text((d) => d.text);
    }
    const labels: TickLabel[] = [
      { y: yScale.range()[0], text: yScale.domain()[0] },
      { y: yScale.range()[1], text: yScale.domain()[1] },
    ];
    yAxis
      .selectAll<SVGTextElement, TickLabel>("text.label")
      .data(labels)
      .join(
        (enter) =>
          enter.append("text").attr("class", "label").call(updateTickLabel),
        (update) => update.transition().call(updateTickLabel),
      );

    // draw the x-axis
    function updateXAxis(
      g:
        | d3.Selection<SVGLineElement, undefined, null, undefined>
        | d3.Transition<SVGLineElement, undefined, SVGGElement, undefined>,
    ) {
      g.attr("fill", "none");
      g.attr("stroke", "black");
      g.attr("x1", scale.range()[0]);
      g.attr("x2", scale.range()[1]);
      g.attr("y1", yScale(0));
      g.attr("y2", yScale(0));
    }
    let xAxis = yAxis.select<SVGLineElement>("line.x-axis");
    if (xAxis.empty())
      xAxis = yAxis.append("line").attr("class", "x-axis").call(updateXAxis);
    else xAxis.transition().call(updateXAxis);

    // draw the title
    function updateTitle(
      g:
        | d3.Selection<SVGTextElement, undefined, null, undefined>
        | d3.Transition<SVGTextElement, undefined, SVGGElement, undefined>,
    ) {
      g.attr("x", scale(0));
      g.attr("y", yScale.range()[1] - 8);
      g.attr("text-anchor", "middle");
      g.attr("font-size", 9);
      g.attr("fill", "black");
      g.text(title);
    }
    let titleEl = g.select<SVGTextElement>("text.title");
    if (titleEl.empty())
      titleEl = g.append("text").attr("class", "title").call(updateTitle);
    else titleEl.transition().call(updateTitle);
  }
}

/**
 * Plots the data as an 0-centered area plot on a circle with the specified radius.
 *
 * Usage:
 * const track = radialAreaTrack(clz, radiansScale, radius, data).title(title);
 * d3.select('g').call(track.apply);
 *
 * @param id A unique identifier for this track, must not contain spaces or other characters that are not allowed in css class names
 * @param scale The linear scale between [0,2pi]
 * @param data The data to plot
 * @returns
 */
export function linearAreaTrack(
  id: string,
  scale: d3.ScaleLinear<number, number>,
  data: Coordinate[],
) {
  return new LinearAreaTrack(id, scale, data);
}
