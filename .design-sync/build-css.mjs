// Compiles .design-sync/ds-styles.css -> .design-sync/.cache/ds.css (cfg.cssEntry).
// The repo builds CSS through @tailwindcss/vite, so there is no standalone
// stylesheet on disk to ship; this drives the same engine directly.
// Re-run before package-build.mjs whenever previews or ui/ sources change —
// Tailwind only emits utilities it finds in the scanned sources.

import { compile } from '@tailwindcss/node'
import { Scanner } from '@tailwindcss/oxide'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const here = dirname(new URL(import.meta.url).pathname)
const entry = resolve(here, 'ds-styles.css')
const out = resolve(here, '.cache/ds.css')

const compiler = await compile(readFileSync(entry, 'utf8'), {
  base: here,
  onDependency: () => {},
})
const scanner = new Scanner({ sources: compiler.sources })
const css = compiler.build(scanner.scan())

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, css)
console.error(`ds.css: ${(css.length / 1024).toFixed(1)}KB`)
