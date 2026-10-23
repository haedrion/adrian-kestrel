import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Download,
  FileArchive,
  Folder,
  Image as ImageIcon,
  Layers,
  Loader2,
  PanelRight,
  RefreshCw,
  ShieldCheck,
  SquarePen,
  TriangleAlert,
} from "lucide-react";
import ScrivenerPreview from "../components/ScrivenerPreview";
import InstagramIcon from "../components/InstagramIcon";
import { mix, tint, luminance, autoText, rgbTriple } from "../lib/color";
import { extractSwatches, isImageFile, mapToTheme, type Swatch } from "../lib/palette";
import { buildPackage, downloadScrtheme } from "../lib/exportTheme";
import { DEFAULT_COLORS, AREAS, ADVANCED, SITE_PALETTE, type Colors } from "../lib/areas";
import { LINKS } from "../lib/site";

const AREA_ICONS = {
  binder: Folder,
  editor: SquarePen,
  inspector: PanelRight,
  toolbar: Layers,
} as const;

/* ---------------- color picker row ---------------- */
function ColorControl({
  id,
  name,
  label,
  value,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);

  const commit = () => {
    const next = draft.trim().replace("#", "");
    if (/^[0-9a-fA-F]{6}$/.test(next)) onChange(`#${next.toUpperCase()}`);
    else setDraft(value);
  };

  return (
    <div className="color-control">
      <label className="color-label" htmlFor={id} title={name}>
        {label}
      </label>
      <div className="color-inputs">
        <input
          id={id}
          type="color"
          className="color-swatch"
          value={value}
          aria-label={`${name} swatch`}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
        <input
          className="hex-input"
          value={draft}
          spellCheck={false}
          maxLength={7}
          aria-label={`${name} hex value`}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </div>
    </div>
  );
}

/* ---------------- drop zone hook (ported) ---------------- */
type DropState = "idle" | "over" | "busy" | "error";

function useDropZone(onFile: (file: File) => Promise<void>) {
  const [state, setState] = useState<DropState>("idle");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handle(file?: File | null) {
    if (!isImageFile(file)) {
      setError("Drop a PNG, JPG or WebP image.");
      setState("error");
      return;
    }
    setState("busy");
    setError("");
    try {
      await onFile(file as File);
      setState("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read image.");
      setState("error");
    }
  }

  return {
    state,
    error,
    inputRef,
    handlers: {
      onDragEnter: (e: React.DragEvent) => {
        e.preventDefault();
        setState("over");
      },
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        setState("over");
      },
      onDragLeave: (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setState("idle");
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        void handle(Array.from(e.dataTransfer.files).find((f) => isImageFile(f)));
      },
      onClick: () => inputRef.current?.click(),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      },
    },
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      void handle(e.target.files?.[0] ?? null);
      e.target.value = "";
    },
  };
}

/* ---------------- guide card ---------------- */
function GuideCard({
  eyebrow,
  title,
  icon,
  as,
  steps,
  footnote,
}: {
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  as: "ol" | "ul";
  steps: React.ReactNode[];
  footnote?: string;
}) {
  const Tag = as;
  return (
    <section className="guide-card" aria-label={title}>
      <div className="guide-head">
        <div className="guide-icon" aria-hidden="true">
          {icon}
        </div>
        <div>
          <span className="column-eyebrow">{eyebrow}</span>
          <h3>{title}</h3>
        </div>
      </div>
      <Tag className={`guide-steps guide-steps-${as}`}>
        {steps.map((step, i) => (
          <li key={i}>
            <span className="guide-step-marker" aria-hidden="true">
              {as === "ol" ? i + 1 : ""}
            </span>
            <span className="guide-step-text">{step}</span>
          </li>
        ))}
      </Tag>
      {footnote ? <p className="guide-footnote">{footnote}</p> : null}
    </section>
  );
}

const Path = ({ children }: { children: React.ReactNode }) => (
  <span className="guide-path">{children}</span>
);
const Key = ({ children }: { children: React.ReactNode }) => (
  <kbd className="guide-key">{children}</kbd>
);

export default function Builder() {
  const [colors, setColors] = useState<Colors>(DEFAULT_COLORS);
  const [themeName, setThemeName] = useState("MyHybridTheme");
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [exportState, setExportState] = useState<"idle" | "working" | "success" | "error">("idle");
  const [fileName, setFileName] = useState("");
  const [wired, setWired] = useState(0);
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [sourceName, setSourceName] = useState("");

  const setPane = useCallback(
    (area: string, key: "background" | "text", hex: string) => {
      setColors((prev: Colors) => {
        const pane = prev[area as keyof Omit<Colors, "advanced">];
        return { ...prev, [area]: { ...pane, [key]: hex } } as Colors;
      });
    },
    []
  );
  const setAdvanced = useCallback((key: keyof Colors["advanced"], hex: string) => {
    setColors((prev: Colors) => ({ ...prev, advanced: { ...prev.advanced, [key]: hex } }));
  }, []);
  const reset = useCallback(() => {
    setColors(DEFAULT_COLORS);
    setThemeName("MyHybridTheme");
    setSwatches([]);
    setSourceName("");
    setExportState("idle");
  }, []);
  const loadSitePalette = useCallback(() => {
    setColors(SITE_PALETTE);
    setExportState("idle");
  }, []);

  /* five dominant colors -> Base, AlternateBase, Window, Text, Highlight */
  const onExtract = useCallback((theme: ReturnType<typeof mapToTheme>, picks: Swatch[]) => {
    if (!theme) return;
    setColors((prev) => ({
      editor: { background: theme.base, text: theme.text },
      binder: { background: theme.alternateBase, text: autoText(theme.alternateBase) },
      toolbar: { background: theme.window, text: autoText(theme.window) },
      inspector: { background: theme.alternateBase, text: autoText(theme.alternateBase) },
      advanced: {
        ...prev.advanced,
        activeMenuAccent: theme.highlight,
        menuFont: autoText(theme.window),
        dropdownBackground: theme.window,
        dropdownText: autoText(theme.window),
      },
    }));
    void picks;
  }, []);

  const drop = useDropZone(async (file) => {
    const picks = await extractSwatches(file, 5);
    const theme = mapToTheme(picks);
    if (!theme) throw new Error("Not enough distinct colors in that image.");
    setSwatches(picks);
    setSourceName(file.name);
    onExtract(theme, picks);
  });

  async function doExport() {
    setExportState("working");
    try {
      const result = await downloadScrtheme(colors, themeName);
      const audit = buildPackage(colors, themeName);
      setFileName(result.fileName);
      setWired(audit.wired);
      setExportState("success");
    } catch (err) {
      console.error("Unable to export Scrivener theme:", err);
      setFileName(err instanceof Error ? err.message : "Unexpected export failure.");
      setExportState("error");
    }
  }

  const built = buildPackage(colors, themeName);
  const pointersMatch =
    built.manifestEntries.length === 3 &&
    built.payloadPaths.every((p) => built.manifestEntries.includes(p));
  const style = luminance(colors.toolbar.background) > 0.5 ? "Light" : "Dark";
  const derived = [
    { role: "Link", hex: mix(colors.editor.background, "#7EB4E8", 0.45) },
    { role: "LinkVisited", hex: mix(colors.editor.background, "#C4B6E8", 0.45) },
    { role: "OutlinerGridColor", hex: mix(colors.binder.background, colors.binder.text, 0.25) },
    { role: "IndexCard NotepadLines", hex: mix(colors.inspector.background, colors.inspector.text, 0.2) },
    { role: "SearchBorder", hex: tint(colors.advanced.activeMenuAccent, 1.6) },
    { role: "PlaceholderText", hex: mix(colors.editor.text, colors.editor.background, 0.45) },
  ];

  return (
    <div className="app-shell builder">
      <header className="site-header">
        <div className="page-container header-inner">
          <div className="brand-lockup" aria-label="Scrivener Hybrid Theme Master">
            <div className="brand-mark">
              <Layers size={21} strokeWidth={1.8} />
            </div>
            <div className="brand-words">
              <span>SCRIVENER</span>
              <small>HYBRID THEME MASTER</small>
            </div>
          </div>
          <div className="header-actions">
            <button className="reset-button" type="button" onClick={loadSitePalette}>
              <ImageIcon size={14} strokeWidth={1.8} /> Adrian P Kestrel palette
            </button>
            <button className="reset-button" type="button" onClick={reset}>
              <RefreshCw size={14} strokeWidth={1.8} /> Reset colors
            </button>
          </div>
        </div>
      </header>

      <main className="page-container main-content">
        <section className="intro reveal">
          <span className="eyebrow">A WRITING SPACE THAT FEELS LIKE YOURS</span>
          <h1>
            Scrivener <span className="title-serif">Hybrid</span>
            <br className="title-break" /> Theme Master
            <span className="title-period">.</span>
          </h1>
          <p>
            Dark sidebar, bright page, or something entirely your own. Color each part of your
            workspace independently.
          </p>
        </section>

        <div className="workbench">
          {/* ------------------ PREVIEW COLUMN ------------------ */}
          <section className="preview-column reveal-late" aria-labelledby="preview-heading">
            <div className="column-heading">
              <div>
                <span className="column-eyebrow">
                  <span className="live-dot" /> LIVE PREVIEW
                </span>
                <h2 id="preview-heading">See it come to life.</h2>
              </div>
              <span className="preview-hint">Changes appear instantly</span>
            </div>

            <ScrivenerPreview colors={colors} activeArea={activeArea} />

            <div className="preview-caption">
              <span>
                <span className="caption-spark" /> YOUR CURRENT MIX
              </span>
              <span>An illustrative preview of Scrivener 3 for Windows.</span>
              <span className="mobile-swipe-hint">Swipe sideways to see every pane.</span>
            </div>

            <div className="install-note">
              <div className="install-icon">
                <ShieldCheck size={18} strokeWidth={1.6} />
              </div>
              <div>
                <strong>When you&apos;re ready to write</strong>
                <p>
                  Installation steps are in the sidebar under <em>How to install your theme</em>.
                  {style === "Dark" ? (
                    <>
                      {" "}
                      One thing no theme file can change: the system title bar is drawn by Windows
                      itself. For a dark frame, set Windows Settings &gt; Personalization &gt; Colors
                      &gt; <em>Choose your default app mode</em> to Dark — Scrivener (3.1.5+)
                      follows it automatically.
                    </>
                  ) : null}
                </p>
              </div>
            </div>
          </section>

          {/* ------------------ CONTROLS COLUMN ------------------ */}
          <aside className="controls-column reveal-side" aria-labelledby="controls-heading">
            <div className="column-heading">
              <div>
                <span className="column-eyebrow">YOUR PALETTE</span>
                <h2 id="controls-heading">Choose your colors.</h2>
              </div>
              <span className="controls-count">04 AREAS</span>
            </div>

            <div className="palette-list">
              {AREAS.map((area) => {
                const Icon = AREA_ICONS[area.id as keyof typeof AREA_ICONS];
                return (
                  <div
                    key={area.id}
                    className={`palette-section ${activeArea === area.id ? "palette-section-active" : ""}`}
                    onMouseEnter={() => setActiveArea(area.id)}
                    onMouseLeave={() => setActiveArea(null)}
                    onFocusCapture={() => setActiveArea(area.id)}
                    onBlurCapture={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setActiveArea(null);
                    }}
                  >
                    <div className="palette-section-heading">
                      <span className="section-number">{area.number}</span>
                      <div className="section-name">
                        <h3>{area.title}</h3>
                        <span>{area.description}</span>
                      </div>
                      <Icon size={17} strokeWidth={1.6} className="section-icon" aria-hidden="true" />
                    </div>
                    <div className="palette-fields">
                      <ColorControl
                        id={`${area.id}-background`}
                        name={`${area.id} background`}
                        label="Background Color"
                        value={(colors[area.id as keyof Omit<Colors, "advanced">] as { background: string }).background}
                        onChange={(hex) => setPane(area.id, "background", hex)}
                      />
                      <ColorControl
                        id={`${area.id}-text`}
                        name={`${area.id} text`}
                        label="Text Color"
                        value={(colors[area.id as keyof Omit<Colors, "advanced">] as { text: string }).text}
                        onChange={(hex) => setPane(area.id, "text", hex)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <section
              className={`advanced-section ${activeArea === "advanced" ? "palette-section-active" : ""}`}
              aria-labelledby="advanced-heading"
              onMouseEnter={() => setActiveArea("advanced")}
              onMouseLeave={() => setActiveArea(null)}
              onFocusCapture={() => setActiveArea("advanced")}
              onBlurCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setActiveArea(null);
              }}
            >
              <div className="advanced-heading">
                <span className="column-eyebrow">THE HIDDEN DETAILS</span>
                <h3 id="advanced-heading">Advanced Menu &amp; Dropdown Overrides</h3>
                <p>Fine-tune the menu colors Scrivener&apos;s appearance settings leave behind.</p>
              </div>
              <div className="advanced-fields">
                {ADVANCED.map((control) => (
                  <ColorControl
                    key={control.key}
                    id={control.id}
                    name={control.key}
                    label={control.label}
                    value={colors.advanced[control.key]}
                    onChange={(hex) => setAdvanced(control.key, hex)}
                  />
                ))}
              </div>
            </section>

            {/* FROM AN IMAGE */}
            <div className="drop-section">
              <div className="drop-heading">
                <span className="column-eyebrow">FROM AN IMAGE</span>
                <h3>Extract a palette.</h3>
                <p>
                  Drop a color breakdown or mood image. The five dominant colors map onto Base,
                  AlternateBase, Window, Text and Highlight.
                </p>
              </div>
              <div
                className={`drop-zone drop-zone-${drop.state}`}
                role="button"
                tabIndex={0}
                aria-label="Drop a palette image or click to browse"
                {...drop.handlers}
              >
                <input
                  ref={drop.inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={drop.onInputChange}
                />
                {drop.state === "busy" ? (
                  <Loader2 size={18} className="spin-icon" />
                ) : drop.state === "error" ? (
                  <TriangleAlert size={18} />
                ) : (
                  <ImageIcon size={18} strokeWidth={1.6} />
                )}
                <span className="drop-zone-label">
                  {drop.state === "over"
                    ? "Release to sample colors"
                    : drop.state === "busy"
                      ? "Sampling pixels…"
                      : drop.state === "error"
                        ? drop.error
                        : "Drag a palette image here, or click to browse"}
                </span>
              </div>
              {swatches.length > 0 && (
                <div className="swatch-row" aria-label={`Colors sampled from ${sourceName}`}>
                  {swatches.map((s, i) => (
                    <div className="swatch" key={s.hex + i}>
                      <span
                        className="swatch-chip"
                        style={{ backgroundColor: s.hex }}
                        title={`${s.hex} · ${Math.round(s.weight * 100)}%`}
                      />
                      <code>{s.hex}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <GuideCard
              eyebrow="CUSTOM BACKGROUND TEXTURE"
              title="Add a page texture."
              icon={<Layers size={17} strokeWidth={1.7} />}
              as="ul"
              steps={[
                <>
                  Go to <Path>File &gt; Options</Path> (or press <Key>F12</Key>) inside Scrivener.
                </>,
                <>
                  Navigate to <Path>Appearance &gt; Main Editor</Path> in the left menu.
                </>,
                <>
                  In the <Path>Options</Path> tab, make sure <strong>Use fixed width editor</strong>{" "}
                  is checked.
                </>,
                <>
                  Switch to the <Path>Colors</Path> tab, select{" "}
                  <strong>Fixed Width Background</strong> from the list.
                </>,
                <>
                  Click <strong>Choose Texture…</strong>, select your favorite image tile file, and
                  hit <strong>Apply</strong>.
                </>,
              ]}
              footnote="Textures are chosen inside Scrivener so they stay with your local options and survive theme switches."
            />

            <GuideCard
              eyebrow="HOW TO INSTALL YOUR THEME"
              title="Four steps to a new workspace."
              icon={<Download size={17} strokeWidth={1.7} />}
              as="ol"
              steps={[
                <>
                  Click the <strong>Export .scrtheme File</strong> button at the bottom of this app.
                </>,
                <>
                  Open Scrivener and navigate to <Path>Window &gt; Themes &gt; Import Theme…</Path>.
                </>,
                <>
                  Select your downloaded <code>.scrtheme</code> package file from your Downloads
                  folder.
                </>,
                <>
                  Go back to <Path>Window &gt; Themes</Path> and select your new custom theme name
                  from the list to instantly apply your look!
                </>,
              ]}
              footnote="Restart Scrivener after switching themes so every pane picks up the new colors."
            />

            <p className="privacy-note">
              <ShieldCheck size={16} strokeWidth={1.7} aria-hidden="true" />
              <span>
                Privacy Built-In: This app only generates color layers. It cannot read your
                computer&apos;s font files. To apply your custom local fonts, use Scrivener&apos;s
                native &apos;Load Preferences&apos; option.
              </span>
            </p>

            <div className="export-area">
              <div className="name-field">
                <label className="name-label" htmlFor="theme-name">
                  THEME NAME (SETS EVERY INTERNAL SLUG)
                </label>
                <input
                  className="name-input"
                  id="theme-name"
                  type="text"
                  spellCheck={false}
                  maxLength={48}
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  aria-label="Theme name used for the archive filename and pointer slugs"
                />
                <span className="name-hint">
                  Saved as a single <code>.scrtheme</code> archive — never a bare <code>.zip</code>.
                </span>
              </div>

              <button
                className="export-button"
                type="button"
                onClick={() => void doExport()}
                disabled={exportState === "working"}
              >
                <span>{exportState === "working" ? "Building your theme..." : "Export .scrtheme File"}</span>
                <span className="export-button-icon">
                  {exportState === "working" ? (
                    <RefreshCw size={18} className="spin-icon" />
                  ) : exportState === "success" ? (
                    <Check size={19} />
                  ) : (
                    <Download size={19} />
                  )}
                </span>
              </button>

              <p
                className={`export-message export-message-${exportState}`}
                role="status"
                aria-live="polite"
              >
                {exportState === "success" ? (
                  <Check size={13} />
                ) : exportState === "error" ? (
                  <TriangleAlert size={13} />
                ) : (
                  <ShieldCheck size={13} />
                )}
                {exportState === "success"
                  ? `${fileName}.scrtheme is ready — ${wired}/12 picker colors wired, 4 flat files.`
                  : exportState === "error"
                    ? fileName || "Export failed. Please try again."
                    : "Built locally in your browser. Nothing is uploaded."}
              </p>

              {/* ZIP PAYLOAD — FLAT ROOT */}
              <div className="package-strip">
                <div className="package-strip-head">
                  <span className="package-strip-title">
                    <FileArchive
                      size={12}
                      strokeWidth={2}
                      style={{ verticalAlign: "-1px", marginRight: 7 }}
                    />
                    ZIP PAYLOAD — FLAT ROOT
                  </span>
                  <span className="package-strip-badge">{built.archiveFileName}</span>
                </div>
                {built.files.map((file, i) => (
                  <div className={`package-file ${file.isPointerTarget ? "pointer" : ""}`} key={file.path}>
                    <span className="package-file-index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="package-file-name">{file.path}</span>
                    <span className="package-file-role">
                      {file.isPointerTarget ? (
                        <>
                          <Check
                            size={10}
                            strokeWidth={2.2}
                            style={{ verticalAlign: "-1px", marginRight: 4 }}
                            aria-hidden="true"
                          />
                          {pointersMatch
                            ? `${style.toUpperCase()} · POINTERS MATCH`
                            : `${style.toUpperCase()} MANIFEST`}
                        </>
                      ) : (
                        file.role
                      )}
                    </span>
                  </div>
                ))}
                <p className="package-note">
                  Exactly 4 members, 0 subdirectories — written with <code>zip.file()</code> only,
                  DEFLATE·6, DOS platform flags, CRLF. Native Scrivener formats:{" "}
                  <code>Role(R,G,B)</code> palette and <code>[Options]</code> hex color keys.{" "}
                  <code>{built.manifestFileName}</code> declares{" "}
                  <code>style=&quot;{style}&quot;</code>; all 12 picker values are audited against
                  the payload before download.
                  {pointersMatch ? (
                    <Check size={12} strokeWidth={2.4} style={{ verticalAlign: "-1px", marginLeft: 6 }} />
                  ) : null}
                </p>
              </div>

              {/* SUPPORT THE PROJECT */}
              <aside className="support-card" aria-labelledby="support-heading">
                <div className="support-head">
                  <span className="support-eyebrow">
                    <span className="support-spark" aria-hidden="true" />
                    SUPPORT THE PROJECT
                  </span>
                  <h3 id="support-heading">Free for every writer.</h3>
                </div>
                <p className="support-copy">
                  This theme generator is completely free and open-source! If it saved you hours of
                  tedious layout configuring and made your writing space beautiful, consider buying
                  the creator a coffee or sponsoring the project to keep updates rolling.
                </p>
                <div className="support-actions">
                  <a
                    className="support-button support-button-sponsor"
                    href={LINKS.github}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className="support-button-icon">
                      <Check size={15} strokeWidth={2} aria-hidden="true" />
                    </span>
                    Follow on GitHub
                  </a>
                  <a
                    className="support-button support-button-coffee"
                    href={LINKS.buyMeACoffee}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className="support-button-icon">
                      <Layers size={15} strokeWidth={2} aria-hidden="true" />
                    </span>
                    Buy Me a Coffee
                  </a>
                  <a
                    className="support-button support-button-coffee support-button-social support-button-facebook"
                    href={LINKS.facebookFollow}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className="support-button-icon">
                      <ShieldCheck size={15} strokeWidth={2} aria-hidden="true" />
                    </span>
                    Follow on Facebook
                  </a>
                  <a
                    className="support-button support-button-coffee support-button-social"
                    href={LINKS.instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className="support-button-icon">
                      <InstagramIcon />
                    </span>
                    Follow on Instagram
                  </a>
                </div>
                <p className="support-footnote">
                  No paywall, no accounts, no tracking — donations are entirely optional and never
                  unlock anything.
                </p>
              </aside>

              {/* derived roles written by the exporter */}
              <div className="package-strip">
                <div className="package-strip-head">
                  <span className="package-strip-title">
                    <Layers size={12} strokeWidth={2} style={{ verticalAlign: "-1px", marginRight: 7 }} />
                    DERIVED ROLES — EXPORTER WRITES THESE
                  </span>
                </div>
                {derived.map((d) => (
                  <div className="package-file" key={d.role}>
                    <span className="package-file-index">{rgbTriple(d.hex).split(",")[0]}</span>
                    <span className="package-file-name">{d.role}</span>
                    <span className="package-file-role">
                      {d.hex} · {rgbTriple(d.hex)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="about-section page-container" aria-labelledby="about-heading">
          <div className="about-title">
            <span className="column-eyebrow">ABOUT THIS TOOL</span>
            <h2 id="about-heading">Open by design.</h2>
          </div>
          <div className="about-copy">
            <p>
              Your colors become a Qt palette, a color-options overlay, a full-workspace QSS
              stylesheet — window shells, toolbars, file trees and splitters included — and a
              Scrivener XML manifest, each written in the exact native format found inside
              Scrivener&apos;s own shipped themes. Exactly four files, named after your theme, packed
              flat at the root with DEFLATE compression and DOS platform flags. JSZip does all of it
              in your browser; nothing is uploaded.
            </p>
            <p>
              Once loaded, this page and its bundled code can work offline. There are no accounts,
              analytics, tracking scripts, external fonts, or background requests. No font file is
              included in the download.
            </p>
          </div>
        </section>

        <footer className="site-footer page-container">
          <div>
            <span className="footer-brand">SCRIVENER HYBRID THEME MASTER</span>
            <p>Distributed under the MIT License. Built with JSZip.</p>
          </div>
          <a href={LINKS.repo} target="_blank" rel="noreferrer noopener">
            View Source on GitHub <FileArchive size={15} strokeWidth={1.7} />
          </a>
        </footer>
      </main>
    </div>
  );
}
