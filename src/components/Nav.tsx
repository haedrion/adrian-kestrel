import { LINKS, NAV_ITEMS } from "../lib/site";

type NavProps = {
  active: "home" | "builder";
  onGoSection: (id: string) => void;
};

/* The exact nav bar from the main Adrian Kestrel page, shared by both pages. */
export default function Nav({ active, onGoSection }: NavProps) {
  return (
    <header id="nav">
      <div className="page nav-row">
        <a
          className="brand-lockup"
          href="#top"
          aria-label="Adrian Kestrel, back to top"
          onClick={(e) => {
            e.preventDefault();
            onGoSection("top");
          }}
        >
          <span className="brand-mark">
            <span className="spark" />
          </span>
          <span className="brand-words">
            <span>adrian p kestrel</span>
            <small>writer · toolmaker</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="primary">
          {NAV_ITEMS.map((item) => {
            const isActive = active === "builder" ? item.route === "builder" : false;
            const href = item.route === "builder" ? "#/builder" : `#${item.id}`;
            return (
              <a
                key={item.id}
                href={href}
                className={isActive ? "active" : undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => {
                  if (item.route === "builder") {
                    e.preventDefault();
                    window.location.hash = "#/builder";
                    return;
                  }
                  e.preventDefault();
                  onGoSection(item.id);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <span className="nav-status">
          <span className="status-dot" /> {active === "builder" ? "100% local" : "open-source"}
        </span>
      </div>
    </header>
  );
}

export const FACEBOOK_HREF = LINKS.facebookFollow;
