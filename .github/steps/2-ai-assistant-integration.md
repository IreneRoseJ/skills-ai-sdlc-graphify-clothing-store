## Step 2: Connect Graphify to your AI assistant

_Nice work installing the CLI!_ :sparkles:

**Why connect an assistant?**: Graphify can install project guidance so your AI coding tool prefers the knowledge graph over blind file search. Use whichever assistant you already work with — **Cursor**, **Claude Code**, or **GitHub Copilot** (and related tools that use `AGENTS.md`).

### :keyboard: Activity: Install integration for your tool

1. From your project root (where `package.json` and `ecommerce-backend/` live), run **one** of these:

**Cursor**

```bash
graphify cursor install --project
```

Expect: `.cursor/rules/graphify.mdc`

**Claude Code**

```bash
graphify claude install
```

Expect: `CLAUDE.md` (mentions Graphify) and related Claude hooks/settings as Graphify creates them

**GitHub Copilot** (CLI / VS Code Copilot Chat)

```bash
graphify vscode install
```

Expect: files such as `AGENTS.md` and/or `.github/copilot-instructions.md` that mention Graphify

> Tip: You only need **one** assistant for this step. Installing more than one is fine too.

2. Commit the files Graphify created and push to `main`. Make sure to add all your changes in a single commit.

3. Wait about 20 seconds and watch the comments for Step 3.

<details>
<summary>Having trouble? 🤷</summary><br/>

- Actions accepts **any one** of: `.cursor/rules/graphify.mdc`, `CLAUDE.md` (with “graphify”), `AGENTS.md` (with “graphify”), or `.github/copilot-instructions.md` (with “graphify”).
- If you only change `AGENTS.md`, push then trigger **Step 2** with **Run workflow**.
- If your platform wrote a different path, check Graphify’s CLI output and either commit that file (if it matches above) or re-run with the command for your tool.

</details>
