# design-sync notes — tauri-ade

## Shape

- This repo is a **Tauri app, not a published library**: no `dist/`, no package entry, no
  Storybook. The converter runs in **synth-entry mode** off `cfg.srcDir = src/components/ui`.
- The design system is `src/components/ui/**` (shadcn/ui new-york) + `src/theme-variables.css`.
  App-level components (`layout/`, `titlebar/`, `preferences/`, `command-palette/`) are
  deliberately **out of scope** — they call Tauri commands and read Zustand stores, so they
  can't render in a browser preview.

## Fresh-clone setup (both symlinks are gitignored — recreate them)

```sh
npm ci
ln -sfn .. node_modules/tauri-app                            # PKG_DIR = node_modules/<cfg.pkg>
ln -sfn ../.ds-sync/node_modules .design-sync/node_modules   # bare ts-morph import in build-types.mjs
```

**`node_modules/tauri-app` MUST be a symlink to the repo root — not a directory of
selective symlinks.** Tried the latter to break the `node_modules/tauri-app/node_modules/…`
recursion; it silently broke every `cfg.*` path: the converter resolves `cssEntry`/`docsDir`
relative to PKG_DIR and rejects anything whose realpath escapes it, so it printed
`! cssEntry: … resolves outside the package — skipped` and shipped an unstyled
`[CSS_RUNTIME]` stylesheet. The recursion is harmless; this is not.

## Build order (all three steps, every sync)

```sh
node .design-sync/build-css.mjs      # Tailwind -> .design-sync/.cache/ds.css  (cfg.cssEntry)
node .design-sync/build-types.mjs    # -> types/ds-props.d.ts                  (prop contracts)
DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules ./node_modules \
  --out ./ds-bundle [--remote .design-sync/.cache/remote-sync.json]
```

- **`build-css.mjs` must re-run after authoring/editing previews.** Tailwind only emits
  utilities it finds in the scanned sources, and `.design-sync/previews/**` is one of them.
- **`build-types.mjs` must re-run when a component's props change.** Without
  `types/ds-props.d.ts` every `<Name>Props` degrades to `[key: string]: unknown` — shadcn
  declares props inline, so `propsBodyFor` has no `<Name>Props` interface to resolve and the
  app's package.json has no `types` field pointing at one. `types/` is `findTypesRoot()`'s
  third fallback, which is how the converter picks the generated aliases up.

## The story-imports fork (`.design-sync/overrides/story-imports.mjs`)

Rule 2 calls `b.resolve()` for **every** import in the preview graph, and that graph is
dominated by third-party files (lucide-react alone is ~1k modules). Measured on one preview:
plain esbuild **0.3s**, with the stock plugins **61s** — a full 38-preview build was heading
for ~40 minutes. The fork adds two early-outs before the round-trip: skip when the importer
is under `node_modules`, and skip bare specifiers (everything DS here is spelled `@/…` or
relative). Full build is now **~15s**.

Verified equivalent: `_preview/Button.js` and `_preview/Card.js` are **byte-identical**
forked vs unforked. The only diff anywhere is `__toESM(x, 1)` vs `__toESM(x)` on third-party
ESM modules — esbuild's own interop flag, which the stock path suppressed. Re-check that
equivalence if the fork is ever rebased onto a new upstream `lib/story-imports.mjs`.

Note: rule 2 never fires for `@/components/ui/*` in this repo **either way** — previews
bundle the component from source rather than shimming to `window.TauriADE`. Same source, so
fidelity holds (React itself is still the shared vendored copy), but it means the render
check does not exercise `_ds_bundle.js`. `package-validate.mjs` checks the global's export
count separately (181 exports).

## Rendering

- No playwright browser is installed. The render check and capture drive the **system Chrome**
  via `DS_CHROMIUM_PATH`. `playwright` was installed into `.ds-sync/` with
  `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`.
- Previews import via the repo's own alias — `import { Button } from '@/components/ui/button'`.

## Preview gotchas (learned the hard way)

- **Overlay components need `viewport` ≥ ~700px wide.** Tailwind's `sm:` breakpoint is 640px;
  a narrower card renders the _mobile_ layout (centred dialog headers, stacked full-width
  footer buttons), which is not how the desktop app looks.
- **Radix autofocus leaves a text-selection artifact** in screenshots — add
  `onOpenAutoFocus={(e) => e.preventDefault()}` to the overlay content.
- Overlays need `cfg.overrides.<Name>.cardMode = "single"`; anything rendering wider than a
  grid cell needs `"column"`. `package-validate.mjs` names the right one in its
  `[GRID_OVERFLOW]` warning — apply what it says rather than guessing.
- **`ResizablePanelGroup` sets `height:100%` as an inline style**, which beats any `h-*`
  utility on the group itself. Wrap it in a sized div or the panels collapse to ~40px.
- Config changes (`cardMode`, `viewport`) require a full `package-build.mjs`; targeted
  `preview-rebuild.mjs` refuses with `[CONFIG_STALE]`.
- `Toaster` renders nothing until a toast is pushed — its preview fires `toast()` from an
  effect with `duration={Infinity}` so the card isn't empty.
- `useTheme` (used by `Toaster`) does NOT need `ThemeProvider`: `ThemeProviderContext` has a
  real default value, so the `undefined` guard is dead code. **Never wrap previews in the
  app's `ThemeProvider`** — it calls Tauri `emit()` and TanStack Query.

## Curation decisions

- The 38 `ui/*.tsx` files export **176** PascalCase symbols. Only the 38 file roots get cards;
  the other 138 subparts (`CardHeader`, `DialogTitle`, `SidebarProvider`, …) are excluded via
  `cfg.componentSrcMap: {Name: null}`. They stay on `window.TauriADE` (181 exports) and are
  fully importable — composition is taught through each root's authored preview and
  prompt.md. The converter's own subcomponent grouping can't do this: it needs a
  `Card.Header` namespace map, and shadcn exports everything flat.
- `cfg.guidelinesGlob: []` — the default glob swept in repo dev docs (`docs/tasks.md`,
  `USING_THIS_TEMPLATE.md`), which would mislead the design agent.
- `.design-sync/docs/<Name>.md` are frontmatter-only stubs whose sole job is `category:`
  (the DS-pane group). The empty body is intentional — it lets the converter fall back to the
  synthesized props/examples body. Adding real prose to one is a pure upgrade.
- **`.design-sync/ds-styles.css` deliberately drops the app-window chrome** from
  `src/App.css`: `cursor: default` and `user-select: none` on everything, `overflow: hidden`,
  `min-height/width: 100vh/vw`, and the Tauri drag regions. Correct for a desktop window,
  wrong for a design on a scrolling canvas.
- **The `@source inline(...)` safelist in `ds-styles.css` is load-bearing.** Without it
  Tailwind emits only the utilities the components themselves use (103KB), and any layout the
  design agent writes is unstyled. With it: 316KB covering the everyday
  layout/spacing/type/colour vocabulary. Widen it if the agent reports missing classes; the
  conventions header tells the agent to stay inside it.

## What lives in the project that this sync does NOT own

The Design project also contains work created in the web app. **Do not delete it.** It is safe
by construction — the plan's write and delete globs only name DS directories
(`components/**`, `_preview/**`, `tokens/**`, `fonts/**`, `_vendor/**`, `guidelines/**`), and
none of the paths below match. Keep it that way if the globs are ever widened.

- `templates/app-shell/`, `templates/icons/` — designs built in Claude Design against this DS
  (`.dc.html` + `theme.css`/`ds-base.js`/`icons.js`/`support.js`). They reference real exports,
  e.g. `<x-import component-from-global-scope="TauriADE.Button" variant="outline" size="sm">`.
- `uploads/` — reference screenshots the redesign was measured from.
- `_ds_manifest.json`, `_adherence.oxlintrc.json` — regenerated by the app's self-check.

**Sync is one-way (repo → project).** Anything authored in the web app under a DS-owned path
is overwritten on the next sync; port it into the repo instead.

### Theme provenance (2026-08-12)

`src/theme-variables.css` `:root`/`.dark` were **ported back** from
`templates/app-shell/theme.css` — warm stone neutrals measured from the screenshots in
`uploads/`. Dark values are measured; light values are a proposal (no light references were
provided), so treat light as open to revision. The port also replaced the two broken font
vars: `--font-sans` is now a real stack and `--font-mono` is Geist Mono (the `@theme inline`
mapping was changed from `var(--font-geist-mono)` to `var(--font-mono)` to match). If the
theme is revised in Claude Design again, re-port the same way — do not hand-edit the copy in
`templates/`, it is a design artifact, not a source of truth the converter reads.

## Known render warns

- ~~`[TOKENS_MISSING] 2`~~ FIXED by the theme port below — both font vars now resolve. Historical: — `--font-sans` is self-referential in `src/theme-variables.css`
  (`--font-sans: var(--font-sans)`) and `--font-mono` points at an undefined
  `--font-geist-mono`. Text falls back to the base-layer system stack, which is what the app
  ships today. Not introduced by the sync; fixing it in the repo would improve both.

## Re-sync risks — what to watch

- **Locale in screenshots, not in the upload.** This machine is `uk-UA` and macOS Chrome
  ignores `LANG`/`LC_ALL`, so `Intl`-driven text renders Ukrainian in capture sheets
  (`Calendar`'s dropdown caption, `DatePicker`'s `toLocaleDateString`). Cards render in the
  _viewer's_ browser, so nothing wrong ships. `Calendar` previews pin `locale={enUS}`;
  `DatePicker` formats internally and cannot be pinned without changing the component.
  Don't "fix" this by editing `src/`.
- **The fork can rot.** If a future skill version changes `lib/story-imports.mjs`, diff it
  against the fork and re-apply the two early-outs; re-run the byte-identical check above.
- **The safelist is a guess at what the agent will need.** It is not all of Tailwind;
  arbitrary values (`p-[13px]`) and exotic utilities are absent by construction.
- **`types/ds-props.d.ts` is generated, never hand-edited.** If a `<Name>Props` looks wrong,
  fix the component's source types — not the generated file.
- Verified with the toolchain as of this run: node 22, tailwindcss 4.2.2, Chrome 151,
  esbuild 0.28.2 (in `.ds-sync/`). All 38 components graded `good`; a full
  `package-capture.mjs` prints `38 carried forward, 0 captured`.
