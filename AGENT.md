# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@openmrp/ui` is a React component library published to GitHub Packages. It provides UI components, hooks, icons, WebGL shaders, and utilities for the OpenMRP ecosystem.

## Commands

| Command | Purpose |
|---------|---------|
| `bun run build` | Full production build (types + CJS + ESM + CSS) |
| `bun run test` | Run all Jest tests |
| `bun run test -- --testPathPattern=<pattern>` | Run a single test file |
| `bun run storybook` | Start Storybook dev server (port 6006) |
| `bun run format` | Format with Prettier |
| `bun run format:check` | Check formatting |
| `bun run yalc:publish` | Publish locally via yalc for testing in consuming apps |
| `bun run yalc:watch` | Watch mode for local development with yalc |

## Architecture

**Build pipeline:** Babel transpiles to dual CJS/ESM output, TypeScript generates declarations, Rollup bundles CSS via PostCSS. Outputs land in `dist/cjs/`, `dist/esm/`, `dist/types/`, and `dist/styles.css`.

**Component organization:** Components live in `src/` grouped by category (buttons, navigation, overlays, tables, etc.). Each category has a barrel `index.ts` that re-exports all public components. The top-level `src/index.ts` re-exports everything.

**Styling:** Tailwind CSS v4 with CVA (Class Variance Authority) for variant-based component styling. The `cn()` utility in `src/utils/cn.ts` combines `clsx` + `tailwind-merge`. Theme variables are defined in `src/styles/theme.css` as CSS custom properties with dark mode support via `.dark` class.

**Accessible primitives:** Radix UI provides the base for overlays (Popover, Tooltip, Select, DropdownMenu, Sheet, Dialog).

**State management:** Zustand for global state (sidebar collapse in `useSidenavStore`, dark mode). Hooks in `src/hooks/` handle SSR-safe hydration patterns.

**Shaders:** `src/shaders/` contains WebGL visualizations (Duffing, Lorenz, Wave) with custom physics/bloom/color managers using raw GLSL files.

**Testing:** Jest + @testing-library/react with jsdom. Test files sit alongside components (e.g., `Component.test.tsx`). CSS files are mocked via `identity-obj-proxy`, GLSL files via `jest-transform-stub`.

## Conventions

- **Formatting:** 4-space indentation, single quotes, semicolons, trailing commas, 100-char line width (Prettier)
- **Path alias:** `@/*` maps to `src/*` (configured in tsconfig, jest, babel)
- **Exports pattern:** Each component file default-exports the component and named-exports its props type. Category barrel files re-export both.
- **Versioning:** Changesets for semantic versioning. CI auto-publishes on push to main.
- **React version:** 19 (peer dependency)
