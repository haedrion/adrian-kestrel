// @ts-nocheck
/* Scrivener Hybrid Theme Master - theme file writers.
   Ported 1:1 from the original builders: every exported theme is written as
   exactly four flat root members (.pal, .prefs, .qss, .xml) with CRLF endings. */

const bu = "MyHybridTheme";

function ti(T){const U=T.replace("#","");return[parseInt(U.substring(0,2),16),parseInt(U.substring(2,4),16),parseInt(U.substring(4,6),16)]}function ll(T){const[U,p,f]=ti(T);return`${U},${p},${f}`}function Is(T,U,p){const f=x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,"0");return`#${f(T)}${f(U)}${f(p)}`.toUpperCase()}function re(T,U,p){const f=ti(T),x=ti(U);return Is(f[0]*(1-p)+x[0]*p,f[1]*(1-p)+x[1]*p,f[2]*(1-p)+x[2]*p)}function Ps(T,U){const[p,f,x]=ti(T).map(y=>y/255),s=Math.max(p,f,x),m=Math.min(p,f,x),o=(s+m)/2,c=s-m,h=c===0?0:o>.5?c/(2-s-m):c/(s+m);let w=0;c!==0&&(s===p?w=(f-x)/c+(f<x?6:0):s===f?w=(x-p)/c+2:w=(p-f)/c+4,w/=6);const E=Math.min(.96,o*U),k=E<.5?E*(1+h):E+h-E*h,b=2*E-k,C=y=>(y<0&&(y+=1),y>1&&(y-=1),y<1/6?b+(k-b)*6*y:y<1/2?k:y<2/3?b+(k-b)*(2/3-y)*6:b);return Is(C(w+1/3)*255,C(w)*255,C(w-1/3)*255)}function Wa(T){const[U,p,f]=ti(T).map(x=>{const s=x/255;return s<=.03928?s/12.92:((s+.055)/1.055)**2.4});return .2126*U+.7152*p+.0722*f}
const Ws=".scrtheme",tm="Scrivener Hybrid Theme Master",E1=[".pal",".prefs",".qss",".xml"];function tc(T){const U=T.trim().replace(/\.(zip|scrtheme)$/i,"").replace(/[^\w.-]+/g,"").replace(/^[.]+/,"").replace(/\.{2,}/g,".");return U.length?U.slice(0,48):bu}function xu(T){return`${T}.pal`}function ec(T){return`${T}.prefs`}function ac(T){return`${T}.qss`}function _u(T){return`${T}.xml`}function em(T){return`${T}${Ws}`}function w1(){return new Date().toISOString().replace(/\.\d{3}Z$/,"Z")}function ei(T){return Wa(T.toolbar.background)>.5?"Light":"Dark"}function am(T){const U=Wa(T.editor.background)>.5;return{link:U?re("#7EB4E8",T.editor.text,.45):"#7EB4E8",visited:U?re("#C4B6E8",T.editor.text,.45):"#C4B6E8"}}function z1(T){const{link:U,visited:p}=am(T),f=Wa(T.toolbar.background)>.5;return[["Base",T.editor.background],["AlternateBase",T.binder.background],["Window",T.toolbar.background],["ToolTipBase",T.inspector.background],["Button",T.toolbar.background],["Highlight",T.advanced.activeMenuAccent],["WindowText",T.toolbar.text],["Text",T.editor.text],["BrightText",re(T.editor.text,T.editor.background,.08)],["ButtonText",T.toolbar.text],["HighlightedText",T.binder.text],["ToolTipText",T.inspector.text],["PlaceholderText",re(T.editor.text,T.editor.background,.45)],["Link",U],["LinkVisited",p],["Light",re(T.toolbar.background,"#FFFFFF",f?.55:.25)],["Midlight",re(T.toolbar.background,"#FFFFFF",.1)],["Mid",re(T.toolbar.background,"#FFFFFF",.05)],["Dark",re(T.toolbar.background,"#000000",f?.2:.65)],["Shadow",re(T.toolbar.background,"#000000",f?.45:.85)]]}function A1(T){return[["WindowText",re(T.toolbar.text,T.toolbar.background,.5)],["Text",re(T.editor.text,T.editor.background,.5)],["ButtonText",re(T.toolbar.text,T.toolbar.background,.5)],["Highlight",re(T.advanced.activeMenuAccent,T.toolbar.background,.75)]]}const k1={Base:"Used mostly as the background color for text entry widgets",AlternateBase:"Used as the alternate background color in views with alternating row colors",Window:"A general background color",ToolTipBase:"Used as the background color for ToolTip",Button:"The general button background color",Highlight:"A background color to indicate a selected item or the current item",WindowText:"A general foreground color",Text:"The foreground color used with Base",BrightText:"A text color that is very different from WindowText",ButtonText:"A foreground color used with the Button color",HighlightedText:"A text color that contrasts with Highlight",ToolTipText:"Used as the foreground color for ToolTip",PlaceholderText:"Used as the placeholder color for various text input widgets",Link:"A text color used for unvisited hyperlinks",LinkVisited:"A text color used for already visited hyperlinks",Light:"Lighter than Button color",Midlight:"Between Button and Light",Mid:"Between Button and Dark",Dark:"Darker than Button",Shadow:"very dark color i.e. black"};function C1(T){const U=(x,s)=>{const m=k1[x];return`${x}(${ll(s)})${m?` //${m}`:""}`},p=z1(T),f=(x,s)=>p.slice(x,s).map(([m,o])=>U(m,o)).join(`
`);return[f(0,6),"","//TEXTS",f(6,15),"","//BASE PALETTE SHADES",f(15,20),"","//DISABLED",A1(T).map(([x,s])=>`${x}:Disabled(${ll(s)})`).join(`
`),""].join(`
`)}function O1(T,U,p){const{binder:f,editor:x,inspector:s,toolbar:m,advanced:o}=T,{link:c,visited:h}=am(T),w=o.activeMenuAccent,E=re(m.background,x.background,.15),k=re(f.background,f.text,.25),b=[["Appearance\\Colors\\BinderBackground",f.background],["Appearance\\Colors\\OutlinerBackground",x.background],["Appearance\\Colors\\OutlinerFolderTitlesTextColor",x.text],["Appearance\\Colors\\OutlinerGroupTitlesTextColor",x.text],["Appearance\\Colors\\OutlinerSynopsesTextColor",re(x.text,x.background,.35)],["Appearance\\Colors\\OutlinerGridColor",k],["Appearance\\Colors\\CorkboardBackground",f.background],["Appearance\\Colors\\FreeformBackground",f.background],["Appearance\\Colors\\LabelViewBackground",f.background],["Appearance\\Colors\\CollectionsBackgroundDarkness","80"],["TextEditing\\Colors\\Page",x.background],["TextEditing\\Colors\\Text",x.text],["TextEditing\\Colors\\PageViewBackgroundColor",E],["TextEditing\\Colors\\MainEditorFixedWidthBackground",E],["TextEditing\\Colors\\Links",c],["TextEditing\\Colors\\VisitedLinks",h],["TextEditing\\Colors\\Invisibles",re(x.text,x.background,.6)],["TextEditing\\Colors\\HighlightBackground",w],["TextEditing\\Colors\\HighlightText",f.text],["TextEditing\\Colors\\SearchBackground",w],["TextEditing\\Colors\\SearchBorder",Ps(w,1.6)],["TextEditing\\Colors\\FullScreenBackground",x.background],["TextEditing\\Colors\\FullScreenText",x.text],["TextEditing\\Colors\\FullScreenLinks",c],["TextEditing\\Colors\\FullScreenVisitedLinks",h],["TextEditing\\Colors\\FullScreenHighlightBackground",w],["TextEditing\\Colors\\FullScreenHighlightText",f.text],["FullScreen\\Colors\\Background",f.background],["Appearance\\Colors\\DocumentNotesBackground",s.background],["Appearance\\Colors\\BookmarksBackground",s.background],["Appearance\\Colors\\RecentSearchResultsBackground",s.background],["Appearance\\Colors\\CommentsAreaBackgroundColorMainWindow",s.background],["Appearance\\Colors\\CommentsAreaBackgroundColorQuickReference",s.background],["Appearance\\Colors\\ScratchPadBackground",s.background],["Appearance\\Colors\\ScratchPadText",s.text],["Appearance\\Colors\\SnapshotTextBackground",s.background],["TextEditing\\Colors\\CommentsBackground",s.background],["TextEditing\\Colors\\FootnotesBackground",s.background],["TextEditing\\Colors\\FootnotesText",s.text],["FullScreen\\Colors\\DocumentNotesBackground",s.background],["FullScreen\\Colors\\SynopsisBackground",s.background],["FullScreen\\Colors\\CommentsAreaBackgroundColor",s.background],["IndexCard\\Colors\\Background",s.background],["IndexCard\\Colors\\NotepadLines",re(s.background,s.text,.2)],["IndexCard\\Colors\\Border",k],["IndexCard\\Colors\\Divider",k],["IndexCard\\Colors\\Status",w]];return b.push(["TextEditing\\Colors\\MainEditorFixedWidthBackgroundImage","@ByteArray()"],["FullScreen\\Colors\\BackgroundImage","@ByteArray()"]),`; ${tm} — ${U}.prefs (color options only)
; Generated locally in the browser on ${p}. Style: ${ei(T)}.
[Options]
`+b.map(([C,y])=>`${C}=${y}`).join(`
`)+`
`}function N1(T,U){const p=ll(Ps(T.advanced.activeMenuAccent,1.6)),f=ll(re(T.editor.text,T.editor.background,.45)),x=ll(re(T.toolbar.text,T.toolbar.background,.5)),s=ei(T)==="Light"?"LightMode":"DarkMode";return`/* ${tm} — ${U}.qss
   Canonical Scrivener stylesheet. Colors resolve through ${xu(U)};
   indicator icons resolve from Scrivener's built-in ${s} resources. */

/* --- Workspace shell: window frames, toolbars, file trees, splitters --- */

QMainWindow, QDialog, QDockWidget {
    background-color: palette(window);
    color: palette(window-text);
}

QToolBar {
    background-color: palette(window);
    border: none;
}

QToolBar QToolButton {
    background: transparent;
}

QTreeView, QListView, QTableView {
    background-color: palette(alternate-base);
    color: palette(text);
    border: none;
}

QSplitter::handle {
    background-color: palette(dark);
}

QToolTip {
    color: palette(text);
    background-color: palette(base);
    border: 1px solid palette(dark);
    border-radius: 4px;
}

QStatusBar {
    background-color: palette(alternate-base);
    color: rgb(${f});
}

QMenuBar {
    background-color: palette(alternate-base);
    border-bottom: 2px solid transparent;
}

QMenuBar::item {
    spacing: 2px;
    padding: 3px 4px;
    background: transparent;
}

QMenuBar::item:selected {
    background-color: palette(midlight);
    border-left: 1px solid palette(midlight);
    border-right: 1px solid palette(midlight);
}

QMenuBar::item:pressed {
    background-color: palette(highlight);
    border-left: 1px solid palette(dark);
    border-right: 1px solid palette(dark);
}

QMenu {
    background-color: palette(window);
    border: 1px solid palette(shadow);
}

QMenu::item {
    min-width: 120px !important;
    /*horrid workaround qt bug where shortcuts overlap menu text*/
    border: 1px solid transparent;
    padding: 1px 20px 1px 26px !important;
    margin: 1px !important;
}

QMenu::item:disabled {
    color: rgb(${x});
}

QMenu::item:selected {
    border-color: rgb(${p});
    background: palette(highlight);
    color: palette(highlighted-text);
}

QMenu::icon:checked {
    background-color: palette(background);
    border: 1px solid rgb(${p});
    border-radius: 2px;
}

QMenu::right-arrow {
    width: 10px;
    height: 10px;
    margin-right: 1px;
}

QMenu::separator {
    height: 1px;
    background: palette(alternate-base);
    margin-left: 10px;
    margin-right: 10px;
}

QMenu::indicator {
    position: absolute!important;
    top: 2px!important;
    left: 2px!important;
    width: 13px!important;
    height: 13px!important;
}

QMenu::indicator:non-exclusive:checked {
    image: url(:/Resources/${s}/icon_checkbox_checked.svg);
    padding-left: 2px;
}

QMenu::indicator:non-exclusive:unchecked {
    image: url(:/Resources/${s}/icon_checkbox_unchecked.svg);
    padding-left: 2px;
}

QMenu::indicator:exclusive:checked {
    image: url(:/Resources/${s}/icon_radiobutton_checked.svg);
    padding-left: 2px;
}

QMenu::indicator:exclusive:unchecked {
    image: url(:/Resources/${s}/icon_radiobutton_unchecked.svg);
    padding-left: 2px;
}

QCheckBox::indicator {
    width: 13px;
    height: 13px;
}

QCheckBox::indicator:checked,
QTreeView::indicator:checked,
QTableView::indicator:checked,
QGroupBox::indicator:checked {
    image: url(:/Resources/${s}/icon_checkbox_checked.svg);
}

QCheckBox::indicator:checked:pressed,
QTreeView::indicator:checked:pressed,
QTableView::indicator:checked:pressed,
QGroupBox::indicator:checked:pressed {
    image: url(:/Resources/${s}/icon_checkbox_checked_pressed.svg);
}

QCheckBox::indicator:checked:disabled,
QTreeView::indicator:checked:disabled,
QTableView::indicator:checked:disabled,
QGroupBox::indicator:checked:disabled {
    image: url(:/Resources/${s}/icon_checkbox_checked_disabled.svg);
}

QCheckBox::indicator:unchecked,
QTreeView::indicator:unchecked,
QTableView::indicator:unchecked,
QGroupBox::indicator:unchecked {
    image: url(:/Resources/${s}/icon_checkbox_unchecked.svg);
}

QCheckBox::indicator:unchecked:pressed,
QTreeView::indicator:unchecked:pressed,
QTableView::indicator:unchecked:pressed,
QGroupBox::indicator:unchecked:pressed {
    image: url(:/Resources/${s}/icon_checkbox_unchecked_pressed.svg);
}

QCheckBox::indicator:unchecked:disabled,
QTreeView::indicator:unchecked:disabled,
QTableView::indicator:unchecked:disabled,
QGroupBox::indicator:unchecked:disabled {
    image: url(:/Resources/${s}/icon_checkbox_unchecked_disabled.svg);
}

QCheckBox::indicator:indeterminate,
QTreeView::indicator:indeterminate,
QTableView::indicator:indeterminate,
QGroupBox::indicator:indeterminate {
    image: url(:/Resources/${s}/icon_checkbox_indeterminate.svg);
}

QCheckBox::indicator:indeterminate:pressed,
QTreeView::indicator:indeterminate:pressed,
QTableView::indicator:indeterminate:pressed,
QGroupBox::indicator:indeterminate:pressed {
    image: url(:/Resources/${s}/icon_checkbox_indeterminate_pressed.svg);
}

QCheckBox::indicator:indeterminate:disabled,
QTreeView::indicator:indeterminate:disabled,
QTableView::indicator:indeterminate:disabled,
QGroupBox::indicator:indeterminate:disabled {
    image: url(:/Resources/${s}/icon_checkbox_indeterminate_disabled.svg);
}

QRadioButton::indicator {
    width: 13px;
    height: 13px;
}

QRadioButton::indicator:checked {
    image: url(:/Resources/${s}/icon_radiobutton_checked.svg);
}

QRadioButton::indicator:checked:pressed {
    image: url(:/Resources/${s}/icon_radiobutton_checked_pressed.svg);
}

QRadioButton::indicator:checked:disabled {
    image: url(:/Resources/${s}/icon_radiobutton_checked_disabled.svg);
}

QRadioButton::indicator:unchecked {
    image: url(:/Resources/${s}/icon_radiobutton_unchecked.svg);
}

QRadioButton::indicator:unchecked:pressed {
    image: url(:/Resources/${s}/icon_radiobutton_unchecked_pressed.svg);
}

QRadioButton::indicator:unchecked:disabled {
    image: url(:/Resources/${s}/icon_radiobutton_unchecked_disabled.svg);
}

QMainWindow::separator {
    width: 6px;
    height: 5px;
    padding: 2px;
}

QMainWindow::separator:hover,
QSplitter::handle:hover {
    background: palette(alternate-base);
}

QDockWidget::title {
    padding: 4px;
    background-color: palette(background);
    border: 1px solid palette(dark);
    border-bottom: 2px solid palette(dark);
}

QDockWidget::close-button,
QDockWidget::float-button {
    subcontrol-position: top right;
    subcontrol-origin: margin;
    position: absolute;
    top: 3px;
    bottom: 0px;
    width: 20px;
    height: 20px;
}

QDockWidget::close-button {
    right: 3px;
}

QDockWidget::float-button {
    right: 25px;
}

QGroupBox {
    background-color: palette(mid);
    margin-top: 27px;
    border: 1px solid palette(dark);
    border-radius: 4px;
}

QGroupBox::title {
    subcontrol-origin: margin;
    subcontrol-position: left top;
    padding: 4px 6px;
    margin-left: 3px;
    background-color: palette(background);
    border: 1px solid palette(dark);
    border-bottom: 2px solid palette(midlight);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

QTabWidget::pane {
    background-color: palette(mid);
    border-top: 1px solid palette(dark);
}

QTabWidget::tab-bar {
    left: 3px;
    top: 1px;
}

QTabBar {
    background-color: transparent;
    qproperty-drawBase: 0;
    border-bottom: 1px solid palette(dark);
}

QTabBar::tab {
    padding: 4px 6px;
    background-color: palette(background);
    border: 1px solid palette(dark);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

QTabBar::tab:selected,
QTabBar::tab:hover {
    background-color: palette(mid);
    border-bottom-color: palette(mid);
}

QTabBar::tab:selected {
    border-bottom: 2px solid rgb(${p});
}

QTabBar::tab::selected:disabled {
    border-bottom: 2px solid palette(midlight);
}

QTabBar::tab:!selected {
    margin-top: 2px;
}

QTreeView,
QTableView {
    show-decoration-selected: 0;
    alternate-background-color: palette(window);
}

QTreeView QHeaderView::section,
QTableView QHeaderView::section {
    background-color: palette(background);
    border-style: none;
    border-bottom: 1px solid palette(dark);
    padding-left: 5px;
    padding-right: 5px;
}

/* 1. Forces the background behind the folder tree lines to stay completely
   transparent so the binder surface renders through seamlessly. */
QTreeView::branch {
    background: transparent;
}

QTreeView::branch {
    margin: 0;
    padding: 0;
}

/* 2. Disables the native system line assets from drawing default light
   graphics. The connector roles (adjoins-item, closed/open, active) are
   stubbed to a transparent border-image so Qt does not paint the default
   blocky system lines. */
QTreeView::branch:has-siblings:adjoins-item,
QTreeView::branch:!has-children:!has-siblings:adjoins-item,
QTreeView::branch:closed:has-children:has-siblings,
QTreeView::branch:has-children:!has-siblings:closed,
QTreeView::branch:open:has-children:has-siblings,
QTreeView::branch:open:has-children:!has-siblings,
QTreeView::branch:has-siblings:!adjoins-item,
QTreeView::branch:active:has-siblings:!adjoins-item,
QTreeView::branch:!active:has-siblings:!adjoins-item {
    border-image: none !important;
    background-color: transparent !important;
}

/* 2b. Keep expand/collapse carets functional with the built-in dark
   connector glyphs, instead of leaving blank space (as an empty
   border-image:none alone would). */
QTreeView::branch:has-children:!has-siblings:closed,
QTreeView::branch:closed:has-children:has-siblings {
    image: url(:/Resources/${s}/icon_branch_closed.svg);
}

QTreeView::branch:open:has-children:!has-siblings,
QTreeView::branch:open:has-children:has-siblings {
    image: url(:/Resources/${s}/icon_branch_open.svg);
}

/* 3. Ensures the tree hierarchy indentation levels blend seamlessly with
   the main sidebar background while keeping row highlights working. */
QTreeView::item {
    background: transparent;
    border: none;
}

QTreeView::item:selected:active,
QTreeView::item:selected:!active {
    background: palette(highlight);
    color: palette(highlighted-text);
}


/* --- Advanced menu overrides (the app's four accent controls, last wins) --- */

QTextEdit {
    background-color: palette(base);
    color: palette(text);
}

QMenuBar::item {
    color: ${T.advanced.menuFont};
}

QMenuBar::item:pressed {
    background-color: ${T.advanced.activeMenuAccent};
    color: ${T.advanced.menuFont};
}

QMenu {
    background-color: ${T.advanced.dropdownBackground};
}

QMenu::item {
    color: ${T.advanced.dropdownText};
}

QMenu::item:selected {
    background-color: ${T.advanced.activeMenuAccent};
    color: ${T.advanced.menuFont};
}
`}function D1(T,U){return`<?xml version="1.0" encoding="UTF-8"?>
<ScrivenerThemes>
    <ScrivenerTheme name="${U}" style="${ei(T)}">
        <qtstylesheet>${ac(U)}</qtstylesheet>
        <palette>${xu(U)}</palette>
        <preferences load="Colors">${ec(U)}</preferences>
    </ScrivenerTheme>
</ScrivenerThemes>
`}function nm(T,U,p=w1()){const f=tc(U),x=s=>s.replace(/\r?\n/g,`\r
`);return[{path:xu(f),contents:x(C1(T)),role:"QT PALETTE"},{path:ec(f),contents:x(O1(T,f,p)),role:"COLOR OPTIONS"},{path:ac(f),contents:x(N1(T,f)),role:"QSS · WORKSPACE"},{path:_u(f),contents:x(D1(T,f)),role:"XML MANIFEST",isPointerTarget:!0}]}

/* ------------------------------------------------------------------ */
/* readable aliases over the original builders                        */
/* ------------------------------------------------------------------ */
export const SCRTHEME_EXT = Ws;
export const TOOL_NAME = tm;
export const THEME_EXTS = E1;
export const sanitizeThemeName = tc;
export const palName = xu;
export const prefsName = ec;
export const qssName = ac;
export const xmlName = _u;
export const archiveName = em;
export const nowIso = w1;
export const isLight = ei;
export const editorLinks = am;
export const paletteRoles = z1;
export const disabledRoles = A1;
export const roleDocs = k1;
export const buildPalette = C1;
export const buildPrefs = O1;
export const buildQss = N1;
export const buildManifest = D1;
export const buildThemeFiles = nm;
export const hexToRgb = ti;
export const rgbTriple = ll;
export const toHex = Is;
export const mix = re;
export const tint = Ps;
export const luminance = Wa;
export type Colors = {
  binder: { background: string; text: string };
  editor: { background: string; text: string };
  inspector: { background: string; text: string };
  toolbar: { background: string; text: string };
  advanced: { menuFont: string; activeMenuAccent: string; dropdownBackground: string; dropdownText: string };
};
