#!/usr/bin/env node

import fs from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'

const VERSION_FILES = [
  'package.json',
  'package-lock.json',
  'src-tauri/Cargo.toml',
  'src-tauri/Cargo.lock',
  'src-tauri/tauri.conf.json',
]
const BUMPS = new Set(['patch', 'minor', 'major'])
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/
const CARGO_VERSION = /^version = "([^"]+)"$/m
const CARGO_LOCK_VERSION =
  /(\[\[package\]\]\nname = "tauri-ade"\nversion = ")([^"]+)(")/

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: options.silent ? 'pipe' : 'inherit',
  })
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function readMetadata() {
  const packageJson = readJson('package.json')
  const packageLock = readJson('package-lock.json')
  const cargoToml = fs.readFileSync('src-tauri/Cargo.toml', 'utf8')
  const cargoLock = fs.readFileSync('src-tauri/Cargo.lock', 'utf8')
  const tauriConfig = readJson('src-tauri/tauri.conf.json')
  const cargoVersion = cargoToml.match(CARGO_VERSION)?.[1]
  const cargoLockVersion = cargoLock.match(CARGO_LOCK_VERSION)?.[2]

  return {
    files: { packageJson, packageLock, cargoToml, cargoLock, tauriConfig },
    versions: {
      'package.json': packageJson.version,
      'package-lock.json': packageLock.version,
      'package-lock.json root package': packageLock.packages?.['']?.version,
      'src-tauri/Cargo.toml': cargoVersion,
      'src-tauri/Cargo.lock': cargoLockVersion,
      'src-tauri/tauri.conf.json': tauriConfig.version,
    },
  }
}

function validateVersions(versions, expected) {
  for (const [location, version] of Object.entries(versions)) {
    if (typeof version !== 'string' || !SEMVER.test(version)) {
      throw new Error(`${location} has invalid stable version: ${version}`)
    }
    if (version !== expected) {
      throw new Error(
        `Version mismatch: ${location} is ${version}, expected ${expected}`
      )
    }
  }
}

function validateUpdater(tauriConfig) {
  const updater = tauriConfig.plugins?.updater
  const endpoints = updater?.endpoints

  if (tauriConfig.bundle?.createUpdaterArtifacts !== true) {
    throw new Error('bundle.createUpdaterArtifacts must be true')
  }
  if (
    !Array.isArray(endpoints) ||
    endpoints.length === 0 ||
    endpoints.some(endpoint => typeof endpoint !== 'string' || !endpoint.trim())
  ) {
    throw new Error('At least one updater endpoint must be configured')
  }
  if (typeof updater?.pubkey !== 'string' || !updater.pubkey.trim()) {
    throw new Error('The updater public key must be configured')
  }
}

function nextVersion(version, bump) {
  let [major, minor, patch] = version.split('.').map(BigInt)

  if (bump === 'major') {
    major += 1n
    minor = 0n
    patch = 0n
  } else if (bump === 'minor') {
    minor += 1n
    patch = 0n
  } else {
    patch += 1n
  }

  return `${major}.${minor}.${patch}`
}

function validateGit(tag) {
  if (run('git', ['status', '--porcelain'], { silent: true }).trim()) {
    throw new Error('Working tree must be clean')
  }
  if (
    run('git', ['branch', '--show-current'], { silent: true }).trim() !== 'main'
  ) {
    throw new Error('Release preparation must run on the main branch')
  }

  const head = run('git', ['rev-parse', 'HEAD'], { silent: true }).trim()
  const remote = spawnSync(
    'git',
    [
      'ls-remote',
      '--exit-code',
      'origin',
      'refs/heads/main',
      `refs/tags/${tag}`,
    ],
    { encoding: 'utf8' }
  )

  if (remote.status !== 0) {
    throw new Error(remote.stderr.trim() || 'Could not read origin')
  }

  const refs = new Map(
    remote.stdout
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => line.split(/\s+/).reverse())
  )

  if (refs.get('refs/heads/main') !== head) {
    throw new Error('HEAD must equal origin/main')
  }
  if (refs.has(`refs/tags/${tag}`)) {
    throw new Error(`Tag ${tag} already exists on origin`)
  }

  const localTag = spawnSync(
    'git',
    ['show-ref', '--verify', '--quiet', `refs/tags/${tag}`],
    { encoding: 'utf8' }
  )
  if (localTag.status === 0) {
    throw new Error(`Tag ${tag} already exists locally`)
  }
  if (localTag.status !== 1) {
    throw new Error(localTag.stderr.trim() || `Could not inspect tag ${tag}`)
  }
}

function writeMetadata(metadata, version) {
  const { packageJson, packageLock, cargoToml, cargoLock, tauriConfig } =
    metadata.files

  packageJson.version = version
  packageLock.version = version
  packageLock.packages[''].version = version
  tauriConfig.version = version

  fs.writeFileSync('package.json', `${JSON.stringify(packageJson, null, 2)}\n`)
  fs.writeFileSync(
    'package-lock.json',
    `${JSON.stringify(packageLock, null, 2)}\n`
  )
  fs.writeFileSync(
    'src-tauri/Cargo.toml',
    cargoToml.replace(CARGO_VERSION, `version = "${version}"`)
  )
  fs.writeFileSync(
    'src-tauri/Cargo.lock',
    cargoLock.replace(
      CARGO_LOCK_VERSION,
      (_, prefix, _currentVersion, suffix) => `${prefix}${version}${suffix}`
    )
  )
  fs.writeFileSync(
    'src-tauri/tauri.conf.json',
    `${JSON.stringify(tauriConfig, null, 2)}\n`
  )
}

function validateChangedFiles() {
  const changed = run(
    'git',
    ['status', '--porcelain', '--untracked-files=all'],
    { silent: true }
  )
    .split('\n')
    .filter(Boolean)

  const actual = changed.map(line => line.slice(3)).sort()
  const expected = [...VERSION_FILES].sort()

  if (
    actual.length !== expected.length ||
    actual.some((file, index) => file !== expected[index])
  ) {
    throw new Error(
      `Expected only release metadata changes; found: ${actual.join(', ') || 'none'}`
    )
  }
}

function prepareRelease() {
  const args = process.argv.slice(2)
  if (args.length !== 1 || !BUMPS.has(args[0])) {
    throw new Error('Usage: npm run release:prepare -- <patch|minor|major>')
  }

  const bump = args[0]
  const metadata = readMetadata()
  const currentVersion = metadata.files.packageJson.version
  validateVersions(metadata.versions, currentVersion)
  validateUpdater(metadata.files.tauriConfig)

  const version = nextVersion(currentVersion, bump)
  const tag = `v${version}`
  validateGit(tag)

  writeMetadata(metadata, version)
  run('npm', ['run', 'check:all'])

  const updated = readMetadata()
  validateVersions(updated.versions, version)
  validateUpdater(updated.files.tauriConfig)
  validateChangedFiles()

  console.log(`Prepared ${tag}`)
}

try {
  prepareRelease()
} catch (error) {
  console.error(`Release preparation failed: ${error.message}`)
  process.exit(1)
}
