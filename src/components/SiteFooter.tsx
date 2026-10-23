import { ArrowUp, Coffee, Heart, ShieldCheck } from "lucide-react";
import InstagramIcon from "./InstagramIcon";
import { LINKS } from "../lib/site";

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
              className="support-button support-button-social"
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="support-button-icon">
                <InstagramIcon />
              </span>
              follow on instagram
            </a>
            <a
              className="support-button support-button-social"
              href={LINKS.facebookFollow}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="support-button-icon">
                <ShieldCheck size={15} strokeWidth={2} aria-hidden="true" />
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
