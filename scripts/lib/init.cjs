/**
 * Init — Compound init commands for workflow bootstrapping
 *
 * Each init command gathers all context needed by a specific workflow
 * into a single JSON payload, reducing the number of tool calls agents need.
 */

const fs = require('fs');
const path = require('path');
const { loadConfig, resolveModelInternal, findPhaseInternal, getRoadmapPhaseInternal, pathExistsInternal, generateSlugInternal, getMilestoneInfo, toPosixPath, output, error } = require('./core.cjs');

function cmdInitExecutePhase(cwd, phase, raw) {
  if (!phase) {
    error('phase required for init execute-phase');
  }

  const config = loadConfig(cwd);
  const phaseInfo = findPhaseInternal(cwd, phase);
  const milestone = getMilestoneInfo(cwd);

  const roadmapPhase = getRoadmapPhaseInternal(cwd, phase);
  const reqMatch = roadmapPhase?.section?.match(/^\*\*Requirements\*\*:[^\S\n]*([^\n]*)$/m);
  const reqExtracted = reqMatch
    ? reqMatch[1].replace(/[\[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean).join(', ')
    : null;
  const phase_req_ids = (reqExtracted && reqExtracted !== 'TBD') ? reqExtracted : null;

  const result = {
    executor_model: resolveModelInternal(cwd, 'executor'),
    verifier_model: resolveModelInternal(cwd, 'verifier'),

    commit_docs: config.commit_docs,
    parallelization: config.parallelization,
    branching_strategy: config.branching_strategy,
    verifier_enabled: config.workflow.verifier,

    phase_found: !!phaseInfo,
    phase_dir: phaseInfo?.directory || null,
    phase_number: phaseInfo?.phase_number || null,
    phase_name: phaseInfo?.phase_name || null,
    phase_slug: phaseInfo?.phase_slug || null,
    phase_req_ids,

    plans: phaseInfo?.plans || [],
    summaries: phaseInfo?.summaries || [],
    incomplete_plans: phaseInfo?.incomplete_plans || [],
    plan_count: phaseInfo?.plans?.length || 0,
    incomplete_count: phaseInfo?.incomplete_plans?.length || 0,

    milestone_version: milestone.version,
    milestone_name: milestone.name,

    state_exists: pathExistsInternal(cwd, '.planning/STATE.md'),
    roadmap_exists: pathExistsInternal(cwd, '.planning/ROADMAP.md'),
    config_exists: pathExistsInternal(cwd, '.planning/config.json'),
  };

  output(result, raw);
}

function cmdInitPlanPhase(cwd, phase, raw) {
  if (!phase) {
    error('phase required for init plan-phase');
  }

  const config = loadConfig(cwd);
  const phaseInfo = findPhaseInternal(cwd, phase);

  const roadmapPhase = getRoadmapPhaseInternal(cwd, phase);
  const reqMatch = roadmapPhase?.section?.match(/^\*\*Requirements\*\*:[^\S\n]*([^\n]*)$/m);
  const reqExtracted = reqMatch
    ? reqMatch[1].replace(/[\[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean).join(', ')
    : null;
  const phase_req_ids = (reqExtracted && reqExtracted !== 'TBD') ? reqExtracted : null;

  const result = {
    researcher_model: resolveModelInternal(cwd, 'researcher'),
    planner_model: resolveModelInternal(cwd, 'planner'),
    checker_model: resolveModelInternal(cwd, 'checker'),

    research_enabled: config.workflow.research,
    plan_checker_enabled: config.workflow.plan_checker,
    commit_docs: config.commit_docs,

    phase_found: !!phaseInfo,
    phase_dir: phaseInfo?.directory || null,
    phase_number: phaseInfo?.phase_number || null,
    phase_name: phaseInfo?.phase_name || null,
    phase_slug: phaseInfo?.phase_slug || null,
    phase_req_ids,

    has_research: phaseInfo?.has_research || false,
    has_context: phaseInfo?.has_context || false,
    has_plans: (phaseInfo?.plans?.length || 0) > 0,
    plan_count: phaseInfo?.plans?.length || 0,

    planning_exists: pathExistsInternal(cwd, '.planning'),
    roadmap_exists: pathExistsInternal(cwd, '.planning/ROADMAP.md'),
  };

  // Find context/research files in phase directory
  if (phaseInfo?.directory) {
    const phaseDirFull = path.join(cwd, phaseInfo.directory);
    try {
      const files = fs.readdirSync(phaseDirFull);
      const contextFile = files.find(f => f.endsWith('-CONTEXT.md') || f === 'CONTEXT.md');
      if (contextFile) result.context_path = toPosixPath(path.join(phaseInfo.directory, contextFile));
      const researchFile = files.find(f => f.endsWith('-RESEARCH.md') || f === 'RESEARCH.md');
      if (researchFile) result.research_path = toPosixPath(path.join(phaseInfo.directory, researchFile));
    } catch {}
  }

  output(result, raw);
}

function cmdInitNewProject(cwd, raw) {
  const config = loadConfig(cwd);

  let hasCode = false;
  let hasPackageFile = false;

  // Simple code detection without shell
  const codeExtensions = ['.ts', '.js', '.py', '.go', '.rs', '.swift', '.java'];
  try {
    const topLevel = fs.readdirSync(cwd);
    for (const entry of topLevel) {
      if (entry === 'node_modules' || entry === '.git') continue;
      const ext = path.extname(entry);
      if (codeExtensions.includes(ext)) { hasCode = true; break; }
      const subPath = path.join(cwd, entry);
      try {
        if (fs.statSync(subPath).isDirectory()) {
          const subFiles = fs.readdirSync(subPath);
          for (const sf of subFiles) {
            if (codeExtensions.includes(path.extname(sf))) { hasCode = true; break; }
          }
        }
      } catch {}
      if (hasCode) break;
    }
  } catch {}

  hasPackageFile = pathExistsInternal(cwd, 'package.json') ||
                   pathExistsInternal(cwd, 'requirements.txt') ||
                   pathExistsInternal(cwd, 'Cargo.toml') ||
                   pathExistsInternal(cwd, 'go.mod') ||
                   pathExistsInternal(cwd, 'Package.swift');

  const result = {
    researcher_model: resolveModelInternal(cwd, 'researcher'),
    planner_model: resolveModelInternal(cwd, 'planner'),

    commit_docs: config.commit_docs,

    project_exists: pathExistsInternal(cwd, '.planning/PROJECT.md'),
    has_codebase_map: pathExistsInternal(cwd, '.planning/codebase'),
    planning_exists: pathExistsInternal(cwd, '.planning'),

    has_existing_code: hasCode,
    has_package_file: hasPackageFile,
    is_brownfield: hasCode || hasPackageFile,

    has_git: pathExistsInternal(cwd, '.git'),
  };

  output(result, raw);
}

function cmdInitQuick(cwd, description, raw) {
  const config = loadConfig(cwd);
  const now = new Date();
  const slug = description ? generateSlugInternal(description)?.substring(0, 40) : null;

  // Find next quick task number
  const quickDir = path.join(cwd, '.planning', 'quick');
  let nextNum = 1;
  try {
    const existing = fs.readdirSync(quickDir)
      .filter(f => /^\d+-/.test(f))
      .map(f => parseInt(f.split('-')[0], 10))
      .filter(n => !isNaN(n));
    if (existing.length > 0) {
      nextNum = Math.max(...existing) + 1;
    }
  } catch {}

  const result = {
    planner_model: resolveModelInternal(cwd, 'planner'),
    executor_model: resolveModelInternal(cwd, 'executor'),
    checker_model: resolveModelInternal(cwd, 'checker'),
    verifier_model: resolveModelInternal(cwd, 'verifier'),

    commit_docs: config.commit_docs,

    next_num: nextNum,
    slug,
    description: description || null,
    date: now.toISOString().split('T')[0],
    timestamp: now.toISOString(),

    quick_dir: '.planning/quick',
    task_dir: slug ? `.planning/quick/${nextNum}-${slug}` : null,

    roadmap_exists: pathExistsInternal(cwd, '.planning/ROADMAP.md'),
    planning_exists: pathExistsInternal(cwd, '.planning'),
    config: config,
  };

  output(result, raw);
}

function cmdInitVerifyWork(cwd, phase, raw) {
  if (!phase) {
    error('phase required for init verify-work');
  }

  const config = loadConfig(cwd);
  const phaseInfo = findPhaseInternal(cwd, phase);

  const result = {
    verifier_model: resolveModelInternal(cwd, 'verifier'),
    checker_model: resolveModelInternal(cwd, 'checker'),

    commit_docs: config.commit_docs,

    phase_found: !!phaseInfo,
    phase_dir: phaseInfo?.directory || null,
    phase_number: phaseInfo?.phase_number || null,
    phase_name: phaseInfo?.phase_name || null,

    has_verification: phaseInfo?.has_verification || false,
    plans: phaseInfo?.plans || [],
    summaries: phaseInfo?.summaries || [],
    incomplete_plans: phaseInfo?.incomplete_plans || [],

    // Test detection
    test_info: detectTests(cwd),
  };

  output(result, raw);
}

function detectTests(cwd) {
  const info = { has_tests: false, test_command: null, test_framework: null };

  // Check package.json for test script
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.scripts && pkg.scripts.test && pkg.scripts.test !== 'echo "Error: no test specified" && exit 1') {
        info.has_tests = true;
        info.test_command = 'npm test';
      }
      if (pkg.devDependencies) {
        if (pkg.devDependencies.jest) info.test_framework = 'jest';
        else if (pkg.devDependencies.vitest) info.test_framework = 'vitest';
        else if (pkg.devDependencies.mocha) info.test_framework = 'mocha';
      }
    } catch {}
  }

  // Check for pytest
  if (fs.existsSync(path.join(cwd, 'pytest.ini')) || fs.existsSync(path.join(cwd, 'pyproject.toml'))) {
    info.has_tests = true;
    info.test_command = info.test_command || 'pytest';
    info.test_framework = info.test_framework || 'pytest';
  }

  return info;
}

module.exports = {
  cmdInitExecutePhase,
  cmdInitPlanPhase,
  cmdInitNewProject,
  cmdInitQuick,
  cmdInitVerifyWork,
};
