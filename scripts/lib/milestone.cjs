/**
 * Milestone — Milestone archive, completion, and listing operations
 */

const fs = require('fs');
const path = require('path');
const { getMilestonePhaseFilter, getMilestoneInfo, output, error } = require('./core.cjs');
const { extractFrontmatter } = require('./frontmatter.cjs');
const { writeStateMd } = require('./state.cjs');

function cmdMilestoneArchive(cwd, name, raw) {
  if (!name) {
    error('milestone name required for archive');
  }

  const archiveDir = path.join(cwd, '.planning', 'milestones');
  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');
  const reqPath = path.join(cwd, '.planning', 'REQUIREMENTS.md');
  const today = new Date().toISOString().split('T')[0];

  fs.mkdirSync(archiveDir, { recursive: true });

  const archived = [];

  if (fs.existsSync(roadmapPath)) {
    const content = fs.readFileSync(roadmapPath, 'utf-8');
    const archivePath = path.join(archiveDir, `${name}-ROADMAP.md`);
    fs.writeFileSync(archivePath, content, 'utf-8');
    archived.push('ROADMAP.md');
  }

  if (fs.existsSync(reqPath)) {
    const content = fs.readFileSync(reqPath, 'utf-8');
    const header = `# Requirements Archive: ${name}\n\n**Archived:** ${today}\n**Status:** SHIPPED\n\n---\n\n`;
    const archivePath = path.join(archiveDir, `${name}-REQUIREMENTS.md`);
    fs.writeFileSync(archivePath, header + content, 'utf-8');
    archived.push('REQUIREMENTS.md');
  }

  output({
    archived_as: name,
    date: today,
    files: archived,
    archive_dir: '.planning/milestones',
  }, raw);
}

function cmdMilestoneComplete(cwd, raw) {
  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  const milestonesPath = path.join(cwd, '.planning', 'MILESTONES.md');
  const archiveDir = path.join(cwd, '.planning', 'milestones');
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const today = new Date().toISOString().split('T')[0];

  let version = 'v1.0';
  let milestoneName = 'milestone';
  try {
    const info = getMilestoneInfo(cwd);
    version = info.version;
    milestoneName = info.name;
  } catch {}

  fs.mkdirSync(archiveDir, { recursive: true });

  const isDirInMilestone = getMilestonePhaseFilter(cwd);

  let phaseCount = 0;
  let totalPlans = 0;
  let totalTasks = 0;
  const accomplishments = [];

  try {
    const entries = fs.readdirSync(phasesDir, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

    for (const dir of dirs) {
      if (!isDirInMilestone(dir)) continue;
      phaseCount++;
      const phaseFiles = fs.readdirSync(path.join(phasesDir, dir));
      const plans = phaseFiles.filter(f => f.endsWith('-PLAN.md') || f === 'PLAN.md');
      const summaries = phaseFiles.filter(f => f.endsWith('-SUMMARY.md') || f === 'SUMMARY.md');
      totalPlans += plans.length;

      for (const s of summaries) {
        try {
          const content = fs.readFileSync(path.join(phasesDir, dir, s), 'utf-8');
          const fm = extractFrontmatter(content);
          if (fm['one-liner']) accomplishments.push(fm['one-liner']);
          const taskMatches = content.match(/##\s*Task\s*\d+/gi) || [];
          totalTasks += taskMatches.length;
        } catch {}
      }
    }
  } catch {}

  if (fs.existsSync(roadmapPath)) {
    const content = fs.readFileSync(roadmapPath, 'utf-8');
    fs.writeFileSync(path.join(archiveDir, `${version}-ROADMAP.md`), content, 'utf-8');
  }

  const accomplishmentsList = accomplishments.map(a => `- ${a}`).join('\n');
  const milestoneEntry = `## ${version} ${milestoneName} (Shipped: ${today})\n\n**Phases completed:** ${phaseCount} phases, ${totalPlans} plans, ${totalTasks} tasks\n\n**Key accomplishments:**\n${accomplishmentsList || '- (none recorded)'}\n\n---\n\n`;

  if (fs.existsSync(milestonesPath)) {
    const existing = fs.readFileSync(milestonesPath, 'utf-8');
    const headerMatch = existing.match(/^(#{1,3}\s+[^\n]*\n\n?)/);
    if (headerMatch) {
      const header = headerMatch[1];
      const rest = existing.slice(header.length);
      fs.writeFileSync(milestonesPath, header + milestoneEntry + rest, 'utf-8');
    } else {
      fs.writeFileSync(milestonesPath, milestoneEntry + existing, 'utf-8');
    }
  } else {
    fs.writeFileSync(milestonesPath, `# Milestones\n\n${milestoneEntry}`, 'utf-8');
  }

  if (fs.existsSync(statePath)) {
    let stateContent = fs.readFileSync(statePath, 'utf-8');
    stateContent = stateContent.replace(
      /(\*\*Status:\*\*\s*).*/,
      `$1${version} milestone complete`
    );
    stateContent = stateContent.replace(
      /(\*\*Last Activity:\*\*\s*).*/,
      `$1${today}`
    );
    writeStateMd(statePath, stateContent, cwd);
  }

  output({
    version,
    name: milestoneName,
    date: today,
    phases: phaseCount,
    plans: totalPlans,
    tasks: totalTasks,
    accomplishments,
    milestones_updated: true,
    state_updated: fs.existsSync(statePath),
  }, raw);
}

function cmdMilestoneList(cwd, raw) {
  const milestonesPath = path.join(cwd, '.planning', 'MILESTONES.md');
  const archiveDir = path.join(cwd, '.planning', 'milestones');

  const milestones = [];

  if (fs.existsSync(milestonesPath)) {
    const content = fs.readFileSync(milestonesPath, 'utf-8');
    const milestoneRegex = /## (v[\d.]+)\s+([^(]+)\(Shipped:\s*([^)]+)\)/gi;
    let match;
    while ((match = milestoneRegex.exec(content)) !== null) {
      milestones.push({
        version: match[1],
        name: match[2].trim(),
        shipped: match[3].trim(),
      });
    }
  }

  let archivedFiles = [];
  try {
    if (fs.existsSync(archiveDir)) {
      archivedFiles = fs.readdirSync(archiveDir).filter(f => f.endsWith('-ROADMAP.md'));
    }
  } catch {}

  output({
    milestones,
    count: milestones.length,
    archived_roadmaps: archivedFiles,
  }, raw);
}

module.exports = {
  cmdMilestoneArchive,
  cmdMilestoneComplete,
  cmdMilestoneList,
};
