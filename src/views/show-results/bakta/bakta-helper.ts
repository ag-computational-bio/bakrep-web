import type { BaktaResult, Feature } from "@/model/BaktaResults";

function genomeName(bakta: BaktaResult | undefined): string {
  if (!bakta) return "N.A.";
  if (!bakta.genome.genus && !bakta.genome.genus && !bakta.genome.species) {
    return "N.A.";
  }
  if (bakta.genome.genus) {
    return (
      bakta.genome.genus +
      (bakta.genome.species ? " " + bakta.genome.species : "") +
      (bakta.genome.strain ? " " + bakta.genome.strain : "")
    );
  } else {
    return (
      "N.A. " +
      (bakta.genome.species ? bakta.genome.species + " " : "") +
      (bakta.genome.strain ? bakta.genome.strain + " " : "")
    );
  }
}

function formattedSize(bakta: BaktaResult | undefined): string {
  if (!bakta) return "0 bp";
  return new Intl.NumberFormat("en-GB").format(bakta.stats.size) + " bp";
}

type FeatureCount = {
  oriC: number;
  oriV: number;
  oriT: number;
  cds: number;
  gap: number;
  sorf: number;
  "ncRNA-region": number;
  ncRNA: number;
  rRNA: number;
  tmRNA: number;
  crispr: number;
  tRNA: number;
};
function featureCount(bakta: BaktaResult | undefined): FeatureCount {
  const fc: FeatureCount = {
    oriC: 0,
    oriV: 0,
    oriT: 0,
    cds: 0,
    gap: 0,
    sorf: 0,
    "ncRNA-region": 0,
    ncRNA: 0,
    rRNA: 0,
    tmRNA: 0,
    crispr: 0,
    tRNA: 0,
  };
  if (!bakta) return fc;
  return bakta.features.reduce((acc: Record<string, number>, cur: Feature) => {
    const key = cur.type;
    if (!(key in acc)) {
      acc[key] = 0;
    }
    acc[key] = acc[key] + 1;
    return acc;
  }, fc) as FeatureCount;
}

function sequencesCountString(bakta: BaktaResult | undefined): string {
  if (!bakta) return "0 contigs";
  const data = bakta.sequences.map(
    (x) => (x.complete ? "complete " : "") + x.type
  );
  const counts = data.reduce((acc: Record<string, number>, cur) => {
    if (!(cur in acc)) {
      acc[cur] = 0;
    }
    acc[cur] = acc[cur] + 1;
    return acc;
  }, {});
  const string = Object.entries(counts)
    .sort()
    .map((x) => {
      let s = x[1] + " " + x[0];
      if (x[1] > 1) {
        s += "s";
      }
      return s;
    })
    .join(", ");
  return string;
}

function lookupCogFunctionalCategories(feature: Feature): string[] {
  if ("db_xrefs" in feature && feature.db_xrefs) {
    const categories = feature.db_xrefs
      .filter((x) => x.match(/^COG:[A-Z]+$/))
      .map((x) => x.substring(4));
    if (categories.length > 0) {
      if (categories[0].length > 1) {
        return categories[0].split("");
      }
    }
    return categories;
  }
  return [];
}

export default {
  genomeName,
  formattedSize,
  featureCount,
  sequencesCountString,
  lookupCogFunctionalCategories,
};
