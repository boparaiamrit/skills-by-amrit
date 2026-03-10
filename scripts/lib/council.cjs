/**
 * Council — LLM Council/Team state machine for multi-agent coordination
 *
 * Deterministic CLI commands for council lifecycle: init, advance, message,
 * handoff, gate-check, board generation, task management, and reset.
 */

const fs = require('fs');
const path = require('path');
const { output, error, timestamp } = require('./core.cjs');

// ─── Constants ───────────────────────────────────────────────────────────────

const PRESETS = {
  full: ['researcher', 'architect', 'planner', 'executor', 'reviewer'],
  rapid: ['researcher', 'executor', 'reviewer'],
  debug: ['investigator', 'fixer', 'verifier'],
  architecture: ['researcher', 'architect', 'reviewer'],
  refactoring: ['researcher', 'planner', 'executor', 'reviewer'],
  audit: ['researcher', 'mapper', 'reviewer'],
};

const AGENT_EMOJI = {
  manager: '\uD83C\uDFAF',
  researcher: '\uD83D\uDD2C',
  architect: '\uD83D\uDCD0',
  planner: '\uD83D\uDCCB',
  executor: '\u2699\uFE0F',
  reviewer: '\uD83D\uDD0D',
  investigator: '\uD83D\uDD75\uFE0F',
  fixer: '\uD83D\uDD27',
  verifier: '\u2705',
  mapper: '\uD83D\uDDFA\uFE0F',
};

const GATE_RULES = {
  'researcher->architect': { requireHandoff: true, requireSection: 'findings' },
  'researcher->executor': { requireHandoff: true },
  'architect->planner': { requireHandoff: true, requireSection: 'design' },
  'planner->executor': { requireHandoff: true, requireTasks: true },
  'executor->reviewer': { requireHandoff: true, requireSection: 'commits' },
  'investigator->fixer': { requireHandoff: true, requireSection: 'root cause' },
  'fixer->verifier': { requireHandoff: true, requireSection: 'fix' },
  '*->reviewer': { requireAnyHandoff: true },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function councilDir(cwd) {
  return path.join(cwd, '.planning', 'council');
}

function councilJsonPath(cwd) {
  return path.join(councilDir(cwd), 'council.json');
}

function loadCouncil(cwd) {
  const p = councilJsonPath(cwd);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
}

function saveCouncil(cwd, state) {
  state.updated_at = new Date().toISOString();
  fs.writeFileSync(councilJsonPath(cwd), JSON.stringify(state, null, 2), 'utf-8');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function slugify(text, maxLen) {
  if (!text) return 'untitled';
  const max = maxLen || 40;
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max);
}

function padNum(n, width) {
  return String(n).padStart(width || 3, '0');
}

function nextNumber(dir, prefix) {
  if (!fs.existsSync(dir)) return 1;
  const entries = fs.readdirSync(dir);
  let max = 0;
  const pattern = new RegExp(`^${prefix}(\\d+)`);
  for (const e of entries) {
    const m = e.match(pattern);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  }
  return max + 1;
}

function agentEmoji(agent) {
  return AGENT_EMOJI[agent] || '\uD83D\uDC64';
}

function listHandoffs(cwd) {
  const dir = path.join(councilDir(cwd), 'handoffs');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.startsWith('handoff-') && f.endsWith('.md')).sort();
}

function listTasks(cwd) {
  const dir = path.join(councilDir(cwd), 'tasks');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();
}

function readTaskFrontmatter(cwd, filename) {
  const filePath = path.join(councilDir(cwd), 'tasks', filename);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/^---\n([\s\S]+?)\n---/);
    if (!match) return {};
    const fm = {};
    for (const line of match[1].split('\n')) {
      const kv = line.match(/^([a-z_]+):\s*(.*)/);
      if (kv) fm[kv[1]] = kv[2].trim();
    }
    return fm;
  } catch {
    return {};
  }
}

// ─── Board generation ────────────────────────────────────────────────────────

function generateBoard(cwd, state) {
  const tasks = listTasks(cwd);
  const handoffs = listHandoffs(cwd);

  const taskData = tasks.map(f => {
    const fm = readTaskFrontmatter(cwd, f);
    return { file: f, ...fm };
  });

  const blocked = taskData.filter(t => t.status === 'blocked');
  const inProgress = taskData.filter(t => t.status === 'in-progress');
  const done = taskData.filter(t => t.status === 'done');
  const pending = taskData.filter(t => !t.status || t.status === 'pending');

  const total = taskData.length;
  const doneCount = done.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const filled = Math.round(pct / 5);
  const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(20 - filled);

  const lines = [
    '# Council Board',
    '',
    `**Objective:** ${state.objective}`,
    `**Preset:** ${state.preset}`,
    `**Status:** ${state.status}`,
    `**Current Agent:** ${state.current_agent ? `${agentEmoji(state.current_agent)} ${state.current_agent}` : 'None'}`,
    `**Phase:** ${state.current_phase} / ${state.agents.length - 1}`,
    '',
    `## Progress`,
    '',
    `\`[${bar}]\` ${pct}% (${doneCount}/${total} tasks)`,
    '',
    `## Agents`,
    '',
  ];

  for (let i = 0; i < state.agents.length; i++) {
    const a = state.agents[i];
    const emoji = agentEmoji(a);
    let marker = '  ';
    if (i < state.current_phase) marker = '\u2705';
    else if (i === state.current_phase) marker = '\u25B6\uFE0F';
    else marker = '\u23F3';
    lines.push(`${marker} ${emoji} **${a}**`);
  }

  lines.push('');

  if (blocked.length > 0) {
    lines.push('## Blocked');
    lines.push('');
    for (const t of blocked) {
      lines.push(`- \uD83D\uDED1 [${t.id || '?'}] ${t.description || t.file}`);
    }
    lines.push('');
  }

  if (inProgress.length > 0) {
    lines.push('## In Progress');
    lines.push('');
    for (const t of inProgress) {
      lines.push(`- \uD83D\uDD35 [${t.id || '?'}] ${t.description || t.file} (${t.assignee || 'unassigned'})`);
    }
    lines.push('');
  }

  if (pending.length > 0) {
    lines.push('## Pending');
    lines.push('');
    for (const t of pending) {
      lines.push(`- \u26AA [${t.id || '?'}] ${t.description || t.file}`);
    }
    lines.push('');
  }

  if (done.length > 0) {
    lines.push('## Done');
    lines.push('');
    for (const t of done) {
      lines.push(`- \u2705 [${t.id || '?'}] ${t.description || t.file}`);
    }
    lines.push('');
  }

  if (handoffs.length > 0) {
    lines.push('## Handoffs');
    lines.push('');
    for (const h of handoffs) {
      lines.push(`- ${h}`);
    }
    lines.push('');
  }

  lines.push(`---`);
  lines.push(`*Auto-generated by council board at ${new Date().toISOString()}*`);

  const content = lines.join('\n');
  const boardPath = path.join(councilDir(cwd), 'BOARD.md');
  fs.writeFileSync(boardPath, content, 'utf-8');

  return { path: '.planning/council/BOARD.md', tasks_total: total, tasks_done: doneCount };
}

// ─── Commands ────────────────────────────────────────────────────────────────

function cmdCouncilInit(cwd, objective, preset, raw) {
  if (!objective) {
    error('objective required for council init');
  }

  const presetName = preset || 'full';
  const agents = PRESETS[presetName];
  if (!agents) {
    error(`Unknown preset: ${presetName}. Available: ${Object.keys(PRESETS).join(', ')}`);
  }

  const base = councilDir(cwd);
  ensureDir(base);
  ensureDir(path.join(base, 'messages'));
  ensureDir(path.join(base, 'handoffs'));
  ensureDir(path.join(base, 'tasks'));
  ensureDir(path.join(base, 'reviews'));

  const state = {
    objective,
    preset: presetName,
    agents: [...agents],
    current_phase: 0,
    current_agent: null,
    status: 'initialized',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    messages_count: 0,
    tasks_count: 0,
    handoffs_count: 0,
    gates_passed: [],
    gates_failed: [],
    history: [],
  };

  saveCouncil(cwd, state);

  const boardResult = generateBoard(cwd, state);

  output({
    initialized: true,
    objective,
    preset: presetName,
    agents,
    council_dir: '.planning/council/',
    board: boardResult.path,
  }, raw);
}

function cmdCouncilStatus(cwd, raw) {
  const state = loadCouncil(cwd);
  if (!state) {
    error('No council found. Run council init first.');
  }

  const handoffs = listHandoffs(cwd);
  const tasks = listTasks(cwd);
  const taskData = tasks.map(f => readTaskFrontmatter(cwd, f));
  const doneTasks = taskData.filter(t => t.status === 'done').length;

  output({
    objective: state.objective,
    preset: state.preset,
    agents: state.agents,
    current_phase: state.current_phase,
    current_agent: state.current_agent,
    status: state.status,
    messages_count: state.messages_count,
    tasks_count: state.tasks_count,
    tasks_done: doneTasks,
    handoffs_count: state.handoffs_count,
    handoffs: handoffs,
    gates_passed: state.gates_passed,
    gates_failed: state.gates_failed,
    created_at: state.created_at,
    updated_at: state.updated_at,
  }, raw);
}

function cmdCouncilAdvance(cwd, force, raw) {
  const state = loadCouncil(cwd);
  if (!state) {
    error('No council found. Run council init first.');
  }

  // If not yet started, activate the first agent
  if (state.current_agent === null) {
    state.current_agent = state.agents[0];
    state.status = 'active';
    state.history.push({
      action: 'started',
      agent: state.agents[0],
      phase: 0,
      at: new Date().toISOString(),
    });
    saveCouncil(cwd, state);
    generateBoard(cwd, state);
    output({
      advanced: true,
      from: null,
      to: state.agents[0],
      gate_result: 'n/a',
      phase: 0,
    }, raw);
    return;
  }

  const currentIdx = state.current_phase;
  const nextIdx = currentIdx + 1;

  if (nextIdx >= state.agents.length) {
    // Council complete
    state.status = 'completed';
    state.history.push({
      action: 'completed',
      agent: state.current_agent,
      phase: currentIdx,
      at: new Date().toISOString(),
    });
    saveCouncil(cwd, state);
    generateBoard(cwd, state);
    output({
      advanced: false,
      reason: 'Council completed — no more agents in sequence.',
      status: 'completed',
    }, raw);
    return;
  }

  const fromAgent = state.agents[currentIdx];
  const toAgent = state.agents[nextIdx];

  // Gate check unless forced
  let gateResult = 'skipped';
  if (!force) {
    const check = performGateCheck(cwd, state, fromAgent, toAgent);
    if (!check.passed) {
      state.gates_failed.push({
        gate: `${fromAgent}->${toAgent}`,
        missing: check.missing,
        at: new Date().toISOString(),
      });
      saveCouncil(cwd, state);
      output({
        advanced: false,
        from: fromAgent,
        to: toAgent,
        gate_result: 'failed',
        missing: check.missing,
      }, raw);
      return;
    }
    gateResult = 'passed';
    state.gates_passed.push({
      gate: `${fromAgent}->${toAgent}`,
      at: new Date().toISOString(),
    });
  }

  state.current_phase = nextIdx;
  state.current_agent = toAgent;
  state.status = 'active';
  state.history.push({
    action: 'advanced',
    from: fromAgent,
    to: toAgent,
    phase: nextIdx,
    gate_result: gateResult,
    at: new Date().toISOString(),
  });

  saveCouncil(cwd, state);
  generateBoard(cwd, state);

  output({
    advanced: true,
    from: fromAgent,
    to: toAgent,
    gate_result: gateResult,
    phase: nextIdx,
  }, raw);
}

function cmdCouncilMessage(cwd, from, to, type, content, raw) {
  if (!from || !to || !type) {
    error('from, to, and type required for council message');
  }

  const state = loadCouncil(cwd);
  if (!state) {
    error('No council found. Run council init first.');
  }

  const msgsDir = path.join(councilDir(cwd), 'messages');
  ensureDir(msgsDir);
  const num = nextNumber(msgsDir, 'msg-');
  const filename = `msg-${padNum(num)}.md`;
  const filePath = path.join(msgsDir, filename);

  const body = content || '[pending - agent will fill]';

  const md = [
    `# Message #${num}`,
    '',
    `**From:** ${agentEmoji(from)} ${from}`,
    `**To:** ${agentEmoji(to)} ${to}`,
    `**Type:** ${type}`,
    `**Timestamp:** ${new Date().toISOString()}`,
    '',
    '## Content',
    '',
    body,
    '',
  ].join('\n');

  fs.writeFileSync(filePath, md, 'utf-8');

  state.messages_count = (state.messages_count || 0) + 1;
  saveCouncil(cwd, state);

  output({
    message_id: num,
    path: `.planning/council/messages/${filename}`,
    from,
    to,
    type,
  }, raw);
}

function cmdCouncilHandoff(cwd, agent, summary, raw) {
  if (!agent) {
    error('agent required for council handoff');
  }

  const state = loadCouncil(cwd);
  if (!state) {
    error('No council found. Run council init first.');
  }

  const handoffsDir = path.join(councilDir(cwd), 'handoffs');
  ensureDir(handoffsDir);
  const num = nextNumber(handoffsDir, 'handoff-');
  const filename = `handoff-${padNum(num)}-${agent}.md`;
  const filePath = path.join(handoffsDir, filename);

  const summaryText = summary || '[Agent will fill summary]';

  const md = [
    `# Handoff #${num} — ${agentEmoji(agent)} ${agent}`,
    '',
    `**Agent:** ${agent}`,
    `**Timestamp:** ${new Date().toISOString()}`,
    '',
    '## Summary',
    '',
    summaryText,
    '',
    '## Key Findings',
    '',
    '- [Agent will fill findings]',
    '',
    '## Artifacts Created',
    '',
    '- [Agent will list artifacts]',
    '',
    '## Recommendations for Next Agent',
    '',
    '- [Agent will provide recommendations]',
    '',
  ].join('\n');

  fs.writeFileSync(filePath, md, 'utf-8');

  state.handoffs_count = (state.handoffs_count || 0) + 1;
  saveCouncil(cwd, state);

  output({
    handoff_id: num,
    path: `.planning/council/handoffs/${filename}`,
    agent,
  }, raw);
}

function performGateCheck(cwd, state, fromAgent, toAgent) {
  const key = `${fromAgent}->${toAgent}`;
  const wildcardKey = `*->${toAgent}`;
  const rule = GATE_RULES[key] || GATE_RULES[wildcardKey];

  if (!rule) {
    // No rule defined — pass by default
    return { passed: true, missing: [] };
  }

  const missing = [];

  if (rule.requireHandoff) {
    const handoffs = listHandoffs(cwd);
    const agentHandoff = handoffs.find(h => h.includes(`-${fromAgent}.md`));
    if (!agentHandoff) {
      missing.push(`handoff from ${fromAgent}`);
    } else if (rule.requireSection) {
      const content = fs.readFileSync(
        path.join(councilDir(cwd), 'handoffs', agentHandoff), 'utf-8'
      ).toLowerCase();
      const sectionPattern = new RegExp(`##\\s*.*${rule.requireSection}`, 'i');
      const sectionMatch = content.match(sectionPattern);
      if (sectionMatch) {
        // Check section is not empty / placeholder
        const idx = content.indexOf(sectionMatch[0]);
        const afterSection = content.slice(idx + sectionMatch[0].length);
        const nextSection = afterSection.match(/\n##\s/);
        const sectionBody = nextSection
          ? afterSection.slice(0, nextSection.index).trim()
          : afterSection.trim();
        if (!sectionBody || sectionBody.includes('[agent will fill') || sectionBody.includes('[pending')) {
          missing.push(`${rule.requireSection} section non-empty in ${fromAgent} handoff`);
        }
      } else {
        missing.push(`${rule.requireSection} section in ${fromAgent} handoff`);
      }
    }
  }

  if (rule.requireTasks) {
    const tasks = listTasks(cwd);
    if (tasks.length === 0) {
      missing.push('task files in tasks/');
    }
  }

  if (rule.requireAnyHandoff) {
    const handoffs = listHandoffs(cwd);
    if (handoffs.length === 0) {
      missing.push('at least 1 handoff');
    }
  }

  return { passed: missing.length === 0, missing };
}

function cmdCouncilGateCheck(cwd, fromAgent, toAgent, raw) {
  const state = loadCouncil(cwd);
  if (!state) {
    error('No council found. Run council init first.');
  }

  // Default to current->next if not specified
  const from = fromAgent || state.current_agent;
  const currentIdx = state.agents.indexOf(from);
  const to = toAgent || (currentIdx >= 0 && currentIdx + 1 < state.agents.length
    ? state.agents[currentIdx + 1]
    : null);

  if (!from || !to) {
    error('Cannot determine gate agents. Specify --from and --to, or ensure council is active.');
  }

  const result = performGateCheck(cwd, state, from, to);

  output({
    gate: `${from}\u2192${to}`,
    passed: result.passed,
    missing: result.missing,
  }, raw);
}

function cmdCouncilBoard(cwd, raw) {
  const state = loadCouncil(cwd);
  if (!state) {
    error('No council found. Run council init first.');
  }

  const result = generateBoard(cwd, state);
  output(result, raw);
}

function cmdCouncilTaskAdd(cwd, description, assignee, dependsOn, raw) {
  if (!description) {
    error('description required for task-add');
  }

  const state = loadCouncil(cwd);
  if (!state) {
    error('No council found. Run council init first.');
  }

  const tasksDir = path.join(councilDir(cwd), 'tasks');
  ensureDir(tasksDir);
  const num = nextNumber(tasksDir, '');
  const slug = slugify(description, 40);
  const filename = `${padNum(num)}-${slug}.md`;
  const filePath = path.join(tasksDir, filename);

  const fmLines = [
    '---',
    `id: ${num}`,
    `description: ${description}`,
    `assignee: ${assignee || 'unassigned'}`,
    `status: pending`,
    `depends_on: ${dependsOn || 'none'}`,
    `created_at: ${new Date().toISOString()}`,
    '---',
    '',
    `# Task ${num}: ${description}`,
    '',
    '[Task details to be filled by assigned agent]',
    '',
  ];

  fs.writeFileSync(filePath, fmLines.join('\n'), 'utf-8');

  state.tasks_count = (state.tasks_count || 0) + 1;
  saveCouncil(cwd, state);

  // Regenerate board
  generateBoard(cwd, state);

  output({
    task_id: num,
    path: `.planning/council/tasks/${filename}`,
    description,
    assignee: assignee || 'unassigned',
  }, raw);
}

function cmdCouncilTaskUpdate(cwd, id, status, result, raw) {
  if (!id) {
    error('task id required for task-update');
  }
  if (!status) {
    error('--status required for task-update');
  }

  const validStatuses = ['pending', 'in-progress', 'done', 'blocked'];
  if (!validStatuses.includes(status)) {
    error(`Invalid status: ${status}. Valid: ${validStatuses.join(', ')}`);
  }

  const state = loadCouncil(cwd);
  if (!state) {
    error('No council found. Run council init first.');
  }

  const tasksDir = path.join(councilDir(cwd), 'tasks');
  if (!fs.existsSync(tasksDir)) {
    error('No tasks directory found.');
  }

  // Find the task file by id prefix
  const entries = fs.readdirSync(tasksDir);
  const paddedId = padNum(parseInt(id, 10));
  const taskFile = entries.find(f => f.startsWith(paddedId + '-') || f === paddedId + '.md');

  if (!taskFile) {
    error(`Task ${id} not found.`);
  }

  const filePath = path.join(tasksDir, taskFile);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Update status in frontmatter
  content = content.replace(/^(status:\s*)(.*)$/m, `$1${status}`);

  // Append result if provided
  if (result) {
    const resultSection = `\n## Result\n\n${result}\n`;
    // Insert before final newlines or append
    if (content.match(/\n## Result\n/)) {
      content = content.replace(/(\n## Result\n)([\s\S]*?)(?=\n## |$)/, `$1\n${result}\n`);
    } else {
      content = content.trimEnd() + '\n' + resultSection;
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');

  // Regenerate board
  generateBoard(cwd, state);

  output({
    task_id: parseInt(id, 10),
    status,
    path: `.planning/council/tasks/${taskFile}`,
    result: result || null,
  }, raw);
}

function cmdCouncilReset(cwd, raw) {
  const base = councilDir(cwd);
  if (!fs.existsSync(base)) {
    error('No council found to reset.');
  }

  // Archive current council
  const ts = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '');
  const archiveName = `council-archive-${ts}`;
  const archivePath = path.join(cwd, '.planning', archiveName);

  // Copy directory recursively using sync operations
  copyDirSync(base, archivePath);

  // Remove current council contents
  removeDirContentsSync(base);

  // Create fresh structure
  ensureDir(path.join(base, 'messages'));
  ensureDir(path.join(base, 'handoffs'));
  ensureDir(path.join(base, 'tasks'));
  ensureDir(path.join(base, 'reviews'));

  const freshState = {
    objective: '',
    preset: 'full',
    agents: [...PRESETS.full],
    current_phase: 0,
    current_agent: null,
    status: 'initialized',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    messages_count: 0,
    tasks_count: 0,
    handoffs_count: 0,
    gates_passed: [],
    gates_failed: [],
    history: [],
  };

  saveCouncil(cwd, freshState);

  output({
    reset: true,
    archived_to: `.planning/${archiveName}/`,
  }, raw);
}

// ─── Filesystem helpers ──────────────────────────────────────────────────────

function copyDirSync(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeDirContentsSync(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      removeDirContentsSync(fullPath);
      fs.rmdirSync(fullPath);
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────

function cmdCouncilSummary(cwd, raw) {
  const state = loadCouncil(cwd);
  if (!state) {
    error('No council found. Run council init first.');
  }

  const handoffs = listHandoffs(cwd);
  const handoffsDir = path.join(councilDir(cwd), 'handoffs');

  const agentFindings = [];
  for (const h of handoffs) {
    const filePath = path.join(handoffsDir, h);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const agentMatch = content.match(/\*\*Agent:\*\*\s*(\S+)/);
      const agent = agentMatch ? agentMatch[1] : 'unknown';

      // Extract key findings section
      const findingsMatch = content.match(/## Key Findings\n\n([\s\S]*?)(?=\n## |$)/);
      const findings = findingsMatch ? findingsMatch[1].trim() : '[none]';

      // Extract recommendations section
      const recsMatch = content.match(/## Recommendations for Next Agent\n\n([\s\S]*?)(?=\n## |$)/);
      const recommendations = recsMatch ? recsMatch[1].trim() : '[none]';

      // Extract artifacts section
      const artifactsMatch = content.match(/## Artifacts Created\n\n([\s\S]*?)(?=\n## |$)/);
      const artifacts = artifactsMatch ? artifactsMatch[1].trim() : '[none]';

      agentFindings.push({ agent, findings, recommendations, artifacts, file: h });
    } catch {
      agentFindings.push({ agent: 'unknown', findings: '[read error]', recommendations: '', artifacts: '', file: h });
    }
  }

  // Build decisions from history
  const decisions = state.history
    .filter(h => h.action === 'advanced' || h.action === 'completed')
    .map(h => `- ${h.action}: ${h.from || 'start'} -> ${h.to || 'end'} (${h.gate_result || 'n/a'})`)
    .join('\n');

  const lines = [
    '# Council Summary',
    '',
    `**Objective:** ${state.objective}`,
    `**Preset:** ${state.preset}`,
    `**Status:** ${state.status}`,
    `**Agents:** ${state.agents.join(', ')}`,
    `**Created:** ${state.created_at}`,
    `**Updated:** ${state.updated_at}`,
    '',
    '## Key Findings Per Agent',
    '',
  ];

  for (const af of agentFindings) {
    lines.push(`### ${agentEmoji(af.agent)} ${af.agent}`);
    lines.push('');
    lines.push(af.findings);
    lines.push('');
  }

  lines.push('## Decisions Made');
  lines.push('');
  lines.push(decisions || 'No decisions recorded.');
  lines.push('');

  lines.push('## Artifacts Created');
  lines.push('');
  for (const af of agentFindings) {
    if (af.artifacts && af.artifacts !== '[none]') {
      lines.push(`**${af.agent}:**`);
      lines.push(af.artifacts);
      lines.push('');
    }
  }

  lines.push('## Recommendations');
  lines.push('');
  for (const af of agentFindings) {
    if (af.recommendations && af.recommendations !== '[none]') {
      lines.push(`**${af.agent}:**`);
      lines.push(af.recommendations);
      lines.push('');
    }
  }

  lines.push('---');
  lines.push(`*Generated at ${new Date().toISOString()}*`);

  const summaryContent = lines.join('\n');
  const summaryPath = path.join(councilDir(cwd), 'SUMMARY.md');
  fs.writeFileSync(summaryPath, summaryContent, 'utf-8');

  output({
    path: '.planning/council/SUMMARY.md',
    agents_completed: agentFindings.length,
    handoffs_synthesized: handoffs.length,
  }, raw);
}

// ─── Close ───────────────────────────────────────────────────────────────────

function cmdCouncilClose(cwd, status, raw) {
  const state = loadCouncil(cwd);
  if (!state) {
    error('No council found. Run council init first.');
  }

  const closeStatus = status || 'completed';
  const validStatuses = ['completed', 'partial', 'aborted'];
  if (!validStatuses.includes(closeStatus)) {
    error(`Invalid status: ${closeStatus}. Valid: ${validStatuses.join(', ')}`);
  }

  const completedAt = new Date().toISOString();
  state.status = closeStatus;
  state.completed_at = completedAt;
  state.history.push({
    action: 'closed',
    status: closeStatus,
    at: completedAt,
  });

  saveCouncil(cwd, state);

  // Calculate duration
  let duration = 'unknown';
  if (state.created_at) {
    const start = new Date(state.created_at);
    const end = new Date(completedAt);
    const diffMs = end - start;
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 60) {
      duration = `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      duration = `${hours}h ${mins}m`;
    }
  }

  output({
    closed: true,
    status: closeStatus,
    duration,
  }, raw);
}

// ─── Resume ──────────────────────────────────────────────────────────────────

function cmdCouncilResume(cwd, raw) {
  const state = loadCouncil(cwd);
  if (!state) {
    output({ resumable: false, error: 'No active council found' }, raw);
    return;
  }

  const handoffs = listHandoffs(cwd);
  const lastHandoff = handoffs.length > 0 ? handoffs[handoffs.length - 1] : null;

  // Find last message
  const msgsDir = path.join(councilDir(cwd), 'messages');
  let lastMessage = null;
  if (fs.existsSync(msgsDir)) {
    const msgs = fs.readdirSync(msgsDir).filter(f => f.startsWith('msg-') && f.endsWith('.md')).sort();
    lastMessage = msgs.length > 0 ? msgs[msgs.length - 1] : null;
  }

  // Determine completed agents and next agent
  const completedAgents = state.agents.slice(0, state.current_phase);
  const currentAgent = state.current_agent;
  const nextIdx = state.current_phase + 1;
  const nextAgent = nextIdx < state.agents.length ? state.agents[nextIdx] : null;

  output({
    resumable: true,
    objective: state.objective,
    current_agent: currentAgent,
    next_agent: nextAgent,
    completed_agents: completedAgents,
    last_handoff: lastHandoff ? `.planning/council/handoffs/${lastHandoff}` : null,
    last_message: lastMessage ? `.planning/council/messages/${lastMessage}` : null,
  }, raw);
}

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
  cmdCouncilInit,
  cmdCouncilStatus,
  cmdCouncilAdvance,
  cmdCouncilMessage,
  cmdCouncilHandoff,
  cmdCouncilGateCheck,
  cmdCouncilBoard,
  cmdCouncilTaskAdd,
  cmdCouncilTaskUpdate,
  cmdCouncilReset,
  cmdCouncilSummary,
  cmdCouncilClose,
  cmdCouncilResume,
};
