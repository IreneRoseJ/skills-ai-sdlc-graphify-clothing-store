## Step 8: Exclude index noise

_Welcome to **AI SDLC Skills — Token Optimization**._ :wave:

Works with **Cursor**, **Claude Code**, or **GitHub Copilot**.

**Goal:** Stop your AI assistant from reading files that never help with product questions.

**Why it matters:** Folders like `node_modules` and `dist` use tokens but almost never improve answers.

### Course map

8. **Exclude noise** (this step) — real setup
9. **Context rules** — real setup for your assistant
10. **Reading guide** — one doc for models, prompts, and monitoring

### :keyboard: Activity: Add your assistant’s ignore file

1. **Open the repo root** (same level as `package.json`).
   - Expect: you see `ecommerce-backend/` and `ecommerce-frontend/`.

2. **Pick the ignore file for the tool you use** (create it at the repo root):

| Assistant | Ignore file (repo root) |
| --- | --- |
| **Cursor** | `.cursorignore` |
| **Claude Code** | `.claudeignore` |
| **GitHub Copilot** | `.copilotignore` |

Cursor / Claude / Copilot each read their **own** file — there is no shared `.aiignore`.

3. **Paste this list** into that file:

```gitignore
node_modules/
dist/
build/
coverage/
.git/
*.log
package-lock.json
ecommerce-frontend/dist/
ecommerce-frontend/node_modules/
.env
.env.*
```

4. **Confirm** the file includes `node_modules` and `dist`.
   - Expect: Actions will look for both strings in whichever ignore file you added.

5. **(Optional)** If you switch tools, create the other ignore file(s) with the same patterns.

6. **Commit and push:**

```bash
git add .cursorignore .claudeignore .copilotignore
git commit -m "Exclude noise from AI indexing"
git push
```

(Only the file(s) you created need to be staged.)

7. **Wait about 20 seconds** for Step 9 in the Issue comments.

<details>
<summary>Having trouble? 🤷</summary><br/>

- At least **one** of `.cursorignore`, `.claudeignore`, or `.copilotignore` must be at the **repo root** (Actions grades any of these).
- It must include both `node_modules` and `dist`.
- Use the file that matches the tool you run — they are not interchangeable.
- If Step 9 does not appear, check the **Actions** tab for Step 8.

</details>
