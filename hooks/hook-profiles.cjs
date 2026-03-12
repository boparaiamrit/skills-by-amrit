#!/usr/bin/env node
// Hook Profile System
// Controls which hooks run based on the SBA_HOOK_PROFILE environment variable.
// Three profiles: minimal (level 1), standard (level 2, default), strict (level 3).
//
// Usage: const { shouldRunHook } = require('./hook-profiles');
//        if (!shouldRunHook('context-monitor', 'standard')) process.exit(0);
//
// Profile mapping:
//   minimal  (1): security-gate, update-check
//   standard (2): + context-monitor, statusline, memory-capture
//   strict   (3): + suggest-compact, cost-tracker

const PROFILES = {
  minimal: 1,
  standard: 2,
  strict: 3,
};

// Maps each hook to the minimum profile level required to run it
const HOOK_LEVELS = {
  'security-gate': 1,   // minimal
  'update-check': 1,    // minimal
  'context-monitor': 2, // standard
  'statusline': 2,      // standard
  'memory-capture': 2,  // standard
  'suggest-compact': 3, // strict
  'cost-tracker': 3,    // strict
};

/**
 * Determines whether a hook should run under the current profile.
 * @param {string} hookId - The hook identifier (e.g. 'security-gate')
 * @param {string} requiredProfile - The minimum profile for this hook ('minimal', 'standard', or 'strict')
 * @returns {boolean} True if the hook should run
 */
function shouldRunHook(hookId, requiredProfile) {
  const envProfile = (process.env.SBA_HOOK_PROFILE || 'standard').toLowerCase();
  const currentLevel = PROFILES[envProfile];
  const requiredLevel = PROFILES[requiredProfile];

  // If env var is unrecognized, default to standard (level 2)
  if (currentLevel == null) {
    return (requiredLevel || 2) <= 2;
  }

  if (requiredLevel == null) {
    // Unknown required profile — default to standard level
    return currentLevel >= 2;
  }

  return currentLevel >= requiredLevel;
}

/**
 * Returns the current profile name.
 * @returns {string} 'minimal', 'standard', or 'strict'
 */
function getCurrentProfile() {
  const envProfile = (process.env.SBA_HOOK_PROFILE || 'standard').toLowerCase();
  return PROFILES[envProfile] != null ? envProfile : 'standard';
}

/**
 * Returns the level number for a given hook ID.
 * @param {string} hookId
 * @returns {number|null}
 */
function getHookLevel(hookId) {
  return HOOK_LEVELS[hookId] || null;
}

module.exports = { shouldRunHook, getCurrentProfile, getHookLevel, PROFILES, HOOK_LEVELS };
