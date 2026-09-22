import test from "node:test";
import assert from "node:assert/strict";
import {
  friedmanTest,
  rankRowWithTies,
  NEMENYI_Q05,
  NEMENYI_Q01,
  fDistributionSf,
  type RankTable,
} from "./friedman.ts";

test("Statistical Suite: rankRowWithTies assigns fractional ranks correctly", () => {
  // Simple descending ranking (higher is better)
  const { ranks: r1, tieCorrection: t1 } = rankRowWithTies([50, 40, 30, 20], true);
  assert.deepEqual(r1, [1, 2, 3, 4]);
  assert.equal(t1, 0);

  // Simple ascending ranking (lower is better, e.g. MSE or BER)
  const { ranks: r2 } = rankRowWithTies([50, 40, 30, 20], false);
  assert.deepEqual(r2, [4, 3, 2, 1]);

  // Tie handling: two tied for 1st place (50, 50, 30, 20) -> avg rank (1+2)/2 = 1.5
  const { ranks: r3, tieCorrection: t3 } = rankRowWithTies([50, 50, 30, 20], true);
  assert.deepEqual(r3, [1.5, 1.5, 3, 4]);
  assert.equal(t3, 2 ** 3 - 2); // 6

  // 3-way tie for middle: 50, 40, 40, 40, 10 -> ranks 1, (2+3+4)/3=3, 3, 3, 5
  const { ranks: r4, tieCorrection: t4 } = rankRowWithTies([50, 40, 40, 40, 10], true);
  assert.deepEqual(r4, [1, 3, 3, 3, 5]);
  assert.equal(t4, 3 ** 3 - 3); // 24
});

test("Statistical Suite: Textbook Demsar (2006) 4 algorithms x 5 datasets test", () => {
  // A classic validation benchmark table
  const testTable: RankTable = {
    modelIds: ["Algo_A", "Algo_B", "Algo_C", "Algo_D"],
    imageIds: ["Data_1", "Data_2", "Data_3", "Data_4", "Data_5"],
    scores: [
      [90, 80, 70, 60], // Ranks: 1, 2, 3, 4
      [95, 85, 75, 65], // Ranks: 1, 2, 3, 4
      [92, 82, 72, 62], // Ranks: 1, 2, 3, 4
      [91, 81, 71, 61], // Ranks: 1, 2, 3, 4
      [93, 83, 73, 63], // Ranks: 1, 2, 3, 4
    ],
  };

  const res = friedmanTest(testTable, true, 0.05);

  assert.equal(res.n, 5);
  assert.equal(res.k, 4);
  assert.equal(res.df, 3);

  // Model ranks should be strictly 1.0, 2.0, 3.0, 4.0
  assert.deepEqual(res.avgRanks, [1.0, 2.0, 3.0, 4.0]);

  // When every block orders models identically:
  // Friedman chi2 = 12 * 5 / (4 * 5) * (1^2 + 2^2 + 3^2 + 4^2 - 4 * 2.5^2)
  // = 3 * (30 - 25) = 15.0
  assert.ok(Math.abs(res.chi2 - 15.0) < 0.001, `Chi2 expected 15.0, got ${res.chi2}`);
  assert.ok(res.isSignificantChi2, "Chi2 should reject null hypothesis");
  assert.ok(res.pApprox < 0.01, `p-value should be significant, got ${res.pApprox}`);

  // Kendall's W must be exactly 1.0 (perfect unanimous concordance)
  assert.ok(
    Math.abs(res.kendallW - 1.0) < 0.001,
    `Kendall's W expected 1.0 for unanimous rankings, got ${res.kendallW}`,
  );
  assert.equal(res.effectMagnitude, "very strong");

  // Nemenyi critical difference test
  // q_0.05 for k=4 is 2.569
  // SE = sqrt(4 * 5 / (6 * 5)) = sqrt(20 / 30) = sqrt(2/3) ≈ 0.8164965
  // CD = 2.569 * sqrt(2/3) ≈ 2.097
  assert.ok(res.nemenyiCD > 2.0 && res.nemenyiCD < 2.2, `CD expected ~2.10, got ${res.nemenyiCD}`);

  // Pairwise comparisons:
  // Algo_A vs Algo_D diff is |1 - 4| = 3.0 > CD (2.097) -> Significant!
  const pairAD = res.pairs.find((p) => p.a === "Algo_A" && p.b === "Algo_D");
  assert.ok(pairAD, "Pair A-D must exist");
  assert.equal(pairAD.rankDiff, 3.0);
  assert.equal(pairAD.significant, true);

  // Algo_A vs Algo_B diff is |1 - 2| = 1.0 < CD -> Not significant
  const pairAB = res.pairs.find((p) => p.a === "Algo_A" && p.b === "Algo_B");
  assert.ok(pairAB, "Pair A-B must exist");
  assert.equal(pairAB.rankDiff, 1.0);
  assert.equal(pairAB.significant, false);
});

test("Statistical Suite: Kendall's W = 0 when rankings are completely balanced / non-concordant", () => {
  // 3 models, 3 images with cyclic balanced ranks:
  // Image 1: A=1, B=2, C=3 (sum = 6)
  // Image 2: B=1, C=2, A=3
  // Image 3: C=1, A=2, B=3
  const table: RankTable = {
    modelIds: ["A", "B", "C"],
    imageIds: ["Img1", "Img2", "Img3"],
    scores: [
      [30, 20, 10], // A=1, B=2, C=3
      [10, 30, 20], // B=1, C=2, A=3
      [20, 10, 30], // C=1, A=2, B=3
    ],
  };

  const res = friedmanTest(table, true);
  // All average ranks should equal exactly 2.0
  assert.deepEqual(res.avgRanks, [2.0, 2.0, 2.0]);
  // Chi-Square and Kendall's W must be 0
  assert.ok(res.chi2 < 1e-10, `Chi2 should be 0, got ${res.chi2}`);
  assert.ok(res.kendallW < 1e-10, `Kendall W should be 0, got ${res.kendallW}`);
  assert.equal(res.effectMagnitude, "negligible");
  assert.equal(res.isSignificantChi2, false);
  assert.equal(res.isSignificantF, false);
});

test("Statistical Suite: Iman-Davenport and F-distribution functions", () => {
  // F distribution p-value of F=10 with df1=3, df2=12 should be < 0.01
  const pVal = fDistributionSf(10, 3, 12);
  assert.ok(pVal < 0.01, `Expected p < 0.01, got ${pVal}`);

  // F distribution with large degrees of freedom
  const pVal2 = fDistributionSf(1, 5, 25);
  assert.ok(pVal2 > 0.3 && pVal2 < 0.6, `Expected p ~ 0.44, got ${pVal2}`);
});

test("Statistical Suite: Nemenyi Critical Value Constants verification", () => {
  assert.equal(NEMENYI_Q05[2], 1.960);
  assert.equal(NEMENYI_Q05[4], 2.569);
  assert.equal(NEMENYI_Q05[6], 2.850);

  assert.equal(NEMENYI_Q01[2], 2.576);
  assert.equal(NEMENYI_Q01[4], 3.113);
  assert.equal(NEMENYI_Q01[6], 3.364);
});

test("Statistical Suite: Performs real tests on generated reference steganography benchmark results", async () => {
  const { REFERENCE_BENCHMARK_ROWS } = await import("./sample-data.ts");
  const models = ["ares_hybrid_inn", "paper_model_01", "paper_model_02", "paper_model_03", "paper_model_04", "paper_model_05"];
  const images = [...new Set(REFERENCE_BENCHMARK_ROWS.map((r) => r.imageName))];

  assert.equal(images.length, 6);
  assert.equal(models.length, 6);

  // Construct PSNR rank table
  const psnrScores = images.map((img) =>
    models.map((m) => {
      const row = REFERENCE_BENCHMARK_ROWS.find((r) => r.imageName === img && r.modelId === m);
      return row ? row.metrics.psnr : 0;
    }),
  );

  const res = friedmanTest(
    {
      modelIds: models,
      imageIds: images,
      scores: psnrScores,
    },
    true,
    0.05,
  );

  // Assertions for Friedman Test
  assert.equal(res.n, 6);
  assert.equal(res.k, 6);
  assert.equal(res.df, 5);
  assert.ok(res.chi2 > 20, `Chi2 should be large, got ${res.chi2}`);
  assert.ok(res.isSignificantChi2, "Chi2 test should reject null hypothesis (p < 0.05)");
  assert.ok(res.isSignificantF, "Iman-Davenport F-test should reject null hypothesis");

  // ARES (rank 1) should have the best (lowest rank value) average rank of 1.0
  assert.equal(res.avgRanks[0], 1.0);

  // Assertions for Kendall's W Effect Size
  assert.ok(res.kendallW > 0.8, `Kendall's W should indicate strong concordance, got ${res.kendallW}`);
  assert.equal(res.effectMagnitude, "very strong");

  // Assertions for Nemenyi Post-hoc Test
  assert.ok(res.nemenyiCD > 0, `Nemenyi CD should be positive, got ${res.nemenyiCD}`);
  assert.equal(res.pairs.length, (6 * 5) / 2); // 15 pairs

  // ARES vs paper_model_05 (Zhang ISS) must be statistically significant
  const aresVsZhang = res.pairs.find((p) => p.a === "ares_hybrid_inn" && p.b === "paper_model_05");
  assert.ok(aresVsZhang, "ARES vs Zhang pair should exist");
  assert.equal(aresVsZhang.significant, true);
  assert.ok(aresVsZhang.rankDiff > res.nemenyiCD);
});
