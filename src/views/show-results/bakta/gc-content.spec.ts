import { it, describe, expect } from "vitest";
import { calcGcContent, calcGcSkew, Collector } from "./gc-content";

describe("gc content", () => {
  describe("linear", () => {
    it("empty", () => {
      expect(calcGcContent("", 10, false)).to.deep.equal({
        mean: 0,
        steps: 1,
        stepSize: 1,
        windowSize: 1,
        data: [],
      });
    });

    it("gc-only seq", () => {
      // 0123456
      // ggggggg
      // 0++
      // ++1++
      //   ++2++
      //     ++3
      expect(calcGcContent("ggggggg", 4, false)).to.deep.equal({
        mean: 1,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 1],
          [2, 1],
          [4, 1],
          [6, 1],
        ],
      });
    });
    it("uppercase", () => {
      // 012
      // GGG
      // 0++
      expect(calcGcContent("GGG", 1, false)).to.deep.equal({
        mean: 1,
        steps: 1,
        stepSize: 3,
        windowSize: 7,
        data: [[0, 1]],
      });
    });
    it("ac only sequence", () => {
      // 0123456
      // aaaaaaa
      // 0++
      // ++1++
      //   ++2++
      //     ++3
      expect(calcGcContent("aaaaaaa", 4, false)).to.deep.equal({
        mean: 0,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 0],
          [2, 0],
          [4, 0],
          [6, 0],
        ],
      });
    });
    it("mixed sequence", () => {
      // 0123456
      // ggcatag
      // 0++        => 1
      // ++2++      => 3/5
      //   ++4++    => 2/5
      //     ++6    => 1/5
      expect(calcGcContent("ggcatag", 4, false)).to.deep.equal({
        mean: 4 / 7,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 1],
          [2, 3 / 5],
          [4, 2 / 5],
          [6, 1 / 3],
        ],
      });
    });
    it("mixed with 5 parts", () => {
      // stepsize 7 /5 = 1, windowsize = 2
      // 0123456
      // ggcatag
      // 0+         => 1
      // +1+        => 1
      //  +2+       => 2/3
      //   +3+      => 1/3
      //    +4+     => 0
      //     +5+    => 1/3
      //      +6    => 1/2

      expect(calcGcContent("ggcatag", 5, false)).to.deep.equal({
        mean: 4 / 7,
        steps: 5,
        stepSize: 1,
        windowSize: 3,
        data: [
          [0, 1],
          [1, 1],
          [2, 2 / 3],
          [3, 1 / 3],
          [4, 0],
          [5, 1 / 3],
          [6, 0.5],
        ],
      });
    });
    it("more parts than sequence length should use stepsize 1", () => {
      // 012
      // ggc
      // 0+  => 1
      // +1+ => 1
      //  +2 => 1
      expect(calcGcContent("ggc", 5, false)).to.deep.equal({
        mean: 1,
        steps: 5,
        stepSize: 1,
        windowSize: 3,
        data: [
          [0, 1],
          [1, 1],
          [2, 1],
        ],
      });
    });
    it("only 1 part should return single stat", () => {
      // 012
      // ggc
      // 111
      // 0++
      expect(calcGcContent("ggc", 1, false)).to.deep.equal({
        mean: 1,
        steps: 1,
        stepSize: 3,
        windowSize: 7,
        data: [[0, 1]],
      });
    });
    it("should work when seq len is divisible by steps", () => {
      () => {
        // 0123
        // ggca
        // 0++
        // ++1+
        expect(calcGcContent("ggca", 2, false)).to.deep.equal({
          mean: 1,
          stepSize: 2,
          windowSize: 5,
          data: [
            [0, 1],
            [2, 3 / 4],
          ],
        });
      };
    });

    it("should work when seq len is divisible by steps + 1", () => {
      () => {
        // 01234
        // ggcac
        // 0++
        // ++1++
        expect(calcGcContent("ggcac", 2, false)).to.deep.equal({
          mean: 1,
          stepSize: 2,
          windowSize: 5,
          data: [
            [0, 1],
            [2, 4 / 5],
          ],
        });
      };
    });
  });

  describe("circular", () => {
    it("empty", () => {
      expect(calcGcContent("", 10, true)).to.deep.equal({
        mean: 0,
        steps: 1,
        stepSize: 1,
        windowSize: 1,
        data: [],
      });
    });
    it("gc-only seq", () => {
      // 0123456
      // ggggggg
      // 0++  ++
      // ++1++
      //   ++2++
      // ++  ++3
      expect(calcGcContent("ggggggg", 4, true)).to.deep.equal({
        mean: 1,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 1],
          [2, 1],
          [4, 1],
          [6, 1],
        ],
      });
    });
    it("ac only sequence", () => {
      // 0123456
      // aaaaaaa
      // 0++  ++
      // ++1++
      //   ++2++
      // ++  ++3
      expect(calcGcContent("aaaaaaa", 4, true)).to.deep.equal({
        mean: 0,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 0],
          [2, 0],
          [4, 0],
          [6, 0],
        ],
      });
    });
    it("border positions should include data from oposite site", () => {
      // 0123456
      // gggggga
      // 0++  ++
      // ++1++
      //   ++2++
      // ++  ++3
      expect(calcGcContent("gggggga", 4, true)).to.deep.equal({
        mean: 6 / 7,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 4 / 5],
          [2, 1],
          [4, 4 / 5],
          [6, 4 / 5],
        ],
      });
    });
    it("step size 1", () => {
      // 0123456
      // gggggga
      // 0++++++
      //  ++++++
      expect(calcGcContent("gggggga", 1, true)).to.deep.equal({
        mean: 6 / 7,
        steps: 1,
        stepSize: 7,
        windowSize: 15,
        data: [[0, 13 / 15]],
      });
    });
  });
});

describe("gc skew", () => {
  describe("linear", () => {
    it("empty", () => {
      expect(calcGcSkew("", 10, false)).to.deep.equal({
        mean: 0,
        steps: 1,
        stepSize: 1,
        windowSize: 1,
        data: [],
      });
    });

    it("g-only seq", () => {
      // 0123456
      // ggggggg  7/7 = 1
      // 0++      3-0/3+0
      // ++1++    5-0/5+0
      //   ++2++  5-0/5+0
      //     ++3  5-0/5+0
      expect(calcGcSkew("ggggggg", 4, false)).to.deep.equal({
        mean: 1,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 1],
          [2, 1],
          [4, 1],
          [6, 1],
        ],
      });
    });
    it("mixed gc seq", () => {
      // 0123456
      // gcgcgcg  2-1/2+1 = 1/3
      // 0++
      // ++1++    3-2/3+2 = 1/5
      //   ++2++  1/5
      //     ++3  1/3
      //  total   4-3/4+3 = 1/7
      expect(calcGcSkew("gcgcgcg", 4, false)).to.deep.equal({
        mean: 1 / 7,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 1 / 3],
          [2, 1 / 5],
          [4, 1 / 5],
          [6, 1 / 3],
        ],
      });
    });
    it("uppercase", () => {
      // 012
      // GGG
      // 0++
      expect(calcGcSkew("GGG", 1, false)).to.deep.equal({
        mean: 1,
        steps: 1,
        stepSize: 3,
        windowSize: 7,
        data: [[0, 1]],
      });
    });
    it("ac only sequence", () => {
      // 0123456
      // aaaaaaa
      // 0++
      // ++1++
      //   ++2++
      //     ++3
      expect(calcGcSkew("aaaaaaa", 4, false)).to.deep.equal({
        mean: 0,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 0],
          [2, 0],
          [4, 0],
          [6, 0],
        ],
      });
    });
    it("mixed with 5 parts", () => {
      // stepsize 7 /5 = 1, windowsize = 2
      // 0123456
      // ggcatag    => 3-1/3+1 = 1/2
      // 0+         => 2-0/2+0 = 1
      // ggc        => 2-1/2+1 = 1/3
      //  +2+       => 1-1/1+1 = 0
      //   +3+      => 0-1/0+1 = -1
      //    +4+     => 0
      //     +5+    => 1
      //      +6    => 1

      expect(calcGcSkew("ggcatag", 5, false)).to.deep.equal({
        mean: 1 / 2,
        stepSize: 1,
        steps: 5,
        windowSize: 3,
        data: [
          [0, 1],
          [1, 1 / 3],
          [2, 0],
          [3, -1],
          [4, 0],
          [5, 1],
          [6, 1],
        ],
      });
    });
    it("more parts than sequence length should use stepsize 1", () => {
      // 012
      // ggc => 2-1/2+1 = 1/3
      // 0+  => 2-0/2+0 = 1
      // +1+ => 2-1/2+1 = 1/3
      //  +2 => 1-1/1+1 = 0
      expect(calcGcSkew("ggc", 5, false)).to.deep.equal({
        mean: 1 / 3,
        steps: 5,
        stepSize: 1,
        windowSize: 3,
        data: [
          [0, 1],
          [1, 1 / 3],
          [2, 0],
        ],
      });
    });
    it("only 1 part should return single stat", () => {
      // 012
      // ggc 2-1/ 2+1 = 1/3
      // 0++ 2-1/ 2+1 = 1/3
      expect(calcGcSkew("ggc", 1, false)).to.deep.equal({
        mean: 1 / 3,
        steps: 1,
        stepSize: 3,
        windowSize: 7,
        data: [[0, 1 / 3]],
      });
    });
    it("should work when seq len is divisible by steps", () => {
      () => {
        // 0123
        // ggca  2-1/2+1 = 1/3
        // 0++   1/3
        // ++1+  1/3
        expect(calcGcSkew("ggca", 2, false)).to.deep.equal({
          mean: 1 / 3,
          steps: 2,
          stepSize: 2,
          windowSize: 5,
          data: [
            [0, 1 / 3],
            [2, 1 / 3],
          ],
        });
      };
    });

    it("should work when seq len is divisible by steps + 1", () => {
      () => {
        // 01234
        // ggcac  2-2/2+2 = 0
        // 0++    2-1/2+1 = 1/3
        // ++1++  0
        expect(calcGcSkew("ggcac", 2, false)).to.deep.equal({
          mean: 0,
          steps: 2,
          stepSize: 2,
          windowSize: 5,
          data: [
            [0, 1 / 3],
            [2, 0],
          ],
        });
      };
    });
  });

  describe("circular", () => {
    it("empty", () => {
      expect(calcGcSkew("", 10, true)).to.deep.equal({
        mean: 0,
        steps: 1,
        stepSize: 1,
        windowSize: 1,
        data: [],
      });
    });
    it("gc-only seq", () => {
      // 0123456
      // ggggggg
      // 0++  ++
      // ++1++
      //   ++2++
      // ++  ++3
      expect(calcGcSkew("ggggggg", 4, true)).to.deep.equal({
        mean: 1,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 1],
          [2, 1],
          [4, 1],
          [6, 1],
        ],
      });
    });
    it("mixed gc seq", () => {
      // 0123456
      // gcgcgcg
      // 0++  ++  3-2/3+2 = 1/5
      // ++1++    3-2/3+2 = 1/5
      //   ++2++  1/5
      // ++  ++3  1/5
      //  total   4-3/4+3 = 1/7
      expect(calcGcSkew("gcgcgcg", 4, true)).to.deep.equal({
        mean: 1 / 7,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 1 / 5],
          [2, 1 / 5],
          [4, 1 / 5],
          [6, 1 / 5],
        ],
      });
    });
    it("a only sequence", () => {
      // 0123456
      // aaaaaaa
      // 0++  ++
      // ++1++
      //   ++2++
      // ++  ++3
      expect(calcGcSkew("aaaaaaa", 4, true)).to.deep.equal({
        mean: 0,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 0],
          [2, 0],
          [4, 0],
          [6, 0],
        ],
      });
    });
    it("border positions should include data from oposite site", () => {
      // 0123456
      // gggggga
      // 0++  ++
      // ++1++
      //   ++2++
      // ++  ++3
      expect(calcGcContent("gggggga", 4, true)).to.deep.equal({
        mean: 6 / 7,
        steps: 4,
        stepSize: 2,
        windowSize: 5,
        data: [
          [0, 4 / 5],
          [2, 1],
          [4, 4 / 5],
          [6, 4 / 5],
        ],
      });
    });
    it("only one step", () => {
      //-7654321
      // 0123456
      // ggggggc  6-1/6+1 = 5/7
      // 0++++++
      //  ++++++  11-2/11+2 = 9/13
      expect(calcGcSkew("ggggggc", 1, true)).to.deep.equal({
        mean: 5 / 7,
        steps: 1,
        stepSize: 7,
        windowSize: 15,
        data: [[0, 9 / 13]],
      });
    });
  });
});

describe("collector", () => {
  function expectAdd(
    c: Collector,
    n: number,
    total: number,
    currentCount: number,
    size?: number,
  ) {
    c.add(n);
    expect(c.total).toBe(total);
    expect(c.currentCount).toBe(currentCount);
    if (size != undefined) expect(c.currentSize).toBe(size);
  }
  function expectDrop(
    c: Collector,
    total: number,
    currentCount: number,
    size?: number,
  ) {
    c.dropStart();
    expect(c.total).toBe(total);
    expect(c.currentCount).toBe(currentCount);
    if (size != undefined) expect(c.currentSize).toBe(size);
  }

  it("should work", () => {
    const c = new Collector(5);

    expectAdd(c, 1, 1, 1, 1);
    expectAdd(c, 1, 2, 2, 2);
    expectAdd(c, 1, 3, 3, 3);
    // values to drop start here
    expectAdd(c, 1, 4, 4, 4);
    expectAdd(c, 1, 5, 5, 5);
    expectAdd(c, 1, 6, 5, 5);
    expectAdd(c, 1, 7, 5, 5);
    expectAdd(c, 2, 9, 6, 5);
    expectDrop(c, 9, 5, 4);
    expectDrop(c, 9, 4, 3);
    expectDrop(c, 9, 3, 2);
    expectDrop(c, 9, 2, 1);
    expectDrop(c, 9, 0, 0);
  });

  it("should work2", () => {
    const c = new Collector(5);
    expectAdd(c, 1, 1, 1);
    expectAdd(c, 1, 2, 2);
    expectAdd(c, 1, 3, 3);

    //  values to drop start here
    expectAdd(c, 1, 4, 4);
    expectAdd(c, 1, 5, 5);
    expectAdd(c, 1, 6, 5);
    expectAdd(c, 1, 7, 5);
    expectAdd(c, 0, 7, 4);

    expectDrop(c, 7, 3, 4);
    expectDrop(c, 7, 2, 3);
    expectDrop(c, 7, 1, 2);
    expectDrop(c, 7, 0, 1);
    expectDrop(c, 7, 0, 0);
  });

  it("should work2", () => {
    const c = new Collector(3);
    c.add(5);
    c.add(2);
    expect(c.currentCount).toBe(7);
    c.dropStart();
    expect(c.currentCount).toBe(2);
    c.add(6, false);
    expect(c.currentCount).toBe(8);
    expect(c.total).toBe(7);
  });
});
