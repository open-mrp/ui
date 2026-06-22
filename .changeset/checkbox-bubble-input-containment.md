---
'@augno/ui': patch
---

Fix `Checkbox` letting Radix's hidden bubble `<input>` escape its wrapper. The wrapper now establishes a positioning context (`relative`), so the absolutely-positioned bubble input stays anchored to the checkbox instead of leaking to the nearest positioned ancestor. Previously, rendering many checkboxes at once (e.g. a tool list) stacked these inputs down the document and inflated page scroll height.
