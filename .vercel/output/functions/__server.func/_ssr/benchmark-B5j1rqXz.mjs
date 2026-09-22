import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as cn, c as fileToImage, i as PageHeader, n as METRIC_KEYS, r as MODELS, s as encodeWithModel, t as AppShell } from "./models-DP7ZHdwW.mjs";
import { n as Input, r as Label, t as Button } from "./label-Dd3Qn8-2.mjs";
import { t as useSession } from "./session-nFbBjc5C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/benchmark-B5j1rqXz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Module 03",
			title: "Benchmark"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-8 max-w-2xl text-sm text-muted-foreground",
			children: "Same secret, password, and cover for all six models. Paper entries are algorithm reproductions (weights were never published). Winner per image is the highest PSNR among exact recoveries only."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8 rounded-xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cover images" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "file",
								multiple: true,
								accept: "image/png,image/jpeg,image/webp",
								className: "mt-2",
								onChange: (e) => setFiles(Array.from(e.target.files ?? []))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [files.length, " selected"]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Secret" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-2",
							value: benchSecret,
							onChange: (e) => setBenchCreds(e.target.value, benchPassword)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							className: "mt-2",
							value: benchPassword,
							onChange: (e) => setBenchCreds(benchSecret, e.target.value)
						})] })
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-destructive",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5",
					disabled: busy,
					onClick: run,
					children: busy ? progress || "Running…" : "Run six-model comparison"
				})
			]
		}),
		images.map((name) => {
			const winner = winnerFor(name);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: name
					}), winner ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
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
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: "No exact recovery"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[720px] text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Model"
							}), METRIC_KEYS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: m.label
							}, m.key))] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: MODELS.map((model) => {
							const row = bench.find((r) => r.imageName === name && r.modelId === model.id);
							const isWin = winner?.modelId === model.id;
							if (!row) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: cn("border-t border-border", isWin && "bg-primary/8", !row.metrics.recovery && "opacity-50"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 font-medium text-ink",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: model.short }),
										" ",
										model.status === "REPRODUCED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "repro"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-primary",
											children: "trained"
										})
									]
								}), METRIC_KEYS.map((m) => {
									const v = row.metrics[m.key];
									let text = "—";
									if (typeof v === "boolean") text = v ? "true" : "false";
									else if (typeof v === "number") text = m.key === "mse" || m.key === "distortion" ? v.toExponential(2) : v.toFixed(m.key === "psnr" ? 2 : 3);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-mono tabular-nums",
										children: text
									}, m.key);
								})]
							}, model.id);
						}) })]
					})
				})]
			}, name);
		})
	] });
}
//#endregion
export { BenchmarkPage as component };
