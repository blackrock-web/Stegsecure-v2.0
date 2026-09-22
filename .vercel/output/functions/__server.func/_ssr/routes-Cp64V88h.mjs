import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as cn, c as fileToImage, d as modelById, i as PageHeader, l as imageToDataUrl, s as encodeWithModel, t as AppShell, u as imageToPngBlob } from "./models-DP7ZHdwW.mjs";
import { n as Input, r as Label, t as Button } from "./label-Dd3Qn8-2.mjs";
import { t as useSession } from "./session-nFbBjc5C.mjs";
import { t as MetricGrid } from "./metric-grid-Dk-3Ic28.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cp64V88h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Module 01",
			title: "Encoder"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-8 max-w-2xl text-sm text-muted-foreground",
			children: "Hide a secret inside a cover image with ARES-Hybrid-INN (Hamming 7,3, ±1 matching, adaptive positions, residual compensation). Metrics are measured on the actual stego pixels — not training-proxy PSNR."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cover",
						children: "Cover image"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cover",
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						className: "mt-2",
						onChange: (e) => onFile(e.target.files?.[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: fileName || "PNG, JPEG, or WebP. Processed at max 512 px."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "secret",
						className: "mt-5 block",
						children: "Secret text"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "secret",
						className: "mt-2",
						value: secret,
						onChange: (e) => setSecret(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "pw",
						className: "mt-5 block",
						children: "Password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "pw",
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
						onClick: embed,
						children: busy ? "Embedding…" : "Embed with ARES-Hybrid-INN"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "overflow-hidden rounded-xl border border-border bg-muted",
						children: [coverUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: coverUrl,
							alt: "Cover",
							className: "aspect-square w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex aspect-square items-center justify-center text-xs text-muted-foreground",
							children: "Cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "px-3 py-2 text-xs text-muted-foreground",
							children: "Cover"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "overflow-hidden rounded-xl border border-border bg-muted",
						children: [stegoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: stegoUrl,
							alt: "Stego",
							className: "aspect-square w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex aspect-square items-center justify-center text-xs text-muted-foreground",
							children: "Stego"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "px-3 py-2 text-xs text-muted-foreground",
							children: "Stego"
						})]
					})]
				}), metrics ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricGrid, { metrics }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Recovery ",
							metrics.recovery ? "exact" : "failed",
							" · model ARES-Hybrid-INN"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: download,
						children: "Download stego PNG"
					})
				] }) : null]
			})]
		})
	] });
}
//#endregion
export { EncoderPage as component };
