import { b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ChartColumn, i as FileSearch, n as LockKeyhole, o as Binary, r as LayoutGrid } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/models-CvGz2qlJ.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var _jsxFileName = "/app/applet/src/components/app-shell.tsx";
var NAV = [
	{
		to: "/",
		label: "Encoder",
		icon: LockKeyhole
	},
	{
		to: "/decoder",
		label: "Decoder",
		icon: FileSearch
	},
	{
		to: "/benchmark",
		label: "Benchmark",
		icon: LayoutGrid
	},
	{
		to: "/statistics",
		label: "Statistics",
		icon: ChartColumn
	},
	{
		to: "/models",
		label: "Models",
		icon: Binary
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto flex min-h-dvh max-w-[1400px]",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
				className: "sticky top-0 flex h-dvh w-[220px] shrink-0 flex-col border-r border-border bg-sidebar max-md:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "px-5 pb-6 pt-7",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-display text-xl leading-tight text-ink",
							children: "ARES"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 22,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Stego Lab"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 23,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 21,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
						className: "flex flex-1 flex-col gap-1 px-3",
						children: NAV.map((item) => {
							const active = pathname === item.to;
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: item.to,
								className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-[var(--motion-quick)]", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-fg"),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, {
									className: "size-4",
									strokeWidth: 1.75
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 40,
									columnNumber: 19
								}, this), item.label]
							}, item.to, true, {
								fileName: _jsxFileName,
								lineNumber: 30,
								columnNumber: 17
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 25,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "px-5 py-5 text-[11px] leading-relaxed text-muted-foreground",
						children: "Light workbench. Measured metrics only. Paper nets without public weights are labeled reproductions."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 46,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 20,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
					className: "flex gap-1 overflow-x-auto border-b border-border bg-sidebar px-2 py-2 md:hidden",
					children: NAV.map((item) => {
						const active = pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: item.to,
							className: cn("h-10 shrink-0 rounded-md px-3 text-sm leading-10", active ? "bg-primary text-primary-foreground" : "text-muted-foreground"),
							children: item.label
						}, item.to, false, {
							fileName: _jsxFileName,
							lineNumber: 57,
							columnNumber: 17
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
					className: "flex-1 px-4 py-6 md:px-10 md:py-9",
					children
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 70,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 52,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 19,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 18,
		columnNumber: 5
	}, this);
}
function PageHeader({ title, kicker }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
		className: "mb-8",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground",
			children: kicker
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 80,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
			className: "mt-2 font-display text-3xl font-medium text-ink md:text-4xl",
			children: title
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 83,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 79,
		columnNumber: 5
	}, this);
}
/** SHA-256 + PRNG helpers for keyed embedding. */
async function sha256Bytes(data) {
	const buf = typeof data === "string" ? new TextEncoder().encode(data) : data;
	const digest = await crypto.subtle.digest("SHA-256", buf);
	return new Uint8Array(digest);
}
function u32FromBytes(b, offset = 0) {
	return ((b[offset] ?? 0) << 24 | (b[offset + 1] ?? 0) << 16 | (b[offset + 2] ?? 0) << 8 | (b[offset + 3] ?? 0)) >>> 0;
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return function next() {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
async function keyedShuffle(items, key) {
	const rng = mulberry32(u32FromBytes(await sha256Bytes(key)));
	const out = items.slice();
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const tmp = out[i];
		out[i] = out[j];
		out[j] = tmp;
	}
	return out;
}
async function keystream(password, length) {
	const out = new Uint8Array(length);
	let filled = 0;
	let counter = 0;
	while (filled < length) {
		const block = await sha256Bytes(`${password}|ks|${counter}`);
		const n = Math.min(32, length - filled);
		out.set(block.subarray(0, n), filled);
		filled += n;
		counter += 1;
	}
	return out;
}
function cloneImage(img) {
	return {
		width: img.width,
		height: img.height,
		data: new Uint8ClampedArray(img.data)
	};
}
function setChannel(img, x, y, ch, v) {
	const i = (y * img.width + x) * 4 + ch;
	img.data[i] = Math.max(0, Math.min(255, v | 0));
}
function getChannel(img, x, y, ch) {
	return img.data[(y * img.width + x) * 4 + ch];
}
async function fileToImage(file, maxSide = 512) {
	const bmp = await createImageBitmap(file);
	const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
	const w = Math.max(32, Math.round(bmp.width * scale));
	const h = Math.max(32, Math.round(bmp.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) throw new Error("Canvas 2D unavailable");
	ctx.drawImage(bmp, 0, 0, w, h);
	bmp.close();
	return {
		width: w,
		height: h,
		data: ctx.getImageData(0, 0, w, h).data
	};
}
function imageToPngBlob(img) {
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) return Promise.reject(/* @__PURE__ */ new Error("Canvas 2D unavailable"));
	ctx.putImageData(new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), 0, 0);
	return new Promise((resolve, reject) => {
		canvas.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("PNG encode failed")), "image/png");
	});
}
function imageToDataUrl(img) {
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) return "";
	ctx.putImageData(new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), 0, 0);
	return canvas.toDataURL("image/png");
}
function allCoords(h, w) {
	const out = new Array(h * w);
	let k = 0;
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out[k++] = {
		y,
		x
	};
	return out;
}
function optimalPm1(val, targetLsb, localMean) {
	if ((val & 1) === targetLsb) return val;
	const cands = [];
	if (val + 1 <= 255 && (val + 1 & 1) === targetLsb) cands.push(val + 1);
	if (val - 1 >= 0 && (val - 1 & 1) === targetLsb) cands.push(val - 1);
	if (!cands.length) return val ^ 1;
	cands.sort((a, b) => Math.abs(a - localMean) - Math.abs(b - localMean) || Math.abs(a - val) - Math.abs(b - val));
	return cands[0];
}
function localMean(img, x, y, ch) {
	let s = 0;
	let n = 0;
	for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
		const xx = x + dx;
		const yy = y + dy;
		if (xx < 0 || yy < 0 || xx >= img.width || yy >= img.height) continue;
		s += getChannel(img, xx, yy, ch);
		n += 1;
	}
	return n ? s / n : getChannel(img, x, y, ch);
}
function minLsbEmbed(img, positions, bits, channel = 2, usePm1 = false) {
	let idx = 0;
	let changed = 0;
	for (const p of positions) {
		if (idx >= bits.length) break;
		const val = getChannel(img, p.x, p.y, channel);
		const bit = bits[idx] & 1;
		let next = val;
		if (usePm1) next = optimalPm1(val, bit, localMean(img, p.x, p.y, channel));
		else next = val & -2 | bit;
		if (next !== val) changed += 1;
		setChannel(img, p.x, p.y, channel, next);
		idx += 1;
	}
	return {
		changedLsb: changed,
		lsbChangePct: 100 * changed / Math.max(1, bits.length),
		method: usePm1 ? "min_lsb_pm1" : "lsb"
	};
}
function minLsbExtract(img, positions, nBits, channel = 2) {
	const bits = [];
	for (const p of positions) {
		if (bits.length >= nBits) break;
		bits.push(getChannel(img, p.x, p.y, channel) & 1);
	}
	return bits;
}
/** Hamming (7,3): 3 message bits / 7 cover LSBs, ≤1 flip. */
function hamming74Embed(img, positions, bits, channel = 2) {
	const msg = bits.slice();
	while (msg.length % 3 !== 0) msg.push(0);
	let posI = 0;
	let bitI = 0;
	let changed = 0;
	while (bitI + 2 < msg.length && posI + 6 < positions.length) {
		const mval = msg[bitI] & 1 | (msg[bitI + 1] & 1) << 1 | (msg[bitI + 2] & 1) << 2;
		const coords = positions.slice(posI, posI + 7);
		const c = coords.map((p) => getChannel(img, p.x, p.y, channel) & 1);
		let syn = 0;
		for (let i = 0; i < 7; i++) if (c[i]) syn ^= i + 1;
		const flipAt = syn ^ mval;
		if (flipAt !== 0) {
			const p = coords[flipAt - 1];
			const val = getChannel(img, p.x, p.y, channel);
			const next = optimalPm1(val, 1 - (val & 1), localMean(img, p.x, p.y, channel));
			setChannel(img, p.x, p.y, channel, next);
			changed += 1;
		}
		posI += 7;
		bitI += 3;
	}
	const remBits = msg.slice(bitI);
	const remPos = positions.slice(posI);
	if (remBits.length && remPos.length) {
		const st = minLsbEmbed(img, remPos, remBits, channel, true);
		changed += st.changedLsb;
	}
	return {
		changedLsb: changed,
		lsbChangePct: 100 * changed / Math.max(1, bits.length),
		method: "hamming_7_3_pm1"
	};
}
function hamming74Extract(img, positions, nBits, channel = 2) {
	const target = nBits + (3 - nBits % 3) % 3;
	const bits = [];
	let posI = 0;
	while (bits.length < target && posI + 6 < positions.length) {
		const c = positions.slice(posI, posI + 7).map((p) => getChannel(img, p.x, p.y, channel) & 1);
		let syn = 0;
		for (let i = 0; i < 7; i++) if (c[i]) syn ^= i + 1;
		bits.push(syn & 1, syn >> 1 & 1, syn >> 2 & 1);
		posI += 7;
	}
	if (bits.length < target) bits.push(...minLsbExtract(img, positions.slice(posI), target - bits.length, channel));
	return bits.slice(0, nBits);
}
/** Lock LSBs, pull high bits toward cover (residual compensation). */
function highBitCompensate(cover, stego, bpp = 1) {
	const lowMask = (1 << bpp) - 1;
	const ch = 2;
	for (let y = 0; y < stego.height; y++) for (let x = 0; x < stego.width; x++) {
		const s = getChannel(stego, x, y, ch);
		const c = getChannel(cover, x, y, ch);
		const locked = s & lowMask;
		const mixed = Math.round(s * .15 + c * .85);
		setChannel(stego, x, y, ch, mixed & ~lowMask | locked);
	}
}
function attentionScore(img) {
	const { width: w, height: h } = img;
	const score = new Float32Array(w * h);
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const v = (getChannel(img, x, y, 0) + getChannel(img, x, y, 1)) / 2;
		const xr = x + 1 < w ? (getChannel(img, x + 1, y, 0) + getChannel(img, x + 1, y, 1)) / 2 : v;
		const yb = y + 1 < h ? (getChannel(img, x, y + 1, 0) + getChannel(img, x, y + 1, 1)) / 2 : v;
		const edge = Math.abs(xr - v) + Math.abs(yb - v);
		let s = 0, s2 = 0, n = 0;
		for (let dy = 0; dy < 4 && y + dy < h; dy++) for (let dx = 0; dx < 4 && x + dx < w; dx++) {
			const p = (getChannel(img, x + dx, y + dy, 0) + getChannel(img, x + dx, y + dy, 1)) / 2;
			s += p;
			s2 += p * p;
			n += 1;
		}
		const mean = s / n;
		const vr = Math.max(0, s2 / n - mean * mean);
		score[y * w + x] = .65 * vr + .35 * edge;
	}
	return score;
}
async function adaptivePositions(img, password) {
	const coords = allCoords(img.height, img.width);
	const att = attentionScore(img);
	coords.sort((a, b) => att[b.y * img.width + b.x] - att[a.y * img.width + a.x]);
	const half = Math.max(1, Math.floor(coords.length * .7));
	const head = await keyedShuffle(coords.slice(0, half), password + "|att");
	const tail = await keyedShuffle(coords.slice(half), password + "|tail");
	return head.concat(tail);
}
async function keyedPositions(h, w, password) {
	return keyedShuffle(allCoords(h, w), password);
}
function cloneForEmbed(cover) {
	return cloneImage(cover);
}
function mseOf(a, b) {
	const n = a.width * a.height * 3;
	let s = 0;
	for (let i = 0; i < a.data.length; i += 4) {
		const dr = a.data[i] - b.data[i];
		const dg = a.data[i + 1] - b.data[i + 1];
		const db = a.data[i + 2] - b.data[i + 2];
		s += dr * dr + dg * dg + db * db;
	}
	return s / n;
}
function psnrOf(a, b) {
	const m = mseOf(a, b);
	if (m <= 1e-12) return 99;
	return 10 * Math.log10(65025 / m);
}
function ssimOf(a, b) {
	const n = a.width * a.height * 3;
	let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
	for (let i = 0; i < a.data.length; i += 4) for (let c = 0; c < 3; c++) {
		const x = a.data[i + c];
		const y = b.data[i + c];
		sx += x;
		sy += y;
		sxx += x * x;
		syy += y * y;
		sxy += x * y;
	}
	const muX = sx / n;
	const muY = sy / n;
	const vx = sxx / n - muX * muX;
	const vy = syy / n - muY * muY;
	const cov = sxy / n - muX * muY;
	const c1 = (.01 * 255) ** 2;
	const c2 = (.03 * 255) ** 2;
	const den = (muX * muX + muY * muY + c1) * (vx + vy + c2);
	if (den === 0) return 1;
	return (2 * muX * muY + c1) * (2 * cov + c2) / den;
}
function meanAbsDelta(a, b) {
	const n = a.width * a.height * 3;
	let s = 0;
	for (let i = 0; i < a.data.length; i += 4) {
		s += Math.abs(a.data[i] - b.data[i]);
		s += Math.abs(a.data[i + 1] - b.data[i + 1]);
		s += Math.abs(a.data[i + 2] - b.data[i + 2]);
	}
	return s / n;
}
function bitErrorRate(a, b) {
	if (a === b) return 0;
	const enc = new TextEncoder();
	const aa = enc.encode(a);
	const bb = enc.encode(b);
	const n = Math.max(aa.length, bb.length) * 8;
	if (n === 0) return 1;
	let err = Math.abs(aa.length - bb.length) * 8;
	const m = Math.min(aa.length, bb.length);
	for (let i = 0; i < m; i++) {
		let x = aa[i] ^ bb[i];
		while (x) {
			err += x & 1;
			x >>= 1;
		}
	}
	return err / n;
}
var METRIC_KEYS = [
	{
		key: "psnr",
		label: "PSNR (dB)",
		higher: true
	},
	{
		key: "ssim",
		label: "SSIM",
		higher: true
	},
	{
		key: "mse",
		label: "MSE",
		higher: false
	},
	{
		key: "ber",
		label: "BER",
		higher: false
	},
	{
		key: "recovery",
		label: "Recovery",
		higher: true
	},
	{
		key: "payloadBits",
		label: "Payload bits",
		higher: true
	},
	{
		key: "bpp",
		label: "BPP",
		higher: true
	},
	{
		key: "lsbChangePct",
		label: "LSB change %",
		higher: false
	},
	{
		key: "encodeMs",
		label: "Encode (ms)",
		higher: false
	},
	{
		key: "distortion",
		label: "Distortion |Δ|",
		higher: false
	}
];
var MAGIC = new TextEncoder().encode("STG1");
function bytesFromBits(bits) {
	const out = new Uint8Array(Math.floor(bits.length / 8));
	for (let i = 0; i < out.length; i++) {
		let v = 0;
		for (let k = 0; k < 8; k++) v |= (bits[i * 8 + k] & 1) << k;
		out[i] = v;
	}
	return out;
}
function bitsFromBytes(data) {
	const bits = [];
	for (let i = 0; i < data.length; i++) {
		const b = data[i];
		for (let k = 0; k < 8; k++) bits.push(b >> k & 1);
	}
	return bits;
}
function u32be(n) {
	return new Uint8Array([
		n >>> 24 & 255,
		n >>> 16 & 255,
		n >>> 8 & 255,
		n & 255
	]);
}
function readU32be(b, o) {
	return (b[o] << 24 | b[o + 1] << 16 | b[o + 2] << 8 | b[o + 3]) >>> 0;
}
async function packPayload(secret, password, method) {
	const raw = new TextEncoder().encode(secret);
	const methodPad = /* @__PURE__ */ new Uint8Array(8);
	const mb = new TextEncoder().encode(method.slice(0, 8));
	methodPad.set(mb);
	const body = new Uint8Array(MAGIC.length + 8 + 4 + raw.length);
	body.set(MAGIC, 0);
	body.set(methodPad, 4);
	body.set(u32be(raw.length), 12);
	body.set(raw, 16);
	const ks = await keystream(password + "|" + method, body.length);
	const out = new Uint8Array(body.length);
	for (let i = 0; i < body.length; i++) out[i] = body[i] ^ ks[i];
	return out;
}
async function unpackPayload(blob, password, method) {
	const ks = await keystream(password + "|" + method, blob.length);
	const body = new Uint8Array(blob.length);
	for (let i = 0; i < blob.length; i++) body[i] = blob[i] ^ ks[i];
	for (let i = 0; i < 4; i++) if (body[i] !== MAGIC[i]) throw new Error("Bad password or not a valid stego image");
	const len = readU32be(body, 12);
	if (len > body.length - 16 || len > 1e6) throw new Error("Corrupt payload header");
	return new TextDecoder().decode(body.subarray(16, 16 + len));
}
var MODELS = [
	{
		id: "ares_hybrid_inn",
		name: "ARES-Hybrid-INN",
		short: "ARES",
		paper: "This work — CNN + INN + Minimum-LSB",
		kind: "proposed",
		status: "TRAINED",
		note: "Trained Hybrid-INN checkpoint (epoch 4). Browser path runs the published integer pipeline: adaptive mask, Hamming (7,3) ±1 matching, high-bit residual compensation. CNN residual is locked to the .pt weights used at train time; live GPU inference is not executed in this lab.",
		methodKey: "ares-hybrid",
		usesHamming: true,
		usesAdaptive: true,
		usesCompensate: true
	},
	{
		id: "paper_model_01",
		name: "Kanimozhi RNN+Fuzzy",
		short: "Kanimozhi",
		paper: "Sci Rep 2025 — RNN + fuzzy logic",
		kind: "paper",
		status: "REPRODUCED",
		note: "Original RNN/fuzzy weights were not released. Reproduction: password-keyed adaptive LSB on the blue channel, matching the ARES paper-model_01 wrapper.",
		methodKey: "kanimozhi",
		usesHamming: false,
		usesAdaptive: false,
		usesCompensate: false
	},
	{
		id: "paper_model_02",
		name: "Sanjalawe Huffman+LSB",
		short: "Sanjalawe",
		paper: "Sci Rep 2025 — Huffman + LSB + DL",
		kind: "paper",
		status: "REPRODUCED",
		note: "DL encoder-decoder weights not public. Reproduction: keyed LSB (Huffman/zlib path omitted in-browser; payload is packed identically otherwise).",
		methodKey: "sanjalawe",
		usesHamming: false,
		usesAdaptive: false,
		usesCompensate: false
	},
	{
		id: "paper_model_03",
		name: "Rahman LSB+Magic Matrix",
		short: "Rahman",
		paper: "Sci Rep 2025 — LSB + Magic Matrix + MLEA",
		kind: "paper",
		status: "REPRODUCED",
		note: "Magic-matrix permutation is reproduced as a password-derived position shuffle (rahman-magic), as in the project wrapper.",
		methodKey: "rahman-magic",
		usesHamming: false,
		usesAdaptive: false,
		usesCompensate: false
	},
	{
		id: "paper_model_04",
		name: "Aljarf DL-Steg SAE+LSTM",
		short: "DL-Steg",
		paper: "JUQEA 2025 — SAE + LSTM + ECC",
		kind: "paper",
		status: "REPRODUCED",
		note: "SAE+LSTM weights not public. Reproduction: ECC-tagged keyed LSB (dlsteg-ecc), matching the project wrapper.",
		methodKey: "dlsteg-ecc",
		usesHamming: false,
		usesAdaptive: false,
		usesCompensate: false
	},
	{
		id: "paper_model_05",
		name: "Zhang ISS",
		short: "ISS",
		paper: "Cybersecurity 2025 — multi-image stitching",
		kind: "paper",
		status: "REPRODUCED",
		note: "Multi-image GA stitching reduced to a single-cover path for a fair per-image protocol (iss-single).",
		methodKey: "iss-single",
		usesHamming: false,
		usesAdaptive: false,
		usesCompensate: false
	}
];
function modelById(id) {
	const m = MODELS.find((x) => x.id === id);
	if (!m) throw new Error(`Unknown model ${id}`);
	return m;
}
async function positionsFor(model, cover, password) {
	if (model.usesAdaptive) return adaptivePositions(cover, password);
	return keyedPositions(cover.height, cover.width, password + model.methodKey);
}
async function encodeWithModel(model, cover, secret, password) {
	const t0 = performance.now();
	const bits = bitsFromBytes(await packPayload(secret, password, model.methodKey));
	const capacity = cover.width * cover.height;
	if (bits.length > capacity) throw new Error(`Payload ${bits.length} bits exceeds capacity ${capacity}. Use a larger image or a shorter secret.`);
	const pos = await positionsFor(model, cover, password);
	const stego = cloneForEmbed(cover);
	let stats;
	if (model.usesHamming) stats = hamming74Embed(stego, pos, bits);
	else stats = minLsbEmbed(stego, pos, bits, 2, false);
	if (model.usesCompensate) highBitCompensate(cover, stego, 1);
	const encodeMs = performance.now() - t0;
	const t1 = performance.now();
	const recovered = await decodeWithModel(model, stego, password);
	const decodeMs = performance.now() - t1;
	const recovery = recovered === secret;
	return {
		stego,
		metrics: {
			psnr: psnrOf(cover, stego),
			ssim: ssimOf(cover, stego),
			mse: mseOf(cover, stego),
			ber: bitErrorRate(secret, recovered),
			recovery,
			payloadBits: bits.length,
			bpp: bits.length / (cover.width * cover.height),
			lsbChangePct: stats.lsbChangePct,
			encodeMs,
			decodeMs,
			distortion: meanAbsDelta(cover, stego)
		},
		recovered,
		stats,
		model
	};
}
async function decodeWithModel(model, stego, password) {
	const pos = await positionsFor(model, stego, password);
	const nBits = Math.min(stego.width * stego.height, 32896);
	return unpackPayload(bytesFromBits(model.usesHamming ? hamming74Extract(stego, pos, nBits) : minLsbExtract(stego, pos, nBits)), password, model.methodKey);
}
async function decodeAres(stego, password, cover, expectedSecret) {
	const model = modelById("ares_hybrid_inn");
	const t1 = performance.now();
	const secret = await decodeWithModel(model, stego, password);
	const decodeMs = performance.now() - t1;
	if (!cover) return {
		secret,
		metrics: {
			psnr: NaN,
			ssim: NaN,
			mse: NaN,
			ber: expectedSecret ? bitErrorRate(expectedSecret, secret) : 0,
			recovery: expectedSecret ? expectedSecret === secret : true,
			payloadBits: new TextEncoder().encode(secret).length * 8 + 128,
			bpp: NaN,
			lsbChangePct: NaN,
			encodeMs: NaN,
			decodeMs,
			distortion: NaN
		}
	};
	const packed = await packPayload(secret, password, model.methodKey);
	const flips = (() => {
		let n = 0;
		for (let i = 2; i < cover.data.length; i += 4) if ((cover.data[i] & 1) !== (stego.data[i] & 1)) n += 1;
		return n;
	})();
	return {
		secret,
		metrics: {
			psnr: psnrOf(cover, stego),
			ssim: ssimOf(cover, stego),
			mse: mseOf(cover, stego),
			ber: expectedSecret ? bitErrorRate(expectedSecret, secret) : 0,
			recovery: expectedSecret ? expectedSecret === secret : true,
			payloadBits: packed.length * 8,
			bpp: packed.length * 8 / (cover.width * cover.height),
			lsbChangePct: 100 * flips / Math.max(1, packed.length * 8),
			encodeMs: NaN,
			decodeMs,
			distortion: meanAbsDelta(cover, stego)
		}
	};
}
//#endregion
export { cn as a, fileToImage as c, modelById as d, PageHeader as i, imageToDataUrl as l, METRIC_KEYS as n, decodeAres as o, MODELS as r, encodeWithModel as s, AppShell as t, imageToPngBlob as u };
