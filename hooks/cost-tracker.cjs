#!/usr/bin/env node
// Cost Tracker - Stop hook
// Tracks session metrics: tool calls, files read/written/edited, agents spawned.
// On Stop event: writes summary to .planning/cost-log.md
// Lightweight, silent fail — never blocks.
//
// How it works:
// 1. On PostToolUse events: increments counters in a temp file
// 2. On Stop event: reads counters and appends summary to cost-log.md
//
// The hook serves double duty:
//   - Called as PostToolUse: accumulates metrics
//   - Called as Stop/SessionEnd: writes the final summary

const fs = require('fs');
const os = require('os');
const path = require('path');

function getMetricsPath(sessionId) {
  return path.join(os.tmpdir(), 'skills-cost-' + sessionId + '.json');
}

function loadMetrics(sessionId) {
  var metricsPath = getMetricsPath(sessionId);
  if (fs.existsSync(metricsPath)) {
    try {
      return JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
    } catch (e) {
      // Corrupted, start fresh
    }
  }
  return {
    session_id: sessionId,
    started_at: new Date().toISOString(),
    tool_calls: 0,
    tools: {},
    files_read: 0,
    files_written: 0,
    files_edited: 0,
    agents_spawned: 0,
    unique_files: [],
  };
}

function saveMetrics(sessionId, metrics) {
  try {
    fs.writeFileSync(getMetricsPath(sessionId), JSON.stringify(metrics));
  } catch (e) {
    // Silent fail
  }
}

function trackToolUse(data, metrics) {
  var toolName = data.tool_name || 'unknown';

  metrics.tool_calls++;
  metrics.tools[toolName] = (metrics.tools[toolName] || 0) + 1;

  var toolInput = data.tool_input || {};
  var filePath = toolInput.file_path || '';

  if (toolName === 'Read' && filePath) {
    metrics.files_read++;
    if (metrics.unique_files.indexOf(filePath) === -1 && metrics.unique_files.length < 200) {
      metrics.unique_files.push(filePath);
    }
  } else if (toolName === 'Write' && filePath) {
    metrics.files_written++;
    if (metrics.unique_files.indexOf(filePath) === -1 && metrics.unique_files.length < 200) {
      metrics.unique_files.push(filePath);
    }
  } else if (toolName === 'Edit' && filePath) {
    metrics.files_edited++;
    if (metrics.unique_files.indexOf(filePath) === -1 && metrics.unique_files.length < 200) {
      metrics.unique_files.push(filePath);
    }
  } else if (toolName === 'Skill' || toolName === 'Agent' || toolName === 'dispatch_agent') {
    metrics.agents_spawned++;
  }

  return metrics;
}

function writeSummary(data, metrics) {
  var cwd = data.cwd || process.cwd();
  var planningDir = path.join(cwd, '.planning');
  var logPath = path.join(planningDir, 'cost-log.md');

  // Only write cost log if .planning already exists — don't create it
  if (!fs.existsSync(planningDir)) {
    return;
  }

  var now = new Date();
  var date = now.toISOString().split('T')[0];
  var time = now.toTimeString().split(' ')[0];

  // Top tools by usage
  var toolEntries = Object.entries(metrics.tools);
  toolEntries.sort(function(a, b) { return b[1] - a[1]; });
  var topTools = toolEntries.slice(0, 5).map(function(e) {
    return e[0] + ' (' + e[1] + ')';
  }).join(', ');

  var entry = '\n## ' + date + ' ' + time + '\n' +
    '- **Tool calls:** ' + metrics.tool_calls + '\n' +
    '- **Files:** ' + metrics.files_read + ' read, ' +
    metrics.files_written + ' written, ' +
    metrics.files_edited + ' edited\n' +
    '- **Unique files touched:** ' + metrics.unique_files.length + '\n' +
    '- **Agents spawned:** ' + metrics.agents_spawned + '\n' +
    '- **Top tools:** ' + (topTools || 'none') + '\n';

  // Append to log file
  try {
    var existing = '';
    if (fs.existsSync(logPath)) {
      existing = fs.readFileSync(logPath, 'utf8');
    } else {
      existing = '# Cost Log\n\nSession metrics tracked by skills-by-amrit cost-tracker hook.\n';
    }
    fs.writeFileSync(logPath, existing + entry);
  } catch (e) {
    // Silent fail
  }

  // Clean up temp file
  try {
    fs.unlinkSync(getMetricsPath(metrics.session_id));
  } catch (e) {
    // Silent fail
  }
}

// -- Main --

let input = '';
// Timeout guard: if stdin doesn't close within 3s, exit silently
const stdinTimeout = setTimeout(function() { process.exit(0); }, 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) { input += chunk; });
process.stdin.on('end', function() {
  clearTimeout(stdinTimeout);
  try {
    var data = JSON.parse(input);
    var sessionId = data.session_id;

    if (!sessionId) {
      process.exit(0);
    }

    // Determine event type from hook_event_name or tool_name presence
    var hookEvent = data.hook_event_name || '';
    var isStop = hookEvent === 'Stop' || hookEvent === 'SessionEnd' ||
      hookEvent === 'stop' || hookEvent === 'session_end';

    // If tool_name is present, this is a PostToolUse invocation — track metrics
    if (data.tool_name) {
      var metrics = loadMetrics(sessionId);
      metrics = trackToolUse(data, metrics);
      saveMetrics(sessionId, metrics);
      // No output for tracking calls — silent accumulation
      process.exit(0);
    }

    // If it's a Stop event, write the summary
    if (isStop) {
      var metrics = loadMetrics(sessionId);
      if (metrics.tool_calls > 0) {
        writeSummary(data, metrics);
      }
      process.exit(0);
    }

    // Unknown event, exit silently
    process.exit(0);
  } catch (e) {
    // Silent fail — never block
    process.exit(0);
  }
});
