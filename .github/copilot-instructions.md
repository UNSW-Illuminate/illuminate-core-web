# Illuminate — Copilot Instructions

The project rules, coding conventions, and design-system guidelines live in a single
canonical document: [`CLAUDE.md`](../CLAUDE.md) at the repository root.

Read it and follow it. In particular:

- **Tooling**: npm (not pnpm/yarn); a `tsc --noEmit` typecheck must pass.
- **TypeScript**: strict, no `any`, no `as` (except `as const`), no barrel files; exhaustive unions.
- **Design system**: no decorative borders, no shadows, no `hover:scale-*`, no `uppercase`;
  colours via CSS variables; reuse `app/components/ui/` primitives before one-off markup.
- **Content**: project data is data-driven in `app/projects-data.ts`.

For architecture, the shader pipeline, and the project-pages system, see
[`README.md`](../README.md).
