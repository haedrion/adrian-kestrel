/* Palette extraction — ported 1:1 from the original builder (5 dominant colors). */

import { toHex, luminance, saturation } from "./color";

export type Swatch = { hex: string; weight: number };
export type ExtractedTheme = {
  base: string;
  alternateBase: string;
  window: string;
  text: string;
  highlight: string;
};

const TYPES = ["image/png", "image/jpeg", "image/webp"];
export const isImageFile = (f?: File | null) => !!f && TYPES.includes(f.type);

function readDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

function decodeImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("The file is not a decodable image."));
    img.src = src;
  });
}

async function sample(src: string, max: number) {
  const img = await decodeImage(src);
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

/** Five dominant colors, min 48 RGB-distance apart, with pixel weights. */
export async function extractSwatches(file: File, want = 5): Promise<Swatch[]> {
  const url = await readDataUrl(file);
  const { data } = await sample(url, 160);
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = (r >> 3) << 10 | (g >> 3) << 5 | b >> 3;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.n += 1;
    } else {
      buckets.set(key, { r, g, b, n: 1 });
    }
    total += 1;
  }
  if (!total) return [];
  const ranked = [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .map((c) => ({ r: c.r / c.n, g: c.g / c.n, b: c.b / c.n, n: c.n }));
  const picked: typeof ranked = [];
  const gap = 48;
  for (const c of ranked) {
    if (picked.some((p) => Math.hypot(p.r - c.r, p.g - c.g, p.b - c.b) < gap)) continue;
    picked.push(c);
    if (picked.length === want) break;
  }
  for (const c of ranked) {
    if (picked.length === want) break;
    if (!picked.includes(c)) picked.push(c);
  }
  return picked.map((c) => ({ hex: toHex(c.r, c.g, c.b), weight: c.n / total }));
}

/** Maps the five dominant colors onto the five Qt roles the app exposes. */
export function mapToTheme(swatches: Swatch[]): ExtractedTheme | null {
  if (swatches.length < 2) return null;
  const queue = swatches.slice(0, 5).map((s) => s.hex);
  const base = queue[0];
  const baseL = luminance(base);
  const take = (score: (hex: string) => number) => {
    let best = queue[0];
    let bestScore = -Infinity;
    for (const hex of queue) {
      const s = score(hex);
      if (s > bestScore) {
        bestScore = s;
        best = hex;
      }
    }
    queue.splice(queue.indexOf(best), 1);
    return best;
  };
  queue.splice(0, 1);
  const text = take((hex) => Math.abs(luminance(hex) - baseL));
  const highlight = queue.length ? take(saturation) : text;
  const rest = queue.length ? queue : [base];
  rest.sort((a, b) => luminance(a) - luminance(b));
  const alternateBase = rest[0];
  const window = rest[rest.length - 1] ?? alternateBase;
  return { base, alternateBase, window, text, highlight };
}
