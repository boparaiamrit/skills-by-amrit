---
description: Extract reusable patterns and learnings from the current session, deduplicate, and persist to .planning/LEARNINGS.md
---

<purpose>
Extract actionable learnings from the current development session. Categorize into 8 domains (Error Resolution, Debugging, Architecture, Tool/Library, Workflow, Performance, Security, Testing). Deduplicate against existing entries. Persist to .planning/LEARNINGS.md for cross-session knowledge retention.
</purpose>

<process>

<step name="determine_scope">
Parse `$ARGUMENTS` for category filter:
- Specific category (error, debug, architecture, tool, workflow, performance, security, testing) — extract only that category
- `all` or empty — scan all 8 categories
</step>

<step name="load_existing">
Load existing learnings to avoid duplication:

```bash
mkdir -p .planning
cat .planning/LEARNINGS.md 2>/dev/null || echo "NO_EXISTING_FILE"
```

If file exists, parse existing entries into a lookup map of `[category]:[title]` for dedup checks.
</step>

<step name="scan_session">
Review the current session for extractable learnings across all applicable categories:

1. **Error Resolution** — Errors encountered, stack traces analyzed, root causes found, fixes applied
2. **Debugging** — Investigation techniques, tools used, red herrings avoided, diagnostic commands
3. **Architecture** — Design decisions made, patterns chosen, trade-offs evaluated, rejected alternatives
4. **Tool/Library** — Non-obvious tool behavior, version-specific quirks, configuration gotchas
5. **Workflow** — Process that worked well, command sequences, time-saving shortcuts
6. **Performance** — Bottlenecks identified, profiling results, optimization techniques
7. **Security** — Vulnerabilities found, hardening applied, auth/authz patterns
8. **Testing** — Test strategies that worked, mocking approaches, coverage insights, flaky test fixes

For each potential learning, evaluate:
- Is this **reusable** in future sessions? (If not, skip it)
- Is this **specific enough** to be actionable? (Vague observations are not learnings)
- Is this **novel** for this project? (Common knowledge is not a learning)
</step>

<step name="deduplicate">
For each candidate learning, check against existing entries:

1. **Exact match** — Same category and pattern already recorded → skip
2. **Partial match** — Similar pattern exists but new context adds value → update existing entry with additional context
3. **New** — No existing entry covers this → add as new entry

Track counts: `new_count`, `updated_count`, `skipped_count`.
</step>

<step name="format_entries">
Format each learning:

```markdown
### [Category] — [Short Descriptive Title]
- **Pattern:** [The reusable insight — what was learned]
- **Context:** [When/where this applies — project type, tech stack, conditions]
- **Solution:** [The specific fix, technique, command, or approach]
- **Date:** [ISO date]
```

Rules:
- Title should be scannable — someone should understand the learning from the title alone
- Pattern should be generic enough to apply in similar situations
- Solution should be specific enough to act on without re-researching
- Context should specify when this does and does NOT apply
</step>

<step name="write_file">
Write or update `.planning/LEARNINGS.md`:

```markdown
# Project Learnings

> Reusable patterns and insights extracted from development sessions.

## Error Resolution

[entries sorted by date, newest first]

## Debugging

[entries sorted by date, newest first]

## Architecture

[entries sorted by date, newest first]

## Tool/Library

[entries sorted by date, newest first]

## Workflow

[entries sorted by date, newest first]

## Performance

[entries sorted by date, newest first]

## Security

[entries sorted by date, newest first]

## Testing

[entries sorted by date, newest first]

---
*Last updated: {ISO date}*
*Total entries: {count}*
```

If updating an existing file, preserve all existing entries and append/update as needed. Never remove existing learnings.
</step>

<step name="present_summary">
Present summary:

```
## Learnings Extracted

**New:** {new_count} entries added
**Updated:** {updated_count} entries enriched
**Skipped:** {skipped_count} duplicates
**Categories:** {list of categories with new/updated entries}

### New Learnings
- [{category}] {title} — {one-line pattern summary}

### Updated Learnings
- [{category}] {title} — added {what was added}

Saved to `.planning/LEARNINGS.md`
```
</step>

</process>

<learning_quality>
Good learnings:
- `[Error Resolution] — TypeScript path aliases break in Jest` — Specific, actionable, reusable
- `[Debugging] — Use git bisect for intermittent test failures` — Clear technique with context

Bad learnings:
- `[Architecture] — Code should be clean` — Too vague, not actionable
- `[Tool/Library] — npm install works` — Not novel, common knowledge
</learning_quality>

<success_criteria>
- [ ] Session scanned for learnings across applicable categories
- [ ] Each learning has Pattern, Context, Solution, Date
- [ ] Existing learnings loaded and checked for duplicates
- [ ] No duplicate entries added
- [ ] Similar entries updated rather than duplicated
- [ ] .planning/LEARNINGS.md written with all 8 category sections
- [ ] Summary presented with new/updated/skipped counts
</success_criteria>
