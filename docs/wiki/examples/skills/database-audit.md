# database-audit Examples

> Schema design, indexing, query optimization.

## Usage

### Antigravity
```
/audit database
```

### Claude Code
```
@/audit database
```

## Checks Performed

- Schema normalization
- Index coverage
- Query performance (N+1 detection)
- Foreign key constraints
- Data types appropriateness
- Migration safety

## Example Output

```markdown
## Database Audit

### 🔴 Critical
- N+1 query in orders list (12 queries per page)
- Missing index on users.email (used in login)

### 🟠 High
- No foreign key constraints on 5 tables
- VARCHAR(255) overused (could be TEXT)

### 🟡 Medium
- Missing updated_at triggers
- No soft delete on critical tables

### Query Analysis
| Query | Time | Calls/req | Index Used |
|-------|------|-----------|------------|
| SELECT users | 2ms | 1 | ✅ pk |
| SELECT orders | 450ms | 12 | ❌ none |

### Recommendations
```sql
-- Add missing index
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Fix N+1 with JOIN
SELECT o.*, u.name
FROM orders o
JOIN users u ON o.user_id = u.id;
```
