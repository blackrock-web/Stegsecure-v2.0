export type RgbImage = {
  width: number;
  height: number;
  data: Uint8ClampedArray; // RGBA
};

export function cloneImage(img: RgbImage): RgbImage {
  return {
    width: img.width,
    height: img.height,
    data: new Uint8ClampedArray(img.data),
  };
}

export function getPixel(img: RgbImage, x: number, y: number) {
  const i = (y * img.width + x) * 4;
  return {
    r: img.data[i]!,
    g: img.data[i + 1]!,
    b: img.data[i + 2]!,
    a: img.data[i + 3]!,
  };
}

export function setChannel(img: RgbImage, x: number, y: number, ch: 0 | 1 | 2, v: number) {
  const i = (y * img.width + x) * 4 + ch;
  img.data[i] = Math.max(0, Math.min(255, v | 0));
}

export function getChannel(img: RgbImage, x: number, y: number, ch: 0 | 1 | 2): number {
  return img.data[(y * img.width + x) * 4 + ch]!;
}

export async function fileToImage(file: File, maxSide = 512): Promise<RgbImage> {
  try {
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
    const id = ctx.getImageData(0, 0, w, h);
    return { width: w, height: h, data: id.data };
  } catch {
    // Fallback using HTMLImageElement
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const w = Math.max(32, Math.round(img.width * scale));
          const h = Math.max(32, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) {
            reject(new Error("Canvas 2D unavailable"));
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          const id = ctx.getImageData(0, 0, w, h);
          resolve({ width: w, height: h, data: id.data });
        };
        img.onerror = () => reject(new Error("Failed to decode image data"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
}

export function imageToPngBlob(img: RgbImage): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Canvas 2D unavailable"));
  ctx.putImageData(new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG encode failed"))), "image/png");
  });
}

export function imageToDataUrl(img: RgbImage): string {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.putImageData(new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), 0, 0);
  return canvas.toDataURL("image/png");
}

/**
 * Robust image download that handles both data URL and blob URL fallbacks.
 * Prevents premature blob revocation that cancels downloads in Chrome/Chromium.
 */
export async function downloadImage(img: RgbImage, filename = "ares-stego.png"): Promise<boolean> {
  try {
    const dataUrl = imageToDataUrl(img);
    if (dataUrl && dataUrl.startsWith("data:image/png")) {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) a.parentNode.removeChild(a);
      }, 500);
      return true;
    }
  } catch {
    // try blob fallback
  }

  try {
    const blob = await imageToPngBlob(img);
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 60000);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copies the image to system clipboard as a PNG blob.
 */
export async function copyImageToClipboard(img: RgbImage): Promise<boolean> {
  if (!navigator?.clipboard?.write) return false;
  try {
    const blob = await imageToPngBlob(img);
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates an amplified residual difference image (|cover - stego| * amplification).
 * Allows the user to visually inspect and confirm the exact locations of embedded bits.
 */
export function createResidualImage(
  cover: RgbImage,
  stego: RgbImage,
  amplification = 40,
): RgbImage {
  const w = Math.min(cover.width, stego.width);
  const h = Math.min(cover.height, stego.height);
  const out = new Uint8ClampedArray(w * h * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const iC = (y * cover.width + x) * 4;
      const iS = (y * stego.width + x) * 4;
      const iO = (y * w + x) * 4;

      const dr = Math.abs(cover.data[iC]! - stego.data[iS]!);
      const dg = Math.abs(cover.data[iC + 1]! - stego.data[iS + 1]!);
      const db = Math.abs(cover.data[iC + 2]! - stego.data[iS + 2]!);

      // If any delta, highlight clearly in vibrant color heatmap (magenta / cyan / yellow)
      if (dr > 0 || dg > 0 || db > 0) {
        out[iO] = Math.min(255, Math.max(50, dr * amplification + 100));     // Red
        out[iO + 1] = Math.min(255, dg * amplification);                     // Green
        out[iO + 2] = Math.min(255, Math.max(80, db * amplification + 150)); // Blue (steo channel)
      } else {
        // Dark background for zero difference
        out[iO] = 18;
        out[iO + 1] = 22;
        out[iO + 2] = 28;
      }
      out[iO + 3] = 255;
    }
  }

  return { width: w, height: h, data: out };
}

/**
 * Extracts a specific bit-plane (e.g. Blue channel LSB, bit 0) to inspect binary noise patterns.
 */
export function createBitplaneImage(
  img: RgbImage,
  channel: 0 | 1 | 2 = 2,
  bitIndex = 0,
): RgbImage {
  const { width: w, height: h } = img;
  const out = new Uint8ClampedArray(w * h * 4);
  const mask = 1 << bitIndex;

  for (let i = 0; i < w * h; i++) {
    const val = img.data[i * 4 + channel]!;
    const bit = (val & mask) ? 255 : 0;
    out[i * 4] = bit;
    out[i * 4 + 1] = bit;
    out[i * 4 + 2] = bit;
    out[i * 4 + 3] = 255;
  }

  return { width: w, height: h, data: out };
}

export type Coord = { y: number; x: number };

export function allCoords(h: number, w: number): Coord[] {
  const out: Coord[] = new Array(h * w);
  let k = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      out[k++] = { y, x };
    }
  }
  return out;
}
