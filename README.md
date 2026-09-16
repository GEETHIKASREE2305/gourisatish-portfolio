# Gouri Satish — website

A static, redesigned build. Light and minimal, mobile-first, green identity with a
saffron accent. Clean HTML + one stylesheet, with the **header and footer kept as
separate components** so a backend can be added later without touching page markup.

> The original `../gsp project/` folder is kept **for reference only** — nothing here
> depends on it.

## Structure

```
website/
├── index.html                  Home  (hero → stats → about → education → vision →
│                                      key initiatives → news → gallery → voter CTA)
├── about.html                  About Gouri Satish
├── education.html              Education & Public Service
├── vision.html                 Vision for Graduates (six commitments)
├── news.html                   News & Media (+ Insights, Press Kit)
├── gallery.html                Gallery
├── voter-enrolment.html        Graduate Voter Enrolment
├── connect.html                Connect — phone, email, office address & map
├── 404.html                    Not-found page (noindex)
├── robots.txt
├── sitemap.xml                 EN + TE URLs, with hreflang annotations
├── te/                         ← full Telugu mirror of every page above
│   ├── index.html … connect.html, 404.html
│   └── (same names, one level deeper — assets/partials referenced as ../)
├── partials/
│   ├── header.html             ← sticky nav component (bilingual, see below)
│   └── footer.html             ← footer component (bilingual, deep green)
└── assets/
    ├── css/styles.css          design system + every page style
    ├── js/include.js           loads the partials into each page
    ├── js/main.js              mobile nav, sticky header, scroll reveals, language switch
    └── img/
```

## Running it

The partials are fetched over HTTP, so serve the folder (don't open files directly):

```bash
cd website
python -m http.server 8000        # or:  npx serve .
```

Open <http://localhost:8000>.

## Header & footer as components

Each page pulls them in with one line:

```html
<div data-include="partials/header.html" data-active="about"></div>
...
<div data-include="partials/footer.html"></div>
```

`data-active` = `home | about | education | vision | news | gallery | voter | connect`
and marks the current nav item.

### Swapping in a backend

`partials/*.html` are plain fragments. Add a server/framework, delete `include.js`
and its `<script>` tag, and render the same files server-side — no markup changes:

| Stack            | Replace `<div data-include>` with                  |
|------------------|---------------------------------------------------|
| PHP              | `<?php include 'partials/header.html'; ?>`         |
| Nunjucks / 11ty  | `{% include "partials/header.html" %}`             |
| Laravel Blade    | `@include('partials.header')`                      |
| Apache SSI       | `<!--#include virtual="/partials/header.html" -->` |

`connect.html` is the site's contact page — real phone, email, office address and an
embedded map (no form; the previous raise-an-issue/volunteer form was removed in favour
of direct phone/email contact).

## Design system (`assets/css/styles.css`)

| Token            | Value      | Use                                  |
|------------------|------------|--------------------------------------|
| `--green`        | `#075B45`  | primary identity                     |
| `--green-050`    | `#EAF3EE`  | light green section fills            |
| `--saffron`      | `#E88922`  | accent only (buttons, "Satish", ticks)|
| `--saffron-050`  | `#FFF1DF`  | light saffron fills                  |
| `--bg`           | `#F8FAF7`  | page ground                          |
| `--surface`      | `#FFFFFF`  | cards / white sections               |
| `--ink`          | `#17201D`  | body text                            |
| `--muted`        | `#66736D`  | secondary text                       |

Roughly 80% light / 15% green / 5% saffron. No dark full-screen sections, no
glassmorphism, minimal gradients. Font: **Inter** (Google Fonts), fluid `clamp()`
scale. Components: `.btn`, `.feature-card`, `.initiative`, `.news-card`,
`.gallery-grid`, `.split`, `.stats`, `.timeline`, `.deflist`, `.cta-band`, `.panel`,
`.quote`, `.media` (photo placeholder), `.reveal` (fade-up on scroll).

Responsive: mobile-first, tested down to 320px; nav collapses to a slide-down menu
below 1200px; `body{overflow-x:hidden}` guards against stray overflow;
`prefers-reduced-motion` disables reveals; visible focus rings; skip link.

## Bilingual (English / తెలుగు)

Every page has a full Telugu counterpart under `te/`, mirroring the English tree
file-for-file (`te/about.html`, `te/vision.html`, …). Content is a full translation,
not a mixed-language page, per the master copy's own guidance.

- **Shared components, not duplicated ones.** `partials/header.html` and
  `partials/footer.html` are used by *both* languages. Every label is written twice —
  `<span class="lang-en">…</span><span class="lang-te" hidden>…</span>` — and
  `assets/js/main.js` shows/hides the right one based on whether `/te/` is in the URL.
  Edit nav structure or links in one place and both languages pick it up.
- **The language switch** (`[data-lang-switch]` in the header) needs no per-page
  wiring either — the same script computes the cross-link (`te/about.html` ↔
  `../about.html`) from the current filename.
- **Nav/brand hrefs inside the partials are bare filenames** (`about.html`, not
  `/about.html`) *on purpose* — from a page under `te/` they resolve to the Telugu
  sibling; from the English root they resolve to the English page. Don't add a leading
  `/` or `../` to them.
- A Telugu page's own `<head>` — title, meta description, OG/Twitter tags, JSON-LD,
  `hreflang` alternates — is hand-translated per page (not templated), and asset/partial
  paths are prefixed `../` since `te/` is one level deeper.
- `Noto Sans Telugu` is loaded alongside Inter on every page (English pages need it too,
  for the "తెలుగు" switch label and the hidden `.lang-te` spans in the shared header/footer).
- **This is an AI translation.** It's a genuine, complete rendering — not machine-translated
  word-for-word — but for a public candidate's official site, get a native Telugu speaker
  to proof it before publishing, the same caution the master copy itself gives.
- Adding a 9th page later: create both `pagename.html` and `te/pagename.html`, add both
  to `partials/header.html`/`footer.html` (as a new `lang-en`/`lang-te` pair) and to
  `sitemap.xml` (both URLs, with reciprocal `hreflang` `<xhtml:link>`s).

## SEO

Every page carries, per the master-copy's technical-SEO checklist:

- `<title>` + meta description matched to its own search intent (from the master copy)
- `rel="canonical"` — currently self-referencing each page's real `.html` path. If you
  later switch to the clean URLs from the master copy's "URL Structure" section (e.g.
  `/about-gouri-satish`), update these, the `og:url`s and `sitemap.xml` together.
- Open Graph + Twitter Card tags, including `og:image` (currently `gouri-satish.jpg` —
  swap for a proper 1200×630 banner when one exists)
- `robots.txt` + `sitemap.xml` at the site root
- `BreadcrumbList` JSON-LD on every interior page; `Person`/`ProfilePage`/`ContactPage`
  JSON-LD on Home, About and Connect
- `404.html` (`noindex`) — most static hosts (Netlify, GitHub Pages, etc.) pick this up
  automatically; confirm your host's convention when you deploy
- Semantic heading order, lazy-loaded below-the-fold images, descriptive `alt` text on
  every real photo

Not yet done: descriptive image **filenames** (`g1.jpg` etc. → something like
`gouri-satish-rally-hyderabad.jpg`) — cosmetic/minor for SEO, but matches the master
copy's image-naming guidance if you want to rename them later (update the `src`s to match).

## Content notes

- Hero portrait: `assets/img/gouri-satish.jpg`. Its edges are soft-masked so it blends
  into the background, with a tricolour brush (`.hero__portrait::before`) and the
  Parliament line-art (`assets/img/hero-bg.svg`) behind it. **For a clean cut-out look
  like the reference,** supply a background-removed PNG (remove.bg / Photoshop),
  ideally ~1000px+ tall, and point the hero `<img src>` at it — the current JPG is
  400×400 so it softens when enlarged.
- Other photography isn't wired in — every `.media` tile names the intended shot.
  Replace with `<img src="assets/img/…" alt="…" loading="lazy" width height>` and
  descriptive filenames.
- No placeholder news articles, phone numbers or office address are published, by
  design.
- Bilingual (EN / తెలుగు) is **not** included — the copy strategy calls for a
  separate, professionally translated `/te/` tree.
- Verify official voter-enrolment eligibility, documents and deadlines against the
  Telangana CEO / Election Commission before publishing them.
- Stat figures (23+ years, 40,000+ students, 3 campuses) come from the master copy —
  update if the verified numbers change, and keep them consistent site-wide.
