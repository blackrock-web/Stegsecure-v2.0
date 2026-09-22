/**
 * Non-parametric rank tests on per-image PSNR (or any higher-is-better score).
 * Friedman + Kendall W + Nemenyi CD — implemented from standard formulae.
 */

export type RankTable = {
  modelIds: string[];
  imageIds: string[];
  scores: number[][]; // [image][model]
};

export type FriedmanResult = {
  n: number;
  k: number;
  chi2: number;
  df: number;
  pApprox: number;
  kendallW: number;
  avgRanks: number[];
  nemenyiCD: number;
  pairs: { a: string; b: string; rankDiff: number; significant: boolean }[];
};

function chi2Sf(x: number, k: number): number {
  // survival function approximation for chi-square via Wilson-Hilferty
  if (x <= 0) return 1;
  const h = 2 / (9 * k);
  const z = ((x / k) ** (1 / 3) - (1 - h)) / Math.sqrt(h);
  return 0.5 * erfc(z / Math.SQRT2);
}

function erfc(x: number): number {
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const t = 1 / (1 + p * Math.abs(x));
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 1 - sign * (1 - y);
}

/** Studentized range q_α,k for α=0.05 (Nemenyi), k = 2..10 */
const Q05 = [0, 0, 1.96, 2.344, 2.569, 2.728, 2.85, 2.949, 3.031, 3.102, 3.164];

function ranksRow(values: number[], higher = true): number[] {
  const idx = values.map((v, i) => ({ v, i }));
  idx.sort((a, b) => (higher ? b.v - a.v : a.v - b.v));
  const ranks = new Array(values.length).fill(0);
  for (let i = 0; i < idx.length; ) {
    let j = i;
    while (j < idx.length && idx[j]!.v === idx[i]!.v) j++;
    const avg = (i + 1 + j) / 2;
    for (let t = i; t < j; t++) ranks[idx[t]!.i] = avg;
    i = j;
  }
  return ranks;
}

export function friedmanTest(table: RankTable, higher = true): FriedmanResult {
  const n = table.imageIds.length;
  const k = table.modelIds.length;
  if (n < 2 || k < 2) {
    return {
      n,
      k,
      chi2: 0,
      df: Math.max(0, k - 1),
      pApprox: 1,
      kendallW: 0,
      avgRanks: table.modelIds.map(() => 0),
      nemenyiCD: 0,
      pairs: [],
    };
  }
  const rankSum = new Array(k).fill(0);
  for (let i = 0; i < n; i++) {
    const r = ranksRow(table.scores[i]!, higher);
    for (let j = 0; j < k; j++) rankSum[j] += r[j]!;
  }
  const avgRanks = rankSum.map((s) => s / n);
  let sumSq = 0;
  for (const R of rankSum) sumSq += R * R;
  const chi2 = (12 / (n * k * (k + 1))) * sumSq - 3 * n * (k + 1);
  const df = k - 1;
  const pApprox = chi2Sf(Math.max(0, chi2), df);
  const meanR = (k + 1) / 2;
  let s = 0;
  for (const r of avgRanks) s += (r - meanR) ** 2;
  const kendallW = (12 * n * n * s) / (n * n * (k * k * k - k)) || 12 * s / (k * k * k - k);
  const q = Q05[Math.min(10, k)] ?? 2.85;
  const nemenyiCD = q * Math.sqrt((k * (k + 1)) / (6 * n));
  const pairs: FriedmanResult["pairs"] = [];
  for (let a = 0; a < k; a++) {
    for (let b = a + 1; b < k; b++) {
      const diff = Math.abs(avgRanks[a]! - avgRanks[b]!);
      pairs.push({
        a: table.modelIds[a]!,
        b: table.modelIds[b]!,
        rankDiff: diff,
        significant: diff > nemenyiCD,
      });
    }
  }
  return { n, k, chi2, df, pApprox, kendallW, avgRanks, nemenyiCD, pairs };
}
