#!/usr/bin/env node
// Strategic Compaction Hook - PostToolUse hook
// Suggests /compact at logical breakpoints (after verification, between phases).
// Does NOT suggest during active implementation or debugging.
// Reads context usage to avoid premature suggestions.
// Advisory only — never blocks tool execution.
//
// Activation:
//   - Context usage above 60% (usable range)
//   - Last tool was a verification/completion signal (e.g. Bash test run, Read of STATE.md)
//   - NOT during active Write/Edit sequences (implementation in progress)
//
// Debounce: Only suggests once per logical breakpoint (tracks via temp file)

const fs = require('fs');
const os = require('os');
const path = require('path');

const CONTEXT_SUGGEST_THRESHOLD = 60; // suggest only when used% >= 60
const STALE_SECONDS = 120;            // ignore metrics older than 2 min
const COOLDOWN_TOOL_CALLS = 15;       // min tool calls between suggestions

// Tools that signal a logical breakpoint (end of a phase/verification)
const BREAKPOINT_TOOLS = ['Bash', 'Read'];

// Tools that signal active implementation — suppress suggestions
const ACTIVE_IMPL_TOOLS = ['Write', 'Edit'];

// Patterns in Bash commands that signal verification/completion
const VERIFICATION_PATTERNS = [
  /\btest\b/i,
  /\bnpm\s+test\b/i,
  /\bnode\s+--test\b/i,
  /\bjest\b/i,
  /\bvitest\b/i,
  /\bpytest\b/i,
  /\bgit\s+(status|log|diff)\b/i,
  /\bverif/i,
  /\bcheck/i,
  /\blint\b/i,
  /\bbuild\b/i,
];

// Patterns in Read file paths that signal phase transitions
const PHASE_TRANSITION_PATTERNS = [
  /STATE\.md$/i,
  /PLAN.*\.md$/i,
  /CHECKLIST/i,
  /MEMORY\.md$/i,
];

let input = '';
// Timeout guard: if stdin doesn't close within 3s, exit silently
const stdinTimeout = setTimeout(function() { process.exit(0); }, 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) { input += chunk; });
process.stdin.on('end', function() {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const sessionId = data.session_id;
    const toolName = data.tool_name || '';
    const toolInput = data.tool_input || {};

    if (!sessionId) {
      process.exit(0);
    }

    // Don't suggest during active implementation
    if (ACTIVE_IMPL_TOOLS.includes(toolName)) {
      process.exit(0);
    }

    // Check context usage from bridge file (written by statusline hook)
    const tmpDir = os.tmpdir();
    const metricsPath = path.join(tmpDir, 'skills-ctx-' + sessionId + '.json');

    if (!fs.existsSync(metricsPath)) {
      process.exit(0);
    }

    let metrics;
    try {
      metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
    } catch (e) {
      // Corrupted metrics file — exit gracefully
      process.exit(0);
    }
    const now = Math.floor(Date.now() / 1000);

    // Ignore stale metrics
    if (metrics.timestamp && (now - metrics.timestamp) > STALE_SECONDS) {
      process.exit(0);
    }

    const usedPct = metrics.used_pct || 0;

    // Don't suggest if context usage is low — premature compaction wastes context
    if (usedPct < CONTEXT_SUGGEST_THRESHOLD) {
      process.exit(0);
    }

    // Check if this is a logical breakpoint
    var isBreakpoint = false;

    if (toolName === 'Bash') {
      var command = toolInput.command || '';
      for (var i = 0; i < VERIFICATION_PATTERNS.length; i++) {
        if (VERIFICATION_PATTERNS[i].test(command)) {
          isBreakpoint = true;
          break;
        }
      }
    } else if (toolName === 'Read') {
      var filePath = toolInput.file_path || '';
      for (var i = 0; i < PHASE_TRANSITION_PATTERNS.length; i++) {
        if (PHASE_TRANSITION_PATTERNS[i].test(filePath)) {
          isBreakpoint = true;
          break;
        }
      }
    }

    if (!isBreakpoint) {
      process.exit(0);
    }

    // Cooldown: avoid suggesting too frequently
    var cooldownPath = path.join(tmpDir, 'skills-compact-suggest-' + sessionId + '.json');
    var cooldownData = { callsSinceSuggest: 0 };

    if (fs.existsSync(cooldownPath)) {
      try {
        cooldownData = JSON.parse(fs.readFileSync(cooldownPath, 'utf8'));
      } catch (e) {
        // Corrupted, reset
      }
    }

    cooldownData.callsSinceSuggest = (cooldownData.callsSinceSuggest || 0) + 1;

    if (cooldownData.callsSinceSuggest < COOLDOWN_TOOL_CALLS) {
      fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData));
      process.exit(0);
    }

    // Reset cooldown
    cooldownData.callsSinceSuggest = 0;
    fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData));

    // Build advisory message
    var message = 'COMPACT SUGGESTION: Context usage is at ' + usedPct + '%. ' +
      'You appear to be at a logical breakpoint (verification/phase transition). ' +
      'Consider suggesting /compact to the user if the current task is complete. ' +
      'This is advisory only — continue working if the task is still in progress.';

    var output = {
      hookSpecificOutput: {
        hookEventName: process.env.GEMINI_CLI === '1' ? 'AfterTool' : 'PostToolUse',
        additionalContext: message
      }
    };

    process.stdout.write(JSON.stringify(output));
  } catch (e) {
    // Silent fail — never block tool execution
    process.exit(0);
  }
});
