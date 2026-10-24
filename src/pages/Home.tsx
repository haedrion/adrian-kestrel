import { useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Calendar,
  Download,
  Eye,
  FileText,
  GitBranch,
  Palette,
  Rss,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import SiteFooter, { SocialLinks } from "../components/SiteFooter";
import { BUILDER_PATH } from "../lib/site";

/* Adds `.in` to every `.reveal` once it scrolls into view. */
function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    nodes.forEach((n) => {
      n.classList.add("is-pending");
      io.observe(n);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const BOOKS = [
  {
    no: "no. 01",
    tag: "non-fiction",
    title: "mother earth is our elder",
    author: "katłı̨̀ą lafferty",
    blurb:
      "a deep, resonant northern perspective that channels the spirit of traditional storytelling. through testimonies and personal reflections, a gathering of dene elders addresses the climate emergency with intricate knowledge systems and natural laws.",
    href: "https://www.penguinrandomhouse.ca/books/755796/mother-earth-is-our-elder-by-katlia-lafferty/9780771018572",
    year: "2026",
    cover: "public/images/elder.jpg",
    alt: "mother earth is our elder book cover",
  },
  {
    no: "no. 02",
    tag: "dark fantasy",
    title: "weaveworld",
    author: "clive barker",
    blurb:
      "evocative, alluring, and truly engrossing. having re-bought this epic tale over and over through the years, i never tire of it. listening to it now on audible, finally hearing the canvas of the carpet unfurl through another's voice.",
    href: "https://www.goodreads.com/en/book/show/52640.Weave_World",
    year: "2026",
    cover: "/public/images/weaveworld.jpg",
    alt: "weaveworld by clive barker book cover",
  },
  {
    no: "no. 03",
    tag: "urban fantasy",
    title: "neverwhere",
    author: "neil gaiman",
    blurb:
      "a non-stop journey through the veil. this story had me flipping pages deep into the night. magical, mesmerizing, and taut with an imagination that only gaiman at his absolute best can summon from the shadows of london below.",
    href: "https://www.goodreads.com/en/book/show/14497.Neverwhere",
    year: "2026",
    cover: "images/neverwhere.jpg",
    alt: "neverwhere by neil gaiman book cover",
  },
  {
    no: "no. 04",
    tag: "craft & writing",
    title: "invisible ink: a practical guide to building stories that resonate",
    author: "brian mcdonald",
    blurb:
      "a masterclass on the internal scaffolding of text. mcdonald strips back the fluff to expose the simplicity that holds even the most complex narratives upright. an essential piece of architecture that remains vital to revisit.",
    href: "https://www.goodreads.com/en/book/show/7818660-invisible-ink",
    year: "2026",
    cover: "images/invisible-ink.jpg",
    alt: "invisible ink by brian mcdonald book cover",
  },
];

const FEED = [
  {
    date: "2026 · 02 · 14",
    title: "hollow hours is out — and the theme builder just went dark",
    body:
      "The new novel ships today, and to celebrate, the Scrivener Hybrid Theme Master gained a full dark palette export. This portfolio pairs that charcoal palette with warm paper and terracotta.",
    href: "#writers-corner",
  },
  {
    date: "2026 · 01 · 27",
    title: "why every writing tool i build runs locally",
    body:
      "Your manuscript is the most personal file on your machine, so none of my utilities ever upload a byte. Here's the local-first architecture behind the .scrtheme exporter.",
    href: "#writers-corner",
  },
  {
    date: "2025 · 12 · 09",
    title: "drafting vol. iii: the missing-minute problem",
    body:
      "Plotting a novel around a sixty-second gap meant building a timeline Scrivener's corkboard couldn't hold. I ended up writing a wall of index cards — and a small script that became tool no. 02.",
    href: "#books",
  },
  {
    date: "2025 · 10 · 31",
    title: "one year of salt & static: reader letters, annotated",
    body:
      "Twelve months after release, the strangest fan theories get a reply. Yes, the frequency at the end means exactly what you think it means.",
    href: "#about",
  },
];

const PALETTE = ["#1A1C1E", "#23262B", "#E4E1D8", "#9EA4A8", "#D68A54"];

export default function Home() {
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useReveal([]);

  /* typing cursor effect on the release headline */
  useEffect(() => {
    const el = h1Ref.current;
    if (!el) return;
    const em = el.querySelector("em");
    if (!em) return;
    const full = em.textContent ?? "";
    let i = full.length;
    const tick = window.setInterval(() => {
      i = i >= full.length ? 0 : i + 1;
      em.textContent = full.slice(0, i);
    }, 220);
    return () => window.clearInterval(tick);
  }, []);

  return (
    <>
      <aside id="new-release" className="section-surface theme-dark" aria-label="Flutter work in progress spotlight">
        <div className="page release-frame">
          <div className="cover-stage reveal">
            <div className="cover-box">
              <img
                className="flutter-cover-image"
                src="images/flutter-cover.svg"
                alt="Front cover of Flutter by Adrian Kestrel, showing a steampunk sky-ship at sunset"
              />
            </div>
            <div className="cover-caption">
              <span className="helper">
                <span className="spark" /> cover preview · 6:9
              </span>
              <span className="helper mono">work in progress / 2026</span>
            </div>
          </div>

          <div className="release-copy reveal reveal-d1">
            <span className="eyebrow-release">
              <span className="status-dot" /> • work in progress
            </span>
            <h1 ref={h1Ref} className="flutter-hero-title" aria-label="flutter">
              <span className="flutter-hero-title-word">flutter</span>
              <span className="typing-cursor" aria-hidden="true" />
            </h1>
            <p className="release-hook">
              when the architecture of a story requires its own mechanical atmosphere. born from a
              lifetime of world-building—spanning award-winning educational game design for the dene
              peoples to championship feature screenplays—comes a new speculative fiction project
              built from gears, sky-ships, and long-lost notebooks.
            </p>
            <div className="release-meta">
              <span>
                <BookOpen /> steampunk fiction
              </span>
              <span>
                <FileText /> active draft
              </span>
              <span>
                <Calendar /> cohort 2026
              </span>
            </div>
            <a className="action-button" href="#books">
              <span>read the dispatches</span>
              <span className="btn-icon">
                <ArrowRight />
              </span>
            </a>
          </div>
        </div>
      </aside>

      {/* ABOUT */}
      <section id="about" className="zone section-surface theme-light">
        <div className="page">
          <div className="zone-head reveal">
            <div>
              <span className="eyebrow">
                <span className="spark" /> about the author
              </span>
              <h2>words first. tools second. coffee always.</h2>
            </div>
            <span className="zone-index">sec. 01 / about</span>
          </div>

          <div className="about-grid">
            <div className="about-copy reveal">
              <p>
                They say stories never really leave you—they just wait for the right time to return.
                Years ago, I wrote storylines for award-winning educational games and spent my nights
                immersed in independent filmmaking, writing everything from short films to a
                championship-winning feature screenplay. When life threw a curveball, I put down the
                pen to focus on my design career and raising my daughter. Now that she’s out in the
                world doing her thing, I’ve dusted off my old notebooks and reclaimed my call to
                words. I am incredibly honoured to be part of the 2026 Audible Indigenous
                Writers&rsquo; Circle as I embark on this exciting new chapter.
              </p>

              <SocialLinks label="Author social media" />

              <div className="about-facts">
                <div className="fact">
                  <b>04</b>
                  <span>novels published</span>
                </div>
                <div className="fact">
                  <b>1.2m</b>
                  <span>words drafted</span>
                </div>
                <div className="fact">
                  <b>01</b>
                  <span>live tool · more soon</span>
                </div>
              </div>
            </div>

            <div className="profile-col reveal reveal-d1">
              <div className="profile-frame">
                <span className="corner tl" />
                <span className="corner tr" />
                <span className="corner bl" />
                <span className="corner br" />
                <div className="geo-portrait" role="img" aria-label="Geometric portrait of Adrian Kestrel">
                  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <g className="orbit">
                      <circle cx="100" cy="100" r="88" stroke="var(--border-color)" strokeWidth="1" />
                      <rect
                        x="94"
                        y="6"
                        width="12"
                        height="12"
                        transform="rotate(45 100 12)"
                        fill="var(--color-highlight)"
                      />
                    </g>
                    <circle cx="100" cy="78" r="34" stroke="var(--text-primary)" strokeWidth="1.2" />
                    <path
                      d="M42 168 C42 132 68 118 100 118 C132 118 158 132 158 168"
                      stroke="var(--text-primary)"
                      strokeWidth="1.2"
                    />
                    <line x1="66" y1="78" x2="134" y2="78" stroke="var(--color-accent)" strokeWidth="1" />
                    <rect
                      x="90"
                      y="68"
                      width="20"
                      height="20"
                      transform="rotate(45 100 78)"
                      stroke="var(--color-accent)"
                      strokeWidth="1"
                    />
                    <line x1="100" y1="118" x2="100" y2="168" stroke="var(--border-color)" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <div className="profile-caption">
                <span>fig. 01 — the author</span>
                <span>drawn in svg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKS */}
      <section id="books" className="zone section-surface theme-dark">
        <div className="page">
          <div className="zone-head reveal">
            <div>
              <span className="eyebrow">
                <span className="spark" /> the bibliography
              </span>
              <h2>the shelf, so far.</h2>
            </div>
            <span className="zone-index">sec. 02 / books · grid expands as the shelf grows</span>
          </div>

          <section className="reading-ledger-grid">
                    {BOOKS.map((b, i) => {
          const cover = b.img;
          return (
            <article key={b.no} className={`ledger-card reveal reveal-d${i}`}>
              <a href={b.href} target="_blank" rel="noopener noreferrer" className="card-wrapper-link">
                
                {/* 1. Inserted Book Mini Graphic Container */}
                <div className="card-image-slot">
                  {cover ? (
                    <img src={cover} alt={b.alt} className="book-thumbnail" loading="lazy" decoding="async" />
                  ) : (
                    <div className="cover-placeholder" aria-hidden="false">
                      <span className="spark" />
                      <span>{b.no} • cover pending</span>
                    </div>
                  )}
                </div>

                {/* 2. Text Details Block */}
                <div className="card-content-block">
                  <span className="card-tag">{b.tag}</span>
                  <h3 className="book-title">{b.title}</h3>
                  <h4 className="book-author">{b.author}</h4>
                  <p className="book-review-text">{b.blurb}</p>
                </div>

                {/* 3. Footer Action */}
                <div className="card-footer-meta">
                  <span>notes</span>
                  <ArrowUpRight className="lucide-arrow-right" />
                </div>

              </a>
            </article>
          );
        })}
          </section>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="zone section-surface theme-light">
        <div className="page">
          <div className="zone-head reveal">
            <div>
              <span className="eyebrow">
                <span className="spark" /> the update feed
              </span>
              <h2>dispatches from the desk.</h2>
            </div>
            <span className="zone-index">sec. 03 / blog · newest first</span>
          </div>

          <div className="feed reveal">
            {FEED.map((f) => (
              <a key={f.date} className="feed-item" href={f.href}>
                <span className="feed-date">{f.date}</span>
                <div className="feed-body">
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
                <span className="feed-arrow">
                  <ArrowRight />
                </span>
              </a>
            ))}
          </div>

          <a className="feed-more" href="#blog">
            <Rss /> full archive coming to the feed soon
          </a>
        </div>
      </section>

      <div className="section-divider section-surface theme-accent" aria-hidden="true">
        <div className="page divider-row">
          <span className="eyebrow">
            <span className="spark" /> from the writing desk to the workbench
          </span>
          <span className="divider-rule" />
          <span className="mono">words / code</span>
        </div>
      </div>

      {/* WRITERS CORNER */}
      <section id="writers-corner" className="zone section-surface theme-dark">
        <div className="page">
          <div className="zone-head reveal">
            <div>
              <span className="eyebrow">
                <span className="spark" /> the application suite workshop
              </span>
              <h2>writers-corner.</h2>
            </div>
            <span className="zone-index">sec. 04 / tools · local-first, open-source</span>
          </div>

          <div className="workshop-grid">
            <article className="tool-spotlight reveal" id="theme-builder">
              <div className="tool-head">
                <span className="live-badge">
                  <span className="status-dot" /> live · tool no. 01
                </span>
                <span className="helper mono">v1.x · browser-based</span>
              </div>
              <h3>
                scrivener hybrid
                <br />
                theme master
              </h3>
              <p>
                easy peasy drag-and-drop palette import for instant color swatches, plus greater
                customization across every panel. preview a faithful scrivener window in real time and
                export a flat, color-only{" "}
                <span className="mono" style={{ color: "var(--color-accent)", fontSize: "11.5px" }}>
                  .scrtheme
                </span>{" "}
                package — entirely in your browser. no tracking, no uploads.
              </p>

              <div className="palette-strip" aria-label="this site's dark palette, exportable from the tool">
                {PALETTE.map((hex) => (
                  <div className="chip" key={hex}>
                    <i className="swatch" style={{ background: hex }} />
                    <code>{hex}</code>
                  </div>
                ))}
              </div>

              <div className="tool-features">
                <span>
                  <Palette /> drag-and-drop color swatches
                </span>
                <span>
                  <SlidersHorizontal /> greater ui customization
                </span>
                <span>
                  <Eye /> live scrivener preview
                </span>
                <span>
                  <Download /> one-click .scrtheme export
                </span>
                <span>
                  <ShieldCheck /> 100% local · no tracking
                </span>
              </div>

              <div className="action-wrap">
                <a className="action-button" href={BUILDER_PATH}>
                  <span>
                    launch the theme master
                    <span className="action-sub">opens the builder · free forever</span>
                  </span>
                  <span className="btn-icon">
                    <ArrowUpRight />
                  </span>
                </a>
              </div>
            </article>

            <article className="coming-soon reveal reveal-d1">
              <span className="soon-icon">
                <BarChart3 />
              </span>
              <span className="soon-tag">• coming soon — tool no. 02</span>
              <h4>story structures repo</h4>
              <p>
                an interactive web app that curates and overlays classic plot frameworks—like the
                hero&rsquo;s journey and three-act structure. designed to visually map where
                cross-narrative story beats overlap. slot reserved.
              </p>
            </article>

            <article className="coming-soon reveal reveal-d2">
              <span className="soon-icon">
                <GitBranch />
              </span>
              <span className="soon-tag">• coming soon — tool no. 03</span>
              <h4>character - world - builder</h4>
              <p>
                an interactive workspace that is part mood board, part character trait collector, and
                part narrative vision holder. designed to anchor speculative universes. slot reserved.
              </p>
            </article>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
