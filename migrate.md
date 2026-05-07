Migrate each repo from /Users/liam/dev/actions into this monorepo. Use comparisons of the source repo to already migrated packages in packages/ to guide the migration.

In general, I only want to move over the TypeScript files, with other configuration, workflows etc. being left behind in favour of current versions. This includes package.json files, but I do want to install the currently used versions. Dev Dependencies should go in the root package.json and src/ dependencies in the packages' package.jsons.

The following non-TypeScript files should also be copied:

- `action.yml` → `dist/action.yml`
- `README.md` → `dist/README.md`
- `CHANGELOG.md` → `CHANGELOG.md` (package root)

Test files live in `__tests__/` in source repos (sometimes at the root, sometimes under `src/`). All test files should be moved to `src/__tests__/` in the migrated package. Integration tests should be brought over but all `it`/`test` calls within them should be changed to `it.skip`/`test.skip`.

Use `cp` to copy files rather than reading it in and writing it out.

Pause at the completion of each migration, let me review and commit, including updating the checklist below.

- [x] await-task-action
- [x] create-ephemeral-environment
- [x] create-nuget-package-action
- [ ] create-release-action
- [ ] create-zip-package-action
- [x] deploy-release-action
- [ ] deploy-release-tenanted-action
- [ ] deprovision-ephemeral-environment
- [ ] install-octopus-cli-action
- [ ] login
- [ ] push-build-information-action
- [ ] push-package-action
- [ ] run-runbook-action
