/** SHA-256 + PRNG helpers for keyed embedding. */

export async function sha256Bytes(data: Uint8Array | string): Promise<Uint8Array> {
  const buf =
    typeof data === "string" ? new TextEncoder().encode(data) : (data as Uint8Array);
  const digest = await crypto.subtle.digest("SHA-256", buf as BufferSource);
  return new Uint8Array(digest);
}

export function u32FromBytes(b: Uint8Array, offset = 0): number {
  return (
    ((b[offset] ?? 0) << 24) |
    ((b[offset + 1] ?? 0) << 16) |
    ((b[offset + 2] ?? 0) << 8) |
    (b[offset + 3] ?? 0)
  ) >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function keyedShuffle<T>(items: T[], key: string): Promise<T[]> {
  const h = await sha256Bytes(key);
  const rng = mulberry32(u32FromBytes(h));
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}

export async function keystream(password: string, length: number): Promise<Uint8Array> {
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
