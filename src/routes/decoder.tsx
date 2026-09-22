import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricGrid } from "@/components/metric-grid";
import { decodeAres } from "@/lib/stego/models";
import { fileToImage, imageToDataUrl } from "@/lib/stego/pixels";
import type { QualityMetrics } from "@/lib/stego/metrics";
import type { RgbImage } from "@/lib/stego/pixels";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/decoder")({ component: DecoderPage });

function DecoderPage() {
  const last = useSession();
  const [password, setPassword] = useState(last.lastPassword ?? "lab-passphrase");
  const [stego, setStego] = useState<RgbImage | undefined>(last.lastStego);
  const [cover, setCover] = useState<RgbImage | undefined>(last.lastCover);
  const [stegoUrl, setStegoUrl] = useState(last.lastStegoUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<QualityMetrics | null>(last.lastMetrics ?? null);

  async function onStego(f: File | undefined) {
    if (!f) return;
    const img = await fileToImage(f, 512);
    setStego(img);
    setStegoUrl(imageToDataUrl(img));
    setSecret(null);
  }

  async function onCover(f: File | undefined) {
    if (!f) return;
    setCover(await fileToImage(f, 512));
  }

  async function run() {
    if (!stego) {
      setError("Upload a stego image.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const out = await decodeAres(stego, password, cover, last.lastSecret);
      setSecret(out.secret);
      setMetrics(out.metrics);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Decode failed");
      setSecret(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <PageHeader kicker="Module 02" title="Decoder" />
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Recover the secret with the same ARES-Hybrid-INN pipeline and password. Quality metrics
        (PSNR, SSIM, MSE) need the original cover; without it, only recovery and decode time are
        reported.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <Label>Stego image</Label>
          <Input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="mt-2"
            onChange={(e) => onStego(e.target.files?.[0])}
          />
          <Label className="mt-5 block">Original cover (optional, for PSNR/SSIM)</Label>
          <Input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="mt-2"
            onChange={(e) => onCover(e.target.files?.[0])}
          />
          <Label className="mt-5 block">Password</Label>
          <Input
            type="password"
            className="mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
          <Button className="mt-6 w-full" disabled={busy} onClick={run}>
            {busy ? "Decoding…" : "Decode with ARES-Hybrid-INN"}
          </Button>
        </section>

        <section className="space-y-4">
          <figure className="overflow-hidden rounded-xl border border-border bg-muted">
            {stegoUrl ? (
              <img src={stegoUrl} alt="Stego" className="max-h-64 w-full object-contain" />
            ) : (
              <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
                No stego yet
              </div>
            )}
          </figure>
          {secret !== null ? (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Recovered secret</p>
              <p className="mt-2 whitespace-pre-wrap font-mono text-sm text-ink">{secret}</p>
            </div>
          ) : null}
          {metrics ? <MetricGrid metrics={metrics} /> : null}
        </section>
      </div>
    </AppShell>
  );
}
