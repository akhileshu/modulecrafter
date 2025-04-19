
# 📦 ModuleCrafter CLI
![modcraft banner](/public/stop-copy-pasting-modcraft.png)

A powerful CLI to **import and sync reusable feature modules** or **bootstrap full projects** from GitHub —  
**no manual cloning, copying, or dependency headaches.**

---

## 🚫 Problem: Manual GitHub Module Reuse is Painful

Want to reuse a subfolder/module from GitHub?

You typically have to:

- Clone the full repo
- Locate and copy the needed folder
- Rename it
- Paste it into your project
- Manually install dependencies
- Delete extra files

😩 Tedious. Time-consuming. Error-prone.

---

## ✅ Solution: ModuleCrafter Does It All for You

Just run:

```bash
modcraft add <github-url>
```

or

```bash
modcraft create-from <github-url>
```

✅ Features:

- Downloads **only** the subfolder you want  
- Injects it into your project, with optional renaming  
- Installs dependencies (or skips if you choose)  
- Works with monorepos, standalone repos, or subfolders  
- Interactive CLI with detailed logs

---

## 💡 Real Example

You want to start with this folder:  
[helloworld-test-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-test-sample)

### ❌ Without ModuleCrafter:

```bash
git clone https://github.com/microsoft/vscode-extension-samples
cd vscode-extension-samples/helloworld-test-sample
cp -r helloworld-test-sample ~/your-app/
cd ~/your-app/helloworld-test-sample
npm install
code .
```

### ✅ With ModuleCrafter:

```bash
modcraft create-from https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-test-sample
```

🎉 Done! You’re ready to code.

---

## 🔧 Use Cases

- Reuse modules from starter or mono repos  
- Extract subfolders from large GitHub projects  
- Bootstrap new projects using existing examples  
- Auto-sync dependencies

---

## 🔑 Features

- 🧩 Import modules directly from GitHub
- 🔁 Sync or skip dependencies
- 🧠 Smart detection (monorepo, subfolder, standalone)
- ⚙️ Auto-detects `package.json` and target paths
- 💬 Verbose logs, interactive CLI
- 📈 Optional CLI analytics
- 🧪 Modular & testable structure

---

## 🚀 Install

```bash
git clone https://github.com/akhileshu/modulecrafter.git
cd modulecrafter
npm run setup
```

The setup script handles:

- Installing dependencies
- TypeScript build (`tsc`)
- File permissions (`chmod`)
- CLI linking (`npm link`)

Use `modcraft` globally in any terminal.

---

## 🧪 Usage

### 📥 Add a Remote Module

```bash
modcraft add <github-url>
```

### 🏗️ Create Project from a Subfolder

```bash
modcraft create-from <github-url> [optional-name]
```

#### ✅ Supported URL Formats

```bash
https://github.com/org/repo
https://github.com/org/repo/tree/main/path/to/folder
```

---

## 📖 CLI Commands

```bash
modcraft --help
```

```txt
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

Check compatibility:

```bash
❯ node -v     → v22.14.0  
❯ npm -v      → 10.9.2  
❯ git -v      → git version 2.43.0
```

Create config:

```bash
modcraft init
```

Generates:

```
~/.config/modulecrafter-cli/config.mjs
```

Coming soon:

- Default paths  
- Dependency sync options  
- Local repo cache settings  

---

## 🧱 Project Structure

```
.
├── commands/               # CLI commands
├── core/
│   ├── analytics/          # CLI usage tracking
│   ├── config/             # Config loader/writer
│   ├── git/                # GitHub handling
│   ├── paths/              # Path resolution
│   ├── user-input/         # Prompts
│   ├── common/             # Logging, utils
│   └── types/              # TypeScript types
├── tests/
```

---

## 🧠 How It Works

### GitHub URL Parsing

```ts
parseGitHubUrl('https://github.com/user/repo/tree/main/path');
```

Returns:

```ts
{
  owner: 'user',
  repo: 'repo',
  branch: 'main',
  subfolder: 'path'
}
```

### Module Injection Flow

1. Parse GitHub URL  
2. Clone to local cache  
3. Determine type (monorepo, subfolder, etc.)  
4. Copy to target  
5. Prompt for dependency sync  
6. Show logs & next steps  

---

## ✅ Testing

```bash
npm run test
```

Test structure mirrors the CLI:

```
tests/
├── commands/
└── core/
```

Unit + integration coverage expanding steadily.

---

## 📊 Analytics

Tracks CLI usage (local only):

- Command frequency  
- Timestamp logs  

Stored at:

```
~/.config/modulecrafter-cli/analytics.json
```

Disable it via `config.mjs`.

---

## 🤝 Contributing

```bash
git checkout -b feat/your-feature
```

Then open a PR with:

- Clear description  
- Proper formatting  

---

## 📜 License

MIT © [Akhilesh](https://github.com/akhileshu)

