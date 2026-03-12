#!/usr/bin/env node
// Skills Statusline - PreInputSanitization hook
// Shows: model | phase/plan | directory | context usage bar

const fs = require('fs');
const path = require('path');
const os = require('os');

// Parse YAML-like frontmatter from STATE.md for current phase/plan
function parseStateFrontmatter(cwd) {
  try {
    const statePath = path.join(cwd, '.planning', 'STATE.md');
    if (!fs.existsSync(statePath)) return null;

    const content = fs.readFileSync(statePath, 'utf8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return null;

    const fm = fmMatch[1];
    const phase = (fm.match(/phase:\s*(.+)/i) || [])[1];
    const plan = (fm.match(/plan:\s*(.+)/i) || [])[1];

    if (phase || plan) {
      const parts = [];
      if (phase) parts.push('Phase ' + phase.trim());
      if (plan) parts.push('Plan ' + plan.trim());
      return parts.join(' ');
    }
  } catch (e) {
    // Silent fail
  }
  return null;
}

// Read JSON from stdin
let input = '';
// Timeout guard: if stdin doesn't close within 3s (e.g. pipe issues on
// Windows/Git Bash), exit silently instead of hanging.
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const dir = data.workspace?.current_dir || process.cwd();
    const session = data.session_id || '';
    const remaining = data.context_window?.remaining_percentage;

    // Context window display (shows USED percentage scaled to usable context)
    // Claude Code reserves ~16.5% for autocompact buffer, so usable context
    // is 83.5% of the total window. We normalize to show 100% at that point.
    const AUTO_COMPACT_BUFFER_PCT = 16.5;
    let ctx = '';
    if (remaining != null) {
      // Normalize: subtract buffer from remaining, scale to usable range
      const usableRemaining = Math.max(0, ((remaining - AUTO_COMPACT_BUFFER_PCT) / (100 - AUTO_COMPACT_BUFFER_PCT)) * 100);
      const used = Math.max(0, Math.min(100, Math.round(100 - usableRemaining)));

      // Write context metrics to bridge file for the context-monitor PostToolUse hook.
      // The monitor reads this file to inject agent-facing warnings when context is low.
      if (session) {
        try {
          const bridgePath = path.join(os.tmpdir(), `skills-ctx-${session}.json`);
          const bridgeData = JSON.stringify({
            session_id: session,
            remaining_percentage: remaining,
            used_pct: used,
            timestamp: Math.floor(Date.now() / 1000)
          });
          fs.writeFileSync(bridgePath, bridgeData);
        } catch (e) {
          // Silent fail -- bridge is best-effort, don't break statusline
        }
      }

      // Build progress bar (10 segments)
      const filled = Math.floor(used / 10);
      const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(10 - filled);

      // Color based on usable context thresholds
      if (used < 50) {
        ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
      } else if (used < 65) {
        ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
      } else if (used < 80) {
        ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
      } else {
        ctx = ` \x1b[5;31m${bar} ${used}%\x1b[0m`;
      }
    }

    // Current phase/plan from .planning/STATE.md
    const cwd = data.cwd || dir;
    const taskInfo = parseStateFrontmatter(cwd);

    // Skills update available?
    let skillsUpdate = '';
    const updateCachePath = path.join(os.tmpdir(), 'skills-update-check.json');
    if (fs.existsSync(updateCachePath)) {
      try {
        const cache = JSON.parse(fs.readFileSync(updateCachePath, 'utf8'));
        if (cache.update_available) {
          skillsUpdate = '\x1b[33m\u2B06 update available\x1b[0m \u2502 ';
        }
      } catch (e) {}
    }

    // Output
    const dirname = path.basename(dir);
    if (taskInfo) {
      process.stdout.write(`${skillsUpdate}\x1b[2m${model}\x1b[0m \u2502 \x1b[1m${taskInfo}\x1b[0m \u2502 \x1b[2m${dirname}\x1b[0m${ctx}`);
    } else {
      process.stdout.write(`${skillsUpdate}\x1b[2m${model}\x1b[0m \u2502 \x1b[2m${dirname}\x1b[0m${ctx}`);
    }
  } catch (e) {
    // Silent fail - don't break statusline on parse errors
  }
});
