/* Shared site-wide links + copy, used by both pages. */

export const LINKS = {
  instagram: "https://www.instagram.com/haedrion/",
  /* Updated: the facebook link is now a direct FOLLOW link. */
  facebookFollow: "https://www.facebook.com/Adrian.Kestrel/",
  github: "https://github.com/haedrion",
  buyMeACoffee: "https://www.buymeacoffee.com/haedrion",
  repo: "https://github.com/haedrion/scrivener-hybrid-theme-master",
} as const;

export const BUILDER_PATH = "#/builder";

export const NAV_ITEMS = [
  { id: "about", label: "about" },
  { id: "books", label: "books" },
  { id: "blog", label: "blog" },
  { id: "writers-corner", label: "writers-corner" },
  { id: "theme-builder", label: "theme-builder", route: "builder" as const },
];
