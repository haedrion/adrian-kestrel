export type Colors = {
  binder: { background: string; text: string };
  editor: { background: string; text: string };
  inspector: { background: string; text: string };
  toolbar: { background: string; text: string };
  advanced: {
    menuFont: string;
    activeMenuAccent: string;
    dropdownBackground: string;
    dropdownText: string;
  };
};

/* The original builder's default hybrid: dark chrome, bright page. */
export const DEFAULT_COLORS: Colors = {
  binder: { background: "#2D2D2D", text: "#FFFFFF" },
  editor: { background: "#FFFFFF", text: "#000000" },
  inspector: { background: "#F0F0F0", text: "#333333" },
  toolbar: { background: "#E0E0E0", text: "#111111" },
  advanced: {
    menuFont: "#FFFFFF",
    activeMenuAccent: "#444444",
    dropdownBackground: "#222222",
    dropdownText: "#DDDDDD",
  },
};

export const AREAS = [
  { id: "binder", number: "01", title: "Binder Sidebar", description: "The folder tree" },
  { id: "editor", number: "02", title: "Main Text Editor", description: "The typing page" },
  { id: "inspector", number: "03", title: "Inspector Panel", description: "The notes pane" },
  { id: "toolbar", number: "04", title: "Top Toolbar & Menu Bars", description: "The top controls" },
] as const;

export const ADVANCED = [
  { id: "menu-font", key: "menuFont", label: "Main Top Menu Font Color" },
  { id: "menu-accent", key: "activeMenuAccent", label: "Active Menu Accent/Hover Color" },
  { id: "dropdown-background", key: "dropdownBackground", label: "Dropdown Menu Background" },
  { id: "dropdown-text", key: "dropdownText", label: "Dropdown Menu Text Color" },
] as const;

/** Adrian Kestrel palette — one-click preset: warm paper editor, teal-scripted
 *  dark chrome, honey-gold text and a deep bronze menu bar. */
export const SITE_PALETTE: Colors = {
  binder: { background: "#1D2223", text: "#D9C894" },
  editor: { background: "#F5E8C7", text: "#000000" },
  inspector: { background: "#D9C894", text: "#333333" },
  toolbar: { background: "#2C1500", text: "#AE7400" },
  advanced: {
    menuFont: "#009984",
    activeMenuAccent: "#005D57",
    dropdownBackground: "#2C1500",
    dropdownText: "#F5F5F5",
  },
};
