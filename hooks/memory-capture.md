# Skills Memory Capture System

**Approach:** Dual -- automatic capture + manual save
**Purpose:** Maintain weighted project memory across sessions

## Two Capture Methods

### 1. PreCompact Hook (automatic)

**Event:** PreCompact (fires before context window compression)
**When:** Only on substantial sessions that hit the context limit -- the natural signal that meaningful work happened.
**Cost:** ~1-3k tokens, only when context compacts (not every response).

```json
{
  "PreCompact": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "Context is about to be compressed. Before that happens, capture anything worth remembering. Read MEMORY.md from the auto memory directory. Review what happened this session so far. Weight system: [W5] CRITICAL (architecture decisions, user hard preferences, 'never do X'), [W4] IMPORTANT (patterns confirmed across 2+ sessions, debugging breakthroughs), [W3] USEFUL (working solutions, library choices, config that worked), [W2] CONTEXT (project state, what was tried, environment quirks), [W1] OBSERVED (single-session observations, unconfirmed patterns). Rules: Only add what helps a FUTURE session. New discoveries start at W1. Promote existing W1 to W3+ if confirmed this session. Fix wrong memories immediately. Increment prune counter, prune W1 after 5 sessions. Keep under 200 lines. If nothing worth remembering, do nothing. Return approve when done."
        }
      ]
    }
  ]
}
```

### 2. Manual Save (via command)

**When:** User explicitly wants to save something mid-session.
**Use cases:**
- Short session with an important insight (won't trigger PreCompact)
- User says "remember this" or "always do X"
- Promote a W1 observation to W3+ after confirmation
- Correct a wrong memory

## Weight System

```
[W5] CRITICAL   -- Architecture decisions, user hard preferences     (permanent)
[W4] IMPORTANT  -- Confirmed patterns, debugging breakthroughs       (permanent)
[W3] USEFUL     -- Working solutions, library choices                (long-lived)
[W2] CONTEXT    -- Project state, environment quirks                 (medium-lived)
[W1] OBSERVED   -- Single-session observations                      (pruned after 5 sessions)
```

## How It Works

```
Long session hits context limit
  -> PreCompact hook fires
  -> AI reads MEMORY.md
  -> Reflects on session learnings
  -> Updates memories with appropriate weights
  -> Returns 'approve', context compresses normally

Short session with key insight
  -> User manually triggers memory save
  -> AI reads MEMORY.md
  -> Adds memory with appropriate weight
  -> Confirms what was saved
```

## Memory Lifecycle

```
Session 1: Observation discovered          -> [W1] OBSERVED
Session 3: Same pattern confirmed          -> [W1] promoted to [W3] USEFUL
Session 5: Unconfirmed W1s                 -> Pruned (auto)
Session 7: Pattern proves critical         -> [W3] promoted to [W4] IMPORTANT
User says "always do this"                 -> [W5] CRITICAL (immediate)
User corrects a wrong memory              -> Fixed or removed (immediate)
```

## Installation

- PreCompact hook: Registered in settings.json by installer
- Uninstall: Cleaned up by installer --uninstall
