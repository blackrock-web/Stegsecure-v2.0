import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as PageHeader, r as MODELS, t as AppShell } from "./models-CvGz2qlJ.mjs";
import { t as useSession } from "./session-nFbBjc5C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/statistics-BdeQ8h3s.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
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
var _jsxFileName = "/app/applet/src/routes/statistics.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			kicker: "Module 04",
			title: "Statistics"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 21,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "mb-8 max-w-2xl text-sm text-muted-foreground",
			children: "Friedman test, Kendall’s W, and Nemenyi post-hoc on per-image PSNR ranks from the Benchmark module. Failed recoveries are ranked last. Nothing is pre-filled."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 22,
			columnNumber: 7
		}, this),
		images.length < 2 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground",
			children: [
				"Run a benchmark with at least two images first.",
				" ",
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/benchmark",
					className: "text-primary underline",
					children: "Open Benchmark"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 29,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 27,
			columnNumber: 28
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "grid gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Images (N)",
							value: String(res.n)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 34,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Models (k)",
							value: String(res.k)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 35,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Friedman χ²",
							value: res.chi2.toFixed(3)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 36,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "df",
							value: String(res.df)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 37,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "p (approx.)",
							value: res.pApprox < 1e-4 ? "< 0.0001" : res.pApprox.toFixed(4)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 38,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Kendall’s W",
							value: res.kendallW.toFixed(3)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 39,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Nemenyi CD (α=0.05)",
							value: res.nemenyiCD.toFixed(3)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 40,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
							label: "Effect",
							value: res.kendallW < .1 ? "small" : res.kendallW < .3 ? "moderate" : "strong"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 41,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 33,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mb-3 font-display text-xl",
					children: "Average ranks (PSNR, 1 = best)"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 45,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "overflow-x-auto rounded-xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
							className: "bg-muted text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "px-3 py-2",
								children: "Model"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 50,
								columnNumber: 21
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "px-3 py-2",
								children: "Mean rank"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 51,
								columnNumber: 21
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 49,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 48,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: MODELS.map((m, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
							className: "border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "px-3 py-2",
								children: m.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 56,
								columnNumber: 23
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "px-3 py-2 font-mono tabular-nums",
								children: res.avgRanks[i].toFixed(3)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 57,
								columnNumber: 23
							}, this)]
						}, m.id, true, {
							fileName: _jsxFileName,
							lineNumber: 55,
							columnNumber: 41
						}, this)) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 54,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 47,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 46,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 44,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "mb-3 font-display text-xl",
						children: "Nemenyi pairwise"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 67,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mb-3 text-xs text-muted-foreground",
						children: [
							"Significant if |rank difference| exceeds CD = ",
							res.nemenyiCD.toFixed(3),
							"."
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 68,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "overflow-x-auto rounded-xl border border-border",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
							className: "w-full min-w-[520px] text-left text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
								className: "bg-muted text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2",
										children: "A"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 75,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2",
										children: "B"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 76,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2",
										children: "|Δ rank|"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 77,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-3 py-2",
										children: "Significant"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 78,
										columnNumber: 21
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 74,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 73,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: res.pairs.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2",
										children: MODELS.find((m) => m.id === p.a)?.short
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 83,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2",
										children: MODELS.find((m) => m.id === p.b)?.short
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 84,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2 font-mono",
										children: p.rankDiff.toFixed(3)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 85,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2",
										children: p.significant ? "yes" : "no"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 86,
										columnNumber: 23
									}, this)
								]
							}, p.a + p.b, true, {
								fileName: _jsxFileName,
								lineNumber: 82,
								columnNumber: 40
							}, this)) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 81,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 72,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 13
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 32,
			columnNumber: 18
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 20,
		columnNumber: 10
	}, this);
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-lg border border-border bg-card px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-[11px] uppercase tracking-wide text-muted-foreground",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 103,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "mt-1 font-mono text-lg tabular-nums",
			children: value
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 104,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 102,
		columnNumber: 10
	}, this);
}
//#endregion
export { StatsPage as component };
