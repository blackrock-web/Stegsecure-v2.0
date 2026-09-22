import { keystream } from "./hash";

const MAGIC = new TextEncoder().encode("STG1");

export function bytesFromBits(bits: number[]): Uint8Array {
  const out = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < out.length; i++) {
    let v = 0;
    for (let k = 0; k < 8; k++) v |= (bits[i * 8 + k]! & 1) << k;
    out[i] = v;
  }
  return out;
}

export function bitsFromBytes(data: Uint8Array): number[] {
  const bits: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    for (let k = 0; k < 8; k++) bits.push((b >> k) & 1);
  }
  return bits;
}

function u32be(n: number): Uint8Array {
  return new Uint8Array([(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]);
}

function readU32be(b: Uint8Array, o: number): number {
  return ((b[o]! << 24) | (b[o + 1]! << 16) | (b[o + 2]! << 8) | b[o + 3]!) >>> 0;
}

export async function packPayload(
  secret: string,
  password: string,
  method: string,
): Promise<Uint8Array> {
  const raw = new TextEncoder().encode(secret);
  const methodPad = new Uint8Array(8);
  const mb = new TextEncoder().encode(method.slice(0, 8));
  methodPad.set(mb);
  const body = new Uint8Array(MAGIC.length + 8 + 4 + raw.length);
  body.set(MAGIC, 0);
  body.set(methodPad, 4);
  body.set(u32be(raw.length), 12);
  body.set(raw, 16);
  const ks = await keystream(password + "|" + method, body.length);
  const out = new Uint8Array(body.length);
  for (let i = 0; i < body.length; i++) out[i] = body[i]! ^ ks[i]!;
  return out;
}

export async function unpackPayload(
  blob: Uint8Array,
  password: string,
  method: string,
): Promise<string> {
  const ks = await keystream(password + "|" + method, blob.length);
  const body = new Uint8Array(blob.length);
  for (let i = 0; i < blob.length; i++) body[i] = blob[i]! ^ ks[i]!;
  for (let i = 0; i < 4; i++) {
    if (body[i] !== MAGIC[i]) throw new Error("Bad password or not a valid stego image");
  }
  const len = readU32be(body, 12);
  if (len > body.length - 16 || len > 1_000_000) throw new Error("Corrupt payload header");
  return new TextDecoder().decode(body.subarray(16, 16 + len));
}

export const HEADER_BYTES = 16;
