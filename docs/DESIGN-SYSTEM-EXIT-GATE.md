# KPI Academy — Design System Exit-Gate Review

**Task:** 01.30 — final Phase 1 exit-gate reassessment  
**Reviewed branch:** `fix/phase1-drawer-bidi-deploy-safety`  
**PR:** #4 — open / draft / unmerged  
**Exact reviewed head:** `56e5f943f8ac8c232ba97635b97ed6e3c5d92342`  
**Base:** `implementation/kpi-academy-mvp`  
**Decision:** **PASS WITH DOCUMENTED LEGACY DEBT — Phase 1 design-system audit and specification are complete. Phase 2 remains NOT STARTED and is held.**

This decision closes the design-system specification gate only. It is not a claim that Home or Lesson has been reconstructed, that either approved phone reference has passed visual comparison, or that the owner has granted final visual approval.

## 1. Repository and CI evidence

- Repository: `abdenourkp-creator/kpi-academy`.
- PR #4 is `open`, `draft=true`, and `merged=false`; it targets `implementation/kpi-academy-mvp`.
- The PR head and the named feature branch both resolve to `56e5f943f8ac8c232ba97635b97ed6e3c5d92342`.
- Latest commit: `docs: define Home and Lesson component contracts`.
- The commit adds only `docs/COMPONENT-SPECIFICATION.md`; no production source or test file changed in Task 01.29.
- GitHub Actions run #394 belongs to this exact head (`45427911759`) and completed:
  - `verify`: success — JavaScript syntax, KPI calculations, Markdown renderer, curriculum integrity, learning engine, assessments, BM-001–BM-004, BM-005 lesson experience, percentage labs, Analytics Lab, Management Simulator, Live Venue, release integrity, study tools, visual asset registry, BiDi, and design-token tests.
  - `browser`: success — Playwright installation, Chromium installation, browser smoke test, baseline before/after capture, and visual artifact upload.
  - `package`: success — static test build assembled and uploaded.
  - `deploy-preview`: skipped as configured for this pull-request event.
- The browser capture is regression evidence against the repository's stored pre-redesign baseline. It is **not** a visual comparison against the two owner-approved phone screenshots and is not Home/Lesson visual acceptance.
- No merge, deployment, font activation, or edits to `main` / `gh-pages` occurred.

## 2. Gate assessment

| Gate | Result | Evidence and boundary |
|---|---|---|
| Mission 00 — Blueprint | **PASS** | Product direction, Home/Lesson reference hierarchy, preservation rules, implementation sequence, visual rubric, and approval gates are explicit in `VISUAL-TRANSFORMATION-BLUEPRINT.md`. |
| Mission 01 — Canonical token foundation | **PASS WITH DEBT** | `tokens.css` contains 96 canonical `--ka-*` declarations. The five radius tokens have one canonical declaration each. The legacy `--text` consumer migration is complete (zero direct `var(--text)` consumers in the active stylesheet stack). Other legacy aliases remain documented for feature-scoped migration; they are not a reason to rewrite the entire stylesheet stack before page work. |
| Mission 01 — Selector/cascade ownership | **PASS WITH DEBT** | `STYLE-OWNERSHIP-MAP.md` records the 16-file load order, selector overlap, responsive fragmentation, page/runtime ownership, and a safe incremental migration order. Existing overlapping legacy selectors and breakpoints remain explicit debt. New page components must use canonical tokens and scoped `ka-` ownership. |
| Mission 01 — Component specification | **PASS** | `COMPONENT-SPECIFICATION.md` defines shared shell, Home, and Lesson component contracts; existing versus proposed components; token roles; typography; state matrix; responsive bands; accessibility; RTL/LTR isolation; runtime ownership; and future acceptance criteria. |
| Mission 01 — Runtime/data ownership | **PASS** | Current Home, lesson Markdown, learner-state, XP, evidence, and BM-001–BM-005 ownership is identified and rechecked against the active JavaScript sources. |
| Mission 01 — Educational image slots | **PASS AS SPECIFICATION** | Five stable slots define subject, image brief, aspect ratio, crop/fit, responsive behavior, alt text, optional caption, provenance, and fallback. Actual image assets and rendered placement remain future implementation work. |
| Mission 01 — Responsive/accessibility contract | **PASS AS SPECIFICATION** | Phone/tablet/desktop bands, minimum touch-target guidance, focus-visible, reduced-motion, navigation/drawer, and RTL/LTR requirements are documented. Device-matrix visual QA remains a later acceptance task. |

### Accepted debt — not exit blockers

The active application still loads 16 stylesheets. The canonical token layer has 96 declarations, while legacy/duplicate variable declarations and unprefixed aliases remain in older feature sheets. A current source scan of the first eight active stylesheets found 24 `--ka-*` declarations outside `tokens.css`; the eight shared unprefixed aliases still have 205 active `var()` consumers across the loaded stack. The ownership map also documents repeated selectors and fragmented breakpoints.

This debt is deliberately **not** being cleared with a global cascade rewrite. Existing feature sheets remain in place until their consumers can be migrated in small, value-preserving, tested groups. The component specification establishes the rule for new work: use canonical tokens, page-scoped `ka-` selectors, and preserve feature-owned behavior.

## 3. Exact source evidence at the reviewed head

### Stylesheet and design-system foundation

- Re-read `index.html` and confirmed the active 16-file CSS order:
  1. `styles.css`
  2. `lesson-experience.css`
  3. `visual-learning.css`
  4. `study-tools.css`
  5. `percentage-labs.css`
  6. `simulator.css`
  7. `live-venue.css`
  8. `premium-experience.css`
  9. `bm001-lab.css`
  10. `bm002-lab.css`
  11. `bm003-lab.css`
  12. `bm004-lab.css`
  13. `tokens.css`
  14. `base.css`
  15. `components.css`
  16. `shell.css`
- `tokens.css` contains 96 `--ka-*` declarations. The canonical radius family is owned there: small 16px, medium 20px, large 28px, control 14px, and pill 999px.
- `components.css` intentionally remains a small primitive layer: `.ka-card`, `.ka-button`, `.ka-chip`, and `.ka-progress`. The page-level components in the specification are proposed scoped components, not falsely reported as already implemented.
- `base.css` supplies visible focus outlines and reduced-motion handling.
- `shell.css` supplies the responsive navigation, safe-area-aware mobile bottom navigation, and drawer open/closed pointer/visibility behavior.
- `tests/design-tokens.test.js` guards canonical token values and migrations. Run #394 passed this suite.

### Home and learner-data ownership

- Home composition remains `dashboard()` in `assets/js/app.js`.
- Learner summary is supplied by `KPI_LEARNING_UI.dashboardSummary()` in `assets/js/learning-ui.js`, which reads `ENGINE.getDashboard()`.
- The current resume candidate and progress values must remain engine-derived. No hard-coded learner identity, XP, progress, rankings, or lesson counts are allowed in the redesigned presentation.

### Lesson and completion ownership

- Lesson manuscripts continue through `lessonView()` and `markdownHtml()` in `assets/js/app.js`.
- BM-001 through BM-004 retain their dedicated modules and mount points.
- BM-005 remains owned by `assets/js/lesson-experience.js` and its existing `.le-*` hooks.
- `learning-engine.js` defines 90 XP per lesson and validates four evidence keys: interactive lab, professional challenge, field checklist, and learner attestation. The engine awards XP once after the required evidence; opening or scrolling a lesson does not award XP.
- The component specification preserves the existing percentage labs, study tools, route hashes, local persistence, and backup compatibility.

### Component and image specification

The 13-section component specification covers:
- app header, desktop sidebar, mobile bottom navigation, More drawer, and learner identity;
- Home hero, learner row, progress command panel/ring, metric group, continue-learning card, quick actions, modules, and secondary content;
- lesson toolbar/breadcrumb, progress strip, identity/outcome, media frame, learning modes, Markdown surface, hospitality case, lab wrapper, results/calculation trace, business insight, evidence/completion, and previous/next navigation;
- default, hover, active, focus-visible, disabled, loading, empty, error, and completed states;
- responsive bands from 360px phones through desktop, keyboard/accessibility, reduced motion, and bidirectional text handling.

The five image-slot keys are:
- `home.hero.hospitality` — 16:9;
- `home.continue.topic` — 16:9;
- `lesson.hero.topic` — 16:9;
- `lesson.case.hospitality` — 4:3;
- `lesson.diagram.topic` — 4:3 or 1:1.

Each slot keeps instructional text and controls in normal flow, specifies alt text/caption and provenance, and has an intentional fallback. No new image asset was uploaded or activated in this task.

## 4. Non-negotiable preservation and approval boundaries

All future visual implementation must preserve:
- curriculum manifests, lesson Markdown, lesson identifiers/order, and learning content;
- KPI definitions, formulas, calculation engines, rounding, units, and result semantics;
- XP rules, assessment thresholds, evidence gates, progress-state schema, local learner data, and backup compatibility;
- route hashes, existing functional destinations, lab mounts, and BM-001–BM-005 behavior.

No font upload or `@font-face` activation before owner approval of both reconstructed Home and Lesson screens.

The two approved phone screenshots remain the visual target. The current CI browser capture does not replace a dedicated comparison against those references. No Home/Lesson visual approval is implied by this Phase 1 decision.

## 5. Final exit decision

**Mission 00 — Blueprint: complete.**  
**Mission 01 — Design System audit and specification: complete, with documented legacy migration debt.**

The exit gate is **PASS WITH DOCUMENTED DEBT**. The project now has a source-grounded blueprint, stylesheet ownership map, canonical token contract, component specification, explicit image-slot contracts, preserved runtime ownership, and a green CI run on the exact reviewed head.

**Mission 02 / Home Dashboard is NOT STARTED.** It remains held under the current execution instruction. This document does not authorize implementation, merge, deployment, font activation, or final visual approval.

## 6. Next permitted action

No further Phase 1 audit or broad token cleanup is required before page-level design work. The next product implementation would be the Home Dashboard reconstruction on an isolated feature branch, consuming real learner data and the five documented image-slot contracts.

**Do not begin that work until the instruction prohibiting Phase 2 has been lifted.** Until then, keep PR #4 draft and unmerged, and make no changes to `main`, `gh-pages`, deployment workflows, fonts, or production Home/Lesson markup.
