## Step 4: Build your first knowledge graph

_`.graphifyignore` is in place — time to build a clean graph!_ :sparkles:

**What is a knowledge graph?**: Graphify reads your project (skipping ignored folders) and writes outputs like `graphify-out/GRAPH_REPORT.md` and `graph.json` so you (and any AI assistant) can query how the clothing store code connects — cart, orders, payments, and the React storefront.

### :keyboard: Activity: Create the graph with `/graphify .`

1. Open **Cursor / your AI assistant chat** from the **project root** (where `package.json` and `.graphifyignore` are — after Step 2 integration). Run:

```text
/graphify .
```

2. Confirm these exist under `graphify-out/`:

- `GRAPH_REPORT.md` (required for Actions)
- `graph.json` (optional but recommended)
- `graph.html` (optional — open in a browser to explore)

3. Test with a sample prompt:

In your AI assistant chat, try a test prompt to verify it's working:

```text
What are the main components connecting the cart and payment systems?
```

This confirms you can query it to understand your codebase structure.

4. Commit `graphify-out/` and push to `main` (message example: `Add first Graphify knowledge graph`).

5. Wait about 20 seconds and watch the comments for Step 5.

<details>
<summary>Having trouble? 🤷</summary><br/>

- Run `/graphify .` in Cursor / assistant chat from the **repo root** (not inside `ecommerce-frontend/` or `ecommerce-backend/`).
- `.graphifyignore` must already be on `main` so `node_modules` and `dist` are skipped.
- Actions only requires a non-empty `graphify-out/GRAPH_REPORT.md`.
- Open `graphify-out/graph.html` in a browser to explore the graph.
- Check the **Actions** tab if Step 5 does not appear.

</details>
