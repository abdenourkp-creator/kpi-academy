# KPI Academy — Visual Transformation Blueprint

**Status:** Mission 00 — baseline and execution blueprint  
**Reference standard:** Owner-supplied Home Dashboard and Lesson Experience mockups  
**Working baseline:** `fix/phase1-drawer-bidi-deploy-safety` (draft PR #4; not merged)  
**Product implementation:** HTML5, CSS3, Vanilla JavaScript, JSON curriculum manifests, Markdown lesson manuscripts  
**Primary target:** Premium responsive mobile web application, with desktop support

## 1. Product direction

KPI Academy is a hospitality business intelligence learning product, not a generic course catalogue. Its visual experience must communicate operational credibility, financial intelligence, and premium hospitality.

The two approved reference screens define two distinct but connected experiences:

1. **Home Dashboard — learner command centre.** Establish brand identity, learner identity, progress, current learning priority, and fast access to learning tools.
2. **Lesson Experience — applied learning workspace.** Turn a concept into a hospitality case, guided calculation, visible result, and managerial interpretation.

The goal is to reproduce the design language and interaction hierarchy in a real, responsive, accessible application. The mockups are visual references, not assets to be copied pixel-for-pixel. Decorative elements must never replace real functionality.

## 2. Reference decomposition

### 2.1 Home Dashboard

Required hierarchy, top to bottom:

1. **Compact premium app header:** menu, distinctive KPI Academy mark/wordmark, notification affordance, learner avatar. On narrow screens, preserve readable brand proportions and touch targets.
2. **Brand hero:** hospitality-specific visual, Arabic primary headline, supporting promise, restrained gold accent. Avoid oversized empty hero areas.
3. **Learner identity row:** greeting/name, learner level, and optional achievement/status chip. Use real learner data; do not hardcode an identity or rank.
4. **Progress command panel:** circular overall progress, earned XP, completed lessons, passed assessments. Values must be sourced from the existing learning engine and computed from verified curriculum totals.
5. **Continue-learning feature:** current/recommended next lesson, lesson code, concise description, real progress percentage, contextual image, and a clear resume action.
6. **Quick-action grid:** Analytics, Assessments, Lab/Simulator, KPI Calculator. Each tile must route to its existing functional destination and have a consistent icon, label, and tap area.
7. **Persistent bottom navigation on mobile:** five clear destinations, active state, safe-area support, no overlap with content. Desktop uses the full navigation structure.
8. **Secondary content below the fold:** modules, learning route, recent activity, and other already-supported features in a deliberate order.

### 2.2 Lesson Experience

Required hierarchy, top to bottom:

1. **App header and breadcrumb:** stable access to navigation and module context.
2. **Lesson progress strip:** completed/total lesson count and progress percentage from real learner state.
3. **Lesson identity:** lesson code, title, English technical title where appropriate, concise outcome statement.
4. **Context image or visual explainer:** relevant to the actual lesson topic; no unrelated stock decoration.
5. **Learning-mode navigation:** explanation, practical lab, professional challenge, checklist/verification where supported by the curriculum and application.
6. **Operational case panel:** realistic hospitality context, clearly identified as an educational case when values are synthetic.
7. **Interactive work area:** inputs, calculator or task controls, formula, units, and validation.
8. **Results panel:** numeric result, visual indicator, calculation trace, and clear labels.
9. **Business insight:** explain what the result means operationally, what it does not prove, and what action or additional evidence a manager should consider.
10. **Lesson controls:** previous/next, position in sequence, and completion state. Do not award XP merely for opening or scrolling.

The lesson renderer must continue to support the source manuscripts, structured sections, formulas, tables, and existing evidence gates.

## 3. Visual design language

### 3.1 Brand character

- Deep midnight/navy foundation, layered blue surfaces, controlled cyan for action/progress, warm metallic gold for identity and achievement.
- Premium hospitality atmosphere: composed, precise, confident, and editorial.
- Avoid excessive neon, random glow, gold on every element, or generic SaaS gradients.
- Use contrast and restrained lighting to create hierarchy; effects must not reduce text legibility.

### 3.2 Color roles

The repository already defines a dark palette in `assets/css/tokens.css` including navy backgrounds, glass surfaces, gold, blue/cyan, semantic states, borders, and gradients. Treat that token file as the current palette candidate, not as final proof of correct usage.

Before visual implementation, audit duplicate legacy variables in `assets/css/styles.css` and `assets/css/premium-experience.css`. Establish one authoritative token layer and a documented mapping for legacy selectors. Avoid introducing competing color literals in component styles.

### 3.3 Typography

- Arabic is the primary interface language; English technical terminology must remain legible and correctly isolated.
- Establish a type scale for display, page title, section title, body, metadata, numeric values, and labels.
- Use a dedicated LTR treatment for numbers, formulas, IDs, URLs, currencies, percentages, and technical units.
- Keep the current font fallback stack until the owner approves Home and Lesson screenshots. Do not upload fonts or activate `@font-face` before that approval.

### 3.4 Surfaces and components

Define reusable patterns for:
- app header and navigation;
- hero panels;
- learner identity;
- progress ring and metric rows;
- continue-learning card;
- quick-action tiles;
- lesson header and progress strip;
- hospitality case panels;
- calculator input groups;
- result cards and insight callouts;
- previous/next controls;
- drawers, dialogs, notices, and empty/loading/error states.

Each pattern must specify radius, border, surface, elevation, spacing, typography, interaction states, and mobile behavior. Do not create a new one-off style when a shared component is appropriate.

### 3.5 Imagery

Prefer original, consistent visual assets or carefully art-directed hospitality photography. Images must support the learning subject (restaurant operations, finance, beverage, rooms, service, inventory, analytics) and have a clear crop, focal point, and responsive behavior. Provide meaningful alt text for informative images; decorative images must not create redundant screen-reader output.

## 4. Repository baseline — evidence from current files

The current application is a Vanilla JavaScript product with an existing content and calculation foundation. The repository audit document identifies:
- dashboard, module discovery, lesson reader, KPI calculator, Analytics Lab, Management Simulator, progress, and assessment routes;
- 8 Business Mathematics chapters and 32 source lesson manuscripts;
- 15 approved KPI definitions;
- local learning state, official XP rules, evidence gates, assessments, and backup/restore;
- original SVG visual resources and chapter maps;
- Playwright/browser and Node-based regression coverage.

Relevant current implementation files include:
- `index.html` — app structure and asset loading;
- `assets/css/styles.css` — legacy application layout and screen styling;
- `assets/css/premium-experience.css` — dark hospitality visual layer;
- `assets/css/tokens.css`, `base.css`, `components.css`, `shell.css` — tokenized visual shell;
- `assets/js/app.js` — routing, dashboard, module, and lesson rendering;
- `assets/js/learning-engine.js` and `learning-ui.js` — learner state and progress;
- `assets/js/lesson-experience.js` — interactive BM-005 lab;
- `assets/js/kpi-engine.js` and `calculator.js` — deterministic KPI calculations;
- `assets/js/bidi.js` — current BiDi helper.

Important architecture observation: `index.html` currently loads several legacy/feature stylesheets, then token/base/component/shell stylesheets. `premium-experience.css` is also loaded earlier in the cascade. The visual audit must map selector ownership and specificity before changing load order or consolidating styles. A broad CSS rewrite without that map risks breaking feature-specific lesson labs, simulator, analytics, and mobile behavior.

The current `assets/css/lesson-experience.css` contains a light-surface BM-005 lab while the application shell is dark. This is a concrete consistency issue to evaluate: the lesson lab may intentionally use a paper-like work surface, but the final treatment must be deliberate and consistent with the approved Lesson reference.

## 5. Known gaps from supplied phone screenshots

These are visual observations, not a complete source-code audit:

- The current preview does not yet reproduce the reference's Home hierarchy or progress command panel.
- Learner identity, progress ring, metric rows, and continue-learning feature are not presented as one coherent dashboard sequence.
- The current lesson view reads primarily as stacked text cards rather than a guided applied-learning workspace.
- Mixed Arabic/English strings, currency, dates, units, and numeric expressions are visually unstable in several examples.
- Some drawer/navigation content appears partially off-canvas or overlaps the viewport.
- Card depth, image treatment, spacing rhythm, and action emphasis are inconsistent.
- Some screens show large unused areas while other content is cramped.
- Mobile screenshots are the acceptance baseline; desktop must also remain responsive rather than being treated as a separate afterthought.

## 6. Engineering principles and preservation boundaries

1. Preserve the Vanilla HTML/CSS/JavaScript architecture unless a measured technical reason justifies a change.
2. Preserve curriculum JSON, lesson Markdown, KPI formulas, learning-state schema, XP awards, assessment thresholds, evidence gates, and backup compatibility.
3. Prefer additive, scoped components and CSS tokens over global overrides.
4. Keep all controls functional and keyboard-accessible; visual affordances must correspond to real actions.
5. Use semantic HTML, visible focus states, reduced-motion support, sufficient contrast, and appropriately sized touch targets.
6. Use explicit LTR isolation for technical fragments embedded in Arabic prose; do not reverse strings manually.
7. No fabricated progress, XP, rankings, ratings, benchmark data, or operational outcomes.
8. Synthetic case data must be labelled as educational examples.
9. Do not introduce cloud sync, authentication, analytics tracking, or new product scope during visual transformation.
10. No merge, deployment, changes to `main` or `gh-pages`, Phase 2 work, or font activation without the existing approval gates.

## 7. Execution sequence and acceptance gates

### Mission 00 — Blueprint (this document)
**Deliverable:** this source-grounded visual and technical blueprint.  
**Exit gate:** scope, reference hierarchy, repository map, preservation rules, and measurable acceptance criteria are explicit.

### Mission 01 — Design system audit and specification
**Deliverable:** token/component specification plus selector/cascade map.  
**Work:** inspect all loaded CSS, identify duplicate variables and conflicting selectors, inventory current reusable components, define responsive breakpoints and component states.  
**Exit gate:** one documented visual source of truth; no code changes that alter the approved product direction without a reviewed spec.

### Mission 02 — Home dashboard reconstruction
**Deliverable:** responsive Home matching the first reference's hierarchy using actual learner data.  
**Exit gate:** mobile screenshots at 360/390/430px and desktop screenshot; no overflow; all dashboard values verified against the learning engine; navigation/actions work.

### Mission 03 — Lesson experience reconstruction
**Deliverable:** reusable lesson page pattern matching the second reference while preserving lesson-specific content and labs.  
**Exit gate:** BM-005 and at least one standard Markdown lesson tested; calculations, inputs, section navigation, previous/next, and evidence gates work.

### Mission 04 — Bilingual/RTL engineering
**Deliverable:** stable Arabic/English typography and technical-value isolation across Home, lesson, navigation, calculator, tables, and reports.  
**Exit gate:** regression samples for currency, decimals, dates, percentages, IDs, URLs, parentheses, units, and mixed punctuation render correctly in both language modes.

### Mission 05 — Hospitality visual assets
**Deliverable:** consistent, topic-specific image/illustration set with responsive crops and accessible descriptions.  
**Exit gate:** every image has a defined content purpose, license/source provenance, fallback, and correct placement.

### Mission 06 — Functional integration
**Deliverable:** all visible controls connected to existing routes, data, calculations, and learner state.  
**Exit gate:** no decorative dead controls; existing engine and content regression tests pass.

### Mission 07 — Mobile and desktop QA
**Deliverable:** screenshot matrix, functional regression report, accessibility review, and defect list.  
**Exit gate:** tested at 360, 390, 430, 768, 1024, and 1366px; no horizontal overflow; critical journeys pass; no critical RTL or navigation defects.

### Mission 08 — Final visual approval
**Deliverable:** before/after comparison against both supplied references and an acceptance report.  
**Exit gate:** owner approval. Do not self-certify final visual acceptance.

## 8. Visual acceptance rubric

| Dimension | Weight | Evidence required |
|---|---:|---|
| Brand identity and consistency | 15 | Token and component consistency across screens |
| Home Dashboard | 15 | Reference hierarchy, real metrics, responsive screenshots |
| Lesson Experience | 20 | Case → interaction → result → insight flow |
| Arabic/English and RTL | 15 | Mixed-script regression and phone screenshots |
| Hospitality imagery | 10 | Relevant, consistent, accessible visual assets |
| Component craft and detail | 10 | Spacing, states, borders, focus, responsive behavior |
| Functional integrity | 10 | Existing journeys and regression tests |
| Responsive quality | 5 | Required viewport matrix |
| **Total** | **100** | |

Target: at least 90/100 and no critical functional, accessibility, or RTL defects. The score is a review tool, not a substitute for owner approval.

## 9. Immediate next task

**Mission 01 — Design System Audit and Specification.**

Inspect the full stylesheet load order and selector cascade, dashboard and lesson markup/rendering paths, responsive breakpoints, and existing visual assets. Produce a precise component inventory and a single-source-of-truth design specification before large-scale screen reconstruction. Keep implementation changes scoped to a separate approved deliverable; do not mix speculative global CSS overrides into the audit.
