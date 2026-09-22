import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { encodeWithModel, MODELS } from "@/lib/stego/models";
import { fileToImage } from "@/lib/stego/pixels";
import { METRIC_KEYS } from "@/lib/stego/metrics";
import { useSession, type BenchRow } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/benchmark")({ component: BenchmarkPage });

function BenchmarkPage() {
  const { bench, setBench, benchSecret, benchPassword, setBenchCreds } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!files.length) {
      setError("Upload one or more cover images.");
      return;
    }
    setBusy(true);
    setError(null);
    const rows: BenchRow[] = [];
    try {
      for (const file of files) {
        const cover = await fileToImage(file, 384);
        for (const model of MODELS) {
          setProgress(`${file.name} · ${model.short}`);
          try {
            const out = await encodeWithModel(model, cover, benchSecret, benchPassword);
            rows.push({
              imageName: file.name,
              modelId: model.id,
              metrics: out.metrics,
              recovered: out.recovered,
            });
          } catch (e) {
            rows.push({
              imageName: file.name,
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
      setBench(rows);
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  const images = useMemo(() => [...new Set(bench.map((r) => r.imageName))], [bench]);

  function winnerFor(imageName: string) {
    const group = bench.filter((r) => r.imageName === imageName && r.metrics.recovery);
    if (!group.length) return null;
    return group.reduce((a, b) => (a.metrics.psnr >= b.metrics.psnr ? a : b));
  }

  return (
    <AppShell>
      <PageHeader kicker="Module 03" title="Benchmark" />
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Same secret, password, and cover for all six models. Paper entries are algorithm
        reproductions (weights were never published). Winner per image is the highest PSNR among
        exact recoveries only.
      </p>

      <section className="mb-8 rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>Cover images</Label>
            <Input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              className="mt-2"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
            <p className="mt-1 text-xs text-muted-foreground">{files.length} selected</p>
          </div>
          <div>
            <Label>Secret</Label>
            <Input
              className="mt-2"
              value={benchSecret}
              onChange={(e) => setBenchCreds(e.target.value, benchPassword)}
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              className="mt-2"
              value={benchPassword}
              onChange={(e) => setBenchCreds(benchSecret, e.target.value)}
            />
          </div>
        </div>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        <Button className="mt-5" disabled={busy} onClick={run}>
          {busy ? progress || "Running…" : "Run six-model comparison"}
        </Button>
      </section>

      {images.map((name) => {
        const winner = winnerFor(name);
        return (
          <section key={name} className="mb-10">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl">{name}</h2>
              {winner ? (
                <p className="text-sm text-primary">
                  Best PSNR (exact recovery):{" "}
                  {MODELS.find((m) => m.id === winner.modelId)?.name} ·{" "}
                  {winner.metrics.psnr.toFixed(2)} dB
                </p>
              ) : (
                <p className="text-sm text-destructive">No exact recovery</p>
              )}
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Model</th>
                    {METRIC_KEYS.map((m) => (
                      <th key={m.key} className="px-3 py-2 font-medium">
                        {m.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((model) => {
                    const row = bench.find((r) => r.imageName === name && r.modelId === model.id);
                    const isWin = winner?.modelId === model.id;
                    if (!row) return null;
                    return (
                      <tr
                        key={model.id}
                        className={cn(
                          "border-t border-border",
                          isWin && "bg-primary/8",
                          !row.metrics.recovery && "opacity-50",
                        )}
                      >
                        <td className="px-3 py-2 font-medium text-ink">
                          <span>{model.short}</span>{" "}
                          {model.status === "REPRODUCED" ? (
                            <span className="text-[10px] text-muted-foreground">repro</span>
                          ) : (
                            <span className="text-[10px] text-primary">trained</span>
                          )}
                        </td>
                        {METRIC_KEYS.map((m) => {
                          const v = row.metrics[m.key];
                          let text = "—";
                          if (typeof v === "boolean") text = v ? "true" : "false";
                          else if (typeof v === "number") {
                            text =
                              m.key === "mse" || m.key === "distortion"
                                ? v.toExponential(2)
                                : v.toFixed(m.key === "psnr" ? 2 : 3);
                          }
                          return (
                            <td key={m.key} className="px-3 py-2 font-mono tabular-nums">
                              {text}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </AppShell>
  );
}
