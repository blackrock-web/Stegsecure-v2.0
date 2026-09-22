import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-nFbBjc5C.js
var useSession = create((set) => ({
	bench: [],
	benchSecret: "ARES research secret",
	benchPassword: "lab-passphrase",
	setEncode: (p) => set({
		lastCover: p.cover,
		lastStego: p.stego,
		lastCoverUrl: p.coverUrl,
		lastStegoUrl: p.stegoUrl,
		lastSecret: p.secret,
		lastPassword: p.password,
		lastMetrics: p.metrics,
		lastModel: p.model
	}),
	setBench: (rows) => set({ bench: rows }),
	setBenchCreds: (secret, password) => set({
		benchSecret: secret,
		benchPassword: password
	})
}));
//#endregion
export { useSession as t };
