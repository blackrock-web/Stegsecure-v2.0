import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as METRIC_KEYS } from "./models-DP7ZHdwW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/metric-grid-Dk-3Ic28.js
var import_jsx_runtime = require_jsx_runtime();
function fmt(key, v) {
	if (typeof v === "boolean") return v ? "true" : "false";
	if (typeof v !== "number" || Number.isNaN(v)) return "—";
	if (key === "psnr" || key === "encodeMs" || key === "decodeMs") return v.toFixed(2);
	if (key === "ssim" || key === "bpp" || key === "ber") return v.toFixed(4);
	if (key === "mse" || key === "distortion") return v.toExponential(3);
	if (key === "lsbChangePct") return v.toFixed(3);
	return String(Math.round(v));
}
function MetricGrid({ metrics }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 sm:grid-cols-5",
		children: METRIC_KEYS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-card px-3 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-wide text-muted-foreground",
				children: m.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-sm tabular-nums text-ink",
				children: fmt(m.key, metrics[m.key])
			})]
		}, m.key))
	});
}
//#endregion
export { MetricGrid as t };
