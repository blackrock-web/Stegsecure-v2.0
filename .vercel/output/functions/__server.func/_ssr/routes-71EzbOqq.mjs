import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as cn, c as fileToImage, d as modelById, i as PageHeader, l as imageToDataUrl, s as encodeWithModel, t as AppShell, u as imageToPngBlob } from "./models-CvGz2qlJ.mjs";
import { n as Input, r as Label, t as Button } from "./label-BsMvJl4D.mjs";
import { t as useSession } from "./session-nFbBjc5C.mjs";
import { t as MetricGrid } from "./metric-grid-CLexrtkX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-71EzbOqq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/ui/textarea.tsx";
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
		className: cn("flex min-h-28 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 6,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
function EncoderPage() {
	const setEncode = useSession((s) => s.setEncode);
	const last = useSession();
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [secret, setSecret] = (0, import_react.useState)("ARES research secret");
	const [password, setPassword] = (0, import_react.useState)("lab-passphrase");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [coverUrl, setCoverUrl] = (0, import_react.useState)(last.lastCoverUrl ?? "");
	const [stegoUrl, setStegoUrl] = (0, import_react.useState)(last.lastStegoUrl ?? "");
	async function onFile(f) {
		if (!f) return;
		setFileName(f.name);
		setError(null);
		try {
			const img = await fileToImage(f, 512);
			setCoverUrl(imageToDataUrl(img));
			useSession.setState({
				lastCover: img,
				lastCoverUrl: imageToDataUrl(img)
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not read image");
		}
	}
	async function embed() {
		const cover = useSession.getState().lastCover;
		if (!cover) {
			setError("Upload a cover image first.");
			return;
		}
		if (!secret.trim() || !password) {
			setError("Secret text and password are required.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const model = modelById("ares_hybrid_inn");
			const out = await encodeWithModel(model, cover, secret.trim(), password);
			const url = imageToDataUrl(out.stego);
			setStegoUrl(url);
			setEncode({
				cover,
				stego: out.stego,
				coverUrl: coverUrl || imageToDataUrl(cover),
				stegoUrl: url,
				secret: secret.trim(),
				password,
				metrics: out.metrics,
				model
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "Embed failed");
		} finally {
			setBusy(false);
		}
	}
	async function download() {
		const stego = useSession.getState().lastStego;
		if (!stego) return;
		const blob = await imageToPngBlob(stego);
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "ares-stego.png";
		a.click();
		URL.revokeObjectURL(a.href);
	}
	const metrics = useSession((s) => s.lastMetrics);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			kicker: "Module 01",
			title: "Encoder"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 81,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "mb-8 max-w-2xl text-sm text-muted-foreground",
			children: "Hide a secret inside a cover image with ARES-Hybrid-INN (Hamming 7,3, ±1 matching, adaptive positions, residual compensation). Metrics are measured on the actual stego pixels — not training-proxy PSNR."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 82,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
						htmlFor: "cover",
						children: "Cover image"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 90,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						id: "cover",
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						className: "mt-2",
						onChange: (e) => onFile(e.target.files?.[0])
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 91,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: fileName || "PNG, JPEG, or WebP. Processed at max 512 px."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 92,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
						htmlFor: "secret",
						className: "mt-5 block",
						children: "Secret text"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 96,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
						id: "secret",
						className: "mt-2",
						value: secret,
						onChange: (e) => setSecret(e.target.value)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 99,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
						htmlFor: "pw",
						className: "mt-5 block",
						children: "Password"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 101,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						id: "pw",
						type: "password",
						className: "mt-2",
						value: password,
						onChange: (e) => setPassword(e.target.value)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 104,
						columnNumber: 11
					}, this),
					error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-4 text-sm text-destructive",
						children: error
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 106,
						columnNumber: 20
					}, this) : null,
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						className: "mt-6 w-full",
						disabled: busy,
						onClick: embed,
						children: busy ? "Embedding…" : "Embed with ARES-Hybrid-INN"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 108,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 89,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("figure", {
						className: "overflow-hidden rounded-xl border border-border bg-muted",
						children: [coverUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
							src: coverUrl,
							alt: "Cover",
							className: "aspect-square w-full object-cover"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 116,
							columnNumber: 27
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex aspect-square items-center justify-center text-xs text-muted-foreground",
							children: "Cover"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 116,
							columnNumber: 110
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("figcaption", {
							className: "px-3 py-2 text-xs text-muted-foreground",
							children: "Cover"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 119,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 115,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("figure", {
						className: "overflow-hidden rounded-xl border border-border bg-muted",
						children: [stegoUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
							src: stegoUrl,
							alt: "Stego",
							className: "aspect-square w-full object-cover"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 27
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex aspect-square items-center justify-center text-xs text-muted-foreground",
							children: "Stego"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 110
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("figcaption", {
							className: "px-3 py-2 text-xs text-muted-foreground",
							children: "Stego"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 121,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 114,
					columnNumber: 11
				}, this), metrics ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MetricGrid, { metrics }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Recovery ",
							metrics.recovery ? "exact" : "failed",
							" · model ARES-Hybrid-INN"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 130,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						onClick: download,
						children: "Download stego PNG"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 133,
						columnNumber: 15
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 128,
					columnNumber: 22
				}, this) : null]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 113,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 88,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 80,
		columnNumber: 10
	}, this);
}
//#endregion
export { EncoderPage as component };
