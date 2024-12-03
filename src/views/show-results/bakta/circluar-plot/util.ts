import * as d3 from "d3";

const atan2ToRadians = d3
  .scaleLinear([-Math.PI, Math.PI])
  .domain([2 * Math.PI, 0]).invert;

/**
 * Identifies the position in the data array that the pointer currently
 * points to.
 * @param evt the mouse event
 * @param radiansToDataScale The scale that maps the data domain to radians [0,2pi].
 * @param data The data array.
 * @returns The position in the data array.
 */
export function findPosition(
  evt: Event,
  radiansToDataScale: d3.ScaleLinear<number, number>,
  data: [number, number][],
) {
  const [x, y] = d3.pointer(evt);
  const degree = Math.atan2(x, y);
  const position = radiansToDataScale.invert(atan2ToRadians(degree));
  const v = d3.bisect(
    data.map((x) => x[0]),
    position,
  );
  return v;
}
