## Step 3: Add a `.graphifyignore`

_Nice — your AI assistant is connected. Before the first build, tell Graphify what to skip._ :sparkles:

**What is `.graphifyignore`?**: Like `.gitignore`, it tells Graphify which folders to **skip** — for example `node_modules` and Vite/React `dist` output. Add it **before** `graphify .` so your first knowledge graph stays focused on clothing-store source code.

### :keyboard: Activity: Create `.graphifyignore`

1. Create a file named **`.graphifyignore`** in the **repo root** (same level as `package.json`).
2. Paste this content:

```gitignore
.git/
node_modules/
dist/
out/
build/
coverage/
.env
.env.*
*.log
*.zip
package-lock.json
ecommerce-frontend/dist/
ecommerce-backend/images/
```

3. Commit and push to `main`:

```bash
git add .graphifyignore
git commit -m "Add .graphifyignore before first Graphify build"
git push
```

4. Wait about 20 seconds and watch the comments for Step 4.

<details>
<summary>Having trouble? 🤷</summary><br/>

- The file must be named exactly `.graphifyignore` at the **repo root** (not inside `ecommerce-backend/`).
- It must include `node_modules` and `dist`.
- Check the **Actions** tab if you do not get feedback.

</details>
