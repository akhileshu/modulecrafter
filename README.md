Here’s your **comprehensive and updated README** for **ModuleCrafter CLI**, reflecting all features, structure, logging, verbose support, modular design, and usage.

---

# 📦 ModuleCrafter CLI

A powerful CLI to **import and sync reusable feature modules** from remote GitHub repositories into your local project.

Built for modern teams using:

- Monorepos
- Standalone repos
- Subfolder-based module storage

---

## ✅ Key Features

- 🧩 **Add modules** from any GitHub URL
- 🔁 **Sync dependencies** with intelligent prompts
- 📁 Auto-detects closest `package.json`
- 💬 **Verbose logging** for debugging
- 📂 Supports monorepos, workspaces & subfolders
- 🧪 Modular architecture & tests
- 📈 Analytics for command usage (optional)

---

Sure Akhilesh! Here's your improved **Installation section** highlighting it's a single-command setup and what it does:

---

## 📦 Installation

```bash
git clone https://github.com/akhileshu/modulecrafter.git
cd modulecrafter
npm run setup
```

> ✅ **One-command CLI setup!**  
> Just run `npm run setup` and you're ready to use `modcraft` globally.

### 🔧 What it does:
- Installs all dependencies (`npm install`)
- Prepares required folders (analytics, repos, config)
- Builds the project (`tsc`)
- Makes CLI executable (`chmod`)
- Links CLI globally (`npm link`)

After this, you can use `modcraft` directly in any terminal.

---

## 🚀 Usage

Run this anywhere in your project directory:

### Add a Remote Module

```bash
modcraft add <git-url>
```

✅ Supported `git-url` formats:

- Full repo:  
  `https://github.com/org/repo`
- Subfolder in repo:  
  `https://github.com/org/repo/tree/main/path/to/module`

**Example:**

```bash
modcraft add https://github.com/my-org/awesome/tree/main/modules/logger
```

### CLI Overview

```bash
modcraft --help
```

```txt
CLI to inject feature modules into projects

Usage: modcraft [options] [command]

Options:
  -V, --version            Show version
  -h, --help               Show help

Commands:
  analytics                Show CLI usage analytics
  show-repos               List all cloned GitHub repos
  show-paths               Show current paths and config info
  init                     Create a config.mjs file if missing
  add <git-url>            Add a module from a GitHub URL
  create-from <url> [name] Extract project from a monorepo subfolder
```

---

## ⚙️ Configuration

`modcraft init` creates a `config.mjs` with interactive prompts.

Paths used:

| Item            | Path                                                       |
|-----------------|------------------------------------------------------------|
| Analytics       | `~/.config/modulecrafter-cli/analytics.json`              |
| Config File     | `~/.config/modulecrafter-cli/config.mjs`                  |
| Cloned Repos    | `~/modulecrafter-cli/repos`                                |

You can customize module destination paths, verbose mode, and more.

---

## 🔧 Architecture

```
.
├── commands/
│   └── add/
├── core/
│   ├── analytics/
│   ├── config/
│   ├── git/
│   ├── paths/
│   ├── user-input/
│   ├── types/
│   └── common/
├── tests/
├── cli.ts
├── bin/modcraft
```

### Key Modules

- `core/config/`: Handles config load and caching with `ConfigManager`
- `core/git/`: Parses GitHub URLs, clones repos
- `core/paths/`: Detects `package.json`, manages paths
- `core/common/log.ts`: Verbose logger with emoji, colors, and error support
- `core/analytics/`: Stores and prints usage analytics

---

## 📘 How It Works

### 🔍 GitHub URL Parsing

```ts
parseGitHubUrl('https://github.com/user/repo/tree/main/path');
```

Returns structured metadata:
```ts
{
  owner: 'user',
  repo: 'repo',
  branch: 'main',
  subfolder: 'path'
}
```

### 🧠 Cloning Flow

1. Parse URL
2. Clone repo into cache
3. Detect type:
   - `standaloneProject`
   - `monorepoWorkspace`
   - `repoSubfolder`

### 📦 Module Injection

- Locate source and destination
- Copy files from repo to local project
- Detect nearest `package.json`
- Prompt to install and sync dependencies (can be skipped)
- Logs with optional verbose output

---

## 📜 Logging & Verbose Mode

Uses a centralized `logMessages` utility:

```ts
logMessages([
  { message: 'Module copied successfully', level: 'success' },
  { message: 'Cloning failed', level: 'error', error: new Error('...') },
]);
```

- `verbose` flag in config enables detailed error stack traces
- Levels: `info`, `success`, `warn`, `error`, `custom`

---

## 🧪 Testing

Test structure follows the command and core layout.

```bash
npm run test
```

Work in progress:
- Unit tests for core modules
- CLI command integration tests

---

## 📈 Analytics

- Tracks usage per command and timestamp
- Can be disabled in `config.mjs`
- Stored locally at:  
  `~/.config/modulecrafter-cli/analytics.json`

---

## 🔧 Utilities

### `loadAndSetConfig`

Central utility to load config and apply CLI options:

```ts
await loadAndSetConfig(options);
```

Sets `verbose` and `manual` flags dynamically.

---

## 🛠️ Helper Functions

- `parseGitHubUrl(url)`
- `logMessages(logs[])`
- `copyModule()`
- `findClosestPackageJson()`
- `promptDependencyInstall()`

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/my-feature`
3. Push and open a PR

---

## 📜 License

MIT © [Akhilesh](https://github.com/akhileshu)

