# Illuminate

Interactive website for UNSW Illuminate featuring a full-screen WebGL shader background, smooth cursor system, and reusable data-driven project pages.

## Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- WebGL 2.0 shader pipeline
- Lenis smooth scrolling

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open http://localhost:3000

Production:

```bash
npm run build
npm start
```

## Project Structure

Key app files:

- `app/page.tsx` - landing page sections
- `app/components/ShaderGradient.tsx` - WebGL shader canvas renderer
- `app/components/InteractiveGradient.tsx` - connects scroll color + settings into shader
- `app/components/ProjectPageLayout.tsx` - reusable project detail layout
- `app/projects/[projectSlug]/page.tsx` - dynamic project route (`/projects/synergy`, `/projects/resonance`)
- `app/admin/page.tsx` - password-gated dark admin UI to create/edit/remove projects
- `app/projects-data.ts` - single source of truth for project content

## Shader Notes

Current shader behavior includes:

- spectral/custom color modes
- grain/noise and ripple controls
- mouse trail distortion
- scroll-linked vertical gradient movement
- reduced noise intensity on mobile viewports

Settings are managed via `app/hooks/useShaderSettings.ts`.

### Shader Editor

A live editor for tuning the gradient ships with the front page but stays hidden for
normal visitors. Open it with:

- **`Cmd/Ctrl + .`** to toggle, or
- visiting the page with **`?editor`** in the URL (e.g. `/?editor`).

The editor (`app/components/ShaderEditor.tsx`) exposes grouped sliders with precise
numeric inputs (animation, cursor, texture, and spectral controls), colour-mode and
custom-colour pickers, and per-control reset. **Changes auto-save to `localStorage`**
on every edit (debounced) under the `illuminate-settings` key, so tuned values persist
and become the page's defaults. Use **Copy JSON** / **Import** to move a configuration
between machines, **Reset all** to return to `DEFAULT_SETTINGS`, and `Esc` to close.

To make the editor always visible (e.g. a permanent toggle), render it unconditionally
instead of gating on the shortcut/URL in `ShaderEditor.tsx`.

## Project Pages System

Project pages are data-driven.

1. Add a new project object to `projectPageSeeds` in `app/projects-data.ts`.
2. Give it a unique `slug` (this becomes route path `/projects/your-slug`).
3. Provide copy fields (title, short description, description, etc).
4. Set `imageCount` to match available numbered images.

The route is generated automatically through `app/projects/[projectSlug]/page.tsx` and `generateStaticParams`.

### Image Convention

Store project media in:

`public/projectImages/{slug}/`

Numbered files:

- `01.webp`
- `02.webp`
- `03.webp`
- `04.webp`
- etc.

The first image (`01.webp`) is used as the hero image and all numbered images are used by the gallery.

## Global Styles

`app/globals.css` includes:

- brand colour variable (`--brand-color`, `#FF34B1`)
- text selection highlight styling
- black base background
- desktop-only custom cursor behavior

## Notes for Contributors

- Reuse existing components before introducing one-off markup.
- Keep project content inside `app/projects-data.ts` (not hardcoded in route files).
- Preserve route slugs and image naming conventions to avoid broken links.
- See [CLAUDE.md](CLAUDE.md) for the full coding conventions and design-system rules.
