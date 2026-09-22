import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as fileToImage, i as PageHeader, l as imageToDataUrl, o as decodeAres, t as AppShell } from "./models-DP7ZHdwW.mjs";
import { n as Input, r as Label, t as Button } from "./label-Dd3Qn8-2.mjs";
import { t as useSession } from "./session-nFbBjc5C.mjs";
import { t as MetricGrid } from "./metric-grid-Dk-3Ic28.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/decoder-DsKEbbMz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Module 02",
			title: "Decoder"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-8 max-w-2xl text-sm text-muted-foreground",
			children: "Recover the secret with the same ARES-Hybrid-INN pipeline and password. Quality metrics (PSNR, SSIM, MSE) need the original cover; without it, only recovery and decode time are reported."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Stego image" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						className: "mt-2",
						onChange: (e) => onStego(e.target.files?.[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mt-5 block",
						children: "Original cover (optional, for PSNR/SSIM)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						className: "mt-2",
						onChange: (e) => onCover(e.target.files?.[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mt-5 block",
						children: "Password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						className: "mt-2",
						value: password,
						onChange: (e) => setPassword(e.target.value)
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-destructive",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-6 w-full",
						disabled: busy,
						onClick: run,
						children: busy ? "Decoding…" : "Decode with ARES-Hybrid-INN"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
						className: "overflow-hidden rounded-xl border border-border bg-muted",
						children: stegoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: stegoUrl,
							alt: "Stego",
							className: "max-h-64 w-full object-contain"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-48 items-center justify-center text-xs text-muted-foreground",
							children: "No stego yet"
						})
					}),
					secret !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: "Recovered secret"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 whitespace-pre-wrap font-mono text-sm text-ink",
							children: secret
						})]
					}) : null,
					metrics ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricGrid, { metrics }) : null
				]
			})]
		})
	] });
}
//#endregion
export { DecoderPage as component };
