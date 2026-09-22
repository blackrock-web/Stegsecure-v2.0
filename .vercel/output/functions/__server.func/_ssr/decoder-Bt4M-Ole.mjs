import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { c as fileToImage, i as PageHeader, l as imageToDataUrl, o as decodeAres, t as AppShell } from "./models-CvGz2qlJ.mjs";
import { n as Input, r as Label, t as Button } from "./label-BsMvJl4D.mjs";
import { t as useSession } from "./session-nFbBjc5C.mjs";
import { t as MetricGrid } from "./metric-grid-CLexrtkX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/decoder-Bt4M-Ole.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/decoder.tsx?tsr-split=component";
function DecoderPage() {
	const last = useSession();
	const [password, setPassword] = (0, import_react.useState)(last.lastPassword ?? "lab-passphrase");
	const [stego, setStego] = (0, import_react.useState)(last.lastStego);
	const [cover, setCover] = (0, import_react.useState)(last.lastCover);
	const [stegoUrl, setStegoUrl] = (0, import_react.useState)(last.lastStegoUrl ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [secret, setSecret] = (0, import_react.useState)(null);
	const [metrics, setMetrics] = (0, import_react.useState)(last.lastMetrics ?? null);
	async function onStego(f) {
		if (!f) return;
		const img = await fileToImage(f, 512);
		setStego(img);
		setStegoUrl(imageToDataUrl(img));
		setSecret(null);
	}
	async function onCover(f) {
		if (!f) return;
		setCover(await fileToImage(f, 512));
	}
	async function run() {
		if (!stego) {
			setError("Upload a stego image.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const out = await decodeAres(stego, password, cover, last.lastSecret);
			setSecret(out.secret);
			setMetrics(out.metrics);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Decode failed");
			setSecret(null);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			kicker: "Module 02",
			title: "Decoder"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 50,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "mb-8 max-w-2xl text-sm text-muted-foreground",
			children: "Recover the secret with the same ARES-Hybrid-INN pipeline and password. Quality metrics (PSNR, SSIM, MSE) need the original cover; without it, only recovery and decode time are reported."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 51,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-8 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Stego image" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 59,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						className: "mt-2",
						onChange: (e) => onStego(e.target.files?.[0])
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 60,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
						className: "mt-5 block",
						children: "Original cover (optional, for PSNR/SSIM)"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 61,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						className: "mt-2",
						onChange: (e) => onCover(e.target.files?.[0])
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
						className: "mt-5 block",
						children: "Password"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 63,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "password",
						className: "mt-2",
						value: password,
						onChange: (e) => setPassword(e.target.value)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 64,
						columnNumber: 11
					}, this),
					error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-4 text-sm text-destructive",
						children: error
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 65,
						columnNumber: 20
					}, this) : null,
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						className: "mt-6 w-full",
						disabled: busy,
						onClick: run,
						children: busy ? "Decoding…" : "Decode with ARES-Hybrid-INN"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 66,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 58,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("figure", {
						className: "overflow-hidden rounded-xl border border-border bg-muted",
						children: stegoUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
							src: stegoUrl,
							alt: "Stego",
							className: "max-h-64 w-full object-contain"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 73,
							columnNumber: 25
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex h-48 items-center justify-center text-xs text-muted-foreground",
							children: "No stego yet"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 73,
							columnNumber: 105
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 72,
						columnNumber: 11
					}, this),
					secret !== null ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: "Recovered secret"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 78,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-2 whitespace-pre-wrap font-mono text-sm text-ink",
							children: secret
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 79,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 77,
						columnNumber: 30
					}, this) : null,
					metrics ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MetricGrid, { metrics }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 81,
						columnNumber: 22
					}, this) : null
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 71,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 57,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 49,
		columnNumber: 10
	}, this);
}
//#endregion
export { DecoderPage as component };
