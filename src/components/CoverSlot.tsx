/* ------------------------------------------------------------------
   FLUTTER — cover slot (static asset, no AI generation)
   ------------------------------------------------------------------
   The cover is read from a local file on disk. Drop your image into:

       src/assets/flutter-cover.jpg     (jpg / jpeg / png / webp)

   It is picked up automatically by the glob below — no code change
   needed — and Vite inlines it as a data URI so the single-file
   build keeps working. Nothing is sent anywhere and no model runs.

   Until that file exists, the slot renders the hand-authored vector
   stand-in so the page never shows a broken image.
   ------------------------------------------------------------------ */

const coverFiles = import.meta.glob<string>(
  "../assets/flutter-cover.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" }
);

const COVER_IMAGE: string | undefined = Object.values(coverFiles)[0];

export default function CoverSlot() {
  return (
    <div className="cover-box">
      <div className="cover-art">
        {COVER_IMAGE ? (
          <img
            src={COVER_IMAGE}
            alt="flutter — front cover artwork by Adrian Kestrel: a steampunk sky-ship silhouetted against an amber sky"
            width={680}
            height={1020}
            loading="eager"
            decoding="async"
          />
        ) : (
          <FlutterCoverArt />
        )}
      </div>
    </div>
  );
}

/* Hand-written vector stand-in (not AI output) — used only while
   src/assets/flutter-cover.* is absent. */
function FlutterCoverArt() {
  const C = {
    amberHot: "#FFD98A",
    amber: "#F0A94E",
    amberDeep: "#C97A2C",
    dusk: "#8E3A6E",
    magenta: "#C1318A",
    violet: "#6B2470",
    plum: "#3A1040",
    ink: "#221009",
    titleTeal: "#2F9BC6",
    captionTeal: "#4FB8C4",
    filigree: "#D6338F",
  };

  return (
    <svg
      viewBox="0 0 600 900"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="flutter — front cover artwork by Adrian Kestrel: a steampunk sky-ship stern silhouetted against an amber sky"
    >
      <defs>
        <linearGradient id="cv-sky" x1="0" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor={C.ink} />
          <stop offset="16%" stopColor="#4A2A16" />
          <stop offset="34%" stopColor={C.amberDeep} />
          <stop offset="50%" stopColor={C.amber} />
          <stop offset="62%" stopColor={C.dusk} />
          <stop offset="76%" stopColor={C.violet} />
          <stop offset="100%" stopColor={C.plum} />
        </linearGradient>
        <radialGradient id="cv-glow" cx="0.68" cy="0.3" r="0.55">
          <stop offset="0%" stopColor={C.amberHot} stopOpacity="0.95" />
          <stop offset="38%" stopColor={C.amber} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cv-haze" cx="0.5" cy="0.72" r="0.6">
          <stop offset="0%" stopColor={C.magenta} stopOpacity="0.5" />
          <stop offset="100%" stopColor={C.magenta} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cv-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.plum} stopOpacity="0" />
          <stop offset="100%" stopColor={C.plum} stopOpacity="0.92" />
        </linearGradient>
      </defs>

      <rect width="600" height="900" fill="url(#cv-sky)" />
      <rect width="600" height="900" fill="url(#cv-glow)" />
      <rect width="600" height="900" fill="url(#cv-haze)" />

      {/* envelope */}
      <g fill={C.ink} opacity="0.9">
        <path d="M600 0 L600 210 C520 190 452 138 420 66 C400 20 402 0 402 0 Z" opacity="0.55" />
        <path d="M356 44 C392 96 452 140 528 158 L600 166 L600 0 L360 0 Z" opacity="0.3" />
      </g>

      {/* rigging */}
      <g stroke={C.ink} strokeLinecap="round" fill="none" opacity="0.88">
        {Array.from({ length: 15 }).map((_, i) => {
          const spread = (i - 7) / 7;
          return (
            <path
              key={`rig-${i}`}
              d={`M300 470 C${300 + spread * 120} ${360 - i * 3} ${300 + spread * 210} ${250 - i * 5} ${300 + spread * 268} ${132 - i * 4}`}
              strokeWidth={i % 3 === 0 ? 4.2 : 2.4}
              opacity={0.42 + Math.abs(spread) * 0.5}
            />
          );
        })}
      </g>

      {/* spars */}
      <g stroke={C.ink} strokeLinecap="round" opacity="0.8">
        <path d="M236 300 L588 176" strokeWidth="7" />
        <path d="M250 372 L596 262" strokeWidth="5.4" />
        <path d="M228 224 L520 84" strokeWidth="6" />
        <path d="M286 470 L598 356" strokeWidth="4.4" />
      </g>

      {/* stern */}
      <g fill={C.ink}>
        <path d="M150 556 C196 470 254 430 306 430 C358 430 412 470 452 548 C470 584 476 626 470 664 L164 664 C148 628 140 592 150 556 Z" />
        <path d="M282 660 C290 736 300 806 306 856 C312 806 322 736 330 660 Z" />
        <circle cx="300" cy="500" r="34" />
        <ellipse cx="262" cy="474" rx="30" ry="13" transform="rotate(-34 262 474)" />
        <ellipse cx="338" cy="474" rx="30" ry="13" transform="rotate(34 338 474)" />
        <rect x="196" y="540" width="212" height="9" rx="4" opacity="0.5" />
        <rect x="206" y="562" width="192" height="6" rx="3" opacity="0.34" />
        <path d="M162 522 L104 500 L106 492 L166 510 Z" />
        <path d="M438 522 L498 500 L496 492 L434 510 Z" />
      </g>

      <circle cx="352" cy="470" r="9" fill={C.amberHot} opacity="0.9" />
      <circle cx="352" cy="470" r="18" fill={C.amberHot} opacity="0.18" />

      <rect y="430" width="600" height="470" fill="url(#cv-fade)" />

      {/* type stack */}
      <g textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif">
        <text x="300" y="86" fill="#FFFFFF" fontSize="17" fontWeight="700" letterSpacing="4.2" opacity="0.94">
          &ldquo;NOW THIS IS STEAMPUNK&rdquo;
        </text>
        <text x="300" y="188" fill={C.titleTeal} fontSize="82" fontWeight="700" letterSpacing="1.5">
          ADRIAN
        </text>
        <text x="300" y="266" fill={C.titleTeal} fontSize="82" fontWeight="700" letterSpacing="1.5">
          KESTREL
        </text>
      </g>

      {/* filigree */}
      <g stroke={C.filigree} fill="none" strokeWidth="3.4" strokeLinecap="round">
        <path d="M96 604 C142 604 158 586 178 586 C196 586 206 596 214 602" />
        <path d="M110 628 C150 628 168 612 190 612" strokeWidth="2.6" />
        <circle cx="120" cy="604" r="6" strokeWidth="2.6" />
        <path d="M84 590 C74 596 72 610 82 618" strokeWidth="2.6" />
        <path d="M504 604 C458 604 442 586 422 586 C404 586 394 596 386 602" />
        <path d="M490 628 C450 628 432 612 410 612" strokeWidth="2.6" />
        <circle cx="480" cy="604" r="6" strokeWidth="2.6" />
        <path d="M516 590 C526 596 528 610 518 618" strokeWidth="2.6" />
        <circle cx="300" cy="546" r="15" strokeWidth="3" />
        <circle cx="300" cy="546" r="6" strokeWidth="2.4" />
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <line
              key={`tooth-${i}`}
              x1={300 + Math.cos(a) * 15}
              y1={546 + Math.sin(a) * 15}
              x2={300 + Math.cos(a) * 21}
              y2={546 + Math.sin(a) * 21}
              strokeWidth="3.2"
            />
          );
        })}
      </g>

      {/* gear + wings emblem */}
      <g fill={C.filigree}>
        <circle cx="300" cy="672" r="17" />
        <circle cx="300" cy="672" r="7" fill={C.plum} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <rect
              key={`cog-${i}`}
              x={300 - 2.6}
              y={672 - 24}
              width="5.2"
              height="9"
              rx="1.6"
              transform={`rotate(${(a * 180) / Math.PI} 300 672)`}
            />
          );
        })}
        <path d="M262 672 C244 660 228 660 216 668 C232 674 246 676 262 676 Z" />
        <path d="M338 672 C356 660 372 660 384 668 C368 674 354 676 338 676 Z" />
      </g>

      {/* TITLE */}
      <text
        x="300"
        y="652"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif"
        fontSize="108"
        fontWeight="800"
        letterSpacing="2"
      >
        FLUTTER
      </text>

      <text
        x="300"
        y="800"
        textAnchor="middle"
        fill={C.captionTeal}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="24"
        fontWeight="700"
        letterSpacing="3.6"
        opacity="0.95"
      >
        INTERNATIONAL BEST SELLER
      </text>
    </svg>
  );
}
