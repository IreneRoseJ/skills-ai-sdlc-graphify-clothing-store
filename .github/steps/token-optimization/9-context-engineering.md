## Step 9: Add context rules

_Noise is out — now teach your assistant lean habits._ :sparkles:

**Goal:** Add always-on rules so the assistant prefers diffs, skips junk, and keeps chats short.

**Why it matters:** Rules apply every turn. You don’t have to retype them.

### :keyboard: Activity: Add lean always-on instructions

1. **Pick one file** for your assistant:

| Assistant | File |
|-----------|------|
| **Cursor** | `.cursor/rules/token-efficiency.mdc` |
| **Claude Code** | `CLAUDE.md` |
| **GitHub Copilot** | `.github/copilot-instructions.md` or `AGENTS.md` |

2. **Create or open that file.**
   - For Cursor, create `.cursor/rules/` if needed.

3. **If you use Cursor**, put this at the top of `token-efficiency.mdc`:

```yaml
---
alwaysApply: true
---
```

4. **Paste this body** (keep the ideas even if you tweak wording):

```markdown
# Token efficiency and context

## Do
- Prefer diffs / changed lines only
- Reference symbols by name instead of pasting whole files
- Front-load hard constraints; put the changing task last
- Start a fresh session per task; compact around 40-50% context use

## Don't
- Paste entire files for context
- Index or discuss node_modules, lockfiles, or dist/
- Let one chat sprawl across unrelated tasks
```

5. **Self-check:** file mentions diffs/changed lines, `node_modules` or paste, and **40-50%** or **fresh session**.

6. **Commit and push:**

```bash
git add .cursor/rules/token-efficiency.mdc CLAUDE.md AGENTS.md .github/copilot-instructions.md
git commit -m "Add token-efficiency context rules"
git push
```

7. **Wait about 20 seconds** for Step 10.

<details>
<summary>Having trouble? 🤷</summary><br/>

Actions accepts **any one** of: `.cursor/rules/token-efficiency.mdc`, `CLAUDE.md`, `.github/copilot-instructions.md`, `AGENTS.md`.

Must mention: diffs or changed lines; `node_modules` or paste; **40-50%** or fresh session.

</details>
