// Emits types/ds-props.d.ts — one `<Name>Props` alias per synced component.
//
// This repo is an app, not a published library: there is no dist/ and no
// .d.ts tree, so the converter runs in synth-entry mode and finds no props.
// shadcn components declare props inline (no `ButtonProps` interface), so
// propsBodyFor has nothing to resolve either. These aliases give it one,
// derived from the real source — never hand-written, so they cannot drift.
//
// types/ is findTypesRoot()'s 3rd fallback, which is how the converter picks
// this up without a `types` field in the app's package.json.
// Re-run before package-build.mjs.

import { Project, Node, ts } from 'ts-morph'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const here = dirname(new URL(import.meta.url).pathname)
const repo = resolve(here, '..')
const uiDir = resolve(repo, 'src/components/ui')
const outDir = resolve(repo, 'types')

const cfg = JSON.parse(readFileSync(resolve(here, 'config.json'), 'utf8'))
const excluded = new Set(
  Object.entries(cfg.componentSrcMap ?? {})
    .filter(([, v]) => v === null)
    .map(([k]) => k)
)

const project = new Project({
  skipAddingFilesFromTsConfig: true,
  compilerOptions: {
    jsx: ts.JsxEmit.Preserve,
    allowJs: true,
    skipLibCheck: true,
  },
})

const lines = []
for (const file of readdirSync(uiDir)
  .filter(f => f.endsWith('.tsx'))
  .sort()) {
  const sf = project.addSourceFileAtPath(`${uiDir}/${file}`)
  const roots = []
  for (const [name, decls] of sf.getExportedDeclarations()) {
    const real =
      name === 'default'
        ? decls.map(d => d.getName?.()).find(n => n && n !== 'default')
        : name
    if (!real || !/^[A-Z][A-Za-z0-9]*$/.test(real) || excluded.has(real))
      continue
    if (
      decls.some(
        d =>
          Node.isVariableDeclaration(d) ||
          Node.isFunctionDeclaration(d) ||
          Node.isClassDeclaration(d)
      )
    )
      roots.push(real)
  }
  if (!roots.length) continue
  const spec = `../src/components/ui/${file.replace(/\.tsx$/, '')}`
  lines.push(`import type { ${roots.join(', ')} } from '${spec}'`)
  for (const r of roots)
    lines.push(`export type ${r}Props = React.ComponentProps<typeof ${r}>`)
}

mkdirSync(outDir, { recursive: true })
writeFileSync(
  `${outDir}/ds-props.d.ts`,
  `import * as React from 'react'\n\n${lines.join('\n')}\n`
)
console.error(
  `ds-props.d.ts: ${lines.filter(l => l.startsWith('export')).length} components`
)
