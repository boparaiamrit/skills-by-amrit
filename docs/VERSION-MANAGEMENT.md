# Version Management System

**Problem:** Version scattered across package.json, docs, wiki, causing sync issues.

**Solution:** Automated version sync system

## Files Created

1. **scripts/sync-version.js**
   - Reads version from package.json (single source of truth)
   - Updates docs/index.html meta generator tag
   - Verifies CHANGELOG.md has entry for current version

2. **package.json scripts**
   - `sync-version`: Manual sync (for testing)
   - `postversion`: Auto-runs after `npm version`, amends commit with synced files

3. **Updated GEMINI.md**
   - Critical version management section
   - Correct workflow documented
   - Recovery steps if someone messes up

## How It Works

### When You Release:

```powershell
# 1. Update CHANGELOG.md FIRST
# 2. Commit changes
git add -A
git commit -m "feat: your changes"
git push

# 3. Bump version (auto-syncs everything)
npm run release:minor
```

### What Happens Automatically:

1. `npm version minor` bumps package.json
2. `postversion` hook runs `sync-version.js`
3. `sync-version.js`:
   - Updates docs/index.html with new version
   - Verifies CHANGELOG.md has entry
4. Changes are amended to the version commit
5. Git tag created
6. Published to npm
7. Pushed with tag

## Files That Reference Version

**Auto-synced:**
- ✅ `package.json` (source of truth, via `npm version`)
- ✅ `package-lock.json` (auto by npm)
- ✅ `docs/index.html` (via sync-version.js)

**Manual (must update BEFORE release):**
- ⚠️ `CHANGELOG.md` (you add ## [X.Y.Z] section)

**Static (never change):**
- ✅ `README.md` (counts only, not version number)
- ✅ `docs/wiki/` (no version references)

## CI Integration

GitHub Actions workflow updated to:
- Check if version exists on npm before publishing
- Skip if already published (prevents E403 error)
- Logs "Version X already published, skipping..."
