import { keyedShuffle } from "./hash";
import {
  allCoords,
  cloneImage,
  getChannel,
  setChannel,
  type Coord,
  type RgbImage,
} from "./pixels";

function optimalPm1(val: number, targetLsb: number, localMean: number): number {
  if ((val & 1) === targetLsb) return val;
  const cands: number[] = [];
  if (val + 1 <= 255 && ((val + 1) & 1) === targetLsb) cands.push(val + 1);
  if (val - 1 >= 0 && ((val - 1) & 1) === targetLsb) cands.push(val - 1);
  if (!cands.length) return val ^ 1;
  cands.sort(
    (a, b) =>
      Math.abs(a - localMean) - Math.abs(b - localMean) || Math.abs(a - val) - Math.abs(b - val),
  );
  return cands[0]!;
}

function localMean(img: RgbImage, x: number, y: number, ch: 0 | 1 | 2): number {
  let s = 0;
  let n = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= img.width || yy >= img.height) continue;
      s += getChannel(img, xx, yy, ch);
      n += 1;
    }
  }
  return n ? s / n : getChannel(img, x, y, ch);
}

export type EmbedStats = {
  changedLsb: number;
  lsbChangePct: number;
  method: string;
};

export function minLsbEmbed(
  img: RgbImage,
  positions: Coord[],
  bits: number[],
  channel: 0 | 1 | 2 = 2,
  usePm1 = false,
): EmbedStats {
  let idx = 0;
  let changed = 0;
  for (const p of positions) {
    if (idx >= bits.length) break;
    const val = getChannel(img, p.x, p.y, channel);
    const bit = bits[idx]! & 1;
    let next = val;
    if (usePm1) {
      next = optimalPm1(val, bit, localMean(img, p.x, p.y, channel));
    } else {
      next = (val & ~1) | bit;
    }
    if (next !== val) changed += 1;
    setChannel(img, p.x, p.y, channel, next);
    idx += 1;
  }
  return {
    changedLsb: changed,
    lsbChangePct: (100 * changed) / Math.max(1, bits.length),
    method: usePm1 ? "min_lsb_pm1" : "lsb",
  };
}

export function minLsbExtract(
  img: RgbImage,
  positions: Coord[],
  nBits: number,
  channel: 0 | 1 | 2 = 2,
): number[] {
  const bits: number[] = [];
  for (const p of positions) {
    if (bits.length >= nBits) break;
    bits.push(getChannel(img, p.x, p.y, channel) & 1);
  }
  return bits;
}

/** Hamming (7,3): 3 message bits / 7 cover LSBs, ≤1 flip. */
export function hamming74Embed(
  img: RgbImage,
  positions: Coord[],
  bits: number[],
  channel: 0 | 1 | 2 = 2,
): EmbedStats {
  const msg = bits.slice();
  while (msg.length % 3 !== 0) msg.push(0);
  let posI = 0;
  let bitI = 0;
  let changed = 0;
  while (bitI + 2 < msg.length && posI + 6 < positions.length) {
    const mval =
      (msg[bitI]! & 1) | ((msg[bitI + 1]! & 1) << 1) | ((msg[bitI + 2]! & 1) << 2);
    const coords = positions.slice(posI, posI + 7);
    const c = coords.map((p) => getChannel(img, p.x, p.y, channel) & 1);
    let syn = 0;
    for (let i = 0; i < 7; i++) if (c[i]) syn ^= i + 1;
    const flipAt = syn ^ mval;
    if (flipAt !== 0) {
      const fi = flipAt - 1;
      const p = coords[fi]!;
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
    lsbChangePct: (100 * changed) / Math.max(1, bits.length),
    method: "hamming_7_3_pm1",
  };
}

export function hamming74Extract(
  img: RgbImage,
  positions: Coord[],
  nBits: number,
  channel: 0 | 1 | 2 = 2,
): number[] {
  const target = nBits + ((3 - (nBits % 3)) % 3);
  const bits: number[] = [];
  let posI = 0;
  while (bits.length < target && posI + 6 < positions.length) {
    const coords = positions.slice(posI, posI + 7);
    const c = coords.map((p) => getChannel(img, p.x, p.y, channel) & 1);
    let syn = 0;
    for (let i = 0; i < 7; i++) if (c[i]) syn ^= i + 1;
    bits.push(syn & 1, (syn >> 1) & 1, (syn >> 2) & 1);
    posI += 7;
  }
  if (bits.length < target) {
    bits.push(...minLsbExtract(img, positions.slice(posI), target - bits.length, channel));
  }
  return bits.slice(0, nBits);
}

/** Lock LSBs, pull high bits toward cover (residual compensation). */
export function highBitCompensate(cover: RgbImage, stego: RgbImage, bpp = 1) {
  const lowMask = (1 << bpp) - 1;
  const ch: 0 | 1 | 2 = 2;
  for (let y = 0; y < stego.height; y++) {
    for (let x = 0; x < stego.width; x++) {
      const s = getChannel(stego, x, y, ch);
      const c = getChannel(cover, x, y, ch);
      const locked = s & lowMask;
      const mixed = Math.round(s * 0.15 + c * 0.85);
      setChannel(stego, x, y, ch, (mixed & ~lowMask) | locked);
    }
  }
}

export function attentionScore(img: RgbImage): Float32Array {
  const { width: w, height: h } = img;
  const score = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const r = getChannel(img, x, y, 0);
      const g = getChannel(img, x, y, 1);
      const v = (r + g) / 2;
      const xr = x + 1 < w ? (getChannel(img, x + 1, y, 0) + getChannel(img, x + 1, y, 1)) / 2 : v;
      const yb = y + 1 < h ? (getChannel(img, x, y + 1, 0) + getChannel(img, x, y + 1, 1)) / 2 : v;
      const edge = Math.abs(xr - v) + Math.abs(yb - v);
      // local variance proxy
      let s = 0,
        s2 = 0,
        n = 0;
      for (let dy = 0; dy < 4 && y + dy < h; dy++) {
        for (let dx = 0; dx < 4 && x + dx < w; dx++) {
          const p =
            (getChannel(img, x + dx, y + dy, 0) + getChannel(img, x + dx, y + dy, 1)) / 2;
          s += p;
          s2 += p * p;
          n += 1;
        }
      }
      const mean = s / n;
      const vr = Math.max(0, s2 / n - mean * mean);
      score[y * w + x] = 0.65 * vr + 0.35 * edge;
    }
  }
  return score;
}

export async function adaptivePositions(
  img: RgbImage,
  password: string,
): Promise<Coord[]> {
  const coords = allCoords(img.height, img.width);
  const att = attentionScore(img);
  coords.sort((a, b) => att[b.y * img.width + b.x]! - att[a.y * img.width + a.x]!);
  // mix keyed shuffle in the high-attention half so positions are password-bound
  const half = Math.max(1, Math.floor(coords.length * 0.7));
  const head = await keyedShuffle(coords.slice(0, half), password + "|att");
  const tail = await keyedShuffle(coords.slice(half), password + "|tail");
  return head.concat(tail);
}

export async function keyedPositions(
  h: number,
  w: number,
  password: string,
): Promise<Coord[]> {
  return keyedShuffle(allCoords(h, w), password);
}

export function cloneForEmbed(cover: RgbImage): RgbImage {
  return cloneImage(cover);
}
