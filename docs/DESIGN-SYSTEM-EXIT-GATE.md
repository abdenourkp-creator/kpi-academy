# KPI Academy — Design System Exit-Gate Review

**Task:** 01.28 — Design System exit-gate review  
**Reviewed branch:** `fix/phase1-drawer-bidi-deploy-safety`  
**PR:** #4, open / draft / unmerged  
**Exact reviewed head:** `69c353aa8ea347fe7aef23f25a80af99b0db2328`  
**Base:** `implementation/kpi-academy-mvp`  
**Review outcome:** **Phase 1 remains open. Do not start Mission 02 yet.**

This is a source-grounded gate decision, not a visual approval. The current CI proves the existing application remains healthy; it does not prove that the two approved reference screens have been reconstructed.

## 1. Repository and CI evidence

- PR #4 metadata confirms the head and base above, with `state=open`, `draft=true`, and `merged=false`.
- The preceding branch head was `72f7544f59c7585562037ec0430843a828b8d7e8`. Comparing it to the reviewed head shows exactly one commit ahead and three changed files: `assets/css/styles.css`, `tests/design-tokens.test.js`, and `docs/TOKEN-OWNERSHIP-CONTRACT.md`.
- Reviewed commit: `69c353aa8ea347fe7aef23f25a80af99b0db2328` — `refactor(tokens): remove dormant radius aliases`.
- GitHub Actions run #392 belongs to this exact head and completed successfully:
  - `verify`: success, including curriculum, KPI calculations, learning engine, assessments, labs, BiDi, visual asset registry, and canonical design-token tests.
  - `browser`: success, including the existing smoke test and baseline before/after capture.
  - `package`: success.
  - `deploy-preview`: skipped.
- No deployment, merge, or changes to `main` / `gh-pages` occurred.

The browser job is baseline regression evidence only. It is not a comparison against the two owner-approved phone screenshots and is not Home/Lesson visual acceptance.

## 2. Gate assessment

| Gate | Result | Evidence / remaining work |
|---|---|---|
| Mission 00 — Blueprint | **PASS** | Reference hierarchy, product direction, preservation boundaries, acceptance rubric, sequence, and image-slot intent are documented in `VISUAL-TRANSFORMATION-BLUEPRINT.md`. |
| Mission 01 — Token source | **PARTIAL** | `tokens.css` contains 96 canonical token declarations. Recent text/status/radius migrations are guarded by tests. Several legacy and duplicate declarations remain, but they can be retired incrementally as surfaces move. |
| Mission 01 — Selector/cascade map | **PASS WITH DEBT** | The 16-file load order, selector overlap, responsive fragmentation, page ownership, image slots, and target CSS architecture are documented in `STYLE-OWNERSHIP-MAP.md`. |
| Mission 01 — Component specification | **BLOCKED** | `components.css` currently contains only four baseline primitives: `.ka-card`, `.ka-button`, `.ka-chip`, and `.ka-progress`. There is no complete component contract/state matrix for the Home and Lesson patterns, including variants, interaction states, responsive behavior, accessibility, and content/image relationships. |
| Mission 01 — Runtime/data ownership | **PASS** | Home metrics and resume selection are sourced through `KPI_LEARNING_UI.dashboardSummary()` and `ENGINE.getDashboard()`. Lesson content remains owned by the Markdown renderer and existing lab mounts; BM-005 remains owned by `lesson-experience.js`. |
| Mission 01 — Image-slot contract | **PASS AS SPECIFICATION** | The style map records Home hero (16:9), continue-learning (16:9), lesson hero (16:9), hospitality case (4:3), and technical explainer (4:3 or 1:1), including subject/purpose, crop, alt/caption, responsive placement, and fallback rules. Actual assets and rendered slots remain future work. |
| Mission 01 — Responsive contract | **PASS AS TEST PLAN; DEBT REMAINS** | Target bands are documented, but the active CSS still contains 13 distinct width breakpoints. Do not globally consolidate them before page-specific migration. |

## 3. Exact current source findings

The review re-fetched all 16 stylesheets linked by `index.html` at the reviewed head.

### Canonical token ownership

- `tokens.css` contains 96 unique `--ka-*` declarations.
- Seven older `--ka-*` names remain declared only in `styles.css` and are absent from `tokens.css`: `--ka-navy`, `--ka-light`, `--ka-soft`, `--ka-error`, `--ka-type-body`, `--ka-type-small`, and `--ka-type-label`.
- Nine canonical names are still redeclared in `styles.css` as well as `tokens.css`: `--ka-blue`, `--ka-bg`, `--ka-surface`, `--ka-text`, `--ka-muted`, `--ka-border`, `--ka-success`, `--ka-warning`, and `--ka-font-ar`. The later `tokens.css` layer wins in the active document order.
- Eight unprefixed aliases remain declared in both `styles.css` and `premium-experience.css`: `--blue`, `--navy`, `--light-blue`, `--bg`, `--surface`, `--muted`, `--border`, and `--shadow`. Across the full loaded stack these aliases still have 205 `var()` consumers.
- The recent radius cleanup is complete: each of `--ka-radius-sm`, `--ka-radius-md`, `--ka-radius-lg`, `--ka-radius-control`, and `--ka-radius-pill` has one canonical declaration in `tokens.css`.

These legacy declarations are **migration debt, not permission for a global rewrite**. New Home/Lesson components must consume canonical tokens. Existing feature consumers should be migrated in small groups with preserved effective values and regression tests.

### Selector and literal debt

The ownership map's source scan records 999 normalized selector strings, 233 repeated across multiple stylesheets, and 179 shared between `styles.css` and `premium-experience.css`. The same map records approximately 1,130 raw color occurrences and 13 distinct numeric breakpoints. The current exact-head scan counted 1,123 raw color occurrences.

Do not resolve this debt by reordering or replacing all stylesheets. The documented migration strategy is page/feature-scoped ownership with the existing feature sheets retained until their consumers are verified.

### Existing shared primitives

The current `components.css` source defines:
- `.ka-card`: gradient surface, border, medium radius, padding, primary text.
- `.ka-button`: 48px minimum height, gradient action surface, control radius, white text, button shadow.
- `.ka-chip`: inline status/metadata treatment.
- `.ka-progress` and its child span: track and fill.

The global `base.css` provides focus-visible outlines and reduced-motion handling; `shell.css` provides navigation hover/active behavior and drawer states. Those are useful foundations, but they do not constitute a full contract for page-level cards, metric groups, progress rings, image frames, case panels, result/insight panels, and lesson navigation.

## 4. Preservation and implementation boundaries

The Home renderer currently includes a command-centre SVG and delegates learner summary to the learning engine. The existing resume candidate is selected from real in-progress/next-incomplete lesson state. A new presentation must not hard-code progress, XP, lesson counts, rankings, or learner identity.

The Lesson renderer continues to load the original Markdown manuscripts and mounts BM-001 through BM-004 labs. BM-005 keeps its current task, feedback, progress, and insight behavior. A new lesson layout must wrap these existing sources and mount points rather than replacing them with static mockup content.

Image placement rules remain:
- Home hero: 16:9, hospitality editorial subject, cover crop, Arabic alt text, optional caption, designed navy fallback.
- Continue-learning: 16:9, subject tied to the actual resume lesson; title, progress, and action remain visible without scrolling past decoration.
- Lesson hero: 16:9 contextual hospitality scene; keep instructional diagrams separate and use contain for diagrams.
- Practical hospitality case: 4:3; case data and controls remain prominent; synthetic scenarios are labelled illustrative.
- Every slot needs a stable key, subject/image brief, aspect ratio, responsive behavior, alt text, optional caption, provenance, and polished fallback.

No curriculum JSON, lesson Markdown, KPI formulas, calculation engines, XP awards, learner-state schema, progress data, evidence gates, or backup compatibility may change as part of the visual work. No font upload or `@font-face` activation before owner approval of both Home and Lesson.

## 5. Exit decision

**Do not close Mission 01 yet. Do not begin Mission 02 in this run.**

The remaining blocker is a missing, explicit component specification—not a need to finish every legacy-token cleanup first. The existing source map and token contract are sufficient to avoid more broad audit work. The next task should turn the current primitives and page requirements into a reviewable component contract before any Home markup or page CSS is introduced.

## 6. Next micro-task — 01.29

Create `docs/COMPONENT-SPECIFICATION.md` as a documentation-only deliverable. Define, at minimum:

1. App header, mobile navigation, and drawer.
2. Home hero, learner identity, progress ring, metric panel, continue-learning card, and quick-action tile.
3. Lesson breadcrumb/progress, lesson identity, media frame, hospitality case panel, interactive-lab wrapper, result/insight panels, and previous/next controls.
4. Shared component anatomy, semantic token roles, spacing/radius/elevation, typography, responsive behavior, and content hierarchy.
5. State matrix: default, hover, active, focus-visible, disabled, loading, empty, error, and completed where relevant.
6. Keyboard/accessibility requirements, minimum touch targets, reduced motion, RTL behavior, and LTR isolation for formulas, currency, dates, IDs, URLs, and units.
7. Image-slot contract for aspect ratio, subject, image brief, crop, alt text, caption, responsive behavior, provenance, and fallback.

The document must identify existing runtime owners and distinguish reusable primitives from page-specific components. It must not introduce production markup/CSS, assets, fonts, or behavior. After that specification is reviewed, re-run the Phase 1 exit gate before beginning Home Dashboard implementation.
