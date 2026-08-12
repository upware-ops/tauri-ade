# Releases

Release process, version management, and auto-update system.

## Overview

The release system provides:

- Automated GitHub Actions workflow for building releases
- Version management script for updating all version files
- Auto-updater for seamless user updates
- Cross-platform builds (macOS, Windows, Linux)

## Initial Setup

### 1. Generate Signing Keys

```bash
npm install -g @tauri-apps/cli
tauri signer generate -w ~/.tauri/tauri-ade.key
# Outputs private key (saved) and public key (displayed)
```

### 2. Configure GitHub Repository

Add these secrets (Settings → Secrets and variables → Actions):

- `TAURI_SIGNING_PRIVATE_KEY`: Content of `~/.tauri/tauri-ade.key`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: Password used to generate the key

### 3. Update Configuration

**`src-tauri/tauri.conf.json`:**

```json
{
  "plugins": {
    "updater": {
      "endpoints": [
        "https://github.com/upware-ops/tauri-ade/releases/latest/download/latest.json"
      ],
      "pubkey": "YOUR_PUBLIC_KEY_FROM_STEP_1"
    }
  }
}
```

**Bundle info in `tauri.conf.json`:**

- Update `publisher`, `shortDescription`, `longDescription`
- Update `productName` and `identifier`

## Release Process

Stable releases are prepared from the GitHub Actions UI:

1. Open **Actions** → **Prepare release** → **Run workflow**.
2. Select the `main` branch.
3. Select `patch`, `minor`, or `major`. The default is `patch`.
4. Run the workflow.

The workflow validates `main`, increments every version file, runs
`npm run check:all`, commits `chore(release): vX.Y.Z`, creates an annotated
tag, and atomically pushes the commit and tag. It then explicitly dispatches
the `Release` workflow. Feature work continues to use pull requests into
`main`; there is no release branch or release pull request.

`Release` creates or reuses one draft with generated release notes and builds
the supported platform matrix. After every build succeeds, it verifies the
installers, updater archives and signatures, and `latest.json`. Only then does
it publish the release and mark it latest.

For local diagnosis, `npm run release:prepare -- <patch|minor|major>` performs
the metadata update but deliberately does not commit, tag, or push. It requires
a clean `main` checkout exactly equal to `origin/main`.

## Version Strategy

Semantic versioning (`v1.0.0`):

- **Major** (1.x.x): Breaking changes
- **Minor** (x.1.x): New features, backwards compatible
- **Patch** (x.x.1): Bug fixes

All five files must have matching versions:

- `package.json` → `"version": "1.0.0"`
- `package-lock.json` → top-level and root-package versions
- `src-tauri/Cargo.toml` → `version = "1.0.0"`
- `src-tauri/Cargo.lock` → `tauri-ade` package version
- `src-tauri/tauri.conf.json` → `"version": "1.0.0"`

## Auto-Update System

### Behavior

- Checks for updates 5 seconds after app launch
- Shows confirmation dialog when update is available
- Downloads and installs in background
- Offers to restart when complete
- Fails silently on network issues

### Update Flow

```
App Launch → (5s delay) → Check GitHub → Show Dialog → Download → Install → Restart
```

### Implementation

```typescript
// src/App.tsx
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'

useEffect(() => {
  const checkForUpdates = async () => {
    try {
      const update = await check()
      if (update) {
        const shouldUpdate = confirm(`Update available: ${update.version}...`)
        if (shouldUpdate) {
          await update.downloadAndInstall()
          if (confirm('Restart to apply update?')) {
            await relaunch()
          }
        }
      }
    } catch {
      // Silent fail - don't bother user with network issues
    }
  }

  const timer = setTimeout(checkForUpdates, 5000)
  return () => clearTimeout(timer)
}, [])
```

### Manual Update Check

Users can manually check via:

- **Menu**: App → Check for Updates
- **Command Palette**: Cmd+K → "Check for Updates"

## Release Artifacts

Each release creates:

- **macOS**: `.app` bundle (uploaded as `.app.tar.gz`) and `.dmg` installer
- **Windows**: `.msi` installer
- **Linux**: `.AppImage`
- **Auto-updater**: updater archives, `.sig` files, and `latest.json`

## Updater Signing

Tauri updater payloads are cryptographically signed:

1. Private key creates updater signatures during build
2. Public key in config verifies downloads
3. Invalid signatures are automatically rejected

This release flow does not provide operating-system installer code signing or
macOS notarization. Those require separate platform credentials and workflow
steps.

## Recovery

- If preparation fails, no commit or tag is pushed.
- If dispatch fails after the atomic push, rerun only **Dispatch release** or
  manually run **Release** with the existing tag.
- If a platform build or final verification fails, the release remains a
  draft. Fix the cause and rerun **Release** with the same tag.
- Re-running an already published tag is a successful no-op.

For the first live release, confirm the release commit, annotated tag, draft
lifecycle, macOS/Windows/Linux artifacts, signed updater entries in
`latest.json`, and publication only after the complete matrix succeeds.

## Troubleshooting

| Issue                | Solution                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| Preparation fails    | Fix the reported metadata, branch, tag, or quality-gate error            |
| Dispatch fails       | Rerun **Dispatch release** or dispatch **Release** with the existing tag |
| Build fails          | Check both updater-signing secrets and rerun the same tag                |
| Updates not detected | Verify endpoint URL, public key, signatures, and `latest.json`           |
