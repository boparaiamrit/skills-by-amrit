# incident-response Examples

> Triage, root cause analysis, post-mortems.

## Usage

### Antigravity
```
/incident-response
```

### Claude Code
```
@/audit incident
```

## Incident Phases

### Phase 1: Triage
- Assess severity (P0-P4)
- Identify affected users
- Establish communication channel

### Phase 2: Mitigation
- Apply temporary fix
- Communicate status
- Monitor recovery

### Phase 3: Root Cause
- Gather evidence
- Timeline reconstruction
- Identify contributing factors

### Phase 4: Post-Mortem
- Document learnings
- Action items
- Prevention measures

## Example Output

```markdown
## Incident Report: API Outage 2024-02-08

### Summary
- Duration: 45 minutes
- Severity: P1
- Users affected: ~10,000

### Timeline
- 14:00 — Deploy v2.3.1
- 14:05 — Error rate spikes to 50%
- 14:10 — On-call alerted
- 14:25 — Root cause identified
- 14:35 — Rollback completed
- 14:45 — Full recovery

### Root Cause
Database migration ran before app was ready,
causing connection pool exhaustion.

### Action Items
- [ ] Add migration dependency check
- [ ] Increase connection pool timeout
- [ ] Add rollback automation
```
