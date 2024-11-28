export type BpScale = "Gbp" | "Mbp" | "kbp" | "bp";

/**
 * Pretty format basepairs.
 *
 * @param n
 * @param scale
 * @returns
 */
export function formatBp(n: number, scale: BpScale) {
  const fmt = Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
  if (scale === "bp") return `${fmt.format(n)} bp`;
  if (scale === "kbp") return `${fmt.format(n / 1000)} kbp`;
  if (scale === "Mbp") return `${fmt.format(n / 1000000)} Mbp`;
  if (scale === "Gbp") return `${fmt.format(n / 1000000000)} Gbp`;
  throw "not supported";
}

/**
 * Detects the maximal base pair scale.
 * @param n
 * @returns
 */
export function bpScale(n: number): BpScale {
  return n > 1_000_000_000
    ? "Gbp"
    : n > 1_000_000
      ? "Mbp"
      : n > 1_000
        ? "kbp"
        : "bp";
}
