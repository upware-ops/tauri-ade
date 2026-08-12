# Static Analysis

All static analysis tools configured in this app and how to use them.

## Quick Reference

| Tool           | Purpose                   | Command                  | In check:all |
| -------------- | ------------------------- | ------------------------ | ------------ |
| TypeScript     | Type checking             | `npm run typecheck`      | Yes          |
| ESLint         | Syntax, style, TS rules   | `npm run lint`           | Yes          |
| Prettier       | Code formatting           | `npm run format:check`   | Yes          |
| ast-grep       | Architecture patterns     | `npm run ast:lint`       | Yes          |
| React Compiler | Automatic memoization     | Build-time               | Yes          |
| cargo fmt      | Rust formatting           | `npm run rust:fmt:check` | Yes          |
| clippy         | Rust linting              | `npm run rust:clippy`    | Yes          |
| Vitest         | Frontend tests            | `npm run test:run`       | Yes          |
| cargo test     | Rust tests                | `npm run rust:test`      | Yes          |
| Syncpack       | npm version policy        | `npm run deps:lint`      | Yes          |
| Tauri CLI      | JS/Rust version alignment | `npm run tauri:check`    | Yes          |
| knip           | Unused code detection     | `npm run knip`           | No           |
| jscpd          | Duplicate code detection  | `npm run jscpd`          | No           |

## Running All Checks

```bash
npm run check:all    # Must pass before commits
npm run fix:all      # Auto-fix what can be fixed
```

## Tool Details

### ESLint

Handles syntax, style, and TypeScript-specific rules.

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

Configuration in `eslint.config.js`.

### Prettier

Consistent code formatting.

```bash
npm run format:check   # Check formatting
npm run format         # Fix formatting
```

Configuration in `prettier.config.js`.

### ast-grep

Enforces architectural patterns ESLint can't detect. Catches violations like Zustand destructuring and hooks in wrong directories.

```bash
npm run ast:lint    # Scan for violations
npm run ast:fix     # Auto-fix where possible
```

**Key rules:**

- No Zustand destructuring (causes render cascades)
- Hooks must be in `hooks/` directory
- No store subscriptions in `lib/`

See [writing-ast-grep-rules.md](./writing-ast-grep-rules.md) for creating new rules.

### React Compiler

Handles memoization automatically at build time. You do **not** need to manually add:

- `useMemo` for computed values
- `useCallback` for function references
- `React.memo` for components

The compiler analyzes code and adds memoization where beneficial.

**Note:** The `getState()` pattern is still critical - it avoids store subscriptions, not memoization. See [state-management.md](./state-management.md).

### Rust Tooling

```bash
npm run rust:fmt:check   # Check formatting
npm run rust:fmt         # Fix formatting
npm run rust:clippy      # Lint with clippy
npm run rust:clippy:fix  # Auto-fix clippy warnings
npm run rust:test        # Run Rust tests
```

### Dependency Upgrades

[Taze](https://github.com/antfu-collective/taze) reports stable npm and GitHub Action updates and filters candidates released within the last 14 days. [Syncpack](https://syncpack.dev/) keeps direct npm dependencies exact so `npm install` cannot resolve versions newer than Taze selected. Upgrades are interactive and end with the full quality gate:

```bash
npm run deps:check
npm run deps:update
```

Review both manifest and lockfile changes; transitive dependency versions remain controlled by npm and the lockfile.

Taze runs in stable mode, includes exact dependencies so updates remain selectable, and writes GitHub Action updates as major-version tags. It does not update itself or Syncpack; upgrade those tools separately after their releases pass the maturity window. ESLint 10 and TypeScript 7 are blocked until `eslint-plugin-react` and `typescript-eslint` support them; updates within the supported majors remain available. `@rolldown/plugin-babel` is held at 0.2.2 because 0.2.3 lets npm select an incompatible Babel 8 optional peer. `react-resizable-panels` 4 is blocked until the test runtime provides `ResizeObserver`.

Syncpack only manages `package.json`; it does not parse Cargo manifests. Cargo uses the normal Tauri 2 requirement and `Cargo.lock` records the resolved versions. `npm run deps:update` normalizes npm pins, runs the reviewed Taze update, and uses Tauri's own no-bundle build to reject mismatched resolved versions. The JavaScript API and Rust core must share a minor version, while each JavaScript/Rust plugin pair must use the exact same version.

For a manual Tauri batch:

```bash
npm install
cargo update --manifest-path src-tauri/Cargo.toml
npm run check:all
```

Follow Tauri's [dependency update guide](https://v2.tauri.app/develop/updating-dependencies/) and check the [ecosystem release notes](https://v2.tauri.app/release/) before changing the pins. The no-bundle build validates the native application without requiring updater signing keys.

### knip (Periodic Cleanup)

Detects unused exports, dependencies, and files. Not in `check:all` - use periodically.

```bash
npm run knip
```

### jscpd (Periodic Cleanup)

Detects duplicated code blocks. Not in `check:all` - use periodically.

```bash
npm run jscpd
```

Use the `/cleanup` command for guided analysis and cleanup of both knip and jscpd findings.

## CI Integration

`check:all` runs in CI. Ensure it passes locally before pushing:

```bash
npm run check:all
```

## Adding New Rules

**ESLint:** Add rules to `eslint.config.js`

**ast-grep:** Create YAML files in `.ast-grep/rules/`. See [writing-ast-grep-rules.md](./writing-ast-grep-rules.md).

**Prettier:** Modify `prettier.config.js`
