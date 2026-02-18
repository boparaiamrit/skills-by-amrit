---
description: "View or modify project planning configuration — mode, depth, workflow toggles, and preferences."
---

# `/settings` — Project Configuration

> View and modify the `.planning/config.json` that controls how planning and execution behave.

## Usage

```
/settings              — Show current settings
/settings set <key> <value> — Change a setting
/settings reset        — Reset to defaults
```

## Available Settings

### Mode
```
node planning-tools.cjs config get mode
node planning-tools.cjs config set mode interactive   # Ask before each step
node planning-tools.cjs config set mode auto           # Auto-advance through steps
```

### Depth
```
node planning-tools.cjs config get depth
node planning-tools.cjs config set depth quick           # Minimal planning, maximum speed
node planning-tools.cjs config set depth standard         # Balanced (default)
node planning-tools.cjs config set depth comprehensive    # Maximum detail, full research
```

### Workflow Preferences
```
# Auto-commit after each task
node planning-tools.cjs config set preferences.auto_commit true

# Auto-run tests during execution
node planning-tools.cjs config set preferences.auto_test true

# Require verification before marking tasks done
node planning-tools.cjs config set preferences.verification_required true

# Run research before planning
node planning-tools.cjs config set preferences.research_before_planning true

# Validate plan structure before execution
node planning-tools.cjs config set preferences.plan_check_before_execute false

# Auto-advance to next phase when current completes
node planning-tools.cjs config set preferences.auto_advance_phases false

# Include .planning/ in git commits
node planning-tools.cjs config set preferences.commit_planning_docs true
```

## Settings Reference

| Key | Values | Default | Description |
|-----|--------|---------|-------------|
| `mode` | interactive, auto | interactive | How much user confirmation is needed |
| `depth` | quick, standard, comprehensive | standard | How thorough planning/research is |
| `preferences.auto_commit` | true/false | false | Auto-commit after each task |
| `preferences.auto_test` | true/false | true | Auto-run tests during execution |
| `preferences.verification_required` | true/false | true | Must verify before marking done |
| `preferences.research_before_planning` | true/false | true | Run research step before planning |
| `preferences.plan_check_before_execute` | true/false | false | Validate plan XML before executing |
| `preferences.auto_advance_phases` | true/false | false | Auto-advance phases on completion |
| `preferences.commit_planning_docs` | true/false | true | Commit .planning/ to git |

## Mode Details

### Interactive Mode (Default)
- Confirms before starting each phase
- Asks before committing
- Waits at checkpoints
- Shows full deviation reports

### Auto Mode
- Starts execution immediately
- Commits automatically
- Only stops on blockers or deviations requiring approval
- Suitable for well-defined, low-risk plans

## Depth Details

### Quick
- Skip research step — plan from existing knowledge
- 1-2 tasks per plan
- Minimal risk assessment
- For: small features, bug fixes, config changes

### Standard (Default)
- Light research — check codebase patterns
- 2-3 tasks per plan
- Standard risk assessment
- For: typical features and changes

### Comprehensive
- Full research — codebase mapping, dependency analysis
- Complete risk register
- UAT test generation
- For: large features, critical systems, unfamiliar codebases
