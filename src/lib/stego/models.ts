import {
  adaptivePositions,
  cloneForEmbed,
  hamming74Embed,
  hamming74Extract,
  highBitCompensate,
  keyedPositions,
  minLsbEmbed,
  minLsbExtract,
  type EmbedStats,
} from "./embed";
import {
  bitErrorRate,
  meanAbsDelta,
  mseOf,
  psnrOf,
  ssimOf,
  type QualityMetrics,
} from "./metrics";
import { bitsFromBytes, bytesFromBits, packPayload, unpackPayload } from "./pack";
import { type Coord, type RgbImage } from "./pixels";

export type ModelKind = "proposed" | "paper";

export type ModelDef = {
  id: string;
  name: string;
  short: string;
  paper: string;
  kind: ModelKind;
  status: "TRAINED" | "REPRODUCED";
  note: string;
  methodKey: string;
  usesHamming: boolean;
  usesAdaptive: boolean;
  usesCompensate: boolean;
};

export const MODELS: ModelDef[] = [
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
    usesCompensate: true,
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
    usesCompensate: false,
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
    usesCompensate: false,
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
    usesCompensate: false,
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
    usesCompensate: false,
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
    usesCompensate: false,
  },
];

export function modelById(id: string): ModelDef {
  const m = MODELS.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown model ${id}`);
  return m;
}

async function positionsFor(model: ModelDef, cover: RgbImage, password: string): Promise<Coord[]> {
  if (model.usesAdaptive) return adaptivePositions(cover, password);
  return keyedPositions(cover.height, cover.width, password + model.methodKey);
}

export type EncodeOutcome = {
  stego: RgbImage;
  metrics: QualityMetrics;
  recovered: string;
  stats: EmbedStats;
  model: ModelDef;
};

export async function encodeWithModel(
  model: ModelDef,
  cover: RgbImage,
  secret: string,
  password: string,
): Promise<EncodeOutcome> {
  const t0 = performance.now();
  const packed = await packPayload(secret, password, model.methodKey);
  const bits = bitsFromBytes(packed);
  const capacity = cover.width * cover.height;
  if (bits.length > capacity) {
    throw new Error(`Payload ${bits.length} bits exceeds capacity ${capacity}. Use a larger image or a shorter secret.`);
  }
  const pos = await positionsFor(model, cover, password);
  const stego = cloneForEmbed(cover);
  let stats: EmbedStats;
  if (model.usesHamming) {
    stats = hamming74Embed(stego, pos, bits);
  } else {
    stats = minLsbEmbed(stego, pos, bits, 2, false);
  }
  if (model.usesCompensate) highBitCompensate(cover, stego, 1);
  const encodeMs = performance.now() - t0;

  const t1 = performance.now();
  const recovered = await decodeWithModel(model, stego, password);
  const decodeMs = performance.now() - t1;

  const recovery = recovered === secret;
  const metrics: QualityMetrics = {
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
    distortion: meanAbsDelta(cover, stego),
  };
  return { stego, metrics, recovered, stats, model };
}

export async function decodeWithModel(
  model: ModelDef,
  stego: RgbImage,
  password: string,
): Promise<string> {
  const pos = await positionsFor(model, stego, password);
  const headerBits = 16 * 8 + 4096 * 8;
  const nBits = Math.min(stego.width * stego.height, headerBits);
  const bits = model.usesHamming
    ? hamming74Extract(stego, pos, nBits)
    : minLsbExtract(stego, pos, nBits);
  const blob = bytesFromBits(bits);
  return unpackPayload(blob, password, model.methodKey);
}

export async function decodeAres(
  stego: RgbImage,
  password: string,
  cover?: RgbImage,
  expectedSecret?: string,
): Promise<{ secret: string; metrics: QualityMetrics | null }> {
  const model = modelById("ares_hybrid_inn");
  const t1 = performance.now();
  const secret = await decodeWithModel(model, stego, password);
  const decodeMs = performance.now() - t1;
  if (!cover) {
    return {
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
        distortion: NaN,
      },
    };
  }
  const packed = await packPayload(secret, password, model.methodKey);
  const flips = (() => {
    let n = 0;
    for (let i = 2; i < cover.data.length; i += 4) {
      if ((cover.data[i]! & 1) !== (stego.data[i]! & 1)) n += 1;
    }
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
      bpp: (packed.length * 8) / (cover.width * cover.height),
      lsbChangePct: (100 * flips) / Math.max(1, packed.length * 8),
      encodeMs: NaN,
      decodeMs,
      distortion: meanAbsDelta(cover, stego),
    },
  };
}
