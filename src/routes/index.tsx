import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MetricGrid } from "@/components/metric-grid";
import { encodeWithModel, modelById } from "@/lib/stego/models";
import { fileToImage, imageToDataUrl, imageToPngBlob } from "@/lib/stego/pixels";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/")({ component: EncoderPage });

function EncoderPage() {
  const setEncode = useSession((s) => s.setEncode);
  const last = useSession();
  const [fileName, setFileName] = useState("");
  const [secret, setSecret] = useState("ARES research secret");
  const [password, setPassword] = useState("lab-passphrase");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState(last.lastCoverUrl ?? "");
  const [stegoUrl, setStegoUrl] = useState(last.lastStegoUrl ?? "");

  async function onFile(f: File | undefined) {
    if (!f) return;
    setFileName(f.name);
    setError(null);
    try {
      const img = await fileToImage(f, 512);
      setCoverUrl(imageToDataUrl(img));
      useSession.setState({ lastCover: img, lastCoverUrl: imageToDataUrl(img) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read image");
    }
  }

  async function embed() {
    const cover = useSession.getState().lastCover;
    if (!cover) {
      setError("Upload a cover image first.");
      return;
    }
    if (!secret.trim() || !password) {
      setError("Secret text and password are required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const model = modelById("ares_hybrid_inn");
      const out = await encodeWithModel(model, cover, secret.trim(), password);
      const url = imageToDataUrl(out.stego);
      setStegoUrl(url);
      setEncode({
        cover,
        stego: out.stego,
        coverUrl: coverUrl || imageToDataUrl(cover),
        stegoUrl: url,
        secret: secret.trim(),
        password,
        metrics: out.metrics,
        model,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Embed failed");
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    const stego = useSession.getState().lastStego;
    if (!stego) return;
    const blob = await imageToPngBlob(stego);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ares-stego.png";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const metrics = useSession((s) => s.lastMetrics);

  return (
    <AppShell>
      <PageHeader kicker="Module 01" title="Encoder" />
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Hide a secret inside a cover image with ARES-Hybrid-INN (Hamming 7,3, ±1 matching,
        adaptive positions, residual compensation). Metrics are measured on the actual stego
        pixels — not training-proxy PSNR.
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="rounded-xl border border-border bg-card p-5">
          <Label htmlFor="cover">Cover image</Label>
          <Input
            id="cover"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="mt-2"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {fileName || "PNG, JPEG, or WebP. Processed at max 512 px."}
          </p>

          <Label htmlFor="secret" className="mt-5 block">
            Secret text
          </Label>
          <Textarea
            id="secret"
            className="mt-2"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />

          <Label htmlFor="pw" className="mt-5 block">
            Password
          </Label>
          <Input
            id="pw"
            type="password"
            className="mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

          <Button className="mt-6 w-full" disabled={busy} onClick={embed}>
            {busy ? "Embedding…" : "Embed with ARES-Hybrid-INN"}
          </Button>
        </section>

        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <figure className="overflow-hidden rounded-xl border border-border bg-muted">
              {coverUrl ? (
                <img src={coverUrl} alt="Cover" className="aspect-square w-full object-cover" />
              ) : (
                <div className="flex aspect-square items-center justify-center text-xs text-muted-foreground">
                  Cover
                </div>
              )}
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">Cover</figcaption>
            </figure>
            <figure className="overflow-hidden rounded-xl border border-border bg-muted">
              {stegoUrl ? (
                <img src={stegoUrl} alt="Stego" className="aspect-square w-full object-cover" />
              ) : (
                <div className="flex aspect-square items-center justify-center text-xs text-muted-foreground">
                  Stego
                </div>
              )}
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">Stego</figcaption>
            </figure>
          </div>
          {metrics ? (
            <>
              <MetricGrid metrics={metrics} />
              <p className="text-xs text-muted-foreground">
                Recovery {metrics.recovery ? "exact" : "failed"} · model ARES-Hybrid-INN
              </p>
              <Button variant="outline" onClick={download}>
                Download stego PNG
              </Button>
            </>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
