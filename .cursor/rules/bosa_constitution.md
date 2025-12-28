# BOSA Platform - Constitution

## ⚠️ CRITICAL VERSION BUMPING RULE (READ FIRST) ⚠️

### NEVER EVER REVERSE VERSION NUMBERS BACKWARDS

**THIS IS THE #1 MOST IMPORTANT RULE - VIOLATING THIS CAUSES SEVERE PROJECT DISRUPTION**

**The Rule:**
- **Version numbers can ONLY increase, NEVER decrease**
- **The source of truth for current version is `version.txt` file, NOT git HEAD**
- **If `version.txt` shows build number 077 and git HEAD shows 068, git hasn't been updated yet**
- **ALWAYS bump ABOVE the higher number found in `version.txt`** (NOT git HEAD)

**Examples:**
- ✅ `version.txt` shows 0.0.2.077, git shows 0.0.2.068 → bump to **0.0.2.078**
- ✅ `version.txt` shows 0.0.2.100, git shows 0.0.2.050 → bump to **0.0.2.101**
- ❌ `version.txt` shows 0.0.2.077, git shows 0.0.2.068 → bump to **0.0.2.069** ← **WRONG! VIOLATION!**

**Why This Matters:**
- Decreasing version numbers causes confusion and tracking issues
- Git HEAD may be outdated - local `version.txt` is the current state
- This rule prevents critical project management disruptions

**VIOLATION CONSEQUENCE**: Reversing version numbers is a P0 violation that causes severe project disruption. Always check `version.txt` first, never git HEAD, and always bump forward.

---

## Core Principles

### I. Radical Simplicity (ABSOLUTE)
**"WordPress for Business Apps" - If it's not this simple, it's wrong.**
- Binary installation MUST complete in under 60 seconds
- Plugin installation MUST complete in under 30 seconds
- Default configuration MUST work with ZERO editing
- Developer documentation MUST fit in AI context window (~10K tokens)
- Core kernel MUST remain under 5,000 lines of code
- Each component file MUST be under 500 lines
- If a feature requires >100 lines, it's a plugin, not core

**VIOLATION CONSEQUENCE**: Feature bloat kills adoption. Complexity is the enemy.

### II. NO CREATIVITY RULE (NON-NEGOTIABLE - NEVER VIOLATE)
**DO ONLY WHAT THE USER EXPLICITLY ASKS - NOTHING MORE**
- If user says "implement HTTP server" → Implement ONLY HTTP server. NO WebSocket "extras"
- If user says "fix database adapter" → Fix ONLY database adapter. Do NOT refactor other code
- If user says "create 3 files" → Create EXACTLY 3 files. NOT 4, NOT 5
- NEVER create "helpful" extra files, scripts, or documentation unless explicitly requested
- NEVER add "nice to have" features or "while I'm at it" improvements
- NEVER anticipate needs or be "creative" beyond the exact request
- ASK before doing ANYTHING beyond the literal request

**HISTORICAL VIOLATIONS TO AVOID**:
- Creating 10+ "helper" utilities when asked to implement one function
- Adding "comprehensive" error handling when asked for basic validation
- Creating entire plugin examples when asked for SDK function
- Refactoring working code when asked to add new feature

**THE RULE**: Read request → Do EXACTLY that → STOP → Ask before extras

### II-A. NO ASSUMPTIONS RULE (CRITICAL - NEVER VIOLATE)
**DO NOT JUMP TO CONCLUSIONS - ASK FIRST BEFORE IMPLEMENTING**

- When user asks a question → ANSWER the question. Do NOT implement solutions
- When user asks "can you help with X?" → Explain HOW you can help, then WAIT for confirmation
- When user asks about possibilities → List options, then WAIT for user to choose
- NEVER create files, scripts, or code unless user explicitly says "create", "implement", "do it"
- NEVER assume user wants automation when they ask "can you help"
- NEVER waste tokens implementing things that will be reverted

**CRITICAL PATTERN**:
1. User asks question → Answer question
2. User asks "can you do X?" → Say "Yes, I can do X by [method]. Should I proceed?"
3. User asks "is it possible?" → Say "Yes, here are the options: [list]. Which do you prefer?"
4. WAIT for explicit confirmation before creating ANY files or code

**HISTORICAL VIOLATIONS TO AVOID**:
- Creating import scripts when user asked "can you help add issues to Linear?"
- Implementing features when user asked "is it possible to do X?"
- Writing code when user asked a question about how something works
- Adding files when user asked about documentation options

**THE RULE**: Question → Answer → Wait → Confirm → Then implement

**TOKEN CONSERVATION**: Wasted tokens from reverted work = wasted money. Always confirm first.

### III. Plugin-First Architecture (MANDATORY)
Every feature beyond core (HTTP, Auth, Data, Events, Real-time) MUST be a plugin.

**Core Kernel Responsibilities (ONLY THESE):**
- HTTP/WebSocket server
- JWT authentication
- Database abstraction layer
- Event bus (in-memory → Redis)
- Plugin lifecycle management
- Static file serving
- Admin web UI (minimal)

**Everything Else is a Plugin:**
- Business logic (CRM, inventory, invoicing, etc.)
- UI components beyond admin
- Third-party integrations
- Reporting and analytics
- Custom workflows
- Email/SMS sending
- File uploads/storage

**Plugin Communication Rules:**
- Plugins CANNOT access kernel internals directly
- Plugins CANNOT communicate with each other directly
- All plugin communication via kernel APIs (REST/gRPC/WebSocket)
- All plugin interactions MUST be logged for debugging
- Plugin failures MUST NOT crash kernel

**Plugin Naming Convention:**
```
plugins/[name]-[language]/
  manifest.yaml
  [entry-file].[ext]
  migrations/
  templates/
  static/
```

Examples: `crm-php`, `inventory-js`, `analytics-py`, `pos-lua`

### IV. Multi-Language Support (REQUIRED)
Plugins MUST be writable in ANY language the developer prefers.

**Tier 1 Support (Built-in):**
- **Lua**: Embedded runtime, sandboxed, ~5MB overhead
- **JavaScript/Node.js**: Process isolation, npm ecosystem
- **PHP**: php-fpm process, composer packages
- **Python**: Process isolation, pip packages
- **Go**: Native binary compilation

**Tier 2 Support (Docker):**
- Ruby, Rust, Java, C#, etc. via Docker containers

**SDK Requirements:**
- Each language MUST have official SDK: `bosa-sdk-[lang]`
- SDKs MUST provide identical API surface (parity required)
- SDKs MUST handle serialization/connection automatically
- SDKs MUST include TypeScript/JSDoc for IDE support

**Plugin API Contract:**
```
Database:
  - query(table).where().orderBy().limit().get()
  - query(table).insert(data)
  - query(table).update(data)
  - query(table).delete()
  - transaction(callback)

Events:
  - publish(type, data)
  - subscribe(type, handler)

Real-time:
  - broadcast(channel, message)
  - sendToUser(userId, message)
  - presence(channel)
  - join(channel, metadata)

HTTP:
  - route(method, path, handler)
  - request.body, request.params, request.query
  - response.json(), response.render()
```

### V. Multi-Database Abstraction (MANDATORY)
Database layer MUST be completely abstracted - plugins NEVER write database-specific SQL.

**Supported Databases (Adapters Required):**
- SQLite (default - zero config)
- PostgreSQL (production standard)
- MySQL/MariaDB (web hosting compatibility)
- MongoDB (document store optional)

**Repository Pattern Requirements:**
- All database access through `DatabaseAdapter` interface
- Query builder MUST work identically across all databases
- Migrations MUST be database-agnostic SQL
- Connection pooling managed by kernel
- Transactions MUST work across all adapters

**Adapter Interface (Go):**
```go
type DatabaseAdapter interface {
    Connect(config) error
    Close() error
    Query(table string) QueryBuilder
    Execute(sql string, args ...interface{}) (Result, error)
    Migrate(migrations []Migration) error
    BeginTransaction() (Transaction, error)
}
```

**Plugin Usage (Language-Agnostic API):**
```javascript
// Same code works with SQLite, Postgres, MySQL, MongoDB
const customers = await bosa.db.query('customers')
    .where('status', '=', 'active')
    .orderBy('created_at', 'desc')
    .limit(50)
    .get();
```

**Database Migration Rules:**
- Migrations MUST be sequential numbered files: `001_initial.sql`, `002_add_columns.sql`
- Migrations MUST support up AND down (rollback)
- Schema changes MUST be tested on ALL supported databases
- NEVER use database-specific features unless in adapter code
- Migration from SQLite → Postgres MUST be one command: `bosa db migrate --to postgres`

### VI. Real-Time First (REQUIRED)
Real-time capabilities MUST be built into kernel, not bolted on later.

**WebSocket Server Requirements:**
- Sub-50ms event propagation (p95 target)
- Support 10,000+ concurrent connections per instance
- Automatic reconnection with exponential backoff
- Graceful fallback: WebSocket → SSE → Long-polling
- Channel-based pub/sub with presence detection

**Real-Time Features (Built-in):**
- Event broadcasting to channels
- User-specific messaging
- Presence tracking (who's online)
- Typing indicators
- Live data synchronization

**Plugin Real-Time API:**
```php
// Broadcast to all clients on channel
$bosa->realtime->broadcast('dashboard', [
    'type' => 'data.updated',
    'data' => $newData
]);

// Get presence info
$viewers = $bosa->realtime->presence('customer.123');
```

**Performance Targets:**
- Event latency: <50ms p95
- Message throughput: 50,000 msg/s per instance
- Memory per connection: <10KB
- Reconnection time: <2s

### VII. Test-First Development (NON-NEGOTIABLE)
**TDD Mandatory: Tests → User Approval → Fail → Implement → Pass**

**Testing Pyramid:**
```
         E2E Tests (5%)
       Integration Tests (15%)
     Unit Tests (80%)
```

**Unit Testing (Go):**
- Every function MUST have test
- Table-driven tests preferred
- Mocks for external dependencies
- Coverage target: 85%+

**Integration Testing:**
- Database adapters tested on ALL supported DBs
- Plugin SDK tested in ALL supported languages
- WebSocket tested with 1000+ concurrent connections
- API endpoints tested with realistic payloads

**E2E Testing:**
- Critical paths: install → start → create plugin → deploy
- Real browser tests with Playwright/Cypress
- Multi-browser: Chrome, Firefox, Safari
- Mobile responsive testing

**CI/CD Requirements:**
- All tests MUST pass before merge
- No manual testing as gate for deployment
- Automated benchmarks on every PR
- Performance regression = failed build

**Test File Organization:**
```
internal/core/
  server.go
  server_test.go      # Unit tests
  
tests/
  integration/
    database_test.go   # All DB adapters
    plugins_test.go    # Multi-language plugins
  e2e/
    install_test.go
    plugin_lifecycle_test.go
```

### VIII. Go-First Kernel, Language-Agnostic Plugins
**Kernel: 100% Go. Plugins: Developer's choice.**

**Why Go for Kernel:**
- Single binary compilation
- Excellent concurrency (goroutines)
- Fast compile times (<5s for full build)
- Strong typing without ceremony
- Stdlib is production-ready
- Cross-platform compilation

**Go Code Standards:**
- Standard library preferred over frameworks
- Minimal dependencies (<20 total)
- Go modules for dependency management
- gofmt + golint mandatory
- Meaningful error messages
- Context propagation for timeouts

**Forbidden in Kernel:**
- Web frameworks (use stdlib)
- ORMs (use database/sql directly)
- Complex abstractions (KISS principle)
- Reflection (except SDK bindings)
- Global state (pass dependencies)

**CGO Build Requirements (CRITICAL - NEVER FORGET):**
BOSA uses SQLite via `github.com/mattn/go-sqlite3` which requires CGO. The build system MUST handle CGO compilation correctly.

**Solution for CGO Build Errors:**
1. **Use Clang instead of GCC (RECOMMENDED)** - Better compatibility, especially with GCC 15+
   - Install Clang via MSYS2: `pacman -S mingw-w64-x86_64-clang`
   - Build script automatically detects and uses Clang if available
   - Sets `CC=clang` and `CGO_CFLAGS="-Oz -g0"` automatically

2. **Why Clang?**
   - GCC 15+ has known incompatibility with Go's CGO (github.com/golang/go/issues)
   - Clang has better compatibility with newer toolchains
   - No need to downgrade GCC - just use Clang

3. **Build Script Behavior:**
   - Automatically checks for Clang first (preferred)
   - Falls back to GCC if Clang not found
   - Warns if GCC 15+ detected (incompatible)
   - Provides clear error messages with solutions

4. **Manual Build (if needed):**
   ```powershell
   $env:CGO_ENABLED = "1"
   $env:CC = "clang"
   $env:CGO_CFLAGS = "-Oz -g0"
   go build ./cmd/bosa
   ```

5. **Error Pattern to Recognize:**
   - `runtime/cgo: cgo.exe: exit status 2` = CGO compilation failed
   - Usually means GCC 15+ incompatibility or missing C compiler
   - Solution: Install Clang or use build script (auto-detects)

**VIOLATION CONSEQUENCE**: CGO build failures block all development. Always use Clang or ensure GCC <15.

**File Structure:**
```
bosa/
  cmd/
    bosa/
      main.go              # <100 lines
  internal/
    core/
      server.go            # <500 lines
      auth.go              # <300 lines
      database/
        adapter.go         # <200 lines
        sqlite.go          # <300 lines
        postgres.go        # <300 lines
      realtime/
        hub.go             # <400 lines
      plugins/
        manager.go         # <500 lines
        runtime_lua.go     # <300 lines
        runtime_node.go    # <300 lines
        runtime_php.go     # <300 lines
```

**AI Development Guidelines for Go:**
- Every function has clear purpose comment
- No "clever" code - readability over brevity
- Error handling explicit, not hidden
- Interfaces small and focused
- Structs document field purposes
- All functionality must have Development (dev) and Production (prd) logging.


### IX. AI-First Development Patterns
**Code MUST be optimized for AI comprehension and generation.**

**File Size Limits (Strict):**
- Any file >500 lines MUST be split
- Any function >50 lines MUST be refactored
- Total kernel codebase <10K lines (fits in AI context)

**Documentation Requirements:**
- Every file has purpose header:
```go
// File: server.go
// Purpose: HTTP and WebSocket server initialization
// Dependencies: database, auth, realtime
// Used by: main.go
// AI Notes: Single entry point, no global state
```

- Every function documented:
```go
// CreateCustomer inserts a new customer record
// Input: customer data map (name, email required)
// Output: customer ID or error
// Side effects: Publishes customer.created event
func CreateCustomer(data map[string]interface{}) (int64, error) {
    // Implementation
}
```

**Consistent Patterns:**
- All database operations via repository pattern
- All plugin communication via SDK
- All configuration via config.yaml + env vars
- All errors use standard error types

**AI Prompting Guide:**
```
Good Prompt:
"Implement SQLite database adapter following the DatabaseAdapter 
interface in internal/core/database/adapter.go. Include connection 
pooling and query builder. Reference postgres.go for patterns."

Bad Prompt:
"Add database support"
```

### X. Security by Design
**Security CANNOT be an afterthought.**

**Authentication:**
- JWT tokens with 15-minute expiry
- Refresh tokens with 7-day expiry (rotating)
- Tokens stored in httpOnly cookies (web) or secure storage (mobile)
- Password hashing: bcrypt cost 12
- Failed login rate limiting: 5 attempts per 5 minutes

**Authorization:**
- Role-based access control (RBAC) in core
- Plugin-level permissions in manifest
- API endpoint authorization middleware
- Channel-level authorization for WebSocket

**Data Protection:**
- All passwords hashed (never plaintext)
- Sensitive config in environment variables
- SQL injection prevention via parameterized queries
- XSS prevention via template escaping
- CSRF tokens for state-changing operations

**Plugin Sandboxing:**
- Plugins run in separate processes
- Resource limits (CPU, memory) enforced
- File system access restricted
- Network access controlled
- System calls limited via seccomp (future)

**Security Headers (Required):**
```
Strict-Transport-Security: max-age=31536000
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
```

### XI. Operational Excellence
**System MUST be operable by non-technical users.**

**App/Plugin Deployment Locations (MANDATORY):**

**Development Location:**
- Apps/plugins can be developed **anywhere** on the developer's machine
- Example: `D:\dev\projects\My Todo App\`, `C:\Users\Name\apps\todo\`, etc.
- Contains: source code, `.git/`, `node_modules/`, tests, development files

**Deployment Location (Local Development):**
- **Local Dev:** `D:\dev\projects\bosa\apps\` (relative to BOSA project root)
- Configured in `config.yaml` → `plugins.directory`
- This is where BOSA installs apps/plugins when uploading `.zip` files or using `bosa plugin install`
- Apps are installed to: `D:\dev\projects\bosa\apps\[app-name]\`

**Deployment Location (Production/Namecheap):**
- **Production:** `./apps` (relative to `/bosa` base directory on server)
- On Namecheap: `/home/meaivgfb/bosa/apps/`
- Configured automatically in deployment scripts
- Apps are installed to: `/home/meaivgfb/bosa/apps/[app-name]/`

**Separation Rules:**
- ✅ Development location: Anywhere (developer's choice)
- ✅ Deployment location: Always `apps/` directory under BOSA base
- ✅ Never develop directly in deployment directory
- ✅ Always use packaging script to create deployment `.zip` files
- ✅ Deployment scripts automatically create `apps/` directory if missing

**Configuration:**
- Local dev: `config.yaml` → `plugins.directory: "D:/dev/projects/bosa/apps"`
- Production: `config.yaml` → `plugins.directory: "./apps"` (relative path)

**Installation Requirements:**
- Zero-config default: `bosa init && bosa serve`
- Guided setup wizard in web UI
- Automatic database initialization
- Health checks on startup

**Observability (Built-in):**
- `/health` endpoint (Kubernetes-compatible)
- `/metrics` endpoint (Prometheus format)
- Structured JSON logging
- Request tracing with correlation IDs

### XI-A. Comprehensive Logging System (MANDATORY)
**All operations MUST be logged. Logging behavior differs by environment.**

**Development Mode (BOSA_DEV_MODE=true or plugins.hot_reload=true):**
- ALL operations MUST be logged automatically
- Debug-level logging enabled by default
- HTTP requests: ALL requests logged (method, path, status, duration)
- Database operations: ALL queries logged (table, operation, parameters)
- Plugin operations: ALL plugin lifecycle events logged (load, unload, errors)
- Authentication events: ALL login attempts, failures, token refreshes logged
- Event bus: ALL events published/subscribed logged
- Error tracking: ALL errors with stack traces logged
- No logging toggles - always enabled for debugging

**Production Mode (BOSA_DEV_MODE=false and plugins.hot_reload=false):**
- Logging is OPTIONAL and toggleable by super admin
- Default state: Logging DISABLED (performance optimization)
- Super admin can enable/disable via `/api/admin/logging/toggle` endpoint
- When enabled in production: Log only WARN and ERROR levels by default
- When enabled in production: HTTP requests logged at INFO level
- Database errors: Always logged regardless of toggle (critical for debugging)
- Authentication failures: Always logged regardless of toggle (security requirement)
- Log buffer size: 1000 entries (configurable via config.yaml)
- Log retention: In-memory only (cleared on restart)

**Logging Requirements for ALL Functions:**
- Every function MUST include logging at entry/exit points
- Every error MUST be logged with context (function name, parameters, error message)
- Every database operation MUST be logged (table, operation, success/failure)
- Every HTTP request/response MUST be logged (method, path, status, duration)
- Every plugin operation MUST be logged (plugin name, operation, success/failure)
- Every authentication event MUST be logged (user, action, success/failure)
- Every configuration change MUST be logged (what changed, by whom, when)

**Log Levels (Standard):**
- **DEBUG**: Detailed diagnostic information (dev mode only)
- **INFO**: General informational messages (server start, plugin loaded, HTTP requests)
- **WARN**: Warning messages (non-critical issues, deprecation notices)
- **ERROR**: Error messages (failed operations, exceptions)

**Log Format (Structured):**
```json
{
  "timestamp": "2025-11-25T10:28:36Z",
  "level": "info",
  "message": "HTTP request processed",
  "source": "http",
  "method": "GET",
  "path": "/api/plugins",
  "status": 200,
  "duration_ms": 45
}
```

**Log Buffer Management:**
- Maximum size: 1000 entries (configurable)
- FIFO eviction: Oldest entries removed when limit reached
- Filtering: By level (debug, info, warn, error, all)
- Export: CSV format via `/api/logs/export`
- Clear: Via `/api/logs` DELETE endpoint (super admin only)

**Super Admin Logging Controls:**
- GET `/api/admin/logging/status` - Get current logging state (enabled/disabled, level, buffer size)
- POST `/api/admin/logging/toggle` - Toggle logging on/off (production only)
- PUT `/api/admin/logging/config` - Update logging configuration (level, buffer size, production only)
- All logging controls require super_admin role

**Performance Considerations:**
- Logging MUST NOT block operations (async where possible)
- Log buffer MUST use efficient data structures (slice with mutex)
- Production mode with logging disabled: Near-zero overhead (<1% CPU)
- Production mode with logging enabled: <5% CPU overhead

**Security Requirements:**
- Sensitive data MUST NOT be logged (passwords, tokens, PII)
- Authentication tokens: Log only presence, never full value
- Database passwords: Never logged
- User emails: Log only for authentication events
- Logs accessible only to super_admin role

**VIOLATION CONSEQUENCE**: Missing logs = debugging nightmare. All operations without logs are bugs.

**Backup & Recovery:**
- One-command backup: `bosa backup create`
- One-command restore: `bosa backup restore [file]`
- Automatic daily backups (configurable)
- Export/import between databases

**Upgrades:**
- Zero-downtime rolling updates
- Automatic schema migrations
- Rollback support
- Version compatibility checks

**Monitoring Targets:**
- System uptime: 99.9% (43 min/month downtime)
- API response time: <200ms p95
- WebSocket latency: <50ms p95
- Database query time: <100ms p95
- Memory usage: <500MB idle, <2GB under load

### XII. Performance Requirements
**Performance is a feature, not an optimization.**

**Response Time Targets:**
| Operation | Target | Measurement |
|-----------|--------|-------------|
| API CRUD | <100ms p95 | End-to-end |
| Database query | <50ms p95 | Indexed lookups |
| WebSocket event | <50ms p95 | Delivery time |
| Plugin cold start | <5s | Process spawn |
| Page load | <2s | First contentful paint |

**Scalability Targets:**
| Metric | Target | Growth Path |
|--------|--------|-------------|
| Concurrent users | 100 (SQLite) → 10K (Postgres) | Add replicas |
| API throughput | 1K req/s (single) → 100K req/s (cluster) | Horizontal scaling |
| Database size | 1GB (SQLite) → 1TB+ (Postgres) | Sharding |
| WebSocket connections | 1K (single) → 100K (Redis pub/sub) | Load balancer |

**Optimization Rules:**
- Database queries MUST use indexes
- N+1 queries are bugs, not features
- Caching MUST be explicit, not implicit
- Asset compression MUST be enabled
- CDN integration for static files

**Benchmarking (Required):**
- Every PR MUST include benchmark results
- Regressions >10% MUST be explained
- Load testing before major releases
- Database query profiling enabled in dev

### XIII. Growth Path Architecture
**System MUST scale from laptop to cloud without rewrites.**

**Stage 1: Development (Laptop)**
- SQLite database (one file)
- In-memory events
- Single binary
- Cost: $0

**Stage 2: Small Business (VPS)**
- SQLite still works OR switch to Postgres
- Optional Redis for caching
- nginx reverse proxy
- Cost: $10-20/month

**Stage 3: Growing Company (Cloud)**
- PostgreSQL managed instance
- Redis for events + cache
- Load balancer (2-3 instances)
- Cost: $100-200/month

**Stage 4: Enterprise (Kubernetes)**
- PostgreSQL cluster with replicas
- Redis cluster
- Multiple BOSA instances (auto-scaled)
- CDN for static assets
- Cost: $500-1,000/month

**Critical Rule**: Same codebase, same config format, zero code changes at each stage.

### XIV. Documentation Standards
**Documentation is code, not an afterthought.**

**Required Documentation:**
- `README.md`: Quick start (5-minute setup)
- `docs/ARCHITECTURE.md`: System design overview
- `docs/API.md`: Complete API reference
- `docs/PLUGINS.md`: Plugin development guide
- `docs/DEPLOYMENT.md`: Production deployment guide

**Plugin Documentation:**
- Every plugin MUST have `README.md`
- Installation instructions
- Configuration options
- API endpoints exposed
- Event subscriptions/publications
- Example usage

**Code Comments (When Required):**
- Why, not what (code shows what)
- Non-obvious decisions
- Performance trade-offs
- Security considerations
- TODO items with GitHub issue links

**Documentation Generation:**
- OpenAPI/Swagger from code annotations
- SDK docs from JSDoc/GoDoc comments
- Architecture diagrams in Mermaid format
- Examples must be runnable code

### XV. Internationalization (i18n)
**Global readiness from day one.**

**Language Support:**
- English (primary)
- Arabic with RTL support (secondary)
- Framework for community translations

**Implementation:**
- JSON files for UI strings
- `t('key')` function in all UIs
- Locale-aware date/time formatting
- Currency formatting with Intl API
- Number formatting (Western vs Arabic numerals)

**RTL Support:**
- CSS logical properties (start/end vs left/right)
- Bidirectional text rendering
- Mirrored layouts for RTL languages
- Icon orientation adjustments

### XVI. Mobile-First Considerations
**Desktop second, mobile first.**

**Responsive Design:**
- All UI MUST work on 320px width
- Touch-friendly targets (44px minimum)
- No hover-dependent interactions
- Optimized images (WebP with fallback)

**Progressive Web App (PWA):**
- Service worker for offline capability
- App manifest for "Add to Home Screen"
- Push notifications for real-time updates
- Background sync for offline actions

**Native Mobile (Future):**
- React Native for iOS/Android
- Shared API client with web
- Biometric authentication
- Camera integration for work orders

## Business Logic Constraints

### User Management Rules
- Email addresses MUST be unique globally
- Passwords MUST meet complexity requirements (12+ chars, special chars)
- Role changes MUST be logged with who/when/why
- Account deletion MUST be soft delete (preserve history)
- Failed login attempts MUST be logged for security monitoring

### Plugin Lifecycle Rules
- Plugin installation MUST be atomic (success or rollback)
- Plugin upgrades MUST run migrations automatically
- Plugin removal MUST clean up database tables
- Plugin failures MUST NOT crash kernel
- Plugin resource usage MUST be monitored and limited

### Data Consistency Rules
- Database transactions MUST be used for multi-step operations
- Event publishing MUST use transactional outbox pattern
- Cache invalidation MUST happen synchronously with writes
- Concurrent updates MUST use optimistic locking
- Data migrations MUST be tested on copy of production data

## Violation Consequences

### Severity Levels

**P0 - Immediate Rejection:**
- NO CREATIVITY rule violations (extra files, features)
- NO ASSUMPTIONS rule violations (implementing without confirmation)
- Security vulnerabilities (SQL injection, XSS)
- Breaking core simplicity (>5K lines kernel)
- Database-specific SQL in plugins
- Direct plugin-to-plugin communication

**P1 - Requires Immediate Fix:**
- Missing tests for new features
- Files >500 lines
- Functions >50 lines
- Performance regressions >10%
- Missing documentation

**P2 - Fix Before Merge:**
- Inconsistent naming conventions
- Missing error handling
- Hard-coded configuration
- Poor variable names
- Missing type annotations

## Governance

### Amendment Process
1. Propose change in GitHub issue
2. Discuss with team (async, 7-day minimum)
3. Vote (majority approval required)
4. Update constitution with version bump
5. Notify all developers
6. Migration plan if needed

### Review Requirements
- All PRs MUST reference constitution compliance
- Architecture decisions MUST be documented in ADR format
- Breaking changes MUST bump version and provide migration guide
- New principles MUST have rationale documented

### AI Agent Instructions
When working on BOSA:
1. Read this constitution FIRST before ANY code changes
2. Verify request against NO CREATIVITY rule
3. Verify request against NO ASSUMPTIONS rule - ANSWER questions, don't implement solutions
4. Check if change belongs in core or plugin
5. Ensure multi-language/multi-database compatibility
6. Write tests BEFORE implementation
7. Keep files under 500 lines
8. Document WHY, not WHAT
9. ASK before adding anything beyond exact request
10. When user asks a question → ANSWER first, WAIT for confirmation before implementing
11. **CRITICAL: Version Bumping Rules (NEVER VIOLATE - ABSOLUTE PRIORITY):**
    - **⚠️ NEVER EVER REVERSE VERSION NUMBERS BACKWARDS ⚠️**
    - **⚠️ VERSION NUMBERS CAN ONLY INCREASE, NEVER DECREASE ⚠️**
    - **⚠️ IF YOU DECREASE A VERSION NUMBER, YOU ARE VIOLATING THE CONSTITUTION ⚠️**
    
    **Version Source of Truth Logic:**
    - The source of truth for current version is the **`version.txt` file**, NOT git HEAD
    - If `version.txt` shows build number 077 and git HEAD shows 068, this means git hasn't been updated yet
    - This is NORMAL - git may be behind the actual current version
    
    **Bumping Rules:**
    - **ALWAYS check `version.txt` file FIRST** (not git HEAD)
    - **ALWAYS bump ABOVE the higher number found in `version.txt`**
    - Example: If `version.txt` shows 0.0.2.077 and git shows 0.0.2.068 → bump to **0.0.2.078** (NOT 0.0.2.069)
    - Example: If `version.txt` shows 0.0.2.100 and git shows 0.0.2.050 → bump to **0.0.2.101** (NOT 0.0.2.051)
    
    **What to NEVER do:**
    - ❌ NEVER use git HEAD version to determine bump number
    - ❌ NEVER decrease version numbers under ANY circumstances
    - ❌ NEVER bump to a number lower than what's in `version.txt`
    - ❌ NEVER assume git HEAD is current - it may be outdated
    
    **The Rule: `version.txt` = Source of Truth → Always bump above the number in `version.txt`**
12. **CRITICAL: ALL new files MUST be committed to git IMMEDIATELY after creation and testing. NO EXCEPTIONS. Untracked files violate project rules and can be lost.**

## Version History

**Version 1.0.0** | **Ratified**: 2025-11-19 | **Status**: Active

### Key Decisions
- Go for kernel (single binary simplicity)
- Multi-language plugin support (ecosystem growth)
- Real-time WebSocket built-in (not optional)
- Multi-database from day one (no vendor lock-in)
- Radical simplicity (WordPress-level ease)
- NO CREATIVITY rule (prevent over-engineering)

### Future Considerations
- WASM plugin runtime (v2.0)
- GraphQL API layer (v1.5)
- Plugin marketplace (v1.2)
- Visual plugin builder (v2.0)
- Multi-region deployment (v3.0)

---

**This constitution is the law of BOSA development. All other documents, patterns, and practices are subordinate. When in doubt, ask: "Does this make BOSA simpler?" If no, don't do it.**

**Remember**: The best code is no code. The second best is code so simple that AI can write and maintain it.

---

*"Complexity is the enemy. Simplicity is the ultimate sophistication." - Leonardo da Vinci*

*"Make it work, make it right, make it fast - in that order. And make it simple throughout." - Kent Beck (adapted)*
