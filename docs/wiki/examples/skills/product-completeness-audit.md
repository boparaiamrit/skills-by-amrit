# product-completeness-audit Examples

> Functional completeness, placeholder detection, 5-level spectrum.

## Usage

### Antigravity
```
/product-health-check
```

### Claude Code
```
@/health-check
```

## Completeness Levels

| Level | Description |
|-------|-------------|
| 1 | Placeholder — UI only, no functionality |
| 2 | Partial — Some features work |
| 3 | Functional — Core features complete |
| 4 | Polished — Edge cases handled |
| 5 | Production — Fully complete |

## Example Output

```markdown
## Product Completeness Audit

### Overall Score: 3.2/5 (Functional)

### Route Analysis
| Route | Level | Issues |
|-------|-------|--------|
| /login | 5 | ✅ Complete |
| /dashboard | 3 | Missing loading state |
| /settings | 2 | Only profile works |
| /reports | 1 | Placeholder only |

### Placeholder Detection
- "Lorem ipsum" in 3 pages
- TODO comment in API response
- Hardcoded user ID in 2 components

### Missing Features
- [ ] Forgot password flow
- [ ] Email verification
- [ ] Export functionality
- [ ] Mobile responsive

### Path to Level 5
1. Complete settings page
2. Implement reports
3. Add error handling
4. Mobile optimization
```
