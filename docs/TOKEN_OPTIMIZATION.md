# Token optimization guide (clothing store)

Use this as a quick reference. Steps 8–9 already set up your tool ignore file and assistant rules.

## 1) Model selection
Default cheap. Escalate only when needed.

| Task | Tier |
|------|------|
| Autocomplete / tiny edits | Haiku-class / fast tier |
| Boilerplate, CRUD, renames | Haiku / Flash-class |
| Daily multi-file feature work | Sonnet-class (workhorse) |
| Hard debugging, auth/payment architecture | Opus-class / frontier |

Rule: Start cheap. If stuck after one focused attempt, escalate and say why.

## 2) Efficient prompts
Order every prompt (helps caching):
1. Stable: project rules / conventions (same every turn)
2. Semi-stable: module names by reference — not paste
3. Volatile: today's ask last

Template:
STABLE:
- Diffs only; no whole-file paste
- Stack: ecommerce-backend + ecommerce-frontend

TASK (volatile):
- <one concrete ask>

Prompt patterns:
- Show only the changed lines for this fix. Do not rewrite entire files.
- Using paymentController by name (do not paste whole files), explain in max 10 bullets.

## 3) Weekly checklist
- [ ] Spot-check 3 chats: were whole files pasted?
- [ ] Did CRUD/rename work stay on a cheap tier?
- [ ] Any chat > 20 messages that should have been reset?
- [ ] `.cursorignore` / `.claudeignore` / `.copilotignore` still excludes node_modules and dist?
- [ ] Note one expensive failure (e.g. payment debug) and whether escalate was justified