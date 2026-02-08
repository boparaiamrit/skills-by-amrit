# Skills by Amrit — Maintainer Guide for AI Agents

> This file provides instructions for AI agents working on this repository.
> Read this before making changes that affect asset counts or versioning.

## Asset Count Synchronization

The `package.json` description field contains counts that are used for marketing/documentation:

```
"30 skills, 25 commands, 29 workflows, 7 agents, 10 cursor rules"
```

### When to Update Counts

**Update `package.json` description when:**
- Adding a new skill (SKILL.md in `skills/*/`)
- Adding a new command (`commands/*.md`)
- Adding a new workflow (`workflows/*.md`)
- Adding a new agent (`agents/*.md`)
- Adding a new cursor rule (`cursor-rules/*.md`)

### How to Get Current Counts

Run this PowerShell command to get accurate counts:

```powershell
$skills = (Get-ChildItem -Path skills -Recurse -Filter "SKILL.md").Count
$commands = (Get-ChildItem -Path commands -Filter "*.md").Count
$workflows = (Get-ChildItem -Path workflows -Filter "*.md").Count
$agents = (Get-ChildItem -Path agents -Filter "*.md").Count
$rules = (Get-ChildItem -Path cursor-rules -Filter "*.md").Count

Write-Host @"
📊 Current Asset Counts:
   Skills:       $skills
   Commands:     $commands
   Workflows:    $workflows
   Agents:       $agents
   Cursor Rules: $rules
"@
```

Or in Bash:

```bash
echo "📊 Current Asset Counts:"
echo "   Skills:       $(find skills -name 'SKILL.md' | wc -l)"
echo "   Commands:     $(find commands -name '*.md' | wc -l)"
echo "   Workflows:    $(find workflows -name '*.md' | wc -l)"
echo "   Agents:       $(find agents -name '*.md' | wc -l)"
echo "   Cursor Rules: $(find cursor-rules -name '*.md' | wc -l)"
```

## Files to Update When Adding Skills

When you add a new skill, update these files:

| File | What to Update |
|------|----------------|
| `package.json` | Update skill count in description |
| `CLAUDE.md` | Add to skill activation table |
| `GEMINI.md` | Add to skill activation table |
| `README.md` | Update count in tagline (line 4) |
| `docs/index.html` | Update meta description |

### Optional Updates (for major releases)

| File | What to Update |
|------|----------------|
| `CHANGELOG.md` | Document the new skill |
| `docs/AUDIT-REPORT.md` | If referenced there |

## Pre-Release Checklist

Before publishing a new version:

1. **Verify counts match reality:**
   ```powershell
   # Run count check (should match package.json description)
   ```

2. **Update CHANGELOG.md** with new features

3. **Update version** using npm scripts:
   - Patch: `npm run release:patch` (bug fixes)
   - Minor: `npm run release:minor` (new features)
   - Major: `npm run release:major` (breaking changes)

## CI Pipeline Behavior

The CI pipeline **reports** asset counts but **does not fail** on mismatches.
This is intentional — the counts in package.json are for marketing purposes.

The actual installed skills are determined by the `skills/` folder contents,
not by any hardcoded number.

## Quick Reference: File Locations

```
skills-by-amrit/
├── skills/           # SKILL.md files (one per subfolder)
├── commands/         # *.md files
├── workflows/        # *.md files
├── agents/           # *.md files
├── cursor-rules/     # *.md files
├── package.json      # Contains description with counts
├── README.md         # Contains tagline with counts
├── CLAUDE.md         # Agent entry point
├── GEMINI.md         # Agent entry point
└── docs/
    └── index.html    # Landing page meta description
```
