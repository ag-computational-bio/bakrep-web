import * as d3 from "d3";

export interface AxisGenerator {
  apply: (g: d3.Selection<SVGGElement, undefined, null, undefined>) => void;
  tickFormat: (
    fn: (n: number, range: [number, number]) => string,
  ) => AxisGenerator;
  height(): number;
}

class RadialAxisGenerator implements AxisGenerator {
  scale: d3.ScaleLinear<number, number>;
  radius: number;
  _tickFormat: (n: number, tickRange: [number, number]) => string;

  minorTickLength = 3;
  majorTickLength = 7;
  tickLabelSize = 12;
  labelMargin = 2;
  lineWidth = 1;

  constructor(scale: d3.ScaleLinear<number, number>, radius: number) {
    this.scale = scale;
    this.radius = radius;
    this._tickFormat = (x) => x.toString();
  }

  tickFormat(formatter: (n: number, tickRange: [number, number]) => string) {
    this._tickFormat = formatter;
    return this;
  }

  height(): number {
    return (
      this.labelMargin +
      this.tickLabelSize +
      this.majorTickLength +
      this.lineWidth
    );
  }

  get apply() {
    return this._apply.bind(this);
  }

  _apply(rulerG: d3.Selection<SVGGElement, undefined, null, undefined>) {
    const radiansScale = this.scale;
    const radius = this.radius;
    const tickFormatter = this._tickFormat;
    const conf = this;

    const innerRadius =
      radius - this.labelMargin - this.tickLabelSize - this.majorTickLength;

    const ticks = radiansScale.ticks(12);
    const minorTicks = radiansScale.ticks(36);

    function configureBackbone(
      g:
        | d3.Selection<SVGPathElement, undefined, null, never>
        | d3.Transition<SVGPathElement, undefined, never, never>,
    ) {
      g.attr("class", "backbone");
      g.attr(
        "d",
        d3.arc()({
          startAngle: 0,
          endAngle: radiansScale.range()[1],
          innerRadius: innerRadius,
          outerRadius: innerRadius,
        }),
      );
      g.attr("fill", "none");
      g.attr("stroke", "black");
    }

    let backbone = rulerG.select<SVGPathElement>("path.backbone");
    if (backbone.empty())
      backbone = rulerG.append("path").call(configureBackbone);
    else backbone.transition().call(configureBackbone);

    type TickSelection =
      | d3.Transition<d3.BaseType, number, SVGGElement, undefined>
      | d3.Selection<SVGPathElement, number, SVGGElement, undefined>;

    function updateMinorTicks(g: TickSelection) {
      g.attr("class", "minor");
      g.attr("stroke", "black");
      g.attr("data-tick", (d) => d);
      g.attr("d", (d) => {
        const p = d3.arc()({
          outerRadius: innerRadius + conf.minorTickLength,
          innerRadius: innerRadius,
          startAngle: radiansScale(d),
          endAngle: radiansScale(d),
        });
        return p;
      });
    }

    rulerG
      .selectAll("path.minor")
      .data(minorTicks)
      .join(
        (enter) => enter.append("path").call(updateMinorTicks),
        (update) => update.transition().call(updateMinorTicks),
      );

    function updateMajorTicks(g: TickSelection) {
      g.attr("class", "major");
      g.attr("stroke", "black");
      g.attr("data-tick", (d) => d);
      g.attr("d", (d) => {
        const p = d3.arc()({
          outerRadius: innerRadius + conf.majorTickLength,
          innerRadius: innerRadius,
          startAngle: radiansScale(d) - 0.00125,
          endAngle: radiansScale(d) + 0.00125,
        });
        return p;
      });
    }
    rulerG
      .selectAll("path.major")
      .data(ticks)
      .join(
        (enter) => enter.append("path").call(updateMajorTicks),
        (update) => update.transition().call(updateMajorTicks),
      );

    const tickRange: [number, number] = [
      Math.min(...ticks),
      Math.max(...ticks),
    ];

    type LabelSelection =
      | d3.Transition<d3.BaseType, number, SVGGElement, undefined>
      | d3.Selection<SVGTextElement, number, SVGGElement, undefined>;
    function updateLabels(g: LabelSelection) {
      g.attr("text-anchor", "middle");
      g.attr(
        "transform",
        (d) =>
          `rotate(${degreeScale(radiansScale(d))}), translate(0,${-radius + conf.tickLabelSize})`,
      );
      g.attr("font-size", conf.tickLabelSize);
      g.text((d) => tickFormatter(d, tickRange));
    }

    // Transforms radians to degrees
    const degreeScale = d3.scaleLinear([0, 360]).domain([0, 2 * Math.PI]);
    rulerG
      .selectAll("text")
      .data(ticks)
      .join(
        (enter) => enter.append("text").call(updateLabels),
        (update) => update.transition().call(updateLabels),
      );
  }
}

/**
 * Plots a radial axis with the specified radius and the given scale.
 * Animates updates. Supports partial circles when the provided scales
 * range is between [0,2pi].
 *
 * Adds all elements to the group it is applied to.
 *
 * Usage: d3.select("g").call(radialAxis(scale, radius).apply)
 *
 * @param scale The linear scale between [0,2pi]
 * @param radius The outer radius for the radial axis
 * @returns
 */
export function radialAxis(
  scale: d3.ScaleLinear<number, number>,
  radius: number,
): AxisGenerator {
  return new RadialAxisGenerator(scale, radius);
}
