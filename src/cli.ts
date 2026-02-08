import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  copyFileSync,
} from "node:fs";
import { join, dirname, resolve, relative, basename, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import * as readline from "node:readline";

// ─── Constants ───────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = resolve(__dirname, "..");
const HOME = homedir();

// Markers for entry point file sections (CLAUDE.md, GEMINI.md)
const MARKER_START = "<!-- Skills by Amrit START -->";
const MARKER_END = "<!-- Skills by Amrit END -->";
// Legacy marker from older versions (for backward compat detection)
const LEGACY_MARKER = "<!-- Skills by Amrit -->";

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
} as const;

// ─── Agent Registry ──────────────────────────────────────────────────────────
// Maps agent names to their local and global skill directories
// Compatible with the Agent Skills specification (agentskills.io)
// and the skills.sh CLI (npx skills)

interface AgentConfig {
  name: string;
  displayName: string;
  localDir: string;
  globalDir: string;
  commandsDir?: string;
  workflowsDir?: string;
  agentsDir?: string;
  rulesDir?: string;
  entryPointFile?: string; // e.g. "CLAUDE.md" or "GEMINI.md" — the file that goes in project root
}

// Asset types that can be installed
type AssetType = "skills" | "commands" | "workflows" | "agents" | "cursor-rules";

const AGENTS: AgentConfig[] = [
  {
    name: "claude-code",
    displayName: "Claude Code",
    localDir: ".claude/skills",
    globalDir: join(HOME, ".claude", "skills"),
    commandsDir: ".claude/commands",
    agentsDir: ".claude/agents",
    entryPointFile: "CLAUDE.md",
  },
  {
    name: "cursor",
    displayName: "Cursor",
    localDir: ".cursor/skills",
    globalDir: join(HOME, ".cursor", "skills"),
    rulesDir: ".cursor/rules",
  },
  {
    name: "windsurf",
    displayName: "Windsurf",
    localDir: ".windsurf/skills",
    globalDir: join(HOME, ".codeium", "windsurf", "skills"),
  },
  {
    name: "antigravity",
    displayName: "Antigravity (Gemini)",
    localDir: ".agent/skills",
    globalDir: join(HOME, ".gemini", "antigravity", "skills"),
    workflowsDir: ".agent/workflows",
    entryPointFile: "GEMINI.md",
  },
  {
    name: "gemini-cli",
    displayName: "Gemini CLI",
    localDir: ".gemini/skills",
    globalDir: join(HOME, ".gemini", "skills"),
    entryPointFile: "GEMINI.md",
  },
  {
    name: "github-copilot",
    displayName: "GitHub Copilot",
    localDir: ".github/skills",
    globalDir: join(HOME, ".copilot", "skills"),
  },
  {
    name: "codex",
    displayName: "Codex",
    localDir: ".agents/skills",
    globalDir: join(HOME, ".codex", "skills"),
  },
  {
    name: "cline",
    displayName: "Cline",
    localDir: ".cline/skills",
    globalDir: join(HOME, ".cline", "skills"),
  },
  {
    name: "roo",
    displayName: "Roo",
    localDir: ".roo/skills",
    globalDir: join(HOME, ".roo", "skills"),
  },
  {
    name: "amp",
    displayName: "Amp",
    localDir: ".agents/skills",
    globalDir: join(HOME, ".config", "agents", "skills"),
  },
  {
    name: "kilo",
    displayName: "Kilo Code",
    localDir: ".kilocode/skills",
    globalDir: join(HOME, ".kilocode", "skills"),
  },
  {
    name: "augment",
    displayName: "Augment",
    localDir: ".augment/skills",
    globalDir: join(HOME, ".augment", "skills"),
  },
  {
    name: "continue",
    displayName: "Continue",
    localDir: ".continue/skills",
    globalDir: join(HOME, ".continue", "skills"),
  },
  {
    name: "goose",
    displayName: "Goose",
    localDir: ".goose/skills",
    globalDir: join(HOME, ".config", "goose", "skills"),
  },
  {
    name: "opencode",
    displayName: "OpenCode",
    localDir: ".agents/skills",
    globalDir: join(HOME, ".config", "opencode", "skills"),
  },
  {
    name: "trae",
    displayName: "Trae",
    localDir: ".trae/skills",
    globalDir: join(HOME, ".trae", "skills"),
  },
  {
    name: "junie",
    displayName: "Junie",
    localDir: ".junie/skills",
    globalDir: join(HOME, ".junie", "skills"),
  },
  {
    name: "openclaw",
    displayName: "OpenClaw",
    localDir: "skills",
    globalDir: join(HOME, ".moltbot", "skills"),
  },
  {
    name: "openhands",
    displayName: "OpenHands",
    localDir: ".openhands/skills",
    globalDir: join(HOME, ".openhands", "skills"),
  },
  {
    name: "kode",
    displayName: "Kode",
    localDir: ".kode/skills",
    globalDir: join(HOME, ".kode", "skills"),
  },
  {
    name: "qoder",
    displayName: "Qoder",
    localDir: ".qoder/skills",
    globalDir: join(HOME, ".qoder", "skills"),
  },
  {
    name: "mux",
    displayName: "Mux",
    localDir: ".mux/skills",
    globalDir: join(HOME, ".mux", "skills"),
  },
  {
    name: "zencoder",
    displayName: "Zencoder",
    localDir: ".zencoder/skills",
    globalDir: join(HOME, ".zencoder", "skills"),
  },
  {
    name: "crush",
    displayName: "Crush",
    localDir: ".crush/skills",
    globalDir: join(HOME, ".config", "crush", "skills"),
  },
  {
    name: "droid",
    displayName: "Droid",
    localDir: ".factory/skills",
    globalDir: join(HOME, ".factory", "skills"),
  },
  {
    name: "command-code",
    displayName: "Command Code",
    localDir: ".commandcode/skills",
    globalDir: join(HOME, ".commandcode", "skills"),
  },
  {
    name: "codebuddy",
    displayName: "CodeBuddy",
    localDir: ".codebuddy/skills",
    globalDir: join(HOME, ".codebuddy", "skills"),
  },
  {
    name: "mistral-vibe",
    displayName: "Mistral Vibe",
    localDir: ".vibe/skills",
    globalDir: join(HOME, ".vibe", "skills"),
  },
  {
    name: "qwen-code",
    displayName: "Qwen Code",
    localDir: ".qwen/skills",
    globalDir: join(HOME, ".qwen", "skills"),
  },
  {
    name: "pi",
    displayName: "Pi",
    localDir: ".pi/skills",
    globalDir: join(HOME, ".pi", "agent", "skills"),
  },
  {
    name: "replit",
    displayName: "Replit",
    localDir: ".agents/skills",
    globalDir: join(HOME, ".config", "agents", "skills"),
  },
  {
    name: "kiro-cli",
    displayName: "Kiro CLI",
    localDir: ".kiro/skills",
    globalDir: join(HOME, ".kiro", "skills"),
  },
  {
    name: "iflow-cli",
    displayName: "iFlow CLI",
    localDir: ".iflow/skills",
    globalDir: join(HOME, ".iflow", "skills"),
  },
  {
    name: "kimi-cli",
    displayName: "Kimi CLI",
    localDir: ".agents/skills",
    globalDir: join(HOME, ".config", "agents", "skills"),
  },
];

const SKILL_CATEGORIES: Record<string, string[]> = {
  "Core Development": [
    "brainstorming",
    "writing-plans",
    "executing-plans",
    "test-driven-development",
    "systematic-debugging",
    "code-review",
    "verification-before-completion",
    "git-workflow",
  ],
  Auditing: [
    "architecture-audit",
    "security-audit",
    "performance-audit",
    "database-audit",
    "frontend-audit",
    "api-design-audit",
    "dependency-audit",
    "observability-audit",
    "accessibility-audit",
    "ci-cd-audit",
  ],
  Evolution: [
    "refactoring-safely",
    "writing-documentation",
    "codebase-mapping",
    "incident-response",
  ],
  "Agent Intelligence": [
    "persistent-memory",
    "agent-team-coordination",
  ],
  "Integration & Completeness": [
    "full-stack-api-integration",
    "product-completeness-audit",
    "brutal-exhaustive-audit",
  ],
  Meta: ["writing-skills", "using-skills"],
};

// ─── Utilities ───────────────────────────────────────────────────────────────

function log(msg: string): void {
  console.log(msg);
}
function logOk(msg: string): void {
  console.log(`${C.green}✓${C.reset} ${msg}`);
}
function logWarn(msg: string): void {
  console.log(`${C.yellow}⚠${C.reset} ${msg}`);
}
function logErr(msg: string): void {
  console.error(`${C.red}✗${C.reset} ${msg}`);
}
function logInfo(msg: string): void {
  console.log(`${C.cyan}ℹ${C.reset} ${msg}`);
}
function logHeader(msg: string): void {
  console.log(`\n${C.bold}${C.magenta}${msg}${C.reset}`);
}

function getAllSkillNames(): string[] {
  const dir = join(PACKAGE_ROOT, "skills");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) =>
    existsSync(join(dir, n, "SKILL.md"))
  );
}

function getAllAssetNames(assetDir: string, ext?: string): string[] {
  const dir = join(PACKAGE_ROOT, assetDir);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => !ext || f.endsWith(ext))
    .map((f) => f.replace(/\.[^.]+$/, ""));
}

function getAssetFiles(assetDir: string, ext?: string): string[] {
  const dir = join(PACKAGE_ROOT, assetDir);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => !ext || f.endsWith(ext));
}

function getSkillDescription(name: string): string {
  const p = join(PACKAGE_ROOT, "skills", name, "SKILL.md");
  if (!existsSync(p)) return "";
  const content = readFileSync(p, "utf-8");
  const m = content.match(/description:\s*["'](.+?)["']/);
  return m ? m[1] : "";
}

interface CopyResult {
  newFiles: number;
  updatedFiles: number;
}

function copyDirRecursive(src: string, dest: string): CopyResult {
  const result: CopyResult = { newFiles: 0, updatedFiles: 0 };
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });

  for (const entry of readdirSync(src)) {
    const s = join(src, entry);
    const d = join(dest, entry);
    if (statSync(s).isDirectory()) {
      const sub = copyDirRecursive(s, d);
      result.newFiles += sub.newFiles;
      result.updatedFiles += sub.updatedFiles;
    } else {
      const isNew = !existsSync(d);
      copyFileSync(s, d);
      if (isNew) {
        result.newFiles++;
      } else {
        result.updatedFiles++;
      }
    }
  }
  return result;
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function getPackageVersion(): string {
  const pkgPath = join(PACKAGE_ROOT, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return pkg.version || "unknown";
  }
  return "unknown";
}

// ─── Entry Point Content Generator ──────────────────────────────────────────
// Generates the MINIMAL content to append/update in CLAUDE.md or GEMINI.md.
// This is NOT the entire file — just the activation section with correct paths.

function generateActivationSection(agent: AgentConfig): string {
  const skillsPath = agent.localDir;
  const hasWorkflows = !!agent.workflowsDir;
  const hasCommands = !!agent.commandsDir;
  const hasAgentDefs = !!agent.agentsDir;

  let content = `## Skills by Amrit

> An agentic skills framework that makes AI assistants think like senior staff engineers.

You have a library of composable skills installed in \`${skillsPath}/\`. Before any task, check if a relevant skill exists. Skills are not suggestions — they are mandatory workflows when their activation conditions are met.

**Check skills before:**
- Writing any code
- Debugging any issue
- Reviewing any PR
- Auditing any system
- Planning any feature
- Refactoring any module

### Core Principles

Read the \`_rules\` skill in \`${skillsPath}/_rules/SKILL.md\` for core principles, anti-hallucination protocol, and severity framework.

**The three non-negotiables:**
1. **Evidence before claims** — Never say "done" without verification
2. **Root cause before fixes** — Never patch symptoms
3. **Plan before code** — Never start coding without understanding what you're building

### Skill Activation

Skills activate automatically when their conditions are met. You MUST use the relevant skill — skipping is not an option.

| Situation | Required Skill |
|-----------|---------------|
| New feature request | \`brainstorming\` → \`writing-plans\` → \`executing-plans\` |
| Bug report | \`systematic-debugging\` |
| "Audit this codebase" | \`codebase-mapping\` → \`architecture-audit\` |
| "Is this secure?" | \`security-audit\` |
| "Why is this slow?" | \`performance-audit\` |
| "Review this code" | \`code-review\` |
| Writing tests | \`test-driven-development\` |
| About to say "done" | \`verification-before-completion\` |
| Changing existing code | \`refactoring-safely\` |
| Database questions | \`database-audit\` |
| Frontend issues | \`frontend-audit\` |
| API design | \`api-design-audit\` |
| Deployment concerns | \`ci-cd-audit\` |
| Accessibility | \`accessibility-audit\` |
| Logging/monitoring | \`observability-audit\` |
| Dependency updates | \`dependency-audit\` |
| Production incident | \`incident-response\` |
| Writing docs | \`writing-documentation\` |
| Git operations | \`git-workflow\` |
| API integration | \`full-stack-api-integration\` |
| Completeness check | \`product-completeness-audit\` |
| Deep audit | \`brutal-exhaustive-audit\` |
| Cross-session memory | \`persistent-memory\` |
| Complex multi-step task | \`agent-team-coordination\` |
| Creating new skills | \`writing-skills\` |
| Discovering skills | \`using-skills\` |

### Anti-Hallucination Protocol

1. **Never fabricate** — If you don't know, say so
2. **Never assume** — Verify file existence, function signatures, variable names
3. **Never extrapolate** — Read the actual code, don't guess from names
4. **Never claim completion without evidence** — Run the command, read the output

### Severity Framework

| Level | Label | Meaning |
|-------|-------|---------|
| 🔴 | Critical | Production risk, security vulnerability, data loss potential |
| 🟠 | High | Must fix before next deploy |
| 🟡 | Medium | Technical debt, fix within sprint |
| 🟢 | Low | Improvement opportunity, backlog |
| ⚪ | Info | Observation, no action needed |
`;

  if (hasWorkflows) {
    content += `
### Workflows

Workflows are installed in \`${agent.workflowsDir}/\`. Use \`/workflow-name\` to execute them. Workflows with \`// turbo\` annotations auto-run safe steps.
`;
  }

  if (hasCommands) {
    content += `
### Commands

Slash commands are available in \`${agent.commandsDir}/\`. Key commands include: \`/audit\`, \`/debug\`, \`/plan\`, \`/execute\`, \`/verify\`, \`/commit\`, \`/team\`, \`/memory\`.
`;
  }

  if (hasAgentDefs) {
    content += `
### Agents

Specialist agents are available in \`${agent.agentsDir}/\` for subagent spawning: debugger, verifier, mapper, planner, researcher, executor, reviewer.
`;
  }

  content += `
### Persistent Memory

If \`.planning/MEMORY.md\` exists, read it at session start and update it at session end. This provides cross-session context. Memory is always project-local — never installed globally.
`;

  return content;
}

// ─── Entry Point File Management ─────────────────────────────────────────────
// Handles CLAUDE.md and GEMINI.md with proper append/update/create logic.

function installEntryPointFile(
  agent: AgentConfig,
  projectDir: string
): "created" | "appended" | "updated" | "skipped" {
  if (!agent.entryPointFile) return "skipped";

  const destPath = join(projectDir, agent.entryPointFile);
  const activationContent = generateActivationSection(agent);
  const wrappedContent = `${MARKER_START}\n${activationContent}\n${MARKER_END}`;

  if (!existsSync(destPath)) {
    // Case 1: File doesn't exist → Create with just our section
    writeFileSync(destPath, wrappedContent + "\n");
    return "created";
  }

  const existing = readFileSync(destPath, "utf-8");

  // Case 2: File has our START/END markers → Replace the section (UPDATE)
  if (existing.includes(MARKER_START) && existing.includes(MARKER_END)) {
    const startIdx = existing.indexOf(MARKER_START);
    const endIdx = existing.indexOf(MARKER_END) + MARKER_END.length;
    const before = existing.substring(0, startIdx);
    const after = existing.substring(endIdx);
    writeFileSync(destPath, before + wrappedContent + after);
    return "updated";
  }

  // Case 3: File has legacy marker (old version) → Replace from legacy marker to end,
  // then append our properly-marked section
  if (existing.includes(LEGACY_MARKER)) {
    const legacyIdx = existing.indexOf(LEGACY_MARKER);
    const before = existing.substring(0, legacyIdx);
    writeFileSync(destPath, before.trimEnd() + "\n\n" + wrappedContent + "\n");
    return "updated";
  }

  // Case 4: File exists but has no markers → Append our section
  writeFileSync(
    destPath,
    existing.trimEnd() + "\n\n" + wrappedContent + "\n"
  );
  return "appended";
}

// ─── Agent Detection ─────────────────────────────────────────────────────────

function detectLocalAgents(projectDir: string): AgentConfig[] {
  const detected: AgentConfig[] = [];
  const seen = new Set<string>();

  for (const agent of AGENTS) {
    // Check if local agent config directory exists (e.g., .claude/, .cursor/)
    const agentConfigDir = join(projectDir, agent.localDir.split("/")[0]);
    if (existsSync(agentConfigDir) && !seen.has(agent.name)) {
      detected.push(agent);
      seen.add(agent.name);
    }
  }
  return detected;
}

function detectGlobalAgents(): AgentConfig[] {
  const detected: AgentConfig[] = [];
  const seen = new Set<string>();

  for (const agent of AGENTS) {
    // Check if global agent directory exists
    const globalBase = dirname(agent.globalDir);
    if (existsSync(globalBase) && !seen.has(agent.name)) {
      detected.push(agent);
      seen.add(agent.name);
    }
  }
  return detected;
}

// ─── Interactive Selection ───────────────────────────────────────────────────

async function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function selectAgents(
  detected: AgentConfig[],
  all: AgentConfig[]
): Promise<AgentConfig[]> {
  if (detected.length > 0) {
    log(`\n${C.bold}Detected agents:${C.reset}`);
    detected.forEach((a, i) =>
      log(`  ${C.green}${i + 1}.${C.reset} ${a.displayName} ${C.dim}(${a.localDir})${C.reset}`)
    );

    const answer = await askQuestion(
      `\nInstall to detected agents? ${C.dim}(Y/n/pick)${C.reset} `
    );

    if (!answer || answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
      return detected;
    }
  } else {
    log(`\n${C.yellow}No agents detected in this project.${C.reset}`);
  }

  // Show all agents for manual selection
  log(`\n${C.bold}Available agents:${C.reset}`);
  all.forEach((a, i) => {
    const marker = detected.some((d) => d.name === a.name) ? `${C.green}●${C.reset}` : " ";
    log(`  ${marker} ${C.dim}${String(i + 1).padStart(2)}.${C.reset} ${a.displayName}`);
  });

  const answer = await askQuestion(
    `\nEnter agent numbers ${C.dim}(comma-separated, e.g. 1,3,5)${C.reset}: `
  );

  const indices = answer
    .split(",")
    .map((s) => parseInt(s.trim(), 10) - 1)
    .filter((i) => i >= 0 && i < all.length);

  if (indices.length === 0) {
    logErr("No agents selected. Aborting.");
    process.exit(1);
  }

  return indices.map((i) => all[i]);
}

// ─── Installation ────────────────────────────────────────────────────────────

interface InstallResult {
  skillsNew: number;
  skillsUpdated: number;
  commands: number;
  workflows: number;
  agents: number;
  rules: number;
}

function installSkillsToAgent(
  agent: AgentConfig,
  skillNames: string[],
  projectDir: string,
  isGlobal: boolean
): { newSkills: number; updatedSkills: number } {
  const targetBase = isGlobal ? agent.globalDir : join(projectDir, agent.localDir);
  let newSkills = 0;
  let updatedSkills = 0;

  for (const skill of skillNames) {
    const src = join(PACKAGE_ROOT, "skills", skill);
    const dest = join(targetBase, skill);

    if (!existsSync(src)) {
      logWarn(`Skill not found: ${skill}`);
      continue;
    }

    const isNew = !existsSync(dest);
    copyDirRecursive(src, dest);

    if (isNew) {
      newSkills++;
    } else {
      updatedSkills++;
    }
  }

  return { newSkills, updatedSkills };
}

function installCommandsToAgent(
  agent: AgentConfig,
  projectDir: string
): number {
  if (!agent.commandsDir) return 0;

  const srcDir = join(PACKAGE_ROOT, "commands");
  if (!existsSync(srcDir)) return 0;

  const targetDir = join(projectDir, agent.commandsDir);
  ensureDir(targetDir);

  let installed = 0;
  const commandFiles = readdirSync(srcDir).filter(
    (f) => f.endsWith(".md") && !statSync(join(srcDir, f)).isDirectory()
  );

  for (const file of commandFiles) {
    copyFileSync(join(srcDir, file), join(targetDir, file));
    installed++;
  }

  return installed;
}

function installWorkflowsToAgent(
  agent: AgentConfig,
  projectDir: string
): number {
  if (!agent.workflowsDir) return 0;

  const srcDir = join(PACKAGE_ROOT, "workflows");
  if (!existsSync(srcDir)) return 0;

  const targetDir = join(projectDir, agent.workflowsDir);
  ensureDir(targetDir);

  let installed = 0;
  const workflowFiles = readdirSync(srcDir).filter((f) => f.endsWith(".md"));

  for (const file of workflowFiles) {
    copyFileSync(join(srcDir, file), join(targetDir, file));
    installed++;
  }

  return installed;
}

function installAgentDefsToAgent(
  agent: AgentConfig,
  projectDir: string
): number {
  if (!agent.agentsDir) return 0;

  const srcDir = join(PACKAGE_ROOT, "agents");
  if (!existsSync(srcDir)) return 0;

  const targetDir = join(projectDir, agent.agentsDir);
  ensureDir(targetDir);

  let installed = 0;
  const agentFiles = readdirSync(srcDir).filter((f) => f.endsWith(".md"));

  for (const file of agentFiles) {
    copyFileSync(join(srcDir, file), join(targetDir, file));
    installed++;
  }

  return installed;
}

function installCursorRulesToAgent(
  agent: AgentConfig,
  projectDir: string
): number {
  if (!agent.rulesDir) return 0;

  const srcDir = join(PACKAGE_ROOT, "cursor-rules");
  if (!existsSync(srcDir)) return 0;

  const targetDir = join(projectDir, agent.rulesDir);
  ensureDir(targetDir);

  let installed = 0;
  const ruleFiles = readdirSync(srcDir).filter((f) => f.endsWith(".mdc"));

  for (const file of ruleFiles) {
    copyFileSync(join(srcDir, file), join(targetDir, file));
    installed++;
  }

  return installed;
}

function installAllAssetsToAgent(
  agent: AgentConfig,
  skillNames: string[],
  projectDir: string,
  isGlobal: boolean
): InstallResult {
  const skillResult = installSkillsToAgent(agent, skillNames, projectDir, isGlobal);
  return {
    skillsNew: skillResult.newSkills,
    skillsUpdated: skillResult.updatedSkills,
    commands: isGlobal ? 0 : installCommandsToAgent(agent, projectDir),
    workflows: isGlobal ? 0 : installWorkflowsToAgent(agent, projectDir),
    agents: isGlobal ? 0 : installAgentDefsToAgent(agent, projectDir),
    rules: isGlobal ? 0 : installCursorRulesToAgent(agent, projectDir),
  };
}

function installRulesAsSkill(
  agent: AgentConfig,
  projectDir: string,
  isGlobal: boolean
): void {
  const targetBase = isGlobal ? agent.globalDir : join(projectDir, agent.localDir);

  // Install rules as a combined _rules skill directory
  const rulesSrc = join(PACKAGE_ROOT, "rules");
  if (existsSync(rulesSrc)) {
    const rulesSkillDir = join(targetBase, "_rules");
    ensureDir(rulesSkillDir);

    // Create a combined rules SKILL.md
    const ruleFiles = readdirSync(rulesSrc).filter((f) => f.endsWith(".md"));
    let combinedContent = `---
name: _rules
description: "Foundation rules for all skills — core principles, anti-hallucination protocol, and severity framework. Loaded automatically."
---

# Foundation Rules

These rules apply to ALL skills and must be followed at all times.

`;
    for (const ruleFile of ruleFiles) {
      const content = readFileSync(join(rulesSrc, ruleFile), "utf-8");
      combinedContent += `\n\n${content}\n`;
    }

    writeFileSync(join(rulesSkillDir, "SKILL.md"), combinedContent);
  }
}

// ─── Manifest ────────────────────────────────────────────────────────────────
// Tracks installation state for version awareness and update detection.

interface InstallManifest {
  version: string;
  installedAt: string;
  updatedAt: string;
  agents: string[];
  skillCount: number;
  scope: "local" | "global";
}

function writeManifest(
  projectDir: string,
  agents: AgentConfig[],
  skillCount: number,
  isGlobal: boolean
): void {
  const manifestPath = join(projectDir, ".skills-by-amrit.json");
  const now = new Date().toISOString();

  let manifest: InstallManifest;

  if (existsSync(manifestPath)) {
    // Update existing manifest
    const existing: InstallManifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    manifest = {
      ...existing,
      version: getPackageVersion(),
      updatedAt: now,
      agents: agents.map((a) => a.name),
      skillCount,
    };
  } else {
    // Create new manifest
    manifest = {
      version: getPackageVersion(),
      installedAt: now,
      updatedAt: now,
      agents: agents.map((a) => a.name),
      skillCount,
      scope: isGlobal ? "global" : "local",
    };
  }

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

// ─── Commands ────────────────────────────────────────────────────────────────

async function cmdAdd(args: string[], isUpdate: boolean = false): Promise<void> {
  const flags = parseFlags(args);
  const skillNames = flags.positional;
  const allSkills = getAllSkillNames();

  // Determine which skills to install
  let toInstall: string[];
  if (skillNames.length === 0 || flags.all || isUpdate) {
    toInstall = allSkills;
  } else {
    // Validate
    const invalid = skillNames.filter((s) => !allSkills.includes(s));
    if (invalid.length > 0) {
      logErr(`Unknown skill(s): ${invalid.join(", ")}`);
      log(`\nRun ${C.cyan}npx skills-by-amrit list${C.reset} to see available skills.`);
      process.exit(1);
    }
    toInstall = skillNames;
  }

  const version = getPackageVersion();
  const action = isUpdate ? "Updating" : "Installing";

  logHeader(`🧠 Skills by Amrit v${version}`);
  log(`${C.dim}${action} ${toInstall.length} skill(s)${C.reset}`);

  const projectDir = process.cwd();

  // Determine target agents
  let targetAgents: AgentConfig[];

  if (flags.agents.length > 0) {
    // User specified agents via --agent flag
    if (flags.agents.includes("*")) {
      targetAgents = AGENTS;
    } else {
      targetAgents = flags.agents
        .map((name) => AGENTS.find((a) => a.name === name))
        .filter((a): a is AgentConfig => a !== undefined);

      const unknown = flags.agents.filter(
        (name) => !AGENTS.find((a) => a.name === name)
      );
      if (unknown.length > 0) {
        logWarn(`Unknown agent(s): ${unknown.join(", ")}`);
      }
    }
  } else if (flags.yes || isUpdate) {
    // Non-interactive: detect and use detected agents, or all
    const detected = flags.global
      ? detectGlobalAgents()
      : detectLocalAgents(projectDir);
    targetAgents = detected.length > 0 ? detected : AGENTS.slice(0, 5); // Default top 5
  } else {
    // Interactive: detect and let user choose
    const detected = flags.global
      ? detectGlobalAgents()
      : detectLocalAgents(projectDir);
    targetAgents = await selectAgents(detected, AGENTS);
  }

  if (targetAgents.length === 0) {
    logErr("No agents selected.");
    process.exit(1);
  }

  log("");

  // Install to each agent
  const totals: InstallResult = {
    skillsNew: 0, skillsUpdated: 0,
    commands: 0, workflows: 0, agents: 0, rules: 0,
  };
  const entryPointResults: Array<{ file: string; result: string }> = [];

  for (const agent of targetAgents) {
    const result = installAllAssetsToAgent(agent, toInstall, projectDir, flags.global);
    installRulesAsSkill(agent, projectDir, flags.global);

    totals.skillsNew += result.skillsNew;
    totals.skillsUpdated += result.skillsUpdated;
    totals.commands += result.commands;
    totals.workflows += result.workflows;
    totals.agents += result.agents;
    totals.rules += result.rules;

    const targetPath = flags.global
      ? agent.globalDir
      : join(projectDir, agent.localDir);

    const totalSkills = result.skillsNew + result.skillsUpdated;
    const parts: string[] = [];
    if (totalSkills > 0) {
      const details: string[] = [];
      if (result.skillsNew > 0) details.push(`${result.skillsNew} new`);
      if (result.skillsUpdated > 0) details.push(`${result.skillsUpdated} updated`);
      parts.push(`${totalSkills} skills (${details.join(", ")})`);
    }
    if (result.commands > 0) parts.push(`${result.commands} commands`);
    if (result.workflows > 0) parts.push(`${result.workflows} workflows`);
    if (result.agents > 0) parts.push(`${result.agents} agents`);
    if (result.rules > 0) parts.push(`${result.rules} rules`);

    const summary = parts.length > 0 ? parts.join(", ") : `${totalSkills} skills`;
    logOk(
      `${C.bold}${agent.displayName}${C.reset} ${C.dim}→ ${summary} → ${targetPath}${C.reset}`
    );

    // Install entry point file (CLAUDE.md / GEMINI.md) — LOCAL only
    if (!flags.global && agent.entryPointFile) {
      const epResult = installEntryPointFile(agent, projectDir);
      if (epResult !== "skipped") {
        entryPointResults.push({ file: agent.entryPointFile, result: epResult });
      }
    }
  }

  // Log entry point file results (deduplicated — multiple agents may share GEMINI.md)
  const seenFiles = new Set<string>();
  for (const ep of entryPointResults) {
    if (seenFiles.has(ep.file)) continue;
    seenFiles.add(ep.file);

    switch (ep.result) {
      case "created":
        logOk(`${ep.file} ${C.dim}— created${C.reset}`);
        break;
      case "appended":
        logInfo(`${ep.file} ${C.dim}— appended skill activation section (your content preserved)${C.reset}`);
        break;
      case "updated":
        logInfo(`${ep.file} ${C.dim}— updated skill activation section to v${version}${C.reset}`);
        break;
    }
  }

  // Write manifest (local installs only)
  if (!flags.global) {
    writeManifest(projectDir, targetAgents, toInstall.length, flags.global);
  }

  log("");
  logHeader("✅ Installation Complete");

  const totalSkills = totals.skillsNew + totals.skillsUpdated;
  const totalAssets = totalSkills + totals.commands + totals.workflows + totals.agents + totals.rules;
  log(
    `   ${C.dim}${totalAssets} assets installed to ${targetAgents.length} agent(s)${C.reset}`
  );

  const breakdown: string[] = [];
  if (totalSkills > 0) {
    const details: string[] = [];
    if (totals.skillsNew > 0) details.push(`${totals.skillsNew} new`);
    if (totals.skillsUpdated > 0) details.push(`${totals.skillsUpdated} updated`);
    breakdown.push(`${totalSkills} skills (${details.join(", ")})`);
  }
  if (totals.commands > 0) breakdown.push(`${totals.commands} commands`);
  if (totals.workflows > 0) breakdown.push(`${totals.workflows} workflows`);
  if (totals.agents > 0) breakdown.push(`${totals.agents} agent definitions`);
  if (totals.rules > 0) breakdown.push(`${totals.rules} cursor rules`);
  if (breakdown.length > 0) {
    log(`   ${C.dim}${breakdown.join(" · ")}${C.reset}`);
  }

  log(
    `   ${C.dim}${flags.global ? "Global" : "Local"} scope${C.reset}`
  );

  if (!flags.global) {
    log(`   ${C.dim}Memory/planning: not installed (created at runtime per-project)${C.reset}`);
  }

  log("");
}

function cmdList(): void {
  logHeader("🧠 Skills by Amrit — Available Assets\n");

  // Skills
  log(`${C.bold}${C.magenta}━━━ Skills ━━━${C.reset}\n`);
  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    log(`${C.bold}${C.blue}${category}${C.reset} ${C.dim}(${skills.length})${C.reset}`);
    for (const skill of skills) {
      const desc = getSkillDescription(skill);
      const short = desc.length > 72 ? desc.substring(0, 69) + "..." : desc;
      log(`  ${C.cyan}${skill}${C.reset}`);
      if (short) log(`    ${C.dim}${short}${C.reset}`);
    }
    log("");
  }

  // Commands
  const commands = getAssetFiles("commands", ".md");
  if (commands.length > 0) {
    log(`${C.bold}${C.magenta}━━━ Commands ━━━${C.reset} ${C.dim}(installed to Claude Code .claude/commands/)${C.reset}\n`);
    for (const cmd of commands) {
      log(`  ${C.cyan}/${cmd.replace(".md", "")}${C.reset}`);
    }
    log("");
  }

  // Workflows
  const workflows = getAssetFiles("workflows", ".md");
  if (workflows.length > 0) {
    log(`${C.bold}${C.magenta}━━━ Workflows ━━━${C.reset} ${C.dim}(installed to Antigravity .agent/workflows/)${C.reset}\n`);
    for (const wf of workflows) {
      log(`  ${C.cyan}/${wf.replace(".md", "")}${C.reset}`);
    }
    log("");
  }

  // Agents
  const agents = getAssetFiles("agents", ".md");
  if (agents.length > 0) {
    log(`${C.bold}${C.magenta}━━━ Agent Definitions ━━━${C.reset} ${C.dim}(installed to Claude Code .claude/agents/)${C.reset}\n`);
    for (const ag of agents) {
      log(`  ${C.cyan}${ag.replace(".md", "")}${C.reset}`);
    }
    log("");
  }

  // Cursor Rules
  const rules = getAssetFiles("cursor-rules", ".mdc");
  if (rules.length > 0) {
    log(`${C.bold}${C.magenta}━━━ Cursor Rules ━━━${C.reset} ${C.dim}(installed to Cursor .cursor/rules/)${C.reset}\n`);
    for (const rule of rules) {
      log(`  ${C.cyan}${rule.replace(".mdc", "")}${C.reset}`);
    }
    log("");
  }

  log(
    `${C.dim}Total: ${getAllSkillNames().length} skills · ${commands.length} commands · ${workflows.length} workflows · ${agents.length} agents · ${rules.length} rules${C.reset}`
  );
  log("");
}

function cmdAgents(): void {
  logHeader("🧠 Skills by Amrit — Supported Agents\n");

  const projectDir = process.cwd();
  const detected = detectLocalAgents(projectDir);

  log(`${C.bold}${AGENTS.length} agents supported:${C.reset}\n`);

  for (const agent of AGENTS) {
    const isDetected = detected.some((d) => d.name === agent.name);
    const marker = isDetected ? `${C.green}●${C.reset}` : `${C.dim}○${C.reset}`;
    const status = isDetected ? `${C.green} (detected)${C.reset}` : "";
    log(
      `  ${marker} ${C.bold}${agent.displayName}${C.reset}${status}`
    );
    log(
      `    ${C.dim}local: ${agent.localDir}  |  global: ${agent.globalDir}${C.reset}`
    );
  }

  log("");
}

function cmdStatus(): void {
  const projectDir = process.cwd();
  const manifestPath = join(projectDir, ".skills-by-amrit.json");

  if (!existsSync(manifestPath)) {
    log(`\n${C.yellow}No skills-by-amrit installation found in this project.${C.reset}`);
    log(`Run ${C.cyan}npx skills-by-amrit add${C.reset} to install.\n`);
    return;
  }

  const manifest: InstallManifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const currentVersion = getPackageVersion();
  const isOutdated = manifest.version !== currentVersion;

  logHeader("🧠 Skills by Amrit — Installation Status\n");

  log(`  ${C.bold}Installed version:${C.reset} ${manifest.version}${isOutdated ? ` ${C.yellow}(update available: ${currentVersion})${C.reset}` : ` ${C.green}(latest)${C.reset}`}`);
  log(`  ${C.bold}Installed at:${C.reset}      ${manifest.installedAt}`);
  log(`  ${C.bold}Last updated:${C.reset}      ${manifest.updatedAt}`);
  log(`  ${C.bold}Scope:${C.reset}             ${manifest.scope}`);
  log(`  ${C.bold}Skills:${C.reset}            ${manifest.skillCount}`);
  log(`  ${C.bold}Agents:${C.reset}            ${manifest.agents.join(", ")}`);

  if (isOutdated) {
    log(`\n  ${C.yellow}Run ${C.cyan}npx skills-by-amrit update${C.yellow} to update to v${currentVersion}${C.reset}`);
  }

  // Check for entry point files
  const claudeExists = existsSync(join(projectDir, "CLAUDE.md"));
  const geminiExists = existsSync(join(projectDir, "GEMINI.md"));
  const planningExists = existsSync(join(projectDir, ".planning", "MEMORY.md"));

  log("");
  log(`  ${C.bold}Entry points:${C.reset}`);
  log(`    CLAUDE.md: ${claudeExists ? `${C.green}present${C.reset}` : `${C.dim}not found${C.reset}`}`);
  log(`    GEMINI.md: ${geminiExists ? `${C.green}present${C.reset}` : `${C.dim}not found${C.reset}`}`);
  log(`    .planning/MEMORY.md: ${planningExists ? `${C.green}active${C.reset}` : `${C.dim}not initialized (run /memory-sync)${C.reset}`}`);

  log("");
}

function cmdVersion(): void {
  const pkgPath = join(PACKAGE_ROOT, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    log(`skills-by-amrit v${pkg.version}`);
  }
}

function cmdHelp(): void {
  log(`
${C.bold}${C.magenta}🧠 Skills by Amrit${C.reset}
${C.dim}An agentic skills framework that makes AI assistants think like staff engineers.${C.reset}
${C.dim}Compatible with 34+ AI coding agents via the Agent Skills specification.${C.reset}

${C.bold}USAGE${C.reset}

  ${C.cyan}npx skills-by-amrit add${C.reset}                          Install all skills (interactive)
  ${C.cyan}npx skills-by-amrit add${C.reset} <skill> [skill..]        Install specific skills
  ${C.cyan}npx skills-by-amrit add -a claude-code${C.reset}           Install to a specific agent
  ${C.cyan}npx skills-by-amrit add -a '*'${C.reset}                   Install to ALL agents
  ${C.cyan}npx skills-by-amrit add -g${C.reset}                       Install globally (user-wide)
  ${C.cyan}npx skills-by-amrit add --all -y${C.reset}                 Non-interactive, all skills
  ${C.cyan}npx skills-by-amrit update${C.reset}                       Update all skills to latest version
  ${C.cyan}npx skills-by-amrit status${C.reset}                       Show installation status
  ${C.cyan}npx skills-by-amrit list${C.reset}                         List available skills
  ${C.cyan}npx skills-by-amrit agents${C.reset}                       List supported agents
  ${C.cyan}npx skills-by-amrit help${C.reset}                         Show this help

${C.bold}OPTIONS${C.reset}

  ${C.yellow}-a, --agent <name>${C.reset}    Target specific agent(s), use '*' for all
  ${C.yellow}-g, --global${C.reset}          Install globally (user home) instead of project
  ${C.yellow}-y, --yes${C.reset}             Non-interactive mode (auto-accept)
  ${C.yellow}--all${C.reset}                 Install all skills

${C.bold}INSTALL BEHAVIOR${C.reset}

  ${C.bold}Skills:${C.reset}       Copied to agent skill directory. Re-running updates existing skills.
  ${C.bold}CLAUDE.md:${C.reset}    If exists, appends activation section. If already present, updates it.
  ${C.bold}GEMINI.md:${C.reset}    Same as CLAUDE.md — your existing content is always preserved.
  ${C.bold}Memory:${C.reset}       Never installed. Created at runtime per-project by the AI agent.
  ${C.bold}Global (-g):${C.reset}  Skills only. No entry point files, commands, workflows, or agents.

${C.bold}EXAMPLES${C.reset}

  ${C.dim}# Interactive: detect agents, choose, install everything${C.reset}
  npx skills-by-amrit add

  ${C.dim}# Install TDD and debugging to Claude Code${C.reset}
  npx skills-by-amrit add test-driven-development systematic-debugging -a claude-code

  ${C.dim}# Install all skills to Cursor and Windsurf${C.reset}
  npx skills-by-amrit add -a cursor -a windsurf

  ${C.dim}# Install globally for all agents (CI/CD friendly)${C.reset}
  npx skills-by-amrit add --all -g -a '*' -y

  ${C.dim}# Update to latest version (re-runs on detected agents)${C.reset}
  npx skills-by-amrit update

${C.bold}SUPPORTED AGENTS${C.reset}

  Claude Code, Cursor, Windsurf, Antigravity, Gemini CLI, GitHub Copilot,
  Codex, Cline, Roo, Amp, Kilo Code, Augment, Continue, Goose, OpenCode,
  Trae, Junie, OpenClaw, OpenHands, Kode, Qoder, Mux, Zencoder, Crush,
  Droid, Command Code, CodeBuddy, Mistral Vibe, Qwen Code, Pi, Replit,
  Kiro CLI, iFlow CLI, Kimi CLI

${C.bold}LINKS${C.reset}

  ${C.cyan}GitHub:${C.reset}  https://github.com/boparaiamrit/skills-by-amrit
  ${C.cyan}Author:${C.reset}  Amritpal Singh <boparaiamrit@gmail.com>
`);
}

// ─── Flag Parsing ────────────────────────────────────────────────────────────

interface ParsedFlags {
  positional: string[];
  agents: string[];
  global: boolean;
  yes: boolean;
  all: boolean;
}

function parseFlags(args: string[]): ParsedFlags {
  const result: ParsedFlags = {
    positional: [],
    agents: [],
    global: false,
    yes: false,
    all: false,
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === "-a" || arg === "--agent") {
      i++;
      if (i < args.length) result.agents.push(args[i]);
    } else if (arg === "-g" || arg === "--global") {
      result.global = true;
    } else if (arg === "-y" || arg === "--yes") {
      result.yes = true;
    } else if (arg === "--all") {
      result.all = true;
    } else if (!arg.startsWith("-")) {
      result.positional.push(arg);
    }
    i++;
  }

  return result;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "help" || command === "--help" || command === "-h") {
    cmdHelp();
    return;
  }

  if (command === "--version" || command === "-v") {
    cmdVersion();
    return;
  }

  if (command === "list" || command === "ls") {
    cmdList();
    return;
  }

  if (command === "agents") {
    cmdAgents();
    return;
  }

  if (command === "status") {
    cmdStatus();
    return;
  }

  if (command === "add" || command === "install") {
    await cmdAdd(args.slice(1), false);
    return;
  }

  if (command === "update" || command === "upgrade") {
    await cmdAdd(args.slice(1), true);
    return;
  }

  logErr(`Unknown command: ${command}`);
  log(`Run ${C.cyan}npx skills-by-amrit help${C.reset} for usage.`);
  process.exit(1);
}

main().catch((err) => {
  logErr(err.message);
  process.exit(1);
});
