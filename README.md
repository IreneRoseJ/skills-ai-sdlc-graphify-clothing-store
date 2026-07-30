# AI SDLC Skills — Graphify Clothing Store

_Practice an AI-assisted SDLC workflow: understand a real Express + React clothing store with Graphify, in under an hour._

## Welcome

This repository is a full-stack clothing store (`ecommerce-backend` + `ecommerce-frontend`). This GitHub Skills-style exercise is part of an **AI SDLC** path: clone the project, set it up, then install **Graphify** so AI coding assistants (**Cursor**, **Claude Code**, **GitHub Copilot**, and others) can understand how cart, orders, and payments connect.

- **Who is this for**: Developers learning AI-assisted development / SDLC with Graphify.
- **What you'll learn**: Clone & local setup, Graphify CLI, AI assistant integration, `.graphifyignore`, and your first knowledge graph.
- **What you'll build**: Concrete commits that Actions can verify.
- **Prerequisites**: A GitHub account; basic git (`add` / `commit` / `push`); Node.js 18+ for local setup.
- **How long**: About 30–45 minutes.

In this exercise, you will:

1. Clone the repo, configure the project, and install the Graphify CLI
2. Connect Graphify to your AI assistant (Cursor, Claude, or Copilot)
3. Add a `.graphifyignore` (before the first build)
4. Build and commit your first knowledge graph

### How progress works

After you copy the exercise, **Step 0** opens a single exercise Issue and posts Step 1 as a comment. Each time you finish a step (by pushing the required file to `main`), Actions checks your work and posts the **next** step as another comment on that same Issue. Follow the Issue comments — not only the README.

### How to start this exercise

Copy the exercise to your account. On the **new** repo, wait about **20 seconds** for Actions (Step 0) to finish, then **refresh the page** — the button changes from **Copy the exercise** to **Go to the exercise**. Open that link (the exercise Issue) and follow the comments (clone + setup + Graphify are in Step 1).

[![](https://img.shields.io/badge/Copy%20the%20exercise-%E2%86%92-1f883d?style=for-the-badge&logo=github&labelColor=197935)](https://github.com/new?template_owner=vaishnavi-qb&template_name=clothing-store&owner=%40me&name=skills-ai-sdlc-graphify-clothing-store&description=Exercise:+AI+SDLC+Skills+-+Graphify+Clothing+Store&visibility=public)

<details>
<summary>Having trouble? 🤷</summary><br/>

When copying the exercise, we recommend:

- Owner: your personal account (or an org you can use)
- Visibility: **public** (private repos use Actions minutes)

If nothing happens after 20 seconds, check the **Actions** tab on your copied repo:

- A job may still be running
- If a job failed, open it for logs — or re-run `0-start-exercise.yml` via **workflow_dispatch**

Also confirm on the template repo:

1. **Settings → General → Template repository** is enabled
2. **Settings → Actions** allows Actions
3. Workflow permissions = **Read and write**

</details>

---

## About this codebase (optional)

| Area | Path |
|------|------|
| API entry | `ecommerce-backend/server.js` |
| Cart / orders / payments | `ecommerce-backend/routes/` + `controller/` |
| Storefront | `ecommerce-frontend/src/` |
| Backend how-to-run | [`ecommerce-backend/README.md`](ecommerce-backend/README.md) |
| Swagger | http://localhost:3000/api-docs |

### How to run the backend

Requires Node.js 18+ and MongoDB. Env file is at the **repo root** (`.env`), not inside `ecommerce-backend/`.

```bash
# From the repository root — create a .env file with at least:
#   MONGO_URI=mongodb://127.0.0.1:27017/clothing-store
#   JWT_SECRET=change-me
#   CLIENT_URL=http://localhost:5173
#   API_PUBLIC_URL=http://localhost:3000

npm install
npm start              # nodemon → http://localhost:3000
npm run data:import    # optional: seed users + products
```

Full backend details (env table, seed, production): see **[ecommerce-backend/README.md](ecommerce-backend/README.md)**.

### How to run the frontend

```bash
cd ecommerce-frontend
npm install
npm run dev            # Vite → http://localhost:5173
```

---

&copy; 2026 &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)
