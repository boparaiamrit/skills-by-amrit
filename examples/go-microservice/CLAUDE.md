# Acme Orders Service — Go + gRPC + pgx + Docker + OpenTelemetry

> Order processing microservice. Handles order creation, payment orchestration, and inventory reservation via gRPC.

## Skills Integration

This project uses [skills-by-amrit](https://github.com/amrit/skills-by-amrit). Skills are installed in `.claude/skills/` and activate automatically.

**Required workflows:**
- Run `/audit` before every PR — catches missing error handling, context leaks, untraced spans
- Run `/plan` before any feature that touches the state machine or adds a new RPC
- Run `/verify` after implementing any plan — confirms every acceptance criterion
- Run `/debug` for any failing test — structured hypothesis testing, not scattered log lines
- Run `/deep-audit` on `internal/` before releases — focus on error paths and concurrency
- Use `/discuss` before adding any new service dependency or changing the proto contract

## Critical Rules

### Error Handling — Violations Are Blockers

1. **Never panic in handlers.** Use `return status.Errorf(codes.Internal, ...)` instead. A panic in a gRPC handler kills the process.
2. **Always check errors.** Every function that returns `error` MUST have its error checked. No `_ = someFunc()` for fallible operations.
3. **Wrap errors with context.** Use `fmt.Errorf("creating order: %w", err)` — never return bare errors. The call chain must be traceable.

### Context & Observability

4. **Propagate context everywhere.** Every function that does I/O MUST accept `ctx context.Context` as its first parameter. Never use `context.Background()` inside a request path.
5. **Span every external call.** Database queries, HTTP calls, and gRPC calls MUST start a child span with `otel.Tracer`. No silent network hops.
6. **Never log sensitive data.** No PII, tokens, or full credit card numbers in logs. Use structured logging (`slog`) with explicit field selection.

### Database

7. **Use pgx directly, no ORM.** Queries go through `pgxpool.Pool`. Use `pgx.NamedArgs` for parameterized queries — no `fmt.Sprintf` for SQL.
8. **Transactions for multi-step writes.** Use `pool.BeginTx(ctx, pgx.TxOptions{})` and always `defer tx.Rollback(ctx)` before the commit path.

## BAD vs GOOD

```go
// BAD: Panic in handler — kills the process on any nil pointer
func (s *Server) CreateOrder(ctx context.Context, req *pb.CreateOrderRequest) (*pb.Order, error) {
    order := s.repo.Create(req) // ignores error, panics on nil
    return order, nil
}

// GOOD: Proper error handling, context propagation, tracing
func (s *Server) CreateOrder(ctx context.Context, req *pb.CreateOrderRequest) (*pb.Order, error) {
    ctx, span := otel.Tracer("orders").Start(ctx, "CreateOrder")
    defer span.End()

    if err := req.Validate(); err != nil {
        return nil, status.Errorf(codes.InvalidArgument, "invalid request: %v", err)
    }

    order, err := s.repo.Create(ctx, req)
    if err != nil {
        span.RecordError(err)
        return nil, status.Errorf(codes.Internal, "creating order: %v", err)
    }
    return order, nil
}
```

## Project Layout

```
cmd/orders/main.go    # Entrypoint — wires dependencies, starts gRPC server
internal/
  server/             # gRPC handler implementations
  repository/         # Database access (pgx queries)
  service/            # Business logic between handler and repo
  domain/             # Domain types, value objects, enums
  config/             # Environment config (envconfig)
  telemetry/          # OpenTelemetry setup (traces, metrics)
proto/orders/v1/      # Protobuf definitions + generated code
migrations/           # golang-migrate SQL files (up/down pairs)
deploy/               # Dockerfile (multi-stage) + docker-compose.yml
```

## Testing

- **Unit tests:** `go test ./internal/...` — test services with mock repos
- **Integration tests:** `go test ./internal/repository/... -tags=integration` — uses Testcontainers for real Postgres
- **Coverage:** `go test -coverprofile=cover.out ./... && go tool cover -func=cover.out`
- **Before any PR:** `make lint test test-integration`
- Use `/verify` after test runs to confirm acceptance criteria

## Environment Variables

```bash
# .env — NEVER commit this file
DATABASE_URL=postgres://user:pass@localhost:5432/orders?sslmode=disable
GRPC_PORT=50051
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
LOG_LEVEL=info
PAYMENT_SERVICE_ADDR=localhost:50052
INVENTORY_SERVICE_ADDR=localhost:50053
```

## Conventions

- **Commits:** Conventional commits — `feat:`, `fix:`, `refactor:`. Use `/commit` to generate.
- **Branches:** `feat/`, `fix/`, `chore/` from `main`.
- **PRs:** Must pass CI (lint + test + integration + proto-check). Run `/audit` locally first.
- **New RPCs:** Update proto, regenerate, implement handler, add tests, update integration tests.
- **Migrations:** `migrate create -ext sql -dir migrations -seq <name>`. Always write both up and down.
- **Dependencies:** `go mod tidy` after any import change. No `replace` directives in committed `go.mod`.
