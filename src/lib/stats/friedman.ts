/**
 * Comprehensive Non-parametric Statistical Suite for Steganography Benchmarks:
 * 1. Friedman Test (including Chi-Square and Iman-Davenport F-Test)
 * 2. Kendall's W (Coefficient of Concordance) Effect Size (with tie corrections)
 * 3. Nemenyi Post-hoc Test (Critical Difference, pairwise z-scores, p-values, and cliques)
 */

export type RankTable = {
  modelIds: string[];
  imageIds: string[];
  scores: number[][]; // [image][model]
};

export type NemenyiPair = {
  a: string;
  b: string;
  rankDiff: number;
  zValue: number;
  pValue: number;
  significant: boolean;
};

export type FriedmanResult = {
  n: number; // Number of datasets/images
  k: number; // Number of models/algorithms
  alpha: number; // Significance level (0.05 or 0.01)
  rankingMatrix: number[][]; // [image][model] computed ranks (1 = best)
  rankSums: number[]; // Sum of ranks R_j for each model
  avgRanks: number[]; // Mean rank R_bar_j for each model
  // Friedman Chi-Square
  chi2: number;
  df: number; // k - 1
  pApprox: number;
  isSignificantChi2: boolean;
  // Iman-Davenport F-Test
  imanDavenportF: number;
  df1: number; // k - 1
  df2: number; // (k - 1) * (n - 1)
  pFDistribution: number;
  isSignificantF: boolean;
  // Kendall's W Effect Size
  kendallW: number;
  effectMagnitude: "negligible" | "small" | "moderate" | "strong" | "very strong";
  effectDescription: string;
  tieCorrectionApplied: boolean;
  // Nemenyi Post-Hoc
  qAlpha: number;
  nemenyiCD: number;
  pairs: NemenyiPair[];
  cliques: string[][]; // Non-significant model groups for CD diagram
};

// Error function complementary (erfc) approximation
export function erfc(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const absX = Math.abs(x);
  const t = 1 / (1 + p * absX);
  const poly = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t;
  const val = poly * Math.exp(-absX * absX);
  return x >= 0 ? val : 2 - val;
}

// Chi-square survival function (Wilson-Hilferty approximation)
export function chi2Sf(x: number, df: number): number {
  if (x <= 0) return 1;
  if (df <= 0) return 1;
  const h = 2 / (9 * df);
  const z = ((x / df) ** (1 / 3) - (1 - h)) / Math.sqrt(h);
  return Math.min(1, Math.max(0, 0.5 * erfc(z / Math.SQRT2)));
}

// Log gamma function via Spouge/Lanczos approximation
function logGamma(z: number): number {
  const p = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  const zz = z - 1;
  let x = p[0]!;
  for (let i = 1; i < 9; i++) {
    x += p[i]! / (zz + i);
  }
  const t = zz + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (zz + 0.5) * Math.log(t) - t + Math.log(x);
}

// Regularized incomplete beta function I_x(a, b) via continued fraction
function betacf(x: number, a: number, b: number): number {
  const maxIter = 100;
  const eps = 3.0e-7;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1.0e-30) d = 1.0e-30;
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= maxIter; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1.0e-30) d = 1.0e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1.0e-30) c = 1.0e-30;
    d = 1 / d;
    h *= d * c;

    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1.0e-30) d = 1.0e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1.0e-30) c = 1.0e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1.0) < eps) break;
  }
  return h;
}

export function incompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betacf(x, a, b)) / a;
  } else {
    return 1 - (bt * betacf(1 - x, b, a)) / b;
  }
}

// Survival function for F-distribution (p-value for F-statistic)
export function fDistributionSf(f: number, df1: number, df2: number): number {
  if (f <= 0) return 1;
  if (df1 <= 0 || df2 <= 0) return 1;
  const x = df2 / (df2 + df1 * f);
  return Math.min(1, Math.max(0, incompleteBeta(x, df2 / 2, df1 / 2)));
}

/**
 * Studentized range critical values q_α / sqrt(2) for Nemenyi test (Demsar, 2006).
 * Index corresponds to k (number of models, 2..10).
 */
export const NEMENYI_Q05 = [0, 0, 1.960, 2.343, 2.569, 2.728, 2.850, 2.949, 3.031, 3.102, 3.164];
export const NEMENYI_Q01 = [0, 0, 2.576, 2.913, 3.113, 3.255, 3.364, 3.452, 3.526, 3.590, 3.646];

/**
 * Computes ranks for a single row with exact fractional tie-handling.
 * If higherIsBetter = true: largest value gets rank 1.
 * If higherIsBetter = false: smallest value gets rank 1.
 */
export function rankRowWithTies(
  values: number[],
  higherIsBetter = true,
): { ranks: number[]; tieCorrection: number } {
  const n = values.length;
  const idx = values.map((v, i) => ({ v, i }));
  idx.sort((a, b) => (higherIsBetter ? b.v - a.v : a.v - b.v));

  const ranks = new Array<number>(n).fill(0);
  let tieCorrection = 0;

  for (let i = 0; i < n; ) {
    let j = i;
    while (j < n && Math.abs(idx[j]!.v - idx[i]!.v) < 1e-12) {
      j++;
    }
    const tieGroupSize = j - i;
    if (tieGroupSize > 1) {
      tieCorrection += tieGroupSize ** 3 - tieGroupSize;
    }
    // Fractional rank: average of rank positions (i + 1) to j
    const avgRank = (i + 1 + j) / 2;
    for (let t = i; t < j; t++) {
      ranks[idx[t]!.i] = avgRank;
    }
    i = j;
  }

  return { ranks, tieCorrection };
}

/**
 * Evaluates the full statistical battery:
 * 1. Friedman test (Chi-Square & Iman-Davenport F)
 * 2. Kendall's W (Effect Size)
 * 3. Nemenyi Post-hoc Test (Critical Difference, pairwise z/p, and homogeneous cliques)
 */
export function friedmanTest(
  table: RankTable,
  higherIsBetter = true,
  alpha: 0.05 | 0.01 = 0.05,
): FriedmanResult {
  const n = table.imageIds.length;
  const k = table.modelIds.length;

  if (n < 2 || k < 2) {
    return {
      n,
      k,
      alpha,
      rankingMatrix: [],
      rankSums: table.modelIds.map(() => 0),
      avgRanks: table.modelIds.map(() => 0),
      chi2: 0,
      df: Math.max(0, k - 1),
      pApprox: 1,
      isSignificantChi2: false,
      imanDavenportF: 0,
      df1: Math.max(0, k - 1),
      df2: Math.max(0, (k - 1) * Math.max(1, n - 1)),
      pFDistribution: 1,
      isSignificantF: false,
      kendallW: 0,
      effectMagnitude: "negligible",
      effectDescription: "Insufficient data (at least 2 images and 2 models required)",
      tieCorrectionApplied: false,
      qAlpha: 0,
      nemenyiCD: 0,
      pairs: [],
      cliques: [],
    };
  }

  // 1. Calculate ranks across all images (blocks)
  const rankingMatrix: number[][] = [];
  const rankSums = new Array<number>(k).fill(0);
  let totalTieCorrection = 0;

  for (let i = 0; i < n; i++) {
    const { ranks, tieCorrection } = rankRowWithTies(table.scores[i]!, higherIsBetter);
    rankingMatrix.push(ranks);
    totalTieCorrection += tieCorrection;
    for (let j = 0; j < k; j++) {
      rankSums[j] += ranks[j]!;
    }
  }

  const avgRanks = rankSums.map((sum) => sum / n);

  // 2. Friedman Chi-Square
  let sumSqRankSums = 0;
  for (let j = 0; j < k; j++) {
    sumSqRankSums += rankSums[j]! ** 2;
  }

  let chi2: number;
  if (totalTieCorrection > 0) {
    const numerator = 12 * sumSqRankSums - 3 * n * n * k * (k + 1) ** 2;
    const denominator = n * k * (k + 1) - (1 / (k - 1)) * totalTieCorrection;
    chi2 = denominator > 0 ? numerator / denominator : 0;
  } else {
    chi2 = (12 / (n * k * (k + 1))) * sumSqRankSums - 3 * n * (k + 1);
  }
  chi2 = Math.max(0, chi2);

  const df = k - 1;
  const pApprox = chi2Sf(chi2, df);
  const isSignificantChi2 = pApprox < alpha;

  // 3. Iman-Davenport F-Test
  const df1 = k - 1;
  const df2 = (k - 1) * (n - 1);
  const denominatorF = n * (k - 1) - chi2;
  const imanDavenportF = denominatorF > 0 ? ((n - 1) * chi2) / denominatorF : 9999;
  const pFDistribution = fDistributionSf(imanDavenportF, df1, df2);
  const isSignificantF = pFDistribution < alpha;

  // 4. Kendall's W (Effect Size)
  const meanRankSum = (n * (k + 1)) / 2;
  let sDev = 0;
  for (let j = 0; j < k; j++) {
    sDev += (rankSums[j]! - meanRankSum) ** 2;
  }

  const maxVariance = (n * n * (k ** 3 - k)) - n * totalTieCorrection;
  let kendallW = maxVariance > 0 ? (12 * sDev) / maxVariance : chi2 / (n * (k - 1));
  kendallW = Math.min(1, Math.max(0, kendallW));

  let effectMagnitude: FriedmanResult["effectMagnitude"];
  let effectDescription: string;
  if (kendallW < 0.1) {
    effectMagnitude = "negligible";
    effectDescription = "Negligible agreement among test images (rankings vary significantly across images)";
  } else if (kendallW < 0.3) {
    effectMagnitude = "small";
    effectDescription = "Small effect size / weak concordance among rankings";
  } else if (kendallW < 0.5) {
    effectMagnitude = "moderate";
    effectDescription = "Moderate concordance (consistent ranking tendencies across images)";
  } else if (kendallW < 0.7) {
    effectMagnitude = "strong";
    effectDescription = "Strong concordance (models maintain consistent relative performance)";
  } else {
    effectMagnitude = "very strong";
    effectDescription = "Very strong agreement (near-unanimous ranking order across all benchmark images)";
  }

  // 5. Nemenyi Post-hoc Test
  const qTable = alpha === 0.01 ? NEMENYI_Q01 : NEMENYI_Q05;
  const qAlpha = qTable[Math.min(10, k)] ?? (alpha === 0.01 ? 3.364 : 2.850);
  const se = Math.sqrt((k * (k + 1)) / (6 * n));
  const nemenyiCD = qAlpha * se;

  const pairs: NemenyiPair[] = [];
  for (let a = 0; a < k; a++) {
    for (let b = a + 1; b < k; b++) {
      const diff = Math.abs(avgRanks[a]! - avgRanks[b]!);
      const zValue = se > 0 ? diff / se : 0;
      const pValue = Math.min(1, Math.max(0, erfc(zValue / Math.SQRT2)));
      pairs.push({
        a: table.modelIds[a]!,
        b: table.modelIds[b]!,
        rankDiff: diff,
        zValue,
        pValue,
        significant: diff > nemenyiCD,
      });
    }
  }

  // 6. Find cliques (non-significant connected components for CD diagram)
  // Sort models by average rank ascending (1 = best)
  const sortedModelIndices = Array.from({ length: k }, (_, i) => i);
  sortedModelIndices.sort((i1, i2) => avgRanks[i1]! - avgRanks[i2]!);

  const cliques: string[][] = [];
  for (let start = 0; start < k; start++) {
    let end = start;
    while (
      end + 1 < k &&
      Math.abs(avgRanks[sortedModelIndices[end + 1]!]! - avgRanks[sortedModelIndices[start]!]!) <= nemenyiCD
    ) {
      end++;
    }
    if (end > start) {
      const clique = sortedModelIndices.slice(start, end + 1).map((idx) => table.modelIds[idx]!);
      // Avoid duplicate sub-cliques
      const isSub = cliques.some((existing) => clique.every((id) => existing.includes(id)));
      if (!isSub) {
        cliques.push(clique);
      }
    }
  }

  return {
    n,
    k,
    alpha,
    rankingMatrix,
    rankSums,
    avgRanks,
    chi2,
    df,
    pApprox,
    isSignificantChi2,
    imanDavenportF,
    df1,
    df2,
    pFDistribution,
    isSignificantF,
    kendallW,
    effectMagnitude,
    effectDescription,
    tieCorrectionApplied: totalTieCorrection > 0,
    qAlpha,
    nemenyiCD,
    pairs,
    cliques,
  };
}
