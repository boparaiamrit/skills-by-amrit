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
import { homedir, platform } from "node:os";
import { createHash } from "node:crypto";
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

// File manifest name for tracking installed file hashes
const FILE_MANIFEST_NAME = "skills-file-manifest.json";

// Hook identifiers for idempotent registration and uninstall tracking
const HOOK_IDENTIFIER = "skills-by-amrit";

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
  hooksDir?: string;
  entryPointFile?: string; // e.g. "CLAUDE.md" or "GEMINI.md" — the file that goes in project root
  rulesFormat?: "mdc" | "windsurf" | "cline" | "roo" | "augment" | "continue" | "kilo"; // Platform-specific rules format
  modesFile?: string; // e.g. ".roomodes" — mode definitions file for Roo/Kilo
  hintsFile?: string; // e.g. ".goosehints" — plain text hints file for Goose
}

// Asset types that can be installed
type AssetType = "skills" | "commands" | "workflows" | "agents" | "cursor-rules" | "copilot-hooks";

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
    commandsDir: ".cursor/commands",
    rulesDir: ".cursor/rules",
    rulesFormat: "mdc",
    hooksDir: ".cursor",
    entryPointFile: "AGENTS.md",
  },
  {
    name: "windsurf",
    displayName: "Windsurf",
    localDir: ".windsurf/skills",
    globalDir: join(HOME, ".codeium", "windsurf", "skills"),
    rulesDir: ".windsurf/rules",
    rulesFormat: "windsurf",
    hooksDir: ".windsurf",
    entryPointFile: "AGENTS.md",
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
    commandsDir: ".github/prompts",
    agentsDir: ".github/agents",
    rulesDir: ".github/instructions",
    hooksDir: ".github/hooks",
    entryPointFile: "AGENTS.md",
  },
  {
    name: "codex",
    displayName: "Codex",
    localDir: ".agents/skills",
    globalDir: join(HOME, ".codex", "skills"),
    entryPointFile: "AGENTS.md",
  },
  {
    name: "cline",
    displayName: "Cline",
    localDir: ".cline/skills",
    globalDir: join(HOME, ".cline", "skills"),
    rulesDir: ".clinerules",
    rulesFormat: "cline",
    entryPointFile: "AGENTS.md",
  },
  {
    name: "roo",
    displayName: "Roo",
    localDir: ".roo/skills",
    globalDir: join(HOME, ".roo", "skills"),
    rulesDir: ".roo/rules-code",
    rulesFormat: "roo",
    modesFile: ".roomodes",
  },
  {
    name: "amp",
    displayName: "Amp",
    localDir: ".agents/skills",
    globalDir: join(HOME, ".config", "agents", "skills"),
    entryPointFile: "AGENTS.md",
  },
  {
    name: "kilo",
    displayName: "Kilo Code",
    localDir: ".kilocode/skills",
    globalDir: join(HOME, ".kilocode", "skills"),
    rulesDir: ".kilocode/rules",
    rulesFormat: "kilo",
    entryPointFile: "AGENTS.md",
  },
  {
    name: "augment",
    displayName: "Augment",
    localDir: ".augment/skills",
    globalDir: join(HOME, ".augment", "skills"),
    rulesDir: ".augment/rules",
    rulesFormat: "augment",
    entryPointFile: "AGENTS.md",
  },
  {
    name: "continue",
    displayName: "Continue",
    localDir: ".continue/skills",
    globalDir: join(HOME, ".continue", "skills"),
    commandsDir: ".continue/prompts",
    rulesDir: ".continue/rules",
    rulesFormat: "continue",
  },
  {
    name: "goose",
    displayName: "Goose",
    localDir: ".goose/skills",
    globalDir: join(HOME, ".config", "goose", "skills"),
    hintsFile: ".goosehints",
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
    "codebase-conformity",
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
    .filter((f: string) => !ext || f.endsWith(ext))
    .map((f) => f.replace(/\.[^.]+$/, ""));
}

function getAssetFiles(assetDir: string, ext?: string): string[] {
  const dir = join(PACKAGE_ROOT, assetDir);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f: string) => !ext || f.endsWith(ext));
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
| Adding code to existing codebase | \`codebase-conformity\` |
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

  if (agent.rulesDir) {
    content += `
### Instructions

Path-scoped instructions are installed in \`${agent.rulesDir}/\`. These apply automatically based on the \`applyTo\` glob patterns in their frontmatter.
`;
  }

  if (agent.hooksDir) {
    content += `
### Hooks

Lifecycle hooks are installed in \`${agent.hooksDir}/\`. Hook configuration is in \`${agent.hooksDir}/skills-hooks.json\`.
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

  // AGENTS.md is a standalone generated file (used by Codex, Cursor, Windsurf,
  // Cline, Amp, Augment, Kilo, Copilot). It's fully managed by us.
  if (agent.entryPointFile === "AGENTS.md") {
    const agentsMdContent = `${MARKER_START}\n${generateAgentsMd(agent)}\n${MARKER_END}\n`;

    if (!existsSync(destPath)) {
      writeFileSync(destPath, agentsMdContent);
      return "created";
    }

    const existing = readFileSync(destPath, "utf-8");

    // If it has our markers, update the section
    if (existing.includes(MARKER_START) && existing.includes(MARKER_END)) {
      const startIdx = existing.indexOf(MARKER_START);
      const endIdx = existing.indexOf(MARKER_END) + MARKER_END.length;
      const before = existing.substring(0, startIdx);
      const after = existing.substring(endIdx);
      writeFileSync(destPath, before + agentsMdContent.trimEnd() + after);
      return "updated";
    }

    // File exists without markers — append our section
    writeFileSync(
      destPath,
      existing.trimEnd() + "\n\n" + agentsMdContent
    );
    return "appended";
  }

  // CLAUDE.md and GEMINI.md use the activation section with markers
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
    (f: string) => f.endsWith(".md") && !statSync(join(srcDir, f)).isDirectory()
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
  const workflowFiles = readdirSync(srcDir).filter((f: string) => f.endsWith(".md"));

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
  const agentFiles = readdirSync(srcDir).filter((f: string) => f.endsWith(".md"));

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
  const ruleFiles = readdirSync(srcDir).filter((f: string) => f.endsWith(".mdc"));

  for (const file of ruleFiles) {
    copyFileSync(join(srcDir, file), join(targetDir, file));
    installed++;
  }

  return installed;
}

// ─── Copilot-Specific Conversions ─────────────────────────────────────────────
// GitHub Copilot uses different frontmatter formats for agents, prompts,
// instructions, and hooks. These functions convert from Claude/Cursor formats.

/** Map Claude Code tool names to GitHub Copilot tool names */
const CLAUDE_TO_COPILOT_TOOLS: Record<string, string> = {
  Read: "read",
  Write: "edit",
  Edit: "edit",
  Bash: "bash",
  Grep: "search",
  Glob: "search",
};

/**
 * Convert Claude allowed-tools array to Copilot tools array.
 * Deduplicates and removes unsupported tools (e.g., Agent).
 */
function convertToolsToCopilot(claudeTools: string[]): string[] {
  const copilotTools = new Set<string>();
  for (const tool of claudeTools) {
    const mapped = CLAUDE_TO_COPILOT_TOOLS[tool];
    if (mapped) copilotTools.add(mapped);
  }
  return Array.from(copilotTools);
}

/**
 * Parse YAML frontmatter from a markdown file.
 * Returns the frontmatter key-value pairs and the body content.
 */
function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const fmBlock = match[1];
  const body = match[2];
  const frontmatter: Record<string, unknown> = {};

  // Simple YAML parser for our known frontmatter fields
  let currentKey = "";
  let currentArray: string[] | null = null;

  for (const line of fmBlock.split("\n")) {
    const arrayItemMatch = line.match(/^\s+-\s+(.+)/);
    if (arrayItemMatch && currentKey) {
      if (!currentArray) currentArray = [];
      currentArray.push(arrayItemMatch[1].trim());
      continue;
    }

    // Flush previous array
    if (currentArray && currentKey) {
      frontmatter[currentKey] = currentArray;
      currentArray = null;
    }

    const kvMatch = line.match(/^([a-zA-Z_-]+):\s*(.*)/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();
      if (val === "" || val === "|") {
        // Expect array or multiline on next lines
        continue;
      }
      // Remove quotes
      frontmatter[currentKey] = val.replace(/^["']|["']$/g, "");
    }
  }

  // Flush final array
  if (currentArray && currentKey) {
    frontmatter[currentKey] = currentArray;
  }

  return { frontmatter, body };
}

/**
 * Convert a Claude agent definition (.md) to Copilot agent format (.agent.md).
 * Claude frontmatter: name, description, allowed-tools
 * Copilot frontmatter: name, description, tools, model
 */
function convertAgentToCopilot(content: string): string {
  const { frontmatter, body } = parseFrontmatter(content);

  const name = (frontmatter.name as string) || "";
  const description = (frontmatter.description as string) || "";
  const claudeTools = (frontmatter["allowed-tools"] as string[]) || [];
  const copilotTools = convertToolsToCopilot(claudeTools);

  let fm = "---\n";
  if (name) fm += `name: "${name}"\n`;
  if (description) fm += `description: "${description}"\n`;
  if (copilotTools.length > 0) {
    fm += "tools:\n";
    for (const tool of copilotTools) {
      fm += `  - ${tool}\n`;
    }
  }
  fm += "---\n";

  // Truncate body to 30,000 chars (Copilot limit)
  const truncatedBody = body.length > 30000 ? body.substring(0, 30000) : body;

  return fm + truncatedBody;
}

/**
 * Convert a Claude command (.md) to Copilot prompt format (.prompt.md).
 * Claude frontmatter: name, description, argument-hint, allowed-tools, disable-model-invocation
 * Copilot frontmatter: description, tools, agent (optional)
 */
function convertCommandToCopilot(content: string): string {
  const { frontmatter, body } = parseFrontmatter(content);

  const description = (frontmatter.description as string) || "";
  const claudeTools = (frontmatter["allowed-tools"] as string[]) || [];
  const copilotTools = convertToolsToCopilot(claudeTools);

  let fm = "---\n";
  if (description) fm += `description: "${description}"\n`;
  if (copilotTools.length > 0) {
    fm += "tools:\n";
    for (const tool of copilotTools) {
      fm += `  - ${tool}\n`;
    }
  }
  fm += "---\n";

  return fm + body;
}

/**
 * Convert a Cursor rule (.mdc) to Copilot instructions format (.instructions.md).
 * Cursor frontmatter: description, globs, alwaysApply
 * Copilot frontmatter: description, applyTo
 */
function convertRuleToCopilotInstruction(content: string): string {
  const { frontmatter, body } = parseFrontmatter(content);

  const description = (frontmatter.description as string) || "";
  const globs = frontmatter.globs;
  const alwaysApply = frontmatter.alwaysApply;

  let fm = "---\n";
  if (description) fm += `description: "${description}"\n`;

  // Convert globs to applyTo
  if (alwaysApply === "true" || alwaysApply === true) {
    fm += 'applyTo: "**/*"\n';
  } else if (Array.isArray(globs) && globs.length > 0) {
    // Clean glob strings (remove surrounding brackets/quotes if present)
    const cleanGlobs = globs.map((g: string) =>
      g.replace(/^\["|"\]$/g, "").replace(/^["']|["']$/g, "").replace(/,\s*$/, "")
    );
    if (cleanGlobs.length === 1) {
      fm += `applyTo: "${cleanGlobs[0]}"\n`;
    } else {
      fm += `applyTo: "${cleanGlobs.join(",")}"\n`;
    }
  } else {
    fm += 'applyTo: "**/*"\n';
  }

  fm += "---\n";

  return fm + body;
}

/**
 * Generate a Copilot hooks JSON file for .github/hooks/.
 * Maps to the Claude hooks that are installed (context-monitor, security-gate).
 */
function generateCopilotHooksJson(hooksDir: string): string {
  const hookPath = hooksDir.replace(/\\/g, "/");
  const hooks: Record<string, unknown[]> = {
    postToolUse: [
      {
        type: "command",
        bash: `node "${hookPath}/context-monitor.cjs"`,
        timeoutSec: 5,
      },
    ],
    sessionStart: [
      {
        type: "command",
        bash: `node "${hookPath}/update-check.cjs"`,
        timeoutSec: 10,
      },
    ],
  };

  return JSON.stringify({ hooks }, null, 2);
}

/**
 * Install agent definitions to Copilot (.github/agents/) with format conversion.
 * Converts Claude agent frontmatter to Copilot agent frontmatter.
 */
function installAgentDefsToCopilot(
  agent: AgentConfig,
  projectDir: string
): number {
  if (!agent.agentsDir) return 0;

  const srcDir = join(PACKAGE_ROOT, "agents");
  if (!existsSync(srcDir)) return 0;

  const targetDir = join(projectDir, agent.agentsDir);
  ensureDir(targetDir);

  let installed = 0;
  const agentFiles = readdirSync(srcDir).filter((f: string) => f.endsWith(".md"));

  for (const file of agentFiles) {
    const content = readFileSync(join(srcDir, file), "utf-8");
    const converted = convertAgentToCopilot(content);
    const targetFile = file.replace(/\.md$/, ".agent.md");
    writeFileSync(join(targetDir, targetFile), converted);
    installed++;
  }

  return installed;
}

/**
 * Install commands to Copilot (.github/prompts/) with format conversion.
 * Converts Claude command frontmatter to Copilot prompt frontmatter.
 */
function installCommandsToCopilot(
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
    (f: string) => f.endsWith(".md") && !statSync(join(srcDir, f)).isDirectory()
  );

  for (const file of commandFiles) {
    const content = readFileSync(join(srcDir, file), "utf-8");
    const converted = convertCommandToCopilot(content);
    const targetFile = file.replace(/\.md$/, ".prompt.md");
    writeFileSync(join(targetDir, targetFile), converted);
    installed++;
  }

  return installed;
}

/**
 * Install rules to Copilot (.github/instructions/) with format conversion.
 * Converts Cursor rule frontmatter to Copilot instructions frontmatter.
 */
function installRulesToCopilotInstructions(
  agent: AgentConfig,
  projectDir: string
): number {
  if (!agent.rulesDir) return 0;

  const srcDir = join(PACKAGE_ROOT, "cursor-rules");
  if (!existsSync(srcDir)) return 0;

  const targetDir = join(projectDir, agent.rulesDir);
  ensureDir(targetDir);

  let installed = 0;
  const ruleFiles = readdirSync(srcDir).filter((f: string) => f.endsWith(".mdc"));

  for (const file of ruleFiles) {
    const content = readFileSync(join(srcDir, file), "utf-8");
    const converted = convertRuleToCopilotInstruction(content);
    const targetFile = file.replace(/\.mdc$/, ".instructions.md");
    writeFileSync(join(targetDir, targetFile), converted);
    installed++;
  }

  return installed;
}

/**
 * Install hooks for Copilot (.github/hooks/).
 * Copies hook JS files and generates a hooks JSON config.
 */
function installCopilotHooks(
  agent: AgentConfig,
  projectDir: string
): number {
  if (!agent.hooksDir) return 0;

  const hooksSrc = join(PACKAGE_ROOT, "hooks");
  if (!existsSync(hooksSrc)) return 0;

  const targetDir = join(projectDir, agent.hooksDir);
  ensureDir(targetDir);

  let installed = 0;

  // Copy hook JS files
  const hookFiles = readdirSync(hooksSrc).filter((f: string) => f.endsWith(".cjs") || f.endsWith(".js"));
  for (const file of hookFiles) {
    copyFileSync(join(hooksSrc, file), join(targetDir, file));
    installed++;
  }

  // Generate hooks JSON config
  const hooksJson = generateCopilotHooksJson(targetDir);
  writeFileSync(join(targetDir, "skills-hooks.json"), hooksJson);
  installed++;

  return installed;
}

// ─── Platform-Specific Rules Conversion ───────────────────────────────────────
// Converts cursor-rules (.mdc) to platform-specific rule formats.

/**
 * Convert a Cursor rule (.mdc) to Windsurf rule format (.md).
 * Windsurf frontmatter: description, globs, alwaysApply
 * Same as Cursor but uses .md extension instead of .mdc.
 */
function convertRuleToWindsurf(content: string): string {
  // Windsurf uses the same frontmatter format as Cursor — just pass through
  return content;
}

/**
 * Convert a Cursor rule (.mdc) to Cline rule format (.md).
 * Cline frontmatter: paths (glob array)
 */
function convertRuleToCline(content: string): string {
  const { frontmatter, body } = parseFrontmatter(content);

  const description = (frontmatter.description as string) || "";
  const globs = frontmatter.globs;
  const alwaysApply = frontmatter.alwaysApply;

  let fm = "---\n";
  if (description) fm += `description: "${description}"\n`;

  // Convert globs to paths array
  if (alwaysApply === "true" || alwaysApply === true) {
    fm += "paths:\n  - \"**/*\"\n";
  } else if (Array.isArray(globs) && globs.length > 0) {
    fm += "paths:\n";
    for (const g of globs) {
      const clean = (g as string).replace(/^\["|"\]$/g, "").replace(/^["']|["']$/g, "").replace(/,\s*$/, "");
      fm += `  - "${clean}"\n`;
    }
  } else {
    fm += "paths:\n  - \"**/*\"\n";
  }

  fm += "---\n";
  return fm + body;
}

/**
 * Convert a Cursor rule (.mdc) to Roo/Kilo rule format (.md).
 * Roo uses plain .md files in .roo/rules-code/ — no frontmatter needed.
 */
function convertRuleToRoo(content: string): string {
  const { body } = parseFrontmatter(content);
  return body.trim() + "\n";
}

/**
 * Convert a Cursor rule (.mdc) to Augment rule format (.md).
 * Augment frontmatter: description, type (Always/Manual/Auto)
 */
function convertRuleToAugment(content: string): string {
  const { frontmatter, body } = parseFrontmatter(content);

  const description = (frontmatter.description as string) || "";
  const alwaysApply = frontmatter.alwaysApply;

  let fm = "---\n";
  if (description) fm += `description: "${description}"\n`;
  fm += `type: ${alwaysApply === "true" || alwaysApply === true ? "Always" : "Auto"}\n`;
  fm += "---\n";

  return fm + body;
}

/**
 * Convert a Cursor rule (.mdc) to Continue rule format (.md).
 * Continue frontmatter: name, globs
 */
function convertRuleToContinue(content: string, fileName: string): string {
  const { frontmatter, body } = parseFrontmatter(content);

  const globs = frontmatter.globs;
  const alwaysApply = frontmatter.alwaysApply;
  const name = fileName.replace(/\.mdc$/, "").replace(/\.md$/, "");

  let fm = "---\n";
  fm += `name: "${name}"\n`;

  if (alwaysApply === "true" || alwaysApply === true) {
    fm += "globs:\n  - \"**/*\"\n";
  } else if (Array.isArray(globs) && globs.length > 0) {
    fm += "globs:\n";
    for (const g of globs) {
      const clean = (g as string).replace(/^\["|"\]$/g, "").replace(/^["']|["']$/g, "").replace(/,\s*$/, "");
      fm += `  - "${clean}"\n`;
    }
  }

  fm += "---\n";
  return fm + body;
}

/**
 * Install rules to a platform with format conversion.
 * Reads from cursor-rules/ source and converts to the target format.
 */
function installPlatformRulesToAgent(
  agent: AgentConfig,
  projectDir: string
): number {
  if (!agent.rulesDir || !agent.rulesFormat) return 0;

  const srcDir = join(PACKAGE_ROOT, "cursor-rules");
  if (!existsSync(srcDir)) return 0;

  const targetDir = join(projectDir, agent.rulesDir);
  ensureDir(targetDir);

  let installed = 0;
  const ruleFiles = readdirSync(srcDir).filter((f: string) => f.endsWith(".mdc"));

  for (const file of ruleFiles) {
    const content = readFileSync(join(srcDir, file), "utf-8");
    let converted: string;
    let targetFile: string;

    switch (agent.rulesFormat) {
      case "mdc":
        // Cursor: keep as .mdc
        converted = content;
        targetFile = file;
        break;
      case "windsurf":
        converted = convertRuleToWindsurf(content);
        targetFile = file.replace(/\.mdc$/, ".md");
        break;
      case "cline":
        converted = convertRuleToCline(content);
        targetFile = file.replace(/\.mdc$/, ".md");
        break;
      case "roo":
      case "kilo":
        converted = convertRuleToRoo(content);
        targetFile = file.replace(/\.mdc$/, ".md");
        break;
      case "augment":
        converted = convertRuleToAugment(content);
        targetFile = file.replace(/\.mdc$/, ".md");
        break;
      case "continue":
        converted = convertRuleToContinue(content, file);
        targetFile = file.replace(/\.mdc$/, ".md");
        break;
      default:
        // Fallback: copy as-is
        converted = content;
        targetFile = file;
    }

    writeFileSync(join(targetDir, targetFile), converted);
    installed++;
  }

  return installed;
}

// ─── AGENTS.md Generation ─────────────────────────────────────────────────────
// Universal entry point file for platforms that read AGENTS.md.

function generateAgentsMd(agent: AgentConfig): string {
  const skillsPath = agent.localDir;

  return `# Skills by Amrit

> An agentic skills framework that makes AI assistants think like senior staff engineers.

You have a library of composable skills installed in \`${skillsPath}/\`. Before any task, check if a relevant skill exists. Skills are not suggestions — they are mandatory workflows when their activation conditions are met.

**Check skills before:**
- Writing any code
- Debugging any issue
- Reviewing any PR
- Auditing any system
- Planning any feature
- Refactoring any module

## Core Principles

Read the \`_rules\` skill in \`${skillsPath}/_rules/SKILL.md\` for core principles, anti-hallucination protocol, and severity framework.

**The three non-negotiables:**
1. **Evidence before claims** — Never say "done" without verification
2. **Root cause before fixes** — Never patch symptoms
3. **Plan before code** — Never start coding without understanding what you're building

## Skill Activation

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
| Adding code to existing codebase | \`codebase-conformity\` |
| Creating new skills | \`writing-skills\` |
| Discovering skills | \`using-skills\` |

## Anti-Hallucination Protocol

1. **Never fabricate** — If you don't know, say so
2. **Never assume** — Verify file existence, function signatures, variable names
3. **Never extrapolate** — Read the actual code, don't guess from names
4. **Never claim completion without evidence** — Run the command, read the output

## Severity Framework

| Level | Label | Meaning |
|-------|-------|---------|
| 🔴 | Critical | Production risk, security vulnerability, data loss potential |
| 🟠 | High | Must fix before next deploy |
| 🟡 | Medium | Technical debt, fix within sprint |
| 🟢 | Low | Improvement opportunity, backlog |
| ⚪ | Info | Observation, no action needed |

## Persistent Memory

If \`.planning/MEMORY.md\` exists, read it at session start and update it at session end. This provides cross-session context. Memory is always project-local — never installed globally.
`;
}

// ─── Cursor/Windsurf Hooks.json Generation ───────────────────────────────────

/**
 * Generate hooks.json for Cursor.
 * Cursor supports: preToolUse, postToolUse, sessionStart, and more.
 */
function generateCursorHooksJson(hooksDir: string): string {
  const hookPath = join(hooksDir, "hooks").replace(/\\/g, "/");
  return JSON.stringify({
    hooks: {
      postToolUse: [
        {
          type: "command",
          command: `node "${hookPath}/context-monitor.cjs"`,
          timeoutSec: 5,
        },
      ],
      sessionStart: [
        {
          type: "command",
          command: `node "${hookPath}/update-check.cjs"`,
          timeoutSec: 10,
        },
      ],
    },
  }, null, 2);
}

/**
 * Generate hooks.json for Windsurf.
 * Windsurf supports: pre_write_code, post_write_code, pre_run_command, and more.
 */
function generateWindsurfHooksJson(hooksDir: string): string {
  const hookPath = join(hooksDir, "hooks").replace(/\\/g, "/");
  return JSON.stringify({
    hooks: {
      post_write_code: [
        {
          type: "command",
          command: `node "${hookPath}/context-monitor.cjs"`,
          timeoutSec: 5,
        },
      ],
    },
  }, null, 2);
}

/**
 * Install hooks.json and hook JS files for Cursor or Windsurf.
 * Copies hook source files and generates platform-specific hooks.json.
 */
function installPlatformHooks(
  agent: AgentConfig,
  projectDir: string
): number {
  if (!agent.hooksDir) return 0;
  // Skip Claude Code and Copilot — they have their own hook registration
  if (agent.name === "claude-code" || agent.name === "github-copilot") return 0;

  const hooksSrc = join(PACKAGE_ROOT, "hooks");
  if (!existsSync(hooksSrc)) return 0;

  const targetBase = join(projectDir, agent.hooksDir);
  const hooksTargetDir = join(targetBase, "hooks");
  ensureDir(hooksTargetDir);

  let installed = 0;

  // Copy hook JS files
  const hookFiles = readdirSync(hooksSrc).filter((f: string) => f.endsWith(".cjs") || f.endsWith(".js"));
  for (const file of hookFiles) {
    copyFileSync(join(hooksSrc, file), join(hooksTargetDir, file));
    installed++;
  }

  // Generate platform-specific hooks.json
  let hooksJson: string;
  if (agent.name === "cursor") {
    hooksJson = generateCursorHooksJson(targetBase);
  } else if (agent.name === "windsurf") {
    hooksJson = generateWindsurfHooksJson(targetBase);
  } else {
    return installed;
  }

  writeFileSync(join(targetBase, "hooks.json"), hooksJson);
  installed++;

  return installed;
}

// ─── .roomodes Generation ─────────────────────────────────────────────────────
// Generates mode definitions for Roo Code and Kilo Code.

function generateRoomodes(): string {
  const modes = {
    customModes: [
      {
        slug: "skills-architect",
        name: "Skills Architect",
        roleDefinition: "You are a senior staff engineer with access to a composable skills framework. Before any task, check .roo/skills/ for a relevant skill. Skills are mandatory workflows — not suggestions.",
        groups: ["read", "edit", "command"],
        customInstructions: "Always read the _rules skill first. Follow the anti-hallucination protocol. Use the severity framework for all findings.",
      },
      {
        slug: "skills-auditor",
        name: "Skills Auditor",
        roleDefinition: "You are a thorough auditor who uses skills for systematic code review, security analysis, and architecture evaluation. Every finding must have evidence.",
        groups: ["read", "command"],
        customInstructions: "Use security-audit, architecture-audit, and code-review skills. Report findings with severity levels. Never claim completion without verification.",
      },
      {
        slug: "skills-debugger",
        name: "Skills Debugger",
        roleDefinition: "You are a systematic debugger who follows the debugging skill methodology. Reproduce, isolate, root-cause, then fix. Never patch symptoms.",
        groups: ["read", "edit", "command"],
        customInstructions: "Use systematic-debugging skill. Follow the 5-step protocol: reproduce, isolate, root-cause, fix, verify.",
      },
    ],
  };

  return JSON.stringify(modes, null, 2) + "\n";
}

/**
 * Install .roomodes file for Roo Code or Kilo Code.
 */
function installModesFile(
  agent: AgentConfig,
  projectDir: string
): boolean {
  if (!agent.modesFile) return false;

  const targetPath = join(projectDir, agent.modesFile);

  // Don't overwrite existing modes file — user may have customized it
  if (existsSync(targetPath)) return false;

  writeFileSync(targetPath, generateRoomodes());
  return true;
}

// ─── .goosehints Generation ───────────────────────────────────────────────────
// Generates plain text hints file for Goose.

function generateGoosehints(agent: AgentConfig): string {
  const skillsPath = agent.localDir;

  return `# Skills by Amrit — Project Instructions

You have composable skills installed in ${skillsPath}/. Before any task, check if a relevant skill exists.

## Core Principles
- Evidence before claims: Never say "done" without verification
- Root cause before fixes: Never patch symptoms
- Plan before code: Never start coding without understanding what you're building

## Skill Activation
- New feature: use brainstorming, writing-plans, executing-plans skills
- Bug report: use systematic-debugging skill
- Code review: use code-review skill
- Audit: use architecture-audit, security-audit, performance-audit skills
- Tests: use test-driven-development skill
- Before saying "done": use verification-before-completion skill
- Changing code: use refactoring-safely skill

## Anti-Hallucination Protocol
- Never fabricate: If you don't know, say so
- Never assume: Verify file existence, function signatures, variable names
- Never extrapolate: Read the actual code, don't guess from names
- Never claim completion without evidence: Run the command, read the output

## Rules
Read ${skillsPath}/_rules/SKILL.md for the full foundation rules.

## Memory
If .planning/MEMORY.md exists, read it at session start and update at session end.
`;
}

/**
 * Install .goosehints file for Goose.
 */
function installHintsFile(
  agent: AgentConfig,
  projectDir: string
): boolean {
  if (!agent.hintsFile) return false;

  const targetPath = join(projectDir, agent.hintsFile);

  // Don't overwrite — user may have customized
  if (existsSync(targetPath)) return false;

  writeFileSync(targetPath, generateGoosehints(agent));
  return true;
}

// ─── Continue Prompts Conversion ──────────────────────────────────────────────
// Converts Claude commands to Continue prompt format.

/**
 * Convert a Claude command (.md) to Continue prompt format (.prompt).
 * Continue frontmatter: name, description, invokable: true
 */
function convertCommandToContinue(content: string, fileName: string): string {
  const { frontmatter, body } = parseFrontmatter(content);

  const name = fileName.replace(/\.md$/, "");
  const description = (frontmatter.description as string) || "";

  let fm = "---\n";
  fm += `name: "${name}"\n`;
  if (description) fm += `description: "${description}"\n`;
  fm += "invokable: true\n";
  fm += "---\n";

  return fm + body;
}

/**
 * Install commands as Continue prompts (.continue/prompts/).
 */
function installCommandsToContinue(
  agent: AgentConfig,
  projectDir: string
): number {
  if (!agent.commandsDir || agent.name !== "continue") return 0;

  const srcDir = join(PACKAGE_ROOT, "commands");
  if (!existsSync(srcDir)) return 0;

  const targetDir = join(projectDir, agent.commandsDir);
  ensureDir(targetDir);

  let installed = 0;
  const commandFiles = readdirSync(srcDir).filter(
    (f: string) => f.endsWith(".md") && !statSync(join(srcDir, f)).isDirectory()
  );

  for (const file of commandFiles) {
    const content = readFileSync(join(srcDir, file), "utf-8");
    const converted = convertCommandToContinue(content, file);
    const targetFile = file.replace(/\.md$/, ".prompt");
    writeFileSync(join(targetDir, targetFile), converted);
    installed++;
  }

  return installed;
}

// ─── Unified Asset Installation ───────────────────────────────────────────────

function installAllAssetsToAgent(
  agent: AgentConfig,
  skillNames: string[],
  projectDir: string,
  isGlobal: boolean
): InstallResult {
  const skillResult = installSkillsToAgent(agent, skillNames, projectDir, isGlobal);

  // GitHub Copilot uses converted formats for agents, commands, rules, and hooks
  const isCopilot = agent.name === "github-copilot";

  let commands = 0;
  let agents = 0;
  let rules = 0;

  if (!isGlobal) {
    if (isCopilot) {
      commands = installCommandsToCopilot(agent, projectDir);
      agents = installAgentDefsToCopilot(agent, projectDir);
      rules = installRulesToCopilotInstructions(agent, projectDir);
      installCopilotHooks(agent, projectDir);
    } else if (agent.name === "continue") {
      // Continue uses its own prompt format for commands
      commands = installCommandsToContinue(agent, projectDir);
      agents = installAgentDefsToAgent(agent, projectDir);
      rules = installPlatformRulesToAgent(agent, projectDir);
    } else if (agent.rulesFormat && agent.rulesFormat !== "mdc") {
      // Platforms with custom rules formats (Windsurf, Cline, Roo, Augment, Kilo)
      commands = installCommandsToAgent(agent, projectDir);
      agents = installAgentDefsToAgent(agent, projectDir);
      rules = installPlatformRulesToAgent(agent, projectDir);
    } else {
      commands = installCommandsToAgent(agent, projectDir);
      agents = installAgentDefsToAgent(agent, projectDir);
      rules = installCursorRulesToAgent(agent, projectDir);
    }

    // Install platform hooks (Cursor, Windsurf)
    installPlatformHooks(agent, projectDir);

    // Install .roomodes for Roo/Kilo
    installModesFile(agent, projectDir);

    // Install .goosehints for Goose
    installHintsFile(agent, projectDir);
  }

  return {
    skillsNew: skillResult.newSkills,
    skillsUpdated: skillResult.updatedSkills,
    commands,
    workflows: isGlobal ? 0 : installWorkflowsToAgent(agent, projectDir),
    agents,
    rules,
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
    const ruleFiles = readdirSync(rulesSrc).filter((f: string) => f.endsWith(".md"));
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

// ─── File Manifest (SHA-256 hashes) ──────────────────────────────────────────
// Tracks installed file hashes for modification detection and integrity checks.

function fileHash(filePath: string): string {
  const content = readFileSync(filePath);
  return createHash("sha256").update(content).digest("hex");
}

function generateFileHashes(dir: string, baseDir?: string): Record<string, string> {
  if (!baseDir) baseDir = dir;
  const hashes: Record<string, string> = {};
  if (!existsSync(dir)) return hashes;

  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relPath = relative(baseDir, fullPath).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      Object.assign(hashes, generateFileHashes(fullPath, baseDir));
    } else {
      hashes[relPath] = fileHash(fullPath);
    }
  }
  return hashes;
}

interface FileManifest {
  version: string;
  installed_at: string;
  files: Record<string, string>;
}

function writeFileManifest(
  targetDir: string,
  version: string
): number {
  const files = generateFileHashes(targetDir);
  // Exclude the manifest file itself if it exists
  delete files[FILE_MANIFEST_NAME];

  const manifest: FileManifest = {
    version,
    installed_at: new Date().toISOString(),
    files,
  };

  writeFileSync(
    join(targetDir, FILE_MANIFEST_NAME),
    JSON.stringify(manifest, null, 2) + "\n"
  );

  return Object.keys(files).length;
}

// ─── Hook Registration (Claude Code only) ────────────────────────────────────
// Registers hooks in settings.json for Claude Code installs.
// Idempotent: won't duplicate existing hooks. Tracks for uninstall.

interface HookEntry {
  type: "command" | "prompt";
  command?: string;
  prompt?: string;
}

interface HookMatcher {
  matcher?: string;
  hooks: HookEntry[];
}

interface ClaudeSettings {
  hooks?: Record<string, HookMatcher[]>;
  statusLine?: {
    type: string;
    command: string;
  };
  [key: string]: unknown;
}

function readClaudeSettings(settingsPath: string): ClaudeSettings {
  if (existsSync(settingsPath)) {
    try {
      return JSON.parse(readFileSync(settingsPath, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

function writeClaudeSettings(settingsPath: string, settings: ClaudeSettings): void {
  ensureDir(dirname(settingsPath));
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
}

/**
 * Build a hook command path. On Windows, use the actual home path since $HOME
 * is not expanded by cmd.exe. On Unix, use ~ for portability.
 */
function buildHookPath(hooksDir: string, hookName: string): string {
  const hookPath = join(hooksDir, hookName).replace(/\\/g, "/");
  return `node "${hookPath}"`;
}

/**
 * Check if a hook event already has a hook matching the given identifier string.
 */
function hasHookCommand(
  settings: ClaudeSettings,
  event: string,
  identifier: string
): boolean {
  if (!settings.hooks?.[event]) return false;
  return settings.hooks[event].some(
    (entry) =>
      entry.hooks?.some(
        (h) =>
          (h.type === "command" && h.command?.includes(identifier)) ||
          (h.type === "prompt" && h.prompt?.includes(identifier))
      ) ?? false
  );
}

/**
 * Add a command hook to a settings event, idempotently.
 * Returns true if the hook was added (not already present).
 */
function addCommandHook(
  settings: ClaudeSettings,
  event: string,
  command: string,
  identifier: string,
  matcher?: string
): boolean {
  if (hasHookCommand(settings, event, identifier)) return false;

  if (!settings.hooks) settings.hooks = {};
  if (!settings.hooks[event]) settings.hooks[event] = [];

  const entry: HookMatcher = {
    hooks: [{ type: "command", command }],
  };
  if (matcher) entry.matcher = matcher;

  settings.hooks[event].push(entry);
  return true;
}

/**
 * Add a prompt hook to a settings event, idempotently.
 * Returns true if the hook was added (not already present).
 */
function addPromptHook(
  settings: ClaudeSettings,
  event: string,
  prompt: string,
  identifier: string,
  matcher?: string
): boolean {
  if (hasHookCommand(settings, event, identifier)) return false;

  if (!settings.hooks) settings.hooks = {};
  if (!settings.hooks[event]) settings.hooks[event] = [];

  const entry: HookMatcher = {
    hooks: [{ type: "prompt", prompt }],
  };
  if (matcher) entry.matcher = matcher;

  settings.hooks[event].push(entry);
  return true;
}

/**
 * Remove all hooks containing the identifier from settings.
 * Used during uninstall to clean up registered hooks.
 */
function removeHooksByIdentifier(
  settings: ClaudeSettings,
  identifier: string
): number {
  if (!settings.hooks) return 0;

  let removed = 0;
  for (const event of Object.keys(settings.hooks)) {
    const before = settings.hooks[event].length;
    settings.hooks[event] = settings.hooks[event].filter(
      (entry) =>
        !entry.hooks?.some(
          (h) =>
            (h.command?.includes(identifier) ?? false) ||
            (h.prompt?.includes(identifier) ?? false)
        )
    );
    removed += before - settings.hooks[event].length;

    // Clean up empty event arrays
    if (settings.hooks[event].length === 0) {
      delete settings.hooks[event];
    }
  }

  // Clean up empty hooks object
  if (Object.keys(settings.hooks).length === 0) {
    delete settings.hooks;
  }

  return removed;
}

interface HookRegistrationResult {
  registered: string[];
  skipped: string[];
  hooksDir: string;
}

/**
 * Copy hook source files and register hooks in Claude Code settings.json.
 * Only called for claude-code agent installs.
 */
function registerClaudeHooks(
  agent: AgentConfig,
  projectDir: string,
  isGlobal: boolean,
  forceStatusline: boolean
): HookRegistrationResult {
  const result: HookRegistrationResult = {
    registered: [],
    skipped: [],
    hooksDir: "",
  };

  // Determine target directories
  const configBase = isGlobal
    ? agent.globalDir.replace(/[/\\]skills$/, "")
    : join(projectDir, agent.localDir.replace(/[/\\]skills$/, ""));

  const hooksDir = join(configBase, "hooks");
  const settingsPath = join(configBase, "settings.json");
  result.hooksDir = hooksDir;

  // Copy hook files from package hooks/ directory
  const hooksSrc = join(PACKAGE_ROOT, "hooks");
  if (!existsSync(hooksSrc)) return result;

  ensureDir(hooksDir);

  const hookFiles = readdirSync(hooksSrc).filter((f: string) => f.endsWith(".cjs") || f.endsWith(".js"));
  for (const file of hookFiles) {
    copyFileSync(join(hooksSrc, file), join(hooksDir, file));
  }

  // Read/create settings.json
  const settings = readClaudeSettings(settingsPath);

  // Register PostToolUse hooks: context-monitor
  const contextMonitorCmd = buildHookPath(hooksDir, "context-monitor.cjs");
  if (addCommandHook(settings, "PostToolUse", contextMonitorCmd, "context-monitor")) {
    result.registered.push("context-monitor");
  } else {
    result.skipped.push("context-monitor");
  }

  // Register SessionStart hook: update-check
  const updateCheckCmd = buildHookPath(hooksDir, "update-check.cjs");
  if (addCommandHook(settings, "SessionStart", updateCheckCmd, "update-check")) {
    result.registered.push("update-check");
  } else {
    result.skipped.push("update-check");
  }

  // Register PreCompact hook: memory capture (prompt-based)
  const memoryPromptSrc = join(hooksSrc, "memory-capture.md");
  if (existsSync(memoryPromptSrc)) {
    const memoryPrompt = readFileSync(memoryPromptSrc, "utf-8").trim();
    if (addPromptHook(settings, "PreCompact", memoryPrompt, "memory", "*")) {
      result.registered.push("memory-capture");
    } else {
      result.skipped.push("memory-capture");
    }
  }

  // Register statusline (PreInputSanitization)
  const statuslineCmd = buildHookPath(hooksDir, "statusline.cjs");
  const hasExistingStatusline = settings.statusLine != null;

  if (!hasExistingStatusline || forceStatusline) {
    settings.statusLine = {
      type: "command",
      command: statuslineCmd,
    };
    result.registered.push("statusline");
  } else {
    result.skipped.push("statusline");
  }

  // Write settings.json
  writeClaudeSettings(settingsPath, settings);

  return result;
}

// ─── Attribution Handling ────────────────────────────────────────────────────
// Stores attribution preference alongside installed config.

interface AttributionConfig {
  enabled: boolean;
  footer: string;
}

function getAttributionConfig(enabled: boolean): AttributionConfig {
  return {
    enabled,
    footer: enabled
      ? "Co-Authored-By: Skills by Amrit <skills@amrit.dev>"
      : "",
  };
}

function writeAttributionConfig(
  projectDir: string,
  agent: AgentConfig,
  isGlobal: boolean,
  attribution: AttributionConfig
): void {
  const configBase = isGlobal
    ? agent.globalDir.replace(/[/\\]skills$/, "")
    : join(projectDir, agent.localDir.replace(/[/\\]skills$/, ""));

  const configPath = join(configBase, "skills-attribution.json");
  writeFileSync(
    configPath,
    JSON.stringify(attribution, null, 2) + "\n"
  );
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

  // Write install manifest (local installs only)
  if (!flags.global) {
    writeManifest(projectDir, targetAgents, toInstall.length, flags.global);
  }

  // ─── Post-install: File manifest, hooks, attribution ───────────────────────

  // Track per-agent file manifest counts
  let totalManifestFiles = 0;

  // Track hook registration results across agents
  let hookResult: HookRegistrationResult | null = null;

  // Attribution config
  const attribution = getAttributionConfig(flags.attribution);

  for (const agent of targetAgents) {
    const targetPath = flags.global
      ? agent.globalDir
      : join(projectDir, agent.localDir);

    // 1. Write file manifest (SHA-256 hashes) to each agent's target directory
    const manifestCount = writeFileManifest(targetPath, version);
    totalManifestFiles += manifestCount;

    // 2. Register hooks (Claude Code only — other runtimes don't support hooks)
    if (agent.name === "claude-code") {
      hookResult = registerClaudeHooks(agent, projectDir, flags.global, flags.forceStatusline);
    }

    // 3. Write attribution config
    if (agent.name === "claude-code") {
      writeAttributionConfig(projectDir, agent, flags.global, attribution);
    }
  }

  // ─── Enhanced Install Summary ──────────────────────────────────────────────

  log("");
  logHeader("Installation Complete");

  const totalSkills = totals.skillsNew + totals.skillsUpdated;

  // Line 1: Asset counts
  const assetParts: string[] = [];
  if (totalSkills > 0) assetParts.push(`${totalSkills} skills`);
  if (totals.commands > 0) assetParts.push(`${totals.commands} commands`);
  if (totals.workflows > 0) assetParts.push(`${totals.workflows} workflows`);
  if (totals.agents > 0) assetParts.push(`${totals.agents} agents`);
  if (totals.rules > 0) assetParts.push(`${totals.rules} rules`);
  if (assetParts.length > 0) {
    logOk(`Installed ${assetParts.join(", ")}`);
  }

  // Line 2: Hooks registered (if Claude Code was a target)
  if (hookResult && hookResult.registered.length > 0) {
    logOk(`Registered hooks (${hookResult.registered.join(", ")})`);
  }
  if (hookResult && hookResult.skipped.length > 0) {
    logWarn(`Hooks already registered: ${hookResult.skipped.join(", ")}`);
  }

  // Line 3: File manifest
  if (totalManifestFiles > 0) {
    logOk(`Wrote file manifest (${totalManifestFiles} files tracked)`);
  }

  // Line 4: Attribution
  if (flags.attribution) {
    logOk(`Configured attribution`);
  } else {
    logInfo(`Attribution disabled (use --attribution to enable)`);
  }

  // Line 5: Version
  log(`   ${C.dim}v${version} · ${flags.global ? "Global" : "Local"} scope · ${targetAgents.length} agent(s)${C.reset}`);

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
  const agentsExists = existsSync(join(projectDir, "AGENTS.md"));
  const planningExists = existsSync(join(projectDir, ".planning", "MEMORY.md"));

  log("");
  log(`  ${C.bold}Entry points:${C.reset}`);
  log(`    CLAUDE.md: ${claudeExists ? `${C.green}present${C.reset}` : `${C.dim}not found${C.reset}`}`);
  log(`    GEMINI.md: ${geminiExists ? `${C.green}present${C.reset}` : `${C.dim}not found${C.reset}`}`);
  log(`    AGENTS.md: ${agentsExists ? `${C.green}present${C.reset}` : `${C.dim}not found${C.reset}`}`);
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
  ${C.yellow}--attribution${C.reset}         Enable Co-Authored-By footer (default: on)
  ${C.yellow}--no-attribution${C.reset}      Disable Co-Authored-By footer
  ${C.yellow}--force-statusline${C.reset}    Overwrite existing statusline config

${C.bold}INSTALL BEHAVIOR${C.reset}

  ${C.bold}Skills:${C.reset}       Copied to agent skill directory. Re-running updates existing skills.
  ${C.bold}CLAUDE.md:${C.reset}    If exists, appends activation section. If already present, updates it.
  ${C.bold}GEMINI.md:${C.reset}    Same as CLAUDE.md — your existing content is always preserved.
  ${C.bold}Memory:${C.reset}       Never installed. Created at runtime per-project by the AI agent.
  ${C.bold}Hooks:${C.reset}       Registered for Claude Code only (statusline, context-monitor, update-check, memory-capture).
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
  attribution: boolean;
  forceStatusline: boolean;
}

function parseFlags(args: string[]): ParsedFlags {
  const result: ParsedFlags = {
    positional: [],
    agents: [],
    global: false,
    yes: false,
    all: false,
    attribution: true,
    forceStatusline: false,
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
    } else if (arg === "--no-attribution") {
      result.attribution = false;
    } else if (arg === "--attribution") {
      result.attribution = true;
    } else if (arg === "--force-statusline") {
      result.forceStatusline = true;
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
