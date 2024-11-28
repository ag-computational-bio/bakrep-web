import type { Feature } from "@/model/BaktaResults";

const BaktaFeatureTypes = [
  "tRNA",
  "tmRNA",
  "rRNA",
  "ncRNA",
  "ncRNA-region",
  "crispr",
  "crispr-repeat",
  "crispr-spacer",
  "orf",
  "sorf",
  "cds",
  "signal-peptide",
  "gap",
  "oriC",
  "oriV",
  "oriT",
  "is",
  "mite",
  "unknown",
] as const;

export type FeatureType = (typeof BaktaFeatureTypes)[number];
const defaultColor = "#CCCCCC";

const featureColorScheme: Record<FeatureType, string> = {
  sorf: "#cccccc",
  tRNA: "#b2df8a",
  tmRNA: "#b2df8a",
  rRNA: "#fb8072",
  ncRNA: "#fdb462",
  "ncRNA-region": "#80b1d3",
  crispr: "#bebada",
  gap: "#000000",
  "crispr-repeat": defaultColor,
  "crispr-spacer": defaultColor,
  "signal-peptide": defaultColor,
  cds: defaultColor,
  is: defaultColor,
  mite: defaultColor,
  orf: defaultColor,
  oriC: defaultColor,
  oriT: defaultColor,
  oriV: defaultColor,
  unknown: "#666666",
};

export function lookupFeatureColor(f: Feature): string {
  if (f.type in featureColorScheme)
    return featureColorScheme[f.type as FeatureType];
  return featureColorScheme.unknown;
}
