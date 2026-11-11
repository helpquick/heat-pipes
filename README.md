# heat-pipes.com (CRS Engineering)

Static site for [heat-pipes.com](https://www.heat-pipes.com), built with [Jekyll](https://jekyllrb.com/). It replaces the old site, keeping the same look, wording and page addresses.

## Editing a page

Each page is an `.html` file in the repository root (`standard-range.html`, `contact-us.html` and so on). The text is the original page HTML, so edit it as HTML, commit, and the host rebuilds the site automatically.

- Browser title, description and keywords: the lines between the `---` markers at the top of each file.
- Which menu tab is highlighted: the `tab:` line at the top of the page.
- Menus: `_data/navigation.yml`.
- Analytics IDs and contact email: `_config.yml`.
- Look and feel: `styles/crs/style.css` (the original stylesheet) and `assets/css/site.css` (menu and phone layout).
- Images, the animation and PDF brochures: `media/` (same addresses as before).

## Running it locally

```
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000. (Locally, open pages as `/standard-range.html`; on Cloudflare they are served as `/standard-range`.)

## Hosting (Cloudflare Pages)

Create the project from **Workers & Pages → Create → Pages → Connect to Git** (the Pages flow, not Workers), pick this repository, then:

- Framework preset: Jekyll
- Build command: `bundle exec jekyll build`
- Build output directory: `_site`
- Root directory: leave blank (so Cloudflare finds the `functions/` folder)
- `.ruby-version` pins Ruby 3.3.6, so no `RUBY_VERSION` variable is needed.

Then add `www.heat-pipes.com` and `heat-pipes.com` under **Custom domains**.

## How the old addresses keep working

The old server's `.htaccess` did two jobs. Both are covered:

1. **`index.php?sectionid=N` → clean page (301).** Cloudflare's `_redirects` file can't match query strings, so `functions/_middleware.js` (a tiny Pages Function) does it, using the same sectionid → page table as the old `.htaccess`. An unknown or missing sectionid goes to the home page. `_routes.json` limits the function to `/index.php`, so every other request is plain static hosting and doesn't count towards Functions usage.
2. **Clean URLs without `.html`.** Cloudflare Pages does this itself: `about-us.html` is served at `/about-us`, and a request for `/about-us.html` is permanently redirected to `/about-us`.

`_redirects` adds a few extras: the old `.htm` pages (`downloads.htm`, `checklist.htm`, `contact.htm`) and `/enclosure-cooling`, which the old sitemap listed by mistake.

`_headers` sets basic security and caching headers. GitHub Pages ignores `_redirects`, `_headers` and `functions/`, so don't host it there.
