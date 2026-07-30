## Review — AI SDLC Skills complete

### 🚀 You finished the course!

You practiced an AI SDLC setup on the clothing store: local project setup + Graphify with automatic Skills-style checks.

### What you completed

1. Cloned/set up the project and installed the Graphify CLI (proof file)
2. Connected Graphify to your AI assistant (Cursor, Claude Code, and/or Copilot)
3. Added `.graphifyignore` (skips `node_modules` and `dist`)
4. Built and committed `graphify-out/GRAPH_REPORT.md`

### Daily workflow

```bash
graphify . --update
graphify hook install
graphify query "how does the shopping cart work?"
graphify path cartController paymentController
```

### Keep learning

- Trace checkout in `ecommerce-backend/controller/paymentController.js`
- Explore cart routes in `ecommerce-backend/routes/cartRoutes.js`
- Open `graphify-out/GRAPH_REPORT.md` and try more queries
- After code changes, run `graphify . --update` (respects `.graphifyignore`)
- Ask your assistant (Cursor / Claude / Copilot) architecture questions — it should prefer the graph when integration is installed

See you in the next exercise! :wave:
