# ────────────────────────────────────────────────────────
# Skills by Amrit — Docker Image
# ────────────────────────────────────────────────────────
# Packages the CLI + all assets into a container so
# users can install skills without Node.js on their host.
#
# Build:  docker build -t skills-by-amrit .
# Run:    docker run --rm -v $(pwd):/workspace skills-by-amrit add --all -a claude-code -y
# List:   docker run --rm skills-by-amrit list
# ────────────────────────────────────────────────────────

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (cache layer)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY tsconfig.json tsup.config.ts ./
COPY src/ src/
RUN npm run build

# ── Production image ──────────────────────────────────
FROM node:20-alpine

LABEL maintainer="Amritpal Singh <boparaiamrit@gmail.com>"
LABEL org.opencontainers.image.title="Skills by Amrit"
LABEL org.opencontainers.image.description="The ultimate AI agent skills framework"
LABEL org.opencontainers.image.source="https://github.com/boparaiamrit/skills-by-amrit"
LABEL org.opencontainers.image.license="MIT"

WORKDIR /app

# Copy only what's needed at runtime
COPY package.json ./
COPY --from=builder /app/dist/ dist/
COPY skills/ skills/
COPY commands/ commands/
COPY workflows/ workflows/
COPY agents/ agents/
COPY rules/ rules/
COPY cursor-rules/ cursor-rules/
COPY CLAUDE.md ./

# Workspace mount point
WORKDIR /workspace

ENTRYPOINT ["node", "/app/dist/cli.js"]
CMD ["help"]
