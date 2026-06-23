---
'@augno/ui': patch
---

fix: stop the wave shader from leaking WebGL contexts on remount/resize (caused a black shader once the browser's context cap was hit, e.g. on macOS split-screen) and recover gracefully from context loss
