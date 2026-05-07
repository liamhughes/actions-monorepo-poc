# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

An npm workspaces monorepo containing GitHub Actions that integrate with Octopus Deploy. Each package bundles to a single `dist/index.js` file using esbuild.

**Packages:**

- `packages/await-task-action` — waits for a running Octopus Deploy server task to complete
- `packages/create-ephemeral-environment` — creates ephemeral environments in Octopus Deploy
- `packages/create-nuget-package-action` — creates a NuGet package for upload to Octopus Deploy
- `packages/create-release-action` — creates a release in Octopus Deploy
- `packages/create-zip-package-action` — creates a zip package for upload to Octopus Deploy
- `packages/deploy-release-action` — deploys releases via Octopus Deploy
- `packages/deploy-release-tenanted-action` — deploys releases to tenants via Octopus Deploy
- `packages/deprovision-ephemeral-environment` — deprovisions ephemeral environments in Octopus Deploy
- `packages/install-octopus-cli-action` — installs the Octopus CLI tool
- `packages/login` — authenticates with an Octopus Deploy instance
- `packages/push-build-information-action` — pushes build information to Octopus Deploy
- `packages/push-package-action` — pushes packages to an Octopus Deploy feed
- `packages/run-runbook-action` — runs a runbook in Octopus Deploy

## Commands

Run from repo root (executes across all workspaces):

```bash
npm run all          # full check: format + typecheck + lint + test + build
npm run all:fix      # auto-fix format and lint issues, then run the rest
npm run build        # bundle all packages to dist/index.js
npm run typecheck    # tsc --noEmit across all packages
npm run lint:check   # ESLint check
npm run test         # vitest across all packages
```

Run from a package directory for single-package scope:

```bash
npm run test                                       # run all tests in this package
npx vitest run src/__tests__/foo.test.ts           # run a single test file
```

## Code Quality

- **TypeScript:** strict mode, ES2024, NodeNext module resolution
- **ESLint:** flat config with typescript-eslint, import-x (enforces no extraneous deps per package), prettier integration
- **Prettier:** 120-char line width, single quotes — run `npm run format:fix` to auto-format

## Architecture

All packages share the same structural pattern:

| File                             | Purpose                                                |
| -------------------------------- | ------------------------------------------------------ |
| `index.ts`                       | Action entrypoint — reads inputs and calls core logic  |
| `input-parameters.ts`            | Parses and validates GitHub Actions inputs             |
| `api-wrapper.ts`                 | Wraps `@octopusdeploy/api-client` calls                |
| `ActionContext.ts`               | Interface abstracting `@actions/core` for testability  |
| `ActionContextImplementation.ts` | Production implementation using `@actions/core`        |
| `ActionContextForTesting.ts`     | Test double that captures outputs without side effects |

Tests live in `src/__tests__/` and use Vitest. Unit tests run against real logic; integration tests are preserved but wrapped in `describe.skip` so they only run when explicitly enabled against a live Octopus instance.

## Release & Distribution

- **Release Please** manages changelogs and version bumps via PRs (separate PR per package)
- On release publish, the `distribute-release.yml` workflow pushes built artifacts and semver tags (`v1`, `v1.5`, `v1.5.0`) to separate `<package-name>-test` repositories
- `dist/` must be committed as part of every PR — the `check-dist.yml` workflow enforces this on all PRs to main
