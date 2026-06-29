# Illuminate — Claude Project Rules

Interactive website for UNSW Illuminate: a full-screen WebGL shader background, a smooth custom cursor system, and data-driven project pages.

## General Configuration

- **Use `npm`** for all commands (`npm install`, `npm run dev`, etc.). This repo is npm-based (`package-lock.json`); do not introduce `pnpm` or `yarn`.
- A `Stop` hook runs `tsc --noEmit` over the project whenever TypeScript files have changed. If it reports type errors, fix them before proceeding.
- Australian / British spelling is the default for **our own** identifiers, comments, and user-facing copy (`colour`, `behaviour`, `organisation`, `optimise`, `analyse`). The exception is framework and platform APIs that are American by spec — the CSS `color` property, React props, and the existing `--brand-color` token keep their spec spelling.

## Tech Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS** + CSS custom properties for theming
- **WebGL 2.0** shader pipeline (`app/components/ShaderGradient.tsx`)
- **framer-motion** for animation, **lenis** for smooth scrolling

## Project Structure

- `app/page.tsx` — landing page sections
- `app/layout.tsx` — root layout + metadata
- `app/projects/[projectSlug]/page.tsx` — dynamic project route (`generateStaticParams`)
- `app/admin/` — password-gated dark admin UI for project CRUD
- `app/projects-data.ts` — single source of truth for project content
- `app/components/` — feature components; `app/components/ui/` — reusable primitives
- `app/hooks/` — shared hooks (`useShaderSettings`, `useScrollColor`)
- `app/globals.css` — fonts, brand colour variable, base styles, cursor behaviour

## Coding Conventions

### TypeScript Rules

1. **Strict mode** — never use `any`.
2. **Define types for props and function parameters**; let TypeScript infer return types when obvious.
3. **Prefer `type` over `interface`** — lean on the type system.
4. **Never use barrel files** (`index.ts` re-exports) — they hurt tree shaking.
5. **Avoid loose anonymous types** like `Record<string, unknown>` for structured data. Use exhaustive discriminated unions so adding a variant is a compile-time error.
6. **Avoid `as` assertions** — they bypass the checker and hide real errors. Prefer type guards, `satisfies`, generics, or restructuring. The only acceptable exception is `as const`.

```typescript
// Bad — anonymous type loses safety
type Result = { metadata?: Record<string, unknown> };

// Good — discriminated union is exhaustive
type Mode = { kind: 'spectral'; band: number } | { kind: 'custom'; colour: string };
type Result = { metadata: Mode };
```

### Exhaustive Pattern Matching

Handle union types exhaustively so a new variant fails compilation. With a `switch`, close it with a `never` guard:

```typescript
function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
}

switch (mode.kind) {
  case 'spectral': return renderSpectral(mode.band);
  case 'custom':   return renderCustom(mode.colour);
  default:         return assertNever(mode); // compile error if a case is missing
}
```

### Functional Programming

1. **Prefer pure functions over classes/OOP.**
2. **Immutable data** — never mutate objects/arrays in place.
3. **Compose** complex logic from small functions.
4. **Use array methods** (`.map()`, `.filter()`, `.reduce()`) over imperative loops.

### File Naming

- **Components**: PascalCase — `ButtonLink.tsx`
- **Hooks**: camelCase, `use` prefix — `useShaderSettings.ts`
- **Utilities**: camelCase — `formatDate.ts`
- **Constants**: UPPER_SNAKE_CASE
- **Types**: PascalCase

## UI / Styling Rules

- **No decorative borders** — borders are for functional form inputs only (text fields, selects, textareas), not cards, containers, buttons, or navigation.
- **No shadows** — flat, clean surfaces; no drop shadows or elevation effects.
- **No scale-on-hover** — hover feedback uses opacity (e.g. `hover:opacity-80`) or background changes, never `hover:scale-*`.
- **No uppercase text** — never use the `uppercase` class or `text-transform: uppercase`. All copy is sentence case. Don't alter letter spacing / `tracking-*` from the base type style.
- **Text-link hovers** use the subtle animated underline pattern (`AnimatedTextLink`), not border-based treatments.
- **Colours come from CSS custom properties** (e.g. `var(--brand-color)`) — never hardcode hex values in components.
- **Reuse before reinventing** — use existing `app/components/ui/` primitives for repeated patterns before introducing one-off markup.
- **Components under ~500 lines** — split if larger.

## Project Pages System

Project pages are data-driven — see the README for the full convention. In short:

- Add new projects to `projectPageSeeds` in `app/projects-data.ts`; never hardcode content in route files.
- Each project needs a unique `slug` (becomes `/projects/your-slug`) and an `imageCount` matching the numbered media.
- Media lives in `public/projectImages/{slug}/` as `01.webp`, `02.webp`, … (`01.webp` is the hero).
- Preserve slugs and image-naming conventions to avoid broken links.

## Git Workflow

- Branch off `main`; don't commit directly to `main` unless asked.
- **Conventional Commits** — `feat(scope): …`, `fix(scope): …`, `chore: …`, matching existing history.

## Pre-Submit Checklist

- [ ] `tsc --noEmit` passes (no type errors)
- [ ] `npm run lint` passes
- [ ] No `any`, no `as` (except `as const`), no barrel files, no `Record<string, unknown>` for structured data
- [ ] Union types handled exhaustively
- [ ] Colours use CSS variables — no hardcoded hex
- [ ] No decorative borders, no shadows, no `hover:scale-*`, no `uppercase`
- [ ] Components under ~500 lines
- [ ] British spelling in our own identifiers, comments, and copy
- [ ] Project content lives in `app/projects-data.ts`, not route files
