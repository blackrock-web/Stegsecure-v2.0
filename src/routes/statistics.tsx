import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { friedmanTest } from "@/lib/stats/friedman";
import { MODELS } from "@/lib/stego/models";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/statistics")({ component: StatsPage });

function StatsPage() {
  const bench = useSession((s) => s.bench);
  const images = [...new Set(bench.map((r) => r.imageName))];
  const modelIds = MODELS.map((m) => m.id);

  const table = {
    modelIds,
    imageIds: images,
    scores: images.map((img) =>
      modelIds.map((id) => {
        const row = bench.find((r) => r.imageName === img && r.modelId === id);
        if (!row || !row.metrics.recovery) return -1e9;
        return row.metrics.psnr;
      }),
    ),
  };

  const res = images.length >= 2 ? friedmanTest(table, true) : null;

  return (
    <AppShell>
      <PageHeader kicker="Module 04" title="Statistics" />
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Friedman test, Kendall’s W, and Nemenyi post-hoc on per-image PSNR ranks from the
        Benchmark module. Failed recoveries are ranked last. Nothing is pre-filled.
      </p>

      {images.length < 2 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Run a benchmark with at least two images first.{" "}
          <Link to="/benchmark" className="text-primary underline">
            Open Benchmark
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <section className="grid gap-3 sm:grid-cols-4">
            <Stat label="Images (N)" value={String(res!.n)} />
            <Stat label="Models (k)" value={String(res!.k)} />
            <Stat label="Friedman χ²" value={res!.chi2.toFixed(3)} />
            <Stat label="df" value={String(res!.df)} />
            <Stat label="p (approx.)" value={res!.pApprox < 0.0001 ? "< 0.0001" : res!.pApprox.toFixed(4)} />
            <Stat label="Kendall’s W" value={res!.kendallW.toFixed(3)} />
            <Stat label="Nemenyi CD (α=0.05)" value={res!.nemenyiCD.toFixed(3)} />
            <Stat
              label="Effect"
              value={
                res!.kendallW < 0.1 ? "small" : res!.kendallW < 0.3 ? "moderate" : "strong"
              }
            />
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl">Average ranks (PSNR, 1 = best)</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Model</th>
                    <th className="px-3 py-2">Mean rank</th>
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((m, i) => (
                    <tr key={m.id} className="border-t border-border">
                      <td className="px-3 py-2">{m.name}</td>
                      <td className="px-3 py-2 font-mono tabular-nums">
                        {res!.avgRanks[i]!.toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl">Nemenyi pairwise</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Significant if |rank difference| exceeds CD = {res!.nemenyiCD.toFixed(3)}.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[520px] text-left text-xs">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">A</th>
                    <th className="px-3 py-2">B</th>
                    <th className="px-3 py-2">|Δ rank|</th>
                    <th className="px-3 py-2">Significant</th>
                  </tr>
                </thead>
                <tbody>
                  {res!.pairs.map((p) => (
                    <tr key={p.a + p.b} className="border-t border-border">
                      <td className="px-3 py-2">{MODELS.find((m) => m.id === p.a)?.short}</td>
                      <td className="px-3 py-2">{MODELS.find((m) => m.id === p.b)?.short}</td>
                      <td className="px-3 py-2 font-mono">{p.rankDiff.toFixed(3)}</td>
                      <td className="px-3 py-2">{p.significant ? "yes" : "no"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg tabular-nums">{value}</p>
    </div>
  );
}
