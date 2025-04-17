Here's a **production-grade `README.md`** for your CLI tool based on your structure, naming, and logic:

---


# 📦 ModuleCrafter CLI

A CLI tool to **import and sync reusable feature modules** from remote GitHub repositories into your local project.

Supports:
- Monorepos
- Standalone repositories
- Subfolder-based module repositories

---

## 📦 Installation

```bash
npm install -g feature-module-cli
# or locally
npm install feature-module-cli --save-dev
```

---

## 🚀 Usage

### `add` - Add a remote feature module

```bash
feature-cli add <git-url>
```

- `git-url` can be:
  - A full GitHub repo URL (e.g., `https://github.com/org/repo`)
  - A URL pointing to a subfolder in a repo (e.g., `https://github.com/org/repo/tree/main/packages/module-a`)

Example:

```bash
feature-cli add https://github.com/my-org/awesome-modules/tree/main/modules/logger
```

---

## 🔧 Commands

### `init` - Initialize CLI config

```bash
feature-cli init
```

Creates a `config.mjs` file in your project root.

---

### `list-modules`

```bash
feature-cli list
```

Lists previously imported modules (if tracking is enabled).

---

## 🧠 How It Works

### Clone Flow

1. Parses GitHub URL using `parseGitHubUrl`.
2. Clones the repo into `.tmp-feature-modules/`.
3. Detects repo type:
   - `standaloneProject`: has `package.json` at root
   - `repoSubfolder`: no `package.json` at root
   - `monorepoWorkspace`: root has `package.json`, but URL points to subfolder

### Copy & Sync Flow

- Copies folder into project
- Prompts to install and sync dependencies (with confirmation)
- Supports detecting closest `package.json` to sync from

---

## 🛠️ Project Structure

```
.
├── commands
│   ├── add/
│   │   └── index.ts
│   └── initCommand.ts
│   └── listModules.ts
├── core
│   ├── git/
│   ├── config/
│   ├── common/
│   ├── user-input/
│   └── types/
├── tests/
├── index.ts
```

- `core/`: All core logic (e.g., Git ops, config, utils)
- `commands/`: CLI command entry points
- `tests/`: Unit tests for each command

---

## 🧪 Running Tests

```bash
npm test
```

---

## 🧹 Cleaning Up

Temporary files are stored in:

```
.tmp-feature-modules/
```

They are automatically removed unless `useCachedRepo` is set to true.

---

## ⚙️ Configuration

A `config.mjs` file is generated in your project root after running:

```bash
feature-cli init
```

> ❗ This file is **project-specific** and should be **ignored in `.gitignore`**.

---

## 📁 .gitignore Suggestion

```gitignore
# CLI-generated config
config.mjs

# Temp cloned modules
.tmp-feature-modules/

# Build output
dist/
```

---

## 📌 Naming Conventions

- `TEMP_DIR_PATH`: Always absolute path
- `cmdWithCommonOptions.ts`: Merges global CLI options
- `safe-read-json.ts`: JSON reader with error handling
- `mergeOptions.ts`: Merges CLI and config values

---

## 🧩 Future Plans

- Automatic version conflict resolution
- Template-based module generation
- Support for non-GitHub sources (Bitbucket, GitLab)

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/my-feature`
3. Commit changes
4. Push and open PR

---

## 📜 License

MIT © Akhilesh
# modulecrafter
