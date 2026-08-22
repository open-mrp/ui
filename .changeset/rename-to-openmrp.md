---
"@openmrp/ui": major
---

Rename the package from `@augno/ui` to `@openmrp/ui`, and publish it to the
public npm registry instead of GitHub Packages.

Consumers must update the dependency name and drop the `@augno` scope mapping
from their `.npmrc`; the old scope is not aliased. `AugnoLogo` is now
`OpenMRPLogo`.
