## Step 1: Clone the repo, set it up, and install the Graphify CLI

This exercise is part of an **AI SDLC** path: use Graphify so AI coding assistants understand a real codebase before you change it.

**What is Graphify?**: Graphify builds a knowledge graph of your project so assistants (Cursor, Claude Code, GitHub Copilot, and others) can navigate cart, orders, and payments more accurately.

### Part A — Clone your exercise repository

After you used **Copy the exercise**, GitHub created a repo under your account (for example `skills-graphify-clothing-store`). Clone **that** repo (not the template):

```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_COPIED_REPO_NAME>.git
cd <YOUR_COPIED_REPO_NAME>
git checkout main
```

Replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_COPIED_REPO_NAME>` with your values.

### Part B — Set up the clothing-store project

You need **Node.js 20.19+** or **22.12+** (frontend uses Vite 8; backend works on 18+, but use one of these so both FE and BE run).

This repo already includes env files:

- **Root** `.env` — API (MongoDB, JWT, Stripe, `CLIENT_URL`, etc.)
- **`ecommerce-frontend/.env`** — Vite (`VITE_API_BASE_URL`, Stripe publishable key)

1. Open those files and adjust values for your machine if needed (for example `MONGO_URI`, ports, or `VITE_API_BASE_URL` so it matches the API `PORT`). Prefer local/private overrides — do not commit new secrets if you can avoid it.

2. Install and (optionally) run the API from the **repo root**:

```bash
npm install
npm start
```

3. In another terminal, run the frontend:

```bash
cd ecommerce-frontend
npm install
npm run dev
```

More detail: see `ecommerce-backend/README.md`.

### Part C — Install the Graphify CLI + commit proof

**What is the Graphify CLI?**: The CLI command is `graphify`. The PyPI package name is `graphifyy`.

Because Actions runs on GitHub’s servers (not your laptop), you leave a **proof file** so we can check that you installed it.

1. Install Graphify:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install graphifyy
graphify --version
```

2. Create the proof file (from the **repo root**):

```bash
mkdir -p graphify-setup
graphify --version > graphify-setup/CLI_OK.md
```

3. Commit and push to `main`:

```bash
git add graphify-setup/CLI_OK.md
git commit -m "Prove Graphify CLI is installed"
git push
```

4. Wait about 20 seconds and watch the Issue comments for Step 2.

<details>
<summary>Having trouble? 🤷</summary><br/>

- Clone **your copied exercise repo**, then work inside that folder.
- Env files are already in the repo (root `.env` and `ecommerce-frontend/.env`) — edit them locally if needed.
- If `graphify: command not found`, open a new terminal or add `~/.local/bin` to your `PATH`.
- Alternative install: `pipx install graphifyy`
- `graphify-setup/CLI_OK.md` must not be empty.
- Check the **Actions** tab if Step 2 does not appear.

</details>
