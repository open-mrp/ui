# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@openmrp/ui` is a React component library published to GitHub Packages. It provides UI components, hooks, icons, WebGL shaders, and utilities for the OpenMRP ecosystem.

## Commands

| Command                                       | Purpose                                                |
| --------------------------------------------- | ------------------------------------------------------ |
| `bun run build`                               | Full production build (types + CJS + ESM + CSS)        |
| `bun run test`                                | Run all Jest tests                                     |
| `bun run test -- --testPathPattern=<pattern>` | Run a single test file                                 |
| `bun run storybook`                           | Start Storybook dev server (port 6006)                 |
| `bun run format`                              | Format with Prettier                                   |
| `bun run format:check`                        | Check formatting                                       |
| `bun run yalc:publish`                        | Publish locally via yalc for testing in consuming apps |
| `bun run yalc:watch`                          | Watch mode for local development with yalc             |

## Architecture

**Build pipeline:** Babel transpiles to dual CJS/ESM output, TypeScript generates declarations, Rollup bundles CSS via PostCSS. Outputs land in `dist/cjs/`, `dist/esm/`, `dist/types/`, and `dist/styles.css`.

**Component organization:** Components live in `src/` grouped by category (buttons, navigation, overlays, tables, etc.). Each category has a barrel `index.ts` that re-exports all public components. The top-level `src/index.ts` re-exports everything.

**Styling:** Tailwind CSS v4 (a peer dependency: consumers compile the `@theme`/`@source` directives in `dist/styles.css`). Variant styles are plain lookup maps. The `cn()` utility in `src/utils/cn.ts` combines `clsx` + `tailwind-merge`. Theme variables are defined in `src/styles/theme.css` as CSS custom properties with dark mode support via `.dark` class.

**Overlays:** All overlays are built in-house. `Modal` owns the modal layer (portal, focus trap, scroll lock, `aria-hidden` siblings, Escape/backdrop close) and backs `Dialog`, `Drawer`, `Sheet`, `Popover`, `Menu` and `DropdownMenu`. `AnchoredPanel` positions floating panels with `@floating-ui/react-dom` (exposing `--anchor-width`, `--available-height` and `--available-width`) and is non-modal by default, dismissing via `useDismissableLayer` (Escape, outside pointer, outside focus, respecting nested layers); panels opened inside a `Modal` portal into that modal's root. `Slot` in `src/utils/slot.tsx` implements `asChild`. Mark anything rendered outside a modal's DOM with `overlayProps` so focus enforcement treats it as inside.

**State management:** Small module-level stores read through `useSyncExternalStore` (sidebar collapse in `useSidenavStore`, persisted to localStorage). Hooks in `src/hooks/` handle SSR-safe hydration patterns.

**Shaders:** `src/shaders/` contains WebGL visualizations (Duffing, Lorenz, Wave) with custom physics/bloom/color managers using raw GLSL files.

**Testing:** Jest + @testing-library/react with jsdom. Test files sit alongside components (e.g., `Component.test.tsx`). CSS files are mocked via `identity-obj-proxy`, GLSL files via `jest-transform-stub`.

## Conventions

- **Formatting:** 4-space indentation, single quotes, semicolons, trailing commas, 100-char line width (Prettier)
- **Path alias:** `@/*` maps to `src/*` (configured in tsconfig, jest, babel)
- **Exports pattern:** Component files use named exports for the component and its props type. Category barrel files re-export them (`export * from './Component'`). A few older components still default-export.
- **Theme tokens:** `src/styles/tokens.css` defines the palette (`--palette-*`, light in `:root`, dark in `.dark`), elevation shadows (`shadow-elevation-N`), easing (`ease-standard`, `ease-decelerate`, `ease-accelerate`, `ease-sharp`), animations and `screen-*` breakpoints. Components use the semantic utilities (`bg-paper`, `text-fg`, `text-fg-secondary`, `border-divider`, `bg-primary-main`, …) rather than raw grays.
- **Versioning:** Changesets for semantic versioning. CI auto-publishes on push to main.
- **React version:** 19 (peer dependency)
