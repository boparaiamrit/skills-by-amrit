#!/usr/bin/env node

/**
 * Version Sync Script
 *
 * Ensures package.json version is the SINGLE source of truth.
 * This script is called automatically by npm postversion hook.
 *
 * What it does:
 * 1. Reads version from package.json
 * 2. Updates all files that reference the version
 * 3. Files are auto-staged by postversion hook
 *
 * Files synced:
 * - docs/index.html (meta generator tag)
 * - CHANGELOG.md (verifies entry exists)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(__dirname, '../package.json');
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const version = pkg.version;

console.log(`📦 Syncing version: ${version}`);

// ─── Update docs/index.html ──────────────────────────────────
const indexHtmlPath = join(__dirname, '../docs/index.html');
if (existsSync(indexHtmlPath)) {
  let html = readFileSync(indexHtmlPath, 'utf8');

  // Update meta generator tag
  html = html.replace(
    /<meta name="generator" content="Skills by Amrit v[\d.]+"/,
    `<meta name="generator" content="Skills by Amrit v${version}"`
  );

  // Add generator tag if it doesn't exist
  if (!html.includes('<meta name="generator"')) {
    html = html.replace(
      '<meta charset="UTF-8">',
      `<meta charset="UTF-8">\n    <meta name="generator" content="Skills by Amrit v${version}">`
    );
  }

  writeFileSync(indexHtmlPath, html);
  console.log(`✅ Updated docs/index.html`);
}

// ─── Verify CHANGELOG.md has current version ────────────────
const changelogPath = join(__dirname, '../CHANGELOG.md');
if (existsSync(changelogPath)) {
  const changelog = readFileSync(changelogPath, 'utf8');
  if (!changelog.includes(`## [${version}]`)) {
    console.warn(`⚠️  WARNING: CHANGELOG.md missing entry for version ${version}`);
    console.warn(`   Please add a section: ## [${version}] — YYYY-MM-DD`);
  } else {
    console.log(`✅ CHANGELOG.md has version ${version}`);
  }
}

console.log(`\n✨ Version sync complete: ${version}`);
