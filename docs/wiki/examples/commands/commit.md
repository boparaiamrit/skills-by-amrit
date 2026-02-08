# /commit Command Examples

> Create conventional commits with proper formatting.

## Basic Usage

### Claude Code
```
@/commit
```

### Antigravity
```
/commit
```

## What It Does

1. Analyzes staged/unstaged changes
2. Determines commit type (feat, fix, docs, etc.)
3. Generates descriptive commit message
4. Optionally includes scope
5. Adds breaking change footer if applicable

## Commit Types

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Code restructure |
| `test` | Tests |
| `chore` | Maintenance |

## Example Output

```
feat(auth): add OAuth 2.0 support for Google and GitHub

- Implement OAuth flow with PKCE
- Add session management with refresh tokens
- Create login/callback routes

BREAKING CHANGE: Session format changed, existing sessions will be invalidated
```
