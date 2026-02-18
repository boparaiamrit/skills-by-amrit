#!/usr/bin/env node
/**
 * planning-tools.js — Deterministic state management for AI-assisted development
 *
 * Inspired by GSD's gsd-tools.cjs, but built for skills-by-amrit's multi-agent
 * ecosystem (Antigravity, Cursor, Gemini CLI, Claude Code).
 *
 * Why this exists:
 * LLMs are unreliable at structured markdown editing — incrementing counters,
 * updating tables, maintaining frontmatter. This script does these deterministically.
 *
 * Usage:
 *   node planning-tools.js <command> [args]
 *
 * Commands:
 *   init                   — Initialize .planning/ directory structure
 *   state load             — Load and display current project state
 *   state advance-task     — Advance to the next task
 *   state advance-phase    — Advance to the next phase
 *   state update-progress  — Recalculate progress from disk
 *   state add-decision     — Record a decision with rationale
 *   state add-blocker      — Record a blocker
 *   state record-metric    — Record execution metrics
 *   config get <key>       — Read a config value
 *   config set <key> <val> — Write a config value
 *   roadmap get-phase <N>  — Get phase info from ROADMAP.md
 *   roadmap update <N>     — Update phase progress in ROADMAP.md
 *   requirements check <ID>— Mark a requirement as complete
 *   verify files <paths>   — Check if expected files exist
 *   verify structure       — Validate .planning/ structure
 *   progress               — Display progress dashboard
 */

const fs = require('fs');
const path = require('path');

// ─── Constants ────────────────────────────────────────────────────────────────

const PLANNING_DIR = path.join(process.cwd(), '.planning');
const STATE_FILE = path.join(PLANNING_DIR, 'STATE.md');
const ROADMAP_FILE = path.join(PLANNING_DIR, 'ROADMAP.md');
const REQUIREMENTS_FILE = path.join(PLANNING_DIR, 'REQUIREMENTS.md');
const CONFIG_FILE = path.join(PLANNING_DIR, 'config.json');
const MEMORY_FILE = path.join(PLANNING_DIR, 'MEMORY.md');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readFileOrEmpty(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function timestamp() {
  return new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

function dateStamp() {
  return new Date().toISOString().split('T')[0];
}

function output(data) {
  if (typeof data === 'object') {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(data);
  }
}

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

// ─── Init Command ─────────────────────────────────────────────────────────────

function cmdInit() {
  const dirs = [
    PLANNING_DIR,
    path.join(PLANNING_DIR, 'plans'),
    path.join(PLANNING_DIR, 'research'),
    path.join(PLANNING_DIR, 'debug'),
    path.join(PLANNING_DIR, 'sessions'),
    path.join(PLANNING_DIR, 'sessions', '_archive'),
    path.join(PLANNING_DIR, 'decisions'),
    path.join(PLANNING_DIR, 'context'),
    path.join(PLANNING_DIR, 'handoffs'),
    path.join(PLANNING_DIR, 'handoffs', '_history'),
    path.join(PLANNING_DIR, 'uat'),
    path.join(PLANNING_DIR, 'phases'),
  ];

  dirs.forEach(ensureDir);

  // Create config.json if it doesn't exist
  if (!fs.existsSync(CONFIG_FILE)) {
    writeJSON(CONFIG_FILE, {
      project: path.basename(process.cwd()),
      initialized: new Date().toISOString(),
      current_phase: 0,
      current_plan: 0,
      current_task: 0,
      mode: 'interactive',        // interactive | auto
      depth: 'standard',          // quick | standard | comprehensive
      preferences: {
        auto_commit: false,
        auto_test: true,
        verification_required: true,
        research_before_planning: true,
        plan_check_before_execute: false,
        auto_advance_phases: false,
        commit_planning_docs: true
      }
    });
  }

  // Create STATE.md if it doesn't exist
  if (!fs.existsSync(STATE_FILE)) {
    const content = `# Project State

## Position
- **Phase:** 0 (Initialization)
- **Plan:** 0
- **Task:** 0

## Status
- **Overall:** 🟢 On Track
- **Active tasks:** None
- **Blockers:** None

## Progress
| Phase | Status | Plans | Tasks |
|-------|--------|-------|-------|

## Decisions
| Date | Decision | Rationale |
|------|----------|-----------|

## Metrics
| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|

## History
- ${timestamp()} — Project initialized with planning-tools
`;
    fs.writeFileSync(STATE_FILE, content, 'utf8');
  }

  // Create context files if they don't exist
  const contextFiles = {
    [path.join(PLANNING_DIR, 'decisions', 'DECISIONS.md')]: `# Decision Log\n\n> Append-only. Every significant decision goes here.\n\n`,
    [path.join(PLANNING_DIR, 'context', 'architecture.md')]: `# Architecture Decisions\n\n> Updated as architecture evolves.\n\n`,
    [path.join(PLANNING_DIR, 'context', 'patterns.md')]: `# Established Patterns\n\n> Code patterns that must be followed.\n\n`,
    [path.join(PLANNING_DIR, 'context', 'gotchas.md')]: `# Known Gotchas\n\n> Bugs, workarounds, and traps.\n\n`,
    [path.join(PLANNING_DIR, 'context', 'tech-debt.md')]: `# Technical Debt\n\n> Known debt and estimated effort to fix.\n\n`,
  };

  for (const [filePath, content] of Object.entries(contextFiles)) {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }

  output({
    status: 'initialized',
    directory: PLANNING_DIR,
    files_created: dirs.length,
    config: readJSON(CONFIG_FILE)
  });
}

// ─── State Commands ───────────────────────────────────────────────────────────

function cmdStateLoad() {
  if (!fs.existsSync(STATE_FILE)) {
    fail('.planning/STATE.md not found. Run: node planning-tools.js init');
  }

  const config = readJSON(CONFIG_FILE) || {};
  const state = readFileOrEmpty(STATE_FILE);

  // Parse position from state
  const phaseMatch = state.match(/\*\*Phase:\*\*\s*(\d+)/);
  const planMatch = state.match(/\*\*Plan:\*\*\s*(\d+)/);
  const taskMatch = state.match(/\*\*Task:\*\*\s*(\d+)/);

  output({
    status: 'loaded',
    position: {
      phase: phaseMatch ? parseInt(phaseMatch[1]) : 0,
      plan: planMatch ? parseInt(planMatch[1]) : 0,
      task: taskMatch ? parseInt(taskMatch[1]) : 0,
    },
    mode: config.mode || 'interactive',
    depth: config.depth || 'standard',
    preferences: config.preferences || {}
  });
}

function cmdStateAdvanceTask() {
  if (!fs.existsSync(STATE_FILE)) {
    fail('.planning/STATE.md not found');
  }

  let state = readFileOrEmpty(STATE_FILE);
  const taskMatch = state.match(/(\*\*Task:\*\*\s*)(\d+)/);

  if (taskMatch) {
    const newTask = parseInt(taskMatch[2]) + 1;
    state = state.replace(taskMatch[0], `${taskMatch[1]}${newTask}`);
    fs.writeFileSync(STATE_FILE, state, 'utf8');

    // Append to history
    appendHistory(state, `Task advanced to ${newTask}`);

    output({ status: 'advanced', task: newTask });
  } else {
    fail('Could not find task counter in STATE.md');
  }
}

function cmdStateAdvancePhase() {
  if (!fs.existsSync(STATE_FILE)) {
    fail('.planning/STATE.md not found');
  }

  let state = readFileOrEmpty(STATE_FILE);
  const phaseMatch = state.match(/(\*\*Phase:\*\*\s*)(\d+)(\s*\([^)]*\))?/);

  if (phaseMatch) {
    const newPhase = parseInt(phaseMatch[2]) + 1;
    state = state.replace(phaseMatch[0], `${phaseMatch[1]}${newPhase}`);
    // Reset plan and task counters
    state = state.replace(/(\*\*Plan:\*\*\s*)\d+/, `$11`);
    state = state.replace(/(\*\*Task:\*\*\s*)\d+/, `$10`);
    fs.writeFileSync(STATE_FILE, state, 'utf8');

    // Update config
    const config = readJSON(CONFIG_FILE);
    if (config) {
      config.current_phase = newPhase;
      config.current_plan = 1;
      config.current_task = 0;
      writeJSON(CONFIG_FILE, config);
    }

    appendHistory(state, `Phase advanced to ${newPhase}`);
    output({ status: 'advanced', phase: newPhase, plan: 1, task: 0 });
  } else {
    fail('Could not find phase counter in STATE.md');
  }
}

function cmdStateUpdateProgress() {
  if (!fs.existsSync(STATE_FILE)) {
    fail('.planning/STATE.md not found');
  }

  // Count summaries and plans on disk
  const phaseDirs = fs.existsSync(path.join(PLANNING_DIR, 'phases'))
    ? fs.readdirSync(path.join(PLANNING_DIR, 'phases')).filter(f => {
        const fullPath = path.join(PLANNING_DIR, 'phases', f);
        return fs.statSync(fullPath).isDirectory();
      })
    : [];

  const planFiles = fs.existsSync(path.join(PLANNING_DIR, 'plans'))
    ? fs.readdirSync(path.join(PLANNING_DIR, 'plans')).filter(f => f.endsWith('.md'))
    : [];

  const progress = {
    total_phases: phaseDirs.length,
    total_plans: planFiles.length,
    phases: {}
  };

  // Count summaries per phase
  for (const dir of phaseDirs) {
    const phaseDir = path.join(PLANNING_DIR, 'phases', dir);
    const files = fs.readdirSync(phaseDir);
    const plans = files.filter(f => f.includes('-PLAN'));
    const summaries = files.filter(f => f.includes('-SUMMARY'));
    const verifications = files.filter(f => f.includes('-VERIFICATION'));

    progress.phases[dir] = {
      plans: plans.length,
      summaries: summaries.length,
      verified: verifications.length > 0,
      complete: plans.length > 0 && plans.length === summaries.length
    };
  }

  // Update STATE.md progress table
  let state = readFileOrEmpty(STATE_FILE);
  const tableStart = state.indexOf('## Progress');
  if (tableStart !== -1) {
    const tableEnd = state.indexOf('\n## ', tableStart + 1);
    const newTable = `## Progress\n| Phase | Status | Plans | Tasks |\n|-------|--------|-------|-------|\n` +
      Object.entries(progress.phases).map(([name, info]) => {
        const status = info.complete ? '✅ Complete' : info.summaries > 0 ? '🔄 In Progress' : '⬜ Not Started';
        return `| ${name} | ${status} | ${info.summaries}/${info.plans} | - |`;
      }).join('\n') + '\n';

    state = state.slice(0, tableStart) + newTable + (tableEnd !== -1 ? state.slice(tableEnd) : '');
    fs.writeFileSync(STATE_FILE, state, 'utf8');
  }

  output(progress);
}

function cmdStateAddDecision(args) {
  const decision = args.join(' ');
  if (!decision) {
    fail('Usage: planning-tools state add-decision "decision text" --rationale "why"');
  }

  const rationaleIdx = args.indexOf('--rationale');
  const decisionText = rationaleIdx > 0 ? args.slice(0, rationaleIdx).join(' ') : decision;
  const rationale = rationaleIdx > 0 ? args.slice(rationaleIdx + 1).join(' ') : 'Not specified';

  // Append to STATE.md decisions table
  let state = readFileOrEmpty(STATE_FILE);
  const decisionsSection = state.indexOf('## Decisions');
  if (decisionsSection !== -1) {
    const nextSection = state.indexOf('\n## ', decisionsSection + 1);
    const insertPoint = nextSection !== -1 ? nextSection : state.length;
    const newRow = `| ${dateStamp()} | ${decisionText} | ${rationale} |\n`;
    state = state.slice(0, insertPoint) + newRow + state.slice(insertPoint);
    fs.writeFileSync(STATE_FILE, state, 'utf8');
  }

  // Also append to DECISIONS.md
  const decisionsFile = path.join(PLANNING_DIR, 'decisions', 'DECISIONS.md');
  const entry = `\n## ${dateStamp()} — ${decisionText}\n**Decision:** ${decisionText}\n**Rationale:** ${rationale}\n`;
  fs.appendFileSync(decisionsFile, entry, 'utf8');

  output({ status: 'recorded', decision: decisionText, rationale });
}

function cmdStateAddBlocker(args) {
  const blocker = args.join(' ');
  if (!blocker) fail('Usage: planning-tools state add-blocker "blocker description"');

  let state = readFileOrEmpty(STATE_FILE);
  state = state.replace(
    /(\*\*Blockers:\*\*\s*)(None|.*)$/m,
    `$1${blocker}`
  );
  state = state.replace(
    /(\*\*Overall:\*\*\s*)🟢 On Track/,
    '$1🔴 Blocked'
  );

  fs.writeFileSync(STATE_FILE, state, 'utf8');
  appendHistory(state, `Blocker added: ${blocker}`);

  output({ status: 'recorded', blocker });
}

function cmdStateRecordMetric(args) {
  const plan = args[0] || 'unknown';
  const duration = args[1] || '?';
  const tasks = args[2] || '?';
  const files = args[3] || '?';

  let state = readFileOrEmpty(STATE_FILE);
  const metricsSection = state.indexOf('## Metrics');
  if (metricsSection !== -1) {
    const nextSection = state.indexOf('\n## ', metricsSection + 1);
    const insertPoint = nextSection !== -1 ? nextSection : state.length;
    const newRow = `| ${plan} | ${duration} | ${tasks} | ${files} |\n`;
    state = state.slice(0, insertPoint) + newRow + state.slice(insertPoint);
    fs.writeFileSync(STATE_FILE, state, 'utf8');
  }

  output({ status: 'recorded', plan, duration, tasks, files });
}

function appendHistory(state, message) {
  const historySection = state.indexOf('## History');
  if (historySection !== -1) {
    const insertPoint = state.indexOf('\n', historySection) + 1;
    // Find the end of the header line (after "## History\n")
    const afterHeader = state.indexOf('\n', insertPoint);
    if (afterHeader !== -1) {
      const newEntry = `- ${timestamp()} — ${message}\n`;
      state = state.slice(0, afterHeader + 1) + newEntry + state.slice(afterHeader + 1);
      fs.writeFileSync(STATE_FILE, state, 'utf8');
    }
  }
}

// ─── Config Commands ──────────────────────────────────────────────────────────

function cmdConfigGet(args) {
  const key = args[0];
  if (!key) fail('Usage: planning-tools config get <key>');

  const config = readJSON(CONFIG_FILE);
  if (!config) fail('config.json not found');

  // Support dot-notation: preferences.auto_commit
  const parts = key.split('.');
  let value = config;
  for (const part of parts) {
    if (value === undefined || value === null) {
      output('undefined');
      return;
    }
    value = value[part];
  }

  output(value);
}

function cmdConfigSet(args) {
  const key = args[0];
  const value = args.slice(1).join(' ');
  if (!key || !value) fail('Usage: planning-tools config set <key> <value>');

  const config = readJSON(CONFIG_FILE);
  if (!config) fail('config.json not found');

  // Parse value type
  let parsed;
  if (value === 'true') parsed = true;
  else if (value === 'false') parsed = false;
  else if (!isNaN(value)) parsed = Number(value);
  else parsed = value;

  // Support dot-notation: preferences.auto_commit
  const parts = key.split('.');
  let obj = config;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!obj[parts[i]]) obj[parts[i]] = {};
    obj = obj[parts[i]];
  }
  obj[parts[parts.length - 1]] = parsed;

  writeJSON(CONFIG_FILE, config);
  output({ status: 'updated', key, value: parsed });
}

// ─── Roadmap Commands ─────────────────────────────────────────────────────────

function cmdRoadmapGetPhase(args) {
  const phaseNum = parseInt(args[0]);
  if (isNaN(phaseNum)) fail('Usage: planning-tools roadmap get-phase <number>');

  const roadmap = readFileOrEmpty(ROADMAP_FILE);
  if (!roadmap) fail('ROADMAP.md not found');

  // Find the phase section
  const regex = new RegExp(`## Phase ${phaseNum}[:\\s—-]+(.+?)(?=\\n## Phase \\d|$)`, 's');
  const match = roadmap.match(regex);

  if (match) {
    output({
      phase: phaseNum,
      content: match[0].trim(),
      title: match[1] ? match[1].split('\n')[0].trim() : `Phase ${phaseNum}`
    });
  } else {
    fail(`Phase ${phaseNum} not found in ROADMAP.md`);
  }
}

function cmdRoadmapUpdate(args) {
  const phaseNum = parseInt(args[0]);
  if (isNaN(phaseNum)) fail('Usage: planning-tools roadmap update <phase-number>');

  // Count plans and summaries for this phase
  const phaseDir = path.join(PLANNING_DIR, 'phases');
  if (!fs.existsSync(phaseDir)) {
    output({ status: 'no-phases-dir', phase: phaseNum });
    return;
  }

  const phaseFolders = fs.readdirSync(phaseDir).filter(f =>
    f.startsWith(`${String(phaseNum).padStart(2, '0')}-`) &&
    fs.statSync(path.join(phaseDir, f)).isDirectory()
  );

  let totalPlans = 0;
  let completedPlans = 0;

  for (const folder of phaseFolders) {
    const files = fs.readdirSync(path.join(phaseDir, folder));
    totalPlans += files.filter(f => f.includes('-PLAN')).length;
    completedPlans += files.filter(f => f.includes('-SUMMARY')).length;
  }

  output({
    phase: phaseNum,
    total_plans: totalPlans,
    completed_plans: completedPlans,
    complete: totalPlans > 0 && totalPlans === completedPlans
  });
}

// ─── Requirements Commands ────────────────────────────────────────────────────

function cmdRequirementsCheck(args) {
  const reqIds = args;
  if (reqIds.length === 0) fail('Usage: planning-tools requirements check <REQ-ID> [REQ-ID...]');

  let requirements = readFileOrEmpty(REQUIREMENTS_FILE);
  if (!requirements) fail('REQUIREMENTS.md not found');

  const checked = [];
  for (const id of reqIds) {
    // Find the checkbox line containing this ID
    const regex = new RegExp(`(- \\[)( )(\\].*${id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}.*)`, 'i');
    const match = requirements.match(regex);
    if (match) {
      requirements = requirements.replace(regex, '$1x$3');
      checked.push(id);
    }
  }

  fs.writeFileSync(REQUIREMENTS_FILE, requirements, 'utf8');
  output({ status: 'checked', requirements: checked });
}

// ─── Verify Commands ──────────────────────────────────────────────────────────

function cmdVerifyFiles(args) {
  const results = {};
  for (const filePath of args) {
    results[filePath] = fs.existsSync(path.resolve(filePath));
  }

  const allExist = Object.values(results).every(Boolean);
  output({
    status: allExist ? 'pass' : 'fail',
    files: results
  });

  if (!allExist) process.exit(1);
}

function cmdVerifyStructure() {
  const required = [
    PLANNING_DIR,
    STATE_FILE,
    CONFIG_FILE,
    path.join(PLANNING_DIR, 'plans'),
    path.join(PLANNING_DIR, 'decisions'),
    path.join(PLANNING_DIR, 'context'),
    path.join(PLANNING_DIR, 'sessions'),
    path.join(PLANNING_DIR, 'handoffs'),
  ];

  const optional = [
    ROADMAP_FILE,
    REQUIREMENTS_FILE,
    MEMORY_FILE,
    path.join(PLANNING_DIR, 'research'),
    path.join(PLANNING_DIR, 'phases'),
  ];

  const results = {
    required: {},
    optional: {},
    valid: true
  };

  for (const item of required) {
    const exists = fs.existsSync(item);
    results.required[path.relative(process.cwd(), item)] = exists;
    if (!exists) results.valid = false;
  }

  for (const item of optional) {
    results.optional[path.relative(process.cwd(), item)] = fs.existsSync(item);
  }

  output(results);
  if (!results.valid) process.exit(1);
}

// ─── Progress Dashboard ──────────────────────────────────────────────────────

function cmdProgress() {
  const config = readJSON(CONFIG_FILE);
  const state = readFileOrEmpty(STATE_FILE);

  if (!config) fail('.planning/config.json not found. Run: node planning-tools.js init');

  const planFiles = fs.existsSync(path.join(PLANNING_DIR, 'plans'))
    ? fs.readdirSync(path.join(PLANNING_DIR, 'plans')).filter(f => f.endsWith('.md'))
    : [];

  const sessions = fs.existsSync(path.join(PLANNING_DIR, 'sessions'))
    ? fs.readdirSync(path.join(PLANNING_DIR, 'sessions')).filter(f => f.endsWith('.md'))
    : [];

  output({
    project: config.project,
    phase: config.current_phase,
    plan: config.current_plan,
    task: config.current_task,
    mode: config.mode,
    depth: config.depth,
    total_plans: planFiles.length,
    total_sessions: sessions.length,
    initialized: config.initialized
  });
}

// ─── CLI Router ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];
const subcommand = args[1];
const restArgs = args.slice(2);

switch (command) {
  case 'init':
    cmdInit();
    break;

  case 'state':
    switch (subcommand) {
      case 'load':
        cmdStateLoad();
        break;
      case 'advance-task':
        cmdStateAdvanceTask();
        break;
      case 'advance-phase':
        cmdStateAdvancePhase();
        break;
      case 'update-progress':
        cmdStateUpdateProgress();
        break;
      case 'add-decision':
        cmdStateAddDecision(restArgs);
        break;
      case 'add-blocker':
        cmdStateAddBlocker(restArgs);
        break;
      case 'record-metric':
        cmdStateRecordMetric(restArgs);
        break;
      default:
        fail(`Unknown state command: ${subcommand}. Available: load, advance-task, advance-phase, update-progress, add-decision, add-blocker, record-metric`);
    }
    break;

  case 'config':
    switch (subcommand) {
      case 'get':
        cmdConfigGet(restArgs);
        break;
      case 'set':
        cmdConfigSet(restArgs);
        break;
      default:
        fail(`Unknown config command: ${subcommand}. Available: get, set`);
    }
    break;

  case 'roadmap':
    switch (subcommand) {
      case 'get-phase':
        cmdRoadmapGetPhase(restArgs);
        break;
      case 'update':
        cmdRoadmapUpdate(restArgs);
        break;
      default:
        fail(`Unknown roadmap command: ${subcommand}. Available: get-phase, update`);
    }
    break;

  case 'requirements':
    switch (subcommand) {
      case 'check':
        cmdRequirementsCheck(restArgs);
        break;
      default:
        fail(`Unknown requirements command: ${subcommand}. Available: check`);
    }
    break;

  case 'verify':
    switch (subcommand) {
      case 'files':
        cmdVerifyFiles(restArgs);
        break;
      case 'structure':
        cmdVerifyStructure();
        break;
      default:
        fail(`Unknown verify command: ${subcommand}. Available: files, structure`);
    }
    break;

  case 'progress':
    cmdProgress();
    break;

  case 'help':
  case '--help':
  case '-h':
    console.log(`
planning-tools — Deterministic state management for AI-assisted development

COMMANDS:
  init                            Initialize .planning/ directory
  state load                      Load current project state
  state advance-task              Advance task counter
  state advance-phase             Advance phase counter (resets plan/task)
  state update-progress           Recalculate progress from disk
  state add-decision <text>       Record a decision (--rationale "why")
  state add-blocker <text>        Record a blocker
  state record-metric <plan> <duration> <tasks> <files>
  config get <key>                Read config (dot notation: preferences.auto_commit)
  config set <key> <value>        Write config
  roadmap get-phase <N>           Get phase info
  roadmap update <N>              Update phase progress
  requirements check <ID...>      Mark requirements complete
  verify files <path...>          Check if files exist
  verify structure                Validate .planning/ structure
  progress                        Show progress dashboard

EXAMPLES:
  node planning-tools.js init
  node planning-tools.js state advance-task
  node planning-tools.js config set mode auto
  node planning-tools.js config get preferences.auto_commit
  node planning-tools.js requirements check AUTH-01 AUTH-02
  node planning-tools.js verify files src/auth.ts tests/auth.test.ts
`);
    break;

  default:
    fail(`Unknown command: ${command}. Run with --help for usage.`);
}
