# Illuminate

The website for **UNSW Illuminate** — a student showcase of interactive light and
art installations. 

## Tech stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS** + CSS custom properties for theming
- **WebGL 2.0** for the shader gradient (with a static CSS fallback)
- **framer-motion** (animation) and **lenis** (smooth scrolling)

## Getting started

```bash
npm install      # install dependencies (this repo uses npm)
npm run dev      # start the dev server on http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint (next/core-web-vitals)
npm run typecheck # TypeScript without emitting files
npm run audit:dependencies # fail on high-severity dependency vulnerabilities
```

## Project structure

```
app/
  (site)/                     # public marketing site (cursor, page transitions, footer, smooth scroll)
    page.tsx                  # landing page sections
    [projectSlug]/            # /<slug> — project pages generated from projects-data.ts
  components/                 # shared components incl. ShaderGradient, ProjectPageLayout
    ui/                       # reusable primitives — TransitionLink, ButtonLink, ImageLightbox…
  hooks/                      # useScrollColor, useViewTransitionNavigate
  projects-data.ts            # single source of truth for project content
  team-data.ts                # committed seed for the team roster
  site-config.ts              # canonical origin, site metadata, social profiles
  robots.ts                   # environment-aware crawler policy
  sitemap.ts                  # generated public route index
public/.well-known/
  security.txt                # security contact and disclosure policy
```

Routing note: project pages live at the root, `/<slug>`.

## The shader background

`app/components/ShaderGradient.tsx` paints a full-screen WebGL 2 gradient behind the
whole site. It uses a spectral colour mode with grain/ripple effects, a cursor trail,
and scroll-linked vertical movement (with reduced grain on mobile).
Its fixed runtime values live alongside the renderer in `ShaderGradient.tsx`.

If WebGL 2 is unavailable or the program fails to compile, the component falls back to
a static CSS gradient so the page is never blank.

## Motion and navigation

Internal links go through `app/components/ui/TransitionLink.tsx`, a drop-in `next/link`
that runs the App Router navigation inside the browser's View Transitions API (see
`app/hooks/useViewTransitionNavigate.ts`). Pages cross-fade with a slight rise, and the
fixed nav is named `site-nav` so it holds still while everything beneath it changes.
Browsers without the API — and visitors who ask for reduced motion — get a plain
navigation; external hosts, new-tab clicks, and same-page hashes fall through to
`next/link` untouched.

**Shared-element morph.** A project's card grows into the hero image on its project page.
Both frames carry `data-shared-media="<slug>"`; on click the hook hands a
`view-transition-name` to the clicked card, passes it to the destination hero once the new
page commits, and clears it when the transition ends — a duplicate name anywhere in the
document makes the browser drop the whole transition. Timing lives in the
`::view-transition-*` rules in `app/globals.css`. The project hero deliberately has no
entry animation: arriving mid-morph, fading it in would leave a hole where the image
should be.

**Scroll.** Lenis keeps its own scroll position, so anything that moves the page tells
`SmoothScrollProvider` through window events instead of reaching for the instance:
`lenis-stop` / `lenis-start` (the lightbox freezes the page behind it),
`lenis-scroll-top` (the back-to-top button), and `lenis-scroll-reset`, which navigations
fire so Lenis cannot drive the window back to the previous page's offset.

**Cursor.** `CustomCursor` draws the site's own cursor and `globals.css` hides the native
one. Both are gated on `(hover: hover) and (pointer: fine)` rather than a viewport width:
a narrow desktop window keeps the cursor, a touch device never gets it, and plugging a
mouse into a tablet brings it to life without a reload.

## Project pages

Project pages are data-driven from `projectPageSeeds` in `app/projects-data.ts`.

1. Add a project object with a unique `slug` (lowercase, hyphenated) — this becomes
   `/<slug>`.
2. Fill in `title`, `projectType`, `shortDescription`, `location`, `dates`, and
   `description` (use a blank line for paragraph breaks).
3. Drop images in `public/projectImages/<slug>/` named `01.webp`, `02.webp`, … Numbered
   files are auto-detected; `01` is the hero and the rest form the gallery.

The route, gallery, and prev/next navigation are generated automatically — no routing
changes needed.

Project and team content is maintained directly in the typed data files above. The
production application intentionally has no `/admin` dashboard, authentication API,
or browser-based shader editor. Shader tuning values live beside the renderer in
`app/components/ShaderGradient.tsx`.

## Deployment and search visibility

Copy `.env.example` into the deployment platform's environment-variable store;
never commit a populated `.env` file. `SITE_URL` is the canonical production origin
used by metadata, structured data, `robots.txt`, and `sitemap.xml`. Set
`SITE_NOINDEX=true` on previews or mirrors that must not appear in search results.

Before deploying production:

1. Set `SITE_URL` during the build to the final HTTPS origin, without a trailing slash.
2. Leave `SITE_NOINDEX` unset or set it to `false` only on the canonical deployment.
3. Run `npm run lint`, `npm run typecheck`, `npm run build`, and
   `npm run audit:dependencies`.
4. Confirm `/robots.txt`, `/sitemap.xml`, and `/.well-known/security.txt` are reachable.

Security headers and long-lived immutable asset caching are configured in
`next.config.js`; `.vercelignore` excludes local documentation and development-only
files from deployment uploads.

## Conventions

Coding conventions and design-system rules (TypeScript strictness, British spelling,
no decorative borders/shadows, CSS-variable colours, etc.) are documented in
[CLAUDE.md](CLAUDE.md). In short: reuse `app/components/ui/` primitives before adding
one-off markup.
