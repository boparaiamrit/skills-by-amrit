# severity-framework Rule Examples

> Universal severity classification.

## Severity Levels

| Level | Label | Meaning |
|-------|-------|---------|
| 🔴 | Critical | Production risk, security vuln, data loss |
| 🟠 | High | Must fix before next deploy |
| 🟡 | Medium | Tech debt, fix within sprint |
| 🟢 | Low | Improvement opportunity, backlog |
| ⚪ | Info | Observation, no action needed |

## Usage

All audits output findings using this framework.

```markdown
### 🔴 Critical: SQL Injection
File: query.ts:45

### 🟠 High: Missing Error Handling
File: api.ts:28

### 🟡 Medium: Magic Number
File: config.ts:12
```
