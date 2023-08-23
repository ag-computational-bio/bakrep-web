// colors taken from https://help.ezbiocloud.net/cog-colors/
const cogMap: Record<string, { name: string; color: string; class?: string }> =
  {
    J: {
      color: "#ff0000",
      name: "Translation, ribosomal structure and biogenesis",
      class: "INF",
    },
    A: {
      color: "#c2af58",
      name: "RNA processing and modification",
      class: "INF",
    },
    K: { color: "#ff9900", name: "Transcription", class: "INF" },
    L: {
      color: "#ffff00",
      name: "Replication, recombination and repair",
      class: "INF",
    },
    B: {
      color: "#ffc600",
      name: "Chromatin structure and dynamics",
      class: "INF",
    },
    D: {
      color: "#99ff00",
      name: "Cell cycle control, cell division, chromosome partitioning",
      class: "CEL",
    },
    Y: { color: "#493126", name: "Nuclear structure", class: "CEL" },
    V: { color: "#ff008a", name: "Defense mechanisms", class: "CEL" },
    T: {
      color: "#0000ff",
      name: "Signal transduction mechanisms",
      class: "CEL",
    },
    M: {
      color: "#9ec928",
      name: "Cell wall/membrane/envelope biogenesis",
      class: "CEL",
    },
    N: { color: "#006633", name: "Cell motility", class: "CEL" },
    Z: { color: "#660099", name: "Cytoskeleton", class: "CEL" },
    W: { color: "#336699", name: "Extracellular structures", class: "CEL" },
    U: {
      color: "#33cc99",
      name: "Intracellular trafficking, secretion, and vesicular transport",
      class: "CEL",
    },
    O: {
      color: "#00ffff",
      name: "Posttranslational modification, protein turnover, chaperones",
      class: "CEL",
    },
    C: {
      color: "#9900ff",
      name: "Energy production and conversion",
      class: "MET",
    },
    G: {
      color: "#805642",
      name: "Carbohydrate transport and metabolism",
      class: "MET",
    },
    E: {
      color: "#ff00ff",
      name: "Amino acid transport and metabolism",
      class: "MET",
    },
    F: {
      color: "#99334d",
      name: "Nucleotide transport and metabolism",
      class: "MET",
    },
    H: {
      color: "#727dcc",
      name: "Coenzyme transport and metabolism",
      class: "MET",
    },
    I: {
      color: "#5c5a1b",
      name: "Lipid transport and metabolism",
      class: "MET",
    },
    P: {
      color: "#0099ff",
      name: "Inorganic ion transport and metabolism",
      class: "MET",
    },
    Q: {
      color: "#ffcc99",
      name: "Secondary metabolites biosynthesis, transport and catabolism",
      class: "MET",
    },
    R: {
      color: "#ff9999",
      name: "General function prediction only",
      class: "POO",
    },
    S: { color: "#d6aadf", name: "Function unknown", class: "POO" },
    X: { color: "#d6aadf", name: "Function unknown", class: "POO" },
    INF: { name: "INFORMATION STORAGE AND PROCESSING", color: "#FF0000" },
    CEL: { name: "CELLULAR PROCESSES AND SIGNALING", color: "#0000FF" },
    MET: { name: "METABOLISM", color: "#00FF00" },
    POO: { name: "POORLY CHARACTERIZED", color: "#000000" },
  };

// taken from https://ftp.ncbi.nih.gov/pub/COG/COG2020/data/fun-20.tab
const ncbiCogMap: Record<string, { name: string; color: string }> = {
  J: {
    name: "Translation, ribosomal structure and biogenesis",
    color: "#FCCCFC",
  },
  A: { name: "RNA processing and modification", color: "#FCDCFC" },
  K: { name: "Transcription", color: "#FCDCEC" },
  L: { name: "Replication, recombination and repair", color: "#FCDCDC" },
  B: { name: "Chromatin structure and dynamics", color: "#FCDCCC" },
  D: {
    name: "Cell cycle control, cell division, chromosome partitioning",
    color: "#FCFCDC",
  },
  Y: { name: "Nuclear structure", color: "#FCFCCC" },
  V: { name: "Defense mechanisms", color: "#FCFCBC" },
  T: { name: "Signal transduction mechanisms", color: "#FCFCAC" },
  M: { name: "Cell wall/membrane/envelope biogenesis", color: "#ECFCAC" },
  N: { name: "Cell motility", color: "#DCFCAC" },
  Z: { name: "Cytoskeleton", color: "#CCFCAC" },
  W: { name: "Extracellular structures", color: "#BCFCAC" },
  U: {
    name: "Intracellular trafficking, secretion, and vesicular transport",
    color: "#ACFCAC",
  },
  O: {
    name: "Posttranslational modification, protein turnover, chaperones",
    color: "#9CFCAC",
  },
  X: { name: "Mobilome: prophages, transposons", color: "#9CFC9C" },
  C: { name: "Energy production and conversion", color: "#BCFCFC" },
  G: { name: "Carbohydrate transport and metabolism", color: "#CCFCFC" },
  E: { name: "Amino acid transport and metabolism", color: "#DCFCFC" },
  F: { name: "Nucleotide transport and metabolism", color: "#DCECFC" },
  H: { name: "Coenzyme transport and metabolism", color: "#DCDCFC" },
  I: { name: "Lipid transport and metabolism", color: "#DCCCFC" },
  P: { name: "Inorganic ion transport and metabolism", color: "#CCCCFC" },
  Q: {
    name: "Secondary metabolites biosynthesis, transport and catabolism",
    color: "#BCCCFC",
  },
  R: { name: "General function prediction only", color: "#E0E0E0" },
  S: { name: "Function unknown", color: "#CCCCCC" },
};

function lookupCogColor(coglist: string[], colorMap = cogMap) {
  if (coglist.length > 0) {
    return coglist.map((x) => {
      if (colorMap[x] && colorMap[x].color) return colorMap[x].color;
      return colorMap["S"].color;
    })[0];
  } else {
    return colorMap["S"].color;
  }
}

function lookupCogGroupColor(coglist: string[]) {
  if (coglist.length > 0) {
    return coglist.map((x) => {
      if (cogMap[x]) {
        const c = cogMap[x].class;
        if (c && cogMap[c]) return cogMap[c].color;
      }
      return cogMap["POO"].color;
    })[0];
  } else {
    return cogMap["POO"].color;
  }
}

function lookupCogLabels(coglist: string[]) {
  return coglist
    .filter((x) => x)
    .map((x) => {
      let label = "";
      if (cogMap[x] && cogMap[x].name) label = cogMap[x].name;
      return x + " - " + label;
    });
}

export default {
  cogMap,
  ncbiCogMap,
  lookupCogColor,
  lookupCogGroupColor,
  lookupCogLabels,
};
