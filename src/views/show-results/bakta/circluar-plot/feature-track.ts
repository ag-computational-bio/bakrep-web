import type { Feature } from "@/model/BaktaResults";
import * as d3 from "d3";

export interface TrackGenerator {
  apply(g: d3.Selection<SVGGElement, undefined, null, undefined>): void;
  height(): number;
  height(px: number): TrackGenerator;
  radius(px: number): TrackGenerator;
  /**
   * specifies a custom color function
   * @param f
   */
  color(fn: (f: Feature) => string): TrackGenerator;
  stroke(fn: (f: Feature) => string): TrackGenerator;
  /**
   * Is fired when a feature is hightlighted
   * @param fn
   */
  onHighlight(fn: (f: Feature | undefined, evt: any) => void): TrackGenerator;
}

class FeatureTrackGenerator implements TrackGenerator {
  id: string;
  scale: d3.ScaleLinear<number, number>;
  #radius: number;
  features: Feature[];
  #colorFn: (f: Feature) => string = () => "darkgray";
  #strokeFn: (f: Feature) => string = () => "none";
  #onHightlight: ((f: Feature | undefined, evt: any) => void) | undefined =
    undefined;

  /**
   * Height of the feature track in px.
   */
  #height: number = 25;
  constructor(
    id: string,
    scale: d3.ScaleLinear<number, number>,
    features: Feature[],
  ) {
    this.id = id;
    this.scale = scale;
    this.#radius = 10;
    this.features = features;
  }

  radius(px: number): TrackGenerator {
    this.#radius = px;
    return this;
  }

  height(): number;
  height(px: number): TrackGenerator;
  height(px?: number): number | TrackGenerator {
    if (px == undefined) return this.#height;
    this.#height = px;
    return this;
  }

  color(fn: (f: Feature) => string): TrackGenerator {
    this.#colorFn = fn;
    return this;
  }
  stroke(fn: (f: Feature) => string): TrackGenerator {
    this.#strokeFn = fn;
    return this;
  }

  onHighlight(fn: (f: Feature | undefined, evt: any) => void): TrackGenerator {
    this.#onHightlight = fn;
    return this;
  }

  _apply(g: d3.Selection<SVGGElement, undefined, null, undefined>) {
    const highlight = this.#onHightlight;
    const plotG = g;
    const clz = this.id;
    const radiansScale = this.scale;
    const data = this.features;
    const radius = this.#radius;
    const height = this.#height;
    const colorFn = this.#colorFn;
    const strokeFn = this.#strokeFn;

    let featuresGroup = plotG.select<SVGGElement>(`g.${clz}`);
    if (featuresGroup.empty())
      featuresGroup = plotG.append("g").attr("class", clz);

    function updateFeature(
      g:
        | d3.Selection<SVGPathElement, Feature, SVGGElement, undefined>
        | d3.Transition<SVGPathElement, Feature, SVGGElement, undefined>,
    ) {
      g.attr("fill", colorFn);
      g.attr("stroke", strokeFn);
      g.attr("d", (d) =>
        d3.arc()({
          startAngle: radiansScale(d.start),
          endAngle: radiansScale(d.stop),
          outerRadius: radius,
          innerRadius: radius - height,
        }),
      );
    }

    featuresGroup
      .selectAll<SVGPathElement, [number, number]>("path.feature")
      .data(data)
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("class", "feature")
            .call(updateFeature)
            .on("mouseenter", (evt, data) => {
              d3.select(evt.target).attr("stroke", "black");
              if (highlight) highlight(data, evt);
            })
            .on("mousemove", (evt, data) => {
              if (highlight) highlight(data, evt);
            })
            .on("mouseleave", (evt, data) => {
              d3.select(evt.target).attr("stroke", strokeFn(data));
              if (highlight) highlight(undefined, evt);
            }),
        (update) => update.transition().call(updateFeature),
      );
  }
  get apply() {
    return this._apply.bind(this);
  }
}

/**
 * Plots the features on a circle with the specified radius. When having multiple
 * feature tracks, each requires a unique identifier.
 *
 * Animates track changes.
 *
 * Usage:
 * const track = featureTrack(clz, radiansScale, radius, data);
 * d3.select<SVGGElement>('g.features').call(track);
 *
 * @param id A plot unique identifier for this track. Must not contain whitespaces.
 * @param scale The linear scale between [0,2pi]
 * @param radius The outer radius of the track
 * @param features The features to plot
 * @returns
 */
export function featureTrack(
  id: string,
  scale: d3.ScaleLinear<number, number>,
  features: Feature[],
): TrackGenerator {
  return new FeatureTrackGenerator(id, scale, features);
}
