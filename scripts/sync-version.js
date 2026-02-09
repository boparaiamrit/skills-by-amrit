#!/usr/bin/env node

/**
 * Version Sync Script
 *
 * Ensures package.json is the SINGLE source of truth for:
 * - Version number
 * - Asset counts (skills, commands, workflows)
 *
 * This script is called automatically by npm postversion hook.
 *
 * What it does:
 * 1. Reads version and description from package.json
 * 2. Extracts asset counts from description
 * 3. Updates all files that reference version or counts
 * 4. Files are auto-staged by postversion hook
 *
 * Files synced:
 * - docs/index.html (meta tags, hero badge, stats)
 * - CHANGELOG.md (verifies entry exists)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(__dirname, '../package.json');
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const version = pkg.version;

// Extract counts from description: "31 skills, 26 commands, 30 workflows, ..."
const countMatches = pkg.description.match(/(\d+) skills?, (\d+) commands?, (\d+) workflows?/);
const counts = {
  skills: countMatches ? countMatches[1] : '31',
  commands: countMatches ? countMatches[2] : '26',
  workflows: countMatches ? countMatches[3] : '30'
};

console.log(`📦 Syncing version: ${version}`);
console.log(`📊 Asset counts: ${counts.skills} skills, ${counts.commands} commands, ${counts.workflows} workflows`);

// ─── Update docs/index.html ──────────────────────────────────
const indexHtmlPath = join(__dirname, '../docs/index.html');
if (existsSync(indexHtmlPath)) {
  let html = readFileSync(indexHtmlPath, 'utf8');
  let updated = false;

  // 1. Update meta generator tag
  if (html.includes('<meta name="generator"')) {
    html = html.replace(
      /<meta name="generator" content="Skills by Amrit v[\d.]+"/,
      `<meta name="generator" content="Skills by Amrit v${version}"`
    );
    updated = true;
  } else {
    // Add generator tag if it doesn't exist
    html = html.replace(
      '<meta charset="UTF-8">',
      `<meta charset="UTF-8">\n    <meta name="generator" content="Skills by Amrit v${version}">`
    );
    updated = true;
  }

  // 2. Update hero badge version
  html = html.replace(
    /<div class="hero-badge">✨ v[\d.]+ —/,
    `<div class="hero-badge">✨ v${version} —`
  );

  // 3. Update hero stats
  html = html.replace(
    /<div class="stat"><div class="stat-num">\d+<\/div><div class="stat-label">Skills<\/div><\/div>/,
    `<div class="stat"><div class="stat-num">${counts.skills}</div><div class="stat-label">Skills</div></div>`
  );
  html = html.replace(
    /<div class="stat"><div class="stat-num">\d+<\/div><div class="stat-label">Commands<\/div><\/div>/,
    `<div class="stat"><div class="stat-num">${counts.commands}</div><div class="stat-label">Commands</div></div>`
  );
  html = html.replace(
    /<div class="stat"><div class="stat-num">\d+<\/div><div class="stat-label">Workflows<\/div><\/div>/,
    `<div class="stat"><div class="stat-num">${counts.workflows}</div><div class="stat-label">Workflows</div></div>`
  );

  writeFileSync(indexHtmlPath, html);
  console.log(`✅ Updated docs/index.html (version + counts)`);
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
