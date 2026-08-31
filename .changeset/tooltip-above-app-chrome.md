---
'@openmrp/ui': patch
---

fix: tooltips no longer disappear behind sidebars and app bars

`TooltipContent` sat at `z-50`, below the app chrome most consumers paint at MUI's drawer
layer (1200), so a tooltip overlapping a sidebar had that half of it drawn over — which
reads as truncated text, not as a stacking bug. It now pins to 1400, matching the popover
and selector overlays, and adds collision padding plus a viewport-bounded max width so a
long tooltip wraps instead of running off-screen.
