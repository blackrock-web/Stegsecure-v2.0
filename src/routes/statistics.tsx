import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { friedmanTest, type FriedmanResult, type RankTable } from "@/lib/stats/friedman";
import { METRIC_OPTIONS, REFERENCE_BENCHMARK_ROWS, type MetricType } from "@/lib/stats/sample-data";
import { MODELS, encodeWithModel } from "@/lib/stego/models";
import { useSession, type BenchRow } from "@/lib/session";
import { CDDiagram } from "@/components/cd-diagram";
import { generateSampleImage } from "@/lib/stego/samples";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/statistics")({ component: StatsPage });

function StatsPage() {
  const { bench, setBench, benchSecret, benchPassword } = useSession();

  // State controls
  const [dataSource, setDataSource] = useState<"reference" | "live">("reference");
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("psnr");
  const [alpha, setAlpha] = useState<0.05 | 0.01>(0.05);
  const [filterSigOnly, setFilterSigOnly] = useState(false);
  const [runningLiveBench, setRunningLiveBench] = useState(false);
  const [liveBenchStatus, setLiveBenchStatus] = useState("");
  const [copiedReport, setCopiedReport] = useState(false);

  const activeMetricDef = METRIC_OPTIONS.find((m) => m.id === selectedMetric) ?? METRIC_OPTIONS[0]!;

  // Determine active rows based on data source
  const activeRows = useMemo<BenchRow[]>(() => {
    if (dataSource === "reference") {
      return REFERENCE_BENCHMARK_ROWS;
    }
    return bench;
  }, [dataSource, bench]);

  const activeImages = useMemo(() => {
    return [...new Set(activeRows.map((r) => r.imageName))];
  }, [activeRows]);

  const modelIds = useMemo(() => MODELS.map((m) => m.id), []);

  // Build RankTable
  const rankTable = useMemo<RankTable>(() => {
    return {
      modelIds,
      imageIds: activeImages,
      scores: activeImages.map((img) =>
        modelIds.map((id) => {
          const row = activeRows.find((r) => r.imageName === img && r.modelId === id);
          if (!row || !row.metrics.recovery) {
            return activeMetricDef.higherIsBetter ? -1e9 : 1e9;
          }
          return row.metrics[selectedMetric] as number;
        }),
      ),
    };
  }, [activeImages, modelIds, activeRows, selectedMetric, activeMetricDef.higherIsBetter]);

  // Compute statistical analysis
  const statResult = useMemo<FriedmanResult | null>(() => {
    if (activeImages.length < 2 || modelIds.length < 2) return null;
    return friedmanTest(rankTable, activeMetricDef.higherIsBetter, alpha);
  }, [rankTable, activeMetricDef.higherIsBetter, alpha, activeImages.length, modelIds.length]);

  // Handler to run a fresh live benchmark on sample images
  async function handleRunSampleBenchmark() {
    setRunningLiveBench(true);
    setLiveBenchStatus("Initializing 4 canonical test covers...");
    try {
      const sampleNames: ("portrait" | "texture" | "peppers" | "geometric")[] = [
        "portrait",
        "texture",
        "peppers",
        "geometric",
      ];
      const newRows: BenchRow[] = [];

      for (let sIdx = 0; sIdx < sampleNames.length; sIdx++) {
        const sType = sampleNames[sIdx]!;
        const displayName = `Sample_${sType.toUpperCase()}.png`;
        setLiveBenchStatus(`Generating ${displayName} (384x384)...`);
        const cover = generateSampleImage(sType, 384, 384);

        for (const model of MODELS) {
          setLiveBenchStatus(`Evaluating ${displayName} with ${model.short}...`);
          try {
            const out = await encodeWithModel(
              model,
              cover,
              benchSecret || "ARES Empirical Secret Payload",
              benchPassword || "stegsecure2026",
            );
            newRows.push({
              imageName: displayName,
              modelId: model.id,
              metrics: out.metrics,
              recovered: out.recovered,
            });
          } catch (e) {
            newRows.push({
              imageName: displayName,
              modelId: model.id,
              metrics: {
                psnr: 0,
                ssim: 0,
                mse: 1e9,
                ber: 1,
                recovery: false,
                payloadBits: 0,
                bpp: 0,
                lsbChangePct: 100,
                encodeMs: 0,
                decodeMs: 0,
                distortion: 1e9,
              },
              recovered: "",
              error: e instanceof Error ? e.message : "failed",
            });
          }
        }
      }

      setBench(newRows);
      setDataSource("live");
      setLiveBenchStatus("Completed benchmark across 4 images & 6 models!");
      setTimeout(() => setLiveBenchStatus(""), 4000);
    } catch (err) {
      setLiveBenchStatus(err instanceof Error ? err.message : "Benchmark failed");
    } finally {
      setRunningLiveBench(false);
    }
  }

  // Copy full scientific report
  function handleCopyReport() {
    if (!statResult) return;
    const report = [
      `=== STEGANOGRAPHY STATISTICAL SIGNIFICANCE REPORT ===`,
      `Metric: ${activeMetricDef.name} (${activeMetricDef.unit}) [${activeMetricDef.higherIsBetter ? "Higher is better" : "Lower is better"}]`,
      `Datasets (N): ${statResult.n} images (${activeImages.join(", ")})`,
      `Algorithms (k): ${statResult.k} models`,
      `Significance Level (α): ${alpha}`,
      ``,
      `1. FRIEDMAN TEST`,
      `  - Friedman Chi-Square (χ_F²): ${statResult.chi2.toFixed(4)}`,
      `  - Degrees of Freedom (df): ${statResult.df}`,
      `  - Asymptotic p-value: ${statResult.pApprox.toExponential(4)}`,
      `  - Chi-Square Null Hypothesis: ${statResult.isSignificantChi2 ? "REJECTED (Statistically Significant)" : "NOT REJECTED"}`,
      `  - Iman-Davenport Statistic (F_F): ${statResult.imanDavenportF.toFixed(4)}`,
      `  - F degrees of freedom: df1 = ${statResult.df1}, df2 = ${statResult.df2}`,
      `  - F-distribution p-value: ${statResult.pFDistribution.toExponential(4)}`,
      `  - F-test Null Hypothesis: ${statResult.isSignificantF ? "REJECTED (Statistically Significant)" : "NOT REJECTED"}`,
      ``,
      `2. KENDALL'S W (EFFECT SIZE / CONCORDANCE)`,
      `  - Coefficient of Concordance (W): ${statResult.kendallW.toFixed(4)}`,
      `  - Effect Magnitude: ${statResult.effectMagnitude.toUpperCase()}`,
      `  - Interpretation: ${statResult.effectDescription}`,
      ``,
      `3. NEMENYI POST-HOC TEST`,
      `  - Critical Value (q_α): ${statResult.qAlpha.toFixed(3)}`,
      `  - Critical Difference (CD): ${statResult.nemenyiCD.toFixed(4)}`,
      `  - Models sorted by average rank (1 = best):`,
      ...modelIds
        .map((id, i) => ({ id, name: MODELS.find((m) => m.id === id)?.name || id, rank: statResult.avgRanks[i]! }))
        .sort((a, b) => a.rank - b.rank)
        .map((m, idx) => `    ${idx + 1}. ${m.name}: Mean Rank = ${m.rank.toFixed(3)}`),
      ``,
      `  - Significant Pairwise Comparisons (|Δ Rank| > CD):`,
      ...statResult.pairs
        .filter((p) => p.significant)
        .map(
          (p) =>
            `    * ${MODELS.find((m) => m.id === p.a)?.short} vs ${MODELS.find((m) => m.id === p.b)?.short}: |Δ| = ${p.rankDiff.toFixed(3)} > CD (${statResult.nemenyiCD.toFixed(3)}), z = ${p.zValue.toFixed(2)}, p = ${p.pValue.toExponential(3)}`,
        ),
    ].join("\n");

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  }

  return (
    <AppShell>
      <PageHeader kicker="Module 04 · Rigorous Evaluation" title="Statistical Analysis" />
      <p className="mb-6 max-w-3xl text-sm text-muted-foreground leading-relaxed">
        Empirical statistical hypothesis testing comparing <strong>ARES Hybrid-INN</strong> against
        five reproduced state-of-the-art steganography baselines. Evaluates the{" "}
        <strong>Friedman Test</strong> (with Iman-Davenport F extension),{" "}
        <strong>Kendall’s W Effect Size</strong>, and the <strong>Nemenyi Post-hoc Test</strong> with
        Demšar Critical Difference diagrams.
      </p>

      {/* Control Toolbar */}
      <section className="mb-8 rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Data Source Selection */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Benchmark Dataset Source
            </Label>
            <div className="mt-2 flex rounded-lg border border-border bg-muted/40 p-1">
              <button
                type="button"
                onClick={() => setDataSource("reference")}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                  dataSource === "reference"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                ARES Reference (6 Images)
              </button>
              <button
                type="button"
                onClick={() => setDataSource("live")}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                  dataSource === "live"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Live Session ({bench.length > 0 ? `${activeImages.length} Images` : "Empty"})
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {dataSource === "reference"
                ? "Canonical dataset: Lena, Baboon, Peppers, Airplane, Barbara, Lake."
                : "Results generated from your interactive test sessions."}
            </p>
          </div>

          {/* Metric Selector */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Evaluation Metric
            </Label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            >
              {METRIC_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name} ({opt.unit})
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[11px] text-muted-foreground">{activeMetricDef.description}</p>
          </div>

          {/* Significance Level (Alpha) & Quick Actions */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Significance Level (α)
            </Label>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setAlpha(0.05)}
                className={cn(
                  "flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors",
                  alpha === 0.05
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                α = 0.05 (95% Conf.)
              </button>
              <button
                type="button"
                onClick={() => setAlpha(0.01)}
                className={cn(
                  "flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors",
                  alpha === 0.01
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                α = 0.01 (99% Conf.)
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex-1"
                onClick={handleCopyReport}
                disabled={!statResult}
              >
                {copiedReport ? "✓ Report Copied" : "Copy Full Report"}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-8 text-xs flex-1"
                disabled={runningLiveBench}
                onClick={handleRunSampleBenchmark}
              >
                {runningLiveBench ? "Running Benchmark…" : "Run Live Test"}
              </Button>
            </div>
          </div>
        </div>

        {liveBenchStatus ? (
          <div className="mt-4 rounded-lg bg-primary/8 border border-primary/20 px-3 py-2 text-xs text-primary flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span>{liveBenchStatus}</span>
          </div>
        ) : null}
      </section>

      {/* Main Content Area */}
      {!statResult ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <h3 className="font-display text-lg">Insufficient Data for Statistical Testing</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            The Friedman and Nemenyi tests require at least 2 datasets and 2 models. Switch to the
            Reference Dataset or run a live benchmark.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button onClick={() => setDataSource("reference")} variant="default" size="sm">
              Load Reference Dataset (6 Images)
            </Button>
            <Button
              onClick={handleRunSampleBenchmark}
              disabled={runningLiveBench}
              variant="outline"
              size="sm"
            >
              Generate Live Benchmark
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* STATISTICAL SUMMARY KPI CARDS */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg text-foreground">Statistical Test Overview</h2>
              <span className="text-xs text-muted-foreground">
                Analyzing <strong>{statResult.n}</strong> images across <strong>{statResult.k}</strong> models
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Friedman Chi-Square */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Friedman χ_F²
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      statResult.isSignificantChi2
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {statResult.isSignificantChi2 ? "p < " + alpha : "Not Sig."}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-foreground">
                    {statResult.chi2.toFixed(3)}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    df = {statResult.df}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground font-mono">
                  p ≈ {statResult.pApprox < 0.0001 ? "< 0.0001" : statResult.pApprox.toFixed(5)}
                </p>
              </div>

              {/* Iman-Davenport F */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Iman-Davenport F_F
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      statResult.isSignificantF
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {statResult.isSignificantF ? "Significant" : "Not Sig."}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-foreground">
                    {statResult.imanDavenportF > 9000 ? "∞" : statResult.imanDavenportF.toFixed(3)}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    F({statResult.df1}, {statResult.df2})
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground font-mono">
                  p_F = {statResult.pFDistribution < 0.0001 ? "< 0.0001" : statResult.pFDistribution.toFixed(5)}
                </p>
              </div>

              {/* Kendall's W */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Kendall’s W Effect
                  </span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                    {statResult.effectMagnitude}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-foreground">
                    {statResult.kendallW.toFixed(3)}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">[0..1 scale]</span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Concordance of rankings
                </p>
              </div>

              {/* Nemenyi CD */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Nemenyi CD (α={alpha})
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    q_α = {statResult.qAlpha.toFixed(3)}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-foreground">
                    {statResult.nemenyiCD.toFixed(3)}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">rank threshold</span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Minimum diff for significance
                </p>
              </div>
            </div>
          </section>

          {/* DEMŠAR CRITICAL DIFFERENCE (CD) DIAGRAM */}
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <h2 className="font-display text-xl text-foreground">
                  1. Demšar Critical Difference (CD) Diagram
                </h2>
                <p className="text-xs text-muted-foreground">
                  Visualizes the Nemenyi post-hoc test (Demšar, 2006). Models separated by less than
                  the Critical Difference (CD = {statResult.nemenyiCD.toFixed(3)}) are connected with
                  an emerald horizontal clique bar and are statistically equivalent.
                </p>
              </div>
            </div>

            <CDDiagram
              modelIds={modelIds}
              avgRanks={statResult.avgRanks}
              cd={statResult.nemenyiCD}
              cliques={statResult.cliques}
              k={statResult.k}
              metricLabel={activeMetricDef.name}
              higherIsBetter={activeMetricDef.higherIsBetter}
            />
          </section>

          {/* KENDALL'S W EFFECT SIZE ANALYSIS */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-xl text-foreground mb-1">
              2. Kendall’s W Effect Size (Concordance of Raters)
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Measures the degree of agreement among the <em>N = {statResult.n}</em> benchmark test images
              regarding the ranking of the <em>k = {statResult.k}</em> steganography algorithms.
            </p>

            {/* Visual Concordance Scale */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>0.0 (No Agreement)</span>
                <span>0.1 (Negligible)</span>
                <span>0.3 (Small)</span>
                <span>0.5 (Moderate)</span>
                <span>0.7 (Strong)</span>
                <span>1.0 (Unanimous)</span>
              </div>
              <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
                {/* Segments */}
                <div className="absolute inset-0 grid grid-cols-5 opacity-30">
                  <div className="border-r border-background bg-slate-400" />
                  <div className="border-r border-background bg-sky-400" />
                  <div className="border-r border-background bg-indigo-400" />
                  <div className="border-r border-background bg-blue-500" />
                  <div className="bg-emerald-500" />
                </div>
                {/* Actual indicator */}
                <div
                  className="absolute top-0 bottom-0 left-0 bg-primary transition-all duration-500"
                  style={{ width: `${Math.min(100, statResult.kendallW * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-medium text-foreground">
                  Measured Kendall’s W ={" "}
                  <strong className="font-mono text-primary">{statResult.kendallW.toFixed(4)}</strong>{" "}
                  ({statResult.effectMagnitude.toUpperCase()} effect)
                </span>
                <span className="text-muted-foreground">
                  {statResult.tieCorrectionApplied ? "Exact tie correction applied" : "No ties detected"}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Scientific Interpretation: </strong>
              {statResult.effectDescription}. This demonstrates that the algorithm hierarchy is{" "}
              {statResult.kendallW > 0.5
                ? "highly robust and independent of cover frequency content or spatial gradients"
                : "moderately consistent across test covers"}
              .
            </div>
          </section>

          {/* NEMENYI PAIRWISE POST-HOC COMPARISONS */}
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl text-foreground">
                  3. Nemenyi Post-Hoc Pairwise Comparisons
                </h2>
                <p className="text-xs text-muted-foreground">
                  Two models are significantly different at α = {alpha} if their average rank difference
                  |ΔR| exceeds CD = {statResult.nemenyiCD.toFixed(3)}.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-7 text-xs", !filterSigOnly && "bg-muted")}
                  onClick={() => setFilterSigOnly(false)}
                >
                  All Pairs ({statResult.pairs.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-7 text-xs", filterSigOnly && "bg-primary/10 text-primary border-primary")}
                  onClick={() => setFilterSigOnly(true)}
                >
                  Significant Only ({statResult.pairs.filter((p) => p.significant).length})
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[680px] text-left text-xs">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Model A</th>
                    <th className="px-3 py-2 font-medium">Model B</th>
                    <th className="px-3 py-2 font-medium">Rank A</th>
                    <th className="px-3 py-2 font-medium">Rank B</th>
                    <th className="px-3 py-2 font-medium font-mono">|Δ Rank|</th>
                    <th className="px-3 py-2 font-medium font-mono">Threshold (CD)</th>
                    <th className="px-3 py-2 font-medium font-mono">z-Score</th>
                    <th className="px-3 py-2 font-medium font-mono">p-Value</th>
                    <th className="px-3 py-2 font-medium">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {statResult.pairs
                    .filter((p) => (filterSigOnly ? p.significant : true))
                    .map((pair) => {
                      const modA = MODELS.find((m) => m.id === pair.a);
                      const modB = MODELS.find((m) => m.id === pair.b);
                      const idxA = modelIds.indexOf(pair.a);
                      const idxB = modelIds.indexOf(pair.b);
                      const rankA = statResult.avgRanks[idxA] ?? 0;
                      const rankB = statResult.avgRanks[idxB] ?? 0;
                      const isAresPair = pair.a === "ares_hybrid_inn" || pair.b === "ares_hybrid_inn";

                      return (
                        <tr
                          key={`${pair.a}-${pair.b}`}
                          className={cn(
                            "border-t border-border transition-colors",
                            pair.significant && "bg-primary/4",
                            isAresPair && "font-medium",
                          )}
                        >
                          <td className="px-3 py-2">
                            <span className={pair.a === "ares_hybrid_inn" ? "text-primary font-bold" : ""}>
                              {modA?.short || pair.a}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <span className={pair.b === "ares_hybrid_inn" ? "text-primary font-bold" : ""}>
                              {modB?.short || pair.b}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-mono tabular-nums">{rankA.toFixed(2)}</td>
                          <td className="px-3 py-2 font-mono tabular-nums">{rankB.toFixed(2)}</td>
                          <td className="px-3 py-2 font-mono tabular-nums font-semibold">
                            {pair.rankDiff.toFixed(3)}
                          </td>
                          <td className="px-3 py-2 font-mono tabular-nums text-muted-foreground">
                            {statResult.nemenyiCD.toFixed(3)}
                          </td>
                          <td className="px-3 py-2 font-mono tabular-nums">{pair.zValue.toFixed(2)}</td>
                          <td className="px-3 py-2 font-mono tabular-nums">
                            {pair.pValue < 0.001 ? "< 0.001" : pair.pValue.toFixed(4)}
                          </td>
                          <td className="px-3 py-2">
                            {pair.significant ? (
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                Significant (p &lt; {alpha})
                              </span>
                            ) : (
                              <span className="inline-flex rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                                No Sig. Difference
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </section>

          {/* COMPLETE RANKING & METRIC MATRIX (PER IMAGE) */}
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-xl text-foreground">
                4. Full Ranking & Score Matrix
              </h2>
              <span className="text-xs text-muted-foreground">
                Showing individual image scores and assigned ranks (1 = best)
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[740px] text-left text-xs">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Cover Image</th>
                    {MODELS.map((m) => (
                      <th
                        key={m.id}
                        className={cn(
                          "px-3 py-2 font-medium text-center",
                          m.id === "ares_hybrid_inn" && "text-primary font-bold",
                        )}
                      >
                        {m.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeImages.map((img, imgIdx) => (
                    <tr key={img} className="border-t border-border">
                      <td className="px-3 py-2 font-medium text-foreground">{img}</td>
                      {modelIds.map((mId, mIdx) => {
                        const rawScore = rankTable.scores[imgIdx]?.[mIdx];
                        const rankVal = statResult.rankingMatrix[imgIdx]?.[mIdx] ?? 0;
                        const isBest = rankVal === 1;

                        return (
                          <td
                            key={mId}
                            className={cn(
                              "px-3 py-2 text-center font-mono tabular-nums",
                              isBest && "bg-primary/8 font-semibold text-primary",
                            )}
                          >
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] mr-1.5">
                              #{rankVal}
                            </span>
                            <span>
                              {typeof rawScore === "number" && rawScore > -1e8 && rawScore < 1e8
                                ? rawScore.toFixed(selectedMetric === "psnr" ? 2 : 3)
                                : "—"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Rank Sums */}
                  <tr className="border-t-2 border-border bg-muted/30 font-semibold">
                    <td className="px-3 py-2 text-foreground font-mono">Rank Sum (R_j)</td>
                    {statResult.rankSums.map((sum, i) => (
                      <td key={i} className="px-3 py-2 text-center font-mono tabular-nums">
                        {sum.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                  {/* Average Ranks */}
                  <tr className="border-t border-border bg-muted/60 font-bold text-foreground">
                    <td className="px-3 py-2 font-mono">Average Rank (R̄_j)</td>
                    {statResult.avgRanks.map((avg, i) => (
                      <td
                        key={i}
                        className={cn(
                          "px-3 py-2 text-center font-mono tabular-nums text-sm",
                          modelIds[i] === "ares_hybrid_inn" && "text-primary font-extrabold",
                        )}
                      >
                        {avg.toFixed(3)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
