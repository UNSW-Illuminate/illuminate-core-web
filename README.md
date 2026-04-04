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
- `app/[projectSlug]/page.tsx` - dynamic top-level project route (`/synergy`, `/another-project`)
- `app/projects-data.ts` - single source of truth for project content

## Shader Notes

Current shader behavior includes:

- spectral/custom color modes
- grain/noise and ripple controls
- mouse trail distortion
- scroll-linked vertical gradient movement
- reduced noise intensity on mobile viewports

Settings are managed via `app/hooks/useShaderSettings.ts`.

## Project Pages System

Project pages are data-driven.

1. Add a new project object to `projectPageSeeds` in `app/projects-data.ts`.
2. Give it a unique `slug` (this becomes route path `/your-slug`).
3. Provide copy fields (title, short description, description, etc).
4. Set `imageCount` to match available numbered images.

The route is generated automatically through `app/[projectSlug]/page.tsx` and `generateStaticParams`.

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

- brand color variable (`#ff1643`)
- text selection highlight styling
- black base background
- desktop-only custom cursor behavior

## Notes for Contributors

- Reuse existing components before introducing one-off markup.
- Keep project content inside `app/projects-data.ts` (not hardcoded in route files).
- Preserve route slugs and image naming conventions to avoid broken links.
