/* Color helpers ported 1:1 from the original builder. */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function rgbTriple(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return `${r},${g},${b}`;
}

export function toHex(r: number, g: number, b: number) {
  const f = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`.toUpperCase();
}

export function mix(a: string, b: string, p: number) {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return toHex(x[0] * (1 - p) + y[0] * p, x[1] * (1 - p) + y[1] * p, x[2] * (1 - p) + y[2] * p);
}

export function tint(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const h = d === 0 ? 0 : l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let hue = 0;
  if (d !== 0) {
    if (max === r) hue = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue /= 6;
  }
  const l2 = Math.min(0.96, l * amount);
  const t = l2 < 0.5 ? l2 * (1 + h) : l2 + h - l2 * h;
  const p = 2 * l2 - t;
  const chan = (v: number) => {
    if (v < 0) v += 1;
    if (v > 1) v -= 1;
    if (v < 1 / 6) return p + (t - p) * 6 * v;
    if (v < 1 / 2) return t;
    if (v < 2 / 3) return p + (t - p) * (2 / 3 - v) * 6;
    return p;
  };
  return toHex(chan(hue + 1 / 3) * 255, chan(hue) * 255, chan(hue - 1 / 3) * 255);
}

export function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Reads the on-screen text color Scrivener would pick for a pane. */
export function autoText(bg: string) {
  return luminance(bg) > 0.45 ? "#1A1A1A" : "#F5F5F5";
}

/** Saturation 0..1 of a hex color. */
export function saturation(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}
