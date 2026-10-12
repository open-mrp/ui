---
'@openmrp/ui': major
---

Run every overlay on the in-house primitives and drop the dependencies that duplicated them.

**Breaking**

- Removed `ShadButton` and `shadButtonVariants`; use `Button`.
- Removed `useSidenavStore`; use `useSidenavState`, which returns the same `isCollapsed`, `setCollapsed`, `toggleCollapsed` and `isHydrated`. The persisted localStorage value is unchanged.
- `tailwindcss` moved from `dependencies` to `peerDependencies`.
- `Sheet`, `DropdownMenu`, `Accordion` and the `Selector` family no longer take Radix-only props such as `forceMount`, `onOpenAutoFocus` or `onPointerDownOutside`, and no longer emit `--radix-*` CSS variables. Floating panels expose `--anchor-width`, `--available-width` and `--available-height` instead.

**Changes**

- `Sheet` is built on `Modal`, `DropdownMenu` on a new `AnchoredPanel` (modal by default, like before), `Accordion` on plain buttons, and `Selector`, `SelectableAutocomplete` and `MultiSelectableAutocomplete` on a non-modal `AnchoredPanel`. Their exports, `data-state` attributes, ARIA roles, keyboard behavior and positioning are unchanged.
- `DropdownMenuSubContent` now renders outside the parent menu, so submenus are no longer clipped by the parent's scroll container.
- Floating panels opened inside a `Modal` render into that modal's root, so they always stack above its backdrop.
- `Autocomplete` virtualizes option lists longer than 100 items with `@tanstack/react-virtual`; options carry `aria-setsize` and `aria-posinset`.
- Code highlighting uses `highlight.js` directly and produces the same HTML as before.
- Removed dependencies: all `@radix-ui/*` packages, `class-variance-authority`, `copy-to-clipboard` (the copy button uses the Clipboard API), `zustand`, `unified`, `rehype-highlight`, `rehype-parse` and `rehype-stringify`. Added `highlight.js`.
