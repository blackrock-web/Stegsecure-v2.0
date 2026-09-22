import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as cn, c as fileToImage, i as PageHeader, n as METRIC_KEYS, r as MODELS, s as encodeWithModel, t as AppShell } from "./models-CvGz2qlJ.mjs";
import { n as Input, r as Label, t as Button } from "./label-BsMvJl4D.mjs";
import { t as useSession } from "./session-nFbBjc5C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/benchmark-BiAsecUs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/benchmark.tsx?tsr-split=component";
function BenchmarkPage() {
	const { bench, setBench, benchSecret, benchPassword, setBenchCreds } = useSession();
	const [files, setFiles] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	async function run() {
		if (!files.length) {
			setError("Upload one or more cover images.");
			return;
		}
		setBusy(true);
		setError(null);
		const rows = [];
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
							recovered: out.recovered
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
								distortion: 1e9
							},
							recovered: "",
							error: e instanceof Error ? e.message : "failed"
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
	const images = (0, import_react.useMemo)(() => [...new Set(bench.map((r) => r.imageName))], [bench]);
	function winnerFor(imageName) {
		const group = bench.filter((r) => r.imageName === imageName && r.metrics.recovery);
		if (!group.length) return null;
		return group.reduce((a, b) => a.metrics.psnr >= b.metrics.psnr ? a : b);
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			kicker: "Module 03",
			title: "Benchmark"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 80,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "mb-8 max-w-2xl text-sm text-muted-foreground",
			children: "Same secret, password, and cover for all six models. Paper entries are algorithm reproductions (weights were never published). Winner per image is the highest PSNR among exact recoveries only."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 81,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "mb-8 rounded-xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Cover images" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 90,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								type: "file",
								multiple: true,
								accept: "image/png,image/jpeg,image/webp",
								className: "mt-2",
								onChange: (e) => setFiles(Array.from(e.target.files ?? []))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 91,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [files.length, " selected"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 92,
								columnNumber: 13
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 89,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Secret" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 95,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							className: "mt-2",
							value: benchSecret,
							onChange: (e) => setBenchCreds(e.target.value, benchPassword)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 96,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 94,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Password" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 99,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							type: "password",
							className: "mt-2",
							value: benchPassword,
							onChange: (e) => setBenchCreds(benchSecret, e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 100,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 98,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 88,
					columnNumber: 9
				}, this),
				error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-3 text-sm text-destructive",
					children: error
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 103,
					columnNumber: 18
				}, this) : null,
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					className: "mt-5",
					disabled: busy,
					onClick: run,
					children: busy ? progress || "Running…" : "Run six-model comparison"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 104,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 87,
			columnNumber: 7
		}, this),
		images.map((name) => {
			const winner = winnerFor(name);
			return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "mb-10",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-3 flex flex-wrap items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-display text-xl",
						children: name
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 113,
						columnNumber: 15
					}, this), winner ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-primary",
						children: [
							"Best PSNR (exact recovery):",
							" ",
							MODELS.find((m) => m.id === winner.modelId)?.name,
							" ·",
							" ",
							winner.metrics.psnr.toFixed(2),
							" dB"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 114,
						columnNumber: 25
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-destructive",
						children: "No exact recovery"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 118,
						columnNumber: 24
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 112,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "overflow-x-auto rounded-xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
						className: "w-full min-w-[720px] text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
							className: "bg-muted text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "px-3 py-2 font-medium",
								children: "Model"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 124,
								columnNumber: 21
							}, this), METRIC_KEYS.map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "px-3 py-2 font-medium",
								children: m.label
							}, m.key, false, {
								fileName: _jsxFileName,
								lineNumber: 125,
								columnNumber: 43
							}, this))] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 123,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: MODELS.map((model) => {
							const row = bench.find((r) => r.imageName === name && r.modelId === model.id);
							const isWin = winner?.modelId === model.id;
							if (!row) return null;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
								className: cn("border-t border-border", isWin && "bg-primary/8", !row.metrics.recovery && "opacity-50"),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									className: "px-3 py-2 font-medium text-ink",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: model.short }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 137,
											columnNumber: 27
										}, this),
										" ",
										model.status === "REPRODUCED" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "repro"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 138,
											columnNumber: 60
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] text-primary",
											children: "trained"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 138,
											columnNumber: 127
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 136,
									columnNumber: 25
								}, this), METRIC_KEYS.map((m) => {
									const v = row.metrics[m.key];
									let text = "—";
									if (typeof v === "boolean") text = v ? "true" : "false";
									else if (typeof v === "number") text = m.key === "mse" || m.key === "distortion" ? v.toExponential(2) : v.toFixed(m.key === "psnr" ? 2 : 3);
									return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										className: "px-3 py-2 font-mono tabular-nums",
										children: text
									}, m.key, false, {
										fileName: _jsxFileName,
										lineNumber: 146,
										columnNumber: 28
									}, this);
								})]
							}, model.id, true, {
								fileName: _jsxFileName,
								lineNumber: 135,
								columnNumber: 24
							}, this);
						}) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 121,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 120,
					columnNumber: 13
				}, this)]
			}, name, true, {
				fileName: _jsxFileName,
				lineNumber: 111,
				columnNumber: 14
			}, this);
		})
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 79,
		columnNumber: 10
	}, this);
}
//#endregion
export { BenchmarkPage as component };
