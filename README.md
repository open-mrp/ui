# @augno/ui

Shared react components and user interface utilities for Augno

TODO:

- Add general linting and prettier
- Add documentation

## Testing

To run the tests, run `bun run test`.

The process to publish a new version:

- Make the changes in a new branch that you want for the lib and run `bun run version`
- Make and merge a PR to `main` with those changes
- Wait a couple of minutes for the version pipeline to run
- Look for the new PR created by the github action
- If you want to make another change by going back to step 1
- Merge the PR
- Let the github action run, and you will see a new version number once it has finished

### Prototyping local UI changes in consumers

`@augno/ui` is consumed by both `dashboard/` and `public-docs/`. To test local changes in both without publishing:

```bash
bun run link:all
```

This builds the library, publishes to the local yalc store, and links it into both consumers. For continuous rebuild as you edit:

```bash
bun run yalc:watch
```

**Always tear down before committing** so `file:.yalc/...` refs don't leak:

```bash
bun run unlink:all
```

Unlinking queries GitHub Packages for the latest version, pins each consumer's `package.json` to it, removes `.yalc/` and `yalc.lock` artefacts, and runs `bun install`. See the root `CLAUDE.md` for details.
