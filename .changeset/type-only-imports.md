---
'@openmrp/ui': patch
---

Import types with `import type` so the published ESM/CJS output no longer imports type-only names as runtime values, which strict bundlers (Rolldown/Vite) reject as missing exports. `verbatimModuleSyntax` is now enabled to keep it that way.
