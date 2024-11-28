export type SlidingWindowResult = {
  stepSize: number;
  steps: number;
  windowSize: number;
  mean: number;
  data: [number, number][];
};

/**
 *
 * @param s The sequence string
 * @param steps The amount of data points that should be extracted.
 * @param isCircular For circular sequences the start and end values are calculated as if start and end were connected. Otherwise the start and end values will only contain half of the data.
 */
export function calcGcContent(
  s: string,
  steps: number = 720,
  isCircular: boolean,
): SlidingWindowResult {
  if (steps < 1) throw "Steps must be a positive integer";
  const len = s.length;
  let stepSize = Math.round(len / steps);
  if (stepSize == 0) stepSize = 1;
  const windowSize = stepSize * 2 + 1; // value should contain the data of two steps
  if (len == 0)
    return {
      steps: stepSize,
      mean: 0,
      stepSize: stepSize,
      windowSize: 1,
      data: [],
    };

  const output: [number, number][] = [];
  function getChar(p: number) {
    if (p < 0) return s[s.length + p];
    if (p > s.length - 1) return s[p - s.length];
    return s[p];
  }
  const col = new Collector(windowSize);
  for (let e = isCircular ? -stepSize : 0; e < s.length + stepSize; e++) {
    const c = getChar(e).toLowerCase();
    const v = c == "g" || c == "c" ? 1 : 0;
    if (isCircular) {
      col.add(v, e >= 0 && e < s.length);
    } else {
      if (e < s.length) col.add(v);
      else col.dropStart();
    }

    if (e > 0 && e % stepSize == 0) {
      output.push([e - stepSize, col.currentCount / col.currentSize]);
    }
  }

  return {
    mean: col.total / len,
    steps: steps,
    stepSize: stepSize,
    windowSize: windowSize,
    data: output,
  };
}

/**
 *
 * @param s The sequence string
 * @param steps The resolution for the gc-content data, i.e. the number of values to compute. Default is 720 i.e. 2 values per degree in a circular plot.
 * @param isCircular If the sequence the gc content at the end uses the sequence data at the beginning of the sequence, otherwise the last window might contain less data than the others.
 */
export function calcGcSkew(
  s: string,
  steps: number = 720,
  isCircular: boolean,
): SlidingWindowResult {
  if (steps < 1) throw "Steps must be a positive integer";
  const len = s.length;
  let stepSize = Math.round(len / steps);
  if (stepSize == 0) stepSize = 1;
  const windowSize = stepSize * 2 + 1; // value should contain the data of two steps
  if (len == 0)
    return {
      steps: stepSize,
      mean: 0,
      stepSize: stepSize,
      windowSize: 1,
      data: [],
    };

  const output: [number, number][] = [];
  function getChar(p: number) {
    if (p < 0) return s[s.length + p];
    if (p > s.length - 1) return s[p - s.length];
    return s[p];
  }
  const col = new SkewCollector(windowSize);
  const start = isCircular
    ? stepSize == s.length
      ? -stepSize + 1
      : -stepSize
    : 0;
  const end = s.length + stepSize;
  for (let e = start; e < end; e++) {
    const c = getChar(e).toLowerCase();
    const v =
      c == "g" ? { g: 1, c: 0 } : c == "c" ? { g: 0, c: 1 } : { g: 0, c: 0 };
    if (isCircular) {
      col.add(v, e >= 0 && e < s.length);
    } else {
      if (e < s.length) col.add(v);
      else if (e > stepSize) col.dropStart();
    }

    if (steps == 1 && e == s.length - 1) {
      output.push([0, calcSkew(col.currentCount)]);
      break;
    } else if (
      (e > 0 && e % stepSize == 0) ||
      (steps == 1 && e == s.length - 1)
    ) {
      output.push([e - stepSize, calcSkew(col.currentCount)]);
    }
  }

  return {
    mean: calcSkew(col.total),
    steps: steps,
    stepSize: stepSize,
    windowSize: windowSize,
    data: output,
  };
}

function calcSkew(v: GCCount) {
  if (v.c + v.g == 0) return 0;
  else return (v.g - v.c) / (v.g + v.c);
}
export class Collector {
  #start = 0;
  #end = 0;
  total = 0;
  currentCount = 0;
  windowSize = 0;
  #cache: number[] = [];

  constructor(windowSize: number) {
    this.windowSize = windowSize;
  }

  get currentSize() {
    return this.#end - this.#start;
  }
  /**
   *
   * @param n the number to add, undefined if existing numbers from the beginning should be dropped
   * @param includeInTotal
   * @returns
   */
  add(n: number, includeInTotal = true) {
    const toRemove = this.#cache[this.#start % this.windowSize];
    if (includeInTotal) this.total = this.total + n;
    this.currentCount = this.currentCount + n;
    this.#cache[this.#end % this.windowSize] = n;

    this.#end = this.#end + 1;
    if (this.currentSize > this.windowSize) {
      this.currentCount = this.currentCount - toRemove;
      this.#start = this.#start + 1;
    }
  }

  dropStart() {
    this.currentCount =
      this.currentCount - this.#cache[this.#start % this.windowSize];
    this.#start = this.#start + 1;
  }
}

export type GCCount = {
  g: number;
  c: number;
};
export class SkewCollector {
  #start = 0;
  #end = 0;
  total: GCCount = { g: 0, c: 0 };
  currentCount: GCCount = { g: 0, c: 0 };
  windowSize = 0;
  #cache: GCCount[] = [];

  constructor(windowSize: number) {
    this.windowSize = windowSize;
  }

  get currentSize() {
    return this.#end - this.#start;
  }

  _add(a: GCCount, c: GCCount): GCCount {
    return { g: a.g + c.g, c: a.c + c.c };
  }
  _sub(a: GCCount, c: GCCount): GCCount {
    return { g: a.g - c.g, c: a.c - c.c };
  }
  /**
   *
   * @param n the number to add, undefined if existing numbers from the beginning should be dropped
   * @param includeInTotal
   * @returns
   */
  add(n: GCCount, includeInTotal = true) {
    const toRemove = this.#cache[this.#start % this.windowSize];
    if (includeInTotal) this.total = this._add(this.total, n);
    this.currentCount = this._add(this.currentCount, n);
    this.#cache[this.#end % this.windowSize] = n;

    this.#end = this.#end + 1;
    if (this.currentSize > this.windowSize) {
      this.currentCount = this._sub(this.currentCount, toRemove);
      this.#start = this.#start + 1;
    }
  }

  dropStart() {
    this.currentCount = this._sub(
      this.currentCount,
      this.#cache[this.#start % this.windowSize],
    );
    this.#start = this.#start + 1;
  }
}
