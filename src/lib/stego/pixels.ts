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
