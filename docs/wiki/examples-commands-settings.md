# /settings Command Examples

> View and modify project configuration — mode, depth, and workflow preferences.

## Usage

### Claude Code
```
@/settings
@/settings mode auto
@/settings depth comprehensive
```

### Antigravity
```
/settings
/settings mode auto
```

## What It Does

Reads and writes `.planning/config.json` using `planning-tools.cjs` for deterministic updates.

## Available Settings

### Mode

Controls how the AI interacts with you during execution:

| Value | What It Does |
|:---|:---|
| `interactive` | Ask before each step (default) |
| `auto` | Auto-advance through steps without asking |

```bash
# View
node planning-tools.cjs config get mode

# Set
node planning-tools.cjs config set mode auto
```

### Depth

Controls how thorough the planning and research phases are:

| Value | What It Does |
|:---|:---|
| `quick` | Minimal planning, maximum speed — for simple tasks |
| `standard` | Balanced (default) — good for most work |
| `comprehensive` | Deep research, detailed plans — for complex architecture |

```bash
node planning-tools.cjs config set depth comprehensive
```

### Workflow Preferences

| Setting | Default | What It Controls |
|:---|:---|:---|
| `auto_commit` | `false` | Auto-commit after each task |
| `auto_test` | `true` | Run tests after each task |
| `verification_required` | `true` | Require /verify before marking complete |
| `research_before_planning` | `true` | Do research before writing plans |
| `auto_advance_phases` | `false` | Auto-advance to next phase |
| `commit_planning_docs` | `true` | Include .planning/ files in commits |

```bash
# View a specific preference
node planning-tools.cjs config get preferences.auto_commit

# Set a preference
node planning-tools.cjs config set preferences.auto_commit true
```

## Example — Setting Up for Fast Iteration

```
/settings mode auto
/settings depth quick
/settings preferences.auto_commit true
```

This makes the AI move fast: no confirmation prompts, minimal planning, auto-commit after each change.

## Example — Setting Up for Critical Work

```
/settings mode interactive
/settings depth comprehensive
/settings preferences.verification_required true
```

This makes the AI cautious: asks before each step, deep research, mandatory verification.
