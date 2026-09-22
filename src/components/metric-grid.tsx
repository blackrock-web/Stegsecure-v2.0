import { METRIC_KEYS, type QualityMetrics } from "@/lib/stego/metrics";

function fmt(key: keyof QualityMetrics, v: QualityMetrics[keyof QualityMetrics]) {
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  if (key === "psnr" || key === "encodeMs" || key === "decodeMs") return v.toFixed(2);
  if (key === "ssim" || key === "bpp" || key === "ber") return v.toFixed(4);
  if (key === "mse" || key === "distortion") return v.toExponential(3);
  if (key === "lsbChangePct") return v.toFixed(3);
  return String(Math.round(v));
}

export function MetricGrid({ metrics }: { metrics: QualityMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {METRIC_KEYS.map((m) => (
        <div
          key={m.key}
          className="rounded-lg border border-border bg-card px-3 py-3"
        >
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{m.label}</p>
          <p className="mt-1 font-mono text-sm tabular-nums text-ink">
            {fmt(m.key, metrics[m.key])}
          </p>
        </div>
      ))}
    </div>
  );
}
