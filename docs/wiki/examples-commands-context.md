# /context Command Examples

> Switch context mode to change assistant behavior.

## Usage

```
@/context [mode]
```

## Modes

| Mode | Behavior |
|------|----------|
| `dev` | Write code first, explain after. Minimize discussion, maximize output. |
| `research` | Read widely before concluding. Extended investigation, document findings. |
| `review` | Quality over speed. Security-first, severity-ordered findings. |

## Examples

### Example 1: Dev Mode for Quick Fixes

**You:**
```
@/context dev
```

**Output:**
```
Context switched to **dev** mode. Code-first, minimal discussion.
```

**Then:**
```
Add rate limiting to the /api/login endpoint
```

**Behavior in dev mode:** Immediately reads the route file, adds `express-rate-limit` middleware with sensible defaults (100 requests/15 min), runs tests. No discussion about rate limit strategies or alternatives — just ships the code.

### Example 2: Research Mode for Investigation

**You:**
```
@/context research
```

**Output:**
```
Context switched to **research** mode. Read-widely, document findings.
```

**Then:**
```
Why are WebSocket connections dropping after 60 seconds in production?
```

**Behavior in research mode:** Reads nginx config, load balancer settings, WebSocket server code, checks `proxy_read_timeout`, investigates keep-alive intervals, reads cloud provider docs. Produces a structured findings document before suggesting any fix.

### Example 3: Review Mode for Quality

**You:**
```
@/context review
```

**Output:**
```
Context switched to **review** mode. Quality-first, security-ordered.
```

**Then:**
```
Review the new file upload endpoint
```

**Behavior in review mode:** Checks file type validation, size limits, path traversal prevention, malware scanning hooks, storage permissions, CORS headers. Findings ordered by severity (critical security issues first, style nits last).

### Example 4: Show Available Modes

```
@/context
```

**Output:**
```
Available context modes:
- dev       — Write code first, explain after
- research  — Read widely before concluding
- review    — Quality over speed, security-first

Usage: /context <mode>
```

---

## Related Commands

- `/settings` — Broader project configuration
- `/quick` — Fast task execution (pairs well with dev mode)
- `/research` — Dedicated research command
