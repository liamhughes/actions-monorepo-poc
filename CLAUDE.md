# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

An npm workspaces monorepo containing two GitHub Actions that integrate with Octopus Deploy. Each package bundles to a single `dist/index.js` file using esbuild.

**Packages:**

- `packages/create-ephemeral-environment` — creates ephemeral environments in Octopus Deploy
- `packages/deploy-release-action` — deploys releases via Octopus Deploy

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
npm run test                              # run all tests in this package
npx vitest run __tests__/foo.test.ts     # run a single test file
```

## Code Quality

- **TypeScript:** strict mode, ES2024, NodeNext module resolution
- **ESLint:** flat config with typescript-eslint, import-x (enforces no extraneous deps per package), prettier integration
- **Prettier:** 120-char line width, single quotes — run `npm run format:fix` to auto-format

## Architecture

Both packages share the same structural pattern:

| File                             | Purpose                                                |
| -------------------------------- | ------------------------------------------------------ |
| `index.ts`                       | Action entrypoint — reads inputs and calls core logic  |
| `input-parameters.ts`            | Parses and validates GitHub Actions inputs             |
| `api-wrapper.ts`                 | Wraps `@octopusdeploy/api-client` calls                |
| `ActionContext.ts`               | Interface abstracting `@actions/core` for testability  |
| `ActionContextImplementation.ts` | Production implementation using `@actions/core`        |
| `ActionContextForTesting.ts`     | Test double that captures outputs without side effects |

Tests live in `__tests__/` and use Vitest with MSW for HTTP mocking.

## Release & Distribution

- **Release Please** manages changelogs and version bumps via PRs (separate PR per package)
- On release publish, the `distribute-release.yml` workflow pushes built artifacts and semver tags (`v1`, `v1.5`, `v1.5.0`) to separate `<package-name>-test` repositories
- `dist/` is committed on release branches (not in main development) — the `check-dist.yml` workflow enforces this
