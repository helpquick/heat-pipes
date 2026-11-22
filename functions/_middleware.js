// Cloudflare Pages Function: keeps the old "index.php?sectionid=N" links working.
//
// The old site's .htaccess sent each index.php?sectionid=N address to a clean page
// address with a 301. Cloudflare's _redirects file can't look at query strings,
// so this small function does the same job. _routes.json limits it to /index.php,
// so every other page is served straight from the static files at no cost.

const SECTIONS = {
  "1": "/",
  "3": "/what-is-a-heat-pipe",
  "4": "/how-does-a-heat-pipe-work",
  "5": "/standard-range",
  "6": "/heat-pipe-types",
  "7": "/technical-notes",
  "8": "/installation-notes",
  "9": "/specific-applications",
  "10": "/enclosure-coolers",
  "11": "/electronic-cooling",
  "12": "/welcome-to-crs",
  "13": "/mould-tool-cooling",
  "14": "/thermal-interface-compounds",
  "15": "/thermal-solutions",
  "16": "/crs-downloads",
  "17": "/contact-us",
  "18": "/technical-representatives",
  "19": "/about-us",
  "20": "/latest-news",
  "21": "/cool-core-heat-pipes",
  "22": "/crs-cool-jets",
};

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.pathname === "/index.php" || url.pathname.startsWith("/index.php/")) {
    // Same as the old rules: match on sectionid, drop the rest of the query string.
    // Unknown or missing sectionid (e.g. the old search page) goes to the home page.
    const target = SECTIONS[url.searchParams.get("sectionid") || ""] || "/";
    return Response.redirect(new URL(target, url.origin).toString(), 301);
  }
  return context.next();
}
