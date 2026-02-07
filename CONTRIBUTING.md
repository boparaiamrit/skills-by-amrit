# Contributing to Skills by Amrit

Thank you for contributing! This project aims to be the best agentic skills framework for AI coding assistants.

## How to Contribute

### Adding a New Skill

1. **Read the meta-skill first:** [writing-skills](skills/writing-skills/SKILL.md)
2. **Create the directory:** `skills/your-skill-name/`
3. **Write `SKILL.md`** following the required format:
   - YAML frontmatter with `name` and `description` (starting with "Use when...")
   - Iron Law (non-negotiable rule)
   - When to Use (activation conditions)
   - The Process (sequential, verifiable steps)
   - Red Flags (observable violations)
   - Integration (connection to other skills)
4. **Update `CLAUDE.md`** — Add to the activation table
5. **Update `README.md`** — Add to the skills library section
6. **Submit a PR** with a clear description

### Improving an Existing Skill

1. Explain what's missing or wrong
2. Propose specific changes
3. Maintain the existing structure
4. Test the skill on a real project

### Reporting Issues

- Use GitHub Issues
- Include the skill name, the problem, and a suggested fix
- If a skill produced bad results, explain the scenario

## Skill Quality Standards

Every skill must have:

- [ ] YAML frontmatter with `name` and `description`
- [ ] `description` starts with "Use when..."
- [ ] An Iron Law (absolute, falsifiable, concise)
- [ ] Clear activation conditions ("When to Use")
- [ ] Sequential, verifiable process steps
- [ ] Red flags section
- [ ] Integration section referencing related skills
- [ ] Practical, actionable content (not generic advice)

## Style Guide

- **Be specific** — "Add index on `user_id`" not "optimize the database"
- **Be absolute** — Iron laws have no exceptions
- **Be framework-agnostic** — Skills work with any tech stack
- **Use tables** — For checklists, comparisons, and quick references
- **Use code blocks** — For processes, commands, and examples
- **Prevent rationalization** — Include "Common Rationalizations" tables

## Branch Naming

```
feat/skill-name      # New skill
fix/skill-name       # Improvement to existing skill
docs/description     # Documentation changes
```

## Commit Convention

```
feat(skill-name): add new skill for X
fix(skill-name): improve process step 3
docs: update README with new skill
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
