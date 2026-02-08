# git-workflow Examples

> Conventional commits, branching, PR workflows.

## Usage

### Antigravity
```
/commit
```

### Claude Code
```
@/commit
```

## Commit Types

| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Restructure |
| `test` | Testing |
| `chore` | Maintenance |

## Examples

### Feature Commit
```
feat(auth): add OAuth 2.0 support

- Implement Google OAuth flow
- Add token refresh logic
- Create login callback handler

BREAKING CHANGE: Session format changed
```

### Bug Fix
```
fix(api): handle null user gracefully

Previously crashed when user was deleted mid-session.
Now returns 401 and clears session.

Fixes #234
```

### Branch Naming
```
feature/oauth-integration
bugfix/null-user-crash
hotfix/security-patch
release/v2.0.0
```
