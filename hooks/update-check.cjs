#!/usr/bin/env node
// Update Check - SessionStart hook
// Compares installed version against npm registry (skills-by-amrit@latest).
// Caches result for 24 hours to avoid repeated network calls.
// Silent fail on all errors — never blocks the user.

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');

const PACKAGE_NAME = 'skills-by-amrit';
const CACHE_FILE = path.join(os.tmpdir(), 'skills-update-check.json');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Get installed version from package.json
function getInstalledVersion() {
  try {
    // Walk up from this file to find the project package.json
    let dir = __dirname;
    for (let i = 0; i < 5; i++) {
      const pkgPath = path.join(dir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.name === PACKAGE_NAME || pkg.version) {
          return pkg.version;
        }
      }
      dir = path.dirname(dir);
    }
  } catch (e) {
    // Silent fail
  }
  return null;
}

// Compare semver strings (basic: major.minor.patch)
function isNewer(latest, current) {
  try {
    const l = latest.replace(/^v/, '').split('.').map(Number);
    const c = current.replace(/^v/, '').split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if ((l[i] || 0) > (c[i] || 0)) return true;
      if ((l[i] || 0) < (c[i] || 0)) return false;
    }
  } catch (e) {
    // Silent fail
  }
  return false;
}

// Check cache first
function getCachedResult() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (Date.now() - cache.checked_at < CACHE_TTL_MS) {
      return cache;
    }
  } catch (e) {
    // Corrupted or missing cache, re-check
  }
  return null;
}

function writeCache(data) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data));
  } catch (e) {
    // Silent fail
  }
}

// Fetch latest version from npm registry
function fetchLatestVersion() {
  return new Promise((resolve, reject) => {
    const url = `https://registry.npmjs.org/${PACKAGE_NAME}/latest`;
    const timeout = setTimeout(() => reject(new Error('timeout')), 5000);

    https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        clearTimeout(timeout);
        try {
          const data = JSON.parse(body);
          resolve(data.version || null);
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

// -- Main --

let input = '';
// Timeout guard: if stdin doesn't close within 3s, exit silently
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);

  (async () => {
    try {
      const installedVersion = getInstalledVersion();
      if (!installedVersion) {
        process.exit(0);
      }

      // Check cache first
      const cached = getCachedResult();
      if (cached) {
        if (cached.update_available) {
          const output = {
            hookSpecificOutput: {
              hookEventName: 'PostToolUse',
              additionalContext: `Skills by Amrit update available: ${installedVersion} -> ${cached.latest_version}. ` +
                `Run: npm update -g ${PACKAGE_NAME}`
            }
          };
          process.stdout.write(JSON.stringify(output));
        }
        process.exit(0);
      }

      // Fetch from registry
      const latestVersion = await fetchLatestVersion();
      if (!latestVersion) {
        writeCache({
          checked_at: Date.now(),
          update_available: false,
          installed_version: installedVersion,
          latest_version: null,
        });
        process.exit(0);
      }

      const updateAvailable = isNewer(latestVersion, installedVersion);

      writeCache({
        checked_at: Date.now(),
        update_available: updateAvailable,
        installed_version: installedVersion,
        latest_version: latestVersion,
      });

      if (updateAvailable) {
        const output = {
          hookSpecificOutput: {
            hookEventName: 'PostToolUse',
            additionalContext: `Skills by Amrit update available: ${installedVersion} -> ${latestVersion}. ` +
              `Run: npm update -g ${PACKAGE_NAME}`
          }
        };
        process.stdout.write(JSON.stringify(output));
      }
    } catch (e) {
      // Silent fail on network errors or any other issues
    }
    process.exit(0);
  })();
});
