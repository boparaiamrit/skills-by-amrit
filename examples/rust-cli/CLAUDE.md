# Acme CLI — Rust + clap + tokio + thiserror + serde

> Developer CLI for managing Acme infrastructure. Handles deployments, secret rotation, log tailing, and config sync.

## Skills Integration

This project uses [skills-by-amrit](https://github.com/amrit/skills-by-amrit). Skills are installed in `.claude/skills/` and activate automatically.

**Required workflows:**
- Run `/audit` before every PR — catches `.unwrap()` calls, missing error variants, unsafe blocks
- Run `/plan` before any new subcommand or refactor touching the error hierarchy
- Run `/verify` after implementing any plan — confirms every acceptance criterion
- Run `/debug` for any failing test — structured root cause analysis, not trial-and-error
- Run `/deep-audit` on `src/commands/` and `src/client/` before releases
- Use `/discuss` before adding new dependencies — keep the binary lean

## Critical Rules

### Error Handling — Violations Are Blockers

1. **Never use `.unwrap()` or `.expect()` in library/command code.** Use the `?` operator with `thiserror` types. The only allowed `.unwrap()` is in tests and `main()` after final error reporting.
2. **Use `thiserror` for all error types.** Every module defines its own error enum. No `Box<dyn Error>` in public APIs. No `anyhow` in library code (only in `main.rs` as the final catch-all).
3. **Handle all `Result` and `Option` values.** No silently discarding errors. If a value is truly unused, add a comment explaining why.

### Safety & Performance

4. **No `unsafe` blocks.** This is a CLI tool, not a systems library. If you think you need unsafe, you are wrong — find a safe abstraction or a crate that provides one.
5. **No blocking in async context.** Use `tokio::fs` instead of `std::fs`. Use `tokio::process::Command` instead of `std::process::Command`. Never call `.block_on()` inside an async function.
6. **Validate all external input.** CLI args are validated by clap, but file contents, API responses, and env vars MUST be validated before use with descriptive error messages.

### API Client

7. **Never hardcode URLs or tokens.** All endpoints come from config (`~/.acme/config.toml`). Tokens come from the system keyring or env vars, never from source.
8. **Retry with backoff on transient failures.** HTTP 429, 502, 503 get exponential backoff (3 attempts max). Other errors fail immediately.

## BAD vs GOOD

```rust
// BAD: .unwrap() bombs — crashes on any API error with no context
async fn deploy(client: &Client, app: &str) -> String {
    let resp = client.post(&format!("/apps/{app}/deploy"))
        .send()
        .await
        .unwrap();
    resp.text().await.unwrap()
}

// GOOD: Typed errors, proper propagation, structured output
async fn deploy(client: &ApiClient, app: &str) -> Result<Deployment, DeployError> {
    let resp = client
        .post(&format!("/apps/{app}/deploy"))
        .send()
        .await
        .map_err(|e| DeployError::Request { app: app.into(), source: e })?;

    if !resp.status().is_success() {
        return Err(DeployError::ApiError {
            status: resp.status(),
            body: resp.text().await.unwrap_or_default(),
        });
    }

    resp.json::<Deployment>()
        .await
        .map_err(|e| DeployError::Deserialize { source: e })
}
```

## Workspace Layout

```
Cargo.toml             # Workspace root or single crate
src/
  main.rs              # Entry point — clap parse, tokio::main, error reporting
  cli.rs               # clap derive structs (Args, subcommands)
  commands/            # One file per subcommand (deploy.rs, secrets.rs, logs.rs)
  client/mod.rs        # HTTP client wrapper with retry, auth, base URL
  config/mod.rs        # Config loading, validation, defaults
  errors/mod.rs        # Top-level error enum re-exporting module errors
tests/
  cli_tests.rs         # assert_cmd integration tests (binary invocation)
  fixtures/            # Test config files, mock responses
```

## Testing

- **Unit tests:** `cargo test` — inline `#[cfg(test)]` modules in each file
- **Integration tests:** `cargo test --test cli_tests` — uses `assert_cmd` to invoke the compiled binary
- **Snapshot testing:** `insta` for command output regression tests
- **Coverage:** `cargo llvm-cov --fail-under-lines 80`
- **Before any PR:** `cargo clippy -- -D warnings && cargo test && cargo fmt --check`
- Use `/verify` after test runs to confirm acceptance criteria

## Environment Variables

```bash
# Optional — config file (~/.acme/config.toml) is preferred
ACME_API_URL=https://api.acme.dev
ACME_TOKEN=                    # DANGER: prefer keyring storage
ACME_LOG_LEVEL=info            # trace, debug, info, warn, error
```

## Conventions

- **Commits:** Conventional commits — `feat:`, `fix:`, `refactor:`. Use `/commit` to generate.
- **Branches:** `feat/`, `fix/`, `chore/` from `main`.
- **PRs:** Must pass CI (clippy + test + fmt + build). Run `/audit` locally first.
- **New subcommands:** Add variant to `cli.rs`, create handler in `commands/`, add integration test, update README.
- **Error types:** Each module owns its errors. Top-level `AppError` in `errors/mod.rs` uses `#[from]` for conversions.
- **Dependencies:** Justify any new crate in the PR description. Prefer `no-default-features` and enable only what you need.
