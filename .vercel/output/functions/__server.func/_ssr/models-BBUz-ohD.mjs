import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as PageHeader, r as MODELS, t as AppShell } from "./models-CvGz2qlJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/models-BBUz-ohD.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/models.tsx?tsr-split=component";
function ModelsPage() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			kicker: "Module 05",
			title: "Models"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 5,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "mb-8 max-w-2xl text-sm text-muted-foreground",
			children: "Five paper methods plus ARES-Hybrid-INN. Original deep weights from the papers were not released; those five run as the same reproductions used in the ARES research repo."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 6,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: MODELS.map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-display text-xl",
							children: m.name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 13,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[11px] uppercase tracking-wide text-muted-foreground",
							children: m.status
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 14,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 12,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: m.paper
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 18,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-3 text-sm leading-relaxed text-fg",
						children: m.note
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 19,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-3 font-mono text-[11px] text-muted-foreground",
						children: [
							"method=",
							m.methodKey,
							m.usesHamming ? " · Hamming(7,3)" : " · LSB",
							m.usesAdaptive ? " · adaptive" : "",
							m.usesCompensate ? " · residual" : ""
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 20,
						columnNumber: 13
					}, this)
				]
			}, m.id, true, {
				fileName: _jsxFileName,
				lineNumber: 11,
				columnNumber: 26
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 10,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 4,
		columnNumber: 10
	}, this);
}
//#endregion
export { ModelsPage as component };
