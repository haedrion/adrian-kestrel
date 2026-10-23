import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Columns2,
  FileText,
  Folder,
  Minus,
  PanelRight,
  Save,
  Search,
  Square,
  X,
} from "lucide-react";
import { mix, tint, luminance } from "../lib/color";
import type { Colors } from "../lib/scrtheme";

const MENUS = ["File", "Edit", "View", "Project", "Documents", "Format", "Tools", "Window", "Help"];

function menuItems(name?: string) {
  if (name === "File") return ["New Project...", "Open...", "Save", "Close Project"];
  if (name === "Edit") return ["Undo", "Redo", "Find", "Select All"];
  return ["Show Binder", "Show Inspector", "Split Editor", "Preferences..."];
}

type Props = { colors: Colors; activeArea: string | null };

/* Faithful, illustrative Scrivener 3 for Windows window. */
export default function ScrivenerPreview({ colors, activeArea }: Props) {
  const [open, setOpen] = useState<{ name: string; left: number } | null>(null);
  const [hover, setHover] = useState(1);
  const { binder, editor, inspector, toolbar, advanced } = colors;

  useEffect(() => {
    if (activeArea === "advanced") setOpen({ name: "File", left: 16 });
  }, [activeArea]);

  const chrome = { backgroundColor: toolbar.background, color: toolbar.text };
  const menubarStyle = {
    color: advanced.menuFont,
    "--menu-accent": advanced.activeMenuAccent,
    "--menu-hover": mix(toolbar.background, "#FFFFFF", 0.1),
  } as React.CSSProperties;
  const edge = tint(advanced.activeMenuAccent, 1.6);
  const items = menuItems(open?.name);

  return (
    <div className="preview-frame">
      <div className="window-canvas">
        <div className={`window-chrome ${activeArea === "toolbar" ? "pane-highlight" : ""}`} style={chrome}>
          <div className="window-titlebar">
            <div className="window-app-brand">
              <span className="window-app-icon">S</span>
              <span>Scrivener</span>
            </div>
            <span className="window-project-title">Stillwater - Scrivener</span>
            <div className="window-actions" aria-hidden="true">
              <Minus size={12} />
              <Square size={10} />
              <X size={13} />
            </div>
          </div>

          <div className={`window-menubar ${activeArea === "advanced" ? "menu-preview-highlight" : ""}`} style={menubarStyle}>
            {MENUS.map((name) => (
              <button
                key={name}
                type="button"
                className={`window-menu-button ${open?.name === name ? "is-open" : ""}`}
                aria-label={`Preview ${name} menu`}
                aria-expanded={open?.name === name}
                onClick={(e) => {
                  const left = e.currentTarget.offsetLeft;
                  setHover(1);
                  setOpen((prev) => (prev?.name === name ? null : { name, left }));
                }}
              >
                {name}
              </button>
            ))}
          </div>

          {open && (
            <div
              className="window-dropdown"
              aria-hidden="true"
              style={{
                left: `min(${open.left}px, calc(100% - 208px))`,
                backgroundColor: advanced.dropdownBackground,
                color: advanced.dropdownText,
                "--menu-accent": advanced.activeMenuAccent,
                "--menu-selected-text": advanced.menuFont,
                "--menu-edge": edge,
              } as React.CSSProperties}
            >
              {items.map((item, i) => (
                <div
                  key={item}
                  className={`window-dropdown-item ${i === hover ? "is-highlighted" : ""}`}
                  onMouseEnter={() => setHover(i)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          <div className="window-toolbar" aria-hidden="true">
            <div className="toolbar-group">
              <div className="toolbar-tool">
                <Folder size={16} strokeWidth={1.6} />
                <span>Binder</span>
              </div>
              <div className="toolbar-separator" />
              <div className="toolbar-tool">
                <FileText size={16} strokeWidth={1.6} />
                <span>New Text</span>
              </div>
              <div className="toolbar-tool">
                <Save size={16} strokeWidth={1.6} />
                <span>New Folder</span>
              </div>
            </div>
            <div className="toolbar-group toolbar-group-right">
              <div className="toolbar-tool">
                <Columns2 size={16} strokeWidth={1.6} />
                <span>Split</span>
              </div>
              <div className="toolbar-tool">
                <Search size={16} strokeWidth={1.6} />
                <span>Search</span>
              </div>
              <div className="toolbar-tool">
                <PanelRight size={16} strokeWidth={1.6} />
                <span>Inspector</span>
              </div>
            </div>
          </div>
        </div>

        <div className="window-body">
          <div
            className={`window-binder preview-pane ${activeArea === "binder" ? "pane-highlight" : ""}`}
            style={{
              backgroundColor: binder.background,
              color: binder.text,
              "--selection-accent": advanced.activeMenuAccent,
            } as React.CSSProperties}
          >
            <div className="pane-topline">
              <span>BINDER</span>
              <ChevronDown size={15} />
            </div>
            <div className="binder-tree">
              <div className="tree-row tree-root">
                <ChevronRight size={12} />
                <Folder size={14} strokeWidth={1.7} />
                <span>Draft</span>
              </div>
              <div className="tree-row tree-child tree-selected">
                <FileText size={13} strokeWidth={1.6} />
                <span>Opening scene</span>
              </div>
              <div className="tree-row tree-child">
                <FileText size={13} strokeWidth={1.6} />
                <span>At the harbor</span>
              </div>
              <div className="tree-row tree-child">
                <FileText size={13} strokeWidth={1.6} />
                <span>What we leave behind</span>
              </div>
              <div className="tree-row tree-root tree-spaced">
                <ChevronRight size={12} />
                <Folder size={14} strokeWidth={1.7} />
                <span>Characters</span>
              </div>
              <div className="tree-row tree-root">
                <ChevronRight size={12} />
                <Folder size={14} strokeWidth={1.7} />
                <span>Research</span>
              </div>
              <div className="tree-row tree-root">
                <ChevronRight size={12} />
                <Folder size={14} strokeWidth={1.7} />
                <span>Notes &amp; ideas</span>
              </div>
            </div>
            <div className="binder-footer">
              <Folder size={13} strokeWidth={1.6} />
              <span>Stillwater</span>
            </div>
          </div>

          <div
            className={`window-editor preview-pane ${activeArea === "editor" ? "pane-highlight" : ""}`}
            style={{ backgroundColor: editor.background, color: editor.text }}
          >
            <div className="editor-tab">
              <FileText size={12} />
              <span>Opening scene</span>
              <ChevronDown size={15} />
            </div>
            <div className="manuscript">
              <span className="manuscript-chapter">CHAPTER ONE</span>
              <h3>The space between things</h3>
              <p>
                The room was quiet except for the rain making its slow argument against the windows.
                Mara set her notebook on the table and waited for the first sentence to arrive.
              </p>
              <p>
                Outside, the city was waking. Inside, there was only the small, familiar possibility
                of a blank page.
              </p>
              <p>
                She picked up her pen. For a moment, that was enough.
                <span className="typing-cursor" aria-hidden="true" />
              </p>
            </div>
          </div>

          <div
            className={`window-inspector preview-pane ${activeArea === "inspector" ? "pane-highlight" : ""}`}
            style={{ backgroundColor: inspector.background, color: inspector.text }}
          >
            <div className="pane-topline">
              <span>INSPECTOR</span>
              <ChevronDown size={15} />
            </div>
            <div className="inspector-tabs">
              <span className="tab-active">Synopsis</span>
              <span>Notes</span>
            </div>
            <div className="inspector-content">
              <div className="inspector-label">SYNOPSIS</div>
              <p>A return to the town where it all began. The first page opens on a rainy morning.</p>
              <div className="inspector-divider" />
              <div className="inspector-label">DOCUMENT NOTES</div>
              <p>Keep the opening quiet. Let the setting do the talking before Mara does.</p>
              <div className="note-lines" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        </div>

        <div className="window-statusbar" style={chrome}>
          <span>Draft / Opening scene</span>
          <span>
            284 words <span className="status-divider">|</span> 100%
          </span>
        </div>
      </div>
    </div>
  );
}

export { luminance };
