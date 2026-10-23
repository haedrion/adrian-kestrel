import JSZip from "jszip";
import {
  buildThemeFiles,
  buildPalette,
  buildPrefs,
  buildQss,
  archiveName,
  hexToRgb,
  nowIso,
  sanitizeThemeName,
  type Colors,
} from "./scrtheme";

export type BuiltFile = { path: string; contents: string; role: string; isPointerTarget?: boolean };

const PICKER_PATHS: [keyof Colors, string][] = [
  ["binder", "background"],
  ["binder", "text"],
  ["editor", "background"],
  ["editor", "text"],
  ["inspector", "background"],
  ["inspector", "text"],
  ["toolbar", "background"],
  ["toolbar", "text"],
  ["advanced", "menuFont"],
  ["advanced", "activeMenuAccent"],
  ["advanced", "dropdownBackground"],
  ["advanced", "dropdownText"],
];

function valueAt(colors: Colors, area: keyof Colors, key: string) {
  return (colors[area] as unknown as Record<string, string>)[key];
}

/** Confirms a picker value actually landed in the payload (hex, or its R,G,B triple). */
function wiredInPayload(hex: string, bodies: string[]) {
  const [r, g, b] = hexToRgb(hex);
  const triple = `${r},${g},${b}`;
  const needle = hex.toUpperCase();
  return bodies.some((body) => body.includes(needle) || body.includes(triple));
}

export function buildPackage(colors: Colors, rawName: string) {
  const name = sanitizeThemeName(rawName);
  const files = buildThemeFiles(colors, name, nowIso()) as BuiltFile[];
  const bodies = [
    buildPalette(colors),
    buildPrefs(colors, name, nowIso()),
    buildQss(colors, name),
    files[3].contents,
  ];
  const unwired = PICKER_PATHS.filter(
    ([area, key]) => !wiredInPayload(valueAt(colors, area, key), bodies)
  ).map(([area, key]) => `${area}.${key}`);

  return {
    name,
    files,
    archiveFileName: archiveName(name),
    manifestFileName: files[3].path,
    payloadPaths: files.filter((f) => !f.isPointerTarget).map((f) => f.path),
    manifestEntries: [
      ...files[3].contents.matchAll(/<(?:qtstylesheet|palette|preferences)\b[^>]*>([^<]*)</g),
    ].map((m) => m[1].trim()),
    unwired,
    wired: PICKER_COUNT - unwired.length,
  };
}

export const PICKER_COUNT = 12;

export async function downloadScrtheme(colors: Colors, rawName: string) {
  const pkg = buildPackage(colors, rawName);
  if (pkg.unwired.length) {
    throw new Error(`Palette audit failed for: ${pkg.unwired.join(", ")}.`);
  }
  const zip = new JSZip();
  pkg.files.forEach((file) => {
    zip.file(file.path, file.contents, {
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
      date: new Date(),
    });
  });
  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
    platform: "DOS",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = pkg.archiveFileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return { fileName: pkg.name, files: pkg.files, wiredPickers: pkg.wired };
}
