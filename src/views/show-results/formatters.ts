/**
 * Format gc values that range from 0 to 1
 */
export function formatGc(gc: number) {
  return new Intl.NumberFormat("en", {
    style: "decimal",
    maximumFractionDigits: 3,
  }).format(gc);
}

export function formatBp(bp: number) {
  return new Intl.NumberFormat("en", {
    style: "decimal",
  }).format(bp);
}
