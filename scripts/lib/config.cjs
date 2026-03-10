/**
 * Config — Planning config CRUD operations
 */

const fs = require('fs');
const path = require('path');
const { output, error } = require('./core.cjs');

function cmdConfigGet(cwd, keyPath, raw) {
  const configPath = path.join(cwd, '.planning', 'config.json');

  // If no key, return full config
  if (!keyPath) {
    try {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        output(config, raw);
      } else {
        error('No config.json found');
      }
    } catch (err) {
      error('Failed to read config.json: ' + err.message);
    }
    return;
  }

  let config = {};
  try {
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } else {
      error('No config.json found at ' + configPath);
    }
  } catch (err) {
    if (err.message.startsWith('No config.json')) throw err;
    error('Failed to read config.json: ' + err.message);
  }

  // Traverse dot-notation path
  const keys = keyPath.split('.');
  let current = config;
  for (const key of keys) {
    if (current === undefined || current === null || typeof current !== 'object') {
      error(`Key not found: ${keyPath}`);
    }
    current = current[key];
  }

  if (current === undefined) {
    error(`Key not found: ${keyPath}`);
  }

  output(current, raw, String(current));
}

function cmdConfigSet(cwd, keyPath, value, raw) {
  const configPath = path.join(cwd, '.planning', 'config.json');

  if (!keyPath) {
    error('Usage: config set <key.path> <value>');
  }

  // Parse value (handle booleans and numbers)
  let parsedValue = value;
  if (value === 'true') parsedValue = true;
  else if (value === 'false') parsedValue = false;
  else if (!isNaN(value) && value !== '' && value !== undefined) parsedValue = Number(value);

  // Load existing config or start with empty object
  let config = {};
  try {
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch (err) {
    error('Failed to read config.json: ' + err.message);
  }

  // Set nested value using dot notation
  const keys = keyPath.split('.');
  let current = config;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = parsedValue;

  // Write back
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    output({ updated: true, key: keyPath, value: parsedValue }, raw, `${keyPath}=${parsedValue}`);
  } catch (err) {
    error('Failed to write config.json: ' + err.message);
  }
}

function cmdConfigInit(cwd, raw) {
  const configPath = path.join(cwd, '.planning', 'config.json');
  const planningDir = path.join(cwd, '.planning');

  // Ensure .planning directory exists
  try {
    if (!fs.existsSync(planningDir)) {
      fs.mkdirSync(planningDir, { recursive: true });
    }
  } catch (err) {
    error('Failed to create .planning directory: ' + err.message);
  }

  // Check if config already exists
  if (fs.existsSync(configPath)) {
    output({ created: false, reason: 'already_exists' }, raw, 'exists');
    return;
  }

  // Load user-level defaults from ~/.skills/defaults.json if available
  const homedir = require('os').homedir();
  const globalDefaultsPath = path.join(homedir, '.skills', 'defaults.json');
  let userDefaults = {};
  try {
    if (fs.existsSync(globalDefaultsPath)) {
      userDefaults = JSON.parse(fs.readFileSync(globalDefaultsPath, 'utf-8'));
    }
  } catch {
    // Ignore malformed global defaults
  }

  const hardcoded = {
    model_profile: 'balanced',
    commit_docs: true,
    search_gitignored: false,
    branching_strategy: 'none',
    phase_branch_template: 'skills/phase-{phase}-{slug}',
    milestone_branch_template: 'skills/{milestone}-{slug}',
    workflow: {
      research: true,
      plan_checker: true,
      verifier: true,
    },
    parallelization: true,
    gates: {
      require_plan_check: false,
      require_verification: true,
    },
    safety: {
      auto_commit: false,
      auto_test: true,
    },
  };

  const defaults = {
    ...hardcoded,
    ...userDefaults,
    workflow: { ...hardcoded.workflow, ...(userDefaults.workflow || {}) },
    gates: { ...hardcoded.gates, ...(userDefaults.gates || {}) },
    safety: { ...hardcoded.safety, ...(userDefaults.safety || {}) },
  };

  try {
    fs.writeFileSync(configPath, JSON.stringify(defaults, null, 2), 'utf-8');
    output({ created: true, path: '.planning/config.json' }, raw, 'created');
  } catch (err) {
    error('Failed to create config.json: ' + err.message);
  }
}

module.exports = {
  cmdConfigGet,
  cmdConfigSet,
  cmdConfigInit,
};
