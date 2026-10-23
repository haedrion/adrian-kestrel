import { ArrowUp, Coffee, Heart } from "lucide-react";
import { LINKS } from "../lib/site";

function InstagramMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </svg>
  );
}
function FacebookMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14 8.2H15.8V4.9C15.4 4.85 14.4 4.7 13.2 4.7C10.7 4.7 9 6.2 9 9V11.4H5.8V15.1H9V20.3H12.8V15.1H15.4L15.9 11.4H12.8V9.4C12.8 8.4 13 8.2 14 8.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Social row: instagram + the facebook FOLLOW link. */
export function SocialLinks({ label }: { label: string }) {
  return (
    <nav className="social-links" aria-label={label}>
      <a
        href={LINKS.instagram}
        target="_blank"
        rel="me noopener noreferrer"
        aria-label="Adrian Kestrel on Instagram, @haedrion (opens in a new tab)"
      >
        instagram
      </a>
      <a
        href={LINKS.facebookFollow}
        target="_blank"
        rel="me noopener noreferrer"
        aria-label="Follow Adrian Kestrel on Facebook (opens in a new tab)"
      >
        follow
      </a>
    </nav>
  );
}

export default function SiteFooter() {
  return (
    <footer className="section-surface theme-accent">
      <div className="page">
        <div className="footer-capsule theme-dark reveal">
          <div>
            <span className="eyebrow">
              <span className="spark" /> keep the ecosystem open
            </span>
            <h3>the books are paid. the tools are free.</h3>
            <p className="helper">
              every utility in writers-corner is open-source and stays that way. if one saved your
              evening, these verified channels keep the next one shipping.
            </p>
          </div>
          <div className="support-actions">
            <a
              className="support-button support-button-sponsor"
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="support-button-icon">
                <Heart />
              </span>
              sponsor on github
            </a>
            <a
              className="support-button support-button-coffee"
              href={LINKS.buyMeACoffee}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="support-button-icon">
                <Coffee />
              </span>
              buy me a coffee
            </a>
            <a
              className="support-button support-button-instagram"
              href={LINKS.instagram}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label="Follow on Instagram"
            >
              <span className="support-button-icon">
                <InstagramMark width={14} height={14} />
              </span>
              follow on instagram
            </a>
            <a
              className="support-button support-button-facebook"
              href={LINKS.facebookFollow}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label="Follow on Facebook"
            >
              <span className="support-button-icon">
                <FacebookMark width={14} height={14} />
              </span>
              follow on facebook
            </a>
          </div>
        </div>

        <div className="footer-baseline">
          <span className="footer-brand">
            <span className="spark" /> adrian p kestrel · writer &amp; toolmaker
          </span>
          <p>© 2026 · drafted in scrivener · paper, charcoal &amp; terracotta</p>
          <div className="footer-links">
            <SocialLinks label="Footer social media" />
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <ArrowUp /> back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
