# @augno/ui

Shared react components and user interface utilities for Augno

TODO: 
- Add general linting and prettier
- Add documentation

## Testing

To run the tests, run `bun run test`.

The process to publish a new vesrion:
- Make the changes in a new branch that you want for the lib and run `bun run version`
- Make and merge a PR to `main` with those changes
- Wait a couple of minutes for the version pipeline to run
- Look for the new PR created by the github action
- If you want to make another change by going back to step 1
- Merge the PR
- Let the github action run, and you will see a new version number once it has finished
