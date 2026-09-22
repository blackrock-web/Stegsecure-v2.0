import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as PageHeader, r as MODELS, t as AppShell } from "./models-DP7ZHdwW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/models-XZP3QQM9.js
var import_jsx_runtime = require_jsx_runtime();
function ModelsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Module 05",
			title: "Models"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-8 max-w-2xl text-sm text-muted-foreground",
			children: "Five paper methods plus ARES-Hybrid-INN. Original deep weights from the papers were not released; those five run as the same reproductions used in the ARES research repo."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: MODELS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: m.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] uppercase tracking-wide text-muted-foreground",
							children: m.status
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: m.paper
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-fg",
						children: m.note
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 font-mono text-[11px] text-muted-foreground",
						children: [
							"method=",
							m.methodKey,
							m.usesHamming ? " · Hamming(7,3)" : " · LSB",
							m.usesAdaptive ? " · adaptive" : "",
							m.usesCompensate ? " · residual" : ""
						]
					})
				]
			}, m.id))
		})
	] });
}
//#endregion
export { ModelsPage as component };
