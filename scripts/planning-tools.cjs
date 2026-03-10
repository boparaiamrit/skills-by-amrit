#!/usr/bin/env node

/**
 * Skills Planning Tools — Modular CLI for AI-assisted development planning
 *
 * Deterministic state management for the Skills multi-agent ecosystem.
 * LLMs are unreliable at structured markdown editing — incrementing counters,
 * updating tables, maintaining frontmatter. This tool does these deterministically.
 *
 * Usage: node planning-tools.cjs <command> [subcommand] [args] [--raw] [--cwd <path>]
 *
 * State Operations:
 *   state load                         Load .planning/ structure, return JSON
 *   state json                         Output STATE.md frontmatter as JSON
 *   state update <field> <value>       Modify single field
 *   state get [section]                Extract section or full content
 *   state patch --field val ...        Batch updates
 *   state add-decision --summary "..." Append decision
 *     [--phase N] [--rationale "..."]
 *     [--summary-file path] [--rationale-file path]
 *   state add-blocker --text "..."     Append blocker
 *     [--text-file path]
 *   state record-session               Record session end
 *     --stopped-at "..."
 *     [--resume-file path]
 *
 * Phase Operations:
 *   find-phase <phase>                 Find phase directory on disk
 *   phase next-decimal <phase>         Calculate next decimal (1.1 -> 1.2)
 *   phase add <description>            Append new phase to roadmap
 *   phase insert <after> <description> Insert decimal phase
 *   phase remove <phase> [--force]     Remove + renumber
 *   phase complete <phase>             Mark done in STATE.md
 *
 * Roadmap Operations:
 *   roadmap get-phase <phase>          Extract phase section from ROADMAP.md
 *   roadmap analyze                    Full parse with disk status per phase
 *   roadmap update-plan-progress <N>   Update progress table
 *
 * Verification:
 *   verify summary <path>              Validate SUMMARY.md structure
 *   verify plan-structure <file>       Check PLAN.md has required task fields
 *   verify phase-completeness <phase>  Check all plans have summaries
 *   verify references <file>           Check @-refs resolve to real files
 *
 * Config:
 *   config get [key]                   Read config value or full config
 *   config set <key> <value>           Write config value
 *   config init                        Create default config.json
 *
 * Frontmatter CRUD:
 *   frontmatter get <file> [--field k] Extract frontmatter as JSON
 *   frontmatter set <file> --field k   Set field
 *     --value jsonVal
 *   frontmatter merge <file>           Merge fields
 *     --data '{json}'
 *   frontmatter validate <file>        Validate
 *     --schema plan|summary|verification
 *
 * Model Resolution:
 *   resolve-model <agent-type>         Returns model name based on profile
 *
 * Template:
 *   template render <name> [--vars k=v ...] Render template with variables
 *   template list                      List available templates
 *   template fill <type> --phase N     Create pre-filled document
 *     [--plan M] [--name "..."]
 *
 * Milestone:
 *   milestone archive <name>           Archive completed milestone
 *   milestone complete                 Mark current milestone done
 *   milestone list                     List all milestones
 *
 * Commit:
 *   commit <message> [--files f1 f2]   Git commit planning docs
 *
 * Council (multi-agent team state machine):
 *   council init <objective>           Initialize council
 *     [--preset full|rapid|debug|architecture|refactoring|audit]
 *   council status                     Current council state as JSON
 *   council advance [--force]          Advance to next agent
 *   council message <from> <to> <type> Create numbered message
 *     [--content "..."]
 *   council handoff <agent>            Create handoff document
 *     [--summary "..."]
 *   council gate-check                 Validate quality gate
 *     [--from agent] [--to agent]
 *   council board                      Regenerate BOARD.md
 *   council task-add <description>     Add task
 *     [--assignee agent] [--depends-on NNN]
 *   council task-update <id>           Update task status
 *     --status pending|in-progress|done|blocked
 *     [--result "..."]
 *   council reset                      Archive & reset council
 *
 * Compound Init Commands:
 *   init execute-phase <phase>         Context for execute-phase workflow
 *   init plan-phase <phase>            Context for plan-phase workflow
 *   init new-project                   Context for new-project workflow
 *   init quick <description>           Context for quick workflow
 *   init verify-work <phase>           Context for verify-work workflow
 */

const fs = require('fs');
const path = require('path');
const { error } = require('./lib/core.cjs');
const state = require('./lib/state.cjs');
const phase = require('./lib/phase.cjs');
const roadmap = require('./lib/roadmap.cjs');
const verify = require('./lib/verify.cjs');
const config = require('./lib/config.cjs');
const template = require('./lib/template.cjs');
const milestone = require('./lib/milestone.cjs');
const init = require('./lib/init.cjs');
const frontmatter = require('./lib/frontmatter.cjs');
const model = require('./lib/model.cjs');
const council = require('./lib/council.cjs');

// ─── Commit command (inline — uses core.execGit) ─────────────────────────────

function cmdCommit(cwd, message, files, raw) {
  const { loadConfig, execGit, output } = require('./lib/core.cjs');
  const cfg = loadConfig(cwd);

  if (!cfg.commit_docs) {
    output({ committed: false, reason: 'commit_docs disabled in config' }, raw);
    return;
  }

  if (!message) {
    error('commit message required');
  }

  // Default to .planning/ if no files specified
  const filesToAdd = files.length > 0 ? files : ['.planning/'];

  for (const f of filesToAdd) {
    const fullPath = path.isAbsolute(f) ? f : path.join(cwd, f);
    if (!fs.existsSync(fullPath)) continue;
    execGit(cwd, ['add', f]);
  }

  // Check if there are staged changes
  const diffResult = execGit(cwd, ['diff', '--cached', '--quiet']);
  if (diffResult.exitCode === 0) {
    output({ committed: false, reason: 'nothing to commit' }, raw);
    return;
  }

  const commitResult = execGit(cwd, ['commit', '-m', message]);
  if (commitResult.exitCode !== 0) {
    output({ committed: false, reason: commitResult.stderr || 'commit failed' }, raw);
    return;
  }

  const hashResult = execGit(cwd, ['rev-parse', '--short', 'HEAD']);
  output({
    committed: true,
    hash: hashResult.stdout,
    message,
    files: filesToAdd,
  }, raw, hashResult.stdout);
}

// ─── CLI Router ───────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  // Handle --cwd override
  let cwd = process.cwd();
  const cwdEqArg = args.find(arg => arg.startsWith('--cwd='));
  const cwdIdx = args.indexOf('--cwd');
  if (cwdEqArg) {
    const value = cwdEqArg.slice('--cwd='.length).trim();
    if (!value) error('Missing value for --cwd');
    args.splice(args.indexOf(cwdEqArg), 1);
    cwd = path.resolve(value);
  } else if (cwdIdx !== -1) {
    const value = args[cwdIdx + 1];
    if (!value || value.startsWith('--')) error('Missing value for --cwd');
    args.splice(cwdIdx, 2);
    cwd = path.resolve(value);
  }

  if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
    error(`Invalid --cwd: ${cwd}`);
  }

  // Handle --raw flag
  const rawIndex = args.indexOf('--raw');
  const raw = rawIndex !== -1;
  if (rawIndex !== -1) args.splice(rawIndex, 1);

  const command = args[0];

  if (!command) {
    error('Usage: planning-tools <command> [args] [--raw] [--cwd <path>]\nCommands: state, find-phase, phase, roadmap, verify, config, frontmatter, template, milestone, resolve-model, commit, init, council');
  }

  switch (command) {
    // ─── State ────────────────────────────────────────────────────────────────
    case 'state': {
      const sub = args[1];
      if (sub === 'json') {
        state.cmdStateJson(cwd, raw);
      } else if (sub === 'update') {
        state.cmdStateUpdate(cwd, args[2], args[3]);
      } else if (sub === 'get') {
        state.cmdStateGet(cwd, args[2], raw);
      } else if (sub === 'patch') {
        const patches = {};
        for (let i = 2; i < args.length; i += 2) {
          const key = args[i].replace(/^--/, '');
          const value = args[i + 1];
          if (key && value !== undefined) patches[key] = value;
        }
        state.cmdStatePatch(cwd, patches, raw);
      } else if (sub === 'add-decision') {
        const phaseIdx = args.indexOf('--phase');
        const summaryIdx = args.indexOf('--summary');
        const summaryFileIdx = args.indexOf('--summary-file');
        const rationaleIdx = args.indexOf('--rationale');
        const rationaleFileIdx = args.indexOf('--rationale-file');
        state.cmdStateAddDecision(cwd, {
          phase: phaseIdx !== -1 ? args[phaseIdx + 1] : null,
          summary: summaryIdx !== -1 ? args[summaryIdx + 1] : null,
          summary_file: summaryFileIdx !== -1 ? args[summaryFileIdx + 1] : null,
          rationale: rationaleIdx !== -1 ? args[rationaleIdx + 1] : '',
          rationale_file: rationaleFileIdx !== -1 ? args[rationaleFileIdx + 1] : null,
        }, raw);
      } else if (sub === 'add-blocker') {
        const textIdx = args.indexOf('--text');
        const textFileIdx = args.indexOf('--text-file');
        state.cmdStateAddBlocker(cwd, {
          text: textIdx !== -1 ? args[textIdx + 1] : null,
          text_file: textFileIdx !== -1 ? args[textFileIdx + 1] : null,
        }, raw);
      } else if (sub === 'record-session') {
        const stoppedIdx = args.indexOf('--stopped-at');
        const resumeIdx = args.indexOf('--resume-file');
        state.cmdStateRecordSession(cwd, {
          stopped_at: stoppedIdx !== -1 ? args[stoppedIdx + 1] : null,
          resume_file: resumeIdx !== -1 ? args[resumeIdx + 1] : 'None',
        }, raw);
      } else if (sub === 'advance-task') {
        state.cmdStateAdvanceTask(cwd, raw);
      } else if (sub === 'update-progress') {
        state.cmdStateUpdateProgress(cwd, raw);
      } else {
        // Default: state load
        state.cmdStateLoad(cwd, raw);
      }
      break;
    }

    // ─── Find Phase ───────────────────────────────────────────────────────────
    case 'find-phase': {
      phase.cmdFindPhase(cwd, args[1], raw);
      break;
    }

    // ─── Phase Plan Index ──────────────────────────────────────────────────────
    case 'phase-plan-index': {
      phase.cmdPhasePlanIndex(cwd, args[1], raw);
      break;
    }

    // ─── Phase Operations ─────────────────────────────────────────────────────
    case 'phase': {
      const sub = args[1];
      if (sub === 'next-decimal') {
        phase.cmdPhaseNextDecimal(cwd, args[2], raw);
      } else if (sub === 'add') {
        phase.cmdPhaseAdd(cwd, args.slice(2).join(' '), raw);
      } else if (sub === 'insert') {
        phase.cmdPhaseInsert(cwd, args[2], args.slice(3).join(' '), raw);
      } else if (sub === 'remove') {
        const forceFlag = args.includes('--force');
        phase.cmdPhaseRemove(cwd, args[2], { force: forceFlag }, raw);
      } else if (sub === 'complete') {
        phase.cmdPhaseComplete(cwd, args[2], raw);
      } else {
        error('Unknown phase subcommand. Available: next-decimal, add, insert, remove, complete');
      }
      break;
    }

    // ─── Roadmap ──────────────────────────────────────────────────────────────
    case 'roadmap': {
      const sub = args[1];
      if (sub === 'get-phase') {
        roadmap.cmdRoadmapGetPhase(cwd, args[2], raw);
      } else if (sub === 'analyze') {
        roadmap.cmdRoadmapAnalyze(cwd, raw);
      } else if (sub === 'update-plan-progress') {
        roadmap.cmdRoadmapUpdatePlanProgress(cwd, args[2], raw);
      } else {
        error('Unknown roadmap subcommand. Available: get-phase, analyze, update-plan-progress');
      }
      break;
    }

    // ─── Verify ───────────────────────────────────────────────────────────────
    case 'verify': {
      const sub = args[1];
      if (sub === 'summary') {
        const countIndex = args.indexOf('--check-count');
        const checkCount = countIndex !== -1 ? parseInt(args[countIndex + 1], 10) : 2;
        verify.cmdVerifySummary(cwd, args[2], checkCount, raw);
      } else if (sub === 'plan-structure') {
        verify.cmdVerifyPlanStructure(cwd, args[2], raw);
      } else if (sub === 'phase-completeness') {
        verify.cmdVerifyPhaseCompleteness(cwd, args[2], raw);
      } else if (sub === 'references') {
        verify.cmdVerifyReferences(cwd, args[2], raw);
      } else {
        error('Unknown verify subcommand. Available: summary, plan-structure, phase-completeness, references');
      }
      break;
    }

    // ─── Config ───────────────────────────────────────────────────────────────
    case 'config': {
      const sub = args[1];
      if (sub === 'get') {
        config.cmdConfigGet(cwd, args[2], raw);
      } else if (sub === 'set') {
        config.cmdConfigSet(cwd, args[2], args[3], raw);
      } else if (sub === 'init') {
        config.cmdConfigInit(cwd, raw);
      } else {
        error('Unknown config subcommand. Available: get, set, init');
      }
      break;
    }

    // ─── Frontmatter ──────────────────────────────────────────────────────────
    case 'frontmatter': {
      const sub = args[1];
      const file = args[2];
      if (sub === 'get') {
        const fieldIdx = args.indexOf('--field');
        frontmatter.cmdFrontmatterGet(cwd, file, fieldIdx !== -1 ? args[fieldIdx + 1] : null, raw);
      } else if (sub === 'set') {
        const fieldIdx = args.indexOf('--field');
        const valueIdx = args.indexOf('--value');
        frontmatter.cmdFrontmatterSet(cwd, file, fieldIdx !== -1 ? args[fieldIdx + 1] : null, valueIdx !== -1 ? args[valueIdx + 1] : undefined, raw);
      } else if (sub === 'merge') {
        const dataIdx = args.indexOf('--data');
        frontmatter.cmdFrontmatterMerge(cwd, file, dataIdx !== -1 ? args[dataIdx + 1] : null, raw);
      } else if (sub === 'validate') {
        const schemaIdx = args.indexOf('--schema');
        frontmatter.cmdFrontmatterValidate(cwd, file, schemaIdx !== -1 ? args[schemaIdx + 1] : null, raw);
      } else {
        error('Unknown frontmatter subcommand. Available: get, set, merge, validate');
      }
      break;
    }

    // ─── Model Resolution ─────────────────────────────────────────────────────
    case 'resolve-model': {
      model.cmdResolveModel(cwd, args[1], raw);
      break;
    }

    // ─── Template ─────────────────────────────────────────────────────────────
    case 'template': {
      const sub = args[1];
      if (sub === 'render') {
        const vars = {};
        const varsIdx = args.indexOf('--vars');
        if (varsIdx !== -1) {
          for (let i = varsIdx + 1; i < args.length; i++) {
            if (args[i].startsWith('--')) break;
            const eqIdx = args[i].indexOf('=');
            if (eqIdx > 0) {
              vars[args[i].slice(0, eqIdx)] = args[i].slice(eqIdx + 1);
            }
          }
        }
        template.cmdTemplateRender(cwd, args[2], vars, raw);
      } else if (sub === 'list') {
        template.cmdTemplateList(cwd, raw);
      } else if (sub === 'fill') {
        const templateType = args[2];
        const phaseIdx = args.indexOf('--phase');
        const planIdx = args.indexOf('--plan');
        const nameIdx = args.indexOf('--name');
        const typeIdx = args.indexOf('--type');
        const waveIdx = args.indexOf('--wave');
        const fieldsIdx = args.indexOf('--fields');
        template.cmdTemplateFill(cwd, templateType, {
          phase: phaseIdx !== -1 ? args[phaseIdx + 1] : null,
          plan: planIdx !== -1 ? args[planIdx + 1] : null,
          name: nameIdx !== -1 ? args[nameIdx + 1] : null,
          type: typeIdx !== -1 ? args[typeIdx + 1] : 'execute',
          wave: waveIdx !== -1 ? args[waveIdx + 1] : '1',
          fields: fieldsIdx !== -1 ? JSON.parse(args[fieldsIdx + 1]) : {},
        }, raw);
      } else {
        error('Unknown template subcommand. Available: render, list, fill');
      }
      break;
    }

    // ─── Milestone ────────────────────────────────────────────────────────────
    case 'milestone': {
      const sub = args[1];
      if (sub === 'archive') {
        milestone.cmdMilestoneArchive(cwd, args[2], raw);
      } else if (sub === 'complete') {
        milestone.cmdMilestoneComplete(cwd, raw);
      } else if (sub === 'list') {
        milestone.cmdMilestoneList(cwd, raw);
      } else {
        error('Unknown milestone subcommand. Available: archive, complete, list');
      }
      break;
    }

    // ─── Commit ───────────────────────────────────────────────────────────────
    case 'commit': {
      const filesIndex = args.indexOf('--files');
      const endIndex = filesIndex !== -1 ? filesIndex : args.length;
      const messageArgs = args.slice(1, endIndex).filter(a => !a.startsWith('--'));
      const message = messageArgs.join(' ') || undefined;
      const files = filesIndex !== -1 ? args.slice(filesIndex + 1).filter(a => !a.startsWith('--')) : [];
      cmdCommit(cwd, message, files, raw);
      break;
    }

    // ─── Init (compound commands) ─────────────────────────────────────────────
    case 'init': {
      const workflow = args[1];
      switch (workflow) {
        case 'execute-phase':
          init.cmdInitExecutePhase(cwd, args[2], raw);
          break;
        case 'plan-phase':
          init.cmdInitPlanPhase(cwd, args[2], raw);
          break;
        case 'new-project':
          init.cmdInitNewProject(cwd, raw);
          break;
        case 'quick':
          init.cmdInitQuick(cwd, args.slice(2).join(' '), raw);
          break;
        case 'verify-work':
          init.cmdInitVerifyWork(cwd, args[2], raw);
          break;
        default:
          error(`Unknown init workflow: ${workflow}\nAvailable: execute-phase, plan-phase, new-project, quick, verify-work`);
      }
      break;
    }

    // ─── Council ──────────────────────────────────────────────────────────────
    case 'council': {
      const sub = args[1];
      if (sub === 'init') {
        const presetIdx = args.indexOf('--preset');
        const preset = presetIdx !== -1 ? args[presetIdx + 1] : null;
        // Collect objective from remaining args (skip --preset and its value)
        const objArgs = args.slice(2).filter((a, i, arr) => {
          if (a === '--preset') return false;
          if (i > 0 && arr[i - 1] === '--preset') return false;
          return !a.startsWith('--');
        });
        const objective = objArgs.join(' ') || undefined;
        council.cmdCouncilInit(cwd, objective, preset, raw);
      } else if (sub === 'status') {
        council.cmdCouncilStatus(cwd, raw);
      } else if (sub === 'advance') {
        const force = args.includes('--force');
        council.cmdCouncilAdvance(cwd, force, raw);
      } else if (sub === 'message') {
        const from = args[2];
        const to = args[3];
        const type = args[4];
        const contentIdx = args.indexOf('--content');
        const content = contentIdx !== -1 ? args[contentIdx + 1] : null;
        council.cmdCouncilMessage(cwd, from, to, type, content, raw);
      } else if (sub === 'handoff') {
        const agent = args[2];
        const summaryIdx = args.indexOf('--summary');
        const summary = summaryIdx !== -1 ? args[summaryIdx + 1] : null;
        council.cmdCouncilHandoff(cwd, agent, summary, raw);
      } else if (sub === 'gate-check') {
        const fromIdx = args.indexOf('--from');
        const toIdx = args.indexOf('--to');
        const fromAgent = fromIdx !== -1 ? args[fromIdx + 1] : null;
        const toAgent = toIdx !== -1 ? args[toIdx + 1] : null;
        council.cmdCouncilGateCheck(cwd, fromAgent, toAgent, raw);
      } else if (sub === 'board') {
        council.cmdCouncilBoard(cwd, raw);
      } else if (sub === 'task-add') {
        const assigneeIdx = args.indexOf('--assignee');
        const dependsIdx = args.indexOf('--depends-on');
        const assignee = assigneeIdx !== -1 ? args[assigneeIdx + 1] : null;
        const dependsOn = dependsIdx !== -1 ? args[dependsIdx + 1] : null;
        // Collect description from remaining args
        const descArgs = args.slice(2).filter((a, i, arr) => {
          if (a === '--assignee' || a === '--depends-on') return false;
          if (i > 0 && (arr[i - 1] === '--assignee' || arr[i - 1] === '--depends-on')) return false;
          return !a.startsWith('--');
        });
        const description = descArgs.join(' ') || undefined;
        council.cmdCouncilTaskAdd(cwd, description, assignee, dependsOn, raw);
      } else if (sub === 'task-update') {
        const id = args[2];
        const statusIdx = args.indexOf('--status');
        const resultIdx = args.indexOf('--result');
        const status = statusIdx !== -1 ? args[statusIdx + 1] : null;
        const result = resultIdx !== -1 ? args[resultIdx + 1] : null;
        council.cmdCouncilTaskUpdate(cwd, id, status, result, raw);
      } else if (sub === 'reset') {
        council.cmdCouncilReset(cwd, raw);
      } else if (sub === 'summary') {
        council.cmdCouncilSummary(cwd, raw);
      } else if (sub === 'close') {
        const statusIdx = args.indexOf('--status');
        const closeStatus = statusIdx !== -1 ? args[statusIdx + 1] : null;
        council.cmdCouncilClose(cwd, closeStatus, raw);
      } else if (sub === 'resume') {
        council.cmdCouncilResume(cwd, raw);
      } else {
        error('Unknown council subcommand. Available: init, status, advance, message, handoff, gate-check, board, task-add, task-update, reset, summary, close, resume');
      }
      break;
    }

    // ─── Help ─────────────────────────────────────────────────────────────────
    case 'help':
    case '--help':
    case '-h': {
      const { output } = require('./lib/core.cjs');
      const helpText = `
Skills Planning Tools — Deterministic state management for AI-assisted development

COMMANDS:
  state load|json|update|get|patch|add-decision|add-blocker|record-session
  find-phase <phase>
  phase next-decimal|add|insert|remove|complete
  roadmap get-phase|analyze|update-plan-progress
  verify summary|plan-structure|phase-completeness|references
  config get|set|init
  frontmatter get|set|merge|validate
  resolve-model <agent-type>
  template render|list|fill
  milestone archive|complete|list
  commit <message> [--files ...]
  init execute-phase|plan-phase|new-project|quick|verify-work
  council init|status|advance|message|handoff|gate-check|board|task-add|task-update|reset

FLAGS:
  --raw         Output raw values instead of JSON
  --cwd <path>  Override working directory

EXAMPLES:
  node planning-tools.cjs state load
  node planning-tools.cjs find-phase 3
  node planning-tools.cjs config set model_profile quality
  node planning-tools.cjs resolve-model planner
  node planning-tools.cjs init execute-phase 5
  node planning-tools.cjs verify phase-completeness 3
  node planning-tools.cjs milestone list
`.trim();
      process.stdout.write(helpText + '\n');
      process.exit(0);
      break;
    }

    default:
      error(`Unknown command: ${command}. Run with --help for usage.`);
  }
}

main();
