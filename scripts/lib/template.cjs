/**
 * Template — Template rendering with variable substitution
 */

const fs = require('fs');
const path = require('path');
const { normalizePhaseName, findPhaseInternal, generateSlugInternal, toPosixPath, output, error } = require('./core.cjs');
const { reconstructFrontmatter } = require('./frontmatter.cjs');

function cmdTemplateRender(cwd, templateName, vars, raw) {
  if (!templateName) {
    error('template name required');
  }

  // Look for template in .planning/templates/ or use built-in
  const templateDir = path.join(cwd, '.planning', 'templates');
  const templatePath = path.join(templateDir, templateName.endsWith('.md') ? templateName : templateName + '.md');

  let content;
  if (fs.existsSync(templatePath)) {
    content = fs.readFileSync(templatePath, 'utf-8');
  } else {
    // Built-in templates
    const builtins = getBuiltinTemplates();
    if (builtins[templateName]) {
      content = builtins[templateName];
    } else {
      error(`Template not found: ${templateName}. Available: ${Object.keys(builtins).join(', ')}`);
      return;
    }
  }

  // Variable substitution: {{key}} -> value
  if (vars && typeof vars === 'object') {
    for (const [key, value] of Object.entries(vars)) {
      content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
  }

  // Remove unreplaced variables
  content = content.replace(/\{\{[^}]+\}\}/g, '[TBD]');

  output({ rendered: true, template: templateName, content }, raw, content);
}

function cmdTemplateList(cwd, raw) {
  const templateDir = path.join(cwd, '.planning', 'templates');
  const builtins = Object.keys(getBuiltinTemplates());

  let custom = [];
  try {
    if (fs.existsSync(templateDir)) {
      custom = fs.readdirSync(templateDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
    }
  } catch {}

  output({
    builtin: builtins,
    custom,
    total: builtins.length + custom.length,
  }, raw, [...builtins, ...custom].join('\n'));
}

function cmdTemplateFill(cwd, templateType, options, raw) {
  if (!templateType) { error('template type required: summary, plan, or verification'); }
  if (!options.phase) { error('--phase required'); }

  const phaseInfo = findPhaseInternal(cwd, options.phase);
  if (!phaseInfo || !phaseInfo.found) { output({ error: 'Phase not found', phase: options.phase }, raw); return; }

  const padded = normalizePhaseName(options.phase);
  const today = new Date().toISOString().split('T')[0];
  const phaseName = options.name || phaseInfo.phase_name || 'Unnamed';
  const phaseSlug = phaseInfo.phase_slug || generateSlugInternal(phaseName);
  const phaseId = `${padded}-${phaseSlug}`;
  const planNum = (options.plan || '01').padStart(2, '0');
  const fields = options.fields || {};

  let frontmatter, body, fileName;

  switch (templateType) {
    case 'summary': {
      frontmatter = {
        phase: phaseId,
        plan: planNum,
        subsystem: '[primary category]',
        tags: [],
        provides: [],
        affects: [],
        'key-files': { created: [], modified: [] },
        'key-decisions': [],
        duration: '[X]min',
        completed: today,
        ...fields,
      };
      body = [
        `# Phase ${options.phase}: ${phaseName} Summary`,
        '',
        '**[Substantive one-liner describing outcome]**',
        '',
        '## Performance',
        '- **Duration:** [time]',
        '- **Tasks:** [count completed]',
        '- **Files modified:** [count]',
        '',
        '## Accomplishments',
        '- [Key outcome 1]',
        '- [Key outcome 2]',
        '',
        '## Task Commits',
        '1. **Task 1: [task name]** - `hash`',
        '',
        '## Files Created/Modified',
        '- `path/to/file.ts` - What it does',
        '',
        '## Decisions & Deviations',
        '[Key decisions or "None - followed plan as specified"]',
        '',
        '## Next Phase Readiness',
        '[What\'s ready for next phase]',
      ].join('\n');
      fileName = `${padded}-${planNum}-SUMMARY.md`;
      break;
    }
    case 'plan': {
      const planType = options.type || 'execute';
      const wave = parseInt(options.wave) || 1;
      frontmatter = {
        phase: phaseId,
        plan: planNum,
        type: planType,
        wave,
        depends_on: [],
        files_modified: [],
        autonomous: true,
        must_haves: { truths: [], artifacts: [], key_links: [] },
        ...fields,
      };
      body = [
        `# Phase ${options.phase} Plan ${planNum}: [Title]`,
        '',
        '## Objective',
        '- **What:** [What this plan builds]',
        '- **Why:** [Why it matters for the phase goal]',
        '- **Output:** [Concrete deliverable]',
        '',
        '## Context',
        '@.planning/PROJECT.md',
        '@.planning/ROADMAP.md',
        '@.planning/STATE.md',
        '',
        '## Tasks',
        '',
        '<task type="code">',
        '  <name>[Task name]</name>',
        '  <files>[file paths]</files>',
        '  <action>[What to do]</action>',
        '  <verify>[How to verify]</verify>',
        '  <done>[Definition of done]</done>',
        '</task>',
        '',
        '## Verification',
        '[How to verify this plan achieved its objective]',
        '',
        '## Success Criteria',
        '- [ ] [Criterion 1]',
        '- [ ] [Criterion 2]',
      ].join('\n');
      fileName = `${padded}-${planNum}-PLAN.md`;
      break;
    }
    case 'verification': {
      frontmatter = {
        phase: phaseId,
        verified: new Date().toISOString(),
        status: 'pending',
        score: '0/0 must-haves verified',
        ...fields,
      };
      body = [
        `# Phase ${options.phase}: ${phaseName} — Verification`,
        '',
        '## Observable Truths',
        '| # | Truth | Status | Evidence |',
        '|---|-------|--------|----------|',
        '| 1 | [Truth] | pending | |',
        '',
        '## Required Artifacts',
        '| Artifact | Expected | Status | Details |',
        '|----------|----------|--------|---------|',
        '| [path] | [what] | pending | |',
        '',
        '## Requirements Coverage',
        '| Requirement | Status | Blocking Issue |',
        '|-------------|--------|----------------|',
        '| [req] | pending | |',
        '',
        '## Result',
        '[Pending verification]',
      ].join('\n');
      fileName = `${padded}-VERIFICATION.md`;
      break;
    }
    default:
      error(`Unknown template type: ${templateType}. Available: summary, plan, verification`);
      return;
  }

  const fullContent = `---\n${reconstructFrontmatter(frontmatter)}\n---\n\n${body}\n`;
  const outPath = path.join(cwd, phaseInfo.directory, fileName);

  if (fs.existsSync(outPath)) {
    output({ error: 'File already exists', path: toPosixPath(path.relative(cwd, outPath)) }, raw);
    return;
  }

  fs.writeFileSync(outPath, fullContent, 'utf-8');
  const relPath = toPosixPath(path.relative(cwd, outPath));
  output({ created: true, path: relPath, template: templateType }, raw, relPath);
}

function getBuiltinTemplates() {
  return {
    'state': [
      '# Session State',
      '',
      '## Position',
      '**Milestone:** {{milestone}}',
      '**Current Phase:** {{phase}}',
      '**Current Phase Name:** {{phase_name}}',
      '**Total Phases:** {{total_phases}}',
      '**Current Plan:** {{current_plan}}',
      '**Total Plans in Phase:** {{total_plans}}',
      '**Status:** {{status}}',
      '**Progress:** {{progress}}',
      '**Last Activity:** {{date}}',
      '',
      '## Decisions',
      'None yet.',
      '',
      '## Blockers',
      'None.',
      '',
      '## Session',
      '**Last Date:** {{date}}',
      '**Stopped At:** [not yet stopped]',
      '**Resume File:** None',
    ].join('\n'),
    'context': [
      '# Phase {{phase}}: {{phase_name}} — Context',
      '',
      '## What We Know',
      '[Key facts about this phase]',
      '',
      '## Constraints',
      '[Technical constraints, deadlines, dependencies]',
      '',
      '## Open Questions',
      '- [Question 1]',
    ].join('\n'),
    'research': [
      '# Phase {{phase}}: {{phase_name}} — Research',
      '',
      '## Existing Code Analysis',
      '[Analysis of relevant code]',
      '',
      '## Patterns to Follow',
      '[Patterns found in codebase]',
      '',
      '## Technical Approach',
      '[Recommended approach]',
    ].join('\n'),
  };
}

module.exports = {
  cmdTemplateRender,
  cmdTemplateList,
  cmdTemplateFill,
};
