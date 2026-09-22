import { useId } from "react";
import { MODELS } from "@/lib/stego/models";

export type CDDiagramProps = {
  modelIds: string[];
  avgRanks: number[];
  cd: number;
  cliques: string[][];
  k: number;
  metricLabel?: string;
  higherIsBetter?: boolean;
};

export function CDDiagram({
  modelIds,
  avgRanks,
  cd,
  cliques,
  k,
  metricLabel = "PSNR",
  higherIsBetter = true,
}: CDDiagramProps) {
  const gradientId = useId();

  // Sort models by average rank ascending (1 = best)
  const sorted = modelIds
    .map((id, index) => {
      const def = MODELS.find((m) => m.id === id);
      return {
        id,
        name: def?.short || id,
        fullName: def?.name || id,
        isAres: id === "ares_hybrid_inn",
        rank: avgRanks[index] ?? 0,
      };
    })
    .sort((a, b) => a.rank - b.rank);

  // SVG dimensions & margins
  const width = 760;
  const height = 260;
  const paddingX = 60;
  const axisY = 90;
  const plotWidth = width - 2 * paddingX;

  // Coordinate mapper from rank (1..k) to X pixel
  const rankToX = (r: number) => {
    if (k <= 1) return paddingX + plotWidth / 2;
    const clamped = Math.max(1, Math.min(k, r));
    return paddingX + ((clamped - 1) / (k - 1)) * plotWidth;
  };

  const cdPixelWidth = (cd / (k - 1)) * plotWidth;

  // Split models into left (best ranks) and right (worst ranks) for clean callout lines
  const half = Math.ceil(sorted.length / 2);
  const leftModels = sorted.slice(0, half);
  const rightModels = sorted.slice(half);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">Demšar Critical Difference (CD) Diagram</span>
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
            {higherIsBetter ? "1 = Highest" : "1 = Lowest"} {metricLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            <span>ARES (Proposed)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground" />
            <span>Reproduction Baselines</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1 w-4 rounded-full bg-emerald-500" />
            <span>Not Statistically Different (Clique)</span>
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full select-none"
        style={{ minWidth: 640 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* CD ruler marker at the top */}
        <g transform="translate(60, 25)">
          {/* CD horizontal bar */}
          <line
            x1="0"
            y1="0"
            x2={cdPixelWidth}
            y2="0"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-foreground"
          />
          {/* Left / Right Endcaps */}
          <line
            x1="0"
            y1="-5"
            x2="0"
            y2="5"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-foreground"
          />
          <line
            x1={cdPixelWidth}
            y1="-5"
            x2={cdPixelWidth}
            y2="5"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-foreground"
          />
          {/* Label */}
          <text
            x={cdPixelWidth / 2}
            y="-8"
            textAnchor="middle"
            className="fill-foreground text-[11px] font-mono font-medium"
          >
            CD = {cd.toFixed(3)}
          </text>
        </g>

        {/* Main horizontal ranking axis */}
        <line
          x1={paddingX}
          y1={axisY}
          x2={width - paddingX}
          y2={axisY}
          stroke="currentColor"
          strokeWidth="2"
          className="text-border"
        />

        {/* Rank ticks and labels (1..k) */}
        {Array.from({ length: k }, (_, i) => i + 1).map((rank) => {
          const x = rankToX(rank);
          return (
            <g key={rank} transform={`translate(${x}, ${axisY})`}>
              <line y1="-5" y2="5" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" />
              <text
                y="18"
                textAnchor="middle"
                className="fill-muted-foreground text-[11px] font-mono font-semibold"
              >
                {rank}
              </text>
            </g>
          );
        })}

        {/* Axis Direction Indicators */}
        <text
          x={paddingX}
          y={axisY - 12}
          textAnchor="start"
          className="fill-primary text-[10px] font-mono font-semibold uppercase tracking-wider"
        >
          ← Superior Performance (Rank 1)
        </text>
        <text
          x={width - paddingX}
          y={axisY - 12}
          textAnchor="end"
          className="fill-muted-foreground text-[10px] font-mono uppercase tracking-wider"
        >
          Inferior Performance (Rank {k}) →
        </text>

        {/* Left Models (plotted below axis) */}
        {leftModels.map((m, idx) => {
          const x = rankToX(m.rank);
          const textY = 145 + idx * 24;
          return (
            <g key={m.id}>
              {/* Point on axis */}
              <circle
                cx={x}
                cy={axisY}
                r={m.isAres ? "5.5" : "4"}
                className={m.isAres ? "fill-primary stroke-background stroke-2" : "fill-foreground"}
              />
              {/* Connector line */}
              <path
                d={`M ${x} ${axisY} L ${x} ${textY - 4} L ${paddingX - 10} ${textY - 4}`}
                fill="none"
                stroke={m.isAres ? "#2563eb" : "currentColor"}
                strokeWidth={m.isAres ? "1.8" : "1"}
                strokeDasharray={m.isAres ? undefined : "3 3"}
                className={m.isAres ? "text-primary" : "text-border"}
              />
              {/* Text label */}
              <text
                x={paddingX - 14}
                y={textY}
                textAnchor="end"
                className={m.isAres ? "fill-primary font-bold text-[12px]" : "fill-foreground text-[11px]"}
              >
                {m.name} ({m.rank.toFixed(2)})
              </text>
            </g>
          );
        })}

        {/* Right Models (plotted below axis) */}
        {rightModels.map((m, idx) => {
          const x = rankToX(m.rank);
          const textY = 145 + idx * 24;
          return (
            <g key={m.id}>
              {/* Point on axis */}
              <circle
                cx={x}
                cy={axisY}
                r={m.isAres ? "5.5" : "4"}
                className={m.isAres ? "fill-primary stroke-background stroke-2" : "fill-muted-foreground"}
              />
              {/* Connector line */}
              <path
                d={`M ${x} ${axisY} L ${x} ${textY - 4} L ${width - paddingX + 10} ${textY - 4}`}
                fill="none"
                stroke={m.isAres ? "#2563eb" : "currentColor"}
                strokeWidth={m.isAres ? "1.8" : "1"}
                strokeDasharray={m.isAres ? undefined : "3 3"}
                className={m.isAres ? "text-primary" : "text-border"}
              />
              {/* Text label */}
              <text
                x={width - paddingX + 14}
                y={textY}
                textAnchor="start"
                className={m.isAres ? "fill-primary font-bold text-[12px]" : "fill-muted-foreground text-[11px]"}
              >
                {m.name} ({m.rank.toFixed(2)})
              </text>
            </g>
          );
        })}

        {/* Clique connection bars (models not significantly different) */}
        {cliques.map((clique, cIdx) => {
          if (clique.length < 2) return null;
          const ranks = clique.map((id) => {
            const m = sorted.find((s) => s.id === id);
            return m ? m.rank : 1;
          });
          const minRank = Math.min(...ranks);
          const maxRank = Math.max(...ranks);
          const x1 = rankToX(minRank);
          const x2 = rankToX(maxRank);
          const barY = axisY - 26 - cIdx * 12;

          return (
            <g key={cIdx}>
              <line
                x1={x1}
                y1={barY}
                x2={x2}
                y2={barY}
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Vertical tick at extremities */}
              <line x1={x1} y1={barY - 3} x2={x1} y2={barY + 3} stroke="#10b981" strokeWidth="2" />
              <line x1={x2} y1={barY - 3} x2={x2} y2={barY + 3} stroke="#10b981" strokeWidth="2" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
