# design-sync notes — tauri-ade

Publishes `src/components/ui/**` to the Claude Design project so the design agent builds with
this app's real components. One direction only: **repo → project**.

Project: https://claude.ai/design/p/3d267fd0-1604-4b21-a245-e54a33fb3301

## Scope — deliberately minimal

This sync ships only what the **design agent** consumes: the component bundle, the tokens/CSS,
and a `<Name>.d.ts` prop contract per component.

It deliberately does **not** ship a component gallery. Authored previews and category grouping
were removed on 2026-08-13 — they only ever produced browsable cards for humans and never
reached the agent (every `prompt.md` carries the props table and nothing else). Consequences,
all intended:

- All 38 cards in the DS pane are typographic floor cards ("preview not yet authored"). The
  agent is unaffected; it codes against the `.d.ts`.
- Components appear under a single `general` group instead of six named ones. Grouping needed
  38 frontmatter stub files under `docsDir`.
- `cfg.overrides` (cardMode/viewport) and the `story-imports.mjs` fork are gone with them: both
  only affected preview rendering and compilation. Without previews the build is ~4s either way.

To bring the gallery back, author `.design-sync/previews/<Name>.tsx` (one named export per
card) and re-add `@source './previews/**/*.tsx'` to `ds-styles.css`. Nothing else is required.

## Shape

- This repo is a **Tauri app, not a published library**: no `dist/`, no package entry, no
  Storybook. The converter runs in **synth-entry mode** off `cfg.srcDir = src/components/ui`.
- App-level components (`layout/`, `titlebar/`, `preferences/`, `command-palette/`) are out of
  scope — they call Tauri commands and read Zustand stores, so they can't render in a browser.

## Fresh-clone setup (both symlinks are gitignored — recreate them)

```sh
npm ci
ln -sfn .. node_modules/tauri-app                            # PKG_DIR = node_modules/<cfg.pkg>
ln -sfn ../.ds-sync/node_modules .design-sync/node_modules   # bare ts-morph import in build-types.mjs
```

**`node_modules/tauri-app` MUST be a symlink to the repo root — not a directory of selective
symlinks.** Tried the latter to break the `node_modules/tauri-app/node_modules/…` recursion; it
silently broke every `cfg.*` path, because the converter resolves `cssEntry` relative to
PKG_DIR and rejects anything whose realpath escapes it. It printed
`! cssEntry: … resolves outside the package — skipped` and shipped an unstyled
`[CSS_RUNTIME]` stylesheet. The recursion is harmless; this is not.

## Running a sync

```sh
node .design-sync/build-css.mjs      # Tailwind -> .design-sync/.cache/ds.css  (cfg.cssEntry)
node .design-sync/build-types.mjs    # -> types/ds-props.d.ts                  (prop contracts)
DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules ./node_modules \
  --out ./ds-bundle --remote .design-sync/.cache/remote-sync.json
```

Run it when `src/components/ui/**` or the theme tokens change — not when you edit a design in
the browser. Both generated inputs are load-bearing:

- **`build-types.mjs`** — without `types/ds-props.d.ts` every `<Name>Props` degrades to
  `[key: string]: unknown`. shadcn declares props inline, so `propsBodyFor` has no
  `<Name>Props` interface to resolve, and the app's package.json has no `types` field pointing
  at one. `types/` is `findTypesRoot()`'s third fallback, which is how it gets picked up.
- **`build-css.mjs`** — the repo compiles CSS through `@tailwindcss/vite`, so there is no
  standalone stylesheet to ship. This drives the same engine directly.

No playwright browser is installed; the render check drives the **system Chrome** via
`DS_CHROMIUM_PATH`. `playwright` was installed into `.ds-sync/` with
`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`.

## Curation decisions

- The 38 `ui/*.tsx` files export **176** PascalCase symbols. Only the 38 file roots get cards;
  the other 138 subparts (`CardHeader`, `DialogTitle`, `SidebarProvider`, …) are excluded via
  `cfg.componentSrcMap: {Name: null}`. They stay on `window.TauriADE` (181 exports) and are
  fully importable — composition is taught in `conventions.md`. The converter's own
  subcomponent grouping can't do this: it needs a `Card.Header` namespace map, and shadcn
  exports everything flat.
- `cfg.guidelinesGlob: []` — the default glob swept in repo dev docs (`docs/tasks.md`,
  `USING_THIS_TEMPLATE.md`), which would mislead the design agent.
- **`ds-styles.css` deliberately drops the app-window chrome** from `src/App.css`:
  `cursor: default` and `user-select: none` on everything, `overflow: hidden`,
  `min-height/width: 100vh/vw`, and the Tauri drag regions. Correct for a desktop window,
  wrong for a design on a scrolling canvas. It does keep the interactive-cursor rules, so
  designs match the app.
- **The `@source inline(...)` safelist in `ds-styles.css` is load-bearing.** Without it
  Tailwind emits only the utilities the components themselves use, and any layout the design
  agent writes is unstyled. Widen it if the agent reports missing classes; `conventions.md`
  tells the agent to stay inside it.

## What lives in the project that this sync does NOT own

**Do not delete it.** Safe by construction — the plan's write and delete globs only name DS
directories (`components/**`, `_preview/**`, `tokens/**`, `fonts/**`, `_vendor/**`,
`guidelines/**`), and none of the paths below match. Keep it that way if the globs are widened.

- `templates/app-shell/`, `templates/icons/` — designs built in Claude Design against this DS.
  They reference real exports, e.g.
  `<x-import component-from-global-scope="TauriADE.Button" variant="outline" size="sm">`.
- `uploads/` — reference screenshots the redesign was measured from.
- `_ds_manifest.json`, `_adherence.oxlintrc.json` — regenerated by the app's self-check.

Anything authored in the web app under a DS-owned path is overwritten on the next sync.

## Theme provenance (2026-08-12)

`src/theme-variables.css` `:root`/`.dark` were **ported back** from
`templates/app-shell/theme.css` — warm stone neutrals measured from the screenshots in
`uploads/`. Dark values are measured; light values are a proposal (no light references were
provided), so treat light as open to revision. The port also replaced two broken font vars:
`--font-sans` is now a real stack and `--font-mono` is Geist Mono (the `@theme inline` mapping
changed from `var(--font-geist-mono)` to `var(--font-mono)`). If the theme is revised in Claude
Design again, re-port the same way — never hand-edit the copy under `templates/`.

## Known render warns

- `[FONT_MISSING] "SF Pro Text", "Inter", "Geist Mono"` — appeared when the redesigned theme
  introduced real font stacks. Partly benign:
  - `--font-sans` is a _system-first_ stack (`ui-sans-serif, -apple-system, …`), so `SF Pro
Text` and `Inter` are late fallbacks that never need shipping.
  - `--font-mono` puts **`Geist Mono` first** and it is NOT installed or bundled, so every mono
    run renders in SF Mono/Menlo — in the app _and_ in Claude Design. To fix: add the woff2 and
    point `cfg.extraFonts` at it.
- `[RENDER_BLANK]` on `Checkbox` / `Input` — floor cards whose default-props render is a few
  pixels tall. Expected with no authored previews, non-blocking.

## Re-sync risks — what to watch

- **Screenshots are locale-dependent.** This machine is `uk-UA` and macOS Chrome ignores
  `LANG`/`LC_ALL`, so `Intl`-driven text renders Ukrainian in capture sheets. Cards render in
  the _viewer's_ browser, so nothing wrong ships.
- **`types/ds-props.d.ts` is generated, never hand-edited.** If a `<Name>Props` looks wrong,
  fix the component's source types.
- **Refresh `.design-sync/.cache/remote-sync.json` after every upload** (copy
  `ds-bundle/_ds_sync.json` over it), or the next diff compares against a stale anchor and
  re-uploads everything.
- Verified with node 22, tailwindcss 4.2.2, Chrome 151, esbuild 0.28.2 (in `.ds-sync/`).
