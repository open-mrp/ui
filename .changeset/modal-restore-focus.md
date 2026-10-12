---
'@openmrp/ui': minor
---

- Fix `Modal` (and everything built on it: `Dialog`, `Drawer`, `Sheet`, `Popover`, `Menu`, `DropdownMenu`) returning focus to `<body>` instead of the element that opened it when the modal content has an `autoFocus` field, or when the modal mounts already open under React StrictMode.
- Export `AnchoredPanel` and `useDismissableLayer` for non-modal popovers anchored to an element, and add a `collisionPadding` prop to `AnchoredPanel`.
