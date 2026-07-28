# Illuminate

The website for **UNSW Illuminate** — a student showcase of interactive light and
art installations. The landing page renders a full-screen WebGL gradient that reacts
to the cursor and scroll position; individual installations live on data-driven
project pages; and a password-gated `/admin` dashboard manages the content.

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
```

## Project structure

```
app/
  (site)/                     # public marketing site (cursor, page transitions, footer, smooth scroll)
    page.tsx                  # landing page sections
    [projectSlug]/            # /<slug> — project pages generated from projects-data.ts
  admin/                      # password-gated dashboard (own layout, no marketing chrome)
  api/admin/                  # login / logout route handlers (cookie session)
  components/                 # shared components incl. ShaderGradient, ProjectPageLayout
    ui/                       # reusable primitives — TransitionLink, ButtonLink, ImageLightbox…
  hooks/                      # useShaderSettings, useScrollColor, useViewTransitionNavigate
  projects-data.ts            # single source of truth for project content
  team-data.ts                # committed seed for the team roster
middleware.ts                 # gates everything under /admin
```

Routing note: project pages live at the root, `/<slug>`. The public site sits in a
`(site)` route group so `/admin` can opt out of the global cursor, footer, and
smooth-scroll chrome.

## The shader background

`app/components/ShaderGradient.tsx` paints a full-screen WebGL 2 gradient behind the
whole site. It supports spectral and custom colour modes, grain/ripple effects, a
cursor trail, and scroll-linked vertical movement (with reduced grain on mobile).
Runtime values come from `app/hooks/useShaderSettings.ts` (`DEFAULT_SETTINGS`),
persisted to `localStorage` under `illuminate-settings`.

If WebGL 2 is unavailable or the program fails to compile, the component falls back to
a static CSS gradient so the page is never blank.

### Shader editor

A live tuning panel ships with the landing page but stays hidden for normal visitors.
Open it with **`Cmd/Ctrl + .`** or by visiting **`/?editor`**; close with `Esc`.

It offers grouped sliders with precise numeric inputs (animation, cursor, texture,
spectral), colour-mode and custom-colour pickers, and per-control reset. Edits
**auto-save** to `localStorage` (debounced), so tuned values become the page defaults.
Use **Copy JSON** / **Import** to move a configuration between machines, or **Reset
all** to return to defaults. To make the panel always visible, render `ShaderEditor`
unconditionally instead of gating on the shortcut/URL.

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

## Admin dashboard

A dark dashboard at **`/admin`** manages content. Auth is a cookie session
(`middleware.ts` + `app/api/admin/*`). Credentials are **`admin` / `admin`** for now —
swap the hardcoded values in `app/admin/auth-constants.ts` for environment variables
before any real deployment.

- **Projects** — image-thumbnail cards. Editing opens a two-pane view: a form beside a
  **live preview** of the `/<slug>` page that updates as you type. Project
  images are previewed from `public/projectImages/<slug>/` (read-only here).
- **Team** — create/edit/remove members and **upload photos** (seeded from
  `app/team-data.ts`).

### Persistence

Admin changes are **localStorage-only** (per-browser) — they don't change what visitors
see, and uploaded team photos are stored as data URLs. Use **Copy JSON** in the Projects
section to export edits back into `app/projects-data.ts`. Promoting the admin to a server
file or database is the next step for making edits go live.

## Conventions

Coding conventions and design-system rules (TypeScript strictness, British spelling,
no decorative borders/shadows, CSS-variable colours, etc.) are documented in
[CLAUDE.md](CLAUDE.md). In short: reuse `app/components/ui/` primitives before adding
one-off markup.
