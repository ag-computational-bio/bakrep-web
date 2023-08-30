export function ratioToPercentage(value: number) {
  return Math.round(value * 10000) / 100 + " %";
}

// Calculates significant figures with suffixes K/M/B/T, e.g. 1234 = 1.23K
export function sigfig(num: number, sigfigs_opt?: number) {
  // Set default sigfigs to 3
  sigfigs_opt = typeof sigfigs_opt === "undefined" ? 3 : sigfigs_opt;
  // Only assigns sig figs and suffixes for numbers > 1
  if (num <= 1) return num.toPrecision(sigfigs_opt);
  // Calculate for numbers > 1
  const power10 = log10(num);
  const power10ceiling = Math.floor(power10) + 1;
  // 0 = '', 1 = 'K', 2 = 'M', 3 = 'B', 4 = 'T'
  const SUFFIXES = ["", "K", "M", "B", "T"];
  // 100: power10 = 2, suffixNum = 0, suffix = ''
  // 1000: power10 = 3, suffixNum = 1, suffix = 'K'
  const suffixNum = Math.floor(power10 / 3);
  const suffix = SUFFIXES[suffixNum];
  // Would be 1 for '', 1000 for 'K', 1000000 for 'M', etc.
  const suffixPower10 = Math.pow(10, suffixNum * 3);
  const base = num / suffixPower10;
  const baseRound = base.toPrecision(sigfigs_opt);
  return baseRound + suffix;
}
export function log10(num: number) {
  // Per http://stackoverflow.com/questions/3019278/how-can-i-specify-the-base-for-math-log-in-javascript#comment29970629_16868744
  // Handles floating-point errors log10(1000) otherwise fails at (2.99999996)
  return Math.round((Math.log(num) / Math.LN10) * 1e6) / 1e6;
}
