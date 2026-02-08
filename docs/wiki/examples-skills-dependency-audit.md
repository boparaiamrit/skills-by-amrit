# dependency-audit Examples

> Vulnerability scanning, license compliance, bundle impact.

## Usage

### Antigravity
```
/deps-update
```

### Claude Code
```
@/audit dependencies
```

## Checks Performed

- Security vulnerabilities (CVE)
- Outdated packages
- License compliance
- Bundle size impact
- Duplicate dependencies
- Unused dependencies

## Example Output

```markdown
## Dependency Audit

### 🔴 Critical Vulnerabilities
- `lodash@4.17.15` — Prototype pollution (CVE-2021-23337)
- `axios@0.21.0` — SSRF vulnerability (CVE-2021-3749)

### 🟠 Outdated (Major)
- `react@17.0.2` → `18.2.0`
- `typescript@4.9.5` → `5.3.3`

### 🟡 License Concerns
- `gpl-package@1.0.0` — GPL-3.0 (copyleft)

### Bundle Impact
| Package | Size | Used By |
|---------|------|---------|
| moment | 288kb | 1 file |
| lodash | 72kb | 3 files |

### Recommendations
- Replace moment with date-fns (12kb)
- Use lodash-es for tree shaking
- Update axios immediately
```
