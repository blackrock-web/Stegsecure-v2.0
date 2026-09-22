import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as PageHeader, r as MODELS, t as AppShell } from "./models-DP7ZHdwW.mjs";
import { t as useSession } from "./session-nFbBjc5C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/statistics-_MdClLV4.js
var import_jsx_runtime = require_jsx_runtime();
function chi2Sf(x, k) {
	if (x <= 0) return 1;
	const h = 2 / (9 * k);
	return .5 * erfc(((x / k) ** (1 / 3) - (1 - h)) / Math.sqrt(h) / Math.SQRT2);
}
function erfc(x) {
	const a1 = .254829592, a2 = -.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = .3275911;
	const sign = x < 0 ? -1 : 1;
	const t = 1 / (1 + p * Math.abs(x));
	return 1 - sign * (1 - (1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)));
}
/** Studentized range q_α,k for α=0.05 (Nemenyi), k = 2..10 */
var Q05 = [
	0,
	0,
	1.96,
	2.344,
	2.569,
	2.728,
	2.85,
	2.949,
	3.031,
	3.102,
	3.164
];
function ranksRow(values, higher = true) {
	const idx = values.map((v, i) => ({
		v,
		i
	}));
	idx.sort((a, b) => higher ? b.v - a.v : a.v - b.v);
	const ranks = new Array(values.length).fill(0);
	for (let i = 0; i < idx.length;) {
		let j = i;
		while (j < idx.length && idx[j].v === idx[i].v) j++;
		const avg = (i + 1 + j) / 2;
		for (let t = i; t < j; t++) ranks[idx[t].i] = avg;
		i = j;
	}
	return ranks;
}
function friedmanTest(table, higher = true) {
	const n = table.imageIds.length;
	const k = table.modelIds.length;
	if (n < 2 || k < 2) return {
		n,
		k,
		chi2: 0,
		df: Math.max(0, k - 1),
		pApprox: 1,
		kendallW: 0,
		avgRanks: table.modelIds.map(() => 0),
		nemenyiCD: 0,
		pairs: []
	};
	const rankSum = new Array(k).fill(0);
	for (let i = 0; i < n; i++) {
		const r = ranksRow(table.scores[i], higher);
		for (let j = 0; j < k; j++) rankSum[j] += r[j];
	}
	const avgRanks = rankSum.map((s) => s / n);
	let sumSq = 0;
	for (const R of rankSum) sumSq += R * R;
	const chi2 = 12 / (n * k * (k + 1)) * sumSq - 3 * n * (k + 1);
	const df = k - 1;
	const pApprox = chi2Sf(Math.max(0, chi2), df);
	const meanR = (k + 1) / 2;
	let s = 0;
	for (const r of avgRanks) s += (r - meanR) ** 2;
	const kendallW = 12 * n * n * s / (n * n * (k * k * k - k)) || 12 * s / (k * k * k - k);
	const nemenyiCD = (Q05[Math.min(10, k)] ?? 2.85) * Math.sqrt(k * (k + 1) / (6 * n));
	const pairs = [];
	for (let a = 0; a < k; a++) for (let b = a + 1; b < k; b++) {
		const diff = Math.abs(avgRanks[a] - avgRanks[b]);
		pairs.push({
			a: table.modelIds[a],
			b: table.modelIds[b],
			rankDiff: diff,
			significant: diff > nemenyiCD
		});
	}
	return {
		n,
		k,
		chi2,
		df,
		pApprox,
		kendallW,
		avgRanks,
		nemenyiCD,
		pairs
	};
}
function StatsPage() {
	const bench = useSession((s) => s.bench);
	const images = [...new Set(bench.map((r) => r.imageName))];
	const modelIds = MODELS.map((m) => m.id);
	const table = {
		modelIds,
		imageIds: images,
		scores: images.map((img) => modelIds.map((id) => {
			const row = bench.find((r) => r.imageName === img && r.modelId === id);
			if (!row || !row.metrics.recovery) return -1e9;
			return row.metrics.psnr;
		}))
	};
	const res = images.length >= 2 ? friedmanTest(table, true) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Module 04",
			title: "Statistics"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-8 max-w-2xl text-sm text-muted-foreground",
			children: "Friedman test, Kendall’s W, and Nemenyi post-hoc on per-image PSNR ranks from the Benchmark module. Failed recoveries are ranked last. Nothing is pre-filled."
		}),
		images.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground",
			children: [
				"Run a benchmark with at least two images first.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/benchmark",
					className: "text-primary underline",
					children: "Open Benchmark"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Images (N)",
							value: String(res.n)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Models (k)",
							value: String(res.k)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Friedman χ²",
							value: res.chi2.toFixed(3)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "df",
							value: String(res.df)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "p (approx.)",
							value: res.pApprox < 1e-4 ? "< 0.0001" : res.pApprox.toFixed(4)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Kendall’s W",
							value: res.kendallW.toFixed(3)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Nemenyi CD (α=0.05)",
							value: res.nemenyiCD.toFixed(3)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Effect",
							value: res.kendallW < .1 ? "small" : res.kendallW < .3 ? "moderate" : "strong"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl",
					children: "Average ranks (PSNR, 1 = best)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2",
								children: "Model"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2",
								children: "Mean rank"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: MODELS.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono tabular-nums",
								children: res.avgRanks[i].toFixed(3)
							})]
						}, m.id)) })]
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-display text-xl",
						children: "Nemenyi pairwise"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-3 text-xs text-muted-foreground",
						children: [
							"Significant if |rank difference| exceeds CD = ",
							res.nemenyiCD.toFixed(3),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[520px] text-left text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "A"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "B"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "|Δ rank|"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Significant"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: res.pairs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: MODELS.find((m) => m.id === p.a)?.short
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: MODELS.find((m) => m.id === p.b)?.short
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-mono",
										children: p.rankDiff.toFixed(3)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: p.significant ? "yes" : "no"
									})
								]
							}, p.a + p.b)) })]
						})
					})
				] })
			]
		})
	] });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-mono text-lg tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { StatsPage as component };
