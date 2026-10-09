---
'@openmrp/ui': patch
---

Add `'use client'` to components that use React context or hooks, so importing `@openmrp/ui` from a React Server Component no longer crashes with `createContext is not a function`.
