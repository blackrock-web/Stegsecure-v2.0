import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as METRIC_KEYS } from "./models-CvGz2qlJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/metric-grid-CLexrtkX.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/components/metric-grid.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid grid-cols-2 gap-3 sm:grid-cols-5",
		children: METRIC_KEYS.map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "rounded-lg border border-border bg-card px-3 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-[11px] uppercase tracking-wide text-muted-foreground",
				children: m.label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 21,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-1 font-mono text-sm tabular-nums text-ink",
				children: fmt(m.key, metrics[m.key])
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 22,
				columnNumber: 11
			}, this)]
		}, m.key, true, {
			fileName: _jsxFileName,
			lineNumber: 17,
			columnNumber: 9
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 15,
		columnNumber: 5
	}, this);
}
//#endregion
export { MetricGrid as t };
