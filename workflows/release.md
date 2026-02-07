---
description: Bump version, update changelog, commit, tag, and push
---

## Steps

1. Check current version:
// turbo
```
node -e "console.log(require('./package.json').version)" 2>/dev/null || python -c "import toml; print(toml.load('pyproject.toml')['project']['version'])" 2>/dev/null || echo "Unknown"
```

2. Check git log since last tag for changelog:
// turbo
```
git log $(git describe --tags --abbrev=0 2>/dev/null || echo HEAD~20)..HEAD --oneline --no-merges
```

3. Determine version bump type based on commits:
   - `BREAKING CHANGE` or `!:` → major
   - `feat:` → minor
   - `fix:`, `refactor:`, `perf:` → patch

4. Ask the user to confirm the version bump type (patch/minor/major).

5. Run tests before bumping:
```
npm test 2>&1 || pytest 2>&1
```

6. Bump the version:
```
npm version [patch|minor|major]
```

7. Update CHANGELOG.md with the new version's changes.

8. Push the commit and tag:
```
git push --follow-tags
```

9. If npm package, publish:
```
npm publish --access public
```

10. Report the new version number and changelog to the user.
