import { create } from "zustand";
import type { QualityMetrics } from "@/lib/stego/metrics";
import type { ModelDef } from "@/lib/stego/models";
import type { RgbImage } from "@/lib/stego/pixels";

export type BenchRow = {
  imageName: string;
  modelId: string;
  metrics: QualityMetrics;
  recovered: string;
  error?: string;
};

export type SessionState = {
  lastCover?: RgbImage;
  lastStego?: RgbImage;
  lastStegoUrl?: string;
  lastCoverUrl?: string;
  lastSecret?: string;
  lastPassword?: string;
  lastMetrics?: QualityMetrics;
  lastModel?: ModelDef;
  bench: BenchRow[];
  benchSecret: string;
  benchPassword: string;
  setEncode: (p: {
    cover: RgbImage;
    stego: RgbImage;
    coverUrl: string;
    stegoUrl: string;
    secret: string;
    password: string;
    metrics: QualityMetrics;
    model: ModelDef;
  }) => void;
  setBench: (rows: BenchRow[]) => void;
  setBenchCreds: (secret: string, password: string) => void;
};

export const useSession = create<SessionState>((set) => ({
  bench: [],
  benchSecret: "ARES research secret",
  benchPassword: "lab-passphrase",
  setEncode: (p) =>
    set({
      lastCover: p.cover,
      lastStego: p.stego,
      lastCoverUrl: p.coverUrl,
      lastStegoUrl: p.stegoUrl,
      lastSecret: p.secret,
      lastPassword: p.password,
      lastMetrics: p.metrics,
      lastModel: p.model,
    }),
  setBench: (rows) => set({ bench: rows }),
  setBenchCreds: (secret, password) => set({ benchSecret: secret, benchPassword: password }),
}));
