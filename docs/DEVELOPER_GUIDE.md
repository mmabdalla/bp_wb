# BOSA Developer Guide
**Version:** 0.0.2.008  
**Date:** December 5, 2025  
**Audience:** Developers building apps/plugins for BOSA

---

## Related Documentation

For comprehensive multi-language documentation, see:

- **[Architecture Documentation](ARCHITECTURE.md)** - Complete system architecture overview
- **[SDK API Reference](SDK_API_REFERENCE.md)** - Complete API reference for all SDKs (Node.js, PHP, Python, Go)
- **[Quick Start Guides](QUICK_START_GUIDES.md)** - Language-specific quick start guides
- **[Messaging API Reference](MESSAGING_API_REFERENCE.md)** - Complete messaging API documentation

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
   - 2.1 [Prerequisites](#21-prerequisites)
   - 2.2 [Creating Your First Plugin](#22-creating-your-first-plugin)
   - 2.3 [Supported Runtimes](#23-supported-runtimes)
   - 2.4 [BOSA SDKs](#24-bosa-sdks)
3. [Plugin Structure](#3-plugin-structure)
4. [Plugin Development](#4-plugin-development)
   - 4.5 [Theme System](#45-theme-system)
5. [BOSA API Reference](#5-bosa-api-reference)
   - 5.1 [Database API](#51-database-api-bosadb)
   - 5.2 [Event API](#52-event-api-bosaevents)
   - 5.3 [Logging API](#53-logging-api-bosalog)
   - 5.4 [Configuration API](#54-configuration-api-bosaconfig)
   - 5.5 [Real-Time API](#55-real-time-api-bosarealtime)
   - 5.6 [I18n Translation API](#56-i18n-translation-api-bosai18n)
   - 5.7 [Messaging API](#57-messaging-api-rest)
6. [Multi-Tenancy Support](#6-multi-tenancy-support)
7. [Currency Support](#7-currency-support)
8. [Location Services](#8-location-services)
9. [Database Operations](#9-database-operations)
10. [Event System](#10-event-system)
11. [Real-Time Features](#11-real-time-features)
12. [HTTP Routes](#12-http-routes)
13. [Testing Plugins](#13-testing-plugins)
14. [Best Practices](#14-best-practices)
15. [Examples](#15-examples)
16. [Error Logging and Monitoring](#16-error-logging-and-monitoring)
17. [Production Deployment with Nginx](#17-production-deployment-with-nginx)

---

## 1. Introduction

BOSA (Business Operating System Architecture) is a minimalist kernel for running business applications. It provides infrastructure services (authentication, database, events, real-time) while your business logic lives in plugins.

**Key Features:**
- **Multi-Language Support:** Lua (embedded), Node.js, PHP, Go (process-based runtimes)
- **Database:** SQLite (primary), PostgreSQL (supported), MySQL/MariaDB, MongoDB (planned)
- **Real-Time:** WebSocket and Server-Sent Events (SSE)
- **Event System:** Pub/sub event bus
- **Authentication:** JWT-based authentication built-in
- **SDKs:** Official SDKs for all supported languages (Node.js, Python, PHP, Go) - see [BOSA SDKs](#24-bosa-sdks) section

**What You Build:**
- Business logic in your preferred language (Lua, Node.js, PHP, Go)
- Database schema via migrations
- HTTP routes via plugin routes
- Real-time updates via WebSocket broadcasts
- Full-stack applications that leverage BOSA's infrastructure services

---

## 2. Getting Started

### 2.1 Prerequisites

- **BOSA Instance:** Running BOSA server (see installation guide)
- **Language Knowledge:** 
  - For Lua plugins: Basic Lua programming (5.4 compatible)
  - For Node.js plugins: JavaScript/TypeScript and npm
  - For PHP plugins: PHP and Composer
  - For Go plugins: Go programming language
- **SQL Knowledge:** Basic SQL for migrations
- **Text Editor:** Any text editor (VS Code, Vim, etc.)

### 2.2 Creating Your First Plugin

#### Step 1: Create Plugin Directory

```bash
mkdir -p plugins/my-first-plugin
cd plugins/my-first-plugin
```

#### Step 2: Create Manifest File

Create `manifest.yaml`:

```yaml
name: my-first-plugin
version: 1.0.0
description: My first BOSA plugin
author: Your Name

runtime:
  type: lua
  entry: main.lua

routes:
  - path: /hello
    method: GET
    handler: hello

events:
  subscribe:
    - user.created
  publish:
    - greeting.sent
```

#### Step 3: Create Main Script

Create `main.lua`:

```lua
function init()
    bosa.log.info("My first plugin initialized!")
    return true
end

function hello(request)
    return {
        status = 200,
        body = {
            message = "Hello from my first plugin!"
        }
    }
end
```

#### Step 4: Install Plugin

**Option A: Via CLI**
```bash
# From BOSA root directory
bosa plugin install ./plugins/my-first-plugin

# Or from zip file
bosa plugin install my-first-plugin.zip

# Or from git repository
bosa plugin install https://github.com/user/my-first-plugin.git
```

**Option B: Via UI (Super Admin)**
1. Navigate to `/plugins` page
2. Click "Choose File" and select `my-first-plugin.zip`
3. Click "Install Plugin"
4. Plugin is automatically loaded (no restart needed!)

#### Step 5: Test Plugin

```bash
# Visit: http://localhost:3000/my-first-plugin/hello
curl http://localhost:3000/my-first-plugin/hello
```

**Note:** Plugins installed via UI are automatically loaded. CLI installations require server restart.

---

## 2.3 Supported Runtimes

BOSA supports multiple runtime types for plugin development:

### Lua Runtime (Embedded)
- **Type:** `lua`
- **Entry:** `main.lua`
- **Best For:** Simple plugins, quick development
- **Execution:** Embedded in BOSA process (no separate process)

### Node.js Runtime (Process-Based)
- **Type:** `nodejs`
- **Entry:** `index.js` or `server.js`
- **Best For:** Full-stack JavaScript/TypeScript applications
- **Execution:** Separate Node.js process (port range: 3001-4000)
- **SDK:** `bosa-sdk-node` package available
- **Requirements:** Node.js and npm installed

### PHP Runtime (Process-Based)
- **Type:** `php`
- **Entry:** `index.php` or `server.php`
- **Best For:** PHP applications and legacy code migration
- **Execution:** Separate PHP process using built-in server (port range: 4001-5000)
- **Requirements:** PHP and Composer installed

### Go Runtime (Process-Based)
- **Type:** `go`
- **Entry:** `main.go`
- **Best For:** High-performance native applications
- **Execution:** Compiled Go binary as separate process (port range: 5001-6000)
- **Requirements:** Go compiler installed
- **Note:** Plugin is compiled to binary at install time

### Choosing a Runtime

| Runtime | Performance | Development Speed | Ecosystem | Use Case |
|---------|------------|-------------------|-----------|----------|
| Lua     | High       | Fast              | Limited   | Simple plugins, embedded scripts |
| Node.js | Good       | Very Fast         | Extensive | Full-stack apps, modern web |
| PHP     | Good       | Fast              | Extensive | Legacy apps, web applications |
| Go      | Excellent  | Moderate          | Growing   | High-performance, native apps |

---

## 2.4 BOSA SDKs

BOSA provides official SDKs for all supported languages to simplify plugin development. The SDKs provide a unified API for accessing BOSA services (database, events, real-time, configuration, etc.).

### SDK Locations

#### Local Development (BOSA Repository)

All SDKs are located in the `sdk/` directory of the BOSA repository:

```
BOSA/
└── sdk/
    ├── bosa-sdk-node/      # Node.js/TypeScript SDK
    ├── bosa-sdk-python/    # Python SDK
    ├── bosa-sdk-php/       # PHP SDK
    └── bosa-sdk-go/        # Go SDK
```

**Local Path:** `./sdk/` (relative to BOSA root directory) or `[BOSA_INSTALL_PATH]/sdk/`

#### GitHub Repository

All SDKs are available in the main BOSA repository:

**Repository:** `https://github.com/mmabdalla/BOSA`

**SDK Paths on GitHub:**
- Node.js: `https://github.com/mmabdalla/BOSA/tree/main/sdk/bosa-sdk-node`
- Python: `https://github.com/mmabdalla/BOSA/tree/main/sdk/bosa-sdk-python`
- PHP: `https://github.com/mmabdalla/BOSA/tree/main/sdk/bosa-sdk-php`
- Go: `https://github.com/mmabdalla/BOSA/tree/main/sdk/bosa-sdk-go`

### Installing SDKs

#### Node.js SDK (`bosa-sdk-node`)

**Installation:**
```bash
npm install bosa-sdk-node
```

**Local Development:**
```bash
# From your plugin directory
npm install ../../sdk/bosa-sdk-node
# Or use npm link
cd ../../sdk/bosa-sdk-node
npm link
cd ../../plugins/your-plugin
npm link bosa-sdk-node
```

**GitHub:**
- Repository: `https://github.com/mmabdalla/BOSA/tree/main/sdk/bosa-sdk-node`
- README: `https://github.com/mmabdalla/BOSA/blob/main/sdk/bosa-sdk-node/README.md`

**Quick Start:**
```javascript
const { BOSA } = require('bosa-sdk-node');
const bosa = new BOSA({
  kernelURL: process.env.BOSA_KERNEL_URL || 'http://localhost:3000',
  pluginName: process.env.PLUGIN_NAME,
  pluginToken: process.env.BOSA_KERNEL_TOKEN,
});
await bosa.init();
```

#### Python SDK (`bosa-sdk-python`)

**Installation:**
```bash
pip install bosa-sdk-python
```

**Local Development:**
```bash
# From your plugin directory
pip install -e ../../sdk/bosa-sdk-python
```

**GitHub:**
- Repository: `https://github.com/mmabdalla/BOSA/tree/main/sdk/bosa-sdk-python`
- README: `https://github.com/mmabdalla/BOSA/blob/main/sdk/bosa-sdk-python/README.md`

**Quick Start:**
```python
from bosa import BOSA
bosa = BOSA({
    'kernelURL': 'http://localhost:3000',
    'pluginName': 'my-plugin',
    'pluginToken': 'your-token',
})
await bosa.init()
```

#### PHP SDK (`bosa-sdk-php`)

**Installation:**
```bash
composer require bosa/bosa-sdk-php
```

**Local Development:**
```bash
# From your plugin directory
composer config repositories.bosa-sdk path ../../sdk/bosa-sdk-php
composer require bosa/bosa-sdk-php:@dev
```

**GitHub:**
- Repository: `https://github.com/mmabdalla/BOSA/tree/main/sdk/bosa-sdk-php`
- README: `https://github.com/mmabdalla/BOSA/blob/main/sdk/bosa-sdk-php/README.md`

**Quick Start:**
```php
<?php
require_once __DIR__ . '/vendor/autoload.php';
use Bosa\BOSA;

$bosa = new BOSA([
    'kernelURL' => 'http://localhost:3000',
    'pluginName' => 'my-plugin',
    'pluginToken' => 'your-token',
]);
$bosa->init();
```

#### Go SDK (`bosa-sdk-go`)

**Installation:**
```bash
go get github.com/mmabdalla/BOSA/sdk/bosa-sdk-go
```

**Local Development:**
```bash
# Use replace directive in go.mod
replace github.com/mmabdalla/BOSA/sdk/bosa-sdk-go => ../../sdk/bosa-sdk-go
go get github.com/mmabdalla/BOSA/sdk/bosa-sdk-go
```

**GitHub:**
- Repository: `https://github.com/mmabdalla/BOSA/tree/main/sdk/bosa-sdk-go`
- README: `https://github.com/mmabdalla/BOSA/blob/main/sdk/bosa-sdk-go/README.md`

**Quick Start:**
```go
import "github.com/mmabdalla/BOSA/sdk/bosa-sdk-go"

bosa := bosa.NewBOSA(&bosa.Config{
    KernelURL:  "http://localhost:3000",
    PluginName: "my-plugin",
    PluginToken: "your-token",
})
```

### SDK Features

All SDKs provide consistent APIs for:

- **Database Operations:** Query, insert, update, delete with automatic site scoping
- **Event System:** Publish and subscribe to events
- **Real-Time Communication:** WebSocket client for real-time messaging
- **Configuration Management:** Get, set, delete configuration values
- **Multi-Tenancy:** Automatic site ID handling in all requests
- **I18n Support:** Translation and internationalization
- **Currency Services:** Currency formatting and conversion
- **Location Services:** Location detection and availability

### SDK Documentation

Each SDK includes comprehensive documentation:

- **Node.js:** `sdk/bosa-sdk-node/README.md`
- **Python:** `sdk/bosa-sdk-python/README.md`
- **PHP:** `sdk/bosa-sdk-php/README.md`
- **Go:** `sdk/bosa-sdk-go/README.md`

For complete API reference, see [SDK API Reference](SDK_API_REFERENCE.md).

### Environment Variables

All SDKs automatically read configuration from environment variables (set by BOSA runtime):

- `BOSA_KERNEL_URL` - BOSA kernel URL (default: `http://localhost:3000`)
- `PLUGIN_NAME` - Plugin name (required)
- `BOSA_KERNEL_TOKEN` - Plugin authentication token (required)
- `BOSA_SITE_ID` - Site ID for multi-tenancy (optional)

These are automatically set when your plugin runs in the BOSA environment.

---

## 3. Plugin Structure

### 3.1 Directory Structure

```
plugins/my-plugin/
├── manifest.yaml          # Plugin metadata (required)
├── main.lua              # Entry script (required)
├── migrations/           # Database migrations (optional)
│   ├── 001_initial.sql
│   └── 002_update.sql
└── assets/               # Static assets (optional)
    ├── js/               # JavaScript files
    │   └── my-plugin.js
    ├── css/              # Stylesheets
    │   └── styles.css
    └── images/           # Images
        └── logo.png
```

**Static Assets:**
- Static files are served from `/plugins/[plugin-name]/assets/`
- Example: `assets/js/my-plugin.js` → `/plugins/my-plugin/assets/js/my-plugin.js`
- Use in your Lua HTML: `<script src="/plugins/my-plugin/assets/js/my-plugin.js"></script>`

### 3.2 Documentation and Changelog Pages

BOSA provides automatic documentation and changelog pages for both the main BOSA system and individual apps. Apps located in the `apps/` directory can have their own documentation and changelog pages.

#### App Documentation Structure

For apps in the `apps/` directory, you can provide documentation and changelog files:

```
apps/my-app/
├── manifest.yaml          # App manifest (required)
├── docs/                  # Documentation directory (optional)
│   └── DEVELOPER_GUIDE.md # App-specific developer guide
├── CHANGELOG.md           # Changelog in Markdown format (optional)
└── version.txt            # Changelog in version.txt format (optional, fallback)
```

#### Documentation Pages

**Main BOSA Documentation:**
- **URL:** `/docs`
- **Source:** `./docs/DEVELOPER_GUIDE.md`
- **Description:** Main BOSA developer guide and API reference

**Main BOSA Changelog:**
- **URL:** `/docs/changelog`
- **Source:** `./version.txt`
- **Description:** BOSA version history and changes

**App Documentation:**
- **URL:** `/docs/[appname]`
- **Source:** `./apps/[appname]/docs/DEVELOPER_GUIDE.md`
- **Description:** App-specific developer guide
- **Example:** `/docs/todo` for the todo app

**App Changelog:**
- **URL:** `/docs/[appname]/changelog`
- **Source:** `./apps/[appname]/CHANGELOG.md` or `./apps/[appname]/version.txt`
- **Description:** App version history and changes
- **Example:** `/docs/todo/changelog` for the todo app changelog

#### Creating App Documentation

1. **Create Documentation File:**
   ```bash
   mkdir -p apps/my-app/docs
   touch apps/my-app/docs/DEVELOPER_GUIDE.md
   ```

2. **Write Your Documentation:**
   - Use Markdown format
   - Include installation instructions
   - Document API endpoints
   - Provide code examples
   - Add troubleshooting tips

3. **Create Changelog:**
   ```bash
   # Option 1: Markdown format (preferred)
   touch apps/my-app/CHANGELOG.md
   
   # Option 2: version.txt format (fallback)
   touch apps/my-app/version.txt
   ```

#### Changelog Format

**Markdown Format (CHANGELOG.md):**
```markdown
# Version 1.0.0
Date: December 10, 2025

## Changes
- [FEATURE] Added new task filtering
- [FIX] Fixed issue with task deletion
- [IMPROVEMENT] Improved performance
```

**Version.txt Format:**
```
My App Version 1.0.0
Date: December 10, 2025

=== Latest Changes ===
- [FEATURE] Added new task filtering
  - Implemented filter by status
  - Added filter by date range
- [FIX] Fixed issue with task deletion
  - Resolved database constraint error
  - Added proper error handling
```

#### Apps Dropdown Navigation

All documentation pages include an "Apps" dropdown in the header navigation that:
- Lists all available apps from the `apps/` directory
- Provides quick links to each app's documentation
- Provides quick links to each app's changelog
- Highlights the current app when viewing app-specific pages

**Apps are automatically discovered if they have:**
- A `manifest.yaml` file in `apps/[appname]/manifest.yaml`, OR
- A `docs/` directory in `apps/[appname]/docs/`

### 3.3 Manifest File (`manifest.yaml`)

#### Required Fields

```yaml
name: my-plugin              # Plugin name (unique, alphanumeric + hyphens)
version: 1.0.0              # Semantic version (x.y.z)
description: Plugin description
author: Your Name

runtime:
  type: lua                 # Runtime type: lua, nodejs, php, go
  entry: main.lua           # Entry file (depends on runtime type)
```

#### Optional Fields

```yaml
routes:                     # HTTP routes
  - path: /todos            # Route path (relative to /{plugin-name}/)
    method: GET             # HTTP method (GET, POST, PUT, DELETE, etc.)
    handler: listTodos      # Lua function name
  - path: /todos/:id        # Parameterized routes (:id, :name, etc.)
    method: GET
    handler: getTodo

events:                     # Event subscriptions/publications
  subscribe:                # Events this plugin subscribes to
    - todo.created
    - todo.updated
  publish:                  # Events this plugin publishes
    - todo.created
    - todo.completed
```

#### Full Manifest Example

```yaml
name: todo-plugin
version: 1.0.0
description: Simple todo management plugin
author: BOSA Team

runtime:
  type: lua
  entry: main.lua

routes:
  - path: /todos
    method: GET
    handler: listTodos
  - path: /todos
    method: POST
    handler: createTodo
  - path: /todos/:id
    method: GET
    handler: getTodo
  - path: /todos/:id
    method: PUT
    handler: updateTodo
  - path: /todos/:id
    method: DELETE
    handler: deleteTodo

events:
  subscribe:
    - user.created
  publish:
    - todo.created
    - todo.completed
```

### 3.4 Main Script (`main.lua`)

#### Required Functions

```lua
-- init() is called when plugin loads
function init()
    -- Initialize plugin here
    -- Return true on success, false on failure
    return true
end
```

#### Route Handler Functions

```lua
-- Handler function signature:
-- function handlerName(request)
--     return {
--         status = 200,        -- HTTP status code
--         headers = {},        -- Optional HTTP headers
--         body = {}            -- Response body (JSON object)
--     }
-- end

function listTodos(request)
    -- Query database
    local todos = bosa.db.query("todos")
        :orderBy("created_at", "desc")
        :get()
    
    return {
        status = 200,
        body = { todos = todos }
    }
end
```

---

## 4. Plugin Development

### 4.1 Development Workflow

1. **Create Plugin Structure**
   - Create directory in `plugins/`
   - Add `manifest.yaml`
   - Add `main.lua`

2. **Develop Locally**
   - Write Lua code
   - Test with `bosa serve`
   - Check logs for errors

3. **Install Plugin**
   - Use `bosa plugin install <path>`
   - Or manually copy to `plugins/` directory

4. **Test Plugin**
   - Test routes via HTTP client (curl, Postman)
   - Test events via event publishing
   - Test real-time features via WebSocket

5. **Iterate**
   - Make changes
   - Restart server (or use hot reload in dev mode)
   - Test again

### 4.2 Hot Reload (Development Mode)

Enable hot reload for faster development:

```bash
# Set environment variable
export BOSA_DEV_MODE=true

# Or in config.yaml
plugins:
  hot_reload: true

# Start server
bosa serve

# Plugin changes auto-reload (no restart needed)
```

**Note:** Hot reload only reloads Lua scripts, not manifest changes (requires restart).

### 4.3 Plugin Installation Methods

#### Method 1: Local Directory

```bash
# Install from local directory
bosa plugin install ./path/to/my-plugin
```

#### Method 2: Zip File

```bash
# Install from zip file
bosa plugin install my-plugin.zip
```

**Zip File Structure:**
```
my-plugin.zip
└── my-plugin/          # Plugin name directory (optional)
    ├── manifest.yaml
    ├── main.lua
    └── assets/
```

**Or:**
```
my-plugin.zip
├── manifest.yaml       # Can be in root
├── main.lua
└── assets/
```

#### Method 3: Git Repository

```bash
# Install from git repository
bosa plugin install https://github.com/user/my-plugin.git

# Or with SSH
bosa plugin install git@github.com:user/my-plugin.git
```

**Requirements:**
- Repository must contain `manifest.yaml`
- Git must be installed on system
- Repository must be publicly accessible (or use SSH keys)

#### Method 4: UI Upload (Super Admin)

1. Navigate to `/plugins` page (Super Admin only)
2. Click "Choose File" and select plugin `.zip` file
3. Click "Install Plugin"
4. Plugin is automatically installed and loaded

**Benefits:**
- No server restart needed
- Automatic plugin loading
- Visual feedback during installation
- Error messages displayed in UI

### 4.4 Static File Serving

#### Directory Structure

```
plugins/my-plugin/
└── assets/
    ├── js/
    │   └── my-plugin.js
    ├── css/
    │   └── styles.css
    └── images/
        └── logo.png
```

#### Accessing Static Files

Static files are automatically served at:
```
/plugins/[plugin-name]/assets/[path]
```

**Examples:**
- `assets/js/my-plugin.js` → `/plugins/my-plugin/assets/js/my-plugin.js`
- `assets/css/styles.css` → `/plugins/my-plugin/assets/css/styles.css`
- `assets/images/logo.png` → `/plugins/my-plugin/assets/images/logo.png`

#### Using in Lua HTML

```lua
function renderPage(request)
    return {
        status = 200,
        headers = {
            ["Content-Type"] = "text/html"
        },
        body = [[
            <!DOCTYPE html>
            <html>
            <head>
                <link rel="stylesheet" href="/plugins/my-plugin/assets/css/styles.css">
            </head>
            <body>
                <h1>My Plugin</h1>
                <script src="/plugins/my-plugin/assets/js/my-plugin.js"></script>
            </body>
            </html>
        ]]
    }
end
```

**Important:**
- Static files are served automatically (no configuration needed) for Lua plugins
- For process-based plugins (Node.js, PHP, Go, Python): Static files can be served in two ways:
  1. **Automatic serving** (recommended): BOSA kernel automatically serves files from `assets/` directory at `/[plugin-name]/assets/[path]` (smart namespace, no `/plugins/` prefix)
  2. **Custom route handling**: Register routes in `manifest.yaml` to handle static assets programmatically (useful for dynamic content, caching headers, etc.)

#### Go Plugins - Static Asset Routes

For Go plugins that need custom handling of static assets (e.g., custom headers, authentication, or dynamic content), register a route in `manifest.yaml`:

```yaml
routes:
  - path: /assets/:filepath
    method: GET
    handler: StaticAssets
```

**Smart Namespace Routing:**
- Routes defined in manifest (e.g., `/assets/:filepath`) are automatically prefixed with plugin name
- The route `/assets/:filepath` becomes `/[plugin-name]/assets/:filepath` (no `/plugins/` prefix)
- In your Go handler, the request path will be the original path from the manifest (e.g., `/assets/index.js`)
- The `:filepath` parameter will capture everything after `/assets/`, including subdirectories and filenames
- Example: Request to `/todo/assets/js/app.js` matches route `/assets/:filepath` with `filepath` = `js/app.js`

**Alternative**: Static files in `assets/` directory are automatically served at `/[plugin-name]/assets/` without route definition.

**Example Go Handler:**
```go
http.HandleFunc("/assets/", func(w http.ResponseWriter, r *http.Request) {
    // Extract filepath parameter
    filepath := strings.TrimPrefix(r.URL.Path, "/assets/")
    
    // Serve file from assets directory
    http.ServeFile(w, r, filepath.Join(os.Getenv("BOSA_PLUGIN_PATH"), "assets", filepath))
})
```

### 4.5 Theme System

BOSA provides a theme system that allows apps to apply consistent visual styling and layouts. Themes are similar to WordPress themes - they provide CSS, JavaScript, images, and templates that can be applied to any BOSA app.

#### Theme Structure

A BOSA theme is a directory containing:

```
themes/
└── my-theme/
    ├── theme.yaml          # Theme manifest (required)
    ├── assets/
    │   ├── css/
    │   │   └── main.css
    │   ├── js/
    │   │   └── main.js
    │   └── images/
    │       └── logo.png
    └── templates/          # Optional template overrides
        └── header.html
```

#### Theme Manifest (theme.yaml)

Every theme must have a `theme.yaml` file in its root directory:

```yaml
name: my-theme
version: 1.0.0
description: A beautiful theme for BOSA apps
author: Your Name
parent: base-theme  # Optional: inherit from another theme

assets:
  css:
    - css/main.css
    - css/components.css
  js:
    - js/main.js
  images: images  # Default: "images"
  templates: templates  # Default: "templates"

config:
  primary_color: "#007bff"
  secondary_color: "#6c757d"
  # Custom configuration options
```

**Required Fields:**
- `name`: Unique theme name (must match directory name)
- `version`: Theme version (semantic versioning recommended)

**Optional Fields:**
- `description`: Theme description
- `author`: Theme author name
- `parent`: Parent theme name for inheritance
- `assets`: Asset paths configuration
- `config`: Theme configuration options

#### Theme Inheritance

Themes can inherit from parent themes. When a theme specifies a `parent`, it automatically includes all CSS and JS files from the parent theme, with child theme assets loaded after parent assets.

**Example:**

**Parent theme (base-theme/theme.yaml):**
```yaml
name: base-theme
version: 1.0.0
assets:
  css:
    - css/reset.css
    - css/base.css
```

**Child theme (my-theme/theme.yaml):**
```yaml
name: my-theme
version: 1.0.0
parent: base-theme
assets:
  css:
    - css/custom.css  # Loaded after parent CSS
```

When `my-theme` is applied, CSS files are loaded in this order:
1. `base-theme/css/reset.css`
2. `base-theme/css/base.css`
3. `my-theme/css/custom.css`

#### Applying Themes to Apps

Apps specify their theme in their `manifest.yaml`:

```yaml
name: my-app
version: 1.0.0
theme: my-theme  # Apply this theme to the app
runtime:
  type: go
  entry: main.go
```

#### Theme Asset URLs

Theme assets are served at:

```
/themes/<theme-name>/assets/<path>
```

**Examples:**
- `/themes/my-theme/assets/css/main.css`
- `/themes/my-theme/assets/js/main.js`
- `/themes/my-theme/assets/images/logo.png`

#### Using Themes in Apps

**Go Apps:**

In your Go app's HTML response, include theme assets:

```go
func Index(w http.ResponseWriter, r *http.Request) {
    themeName := "my-theme" // Get from app config or manifest
    
    html := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/themes/%s/assets/css/main.css">
    <script src="/themes/%s/assets/js/main.js"></script>
</head>
<body>
    <h1>My App</h1>
</body>
</html>
    `, themeName, themeName)
    
    w.Header().Set("Content-Type", "text/html")
    w.Write([]byte(html))
}
```

**Lua Apps:**

In Lua apps, use theme asset URLs:

```lua
function renderPage(request)
    local themeName = "my-theme"
    
    return {
        status = 200,
        headers = {
            ["Content-Type"] = "text/html"
        },
        body = string.format([[
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/themes/%s/assets/css/main.css">
</head>
<body>
    <h1>My App</h1>
</body>
</html>
        ]], themeName)
    }
end
```

#### Theme API

BOSA provides API endpoints for theme management:

**List All Themes:**
```http
GET /api/themes
Authorization: Bearer <token>
```

**Get Theme Details:**
```http
GET /api/themes/:name
Authorization: Bearer <token>
```

**Get Theme Asset URLs:**
```http
GET /api/themes/:name/assets
Authorization: Bearer <token>
```

**Get Theme HTML Head:**
```http
GET /api/themes/html/head?theme=my-theme
Authorization: Bearer <token>
```

Returns HTML `<head>` section with theme CSS and JS includes.

#### Best Practices

1. **Use Semantic Versioning**: Use version numbers like `1.0.0`, `1.1.0`, `2.0.0`
2. **Organize Assets**: Keep CSS, JS, and images in separate directories
3. **Minimize Dependencies**: Avoid external dependencies when possible
4. **Mobile-First**: Design themes to be mobile-responsive
5. **Documentation**: Include a README.md in your theme directory
6. **Test Inheritance**: Test themes with parent themes to ensure compatibility

For complete theme development documentation, see [THEME_DEVELOPMENT.md](THEME_DEVELOPMENT.md).

---

## 5. BOSA API Reference

### 5.1 Database API (`bosa.db`)

#### Query Builder

```lua
-- Create query builder
local query = bosa.db.query("table_name")

-- Chain methods
query:where("column", "=", value)
query:where("column", ">", value)
query:where("column", "<", value)
query:where("column", "!=", value)
query:where("column", "LIKE", pattern)
query:orderBy("column", "asc")   -- or "desc"
query:limit(10)
query:offset(20)

-- Execute query
local results = query:get()      -- Returns array of rows
local first = query:first()      -- Returns first row or nil
local count = query:count()      -- Returns count
```

#### CRUD Operations

```lua
-- Insert
local id = bosa.db.query("todos"):insert({
    title = "New Todo",
    status = "pending",
    user_id = 1
})
-- Returns: inserted ID

-- Update
bosa.db.query("todos")
    :where("id", "=", id)
    :update({
        status = "completed"
    })
-- Returns: number of rows affected

-- Delete
bosa.db.query("todos")
    :where("id", "=", id)
    :delete()
-- Returns: number of rows affected
```

#### Example: Complex Query

```lua
local todos = bosa.db.query("todos")
    :where("user_id", "=", 1)
    :where("status", "!=", "deleted")
    :orderBy("created_at", "desc")
    :limit(10)
    :offset(0)
    :get()

-- todos is an array of rows
-- Each row is a table with column names as keys
```

#### SDK Examples

**Node.js SDK:**
```javascript
const { BOSA } = require('bosa-sdk-node');
const bosa = new BOSA({...});

// Query
const items = await bosa.db.query('items').get();
const id = await bosa.db.query('items').insert({...});
await bosa.db.query('items').where('id', '=', id).update({...});
await bosa.db.query('items').where('id', '=', id).delete();
```

**PHP SDK:**
```php
use Bosa\BOSA;
$bosa = new BOSA([...]);

// Query
$items = $bosa->db->query('items')->get();
$id = $bosa->db->query('items')->insert([...]);
$bosa->db->query('items')->where('id', '=', $id)->update([...]);
$bosa->db->query('items')->where('id', '=', $id)->delete();
```

**Python SDK:**
```python
from bosa import BOSA
bosa = BOSA({...})

# Query
items = await bosa.db.query('items').get()
id = await bosa.db.query('items').insert({...})
await bosa.db.query('items').where('id', '=', id).update({...})
await bosa.db.query('items').where('id', '=', id).delete()
```

**Go SDK:**
```go
import "github.com/mmabdalla/BOSA/sdk/bosa-sdk-go"

bosa := bosa.NewBOSA(&bosa.Config{
    KernelURL:  "http://localhost:3000",
    PluginName: "my-plugin",
    PluginToken: "your-token",
})

// Query
items, err := bosa.DB.Query("items").Get()
if err != nil {
    log.Fatal(err)
}

// Insert
id, err := bosa.DB.Query("items").Insert(map[string]interface{}{
    "name": "Item 1",
    "status": "active",
})
if err != nil {
    log.Fatal(err)
}

// Update
affected, err := bosa.DB.Query("items").
    Where("id", "=", id).
    Update(map[string]interface{}{
        "status": "completed",
    })
if err != nil {
    log.Fatal(err)
}

// Delete
deleted, err := bosa.DB.Query("items").
    Where("id", "=", id).
    Delete()
if err != nil {
    log.Fatal(err)
}

// Complex query with conditions
items, err := bosa.DB.Query("items").
    Where("status", "=", "active").
    Where("user_id", "=", 1).
    OrderBy("created_at", "DESC").
    Limit(10).
    Offset(0).
    Get()
if err != nil {
    log.Fatal(err)
}

// Get first result
item, err := bosa.DB.Query("items").
    Where("id", "=", 1).
    First()
if err != nil {
    log.Fatal(err)
}

// Count
count, err := bosa.DB.Query("items").
    Where("status", "=", "pending").
    Count()
if err != nil {
    log.Fatal(err)
}
```

### 5.2 Event API (`bosa.events`)

#### Subscribe to Events

```lua
-- Subscribe to event
bosa.events.on("event.name", function(event)
    -- event.data contains event payload
    bosa.log.info("Event received: " .. event.name)
    bosa.log.info("Data: " .. json.encode(event.data))
end)
```

#### Publish Events

```lua
-- Publish event
bosa.events.publish("event.name", {
    key1 = "value1",
    key2 = "value2"
})
```

#### Example: Event-Driven Todo

```lua
-- In init() function
bosa.events.on("todo.created", function(event)
    bosa.log.info("New todo created: " .. event.data.todo_id)
    -- Send notification, update cache, etc.
end)

-- In createTodo handler
function createTodo(request)
    local id = bosa.db.query("todos"):insert(request.body)
    
    -- Publish event
    bosa.events.publish("todo.created", {
        todo_id = id,
        user_id = request.user.id
    })
    
    return {
        status = 201,
        body = { id = id }
    }
end
```

#### SDK Examples

**Node.js SDK:**
```javascript
const { BOSA } = require('bosa-sdk-node');
const bosa = new BOSA({...});

// Subscribe
bosa.events.on('user.created', (event) => {
    console.log('User created:', event.payload);
});

// Publish
await bosa.events.publish('todo.created', {
    todoId: 123,
    userId: 456,
});
```

**PHP SDK:**
```php
use Bosa\BOSA;
$bosa = new BOSA([...]);

// Subscribe
$bosa->events->on('user.created', function($event) {
    echo "User created: " . json_encode($event['payload']);
});

// Publish
$bosa->events->publish('todo.created', [
    'todoId' => 123,
    'userId' => 456,
]);
```

**Python SDK:**
```python
from bosa import BOSA
bosa = BOSA({...})

# Subscribe
bosa.events.on('user.created', lambda event: print(f"User created: {event['payload']}"))

# Publish
await bosa.events.publish('todo.created', {
    'todoId': 123,
    'userId': 456,
})
```

**Go SDK:**
```go
import "github.com/mmabdalla/BOSA/sdk/bosa-sdk-go"

bosa := bosa.NewBOSA(&bosa.Config{
    KernelURL:  "http://localhost:3000",
    PluginName: "my-plugin",
    PluginToken: "your-token",
})

// Subscribe
bosa.Events.On("user.created", func(event bosa.Event) {
    log.Printf("User created: %v", event.Payload)
})

// Publish
err := bosa.Events.Publish("todo.created", map[string]interface{}{
    "todoId": 123,
    "userId": 456,
})
if err != nil {
    log.Fatal(err)
}
```

### 5.3 Logging API (`bosa.log`)

**⚠️ CRITICAL: Error Logging Requirements**

All plugins **MUST** properly log errors and warnings. The BOSA error notification system automatically monitors logs and notifies super admin users when errors occur. Failure to log errors properly may result in critical issues going unnoticed.

#### Log Levels

```lua
-- Log levels (ordered by severity)
bosa.log.info("Informational message")    -- General information
bosa.log.warn("Warning message")          -- Warning conditions (triggers notification)
bosa.log.error("Error message")           -- Error conditions (triggers notification)
```

**Important:**
- `error` and `warn` level logs **automatically trigger notifications** to super admin users
- Notifications include a direct link to the log entry in the `/logs` page
- Duplicate notifications for the same error are prevented automatically
- Logs are stored in memory buffer and written to log files (in production mode)

#### Error Logging Requirements

**1. Always Log Errors with Context**

```lua
-- ❌ BAD: Vague error message
bosa.log.error("Error occurred")

-- ✅ GOOD: Detailed error with context
bosa.log.error("Database query failed: " .. tostring(err) .. " | Table: todos | User: " .. user_id)
```

**2. Log Errors Before Returning Error Responses**

```lua
function createTodo(request)
    local result, err = pcall(function()
        return bosa.db.query("todos"):insert(request.body)
    end)
    
    if not result then
        -- ✅ MUST log error before returning
        bosa.log.error("Failed to create todo: " .. tostring(err) .. " | User: " .. request.user.id)
        return {
            status = 500,
            body = { error = "Internal server error" }
        }
    end
    
    return {
        status = 201,
        body = { id = result }
    }
end
```

**3. Use Appropriate Log Levels**

```lua
-- ✅ Use 'error' for actual errors that need attention
if database_connection_failed then
    bosa.log.error("Database connection failed: " .. error_message)
end

-- ✅ Use 'warn' for recoverable issues or potential problems
if api_rate_limit_approaching then
    bosa.log.warn("API rate limit approaching: " .. remaining_requests .. " requests left")
end

-- ✅ Use 'info' for normal operations (does not trigger notifications)
bosa.log.info("Todo created successfully: " .. todo_id)
```

**4. Include Source Information**

The log system automatically includes the plugin name as the source. However, you can add additional context:

```lua
-- ✅ Include relevant context in error message
bosa.log.error("Payment processing failed | Order ID: " .. order_id .. " | Amount: " .. amount .. " | Error: " .. error_message)
```

#### Example: Proper Error Handling

```lua
function getTodo(request)
    local id = request.params.id
    
    -- Validate input
    if not id then
        bosa.log.warn("Missing id parameter in getTodo request | Path: " .. request.path)
        return {
            status = 400,
            body = { error = "Missing id parameter" }
        }
    end
    
    -- Try to fetch todo
    local todo, err = pcall(function()
        return bosa.db.query("todos")
            :where("id", "=", id)
            :first()
    end)
    
    if not todo then
        -- ✅ Log database error
        bosa.log.error("Database query failed in getTodo: " .. tostring(err) .. " | Todo ID: " .. id)
        return {
            status = 500,
            body = { error = "Internal server error" }
        }
    end
    
    if not todo then
        bosa.log.warn("Todo not found: " .. id .. " | User: " .. (request.user and request.user.id or "anonymous"))
        return {
            status = 404,
            body = { error = "Todo not found" }
        }
    end
    
    bosa.log.info("Returning todo: " .. id)
    return {
        status = 200,
        body = todo
    }
end
```

#### Error Notification System

**How It Works:**

1. **Automatic Monitoring:** BOSA monitors the log buffer every 2 seconds for new error and warning entries
2. **Super Admin Notification:** When an error or warning is detected, notifications are automatically created for all super admin users
3. **Notification Details:**
   - **Title:** "System Error" or "System Warning" (+ source if available)
   - **Message:** Truncated error message (max 200 characters)
   - **Link:** Direct link to the log entry (`/logs?level=error&id=<log_id>`)
   - **Metadata:** Includes log_id, log_level, log_source, and timestamp
4. **Duplicate Prevention:** The system prevents duplicate notifications for the same log entry
5. **Access:** Super admins receive notifications in the notification bell icon and can click to view the error in the logs page

**Viewing Error Logs:**

- **Via UI:** Navigate to `/logs` page (requires authentication)
- **Via Notification:** Click the notification link to jump directly to the error entry
- **Via CLI:** Use `bosa logs <plugin-name>` to view plugin-specific logs
- **Via API:** `GET /api/logs?level=error` to fetch error logs programmatically

**Best Practices:**

1. **Always log errors immediately** - Don't wait or batch error logs
2. **Include context** - Add relevant information (user ID, resource ID, operation type)
3. **Use structured messages** - Format: `"Operation failed | Context: value | Error: message"`
4. **Don't log sensitive data** - Never log passwords, tokens, or personal information
5. **Test error logging** - Verify that errors appear in logs and trigger notifications

#### Logging in Multi-Language Plugins

**Node.js (bosa-sdk-node):**
```javascript
// SDK provides logging methods
const { BOSA } = require('bosa-sdk-node');
const plugin = new BOSA();

// Log errors (automatically captured by BOSA)
plugin.log.error('Database connection failed', { 
    table: 'todos', 
    userId: req.user.id 
});

plugin.log.warn('API rate limit approaching', { 
    remaining: 10 
});

plugin.log.info('Operation completed successfully');
```

**PHP (bosa-sdk-php):**
```php
// SDK provides logging methods
use Bosa\BOSA;

$plugin = new BOSA();

// Log errors (automatically captured by BOSA)
$plugin->log->error('Database connection failed', [
    'table' => 'todos',
    'userId' => $req->user->id
]);

$plugin->log->warn('API rate limit approaching', [
    'remaining' => 10
]);

$plugin->log->info('Operation completed successfully');
```

**Python (bosa-sdk-python):**
```python
# SDK provides logging methods
from bosa import BOSA

plugin = BOSA()

# Log errors (automatically captured by BOSA)
plugin.log.error('Database connection failed', {
    'table': 'todos',
    'userId': req.user.id
})

plugin.log.warn('API rate limit approaching', {
    'remaining': 10
})

plugin.log.info('Operation completed successfully')
```

**Go (bosa-sdk-go):**
```go
// SDK provides logging methods
import "github.com/bosa/bosa-sdk-go"

plugin := bosa.New()

// Log errors (automatically captured by BOSA)
plugin.Log().Error("Database connection failed", map[string]interface{}{
    "table": "todos",
    "userId": req.User.ID,
})

plugin.Log().Warn("API rate limit approaching", map[string]interface{}{
    "remaining": 10,
})

plugin.Log().Info("Operation completed successfully")
```

**Note:** All SDK logging methods automatically send logs to the BOSA kernel's log buffer, which triggers the error notification system.

#### Plugin Logging Endpoint (Process-Based Plugins)

For process-based plugins (Node.js, PHP, Python, Go) that need to send logs directly via HTTP (when SDK is not available or for custom implementations), use the plugin logging endpoint:

**Endpoint:** `POST /api/plugins/:name/logs`

**Authentication:** Requires plugin authentication token (`X-BOSA-Plugin-Token` header)

**Request Body:**
```json
{
  "level": "error",           // Required: "error", "warn", "info", or "debug"
  "message": "Error message", // Required: Log message
  "source": "my-module",      // Optional: Source identifier (defaults to "plugin-{name}")
  "data": {                   // Optional: Additional context data
    "userId": 123,
    "action": "login"
  }
}
```

**Response:**
```json
{
  "success": true,
  "level": "error"
}
```

**Example: Node.js (using HTTP client)**
```javascript
const axios = require('axios');

async function logError(message, data = {}) {
  try {
    await axios.post(
      `${process.env.BOSA_KERNEL_URL}/api/plugins/${process.env.PLUGIN_NAME}/logs`,
      {
        level: 'error',
        message: message,
        source: 'my-module',
        data: data
      },
      {
        headers: {
          'X-BOSA-Plugin-Token': process.env.BOSA_KERNEL_TOKEN,
          'X-BOSA-Plugin-Name': process.env.PLUGIN_NAME,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    // Fallback to console if API call fails
    console.error('Failed to send log to BOSA kernel:', error.message);
    console.error('Original error:', message, data);
  }
}

// Usage
await logError('Database connection failed', {
  table: 'todos',
  userId: 123
});
```

**Example: PHP (using cURL)**
```php
function logError($message, $data = []) {
    $kernelURL = $_ENV['BOSA_KERNEL_URL'] ?? 'http://localhost:3000';
    $pluginName = $_ENV['PLUGIN_NAME'] ?? '';
    $pluginToken = $_ENV['BOSA_KERNEL_TOKEN'] ?? '';
    
    $ch = curl_init("{$kernelURL}/api/plugins/{$pluginName}/logs");
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            "X-BOSA-Plugin-Token: {$pluginToken}",
            "X-BOSA-Plugin-Name: {$pluginName}",
        ],
        CURLOPT_POSTFIELDS => json_encode([
            'level' => 'error',
            'message' => $message,
            'source' => 'my-module',
            'data' => $data
        ])
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        // Fallback to error_log if API call fails
        error_log("Failed to send log to BOSA kernel (HTTP {$httpCode}): {$message}");
        error_log("Data: " . json_encode($data));
    }
}

// Usage
logError('Database connection failed', [
    'table' => 'todos',
    'userId' => 123
]);
```

**Example: Python (using requests)**
```python
import os
import requests
import json

def log_error(message, data=None):
    kernel_url = os.getenv('BOSA_KERNEL_URL', 'http://localhost:3000')
    plugin_name = os.getenv('PLUGIN_NAME', '')
    plugin_token = os.getenv('BOSA_KERNEL_TOKEN', '')
    
    try:
        response = requests.post(
            f'{kernel_url}/api/plugins/{plugin_name}/logs',
            json={
                'level': 'error',
                'message': message,
                'source': 'my-module',
                'data': data or {}
            },
            headers={
                'Content-Type': 'application/json',
                'X-BOSA-Plugin-Token': plugin_token,
                'X-BOSA-Plugin-Name': plugin_name
            },
            timeout=5
        )
        response.raise_for_status()
    except Exception as e:
        # Fallback to print if API call fails
        print(f'Failed to send log to BOSA kernel: {e}')
        print(f'Original error: {message} | Data: {data}')

# Usage
log_error('Database connection failed', {
    'table': 'todos',
    'userId': 123
})
```

**Important Notes:**
- The endpoint requires plugin authentication (plugin token and name)
- Logs are automatically added to BOSA's log buffer
- Error and warning level logs trigger super admin notifications
- Always include fallback logging (console/print/error_log) in case the API call fails
- The endpoint is protected by location restriction middleware (if enabled)
- Use SDK logging methods when available (they handle the API calls automatically)

### 5.4 Configuration API (`bosa.config`)

#### Get Configuration Value

```lua
-- Get a configuration value for this plugin
local apiKey = bosa.config.get("my-plugin", "api_key")
-- Returns: value or nil if not set
```

#### Set Configuration Value

```lua
-- Set a configuration value
bosa.config.set("my-plugin", "api_key", "secret-key-123")
-- Saves to database (persistent across restarts)
```

#### Delete Configuration Value

```lua
-- Delete a configuration value
bosa.config.delete("my-plugin", "api_key")
```

#### Get All Configuration

```lua
-- Get all configuration for this plugin
local config = bosa.config.getAll("my-plugin")
-- Returns: table with all config keys and values
-- Example: { api_key = "secret", timeout = "30" }
```

#### Example: Plugin Configuration

```lua
function init()
    -- Load configuration
    local apiKey = bosa.config.get("my-plugin", "api_key")
    local timeout = bosa.config.get("my-plugin", "timeout") or "30"
    
    if not apiKey then
        bosa.log.warn("API key not configured. Please set it in plugin settings.")
    end
    
    return true
end

function updateSettings(request)
    -- Update configuration from API
    bosa.config.set("my-plugin", "api_key", request.body.api_key)
    bosa.config.set("my-plugin", "timeout", request.body.timeout)
    
    return {
        status = 200,
        body = { message = "Settings updated" }
    }
end
```

**Configuration Storage:**
- Stored in `plugin_config` table in database
- Isolated per plugin (plugin_name + config_key)
- Persistent across server restarts
- Accessible via REST API: `GET /api/plugins/:name/config`

#### SDK Examples

**Node.js SDK:**
```javascript
const { BOSA } = require('bosa-sdk-node');
const bosa = new BOSA({...});

// Get config
const value = await bosa.config.get('setting_key');

// Set config
await bosa.config.set('setting_key', 'value');

// Delete config
await bosa.config.delete('setting_key');

// Get all config
const allConfig = await bosa.config.getAll();
```

**PHP SDK:**
```php
use Bosa\BOSA;
$bosa = new BOSA([...]);

// Get config
$value = $bosa->config->get('setting_key');

// Set config
$bosa->config->set('setting_key', 'value');

// Delete config
$bosa->config->delete('setting_key');

// Get all config
$allConfig = $bosa->config->all();
```

**Python SDK:**
```python
from bosa import BOSA
bosa = BOSA({...})

# Get config
value = await bosa.config.get('setting_key')

# Set config
await bosa.config.set('setting_key', 'value')

# Delete config
await bosa.config.delete('setting_key')

# Get all config
all_config = await bosa.config.get_all()
```

**Go SDK:**
```go
import "github.com/mmabdalla/BOSA/sdk/bosa-sdk-go"

bosa := bosa.NewBOSA(&bosa.Config{
    KernelURL:  "http://localhost:3000",
    PluginName: "my-plugin",
    PluginToken: "your-token",
})

// Get config
value, err := bosa.Config.Get("setting_key")
if err != nil {
    log.Fatal(err)
}

// Set config
err = bosa.Config.Set("setting_key", "value")
if err != nil {
    log.Fatal(err)
}

// Delete config
err = bosa.Config.Delete("setting_key")
if err != nil {
    log.Fatal(err)
}

// Get all config
allConfig, err := bosa.Config.GetAll()
if err != nil {
    log.Fatal(err)
}

// Clear cache
bosa.Config.ClearCache()
```

### 5.5 Real-Time API (`bosa.realtime`)

#### Broadcast to WebSocket Clients

```lua
-- Broadcast event to all connected clients
bosa.realtime.broadcast("channel.name", {
    key1 = "value1",
    key2 = "value2"
})
```

#### Example: Real-Time Todo Updates

```lua
function updateTodo(request)
    local id = request.params.id
    
    -- Update database
    bosa.db.query("todos")
        :where("id", "=", id)
        :update(request.body)
    
    -- Get updated todo
    local todo = bosa.db.query("todos")
        :where("id", "=", id)
        :first()
    
    -- Broadcast to WebSocket clients
    bosa.realtime.broadcast("todo.updated", {
        todo_id = id,
        todo = todo
    })
    
    return {
        status = 200,
        body = todo
    }
end
```

#### SDK Examples

**Node.js SDK:**
```javascript
const { BOSA } = require('bosa-sdk-node');
const bosa = new BOSA({...});

// Connect to WebSocket
await bosa.realtime.connect();

// Broadcast
await bosa.realtime.broadcast('channel', { message: 'Hello' });

// Send to user
await bosa.realtime.sendToUser('user123', { message: 'Hello' });

// Subscribe
bosa.realtime.on('channel', (message) => {
    console.log('Received:', message);
});

// Disconnect
await bosa.realtime.disconnect();
```

**PHP SDK:**
```php
use Bosa\BOSA;
$bosa = new BOSA([...]);

// Connect (placeholder - WebSocket support pending)
$bosa->realtime->connect();

// Broadcast
$bosa->realtime->broadcast('channel', ['message' => 'Hello']);

// Send to user
$bosa->realtime->sendToUser('user123', ['message' => 'Hello']);

// Subscribe (local handler)
$bosa->realtime->on('channel', function($message) {
    echo "Received: " . json_encode($message);
});
```

**Python SDK:**
```python
from bosa import BOSA
bosa = BOSA({...})

# Connect to WebSocket
await bosa.realtime.connect()

# Broadcast
await bosa.realtime.broadcast('channel', {'message': 'Hello'})

# Send to user
await bosa.realtime.send_to_user('user123', {'message': 'Hello'})

# Subscribe
bosa.realtime.on('channel', lambda message: print(f"Received: {message}"))

# Disconnect
await bosa.realtime.disconnect()
```

**Go SDK:**
```go
import "github.com/mmabdalla/BOSA/sdk/bosa-sdk-go"

bosa := bosa.NewBOSA(&bosa.Config{
    KernelURL:  "http://localhost:3000",
    PluginName: "my-plugin",
    PluginToken: "your-token",
})

// Connect (placeholder - WebSocket support pending)
err := bosa.Realtime.Connect()
if err != nil {
    log.Fatal(err)
}

// Broadcast
err = bosa.Realtime.Broadcast("channel", map[string]interface{}{
    "message": "Hello",
})
if err != nil {
    log.Fatal(err)
}

// Send to user
err = bosa.Realtime.SendToUser("user123", map[string]interface{}{
    "message": "Hello",
})
if err != nil {
    log.Fatal(err)
}

// Subscribe (local handler)
bosa.Realtime.On("channel", func(message bosa.RealtimeMessage) {
    log.Printf("Received: %v", message.Message)
})

// Check connection status
connected := bosa.Realtime.IsConnected()

// Disconnect
err = bosa.Realtime.Disconnect()
if err != nil {
    log.Fatal(err)
}
```

### 5.6 I18n Translation API (`bosa.i18n`)

BOSA provides built-in internationalization (i18n) support for translating your app content into multiple languages. The SDKs provide a simple API for retrieving translations with automatic language detection, parameter interpolation, and caching.

#### Basic Translation

**Node.js (bosa-sdk-node):**
```javascript
const bosa = require('bosa-sdk-node');

const plugin = new bosa.BOSA({
  pluginName: 'my-plugin',
  pluginToken: process.env.BOSA_KERNEL_TOKEN
});

// Translate a key
const greeting = await plugin.i18n.t('ui.greeting');
// Returns: "Hello" (or translated value based on current language)

// With parameters
const message = await plugin.i18n.t('ui.welcome', { name: 'John' });
// Translation: "Welcome {name}" → "Welcome John"
```

**PHP (bosa-sdk-php):**
```php
use Bosa\BOSA;

$plugin = new BOSA([
    'pluginName' => 'my-plugin',
    'pluginToken' => $_ENV['BOSA_KERNEL_TOKEN']
]);

// Translate a key
$greeting = $plugin->i18n->t('ui.greeting');

// With parameters
$message = $plugin->i18n->t('ui.welcome', ['name' => 'John']);
```

**Python (bosa-sdk-python):**
```python
from bosa import BOSA

plugin = BOSA({
    'pluginName': 'my-plugin',
    'pluginToken': os.getenv('BOSA_KERNEL_TOKEN')
})

# Translate a key (async)
greeting = await plugin.i18n.t('ui.greeting')

# With parameters
message = await plugin.i18n.t('ui.welcome', {'name': 'John'})
```

**Go (bosa-sdk-go):**
```go
import "github.com/mmabdalla/BOSA/sdk/bosa-sdk-go"

plugin := bosa.NewBOSA(&bosa.Config{
    PluginName: "my-plugin",
    PluginToken: os.Getenv("BOSA_KERNEL_TOKEN"),
})

// Translate a key
greeting, err := plugin.I18n().T("ui.greeting", nil)

// With parameters
message, err := plugin.I18n().T("ui.welcome", map[string]interface{}{
    "name": "John",
})
```

**Lua Runtime:**
```lua
-- Translate a key
local greeting = bosa.i18n.t("ui.greeting")
-- Returns: "Hello" (or translated value based on current language)

-- With parameters
local message = bosa.i18n.t("ui.welcome", { name = "John" })
-- Translation: "Welcome {name}" → "Welcome John"

-- Get current language
local lang = bosa.i18n.getCurrentLanguage()
-- Returns: "en" (or current language code)

-- Set language (for this request)
bosa.i18n.setLanguage("es")

-- List available languages
local languages = bosa.i18n.listLanguages()
for i, lang in ipairs(languages) do
    print(string.format("%s (%s): %s", lang.name, lang.code, lang.native_name))
end

-- Get app's default language
local defaultLang = bosa.i18n.getDefaultLanguage()
print("Default language: " .. defaultLang)
```

#### Language Management

**Set Current Language:**
```javascript
// Node.js
plugin.i18n.setLanguage('es');

// PHP
$plugin->i18n->setLanguage('es');

// Python
plugin.i18n.set_language('es')

// Go
plugin.I18n().SetLanguage("es")
```

**Detect Language from Request:**
```javascript
// Node.js - detect from Accept-Language header
const language = plugin.i18n.detectLanguage(req.headers['accept-language']);
plugin.i18n.setLanguage(language);
```

**PHP:**
```php
$language = $plugin->i18n->detectLanguage($_SERVER['HTTP_ACCEPT_LANGUAGE']);
$plugin->i18n->setLanguage($language);
```

**Python:**
```python
language = plugin.i18n.detect_language(request.headers.get('Accept-Language'))
plugin.i18n.set_language(language)
```

**Go:**
```go
language := plugin.I18n().DetectLanguage(r.Header.Get("Accept-Language"))
plugin.I18n().SetLanguage(language)
```

#### Parameter Interpolation

Translations support parameter interpolation using `{key}` or `{{key}}` syntax:

```javascript
// Translation stored: "Hello {name}, you have {count} messages"
const message = await plugin.i18n.t('ui.message', {
  name: 'John',
  count: 5
});
// Returns: "Hello John, you have 5 messages"
```

#### Caching

Translations are automatically cached for performance. Cache is cleared when language changes:

```javascript
// Clear cache manually
plugin.i18n.clearCache();

// Preload translations (useful for bulk loading)
await plugin.i18n.preload([
  'ui.greeting',
  'ui.button.save',
  'ui.button.cancel',
  'ui.message.welcome'
]);
```

#### Translation Key Format

Translation keys must follow the `namespace.key` format:
- ✅ Valid: `ui.button.save`, `messages.welcome`, `errors.validation.required`
- ❌ Invalid: `button-save`, `welcome`, `button save`

#### Managing Translations

Translations are managed via the BOSA admin panel or API:

**API Endpoints:**
- `POST /api/apps/:name/i18n/translations` - Create translation
- `PUT /api/apps/:name/i18n/translations/:key` - Update translation
- `DELETE /api/apps/:name/i18n/translations/:key` - Delete translation
- `GET /api/apps/:name/i18n/translations` - List translations (with filtering)

**Example - Creating Translations via API:**
```bash
curl -X POST http://localhost:3000/api/apps/my-plugin/i18n/translations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "ui.greeting",
    "language_code": "en",
    "value": "Hello",
    "namespace": "ui"
  }'
```

#### Complete Example

**Node.js Plugin with i18n:**
```javascript
const bosa = require('bosa-sdk-node');
const express = require('express');

const plugin = new bosa.BOSA({
  pluginName: 'my-plugin',
  pluginToken: process.env.BOSA_KERNEL_TOKEN
});

const app = express();

app.get('/greeting', async (req, res) => {
  // Detect language from request
  const language = plugin.i18n.detectLanguage(req.headers['accept-language']);
  plugin.i18n.setLanguage(language);
  
  // Get translated greeting
  const greeting = await plugin.i18n.t('ui.greeting');
  const welcome = await plugin.i18n.t('ui.welcome', { 
    name: req.user.name 
  });
  
  res.json({ greeting, welcome });
});
```

**Note:** Translations are automatically cached for 5 minutes by default. The cache is cleared when the language changes to ensure fresh translations.

#### Right-to-Left (RTL) Layout Support

BOSA provides automatic Right-to-Left (RTL) layout support for languages that read from right to left, such as Arabic, Hebrew, Urdu, and Persian. The RTL support is automatically applied based on the language's RTL flag in the system.

**How It Works:**

1. **Automatic Detection:** When a user selects an RTL language (or the browser detects one), BOSA automatically:
   - Sets the HTML `dir="rtl"` attribute
   - Applies RTL-aware CSS classes
   - Mirrors layout elements (navigation, buttons, forms, etc.)

2. **Language RTL Flag:** Each language in the system has an `rtl` boolean flag that indicates whether it's a right-to-left language. This flag is stored in the `languages` database table.

3. **Frontend Support:** All BOSA templates include:
   - `rtl-support.js` - JavaScript utility for RTL detection and application
   - `rtl-styles.css` - Comprehensive RTL-aware CSS styles

**Checking RTL Status in SDKs:**

**Node.js:**
```javascript
// Get language information including RTL flag
const langInfo = await plugin.i18n.getLanguageInfo('ar');
console.log(langInfo.rtl); // true for Arabic

// Check if current language is RTL
const isRTL = await plugin.i18n.isRTL();
console.log(isRTL); // true or false
```

**PHP:**
```php
// Language info is available in the API response
$languages = $plugin->client->get('/api/i18n/languages');
foreach ($languages as $lang) {
    if ($lang['code'] === 'ar') {
        echo $lang['rtl']; // true for Arabic
    }
}
```

**Python:**
```python
# Language info is available in the API response
languages = await plugin.client.get('/api/i18n/languages')
for lang in languages:
    if lang['code'] == 'ar':
        print(lang['rtl'])  # True for Arabic
```

**Go:**
```go
// Language info is available in the API response
languages, _ := plugin.Client().Get("/api/i18n/languages")
for _, lang := range languages {
    if lang["code"] == "ar" {
        fmt.Println(lang["rtl"]) // true for Arabic
    }
}
```

**Lua:**
```lua
-- Get language information
local languages = bosa.i18n.listLanguages()
for i, lang in ipairs(languages) do
    if lang.code == "ar" then
        print(lang.rtl) -- true for Arabic
    end
end
```

**Frontend RTL Support:**

For frontend applications, BOSA provides a global `rtlSupport` object:

```javascript
// Check if current language is RTL
if (window.rtlSupport && window.rtlSupport.isRTLLanguage()) {
    console.log('Current language is RTL');
}

// Get current language code
const currentLang = window.rtlSupport.getCurrentLanguage();

// Set language (will automatically apply RTL if needed)
await window.rtlSupport.setLanguage('ar');

// Listen for RTL changes
document.addEventListener('rtl-changed', (event) => {
    console.log('RTL changed:', event.detail.isRTL);
    console.log('Language:', event.detail.language);
});
```

**RTL-Aware CSS Classes:**

BOSA's RTL styles automatically handle:
- **Flexbox layouts:** Row directions are reversed
- **Text alignment:** Left/right are swapped
- **Spacing:** Margins and padding are mirrored
- **Positioning:** Left/right positioning is swapped
- **Forms:** Input fields align to the right
- **Tables:** Table cells align to the right
- **Navigation:** Menu items flow from right to left

**Best Practices:**

1. **Use Logical Properties:** When writing custom CSS, prefer logical properties (`margin-inline-start` instead of `margin-left`) for better RTL support.

2. **Test with RTL Languages:** Always test your app with Arabic or Hebrew to ensure proper layout.

3. **Icons and Images:** Some icons may need mirroring in RTL. Use CSS transforms or provide RTL-specific versions.

4. **Numbers and Code:** Numbers and code blocks should remain LTR even in RTL layouts. BOSA handles this automatically.

5. **API Responses:** The language API (`/api/i18n/languages`) includes the `rtl` flag for each language, allowing you to conditionally adjust your UI.

**Example - Conditional UI Based on RTL:**

```javascript
// In your frontend code
const langInfo = await fetch('/api/i18n/languages').then(r => r.json());
const currentLang = langInfo.find(l => l.code === 'ar');

if (currentLang && currentLang.rtl) {
    // Apply RTL-specific styling or logic
    document.body.classList.add('rtl-mode');
}
```

#### Automated Translation Service

BOSA provides an **automated translation service** that uses AI-powered translation providers (Google Translate, DeepL, OpenAI) to generate translation proposals. This service helps you quickly translate your app content into multiple languages with a review workflow.

**Features:**
- **Multiple Providers:** Google Translate, DeepL, OpenAI
- **Quality Scoring:** Automatic quality assessment for each translation
- **Review Workflow:** Proposals can be approved or rejected before being applied
- **Cost Tracking:** Monitor translation costs per provider and app
- **Auto-Approve Option:** Optionally auto-approve high-quality translations

**Prerequisites:**
- Translation provider API key (see [Google Translate API Instructions](Google_Translate_API_Instructions.md))
- Source translations must exist in your app's default language
- Target languages must be enabled for your app

**API Endpoints:**

**Request Translation:**
```bash
POST /api/apps/:name/i18n/translate
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "keys": ["ui.greeting", "ui.button.save"],
  "source_language": "en",
  "target_languages": ["es", "fr"],
  "provider": "google",
  "auto_approve": false
}
```

**Response:**
```json
{
  "success": true,
  "app_name": "my-plugin",
  "proposals": [
    {
      "id": 1,
      "key": "ui.greeting",
      "source_language_code": "en",
      "target_language_code": "es",
      "source_value": "Hello",
      "proposed_value": "Hola",
      "status": "pending",
      "provider": "google",
      "quality_score": 0.95,
      "cost_usd": 0.0001
    }
  ],
  "count": 2
}
```

**List Translation Proposals:**
```bash
GET /api/apps/:name/i18n/proposals?status=pending&lang=es
Authorization: Bearer YOUR_TOKEN
```

**Approve Proposal:**
```bash
POST /api/apps/:name/i18n/proposals/:id/approve
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "notes": "Looks good!"
}
```

**Reject Proposal:**
```bash
POST /api/apps/:name/i18n/proposals/:id/reject
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "notes": "Translation quality is poor"
}
```

**Get Translation Costs:**
```bash
GET /api/apps/:name/i18n/costs?start_date=2025-12-01&end_date=2025-12-31
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "app_name": "my-plugin",
  "costs": [
    {
      "id": 1,
      "provider": "google",
      "date": "2025-12-03",
      "character_count": 5000,
      "request_count": 10,
      "cost_usd": 0.10
    }
  ],
  "count": 1
}
```

**Using the UI:**

1. Navigate to **Plugins** page (Super Admin only)
2. Click **"Translations"** button on any enabled plugin
3. Click **"Request New Translation"**
4. Enter translation keys (comma-separated) and select target languages
5. Choose translation provider (Google Translate, DeepL, or OpenAI)
6. Optionally enable **"Auto-Approve"** for high-quality translations
7. Click **"Request Translation"**
8. Review proposals in the proposals list
9. Approve or reject proposals as needed

**Translation Providers:**

**Google Translate:**
- **API Key:** Set `GOOGLE_TRANSLATE_API_KEY` environment variable
- **Cost:** $20 per million characters (500K free tier/month)
- **Quality:** Good for general translations
- **Setup:** See [Google Translate API Instructions](Google_Translate_API_Instructions.md)

**DeepL:**
- **API Key:** Set `DEEPL_API_KEY` environment variable
- **Cost:** €4.99/month for 500K characters (free tier available)
- **Quality:** Excellent for European languages
- **Setup:** Sign up at https://www.deepl.com/pro-api

**OpenAI:**
- **API Key:** Set `OPENAI_API_KEY` environment variable
- **Cost:** Varies by model (GPT-3.5-turbo recommended)
- **Quality:** Excellent for context-aware translations
- **Setup:** Get API key from https://platform.openai.com/api-keys

**Quality Scoring:**

Each translation proposal includes a quality score (0.0 to 1.0) based on:
- Length similarity between source and translation
- Placeholder preservation (`{name}` → `{name}`)
- Character ratio analysis

**Best Practices:**

1. **Review Before Approving:** Always review proposals, especially for important UI text
2. **Use Auto-Approve Sparingly:** Only enable for non-critical content or high-confidence translations
3. **Monitor Costs:** Check translation costs regularly to stay within budget
4. **Choose Right Provider:** 
   - Google Translate: Best for general use, good free tier
   - DeepL: Best for European languages, excellent quality
   - OpenAI: Best for context-aware translations, higher cost
5. **Batch Requests:** Request multiple keys at once for efficiency
6. **Source Language:** Ensure source translations are accurate and complete

**Example - Requesting Translations via API:**

```bash
# Request translations for multiple keys
curl -X POST http://localhost:3000/api/apps/my-plugin/i18n/translate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "keys": ["ui.greeting", "ui.button.save", "ui.button.cancel"],
    "source_language": "en",
    "target_languages": ["es", "fr", "de"],
    "provider": "google"
  }'

# List pending proposals
curl http://localhost:3000/api/apps/my-plugin/i18n/proposals?status=pending \
  -H "Authorization: Bearer YOUR_TOKEN"

# Approve a proposal
curl -X POST http://localhost:3000/api/apps/my-plugin/i18n/proposals/1/approve \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Approved"}'

# Check translation costs
curl http://localhost:3000/api/apps/my-plugin/i18n/costs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Note:** The automated translation service requires API keys to be configured. Translations are created as proposals that must be reviewed and approved before being applied to your app. This ensures quality control and allows you to review translations before they go live.

### 5.7 Messaging API (REST)

**BOSA provides a comprehensive messaging system** that allows apps to enable users to communicate with each other in private conversations, groups, and channels. This is a **core BOSA infrastructure service** accessible via REST API endpoints.

**Base URL:** `http://localhost:3000` (or your BOSA server URL)

**Authentication:** All endpoints require JWT authentication (same as other BOSA APIs)

#### Overview

The messaging system supports:
- **Private conversations** (1-on-1 messaging)
- **Group conversations** (private groups)
- **Public channels** (public messaging spaces)
- **Real-time delivery** via WebSocket
- **Message types:** text, image, file, voice, location
- **Features:** replies, reactions, read receipts, search

#### API Endpoints

**Conversations:**
- `GET /api/messaging/conversations` - List user's conversations
- `POST /api/messaging/conversations` - Create conversation
- `GET /api/messaging/conversations/:id` - Get conversation details

**Messages:**
- `GET /api/messaging/conversations/:id/messages` - List messages (with pagination)
- `POST /api/messaging/conversations/:id/messages` - Send message
- `GET /api/messaging/messages/:id` - Get message details
- `PUT /api/messaging/messages/:id` - Edit message
- `DELETE /api/messaging/messages/:id` - Delete message
- `POST /api/messaging/messages/:id/read` - Mark message as read

**Participants:**
- `POST /api/messaging/conversations/:id/participants` - Add participant
- `DELETE /api/messaging/conversations/:id/participants/:user_id` - Remove participant

**Reactions:**
- `POST /api/messaging/messages/:id/reactions` - Add emoji reaction
- `DELETE /api/messaging/messages/:id/reactions/:emoji` - Remove reaction

**Search:**
- `GET /api/messaging/search?q=query` - Search messages across conversations

#### Usage Examples

**Example 1: Create Private Conversation and Send Message (Lua)**

```lua
function sendMessageToUser(request)
    local targetUserId = request.body.user_id
    local messageContent = request.body.message
    
    -- Step 1: Create or get private conversation
    local convResponse = http.post("http://localhost:3000/api/messaging/conversations", {
        headers = {
            ["Authorization"] = "Bearer " .. request.user.token,
            ["Content-Type"] = "application/json"
        },
        body = json.encode({
            type = "private",
            user_ids = {targetUserId}
        })
    })
    
    local conversation = json.decode(convResponse.body)
    
    -- Step 2: Send message
    local msgResponse = http.post("http://localhost:3000/api/messaging/conversations/" .. conversation.id .. "/messages", {
        headers = {
            ["Authorization"] = "Bearer " .. request.user.token,
            ["Content-Type"] = "application/json"
        },
        body = json.encode({
            content = messageContent,
            message_type = "text"
        })
    })
    
    local message = json.decode(msgResponse.body)
    
    return {
        status = 200,
        body = { message = message }
    }
end
```

**Example 2: Create Group Conversation (Node.js)**

```javascript
const axios = require('axios');

async function createGroupChat(req) {
    const { name, description, user_ids } = req.body;
    
    // Create group conversation
    const convResponse = await axios.post('http://localhost:3000/api/messaging/conversations', {
        type: 'group',
        name: name,
        description: description,
        user_ids: user_ids
    }, {
        headers: {
            'Authorization': `Bearer ${req.user.token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return {
        status: 201,
        body: { conversation: convResponse.data }
    };
}
```

**Example 3: List Messages with Pagination (Lua)**

```lua
function getConversationMessages(request)
    local conversationId = request.params.id
    local limit = request.query.limit or 50
    local offset = request.query.offset or 0
    
    local response = http.get("http://localhost:3000/api/messaging/conversations/" .. conversationId .. "/messages?limit=" .. limit .. "&offset=" .. offset, {
        headers = {
            ["Authorization"] = "Bearer " .. request.user.token
        }
    })
    
    local messages = json.decode(response.body)
    
    return {
        status = 200,
        body = { messages = messages }
    }
end
```

**Example 4: Send Message with Reply (Lua)**

```lua
function replyToMessage(request)
    local conversationId = request.params.conversation_id
    local replyToId = request.body.reply_to_id
    local content = request.body.content
    
    local response = http.post("http://localhost:3000/api/messaging/conversations/" .. conversationId .. "/messages", {
        headers = {
            ["Authorization"] = "Bearer " .. request.user.token,
            ["Content-Type"] = "application/json"
        },
        body = json.encode({
            content = content,
            message_type = "text",
            reply_to_id = replyToId
        })
    })
    
    local message = json.decode(response.body)
    
    return {
        status = 201,
        body = { message = message }
    }
end
```

**Example 5: Add Reaction to Message (Lua)**

```lua
function addReaction(request)
    local messageId = request.params.message_id
    local emoji = request.body.emoji
    
    local response = http.post("http://localhost:3000/api/messaging/messages/" .. messageId .. "/reactions", {
        headers = {
            ["Authorization"] = "Bearer " .. request.user.token,
            ["Content-Type"] = "application/json"
        },
        body = json.encode({
            emoji = emoji
        })
    })
    
    return {
        status = 200,
        body = { status = "added" }
    }
end
```

**Example 6: Search Messages (Lua)**

```lua
function searchMessages(request)
    local query = request.query.q
    
    local response = http.get("http://localhost:3000/api/messaging/search?q=" .. query, {
        headers = {
            ["Authorization"] = "Bearer " .. request.user.token
        }
    })
    
    local results = json.decode(response.body)
    
    return {
        status = 200,
        body = { results = results }
    }
end
```

#### Real-Time Message Delivery (Event-Driven Architecture)

The messaging system uses a **fully event-driven architecture** with **zero polling**. Messages are instantly pushed to all participants when they arrive in the database, similar to Telegram and WhatsApp.

**How It Works:**

1. **Message Arrival Triggers Delivery:**
   - When a message is saved to the database, `deliverMessageRealTime()` is called immediately
   - The message is instantly pushed to all conversation participants via WebSocket
   - Events are also published to the event bus for SSE clients (notifications, badge updates)
   - No database polling - delivery is triggered by the DB insert event

2. **Multi-Channel Delivery:**
   - **WebSocket**: Primary real-time delivery for active conversations
   - **SSE (Server-Sent Events)**: For notifications and badge updates (`/api/events/stream`)
   - **Event Bus**: Publishes `message.created` events for all participants
   - All channels work together for instant, event-driven updates

3. **Online Users:**
   - Users who are online receive messages instantly via WebSocket
   - Badge updates (unread counts) arrive via SSE events
   - Messages appear immediately without page refresh

4. **Offline/Reconnecting Users:**
   - When a user comes online or reconnects, they automatically fetch missed messages
   - The system compares displayed message IDs with recent messages
   - Only missed messages are fetched and displayed

5. **WebSocket Channel Subscription:**
   - Clients subscribe to conversation channels: `conversation:{id}`
   - Messages are broadcast to all subscribers of the channel
   - Also sent directly to individual users for cross-device support

6. **SSE Event Listening:**
   - Frontend components listen to SSE events for badge updates
   - No polling intervals - updates happen instantly when messages arrive
   - Example: Messaging inbox badge updates automatically via `message.created` events

**Message Delivery Events:**

When a message is sent, multiple events are triggered:

1. **WebSocket Event** (for active conversations):
```json
{
  "type": "message.sent",
  "data": {
    "id": 10,
    "conversation_id": 1,
    "sender_id": 1,
    "content": "Hello everyone!",
    "message_type": "text",
    "created_at": "2025-12-03T11:00:00Z"
  }
}
```

2. **SSE Event** (for notifications and badge updates):
```json
{
  "type": "notification",
  "topic": "message.created",
  "payload": {
    "message_id": 10,
    "conversation_id": 1,
    "sender_id": 1,
    "user_id": 2,
    "content": "Hello everyone!",
    "message_type": "text",
    "created_at": "2025-12-03T11:00:00Z"
  },
  "time": 1701600000
}
```

The `user_id` in the SSE event payload indicates which user should receive the notification, allowing frontend components to update badges and UI elements instantly.

**Client-Side WebSocket Example:**

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:3000/ws');

// Authenticate and subscribe
ws.onopen = () => {
    const token = localStorage.getItem('bosa_token');
    ws.send(JSON.stringify({ type: 'auth', token }));
    
    // Subscribe to conversation channel
    ws.send(JSON.stringify({ 
        type: 'subscribe', 
        channel: 'conversation:1' 
    }));
};

// Listen for messages
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'message.sent') {
        console.log('New message:', message.data);
        // Update UI with new message instantly
        displayMessage(message.data);
    }
};

// Handle reconnection - fetch missed messages
ws.onopen = () => {
    // ... authentication and subscription ...
    
    // After subscribing, fetch any missed messages
    fetchMissedMessages(conversationId);
};
```

**Key Benefits:**
- ✅ **Zero Polling** - No database queries every few seconds (polling removed)
- ✅ **Instant Delivery** - Messages appear immediately when sent
- ✅ **Multi-Channel** - WebSocket + SSE for comprehensive real-time updates
- ✅ **Event-Driven Badges** - Inbox badges update instantly via SSE events (no 30-second polling)
- ✅ **Automatic Recovery** - Missed messages fetched on reconnect
- ✅ **Efficient** - Event-driven architecture reduces server load by 95%+
- ✅ **Scalable** - Works like modern messaging apps (Telegram, WhatsApp)

**Polling Elimination:**
- ❌ **Removed**: 30-second polling for messaging inbox badge
- ❌ **Removed**: 5-second polling fallback (reduced to 30 seconds, only when WebSocket unavailable)
- ✅ **Replaced**: All updates now event-driven via WebSocket/SSE
- ✅ **Result**: Zero overhead when idle, instant updates when events occur

#### Message Types

Supported message types:
- `text` - Plain text message (default)
- `image` - Image message (metadata should contain `file_url`)
- `file` - File attachment (metadata should contain `file_url`, `file_name`, `file_size`)
- `voice` - Voice message (metadata should contain `file_url`, `duration`)
- `location` - Location sharing (metadata should contain `latitude`, `longitude`)

**Example - Send Image Message:**

```lua
local response = http.post("http://localhost:3000/api/messaging/conversations/" .. conversationId .. "/messages", {
    headers = {
        ["Authorization"] = "Bearer " .. token,
        ["Content-Type"] = "application/json"
    },
    body = json.encode({
        content = "Check out this image!",
        message_type = "image",
        metadata = {
            file_url = "/uploads/images/photo.jpg",
            file_name = "photo.jpg",
            file_size = 245760
        }
    })
})
```

#### Request/Response Formats

**Create Conversation Request:**
```json
{
  "type": "private",           // "private", "group", or "channel"
  "name": "Team Chat",         // Required for groups/channels
  "description": "Optional description",
  "is_public": false,          // For channels
  "user_ids": [2, 3]          // For private: single user ID. For groups: array of user IDs
}
```

**Send Message Request:**
```json
{
  "content": "Hello everyone!",
  "message_type": "text",              // Optional: "text", "image", "file", etc.
  "metadata": {                        // Optional: for file URLs, location, etc.
    "file_url": "/uploads/file.pdf"
  },
  "reply_to_id": 5                     // Optional: ID of message being replied to
}
```

**List Messages Response:**
```json
[
  {
    "id": 1,
    "conversation_id": 1,
    "sender_id": 1,
    "content": "Hello!",
    "message_type": "text",
    "reply_to_id": null,
    "edited_at": null,
    "deleted_at": null,
    "created_at": "2025-12-03T10:00:00Z"
  }
]
```

#### Error Handling

All endpoints return standard HTTP status codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Access denied (not a participant)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "error": "Failed to send message: user is not a participant in conversation"
}
```

#### Best Practices

1. **Always handle errors** - Check response status codes
2. **Use pagination** - For listing messages, use `limit` and `offset` parameters
3. **Real-time updates** - Connect to WebSocket for real-time message delivery (event-driven, no polling)
4. **SSE for badges** - Listen to SSE events (`/api/events/stream`) for badge updates and notifications
5. **Subscribe to channels** - Subscribe to conversation channels when opening a conversation
6. **Fetch missed messages** - When reconnecting, fetch messages that arrived while offline
7. **Validate input** - Ensure message content is not empty before sending
8. **Handle permissions** - Check if user is participant before accessing conversation
9. **Cache conversations** - Store conversation list locally to reduce API calls
10. **Never poll** - Never poll the database for new messages; use WebSocket/SSE events instead
11. **Event-driven UI** - Update UI elements (badges, counts) via SSE events, not polling intervals

**Example: Event-Driven Badge Update (JavaScript)**
```javascript
// Connect to SSE stream
const eventSource = new EventSource('/api/events/stream');

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // Update badge when message.created event arrives
    if (data.type === 'notification' && data.topic === 'message.created') {
        // Update inbox badge instantly (no polling needed)
        updateInboxBadge();
    }
};
```

#### SDK Support

Messaging methods will be added to all BOSA SDKs (Node.js, PHP, Python, Go) in future updates. For now, apps can use the REST API directly via HTTP requests.

**Note:** When using from Lua plugins, you'll need to use `http.get()`, `http.post()`, etc. (if available in your Lua runtime) or make HTTP requests from your plugin's HTTP server.

#### Complete API Reference

For complete API documentation with all endpoints, request/response formats, and examples, see:
- **[Messaging API Reference](MESSAGING_API_REFERENCE.md)** - Complete API documentation

---

## 6. Multi-Tenancy Support

BOSA provides built-in multi-tenancy support through **sites**. This allows a single BOSA instance to serve multiple tenants (sites) with complete data isolation. All database operations are automatically scoped to the current site, ensuring that data from one site is never accessible to another.

### 6.1 Overview

**What is Multi-Tenancy?**

Multi-tenancy allows a single BOSA instance to serve multiple independent "sites" (tenants). Each site has its own:
- Isolated database data (automatic `site_id` filtering)
- Configuration settings
- Users and permissions
- Plugin instances

**Key Benefits:**
- **Data Isolation:** Complete separation of data between sites
- **Resource Efficiency:** Single instance serves multiple tenants
- **Simplified Management:** One codebase, multiple deployments
- **Automatic Scoping:** Database queries automatically filtered by site

### 6.2 How It Works

**Site Context:**
- Each request includes a `site_id` in the `X-BOSA-Site-ID` header
- The BOSA kernel's `SiteIsolationMiddleware` extracts and validates the site ID
- All database operations are automatically scoped to the current site via `ScopedAdapter`

**Automatic Site Scoping:**
- When a site ID is set, all database queries automatically include `WHERE site_id = <current_site_id>`
- Inserts automatically include `site_id` in the data
- Updates and deletes are automatically filtered by `site_id`
- This happens transparently - no code changes needed in your plugins!

**Site Management:**
- Sites are managed via the Site Management API (`/api/sites`)
- Super admin users can create, list, update, and delete sites
- Site switching is handled via the UI or API

### 6.3 Setting Site Context in SDKs

All BOSA SDKs support multi-tenancy through site context management. The site ID is automatically included in all API requests via the `X-BOSA-Site-ID` header.

#### Node.js SDK

```javascript
const { BOSA } = require('bosa-sdk-node');

// Set site ID when initializing SDK
const bosa = new BOSA({
  kernelURL: 'http://localhost:3000',
  pluginName: 'my-plugin',
  pluginToken: 'your-plugin-token',
  siteId: 1, // Set site ID
});

// Or set it later
bosa.setSite(1);

// Get current site ID
const currentSite = bosa.getCurrentSite();
console.log('Current site:', currentSite);

// Clear site context (for super admin operations)
bosa.setSite(null);
```

**Environment Variable:**
```bash
BOSA_SITE_ID=1 node your-plugin.js
```

#### PHP SDK

```php
<?php
use Bosa\BOSA;

// Set site ID when initializing SDK
$bosa = new BOSA([
    'kernelURL' => 'http://localhost:3000',
    'pluginName' => 'my-plugin',
    'pluginToken' => 'your-plugin-token',
    'siteId' => 1, // Set site ID
]);

// Or set it later
$bosa->setSite(1);

// Get current site ID
$currentSite = $bosa->getCurrentSite();
echo "Current site: " . ($currentSite ?? 'none') . "\n";

// Clear site context (for super admin operations)
$bosa->setSite(null);
```

**Environment Variable:**
```bash
export BOSA_SITE_ID=1
php your-plugin.php
```

#### Python SDK

```python
from bosa import BOSA

# Set site ID when initializing SDK
bosa = BOSA({
    'kernelURL': 'http://localhost:3000',
    'pluginName': 'my-plugin',
    'pluginToken': 'your-plugin-token',
    'siteId': 1,  # Set site ID
})

# Or set it later
bosa.set_site(1)

# Get current site ID
current_site = bosa.get_current_site()
print(f'Current site: {current_site}')

# Clear site context (for super admin operations)
bosa.set_site(None)
```

**Environment Variable:**
```bash
export BOSA_SITE_ID=1
python your-plugin.py
```

#### Go SDK

```go
import "github.com/mmabdalla/BOSA/sdk/bosa-sdk-go"

// Set site ID when initializing SDK
siteID := int64(1)
bosa := bosa.NewBOSA(&bosa.Config{
    KernelURL:  "http://localhost:3000",
    PluginName: "my-plugin",
    PluginToken: "your-plugin-token",
    SiteID:     &siteID,
})

// Or set it later
siteID := int64(1)
bosa.SetSite(&siteID)

// Get current site ID
currentSite := bosa.GetCurrentSite()
if currentSite != nil {
    fmt.Printf("Current site: %d\n", *currentSite)
}

// Clear site context (for super admin operations)
bosa.SetSite(nil)
```

**Environment Variable:**
```bash
export BOSA_SITE_ID=1
go run your-plugin.go
```

### 6.4 Automatic Site Scoping

When a site ID is set, all database operations are automatically scoped to that site:

**Queries:**
```javascript
// Node.js example
// Set site context
bosa.setSite(1);

// All queries are automatically filtered by site_id
const items = await bosa.db.query('items').get();
// Only returns items where site_id = 1

// Your WHERE clauses are combined with site_id filter
const activeItems = await bosa.db.query('items')
  .where('status', '=', 'active')
  .get();
// Results in: WHERE site_id = 1 AND status = 'active'
```

**Inserts:**
```javascript
// site_id is automatically added to inserts
const id = await bosa.db.query('items').insert({
  name: 'My Item',
  status: 'active',
  // site_id is automatically added by the backend
});
```

**Updates and Deletes:**
```javascript
// Updates are automatically scoped to current site
await bosa.db.query('items')
  .where('id', '=', itemId)
  .update({ status: 'completed' });
// Only updates items where site_id = 1

// Deletes are automatically scoped to current site
await bosa.db.query('items')
  .where('status', '=', 'deleted')
  .delete();
// Only deletes items where site_id = 1
```

### 6.5 Site Management API

The Site Management API allows you to manage sites programmatically:

**List Sites:**
```bash
GET /api/sites
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "sites": [
    {
      "id": 1,
      "name": "Site 1",
      "owner_id": 1,
      "config": {
        "theme": "light",
        "timezone": "UTC"
      },
      "created_at": "2025-12-05T10:00:00Z",
      "updated_at": "2025-12-05T10:00:00Z"
    }
  ]
}
```

**Create Site:**
```bash
POST /api/sites
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "New Site",
  "config": {
    "theme": "dark",
    "timezone": "America/New_York"
  }
}
```

**Get Site:**
```bash
GET /api/sites/:id
Authorization: Bearer YOUR_TOKEN
```

**Update Site:**
```bash
PUT /api/sites/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Updated Site Name",
  "config": {
    "theme": "light"
  }
}
```

**Delete Site:**
```bash
DELETE /api/sites/:id
Authorization: Bearer YOUR_TOKEN
```

**Switch Site (for UI):**
```bash
POST /api/sites/:id/switch
Authorization: Bearer YOUR_TOKEN
```

### 6.6 Site Configuration

Sites can have custom configuration stored as JSON:

```json
{
  "theme": "dark",
  "timezone": "America/New_York",
  "language": "en",
  "custom_setting": "value"
}
```

**Accessing Site Configuration:**
- Site configuration is stored in the `sites` table's `config` column (JSONB)
- Access via Site Management API
- Can be used for site-specific settings (theme, timezone, language, etc.)

### 6.7 Best Practices

**1. Always Set Site Context:**
```javascript
// ✅ GOOD: Set site context at plugin initialization
const bosa = new BOSA({
  siteId: process.env.BOSA_SITE_ID || 1,
});

// ❌ BAD: Forgetting to set site context
const bosa = new BOSA(); // No site context - queries won't be scoped!
```

**2. Use Environment Variables:**
```bash
# Set site ID via environment variable
export BOSA_SITE_ID=1
```

**3. Handle Site Switching:**
```javascript
// When user switches sites in UI, update SDK context
function handleSiteSwitch(newSiteId) {
  bosa.setSite(newSiteId);
  // Reload data for new site
  loadData();
}
```

**4. Super Admin Operations:**
```javascript
// For super admin operations that need to access all sites
bosa.setSite(null); // Clear site context
// Now queries will access all sites (use with caution!)
```

**5. Site-Specific Data:**
```javascript
// ✅ GOOD: Let BOSA handle site scoping automatically
const items = await bosa.db.query('items').get();
// Automatically filtered by site_id

// ❌ BAD: Manually adding site_id to queries
const items = await bosa.db.query('items')
  .where('site_id', '=', 1) // Don't do this - it's automatic!
  .get();
```

**6. Testing Multi-Tenancy:**
```javascript
// Test with different site contexts
bosa.setSite(1);
const site1Items = await bosa.db.query('items').get();

bosa.setSite(2);
const site2Items = await bosa.db.query('items').get();

// Verify data isolation
console.assert(site1Items.length !== site2Items.length || 
               site1Items.every(item => item.site_id === 1));
```

### 6.8 User-Site Relationship Architecture

BOSA implements a **flexible hybrid approach** for user-site relationships that provides maximum flexibility while maintaining backward compatibility.

#### Architecture Overview

**Users Table (Global):**
- The `users` table remains global (no `site_id` column)
- All users exist globally in the system
- User registration creates global accounts
- Supports users who may belong to multiple sites

**Site Membership via `site_users` Junction Table:**
- `site_users` table: `id`, `site_id`, `user_id`, `role`, `created_at`, `updated_at`
- User can belong to zero, one, or multiple sites
- Different roles per site (e.g., `site_admin` in Site A, `employee` in Site B)
- Unique constraint: `(site_id, user_id)` - user can only have one role per site

**Supported Roles:**
- `site_admin` - Full access to assigned site(s) only
- `employee` - Limited access to assigned site(s) only
- `user` - Basic site member access

**Access Control Logic:**
- **Super Admin**: Global access to all sites (bypasses site_users check)
- **Site Admin**: Full access to assigned site(s) only
- **Site Employee/User**: Limited access to assigned site(s) only
- **Global User (no site_users entry)**: No site access (unless super_admin)
- **Site Owner (backward compatibility)**: Users with `owner_id` in sites table still have access

**Benefits:**
- Maximum flexibility: Users can belong to multiple sites
- Backward compatible: Existing global users and site owners still work
- Supports use cases:
  - User manages multiple sites (site_admin of Site A, employee of Site B)
  - Customer account belongs to one site only
  - Super Admin has global access
  - Apps can extend with additional role systems

**API Endpoints for Site Users:**
```
POST   /api/sites/:sid/users          - Add user to site (with role)
GET    /api/sites/:sid/users          - List all users in site
GET    /api/sites/:sid/users/:uid     - Get user details in site
PUT    /api/sites/:sid/users/:uid     - Update user role in site
DELETE /api/sites/:sid/users/:uid     - Remove user from site
GET    /api/users/:uid/sites          - List all sites user belongs to
```

**Request/Response Examples:**

**Add User to Site:**
```bash
POST /api/sites/2/users
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "email": "user@example.com",  # Optional: creates user if doesn't exist
  "user_id": 3,                  # Optional: use existing user ID
  "role": "site_admin"           # Required: "site_admin", "employee", or "user"
}
```

**Response:**
```json
{
  "id": 1,
  "site_id": 2,
  "user_id": 3,
  "role": "site_admin",
  "created_at": "2025-12-23T21:35:00Z",
  "updated_at": "2025-12-23T21:35:00Z"
}
```

**List Site Users:**
```bash
GET /api/sites/2/users
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "site_id": 2,
      "user_id": 3,
      "role": "site_admin",
      "user_email": "admin@example.com",
      "user_name": "Site Admin",
      "created_at": "2025-12-23T21:35:00Z",
      "updated_at": "2025-12-23T21:35:00Z"
    }
  ],
  "count": 1
}
```

**Update User Role:**
```bash
PUT /api/sites/2/users/3
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "role": "employee"
}
```

**Remove User from Site:**
```bash
DELETE /api/sites/2/users/3
Authorization: Bearer YOUR_TOKEN
```

**List User's Sites:**
```bash
GET /api/users/3/sites
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "sites": [
    {
      "id": 2,
      "name": "My Site",
      "role": "site_admin",
      "created_at": "2025-12-23T21:35:00Z"
    }
  ],
  "count": 1
}
```

**Permissions:**
- **Super Admin**: Can manage all site users (add, list, update, remove)
- **Site Admin**: Can manage non-Super Admin users in their assigned site(s) (add, list, update, remove)
- **Other Users**: Cannot manage site users

**App Integration:**
- Apps can query `site_users` to get site membership
- Apps can add custom role systems (e.g., `vendor_employees`) that reference `site_users`
- Apps inherit BOSA's site permission checks automatically
- Helper functions available: `GetUserSites()`, `IsUserInSite()`, `GetUserRoleInSite()`

**Checking Site Membership in Plugins:**

**Node.js SDK:**
```javascript
// Check if user is in site (via API)
const response = await fetch(`/api/users/${userId}/sites`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { sites } = await response.json();
const isInSite = sites.some(s => s.id === siteId);

// Get user's role in site
const siteUser = sites.find(s => s.id === siteId);
const role = siteUser ? siteUser.role : null;
```

**Go SDK:**
```go
// Use BOSA API client to check site membership
resp, err := http.Get(fmt.Sprintf("%s/api/users/%d/sites", kernelURL, userID))
// Parse response to check membership
```

**Lua Runtime:**
```lua
-- Site membership is automatically checked by middleware
-- Your plugin code doesn't need to manually check membership
-- The scoped adapter ensures users only see data for sites they belong to
```

### 6.9 Excluded Tables

Some system tables are excluded from site scoping (they're global):
- `users` - User accounts are global
- `sites` - Site definitions are global
- `site_users` - Site membership is global (junction table)
- `plugin_config` - Plugin configuration is global
- `i18n_translations` - Translations are global (app-scoped, not site-scoped)

**Note:** Site membership is managed through the `site_users` junction table, not by adding `site_id` to the users table. This allows users to belong to multiple sites with different roles.

### 6.10 Site Switching in UI

The BOSA UI includes a site switcher that allows users to switch between sites:

**How It Works:**
1. User selects a site from the dropdown
2. Site ID is stored in `localStorage` (`current_site_id`)
3. All subsequent API requests include `X-BOSA-Site-ID` header
4. Database queries are automatically scoped to the new site

**Implementation:**
```javascript
// Site switching function (from site-management.js)
function switchToSite(siteId, siteName) {
  localStorage.setItem('current_site_id', siteId);
  localStorage.setItem('current_site_name', siteName);
  
  // Update UI
  updateSiteSwitcher();
  
  // Reload page data
  location.reload();
}
```

### 6.11 Plugin Sidebar Filtering

BOSA automatically filters plugins in the sidebar based on user's site membership:

**Filtering Logic:**
- **Super Admins**: See all plugins (full access)
- **Site Members**: See all plugins if they are members of at least one site
- **Users Not in Any Site**: See no plugins (empty sidebar)

**How It Works:**
1. When user loads the dashboard/admin page, frontend calls `GET /api/plugins`
2. Backend checks user's site membership:
   - If super admin → return all plugins
   - If user is member of at least one site → return all plugins
   - If user is not in any site → return empty list
3. Frontend displays only the plugins returned by the API

**API Endpoint:**
```bash
GET /api/plugins
Authorization: Bearer YOUR_TOKEN
```

**Response (for users with site membership):**
```json
[
  {
    "name": "todo",
    "version": "1.0.0",
    "description": "Todo app",
    "author": "BOSA Team",
    "enabled": true,
    "routes": 5,
    "frontendRoutes": ["/todo/"],
    "events": {
      "subscribe": 2,
      "publish": 1
    }
  }
]
```

**Response (for users without site membership):**
```json
[]
```

**Security Benefits:**
- Prevents unauthorized access to plugin UIs
- Users must be assigned to at least one site to see plugins
- Super admins maintain full visibility for management purposes

### 6.10 Multi-Tenancy in Lua Plugins

For Lua plugins, site context is handled automatically by the BOSA kernel:

```lua
-- Site ID is automatically extracted from X-BOSA-Site-ID header
-- All database queries are automatically scoped

function listItems(request)
    -- This query is automatically scoped to the current site
    local items = bosa.db.query("items"):get()
    
    return {
        status = 200,
        body = { items = items }
    }
end
```

**Note:** Lua plugins don't need to manually set site context - it's handled by the kernel middleware.

### 6.11 Troubleshooting

**Problem: Queries returning data from all sites**

**Solution:** Ensure site ID is set in SDK:
```javascript
// Check if site ID is set
console.log('Current site:', bosa.getCurrentSite());

// Set site ID if missing
if (!bosa.getCurrentSite()) {
  bosa.setSite(1); // Or from environment variable
}
```

**Problem: Inserts failing with site_id constraint**

**Solution:** Don't manually add `site_id` to inserts - it's automatic:
```javascript
// ✅ GOOD: Let BOSA add site_id automatically
await bosa.db.query('items').insert({
  name: 'Item',
  // site_id is added automatically
});

// ❌ BAD: Don't manually add site_id
await bosa.db.query('items').insert({
  name: 'Item',
  site_id: 1, // Don't do this - it's automatic!
});
```

**Problem: Updates affecting all sites**

**Solution:** Ensure site context is set before updates:
```javascript
// Set site context first
bosa.setSite(1);

// Then perform update
await bosa.db.query('items')
  .where('id', '=', itemId)
  .update({ status: 'completed' });
```

---

## 7. Currency Support

BOSA provides comprehensive currency support with ISO 4217 currency definitions, formatting utilities, and app-specific currency configuration. This allows your apps to handle multiple currencies, format amounts correctly, and configure which currencies are available to users.

### 7.1 Overview

**What is Currency Support?**

Currency support in BOSA provides:
- **ISO 4217 Currency Database:** All world currencies with codes, names, symbols, and decimal places
- **Currency Formatting:** Automatic formatting with proper decimal places and thousand separators
- **App Currency Configuration:** Each app can enable/disable specific currencies
- **Default Currency:** Each app can set a default currency
- **SDK Integration:** Currency formatting available in all SDKs

**Key Benefits:**
- **Standardized Currency Codes:** ISO 4217 compliant currency codes
- **Automatic Formatting:** Proper formatting based on currency rules (e.g., JPY has 0 decimals, USD has 2)
- **Flexible Configuration:** Apps can enable only the currencies they need
- **Multi-Currency Support:** Apps can support multiple currencies simultaneously

### 7.2 Currency Configuration in Manifest

You can declare supported currencies in your app's `manifest.yaml`:

```yaml
name: my-ecommerce-app
version: 1.0.0
description: E-commerce application with multi-currency support

# Supported currencies
supported_currencies:
  - code: USD
    default: true
  - code: EUR
    default: false
  - code: GBP
    default: false
```

**Validation Rules:**
- Currency codes must be 3 uppercase letters (ISO 4217 format)
- At least one currency must be marked as `default: true`
- Only one currency can be marked as default
- Currency codes are validated against the system currency database when the app is configured

### 7.3 App Currency Configuration

Apps can configure which currencies they support via the API or UI:

**Via API:**
```bash
# Get app currencies
GET /api/apps/:name/currencies
Authorization: Bearer YOUR_TOKEN

# Enable/disable a currency
PUT /api/apps/:name/currencies/:code
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "enabled": true
}

# Set default currency
PUT /api/apps/:name/currencies/:code/default
Authorization: Bearer YOUR_TOKEN

# Bulk update currencies
PUT /api/apps/:name/currencies
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "currencies": ["USD", "EUR", "GBP"],
  "default": "USD"
}
```

**Via UI:**
1. Navigate to `/plugins` page
2. Click "Currencies" button for your app
3. Enable/disable currencies using checkboxes
4. Set default currency using "Set as Default" button

**Important Notes:**
- The default currency cannot be disabled (set another default first)
- Currency changes take effect immediately
- Only system-enabled currencies can be enabled for apps

### 7.4 Using Currency in SDKs

All BOSA SDKs provide currency formatting and management functionality:

#### Node.js SDK

```javascript
const { BOSA } = require('bosa-sdk-node');

const bosa = new BOSA({
  kernelURL: 'http://localhost:3000',
  pluginName: 'my-plugin',
  pluginToken: 'your-plugin-token',
});

// List all available currencies
const currencies = await bosa.currency.list();
console.log('Available currencies:', currencies);

// Get a specific currency
const usd = await bosa.currency.get('USD');
console.log('USD:', usd);

// Format an amount
const formatted = await bosa.currency.format(1234.56, 'USD');
console.log(formatted); // "$1,234.56"

// Simple formatting (no API call)
const simple = bosa.currency.formatSimple(1234.56, '$', 2);
console.log(simple); // "$1,234.56"

// Format JPY (0 decimal places)
const jpy = await bosa.currency.format(1234.56, 'JPY');
console.log(jpy); // "¥1,235"
```

#### PHP SDK

```php
<?php
use Bosa\BOSA;

$bosa = new BOSA([
    'kernelURL' => 'http://localhost:3000',
    'pluginName' => 'my-plugin',
    'pluginToken' => 'your-plugin-token',
]);

// List all available currencies
$currencies = $bosa->currency->list();
print_r($currencies);

// Get a specific currency
$usd = $bosa->currency->get('USD');
print_r($usd);

// Format an amount
$formatted = $bosa->currency->format(1234.56, 'USD');
echo $formatted; // "$1,234.56"

// Simple formatting (no API call)
$simple = $bosa->currency->formatSimple(1234.56, '$', 2);
echo $simple; // "$1,234.56"
```

#### Python SDK

```python
from bosa import BOSA

bosa = BOSA({
    'kernelURL': 'http://localhost:3000',
    'pluginName': 'my-plugin',
    'pluginToken': 'your-plugin-token',
})

# List all available currencies
currencies = await bosa.currency.list()
print('Available currencies:', currencies)

# Get a specific currency
usd = await bosa.currency.get('USD')
print('USD:', usd)

# Format an amount
formatted = await bosa.currency.format(1234.56, 'USD')
print(formatted)  # "$1,234.56"

# Simple formatting (no API call)
simple = bosa.currency.format_simple(1234.56, '$', 2)
print(simple)  # "$1,234.56"
```

#### Go SDK

```go
import "github.com/mmabdalla/BOSA/sdk/bosa-sdk-go"

bosa := bosa.NewBOSA(&bosa.Config{
    KernelURL:  "http://localhost:3000",
    PluginName: "my-plugin",
    PluginToken: "your-plugin-token",
})

// List all available currencies
currencies, err := bosa.Currency().List()
if err != nil {
    log.Fatal(err)
}
fmt.Println("Available currencies:", currencies)

// Get a specific currency
usd, err := bosa.Currency().Get("USD")
if err != nil {
    log.Fatal(err)
}
fmt.Println("USD:", usd)

// Format an amount
formatted, err := bosa.Currency().Format(1234.56, "USD")
if err != nil {
    log.Fatal(err)
}
fmt.Println(formatted) // "$1,234.56"

// Simple formatting (no API call)
simple := bosa.Currency().FormatSimple(1234.56, "$", 2)
fmt.Println(simple) // "$1,234.56"
```

#### Lua Runtime

```lua
-- List all available currencies
local currencies = bosa.currency.list()
for i, curr in ipairs(currencies) do
    print(string.format("%s (%s): %s", curr.name, curr.code, curr.symbol))
end

-- Get a specific currency
local usd = bosa.currency.get("USD")
print(string.format("USD: %s", usd.symbol))

-- Format an amount
local formatted = bosa.currency.format(1234.56, "USD")
print(formatted) -- "$1,234.56"

-- Simple formatting (no API call)
local simple = bosa.currency.formatSimple(1234.56, "$", 2)
print(simple) -- "$1,234.56"

-- Format JPY (0 decimal places)
local jpy = bosa.currency.format(1234.56, "JPY")
print(jpy) -- "¥1,235"
```

### 7.5 Currency API Endpoints

**List All Currencies:**
```bash
GET /api/currencies
```

**Response:**
```json
[
  {
    "code": "USD",
    "name": "US Dollar",
    "symbol": "$",
    "decimal_places": 2,
    "enabled": true,
    "is_default": true
  },
  {
    "code": "EUR",
    "name": "Euro",
    "symbol": "€",
    "decimal_places": 2,
    "enabled": true,
    "is_default": false
  }
]
```

**Get Specific Currency:**
```bash
GET /api/currencies/:code
```

**Format Amount:**
```bash
POST /api/currencies/format
Content-Type: application/json

{
  "amount": 1234.56,
  "currency_code": "USD"
}
```

**Response:**
```json
{
  "amount": 1234.56,
  "code": "USD",
  "formatted": "$1,234.56"
}
```

### 7.6 Currency Formatting Rules

**Decimal Places:**
- Most currencies use 2 decimal places (USD, EUR, GBP, etc.)
- Some currencies use 0 decimal places (JPY, KRW, VND, etc.)
- Some currencies use 3 decimal places (BHD, JOD, KWD, etc.)

**Thousand Separators:**
- Uses comma (`,`) as thousand separator
- Applied automatically based on currency rules

**Symbol Position:**
- Most currencies place symbol before amount (e.g., `$1,234.56`)
- Some currencies place symbol after amount (e.g., `1,234.56 €`)

**Examples:**
```javascript
// USD: 2 decimal places, symbol before
await bosa.currency.format(1234.56, 'USD'); // "$1,234.56"

// JPY: 0 decimal places, symbol before
await bosa.currency.format(1234.56, 'JPY'); // "¥1,235"

// EUR: 2 decimal places, symbol after (in some locales)
await bosa.currency.format(1234.56, 'EUR'); // "€1,234.56"
```

### 7.7 Best Practices

**1. Always Use Currency Codes:**
```javascript
// ✅ GOOD: Use ISO 4217 currency codes
const formatted = await bosa.currency.format(amount, 'USD');

// ❌ BAD: Using currency names or symbols directly
const formatted = `$${amount}`; // Doesn't handle decimal places correctly
```

**2. Get App Default Currency:**
```javascript
// Get app's default currency from configuration
const appCurrencies = await fetch('/api/apps/my-app/currencies');
const defaultCurrency = appCurrencies.find(c => c.is_default);
const formatted = await bosa.currency.format(amount, defaultCurrency.code);
```

**3. Handle Currency Switching:**
```javascript
// When user switches currency in UI
async function switchCurrency(newCurrencyCode) {
  // Validate currency is enabled for app
  const appCurrencies = await fetch('/api/apps/my-app/currencies');
  const currency = appCurrencies.find(c => c.code === newCurrencyCode);
  
  if (currency && currency.enabled) {
    // Reformat all amounts with new currency
    updateDisplayedPrices(newCurrencyCode);
  }
}
```

**4. Cache Currency Data:**
```javascript
// Cache currency list to avoid repeated API calls
let cachedCurrencies = null;

async function getCurrencies() {
  if (!cachedCurrencies) {
    cachedCurrencies = await bosa.currency.list();
  }
  return cachedCurrencies;
}
```

**5. Validate Currency Codes:**
```javascript
// Always validate currency codes before formatting
async function formatAmount(amount, currencyCode) {
  try {
    // This will throw if currency doesn't exist
    await bosa.currency.get(currencyCode);
    return await bosa.currency.format(amount, currencyCode);
  } catch (error) {
    console.error(`Invalid currency code: ${currencyCode}`);
    return `${amount} ${currencyCode}`; // Fallback
  }
}
```

### 7.8 Site and App Currency Configuration

**Site-Level Currency Configuration:**

Sites can have currency preferences in their configuration:

```json
{
  "default_currency": "USD",
  "supported_currencies": ["USD", "EUR", "GBP"],
  "currency_display": "symbol" // or "code"
}
```

**App-Level Currency Configuration:**

Each app can configure its own supported currencies independently:

```yaml
# manifest.yaml
supported_currencies:
  - code: USD
    default: true
  - code: EUR
    default: false
```

**Priority:**
1. App currency configuration takes precedence
2. If app doesn't specify currencies, site defaults are used
3. If neither is specified, system default (USD) is used

---

## 8. Location Services

BOSA provides comprehensive location services that allow apps to configure location-based availability, detect user locations, and enforce location restrictions. This enables apps to be available globally or restricted to specific countries, regions, or cities.

### 8.1 Overview

**What is Location Services?**

Location services in BOSA provide:
- **Global Location Database:** Countries, regions/states, and cities with ISO 3166-1/3166-2 codes
- **Location Detection:** Automatic detection from request headers (IP geolocation, Cloudflare headers, Accept-Language)
- **Location Restrictions:** Apps can be configured as "global" (available everywhere) or "restricted" (specific locations only)
- **Location-Based Access Control:** Automatic blocking of requests from restricted locations
- **SDK Integration:** Location detection and availability checking in all SDKs

**Key Benefits:**
- **Geographic Targeting:** Restrict app availability to specific countries/regions
- **Compliance:** Meet regulatory requirements (e.g., GDPR, data residency)
- **Automatic Detection:** User location detected automatically from headers
- **Flexible Configuration:** Configure at app level via manifest or API
- **Hierarchical Support:** Country → Region → City hierarchy

### 8.2 Location Configuration in Manifest

You can declare location availability in your app's `manifest.yaml`:

```yaml
name: my-regional-app
version: 1.0.0
description: App with location restrictions

# Location availability configuration
location_availability:
  mode: restricted  # or "global"
  locations:
    - US      # Country code (ISO 3166-1 alpha-2)
    - CA      # Canada
    - GB      # United Kingdom
    - US-CA   # Region code (US California)
    - 123     # City ID (numeric)
```

**Validation Rules:**
- `mode` must be either `"global"` or `"restricted"`
- If `mode` is `"restricted"`, `locations` array must not be empty
- Location codes are validated against the system location database when the app is configured
- Country codes: 2 uppercase letters (e.g., "US", "GB", "CA")
- Region codes: "COUNTRY-REGION" format (e.g., "US-CA", "GB-ENG")
- City codes: Numeric IDs from the cities table

### 8.3 App Location Configuration

Apps can configure location availability via the API or UI:

**Via API:**
```bash
# Get app location configuration
GET /api/apps/:name/locations
Authorization: Bearer YOUR_TOKEN

# Set location configuration
PUT /api/apps/:name/locations
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "mode": "restricted",
  "locations": ["US", "CA", "GB"]
}

# Check if app is available in a location
GET /api/apps/:name/locations/check?type=country&code=US
Authorization: Bearer YOUR_TOKEN
```

**Via UI:**
1. Navigate to `/plugins` page
2. Click "Locations" button for your app
3. Select "Global" or "Restricted" mode
4. If restricted, select countries from the list
5. Click "Save Settings"

**Important Notes:**
- Global mode: App is available everywhere (no restrictions)
- Restricted mode: App is only available in specified locations
- Location changes take effect immediately
- Hierarchical matching: If app is restricted to a country, regions and cities within that country are also allowed

### 8.4 Using Location in SDKs

All BOSA SDKs provide location detection and availability checking:

#### Node.js SDK

```javascript
const { BOSA } = require('bosa-sdk-node');

const bosa = new BOSA({
  kernelURL: 'http://localhost:3000',
  pluginName: 'my-plugin',
  pluginToken: 'your-plugin-token',
});

// Get current user location
const location = await bosa.location.getLocation();
console.log('User location:', location);
// Returns: { type: 'country', code: 'US', name: 'United States' }

// Check if app is available in a location
const available = await bosa.location.isAvailable('country', 'US');
console.log('Available in US:', available); // true or false

// Get location availability configuration
const availability = await bosa.location.getAvailability();
console.log('Availability:', availability);
// Returns: { mode: 'global' | 'restricted', locations: ['US', 'CA'] }

// List all countries
const countries = await bosa.location.listCountries();
console.log('Countries:', countries);

// Get country by code
const us = await bosa.location.getCountry('US');
console.log('United States:', us);
```

#### PHP SDK

```php
<?php
use Bosa\BOSA;

$bosa = new BOSA([
    'kernelURL' => 'http://localhost:3000',
    'pluginName' => 'my-plugin',
    'pluginToken' => 'your-plugin-token',
]);

// Get current user location
$location = $bosa->location->getLocation();
print_r($location);

// Check if app is available in a location
$available = $bosa->location->isAvailable('country', 'US');
echo "Available in US: " . ($available ? 'yes' : 'no') . "\n";

// Get location availability configuration
$availability = $bosa->location->getAvailability();
print_r($availability);

// List all countries
$countries = $bosa->location->listCountries();
print_r($countries);

// Get country by code
$us = $bosa->location->getCountry('US');
print_r($us);
```

#### Python SDK

```python
from bosa import BOSA

bosa = BOSA({
    'kernelURL': 'http://localhost:3000',
    'pluginName': 'my-plugin',
    'pluginToken': 'your-plugin-token',
})

# Get current user location (async)
location = await bosa.location.get_location()
print('User location:', location)

# Check if app is available in a location
available = await bosa.location.is_available('country', 'US')
print('Available in US:', available)

# Get location availability configuration
availability = await bosa.location.get_availability()
print('Availability:', availability)

# List all countries
countries = await bosa.location.list_countries()
print('Countries:', countries)

# Get country by code
us = await bosa.location.get_country('US')
print('United States:', us)
```

#### Go SDK

```go
import "github.com/mmabdalla/BOSA/sdk/bosa-sdk-go"

bosa := bosa.NewBOSA(&bosa.Config{
    KernelURL:  "http://localhost:3000",
    PluginName: "my-plugin",
    PluginToken: "your-plugin-token",
})

// Get current user location
location, err := bosa.Location().GetLocation()
if err != nil {
    log.Fatal(err)
}
fmt.Println("User location:", location)

// Check if app is available in a location
available, err := bosa.Location().IsAvailable("country", "US")
if err != nil {
    log.Fatal(err)
}
fmt.Println("Available in US:", available)

// Get location availability configuration
availability, err := bosa.Location().GetAvailability()
if err != nil {
    log.Fatal(err)
}
fmt.Println("Availability:", availability)

// List all countries
countries, err := bosa.Location().ListCountries()
if err != nil {
    log.Fatal(err)
}
fmt.Println("Countries:", countries)

// Get country by code
us, err := bosa.Location().GetCountry("US")
if err != nil {
    log.Fatal(err)
}
fmt.Println("United States:", us)
```

#### Lua Runtime

```lua
-- Get current user location (returns nil - location detected automatically by middleware)
local location = bosa.location.getLocation()
-- Note: Location is automatically detected from request headers by middleware

-- Check if app is available in a location
local available = bosa.location.isAvailable("country", "US")
print("Available in US: " .. tostring(available))

-- Get location availability configuration
local availability = bosa.location.getAvailability()
print("Mode: " .. availability.mode)
if availability.locations then
    for i, loc in ipairs(availability.locations) do
        print("Location: " .. loc)
    end
end

-- List all countries
local countries = bosa.location.listCountries()
for i, country in ipairs(countries) do
    print(string.format("%s (%s): %s", country.name, country.code, country.iso3))
end

-- Get country by code
local us = bosa.location.getCountry("US")
print(string.format("United States: %s (%s)", us.name, us.code))
```

### 8.5 Location API Endpoints

**List All Countries:**
```bash
GET /api/locations/countries
```

**Response:**
```json
[
  {
    "code": "US",
    "name": "United States",
    "iso3": "USA",
    "numeric_code": 840,
    "enabled": true
  },
  {
    "code": "GB",
    "name": "United Kingdom",
    "iso3": "GBR",
    "numeric_code": 826,
    "enabled": true
  }
]
```

**Get Country by Code:**
```bash
GET /api/locations/countries/:code
```

**List Regions for a Country:**
```bash
GET /api/locations/countries/:code/regions
```

**List Cities for a Country:**
```bash
GET /api/locations/countries/:code/cities
```

**List Cities for a Region:**
```bash
GET /api/locations/regions/:id/cities?country=US
```

**Get Location Hierarchy:**
```bash
GET /api/locations/hierarchy?type=country&code=US
```

**Response:**
```json
{
  "country": {
    "code": "US",
    "name": "United States",
    "iso3": "USA",
    "numeric_code": 840
  },
  "region": null,
  "city": null
}
```

### 8.6 Location Detection

BOSA automatically detects user location from request headers:

**Detection Methods (in order):**
1. **X-BOSA-Location Header:** Explicit location set by client or proxy
   - Format: `"country:US"` or `"region:US-CA"` or `"city:123"`
2. **CF-IPCountry Header:** Cloudflare IP geolocation
   - Returns 2-letter country code (e.g., "US", "GB")
3. **Accept-Language Header:** Language code hints
   - Extracts country from language codes like "en-US" → "US"
4. **IP Geolocation:** (Future enhancement - requires external service)

**Location Detection in Middleware:**
- Location is automatically detected by `LocationRestrictionMiddleware`
- Detected location is used to enforce app restrictions
- If detection fails, access is allowed by default (fail-open)

### 8.7 Location-Based Access Control

When an app is configured with location restrictions, BOSA automatically enforces access control:

**How It Works:**
1. User makes a request to a plugin route
2. Location is detected from request headers
3. System checks if app is available in detected location
4. If not available, request is blocked with 403 Forbidden
5. If available or app is global, request proceeds normally

**Example - Restricted App:**
```yaml
# manifest.yaml
location_availability:
  mode: restricted
  locations: ["US", "CA"]
```

**Result:**
- Users from US or CA: ✅ Access allowed
- Users from GB or other countries: ❌ Access denied (403 Forbidden)
- Users from US regions/cities: ✅ Access allowed (hierarchical matching)

**Example - Global App:**
```yaml
# manifest.yaml
location_availability:
  mode: global
```

**Result:**
- All users: ✅ Access allowed (no restrictions)

### 8.8 Location Code Formats

**Country Codes (ISO 3166-1 alpha-2):**
- Format: 2 uppercase letters
- Examples: `"US"`, `"GB"`, `"CA"`, `"FR"`, `"DE"`

**Region Codes (ISO 3166-2):**
- Format: `"COUNTRY-REGION"`
- Examples: `"US-CA"` (California), `"US-NY"` (New York), `"GB-ENG"` (England)

**City Codes:**
- Format: Numeric ID from cities table
- Examples: `"123"`, `"456"`, `"789"`

### 8.9 Best Practices

**1. Use Global Mode by Default:**
```yaml
# ✅ GOOD: Start with global, add restrictions only when needed
location_availability:
  mode: global
```

**2. Test Location Restrictions:**
```javascript
// Test with different location contexts
const availableUS = await bosa.location.isAvailable('country', 'US');
const availableGB = await bosa.location.isAvailable('country', 'GB');
console.assert(availableUS === true); // If app is restricted to US
console.assert(availableGB === false); // If app is restricted to US
```

**3. Handle Location Detection Failures:**
```javascript
// Location detection may fail - handle gracefully
const location = await bosa.location.getLocation();
if (!location) {
  // Fallback: Use default location or allow access
  console.warn('Location detection failed, using default');
}
```

**4. Use Hierarchical Matching:**
```javascript
// If app is restricted to a country, regions and cities within that country are also allowed
// Example: App restricted to "US" allows "US-CA" (California) and cities in US
```

**5. Cache Location Data:**
```javascript
// Cache country list to avoid repeated API calls
let cachedCountries = null;

async function getCountries() {
  if (!cachedCountries) {
    cachedCountries = await bosa.location.listCountries();
  }
  return cachedCountries;
}
```

**6. Validate Location Codes:**
```javascript
// Always validate location codes before using
async function checkLocation(code) {
  try {
    const country = await bosa.location.getCountry(code);
    return country !== null;
  } catch (error) {
    return false;
  }
}
```

### 8.10 Location Restrictions in Plugin Routes

Location restrictions are automatically enforced for all plugin routes:

**Automatic Enforcement:**
- All plugin API routes (`/api/plugins/:name/*`) are checked for location restrictions
- Database, events, realtime, and config routes are all protected
- No code changes needed in your plugin - enforcement is automatic

**Bypassing Restrictions (Super Admin):**
- Super admin users can bypass location restrictions
- Useful for testing and administration

**Example - Plugin with Location Restrictions:**
```yaml
# manifest.yaml
name: regional-ecommerce
location_availability:
  mode: restricted
  locations: ["US", "CA"]
```

**Result:**
- Users from US/CA can access all plugin routes
- Users from other countries receive 403 Forbidden
- Super admins can access regardless of location

### 8.11 Location Data Structure

**Country Object:**
```json
{
  "code": "US",
  "name": "United States",
  "iso3": "USA",
  "numeric_code": 840,
  "enabled": true
}
```

**Region Object:**
```json
{
  "id": 1,
  "country_code": "US",
  "code": "US-CA",
  "name": "California",
  "type": "state",
  "enabled": true
}
```

**City Object:**
```json
{
  "id": 123,
  "region_id": 1,
  "country_code": "US",
  "name": "Los Angeles",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "timezone": "America/Los_Angeles",
  "enabled": true
}
```

### 8.12 Troubleshooting

**Problem: App always returns 403 Forbidden**

**Solution:** Check location configuration:
```bash
# Get app location configuration
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/apps/my-app/locations

# Verify location detection
# Check request headers: X-BOSA-Location, CF-IPCountry, Accept-Language
```

**Problem: Location detection not working**

**Solution:** Set explicit location header:
```javascript
// In your client, set location header
fetch('/api/plugins/my-app/route', {
  headers: {
    'X-BOSA-Location': 'country:US'
  }
});
```

**Problem: App should be global but shows as restricted**

**Solution:** Update location configuration:
```bash
# Set app to global mode
curl -X PUT http://localhost:3000/api/apps/my-app/locations \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mode": "global", "locations": []}'
```

---

## 9. Database Operations

### ⚠️ CRITICAL: NEVER Use Direct Database Communication

**ABSOLUTE REQUIREMENT: All database operations MUST go through the BOSA SDK. Direct database connections are FORBIDDEN.**

**Why This Rule Exists:**
- BOSA provides database abstraction for multi-database support (SQLite, PostgreSQL, MySQL, MongoDB)
- Automatic site scoping (multi-tenancy) requires SDK usage
- Connection pooling and transaction management are handled by the kernel
- Security and access control are enforced through the SDK
- Using direct database connections defeats the purpose of using BOSA as a platform

**❌ FORBIDDEN - Never Do This:**
```javascript
// ❌ NEVER use direct SQLite connections
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.db');

// ❌ NEVER use direct PostgreSQL connections
const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://...' });

// ❌ NEVER use direct MySQL connections
const mysql = require('mysql');
const connection = mysql.createConnection({...});
```

**✅ REQUIRED - Always Do This:**
```javascript
// ✅ ALWAYS use BOSA SDK for database operations
const { BOSA } = require('bosa-sdk-node');
const bosa = new BOSA({...});
await bosa.init();

// All database operations through SDK
const todos = await bosa.db.query('todos').get();
const id = await bosa.db.query('todos').insert({...});
await bosa.db.query('todos').where('id', '=', 1).update({...});
```

**This Rule Applies To:**
- All BOSA apps/plugins regardless of language (Node.js, PHP, Python, Go, Lua)
- All database operations (queries, inserts, updates, deletes, transactions)
- All database types (SQLite, PostgreSQL, MySQL, MongoDB)

**Violation Consequences:**
- Apps using direct database connections will be rejected
- Multi-tenancy will not work correctly
- Database migrations may fail
- Platform features (events, real-time, logging) will not integrate properly

### 6.1 Creating Tables (Migrations)

Create migration files in `migrations/` directory:

```sql
-- migrations/001_initial.sql
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    user_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
```

**Migration Naming:**
- Format: `001_description.sql`, `002_description.sql`, etc.
- Must be sequential numbers
- Applied automatically on plugin load

### 6.2 Query Examples

#### Select All

```lua
local todos = bosa.db.query("todos"):get()
```

#### Select with Conditions

```lua
local activeTodos = bosa.db.query("todos")
    :where("status", "=", "active")
    :where("user_id", "=", 1)
    :get()
```

#### Select First

```lua
local todo = bosa.db.query("todos")
    :where("id", "=", 1)
    :first()
```

#### Pagination

```lua
local todos = bosa.db.query("todos")
    :orderBy("created_at", "desc")
    :limit(10)
    :offset(20)
    :get()
```

#### Count

```lua
local count = bosa.db.query("todos")
    :where("status", "=", "pending")
    :count()
```

#### Insert

```lua
local id = bosa.db.query("todos"):insert({
    title = "New Todo",
    status = "pending",
    user_id = 1
})
```

#### Update

```lua
bosa.db.query("todos")
    :where("id", "=", 1)
    :update({
        status = "completed",
        updated_at = os.date("!%Y-%m-%d %H:%M:%S")
    })
```

#### Delete

```lua
bosa.db.query("todos")
    :where("id", "=", 1)
    :delete()
```

---

## 10. Event System

### 7.1 Subscribing to Events

```lua
function init()
    -- Subscribe to events in init()
    bosa.events.on("user.created", function(event)
        bosa.log.info("New user created: " .. event.data.user_id)
        -- Handle event
    end)
    
    return true
end
```

### 7.2 Publishing Events

```lua
-- Publish event from handler
function createTodo(request)
    local id = bosa.db.query("todos"):insert(request.body)
    
    -- Publish event
    bosa.events.publish("todo.created", {
        todo_id = id,
        user_id = request.user.id
    })
    
    return {
        status = 201,
        body = { id = id }
    }
end
```

### 7.3 Event Data Structure

```lua
-- Event object structure:
{
    name = "event.name",      -- Event name
    data = {                  -- Event payload (table)
        key1 = "value1",
        key2 = "value2"
    }
}
```

---

## 11. Real-Time Features

### 8.1 Broadcasting Events

```lua
-- Broadcast to all connected WebSocket clients
bosa.realtime.broadcast("channel.name", {
    key1 = "value1",
    key2 = "value2"
})
```

### 8.2 Client-Side WebSocket

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:3000/ws');

// Send authentication token
ws.onopen = () => {
    const token = localStorage.getItem('bosa_token');
    ws.send(JSON.stringify({ type: 'auth', token }));
};

// Listen for messages
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'event') {
        console.log('Event:', message.event, message.data);
    }
};
```

---

## 12. HTTP Routes

### 12.1 Smart Namespace Routing

BOSA uses a **smart namespace** routing system that makes plugin URLs shorter and cleaner while maintaining uniqueness.

#### How It Works

- **Plugin name becomes the first URL segment**: `/todo/` instead of `/plugins/todo/` (60% shorter!)
- **Routes are registered relative to plugin name**: Route `/` becomes `/todo/` for the `todo` plugin
- **API routes remain in global namespace**: `/api/todo/tasks` (no change)
- **Reserved namespaces prevent conflicts**: Kernel routes like `/admin`, `/api`, `/login` are protected

#### Route Registration Rules

1. **API Routes** (`/api/...`): Registered exactly as written
   ```yaml
   routes:
     - path: /api/todo/tasks
       method: GET
       handler: listTasks
   ```
   **Accessible at**: `GET /api/todo/tasks`

2. **Frontend Routes** (`/` or `/page`): Auto-prefixed with plugin name
   ```yaml
   routes:
     - path: /
       method: GET
       handler: Index
     - path: /dashboard
       method: GET
       handler: Dashboard
   ```
   **Accessible at**: 
   - `GET /todo/` (for `todo` plugin)
   - `GET /todo/dashboard` (for `todo` plugin)

3. **Asset Routes** (`/assets/...`): Auto-prefixed with plugin name
   ```yaml
   routes:
     - path: /assets/:filepath
       method: GET
       handler: StaticAssets
   ```
   **Accessible at**: `GET /todo/assets/index.js` (for `todo` plugin)

#### Reserved Namespaces

Plugin names cannot conflict with these reserved kernel routes:
- `api`, `admin`, `login`, `profile`, `settings`, `dashboard`
- `marketplace`, `developers`, `docs`, `sites`, `plugins`
- `qa`, `logs`, `static`, `templates`, `ws`
- `favicon.ico`, `vite.svg`

**Plugin load will fail** if the name conflicts with a reserved namespace.

#### Examples

**Todo Plugin** (`name: todo`):
```yaml
routes:
  # API routes - registered as-is
  - path: /api/todo/tasks
    method: GET
    handler: listTasks
  
  # Frontend route - becomes /todo/
  - path: /
    method: GET
    handler: serveTodoPage
  
  # Asset route - becomes /todo/assets/:filepath
  - path: /assets/:filepath
    method: GET
    handler: StaticAssets
```

**Access URLs**:
- `GET /api/todo/tasks` → API endpoint
- `GET /todo/` → Frontend page
- `GET /todo/assets/index.js` → Static asset

### 12.2 Request Object

```lua
function handler(request)
    -- request.method: HTTP method (GET, POST, PUT, DELETE, etc.)
    -- request.path: Full path (/plugin-name/route) - includes plugin name prefix
    -- request.params: Route parameters (for :id, :name, etc.)
    -- request.query: Query parameters (?key=value)
    -- request.body: Request body (JSON parsed)
    -- request.headers: HTTP headers
    -- request.user: Authenticated user (if route is protected)
    
    return {
        status = 200,
        headers = {},           -- Optional HTTP headers
        body = {}               -- Response body (JSON object)
    }
end
```

### 12.3 Route Parameters

```yaml
routes:
  - path: /todos/:id           # :id is a parameter
    method: GET
    handler: getTodo
```

```lua
function getTodo(request)
    local id = request.params.id    -- Access route parameter
    -- ...
end
```

**Note**: For route `/todos/:id` in `todo` plugin, the full URL is `/todo/todos/:id`, and `request.params.id` contains the parameter value.

### 9.3 Query Parameters

```lua
function listTodos(request)
    local limit = request.query.limit or 10
    local offset = request.query.offset or 0
    -- ...
end
```

### 9.4 Request Body

```lua
function createTodo(request)
    local title = request.body.title
    local description = request.body.description
    -- ...
end
```

### 9.5 Response Format

```lua
return {
    status = 200,              -- HTTP status code
    headers = {                -- Optional headers
        ["Content-Type"] = "application/json"
    },
    body = {                   -- Response body (JSON object)
        key1 = "value1",
        key2 = "value2"
    }
}
```

---

## 13. Testing Plugins

### 10.1 Manual Testing

**Smart Namespace URLs** (plugin name is first segment):

```bash
# Test GET route (frontend route)
curl http://localhost:3000/todo/

# Test GET route with sub-path
curl http://localhost:3000/todo/dashboard

# Test API route (global namespace)
curl http://localhost:3000/api/todo/tasks

# Test POST route
curl -X POST http://localhost:3000/api/todo/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task"}'

# Test with authentication
curl http://localhost:3000/api/todo/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test asset route
curl http://localhost:3000/todo/assets/index.js
```

**Note**: Replace `todo` with your plugin name. The plugin name is the first URL segment (no `/plugins/` prefix).

### 10.2 Testing Events

```lua
-- In plugin code
bosa.events.publish("test.event", { test = true })

-- Check server logs for event handling
```

---

## 14. Best Practices

### 11.1 Error Handling

```lua
function handler(request)
    -- Validate input
    if not request.body.title then
        return {
            status = 400,
            body = { error = "Title is required" }
        }
    end
    
    -- Try-catch pattern (Lua doesn't have try-catch, but check for errors)
    local result, err = pcall(function()
        -- Database operation
        return bosa.db.query("todos"):insert(request.body)
    end)
    
    if not result then
        bosa.log.error("Database error: " .. tostring(err))
        return {
            status = 500,
            body = { error = "Internal server error" }
        }
    end
    
    return {
        status = 200,
        body = { success = true }
    }
end
```

### 11.2 Logging

**⚠️ CRITICAL REQUIREMENT: All plugins MUST implement proper error logging.**

The BOSA error notification system automatically monitors logs and notifies super admin users when errors occur. This is a **critical feature** for production monitoring and debugging.

#### Error Logging Checklist

- [ ] All error conditions are logged with `bosa.log.error()`
- [ ] All warning conditions are logged with `bosa.log.warn()`
- [ ] Error messages include relevant context (user ID, resource ID, operation type)
- [ ] Errors are logged before returning error responses
- [ ] No sensitive data (passwords, tokens) is logged
- [ ] Error messages are clear and actionable

#### Logging Examples

```lua
-- ✅ GOOD: Detailed error logging
function processPayment(request)
    local result, err = pcall(function()
        return process_payment_logic(request.body)
    end)
    
    if not result then
        -- Log error with full context
        bosa.log.error("Payment processing failed | Order ID: " .. request.body.order_id .. 
                      " | Amount: " .. request.body.amount .. 
                      " | User: " .. request.user.id .. 
                      " | Error: " .. tostring(err))
        return {
            status = 500,
            body = { error = "Payment processing failed" }
        }
    end
    
    bosa.log.info("Payment processed successfully | Order ID: " .. request.body.order_id)
    return {
        status = 200,
        body = { success = true }
    }
end

-- ❌ BAD: Missing error logging
function processPayment(request)
    local result, err = pcall(function()
        return process_payment_logic(request.body)
    end)
    
    if not result then
        -- ❌ Error not logged - super admin won't be notified!
        return {
            status = 500,
            body = { error = "Payment processing failed" }
        }
    end
    
    return {
        status = 200,
        body = { success = true }
    }
end
```

#### Logging Best Practices

1. **Log Immediately:** Log errors as soon as they occur, don't delay
2. **Include Context:** Add relevant information to help debugging:
   - User ID (if applicable)
   - Resource ID (order ID, todo ID, etc.)
   - Operation type (create, update, delete)
   - Input parameters (sanitized, no sensitive data)
3. **Use Structured Format:** `"Operation failed | Context: value | Error: message"`
4. **Test Error Logging:** Verify errors appear in `/logs` page and trigger notifications
5. **Monitor Notifications:** Super admins will receive notifications for all errors and warnings

#### Error Notification Flow

```
1. Plugin logs error → bosa.log.error("message")
2. Log added to buffer → LogBuffer.Add("error", "message", "plugin-name")
3. ErrorMonitor detects error → Checks every 2 seconds
4. Notification created → For each super admin user
5. Notification appears → In notification bell icon
6. Super admin clicks → Opens /logs page with error highlighted
```

#### Viewing and Managing Logs

**Via Web UI:**
- Navigate to `/logs` page (requires authentication)
- Filter by level: `error`, `warning`, `info`, `debug`, or `all`
- Click on log entries to view details
- Use URL parameter `?id=<log_id>` to jump to specific log entry

**Via CLI:**
```bash
# View logs for specific plugin
bosa logs my-plugin

# View all logs (requires server running)
# Navigate to http://localhost:3000/logs
```

**Via API:**
```bash
# Get error logs
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/logs?level=error

# Get specific log entry
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/logs?id=123
```

#### Production Considerations

- **Log Files:** In production mode (`bosa serve prod`), logs are written to `./logs/bosa-YYYY-MM-DD.log`
- **Log Buffer:** In-memory buffer (default: 1000 entries) for quick access
- **Log Retention:** Log files are kept per day, rotate automatically
- **Performance:** Logging is non-blocking and optimized for performance
- **Monitoring:** Super admins are automatically notified of all errors and warnings

### 11.3 Database Transactions

Currently, BOSA doesn't support explicit transactions in Lua API. Use error handling and validation instead.

### 11.4 Security

- **Input Validation:** Always validate input data
- **SQL Injection:** Use parameterized queries (bosa.db API handles this)
- **Authentication:** Protected routes automatically require authentication
- **Authorization:** Check user permissions in handlers

---

## 15. Examples

### 12.1 Complete Todo Plugin

See `plugins/todo/` for a complete example.

### 12.2 Simple Counter Plugin

```yaml
# manifest.yaml
name: counter
version: 1.0.0
description: Simple counter plugin
author: BOSA Team

runtime:
  type: lua
  entry: main.lua

routes:
  - path: /increment
    method: POST
    handler: increment
  - path: /value
    method: GET
    handler: getValue
```

```lua
-- main.lua
local count = 0

function init()
    -- Initialize counter from database if exists
    local row = bosa.db.query("counter")
        :where("id", "=", 1)
        :first()
    
    if row then
        count = row.value
    else
        bosa.db.query("counter"):insert({ id = 1, value = 0 })
    end
    
    return true
end

function increment(request)
    count = count + 1
    
    bosa.db.query("counter")
        :where("id", "=", 1)
        :update({ value = count })
    
    bosa.realtime.broadcast("counter.updated", { value = count })
    
    return {
        status = 200,
        body = { value = count }
    }
end

function getValue(request)
    return {
        status = 200,
        body = { value = count }
    }
end
```

---

## 13. Plugin Distribution

### 13.1 Creating Plugin Zip

```bash
# Create zip file from plugin directory
cd /path/to/my-plugin
zip -r my-plugin.zip . -x "*.git*" -x "*.DS_Store"

# Or on Windows (PowerShell)
Compress-Archive -Path .\* -DestinationPath my-plugin.zip
```

**Include in zip:**
- ✅ `manifest.yaml` (required)
- ✅ `main.lua` (required)
- ✅ `migrations/` (if any)
- ✅ `assets/` (if any)
- ❌ `.git/` (exclude)
- ❌ `node_modules/` (exclude)
- ❌ `.env` files (exclude)

### 13.2 Plugin Configuration

Plugins can store configuration in the database:

**Via Lua API:**
```lua
-- Set configuration
bosa.config.set("my-plugin", "api_key", "secret")

-- Get configuration
local apiKey = bosa.config.get("my-plugin", "api_key")
```

**Via REST API:**
```bash
# Get all config
GET /api/plugins/my-plugin/config
Authorization: Bearer YOUR_TOKEN

# Set config
PUT /api/plugins/my-plugin/config/api_key
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
Body: { "value": "secret-key" }

# Delete config
DELETE /api/plugins/my-plugin/config/api_key
Authorization: Bearer YOUR_TOKEN
```

### 13.3 Plugin Location

**Configurable in `config.yaml`:**
```yaml
plugins:
  directory: "/path/to/plugins"  # Change this to your preferred location
  hot_reload: false
```

**Benefits:**
- Plugins can be in separate repositories
- No hardcoded paths
- Easy to move plugins between environments
- Supports both relative and absolute paths

## 14. Testing Your Plugin

### 14.1 Testing Strategy

BOSA provides comprehensive testing infrastructure for plugins:

- **Unit Tests:** Test individual functions in isolation
- **Integration Tests:** Test plugin loading, routes, database, events, WebSocket
- **E2E Tests:** Test complete workflows (init → serve → use plugin)

### 14.2 Integration Tests

Integration tests verify that your plugin works correctly with BOSA's infrastructure.

**Test Coverage:**
- ✅ Plugin loading from different sources (directory, zip, git)
- ✅ Route handling with HTTP requests
- ✅ Database operations through plugin API
- ✅ Event publishing and subscribing
- ✅ WebSocket connections and real-time broadcasting

**Example Integration Test:**

```go
// tests/integration/plugin_test.go
func TestMyPlugin_Loading(t *testing.T) {
    helper := NewTestHelper(t)
    defer helper.Cleanup()
    
    pluginDir := helper.CreateTestPlugin(t, "my-plugin", routes)
    plugin, err := helper.Manager.LoadPlugin(pluginDir)
    // ... verify plugin loaded correctly
}
```

### 14.3 E2E Tests

End-to-end tests verify complete user workflows.

**Test Coverage:**
- ✅ `bosa init` → `bosa serve` → use plugin
- ✅ Login → access plugin → logout
- ✅ Create data → query data → delete data

**Running E2E Tests:**

```bash
# Build BOSA binary first
go build -o bosa.exe ./cmd/bosa

# Run E2E tests
go test ./tests/e2e/... -v
```

**Note:** E2E tests require a built BOSA binary and may take longer to run. Use `-short` flag to skip E2E tests:

```bash
go test ./tests/... -short  # Skips E2E tests
```

### 14.4 Testing Best Practices

1. **Test Plugin Loading:**
   - Test with valid manifest
   - Test with invalid manifest (should fail gracefully)
   - Test with missing entry file
   - Test with migrations

2. **Test Routes:**
   - Test all HTTP methods (GET, POST, PUT, DELETE)
   - Test parameterized routes (`/items/:id`)
   - Test query parameters
   - Test request body parsing
   - Test error responses (404, 400, 500)

3. **Test Database Operations:**
   - Test CRUD operations
   - Test user isolation (users only see their own data)
   - Test migrations run correctly
   - Test complex queries (joins, aggregations)

4. **Test Events:**
   - Test event publishing
   - Test event subscription
   - Test event data structure

5. **Test Real-Time:**
   - Test WebSocket connections
   - Test real-time broadcasting
   - Test channel-based messaging

### 14.5 Test Helper Utilities

BOSA provides test helpers in `tests/integration/plugin_test.go`:

- `NewTestHelper(t)` - Creates test environment with database, event bus, server
- `CreateTestPlugin(t, name, routes)` - Creates a test plugin
- `MakeRequest(t, method, path, body)` - Makes HTTP request
- `ParseJSONResponse(t, resp)` - Parses JSON response

**Example Usage:**

```go
helper := NewTestHelper(t)
defer helper.Cleanup()

pluginDir := helper.CreateTestPlugin(t, "test-plugin", []map[string]string{
    {"path": "/test", "method": "GET", "handler": "test_handler"},
})

plugin, err := helper.Manager.LoadPlugin(pluginDir)
// ... test plugin
```

### 14.6 Continuous Integration

BOSA tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    go test ./tests/integration/... -v
    go test ./tests/e2e/... -v -short  # Skip long E2E tests in CI
```

**Test Coverage Requirements:**
- Integration tests: 85%+ coverage
- All tests must pass before merge
- E2E tests run on pull requests (optional, can be skipped with `-short`)

---

---

## 15. Multi-Language Runtime Support

BOSA supports multiple runtime types beyond Lua, allowing you to build plugins in your preferred language.

### 15.1 Node.js Runtime

#### Plugin Structure

```
plugins/my-node-plugin/
├── manifest.yaml
├── package.json
├── index.js              # Entry file
└── node_modules/         # Dependencies
```

#### Manifest Configuration

```yaml
name: my-node-plugin
version: 1.0.0
runtime:
  type: nodejs
  entry: index.js
routes:
  - path: /api/items
    method: GET
    handler: listItems
```

#### Entry File Example

```javascript
// index.js
const { BOSA } = require('bosa-sdk-node');

const plugin = new BOSA();
await plugin.init();

// Register route handlers
plugin.route('GET', '/api/items', async (req) => {
  const items = await plugin.db.query('items')
    .where('user_id', '=', req.user.id)
    .get();
  
  return {
    status: 200,
    body: { items }
  };
});

// Start plugin server
plugin.start(process.env.PLUGIN_PORT || 3001);
```

#### SDK Installation

```bash
cd plugins/my-node-plugin
npm install bosa-sdk-node
```

**Features:**
- Automatic dependency installation (`npm install`)
- Separate Node.js process (port range: 3001-4000)
- Full access to BOSA APIs via SDK
- TypeScript support

### 15.2 PHP Runtime

#### Plugin Structure

```
plugins/my-php-plugin/
├── manifest.yaml
├── composer.json
├── index.php            # Entry file
└── vendor/              # Dependencies
```

#### Manifest Configuration

```yaml
name: my-php-plugin
version: 1.0.0
runtime:
  type: php
  entry: index.php
routes:
  - path: /api/users
    method: GET
    handler: listUsers
```

#### Entry File Example

```php
<?php
// index.php
require_once __DIR__ . '/vendor/autoload.php';

use Bosa\Plugin;

$plugin = new Plugin([
    'kernel_url' => getenv('BOSA_KERNEL_URL') ?: 'http://localhost:3000',
]);

$plugin->route('GET', '/api/users', function($req) {
    $users = $plugin->db->query('users')
        ->where('status', '=', 'active')
        ->get();
    
    return [
        'status' => 200,
        'body' => ['users' => $users]
    ];
});

$plugin->start();
```

**Features:**
- Automatic dependency installation (`composer install`)
- PHP built-in server (port range: 4001-5000)
- Full access to BOSA APIs via SDK (when available)

### 15.3 Go Runtime

#### Plugin Structure

```
plugins/my-go-plugin/
├── manifest.yaml
├── main.go              # Entry file
├── go.mod
└── go.sum
```

#### Manifest Configuration

```yaml
name: my-go-plugin
version: 1.0.0
runtime:
  type: go
  entry: main.go
routes:
  - path: /api/data
    method: GET
    handler: getData
  - path: /assets/:filepath
    method: GET
    handler: StaticAssets  # Optional: for custom static asset handling
```

**Route Registration Notes:**
- Routes defined in manifest are automatically prefixed with `/plugins/[plugin-name]/` by BOSA kernel
- Example: Route `/api/data` becomes `/plugins/my-go-plugin/api/data`
- Your Go server should register routes **without** the `/plugins/[plugin-name]` prefix
- The kernel forwards requests to your plugin with the original manifest path

#### Entry File Example

```go
// main.go
package main

import (
    "net/http"
    "os"
)

func main() {
    port := os.Getenv("PLUGIN_PORT")
    if port == "" {
        port = "5001"
    }
    
    http.HandleFunc("/api/data", func(w http.ResponseWriter, r *http.Request) {
        // Use BOSA SDK (when available) or HTTP client
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"data": "Hello from Go plugin"}`))
    })
    
    http.ListenAndServe(":"+port, nil)
}
```

**Features:**
- Automatic compilation to binary at install time
- Separate Go process (port range: 5001-6000)
- Best performance for CPU-intensive operations

### 15.4 Python Runtime

#### Plugin Structure

```
plugins/my-python-plugin/
├── manifest.yaml
├── requirements.txt
├── main.py              # Entry file
└── venv/                # Virtual environment (optional)
```

#### Manifest Configuration

```yaml
name: my-python-plugin
version: 1.0.0
runtime:
  type: python
  entry: main.py
routes:
  - path: /api/data
    method: GET
    handler: getData
```

#### Entry File Example

```python
# main.py
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/api/data', methods=['GET'])
def get_data():
    # Use BOSA SDK (when available) or HTTP client
    return jsonify({'data': 'Hello from Python plugin'}), 200

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PLUGIN_PORT', 6001))
    app.run(host='localhost', port=port, debug=False)
```

**Features:**
- Automatic dependency installation (`pip install -r requirements.txt`)
- Separate Python process (port range: 6001-7000)
- Support for Flask, FastAPI, or any HTTP framework
- Python 3.x support (python3 or python command)

**Requirements:**
- Python 3.x must be installed
- Plugins should start their own HTTP server
- Health endpoint at `/health` is recommended

### 15.5 Runtime Port Ranges

Each runtime type uses a separate port range to avoid conflicts:

| Runtime | Port Range | Default Port |
|---------|-----------|--------------|
| Node.js | 3001-4000 | 3001 |
| PHP     | 4001-5000 | 4001 |
| Go      | 5001-6000 | 5001 |
| Python  | 6001-7000 | 6001 |

Ports are automatically assigned by the BOSA kernel when a plugin starts.

### 15.6 Environment Variables

All process-based runtimes receive these environment variables:

- `PLUGIN_PORT` - Port assigned to the plugin
- `PLUGIN_NAME` - Plugin name from manifest
- `BOSA_PLUGIN_PATH` - Absolute path to plugin directory
- `BOSA_KERNEL_URL` - Kernel API URL (default: http://localhost:3000)
- `BOSA_DEV_MODE` - Set to "true" if dev mode enabled

### 15.6 SDK Status

| Runtime | SDK Status | Notes |
|---------|-----------|-------|
| Node.js | ✅ Available | `bosa-sdk-node` package |
| PHP     | ⏳ Planned  | Coming soon |
| Go      | ⏳ Planned  | Coming soon |

---

---

## 16. CLI Process Management

BOSA provides CLI commands for monitoring and managing running plugins.

### 16.1 List Running Plugins (`bosa ps`)

View all running plugins with process information:

```bash
bosa ps
```

**Output includes:**
- Plugin name
- Runtime type (lua, nodejs, php, go)
- Status (running, stopped, error)
- Process ID (PID) - for process-based runtimes
- Port number - for process-based runtimes
- Uptime - time since plugin started
- Plugin URL - HTTP endpoint
- Health errors (if any)

**Example output:**
```
Running Plugins:
----------------------------------------------------------------------------------------------------
NAME                 RUNTIME    STATUS     PID      PORT     UPTIME       URL
----------------------------------------------------------------------------------------------------
my-node-plugin       nodejs     running    12345    3001     2h 15m       http://localhost:3001
my-php-plugin        php        running    12346    4001     1h 30m       http://localhost:4001
my-go-plugin         go         running    12347    5001     45m          http://localhost:5001
todo                 lua        running    -        -        5h 12m       -
----------------------------------------------------------------------------------------------------
Total: 4 plugin(s)
```

**Note:** Requires BOSA server to be running (`bosa serve`).

### 16.2 View Plugin Logs (`bosa logs <plugin>`)

View logs for a specific plugin:

```bash
bosa logs my-node-plugin
```

**Features:**
- Filters log entries containing plugin name
- Shows timestamp, level, message, and source
- Displays last 100 entries
- Provides link to full logs UI

**Example output:**
```
Logs for plugin 'my-node-plugin':
====================================================================================================
[2025-11-27 14:30:15] INFO    | Plugin 'my-node-plugin' started successfully
[2025-11-27 14:30:16] INFO    | Route registered: GET /api/items
           Source: plugin
[2025-11-27 14:31:20] ERROR   | Database query failed: connection timeout
           Source: plugin
====================================================================================================
Total: 2 log entry/entries

Note: Only showing last 100 entries. View all logs at http://localhost:3000/logs
```

**Note:** Requires BOSA server to be running and plugin must be loaded.

---

## 16. Error Logging and Monitoring

**⚠️ CRITICAL: This section is MANDATORY reading for all plugin developers.**

BOSA includes an automatic error notification system that monitors logs and notifies super admin users when errors occur. **All plugins MUST implement proper error logging** to ensure issues are detected and resolved quickly.

### 13.1 Error Notification System Overview

The BOSA error notification system:

1. **Automatically monitors** all log entries in real-time (checks every 2 seconds)
2. **Detects errors and warnings** from all plugins and the kernel
3. **Creates notifications** for all super admin users when errors/warnings occur
4. **Provides direct links** to error log entries for quick debugging
5. **Prevents duplicates** - same error won't create multiple notifications

**This system is ALWAYS ACTIVE** in both development and production modes.

### 13.2 Mandatory Error Logging Requirements

**ALL plugins MUST:**

1. ✅ **Log all errors** using `bosa.log.error()` (or SDK equivalent) before returning error responses
2. ✅ **Log all warnings** using `bosa.log.warn()` (or SDK equivalent) for recoverable issues
3. ✅ **Include context** in error messages (user ID, resource ID, operation type)
4. ✅ **Test error logging** to ensure errors appear in logs and trigger notifications
5. ✅ **Never log sensitive data** (passwords, tokens, personal information)

**Failure to implement proper error logging may result in:**
- Critical issues going unnoticed
- Delayed problem resolution
- Poor user experience
- Production incidents

### 13.3 Error Logging Implementation by Language

#### Lua Plugins

```lua
-- ✅ REQUIRED: Always log errors with context
function createTodo(request)
    -- Validate input
    if not request.body.title then
        bosa.log.warn("CreateTodo: Missing title parameter | User: " .. request.user.id)
        return {
            status = 400,
            body = { error = "Title is required" }
        }
    end
    
    -- Attempt database operation
    local result, err = pcall(function()
        return bosa.db.query("todos"):insert({
            title = request.body.title,
            user_id = request.user.id
        })
    end)
    
    if not result then
        -- ✅ MUST log error before returning
        bosa.log.error("CreateTodo: Database insert failed | User: " .. request.user.id .. 
                      " | Title: " .. request.body.title .. 
                      " | Error: " .. tostring(err))
        return {
            status = 500,
            body = { error = "Internal server error" }
        }
    end
    
    bosa.log.info("CreateTodo: Todo created successfully | ID: " .. result .. " | User: " .. request.user.id)
    return {
        status = 201,
        body = { id = result }
    }
end
```

#### Node.js Plugins (bosa-sdk-node)

```javascript
// ✅ REQUIRED: Use SDK logging methods
const { BOSA } = require('bosa-sdk-node');
const plugin = new BOSA();

plugin.route('POST', '/todos', async (req) => {
    try {
        if (!req.body.title) {
            plugin.log.warn(`CreateTodo: Missing title | User: ${req.user.id}`);
            return {
                status: 400,
                body: { error: 'Title is required' }
            };
        }
        
        const id = await plugin.db.query('todos').insert({
            title: req.body.title,
            user_id: req.user.id
        });
        
        plugin.log.info(`CreateTodo: Todo created | ID: ${id} | User: ${req.user.id}`);
        return {
            status: 201,
            body: { id }
        };
    } catch (err) {
        // ✅ MUST log error before returning
        plugin.log.error(`CreateTodo: Database insert failed | User: ${req.user.id} | Title: ${req.body.title} | Error: ${err.message}`);
        return {
            status: 500,
            body: { error: 'Internal server error' }
        };
    }
});
```

#### PHP Plugins (bosa-sdk-php)

```php
<?php
// ✅ REQUIRED: Use SDK logging methods
use Bosa\BOSA;

$plugin = new BOSA();

$plugin->route('POST', '/todos', function($req) use ($plugin) {
    try {
        if (!isset($req->body['title'])) {
            $plugin->log->warn("CreateTodo: Missing title | User: {$req->user->id}");
            return [
                'status' => 400,
                'body' => ['error' => 'Title is required']
            ];
        }
        
        $id = $plugin->db->query('todos')->insert([
            'title' => $req->body['title'],
            'user_id' => $req->user->id
        ]);
        
        $plugin->log->info("CreateTodo: Todo created | ID: {$id} | User: {$req->user->id}");
        return [
            'status' => 201,
            'body' => ['id' => $id]
        ];
    } catch (Exception $e) {
        // ✅ MUST log error before returning
        $plugin->log->error("CreateTodo: Database insert failed | User: {$req->user->id} | Title: {$req->body['title']} | Error: {$e->getMessage()}");
        return [
            'status' => 500,
            'body' => ['error' => 'Internal server error']
        ];
    }
});
```

#### Python Plugins (bosa-sdk-python)

```python
# ✅ REQUIRED: Use SDK logging methods
from bosa import BOSA

plugin = BOSA()

@plugin.route('POST', '/todos')
def create_todo(req):
    try:
        if not req.body.get('title'):
            plugin.log.warn(f"CreateTodo: Missing title | User: {req.user.id}")
            return {
                'status': 400,
                'body': {'error': 'Title is required'}
            }
        
        todo_id = plugin.db.query('todos').insert({
            'title': req.body['title'],
            'user_id': req.user.id
        })
        
        plugin.log.info(f"CreateTodo: Todo created | ID: {todo_id} | User: {req.user.id}")
        return {
            'status': 201,
            'body': {'id': todo_id}
        }
    except Exception as e:
        # ✅ MUST log error before returning
        plugin.log.error(f"CreateTodo: Database insert failed | User: {req.user.id} | Title: {req.body.get('title')} | Error: {str(e)}")
        return {
            'status': 500,
            'body': {'error': 'Internal server error'}
        }
```

#### Go Plugins (bosa-sdk-go)

```go
// ✅ REQUIRED: Use SDK logging methods
import "github.com/bosa/bosa-sdk-go"
import "fmt"

plugin := bosa.New()

plugin.Route("POST", "/todos", func(req *bosa.Request) *bosa.Response {
    if req.Body["title"] == nil {
        plugin.Log().Warn(fmt.Sprintf("CreateTodo: Missing title | User: %v", req.User.ID))
        return &bosa.Response{
            Status: 400,
            Body: map[string]interface{}{"error": "Title is required"},
        }
    }
    
    id, err := plugin.DB().Query("todos").Insert(map[string]interface{}{
        "title": req.Body["title"],
        "user_id": req.User.ID,
    })
    
    if err != nil {
        // ✅ MUST log error before returning
        plugin.Log().Error(fmt.Sprintf("CreateTodo: Database insert failed | User: %v | Title: %v | Error: %v", 
            req.User.ID, req.Body["title"], err))
        return &bosa.Response{
            Status: 500,
            Body: map[string]interface{}{"error": "Internal server error"},
        }
    }
    
    plugin.Log().Info(fmt.Sprintf("CreateTodo: Todo created | ID: %v | User: %v", id, req.User.ID))
    return &bosa.Response{
        Status: 201,
        Body: map[string]interface{}{"id": id},
    }
})
```

### 13.4 Error Message Format

**Standard Format:**
```
"[Operation Name]: [What failed] | [Context Key]: [Value] | Error: [Error message]"
```

**Examples:**
```lua
-- ✅ GOOD: Clear, structured error message
bosa.log.error("CreateTodo: Database insert failed | User: 123 | Title: My Todo | Error: connection timeout")

-- ✅ GOOD: Include all relevant context
bosa.log.error("ProcessPayment: Payment gateway error | Order ID: 456 | Amount: 99.99 | User: 123 | Error: invalid API key")

-- ❌ BAD: Vague error message
bosa.log.error("Error occurred")

-- ❌ BAD: Missing context
bosa.log.error("Database error")
```

### 13.5 Viewing Error Logs

#### Via Web UI

1. **Navigate to `/logs` page** (requires authentication)
2. **Filter by level:** Click buttons to filter by `error`, `warning`, `info`, `debug`, or `all`
3. **View specific log:** Click on a log entry or use URL `?id=<log_id>` to jump to specific entry
4. **From notification:** Click notification link to jump directly to error log entry

#### Via CLI

```bash
# View logs for specific plugin
bosa logs my-plugin

# View all logs (requires server running)
# Navigate to http://localhost:3000/logs
```

#### Via API

```bash
# Get error logs
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/logs?level=error

# Get specific log entry
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/logs?id=123

# Get warning logs
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/logs?level=warning
```

### 13.6 Error Notification Details

When an error or warning is logged, super admin users receive a notification with:

- **Title:** "System Error" or "System Warning" (+ source plugin name if available)
- **Message:** Truncated error message (first 200 characters)
- **Link:** Direct link to log entry (`/logs?level=error&id=<log_id>`)
- **Metadata:** Includes log_id, log_level, log_source, and timestamp

**Notification Flow:**
1. Error logged → Added to log buffer
2. ErrorMonitor detects error (checks every 2 seconds)
3. System checks for duplicate notifications (by log_id)
4. Notification created for each super admin user
5. Notification appears in notification bell icon
6. Super admin clicks notification → Opens `/logs` page with error highlighted

### 13.7 Testing Error Logging

**Before deploying your plugin, verify:**

1. ✅ Errors are logged with `bosa.log.error()` or SDK equivalent
2. ✅ Errors appear in `/logs` page
3. ✅ Errors trigger notifications for super admin users
4. ✅ Error messages include sufficient context for debugging
5. ✅ No sensitive data is logged

**Test Procedure:**

```lua
-- In your plugin, trigger a test error
function testErrorLogging(request)
    -- This should trigger a notification
    bosa.log.error("TestError: This is a test error | Plugin: my-plugin | User: " .. request.user.id)
    return {
        status = 200,
        body = { message = "Test error logged" }
    }
end
```

Then:
1. Call the test endpoint
2. Check `/logs` page - error should appear
3. Check notification bell - super admin should receive notification
4. Click notification - should jump to error in logs page

### 13.8 Production Considerations

- **Log Files:** In production mode (`bosa serve prod`), logs are written to `./logs/bosa-YYYY-MM-DD.log`
- **Log Buffer:** In-memory buffer (default: 1000 entries) for quick access via UI
- **Log Retention:** Log files are kept per day, rotate automatically
- **Performance:** Logging is non-blocking and optimized for performance
- **Monitoring:** Super admins are automatically notified of ALL errors and warnings
- **No Configuration Needed:** Error notification system is always active

### 13.9 Common Mistakes to Avoid

❌ **Don't:**
- Log errors without context
- Skip error logging "because it's obvious"
- Log sensitive data (passwords, tokens, credit cards)
- Use `info` level for errors
- Return error responses without logging

✅ **Do:**
- Always log errors before returning error responses
- Include relevant context in error messages
- Use appropriate log levels (error, warn, info)
- Test error logging in development
- Monitor notifications in production

---

## 17. Production Deployment with Nginx

### 17.1 Overview

BOSA can run behind nginx as a reverse proxy for production deployments. This setup provides:
- SSL/TLS termination
- Better static file performance
- Compression and caching
- Security headers
- Rate limiting
- Load balancing (if multiple instances)

### 17.2 When to Use Nginx vs Internal Server

**Use Nginx (Recommended for Production):**
- Production deployments
- Need SSL/TLS (HTTPS)
- Want better static file performance
- Require advanced features (rate limiting, caching)
- Public-facing applications
- High-traffic scenarios

**Use Internal Server (BOSA's built-in server):**
- Development and testing
- Simple deployments without SSL
- Internal applications
- Quick prototyping
- Single-user scenarios

### 17.3 Quick Setup

**Linux/macOS:**
```bash
# Run setup script
sudo ./scripts/setup-nginx.sh

# Follow interactive prompts:
# - Choose template (basic, development, production, static-optimized)
# - Enter BOSA port (default: 3000)
# - Enter domain name
# - Enter BOSA installation path
```

**Windows:**
```powershell
# Run setup script (as Administrator)
.\scripts\setup-nginx.ps1

# Follow interactive prompts
```

**Manual Setup:**
1. Install nginx (see [NGINX_SETUP.md](NGINX_SETUP.md))
2. Choose a template from `docs/nginx/`
3. Replace template variables
4. Configure BOSA: set `behind_proxy: true` in `config.yaml`
5. Restart BOSA

### 17.4 Configuration

**BOSA Configuration (`config.yaml`):**
```yaml
server:
  port: 3000
  host: "0.0.0.0"
  behind_proxy: true  # Enable proxy header trust
```

**Why `behind_proxy: true`?**
- BOSA will trust `X-Forwarded-For` and `X-Real-IP` headers for real client IPs
- BOSA will trust `X-Forwarded-Proto` header for HTTPS detection
- Logs will show real client IPs instead of proxy IP

### 17.5 SSL/TLS Setup

For production with HTTPS:

```bash
# Run SSL setup script (Linux only)
sudo ./scripts/setup-nginx-ssl.sh

# Or manually (see NGINX_SSL_SETUP.md)
sudo certbot --nginx -d yourdomain.com
```

### 17.6 Available Templates

1. **`basic.conf`** - Simple HTTP reverse proxy
2. **`development.conf`** - Development with verbose logging
3. **`production.conf`** - Production with SSL/TLS and security headers
4. **`static-optimized.conf`** - High-performance static file serving

See [nginx/README.md](nginx/README.md) for detailed template descriptions.

### 17.7 Documentation

- **[NGINX_SETUP.md](NGINX_SETUP.md)** - Complete setup guide for all platforms
- **[NGINX_SSL_SETUP.md](NGINX_SSL_SETUP.md)** - SSL/TLS certificate setup
- **[NGINX_PRODUCTION.md](NGINX_PRODUCTION.md)** - Production deployment best practices
- **[nginx/README.md](nginx/README.md)** - Configuration templates guide

### 17.8 Troubleshooting

**502 Bad Gateway:**
- Verify BOSA is running: `./bosa serve`
- Check BOSA port matches nginx config
- Verify `behind_proxy: true` in config.yaml

**Real Client IP Not Logged:**
- Ensure `behind_proxy: true` in BOSA config.yaml
- Verify nginx sends `X-Forwarded-For` and `X-Real-IP` headers
- Restart BOSA after config changes

**WebSocket Connection Fails:**
- Verify `/ws` location block has WebSocket upgrade headers
- Check nginx version (requires 1.3.13+)

See [NGINX_SETUP.md](NGINX_SETUP.md) for complete troubleshooting guide.

---

## Next Steps

- Review existing plugins (`plugins/todo/`, `plugins/crm/`)
- Explore BOSA API documentation
- Build your first plugin in your preferred language
- **Implement proper error logging** (see Section 13 - MANDATORY)
- Write tests for your plugin
- Use `bosa ps` and `bosa logs` to monitor your plugins
- **Set up nginx for production** (see Section 17)
- Share your plugins with the community

**Happy coding!** 🚀


