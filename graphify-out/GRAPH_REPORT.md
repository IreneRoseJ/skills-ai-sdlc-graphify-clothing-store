# Graph Report - .  (2026-07-24)

## Corpus Check
- Large corpus: 115 files · ~1,779,477 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 315 nodes · 418 edges · 63 communities (20 shown, 43 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Calcprices() Cartcontroller.js
- Initialstate App.jsx
- Redux
- Swagger
- Workflow Step
- Db.js Connectdb()
- Eslint React
- Valid Router
- Package.json Author
- Dirname Swagger.js
- Usercontroller.js Addaddress
- Graphify
- Step Tests
- React Root
- Logo Asset
- Src/data/products.js Products
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Image Asset:
- Frontend

## God Nodes (most connected - your core abstractions)
1. `api` - 9 edges
2. `Footer()` - 8 edges
3. `Navbar()` - 8 edges
4. `asyncHandler()` - 7 edges
5. `Order` - 7 edges
6. `scripts` - 7 edges
7. `protect` - 6 edges
8. `Product` - 6 edges
9. `User` - 6 edges
10. `connectDB()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Shopping Cart Icon` --conceptually_related_to--> `Course Completion Review`  [INFERRED]
  ecommerce-frontend/public/shopping-cart.svg → .github/steps/x-review.md
- `Social Icons SVG Sprite` --conceptually_related_to--> `Step 2 AI Assistant Integration`  [INFERRED]
  ecommerce-frontend/public/icons.svg → .github/steps/2-ai-assistant-integration.md
- `Layered Hero Visual` --conceptually_related_to--> `Step 4 Build First Knowledge Graph`  [INFERRED]
  ecommerce-frontend/src/assets/hero.png → .github/steps/4-build-first-graph.md
- `Red Commit Gate` --semantically_similar_to--> `Two-Phase Test-First Contract`  [INFERRED] [semantically similar]
  .github/workflows/5-draft-tests.yml → AGENTS.md
- `Exercise Issue Bootstrap` --conceptually_related_to--> `Exercise Issue Link`  [INFERRED]
  .github/workflows/0-start-exercise.yml → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Foundation Sequence** — _github_steps_1_install_graphify_cli_install_step, _github_steps_2_ai_assistant_integration_integration_step, _github_steps_3_add_graphifyignore_ignore_step, _github_steps_4_build_first_graph_build_step, graphify_setup_cli_ok_cli_version_proof [EXTRACTED 1.00]
- **Wave 2 Test-First Cycle** — _github_steps_5_draft_tests_draft_tests_step, _github_steps_6_implement_feature_implement_step, _github_steps_5_draft_tests_test_first_workflow, _github_steps_6_implement_feature_frozen_test_contract, _github_steps_x_review_wave2_wave2_review [EXTRACTED 1.00]
- **Frontend Brand Asset Set** — ecommerce_frontend_src_assets_hero_hero_layered_visual, ecommerce_frontend_src_assets_react_react_logo, ecommerce_frontend_src_assets_vite_vite_logo, ecommerce_frontend_public_icons_social_icons_sprite, ecommerce_frontend_public_shopping_cart_cart_icon [INFERRED 0.75]
- **Workflow Step Progression** — _github_workflows_0_start_exercise_workflow, _github_workflows_1_install_graphify_cli_workflow, _github_workflows_2_ai_assistant_integration_workflow, _github_workflows_3_add_graphifyignore_workflow, _github_workflows_4_build_first_graph_workflow, _github_workflows_5_draft_tests_workflow, _github_workflows_6_implement_feature_workflow [EXTRACTED 1.00]
- **Test-First Enforcement Pattern** — agents_two_phase_test_first_contract, _github_workflows_5_draft_tests_red_commit_gate, _github_workflows_6_implement_feature_green_commit_gate, ticket_cart_selection_requirements [INFERRED 0.85]
- **Checkout Selection Flow Contract** — ticket_cart_selection_requirements, ticket_selection_state_persistence_rule, ecommerce_backend_readme_stripe_checkout_capability [INFERRED 0.75]

## Communities (63 total, 43 thin omitted)

### Community 0 - "Calcprices() Cartcontroller.js"
Cohesion: 0.09
Nodes (23): addToCart, clearCart, getCart, getOrCreateCart(), removeFromCart, updateCartItemQty, calcPrices(), createCheckoutSession (+15 more)

### Community 1 - "Initialstate App.jsx"
Cohesion: 0.17
Nodes (18): App(), Footer(), Navbar(), Cart(), Checkout(), normalizeAddress(), stripePromise, Home() (+10 more)

### Community 2 - "Redux"
Cohesion: 0.07
Nodes (26): axios, dependencies, axios, lucide-react, react, react-dom, react-redux, react-router-dom (+18 more)

### Community 3 - "Swagger"
Cohesion: 0.08
Nodes (25): bcryptjs, colors, cookie-parser, cors, dotenv, express, jsonwebtoken, mongoose (+17 more)

### Community 4 - "Workflow Step"
Cohesion: 0.09
Nodes (24): Exercise Issue Bootstrap, Step 0 Start Exercise Workflow, CLI Proof Gate, Step 1 Install Graphify CLI Workflow, Assistant Integration Gate, Step 2 AI Assistant Integration Workflow, Graphifyignore Gate, Step 3 Add Graphifyignore Workflow (+16 more)

### Community 5 - "Db.js Connectdb()"
Cohesion: 0.16
Nodes (13): connectDB(), Order, orderSchema, Product, productSchema, reviewSchema, addressSchema, User (+5 more)

### Community 6 - "Eslint React"
Cohesion: 0.10
Nodes (21): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+13 more)

### Community 7 - "Valid Router"
Cohesion: 0.18
Nodes (11): getMyOrders, getOrderById, getOrders, createProductReview, getProductById, getProducts, VALID_CATEGORIES, VALID_SORT (+3 more)

### Community 8 - "Package.json Author"
Cohesion: 0.12
Nodes (15): author, description, keywords, license, main, name, scripts, build (+7 more)

### Community 9 - "Dirname Swagger.js"
Cohesion: 0.19
Nodes (10): __dirname, options, swaggerSpec, errorHandler(), notFound(), router, app, clientOrigins (+2 more)

### Community 10 - "Usercontroller.js Addaddress"
Cohesion: 0.23
Nodes (7): addAddress, authUser, deleteAddress, getAddress, logoutUser, registerUser, router

### Community 11 - "Graphify"
Cohesion: 0.27
Nodes (10): Step 1 Install Graphify CLI, Step 2 AI Assistant Integration, Step 3 Add Graphify Ignore, Noise Reduction Policy, Step 4 Build First Knowledge Graph, Course Completion Review, Social Icons SVG Sprite, Shopping Cart Icon (+2 more)

### Community 12 - "Step Tests"
Cohesion: 0.50
Nodes (5): Step 5 Draft Failing Tests, Test-First Workflow, Frozen Test Contract, Step 6 Implement from Frozen Tests, Wave 2 Completion Review

## Knowledge Gaps
- **129 isolated node(s):** `__dirname`, `options`, `SHIPPING_RATES`, `VALID_CATEGORIES`, `VALID_SORT` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Eslint React` to `Redux`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Swagger` to `Package.json Author`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `__dirname`, `options`, `SHIPPING_RATES` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Calcprices() Cartcontroller.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09047619047619047 - nodes in this community are weakly interconnected._
- **Should `Redux` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Swagger` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Workflow Step` be split into smaller, more focused modules?**
  _Cohesion score 0.09057971014492754 - nodes in this community are weakly interconnected._