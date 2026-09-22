import type { RgbImage } from "./pixels";

export type SampleImage = {
  id: string;
  name: string;
  category: string;
  description: string;
  generate: () => RgbImage;
};

function makeCanvas(width = 384, height = 384): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D unavailable");
  return { canvas, ctx };
}

function canvasToRgbImage(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): RgbImage {
  const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return {
    width: canvas.width,
    height: canvas.height,
    data: id.data,
  };
}

export function generatePortraitSample(width = 384, height = 384): RgbImage {
  const { canvas, ctx } = makeCanvas(width, height);
  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#4a2840");
  bgGrad.addColorStop(0.5, "#8d5462");
  bgGrad.addColorStop(1, "#c9897e");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft skin tone shapes
  const cx = width * 0.5;
  const cy = height * 0.52;
  const faceGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, width * 0.35);
  faceGrad.addColorStop(0, "#f7cfbe");
  faceGrad.addColorStop(0.7, "#e4a993");
  faceGrad.addColorStop(1, "#c27d68");
  ctx.fillStyle = faceGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, width * 0.28, height * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hat / Headwear structure (high frequency curves)
  ctx.fillStyle = "#863456";
  ctx.beginPath();
  ctx.ellipse(cx, cy - height * 0.28, width * 0.42, height * 0.16, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Feathers / textures with delicate strokes
  ctx.strokeStyle = "#dd9bb5";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 40; i++) {
    const angle = -0.5 + (i / 40) * 1.2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 80, cy - 120 + Math.sin(angle) * 50);
    ctx.quadraticCurveTo(
      cx + Math.cos(angle) * 160 + (i % 3) * 10,
      cy - 150 - (i * 2),
      cx + Math.cos(angle) * 190,
      cy - 130 + Math.sin(angle) * 60,
    );
    ctx.stroke();
  }

  // Facial features (edges and gradients)
  ctx.fillStyle = "#3e1c14";
  ctx.beginPath();
  ctx.ellipse(cx - 38, cy - 15, 12, 7, -0.1, 0, Math.PI * 2); // left eye
  ctx.ellipse(cx + 38, cy - 15, 12, 7, 0.1, 0, Math.PI * 2);  // right eye
  ctx.fill();

  ctx.strokeStyle = "#8e3c3c";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 5);
  ctx.lineTo(cx - 4, cy + 25);
  ctx.lineTo(cx + 10, cy + 28);
  ctx.stroke();

  // Lips
  ctx.fillStyle = "#b83b48";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 55, 24, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  return canvasToRgbImage(canvas, ctx);
}

export function generateTextureSample(width = 384, height = 384): RgbImage {
  const { canvas, ctx } = makeCanvas(width, height);
  // High-frequency texture (similar to Baboon test image)
  const imgData = ctx.createImageData(width, height);
  const d = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const nx = x / width;
      const ny = y / height;
      // Multi-scale harmonic texture
      const f1 = Math.sin(nx * 35 + ny * 20);
      const f2 = Math.cos(nx * 70 - ny * 50);
      const f3 = Math.sin(Math.sqrt((x - width / 2) ** 2 + (y - height / 2) ** 2) * 0.2);
      const f4 = Math.sin(nx * 120) * Math.cos(ny * 120);

      const val = 128 + 55 * f1 + 35 * f2 + 25 * f3 + 15 * f4;
      const r = Math.max(0, Math.min(255, val + 20 * Math.sin(nx * 10)));
      const g = Math.max(0, Math.min(255, val * 0.85 + 30 * Math.cos(ny * 15)));
      const b = Math.max(0, Math.min(255, val * 0.7 + 40 * f2));

      d[idx] = r;
      d[idx + 1] = g;
      d[idx + 2] = b;
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Overlay structural facial whisker lines for high spatial variance
  ctx.strokeStyle = "rgba(240, 230, 210, 0.4)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    const y0 = height * 0.3 + (i * 3);
    ctx.beginPath();
    ctx.moveTo(width * 0.2, y0);
    ctx.quadraticCurveTo(width * 0.5, y0 + (i % 7) * 4 - 10, width * 0.85, y0 + (i % 5) * 6);
    ctx.stroke();
  }

  return canvasToRgbImage(canvas, ctx);
}

export function generatePeppersSample(width = 384, height = 384): RgbImage {
  const { canvas, ctx } = makeCanvas(width, height);
  // Rich colors and specular reflections (Peppers test image style)
  ctx.fillStyle = "#1b211d";
  ctx.fillRect(0, 0, width, height);

  // Big green pepper
  const p1 = ctx.createRadialGradient(width * 0.35, height * 0.45, 10, width * 0.4, height * 0.5, 140);
  p1.addColorStop(0, "#8cf05b");
  p1.addColorStop(0.3, "#3fa328");
  p1.addColorStop(0.8, "#1a5e12");
  p1.addColorStop(1, "#0d310a");
  ctx.fillStyle = p1;
  ctx.beginPath();
  ctx.ellipse(width * 0.4, height * 0.5, 110, 130, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Big red pepper
  const p2 = ctx.createRadialGradient(width * 0.65, height * 0.4, 15, width * 0.65, height * 0.45, 130);
  p2.addColorStop(0, "#ff7568");
  p2.addColorStop(0.35, "#db1a1a");
  p2.addColorStop(0.85, "#800808");
  p2.addColorStop(1, "#360202");
  ctx.fillStyle = p2;
  ctx.beginPath();
  ctx.ellipse(width * 0.65, height * 0.45, 105, 125, 0.25, 0, Math.PI * 2);
  ctx.fill();

  // Yellow / Orange pepper in front
  const p3 = ctx.createRadialGradient(width * 0.5, height * 0.65, 10, width * 0.5, height * 0.7, 100);
  p3.addColorStop(0, "#fff06b");
  p3.addColorStop(0.4, "#f5a216");
  p3.addColorStop(0.85, "#ba5a07");
  p3.addColorStop(1, "#4d1d00");
  ctx.fillStyle = p3;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.7, 95, 80, 0, 0, Math.PI * 2);
  ctx.fill();

  // Specular high-light streaks
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.beginPath();
  ctx.ellipse(width * 0.35, height * 0.38, 28, 9, -0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(width * 0.68, height * 0.34, 24, 7, 0.4, 0, Math.PI * 2);
  ctx.fill();

  return canvasToRgbImage(canvas, ctx);
}

export function generateGeometricSample(width = 384, height = 384): RgbImage {
  const { canvas, ctx } = makeCanvas(width, height);
  // Scientific calibration grid: sharp edges, concentric rings, smooth gradients
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#0f172a");
  grad.addColorStop(1, "#334155");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Concentric target circles with modulated frequencies
  const cx = width / 2;
  const cy = height / 2;
  for (let r = 10; r < width * 0.65; r += 8) {
    ctx.strokeStyle = `hsl(${(r * 3) % 360}, 65%, 60%)`;
    ctx.lineWidth = 1 + (r % 3);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Crosshair calibration lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, height);
  ctx.moveTo(0, cy);
  ctx.lineTo(width, cy);
  ctx.stroke();

  return canvasToRgbImage(canvas, ctx);
}

export const SAMPLE_COVERS: SampleImage[] = [
  {
    id: "portrait",
    name: "Lena (Classic Portrait)",
    category: "Balanced Frequency",
    description: "Standard benchmark image with smooth skin tones, edge boundaries, and fine textures.",
    generate: () => generatePortraitSample(384, 384),
  },
  {
    id: "texture",
    name: "Baboon (High Texture)",
    category: "High Spatial Frequency",
    description: "Rich harmonic texture and high entropy, challenging for steganalysis algorithms.",
    generate: () => generateTextureSample(384, 384),
  },
  {
    id: "peppers",
    name: "Peppers (Color Gradients)",
    category: "Specular Highlights",
    description: "Vibrant multi-channel color gradients and smooth lighting transitions.",
    generate: () => generatePeppersSample(384, 384),
  },
  {
    id: "geometric",
    name: "Calibration Grid",
    category: "Geometric Pattern",
    description: "Synthetic frequency patterns for measuring spatial distortion and PSNR uniformity.",
    generate: () => generateGeometricSample(384, 384),
  },
];

export function generateSampleImage(
  type: "portrait" | "texture" | "peppers" | "geometric",
  width = 384,
  height = 384,
): RgbImage {
  switch (type) {
    case "portrait":
      return generatePortraitSample(width, height);
    case "texture":
      return generateTextureSample(width, height);
    case "peppers":
      return generatePeppersSample(width, height);
    case "geometric":
      return generateGeometricSample(width, height);
    default:
      return generatePortraitSample(width, height);
  }
}
