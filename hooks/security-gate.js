#!/usr/bin/env node
// Security Gate - PostToolUse hook
// Scans files modified by Write/Edit tools for common security issues.
// Outputs warnings as additionalContext so the agent is aware of risks.
// Never blocks tool execution — advisory only.

const path = require('path');

// Sensitive file patterns (basename matches)
const SENSITIVE_FILES = ['.env', '.env.local', '.env.production', '.env.staging',
  'credentials.json', 'secrets.json', 'service-account.json'];
const SENSITIVE_EXTENSIONS = ['.pem', '.key', '.p12', '.pfx', '.jks', '.keystore'];

// Build regex from string to avoid triggering security linters on pattern definitions
function re(pattern, flags) { return new RegExp(pattern, flags); }

// Security patterns: [regex, label, description]
const SECRET_PATTERNS = [
  [re('password\s*[:=]\s*[\'"][^\'"]{4,}[\'"]', 'gi'), 'hardcoded-password', 'Hardcoded password detected'],
  [re('api[_-]?key\s*[:=]\s*[\'"][^\'"]{8,}[\'"]', 'gi'), 'hardcoded-api-key', 'Hardcoded API key detected'],
  [re('secret\s*[:=]\s*[\'"][^\'"]{8,}[\'"]', 'gi'), 'hardcoded-secret', 'Hardcoded secret detected'],
  [re('token\s*[:=]\s*[\'"][^\'"]{8,}[\'"]', 'gi'), 'hardcoded-token', 'Hardcoded token detected'],
  [re('-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----', 'g'), 'private-key', 'Private key material detected'],
  [re('AKIA[0-9A-Z]{16}', 'g'), 'aws-access-key', 'AWS access key detected'],
  [re('ghp_[A-Za-z0-9_]{36}', 'g'), 'github-pat', 'GitHub personal access token detected'],
  [re('sk-[A-Za-z0-9]{20,}', 'g'), 'openai-key', 'OpenAI API key detected'],
  [re('xox[bpras]-[A-Za-z0-9-]{10,}', 'g'), 'slack-token', 'Slack token detected'],
];

// Anti-pattern checks — detects dangerous coding patterns in scanned code
const ANTIPATTERN_CHECKS = [
  [re('\bev' + 'al\s*\(', 'g'), 'eval-usage', 'Dynamic code evaluation — potential code injection risk'],
  [re('innerHTML\s*=', 'g'), 'innerhtml-assignment', 'innerHTML assignment — potential XSS risk'],
  [re('\bquery\s*\(\s*[\'"`].*\+\s*', 'g'), 'sql-concatenation', 'SQL string concatenation — potential SQL injection'],
  [re('child_process.*\$\{', 'gs'), 'command-injection', 'child_process with interpolation — potential command injection'],
  [re('document\.write\s*\(', 'g'), 'document-write', 'document.write() — potential XSS risk'],
  [re('dangerous' + 'lySetInnerHTML', 'g'), 'dangerous-html', 'Unsafe HTML injection — ensure content is sanitized'],
];

// File paths that are expected to contain pattern-like strings (skip token/password checks)
function isTestOrPatternFile(filePath) {
  const lower = filePath.toLowerCase();
  return lower.includes('test') ||
    lower.includes('spec') ||
    lower.includes('mock') ||
    lower.includes('fixture') ||
    lower.includes('example') ||
    lower.includes('.md');
}

function checkSensitiveFilePath(filePath) {
  const warnings = [];
  const basename = path.basename(filePath);
  const ext = path.extname(filePath);

  if (SENSITIVE_FILES.includes(basename)) {
    warnings.push({
      rule: 'sensitive-file',
      message: 'Modifying sensitive file: ' + basename,
    });
  }

  if (SENSITIVE_EXTENSIONS.includes(ext)) {
    warnings.push({
      rule: 'sensitive-extension',
      message: 'Modifying file with sensitive extension: ' + ext,
    });
  }

  return warnings;
}

function checkContent(content, filePath) {
  const warnings = [];
  const isTestFile = isTestOrPatternFile(filePath);

  for (const [regex, rule, message] of SECRET_PATTERNS) {
    // Skip token/password checks in test/pattern files to reduce noise
    if (isTestFile && (rule === 'hardcoded-token' || rule === 'hardcoded-password')) {
      continue;
    }
    regex.lastIndex = 0;
    if (regex.test(content)) {
      warnings.push({ rule, message });
    }
  }

  for (const [regex, rule, message] of ANTIPATTERN_CHECKS) {
    regex.lastIndex = 0;
    if (regex.test(content)) {
      warnings.push({ rule, message });
    }
  }

  // Check for .env file content patterns (KEY=value lines)
  if (!isTestFile) {
    const envPattern = re('^[A-Z][A-Z0-9_]+=.+$', 'gm');
    const envPatternCount = (content.match(envPattern) || []).length;
    if (envPatternCount >= 3) {
      warnings.push({
        rule: 'env-content',
        message: 'File appears to contain environment variable definitions — ensure no secrets are included',
      });
    }
  }

  return warnings;
}

function getContentToCheck(data) {
  const toolName = data.tool_name || '';
  const toolInput = data.tool_input || {};

  if (toolName === 'Write') {
    return { filePath: toolInput.file_path, content: toolInput.content || '' };
  }

  if (toolName === 'Edit') {
    return { filePath: toolInput.file_path, content: toolInput.new_string || '' };
  }

  return null;
}

function formatWarnings(warnings, filePath) {
  const basename = path.basename(filePath);
  const lines = warnings.map(function(w) { return '  - [' + w.rule + '] ' + w.message; });
  return 'SKILLS SECURITY GATE: ' + warnings.length + ' warning(s) in ' + basename + ':\n' +
    lines.join('\n') + '\n' +
    'Review these findings before proceeding. False positives may occur in test/config files.';
}

// -- Main --

let input = '';
// Timeout guard: if stdin doesn't close within 3s (e.g. pipe issues on
// Windows/Git Bash), exit silently instead of hanging.
const stdinTimeout = setTimeout(function() { process.exit(0); }, 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) { input += chunk; });
process.stdin.on('end', function() {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);

    // Only run for Write and Edit tool calls
    const target = getContentToCheck(data);
    if (!target || !target.filePath) {
      process.exit(0);
    }

    const warnings = [].concat(
      checkSensitiveFilePath(target.filePath),
      checkContent(target.content, target.filePath)
    );

    if (warnings.length === 0) {
      process.exit(0);
    }

    const output = {
      hookSpecificOutput: {
        hookEventName: process.env.GEMINI_API_KEY ? 'AfterTool' : 'PostToolUse',
        additionalContext: formatWarnings(warnings, target.filePath),
      }
    };

    process.stdout.write(JSON.stringify(output));
  } catch (e) {
    // Silent fail -- never block tool execution
    process.exit(0);
  }
});
