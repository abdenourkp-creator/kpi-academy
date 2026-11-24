# KPI Academy — Canonical Token Ownership Contract

**Mission:** 01 — Design System Audit  
**Tasks:** 01.5–01.17 — staged design-system ownership, semantic status, layout/elevation, and text-role audits/migrations
**Audited branch:** `fix/phase1-drawer-bidi-deploy-safety`  
**Audited commit:** 0e2e917371308c56302d57c5590863c9bb7d9d63
**Implementation base:** `c78d94f199e2885f927f33fad1cd03c28fc25c6f`  
**Scope:** all 16 stylesheets loaded by the current `index.html`; static CSS custom-property declarations and `var()` references. This contract records staged token migrations while preserving effective values; no JavaScript, curriculum, learner-state, XP, calculation, or font-loading behavior is changed.

## 1. Executive decision

`assets/css/tokens.css` is the canonical owner for global design tokens in the target architecture.

The legacy variables in `styles.css` and `premium-experience.css` must not be globally aliased or deleted in one pass. Several names are semantically overloaded: the same variable is used for text, surfaces, and interactive states. A one-to-one alias would change meaning for some consumers and could damage contrast or component states.

The migration rule is therefore:

1. Define a canonical semantic token in `tokens.css`.
2. Migrate a small, known consumer group to that token.
3. Compare before/after behavior at the actual component and viewport.
4. Remove the legacy declaration only after its consumer count reaches zero.
5. Keep feature-local styling isolated; do not make a global palette change to fix one lab.

The staged migrations do not alter the effective visual values of their migrated consumers. Task 01.5 relocates the legacy layout/elevation values; Task 01.6 relocates the premium success-state value into a canonical status token and updates its 13 known consumers.

## 2. Verified source facts

The audit was run against the branch head shown above. The actual stylesheet order in `index.html` is:

1. `assets/css/styles.css`
2. `assets/css/lesson-experience.css`
3. `assets/css/visual-learning.css`
4. `assets/css/study-tools.css`
5. `assets/css/percentage-labs.css`
6. `assets/css/simulator.css`
7. `assets/css/live-venue.css`
8. `assets/css/premium-experience.css`
9. `assets/css/bm001-lab.css`
10. `assets/css/bm002-lab.css`
11. `assets/css/bm003-lab.css`
12. `assets/css/bm004-lab.css`
13. `assets/css/tokens.css`
14. `assets/css/base.css`
15. `assets/css/components.css`
16. `assets/css/shell.css`

### Token inventory

| Finding | Verified count |
|---|---:|
| Stylesheets loaded | 16 |
| Unique custom properties declared in `tokens.css` | 89 |
| Additional legacy `--ka-*` names declared in `styles.css`, but absent from `tokens.css` | 9 |
| Total unique `--ka-*` names across the loaded CSS | 98 |
| Canonical `--ka-*` names also redeclared in `styles.css` | 12 |
| Unprefixed legacy palette names declared in both `styles.css` and `premium-experience.css` | 14 |
| `var()` references to those 14 unprefixed names | 239 |

The nine extra legacy `--ka-*` names are:

- `--ka-navy`
- `--ka-light`
- `--ka-soft`
- `--ka-error`
- `--ka-shadow`
- `--ka-content`
- `--ka-type-body`
- `--ka-type-small`
- `--ka-type-label`

`--ka-content` is validly terminated by the closing brace in its current declaration, rather than by a trailing semicolon. It is used by two `max-width` declarations.

The 12 canonical names also redeclared in `styles.css` are:

`--ka-blue`, `--ka-bg`, `--ka-surface`, `--ka-text`, `--ka-muted`, `--ka-border`, `--ka-success`, `--ka-warning`, `--ka-radius-sm`, `--ka-radius-md`, `--ka-radius-lg`, and `--ka-font-ar`.

Because `tokens.css` is loaded after `styles.css`, its root declarations currently win for these shared names under the existing document order. The legacy declarations should still be removed after their migration is verified; relying on source order is not the desired long-term ownership model.

## 3. The 14 duplicated unprefixed variables

The following values are declared in both `styles.css` and `premium-experience.css`. The reference counts are static `var()` occurrences across the loaded CSS, not browser-computed winning declarations.

| Legacy variable | `styles.css` value | `premium-experience.css` value | References | Observed role |
|---|---|---|---:|---|
| `--blue` | `#2477B8` | `#19BDEB` | 19 | Accent text, borders, backgrounds, accent-color |
| `--navy` | `#17324D` | `#06182B` | 46 | Mostly text; also one background |
| `--light-blue` | `#EAF4FC` | `#0C2A43` | 6 | Background surfaces |
| `--soft-blue` | `#D7EAF8` | `#123C5B` | 0 | No current `var()` consumers found |
| `--bg` | `#F6F9FC` | `#061321` | 1 | Page background |
| `--surface` | `#FFFFFF` | `#0B2033` | 3 | Card / panel backgrounds |
| `--text` | `#172B3A` | `#EAF3FC` | 9 | Text color |
| `--muted` | `#718096` | `#9CB1C4` | 52 | Secondary text |
| `--border` | `#E4EBF2` | `rgba(129,177,211,.22)` | 66 | Border and divider colors |
| `--success` | `#23865B` | `#19C987` | 13 | Success text, fills, indicators |
| `--warning` | `#D99A32` | `#E7B95C` | 3 | Warning text and indicators |
| `--error` | `#C84B4B` | `#F06E78` | 7 | Error text and border |
| `--radius` | `16px` | `20px` | 2 | Card radius |
| `--shadow` | `0 8px 28px rgba(23,50,77,.055)` | `0 18px 48px rgba(0,0,0,.28)` | 12 | Card / panel elevation |

### Why a global alias is unsafe

- `--navy` is used as text color in 45 references and as a background in one. A single mapping to `--ka-text` or `--ka-ink` would be wrong for part of its usage.
- `--blue` is used as text (14), border color (2), background (2), and accent-color (1). Its replacement must be chosen by component role, not just by name.
- `--border` spans several border properties. Some components need a quiet glass border; active and focused elements need a stronger blue border.
- `--shadow` is used for multiple card and panel contexts. It should become an explicit elevation token rather than being equated with the existing button, drawer, or glow shadows.
- `--light-blue` is a surface fill, but its legacy light-theme and premium dark-theme values are materially different. It needs an intentional surface variant, not a blind color substitution.

## 4. Canonical migration map

The canonical token column identifies the preferred target family. Where the legacy token is overloaded, the consumer must be classified before replacement.

| Legacy consumer | Canonical target | Migration decision |
|---|---|---|
| `--blue` used for link / icon / accent text | `--ka-cyan` or `--ka-blue` | Choose per contrast and emphasis; migrate by selector group |
| `--blue` used for primary action fill | `--ka-gradient-button` | Use the action gradient, not a text-accent alias |
| `--navy` used for headings and body text | `--ka-text` | Text role only |
| `--navy` used for dark marks / fills | `--ka-ink` or `--ka-ink-soft` | Surface role only |
| `--light-blue` used for quiet interactive surfaces | `--ka-blue-soft` | Preserve distinction between idle and selected states |
| `--soft-blue` | None required yet | No consumers found; retire only after a final repository-wide check |
| `--bg` | `--ka-bg` / `--ka-bg-deep` | Select by page layer |
| `--surface` | `--ka-surface` / `--ka-gradient-card` | Select by panel type |
| `--text` | `--ka-text` | Direct semantic mapping |
| `--muted` | `--ka-muted` / `--ka-faint` | Choose based on hierarchy and contrast |
| `--border` | `--ka-border` / `--ka-border-blue` | Quiet vs emphasized border |
| `--success` | `--ka-status-success` | Preserve the winning premium cascade value (`#19C987`) without changing the existing `--ka-success` accent (`#2ECC8F`) |
| `--warning` | `--ka-status-warning` | Preserve the effective premium status value (`#E7B95C`) while keeping the existing `--ka-warning` accent (`#F5B942`) unchanged |
| `--error` | `--ka-status-error` | Preserve the effective premium status value (`#F06E78`); keep `--ka-danger` as a separate accent until its consumers are reviewed |
| `--radius` | `--ka-radius-md` | Validate component shape before retiring alias |
| `--shadow` | New `--ka-shadow-card` token | Define a dedicated card elevation token; do not reuse glow / button / drawer shadows |

## 5. Additional legacy `--ka-*` names

| Name | Current use | Decision |
|---|---|---|
| `--ka-navy` | 26 references; mostly text, with a brand-mark background | Split text and surface consumers; do not alias globally |
| `--ka-light` | 3 background references | Migrate to an explicit subtle / selected surface token |
| `--ka-soft` | 0 references | Candidate for retirement after a full search |
| `--ka-error` | 0 references | Prefer canonical `--ka-danger`; remove unused alias after verification |
| `--ka-shadow` | 1 hover elevation reference | Migrate to `--ka-elevation-card-hover` while preserving the effective hover shadow |
| `--ka-content` | 2 `max-width` references; value `1180px` | Migrate to `--ka-layout-content-max-width` |
| `--ka-type-body` | 1 body font-size reference; value `15px` | Preserve the 15px body role with an explicit canonical body token |
| `--ka-type-small` | 0 references | Candidate for retirement after a full search |
| `--ka-type-label` | 0 references | Candidate for retirement after a full search |

## 6. Canonical ownership rules

| Layer | Sole responsibility | Must not own |
|---|---|---|
| `tokens.css` | Global semantic tokens: color, type, spacing, radius, elevation, motion, layout, z-index | Page-specific selectors |
| `base.css` | Document defaults, typography application, focus, selection, reduced motion | Brand palette declarations |
| `components.css` | Reusable visual primitives and states | Dashboard / lesson page composition |
| `shell.css` | Header, sidebar, drawer, navigation, application frame | Lesson-specific cards and labs |
| Future `dashboard.css` | Home hero, learner identity, progress dashboard, continue-learning, quick actions | Shared shell and feature lab internals |
| Future `lesson-page.css` | Lesson header, progress strip, mode navigation, case-study layout, lesson navigation | BM-001…BM-005 calculation logic |
| Existing feature stylesheets | Their own isolated tools, labs, simulators and operational scenarios | Global tokens or shared shell selectors |
| `styles.css` and `premium-experience.css` | Temporary legacy compatibility during migration | New design-system decisions or new global tokens |

The existing `lesson-experience.css` remains the owner of its BM-005 lab internals. A future lesson page shell must compose that lab rather than restyle or replace its calculation behavior.

## 7. Safe implementation order

1. **Completed in Task 01.5:** migrate `--ka-content` to `--ka-layout-content-max-width:1180px` and `--ka-shadow` to `--ka-elevation-card-hover:0 18px 50px rgba(20,35,59,.08)`; preserve the two content-width consumers and the single module-card hover consumer.
2. **Completed in Task 01.6:** migrate all 13 `--success` consumers to `--ka-status-success:#19C987`; remove the now-unused `--success` declarations from `styles.css` and `premium-experience.css`. The existing `--ka-success:#2ECC8F` remains unchanged for current canonical consumers.
3. **Completed in Task 01.8:** migrate all seven `--error` consumers to `--ka-status-error:#F06E78`; remove the obsolete declarations from both legacy root blocks. Keep `--ka-danger:#F2616B` unchanged as a separate accent.
4. **Completed in Task 01.9:** migrate the `.certificate-panel p` fallback to `--ka-muted`; the later premium selector continues to supply the effective `#A2B8C9` color. Eight direct `--text` references remain for role-by-role review.
5. Split overloaded `--navy`, `--blue`, `--border`, and `--light-blue` by consumer role.
6. Introduce explicit surface variants for dark shell panels and any intentional light work surfaces.
7. Retire unused legacy tokens only after a repository-wide CSS and JavaScript search.
8. Remove duplicate root declarations from `styles.css` after the consumers are migrated.
9. Keep `premium-experience.css` as a temporary compatibility layer until its page/component ownership has been moved into `dashboard.css`, `lesson-page.css`, or shared primitives.
10. Do not globally reorder stylesheets during this work. Any future load-order change requires a visual and functional regression pass across the app and labs.

## 8. Acceptance criteria for Mission 01.5

- [x] Canonical token owner identified.
- [x] All 14 duplicated unprefixed variables recorded with both source values and reference counts.
- [x] Overloaded tokens identified and split by semantic role.
- [x] The nine extra legacy `--ka-*` names inventoried.
- [x] Safe migration order documented.
- [x] First low-risk token migration implemented and regression-checked by a dedicated static CSS contract test and CI.
- [ ] Browser-computed cascade and contrast checked at the actual Home / Lesson surfaces.

**Current result:** the first low-risk migration is implemented. The canonical tokens preserve the current effective values exactly; the old declarations and references are removed from `styles.css`. The next task is to migrate direct semantic aliases (`--text`, `--muted`, `--success`, `--warning`, `--error`) in a small consumer group after role and cascade verification.


## 9. Task 01.6 — Semantic success-state migration

**Status:** Implemented in this task.

### Cascade evidence

- styles.css declared --success:#23865B at the root.
- premium-experience.css loads later and redeclared --success:#19C987.
- The later premium declaration therefore supplied the effective value for the legacy var(--success) consumers.
- A full scan of the 16 stylesheets found 13 legacy var(--success) references, all in styles.css; the JavaScript files and index.html contained no --success references.

### Canonical decision

- Added --ka-status-success:#19C987 to tokens.css.
- Migrated all 13 legacy success-state consumers in styles.css to var(--ka-status-success).
- Removed the unused --success declarations from both legacy root blocks.
- Preserved the existing --ka-success:#2ECC8F token and its three current canonical consumers. It was not changed because doing so would alter the current shell/checklist success accent.

This keeps the old status/result/progress/assessment success color stable while avoiding an unrelated palette change to the newer shell.

### Consumers migrated

.topbar-meta .status-dot, .result-label, .result-number, .progress-lesson-link.done em, .assessment-badge.passed, .certificate-panel.eligible .certificate-state, .backup-feedback, .learning-dot.good, .lesson-status.done, .evidence-item input, .assessment-history-list .pass, .assessment-score.pass, and .quiz-review-item.correct.

### Regression coverage

The design-token test now asserts:
- no legacy --success declarations or references remain in the loaded stylesheets;
- exactly one canonical --ka-status-success declaration exists with value #19C987;
- all 13 consumers use the canonical token;
- the existing --ka-success:#2ECC8F remains unchanged.

No markup, JavaScript, curriculum, XP, calculation, progress-storage, font, or deployment behavior was changed.


## 10. Task 01.7 — Semantic warning-state migration

**Status:** Implemented in this task.

### Cascade evidence

- The loaded legacy `styles.css` root declared `--warning:#D99A32`.
- The later-loaded `premium-experience.css` declared `--warning:#E7B95C`, so the premium value was the effective warning color for the three active CSS consumers.
- The scan of the 16 stylesheets linked by `index.html` found exactly three `var(--warning)` consumers, all in `styles.css`; no warning consumers were found in the other loaded stylesheets.
- The three consumer contexts are the shared `.note-dot,.status-dot` indicator rule, `.progress-lesson-link.active em`, and `.learning-dot`. The topbar status dot has its own later success-state override.

### Canonical decision

- Added `--ka-status-warning:#E7B95C` to `tokens.css`.
- Migrated all three active warning-state consumers in `styles.css` to `var(--ka-status-warning)`.
- Removed the obsolete `--warning` declarations from `styles.css` and `premium-experience.css`.
- Preserved the existing `--ka-warning:#F5B942` accent token and its current consumers. It remains distinct from semantic warning-state color, avoiding an unrelated visual change to newer components.
- Extended `tests/design-tokens.test.js` to guard the canonical declaration, exact effective value, three migrated consumers, retirement of the legacy declaration/reference, and preservation of `--ka-warning`.

No markup, JavaScript, learning content, XP, calculations, learner storage, font loading, or deployment behavior changed.


## 11. Task 01.8 — Semantic error-state migration

**Status:** Implemented in this task.

### Cascade evidence

- The loaded legacy `styles.css` root declared `--error:#C84B4B`.
- The later-loaded `premium-experience.css` declared `--error:#F06E78`, so `#F06E78` was the effective legacy error-state value for all seven active consumers.
- The scan of the 16 stylesheets linked by `index.html` found exactly seven `var(--error)` consumers, all in `styles.css`; no error consumers were found in the other loaded stylesheets.
- The seven consumer contexts are `.result-error>span`, `.result-error h2`, `.danger-action`, `.quiz-feedback`, `.assessment-history-list .fail`, `.assessment-score.fail`, and `.quiz-review-item.incorrect`.

### Canonical decision

- Added `--ka-status-error:#F06E78` to `tokens.css`.
- Migrated all seven active error-state consumers in `styles.css` to `var(--ka-status-error)`.
- Removed the obsolete `--error` declarations from `styles.css` and `premium-experience.css`.
- Preserved the existing `--ka-danger:#F2616B` accent unchanged. It remains distinct from semantic error-state color until its own consumers are reviewed.
- Extended `tests/design-tokens.test.js` to guard the canonical declaration, exact effective value, seven migrated consumers, legacy alias retirement, and preservation of `--ka-danger`.

No markup, JavaScript, learning content, XP, calculations, learner storage, font loading, or deployment behavior changed.

**Next micro-task:** classify the nine direct `--text` consumers by actual text hierarchy and migrate only the lowest-risk secondary-text group; do not globally alias `--text` to `--ka-text` until light-surface consumers and contrast are verified.



## 12. Task 01.9 — Secondary-text fallback migration

**Status:** Implemented in this task.

### Consumer classification

A scan of all 16 stylesheets linked by the current `index.html` found nine direct `var(--text)` references:

| Consumer | Role | Active later cascade | Decision |
|---|---|---|---|
| `body` and `html,body` | Global primary text | Premium root sets `#EAF3FC` | Retain pending root/surface ownership work |
| `.lesson-name` | Lesson title | Premium sets `#DDEAF4` | Retain; primary content |
| `.calc-field` | Form label | Premium sets `#E2ECF4` | Retain for a separate form-label task |
| `.calc-field input,.calc-field select` | Entered values | Premium sets `#F2F7FB` | Retain; interactive data |
| `.result-details dd` | Calculated output values | Premium sets `#E5EFF6` | Retain; primary result data |
| `.progress-lesson-link strong` | Lesson title | Premium sets `#E1ECF4` | Retain; primary content |
| `.certificate-panel p` | Supporting certificate description | Premium group sets `#A2B8C9` | Migrate fallback to `--ka-muted` |
| `.quiz-option` | Assessment answer text | No dedicated later text override; dark assessment panel | Retain pending explicit contrast review |

The stylesheet order is unchanged. `premium-experience.css` loads after `styles.css`, and its grouped certificate selector continues to set `#A2B8C9`. Therefore changing the earlier fallback declaration from `var(--text)` to `var(--ka-muted)` does not change the active computed certificate-description color.

### Canonical decision

- Changed only the `.certificate-panel p` fallback in `styles.css` from `var(--text)` to `var(--ka-muted)`.
- Preserved the later premium computed color `#A2B8C9`.
- Preserved the canonical `--ka-muted:rgba(235,243,251,.72)` value.
- Reduced direct `var(--text)` references across the 16 loaded stylesheets from nine to eight.
- Added regression assertions for the migrated selector, the premium override, the canonical muted value, and the remaining-reference count.

No markup, JavaScript, learning content, XP, calculations, learner storage, fonts, stylesheet order, or deployment behavior changed.

**Next micro-task (01.12):** migrate only the `.result-details dd` fallback from legacy `--text` to `--ka-text`, preserving the later premium `#E5EFF6` result-text override. Do not change calculation logic, result values, lesson titles, quiz options, or global body text.

## 13. Task 01.10 — Calculator field-label text fallback migration

**Status:** Implemented in this task.

### Cascade evidence

- The `.calc-field` rule in `styles.css` used the legacy `color:var(--text)` fallback.
- `premium-experience.css` loads later and explicitly applies `color:#E2ECF4` through `.calc-section h2,.calc-field`, so the effective calculator field-label color remains `#E2ECF4`.
- The canonical `--ka-text:#F3F7FC` token already exists in `tokens.css` and is the appropriate primary-text fallback for the dark calculator surface.

### Canonical decision

- Changed only the `.calc-field` fallback in `styles.css` from `var(--text)` to `var(--ka-text)`.
- Preserved the later premium override `#E2ECF4`; no computed label color change is intended.
- Reduced direct `var(--text)` references across the 16 loaded stylesheets from eight to seven.
- Extended `tests/design-tokens.test.js` to assert the migrated fallback, the canonical `--ka-text:#F3F7FC` value, and the retained premium `#E2ECF4` override.

No markup, JavaScript, curriculum, XP, calculations, learner storage, fonts, stylesheet order, or deployment behavior changed.

**Next micro-task (01.11):** migrate the calculator input/select fallback from legacy `--text` to `--ka-text`, preserving the later premium `#F2F7FB` value override. Keep calculated outputs, lesson titles, quiz options, and global body text out of that task.


## 14. Task 01.11 — Calculator input/select text fallback migration

**Status:** Implemented in this task.

### Cascade evidence

- The `.calc-field input,.calc-field select` rule in `styles.css` used the legacy `color:var(--text)` fallback.
- `premium-experience.css` loads later and explicitly applies `color:#F2F7FB` to calculator inputs and selects, so the effective value color remains `#F2F7FB`.
- The canonical `--ka-text:#F3F7FC` token already exists and is the appropriate primary-text fallback for the dark calculator surface.
- The prior QA run #369 failed only at the existing field-label regression assertion because its regex required a trailing semicolon after `#E2ECF4`; the valid source rule omits that optional final semicolon before `}`. The assertion now accepts either valid CSS form without changing production CSS.

### Canonical decision

- Changed only the calculator input/select fallback in `styles.css` from `var(--text)` to `var(--ka-text)`.
- Preserved the later premium input/select override `#F2F7FB`; no computed value-color change is intended.
- Reduced direct `var(--text)` references across the 16 loaded stylesheets from seven to six.
- Updated the prior field-label regression assertion to tolerate an optional trailing declaration semicolon.
- Added regression assertions for the canonical input/select fallback, the `--ka-text:#F3F7FC` token, and the retained premium `#F2F7FB` override.

No result-value styles, calculation logic, lesson titles, quiz options, global body text, markup, JavaScript, curriculum, XP, learner storage, fonts, stylesheet order, or deployment behavior changed.

### Verification

- Static source inspection confirmed the canonical input/select fallback and the premium `#F2F7FB` override.
- The prior full scan of the 16 stylesheets found seven direct `var(--text)` references; this one-consumer migration reduces the total to six.
- Confirmed the field-label override remains `#E2ECF4`; its test now allows the valid omitted trailing semicolon.
- CI for the new head must be checked separately; the previous run #369 failed only at the over-strict semicolon assertion, after all curriculum, KPI, lab, BiDi, and other checks passed.

**Next micro-task (01.12):** migrate only `.result-details dd` fallback from `var(--text)` to `var(--ka-text)`, preserving the later premium `#E5EFF6` result-text override. Keep calculation logic and result values unchanged.

## 15. Task 01.12 — Calculator result-details text fallback migration

**Status:** Implemented in this task.

### Cascade evidence

- The `.result-details dd` rule in `styles.css` used the legacy `color:var(--text)` fallback for calculated detail values.
- `premium-experience.css` loads later and applies `color:#E5EFF6` to the same selector, so the effective result-detail text color remains `#E5EFF6`.
- The canonical `--ka-text:#F3F7FC` token is the appropriate primary-text fallback for this dark result surface.

### Canonical decision

- Changed only the `.result-details dd` fallback in `styles.css` from `var(--text)` to `var(--ka-text)`.
- Preserved the later premium `#E5EFF6` override; no computed result-detail color change is intended.
- Reduced direct legacy `var(--text)` references across the 16 loaded stylesheets from six to five.
- Added regression assertions for the canonical result-detail fallback, the retained premium `#E5EFF6` override, and the updated remaining-reference count.

No calculation logic, displayed result values, result formatting, lesson titles, quiz options, global body text, markup, JavaScript, curriculum, XP, learner storage, fonts, stylesheet order, main, gh-pages, merge, or deployment behavior changed.

### Verification

- Static source checks confirm the single `.result-details dd` fallback migration and unchanged premium `#E5EFF6` override.
- The existing calculator field-label `#E2ECF4` and input/select `#F2F7FB` premium overrides remain unchanged.
- CI run #371 on the previous head completed successfully for `verify`, `browser`, and `package`; `deploy-preview` was skipped. A new workflow run for this task's final commit must be checked separately.

**Task 01.14 implementation is recorded in Section 17 below.**


## 16. Task 01.13 — Remaining `--text` consumer audit

**Status:** Completed as a source-grounded audit and migration decision. This task changes documentation only; no production CSS, JavaScript, markup, or tests are changed.

### Scope and method

- Read the stylesheet links from the current `index.html` on this PR head and enumerated all 16 loaded stylesheets: `styles.css`, `lesson-experience.css`, `visual-learning.css`, `study-tools.css`, `percentage-labs.css`, `simulator.css`, `live-venue.css`, `premium-experience.css`, `bm001-lab.css`, `bm002-lab.css`, `bm003-lab.css`, `bm004-lab.css`, `tokens.css`, `base.css`, `components.css`, and `shell.css`.
- Scanned the content of all 16 files for direct `var(--text)` references.
- Exactly five references remain: four in `assets/css/styles.css` and one in `assets/css/premium-experience.css`. No direct references remain in the other 14 loaded stylesheets.
- The active premium root value is `--text:#EAF3FC`; the canonical `--ka-text` is `#F3F7FC`. These values are close but not identical, so they must not be globally aliased without consumer review.

### Five-reference inventory

| Source selector | Consumer role | Winning cascade / surface | Decision |
|---|---|---|---|
| `styles.css: body` | Global body text fallback | `premium-experience.css` sets `--text:#EAF3FC` and applies it through the more-specific `html,body` rule. The later `base.css body` rule uses `--ka-text` but has lower selector specificity than `html,body`. | Retain. Global body and root ownership need a separate migration plan. |
| `premium-experience.css: html,body` | Global dark-shell text | Uses the premium root `--text:#EAF3FC` over the dark page background. | Retain. Do not replace with `--ka-text` until the global text token and shell surface contract are reconciled. |
| `styles.css: .lesson-name` | Lesson title in a chapter row | `app.js` renders it inside `.lesson-row` within `.chapter-panel`. The later premium rule `.lesson-name{color:#DDEAF4}` wins over the fallback. The chapter panel uses the dark premium card gradient. | **Selected for Task 01.14.** The fallback can move to `--ka-text` while the explicit premium color remains unchanged. |
| `styles.css: .progress-lesson-link strong` | Lesson title in the progress list | The later premium rule explicitly sets `#E1ECF4`; this is a separate progress-list component and should be migrated independently. | Retain for a later isolated task. |
| `styles.css: .quiz-option` | Assessment answer label | `learning-ui.js` generates the option as a label inside `.assessment-form`. The form background remains `#fff`; no later `.quiz-option` color override exists. The inherited premium `--text:#EAF3FC` therefore produces approximately **1.12:1** contrast against white. | **Do not migrate to `--ka-text`.** This is a pre-existing contrast failure requiring a dedicated light-surface text token and a separate accessibility fix. |

### Contrast and risk notes

- The selected `.lesson-name` color is `#DDEAF4`. Against the two chapter-panel gradient stops composited over the `#061321` page base, the approximate contrast range is **12.61:1–14.52:1**. This is comfortably above the WCAG AA normal-text threshold; the later explicit color override remains the visual owner after the fallback migration.
- The progress-list title's active `#E1ECF4` override is also a light-on-dark role, but it remains a separate component and is not included in Task 01.14.
- The quiz option contrast calculation is direct against its declared white form surface: `#EAF3FC` on `#FFFFFF` is approximately **1.12:1**. The canonical `--ka-text:#F3F7FC` is also too light for this surface. The existing `--ka-ink:#071522` would yield approximately **18.43:1** on white, but its ownership and intended semantic role must be checked before reuse. Do not silently assign it to quiz labels in the lesson-title migration.
- No learner data, XP, calculations, assessment scoring, or interactive behavior is affected by this audit.

### Next isolated task

**Task 01.14 — Lesson-row title fallback migration**

- Change only `.lesson-name` in `assets/css/styles.css` from `var(--text)` to `var(--ka-text)`.
- Preserve the later premium `#DDEAF4` override.
- Add a focused regression assertion for both declarations and the remaining direct-reference count (five to four).
- Leave `body`, `html,body`, `.progress-lesson-link strong`, and `.quiz-option` untouched.

After that task, create a dedicated contrast/token task for the white `.assessment-form` surface before migrating quiz-option text.


## 17. Task 01.14 — Lesson-row title fallback migration

**Status:** Implemented on the isolated Phase 1 branch.

### Scope

- Changed only the `.lesson-name` fallback in `assets/css/styles.css` from `var(--text)` to `var(--ka-text)`.
- Preserved the later-loaded `premium-experience.css` override `.lesson-name{color:#DDEAF4}`; the effective chapter-row title color remains unchanged.
- Reduced direct `var(--text)` references across the 16 stylesheets loaded by `index.html` from five to four.
- Added regression assertions for the canonical fallback, the preserved premium override, and the new four-reference count.
- Left global `body` / `html,body`, `.progress-lesson-link strong`, and `.quiz-option` unchanged.

### Verification boundary

- Source-level assertions confirm the single selector migration and the preserved premium override.
- The previous PR-head CI run #374 completed successfully for `verify`, `browser`, and `package`; visual-comparison and test-build artifacts were uploaded, and `deploy-preview` was skipped.
- A new CI run for this task's commit must be checked independently. No claim of CI success is made from run #374 alone.

No markup, JavaScript, lesson content, XP, calculations, learner progress data, fonts, stylesheet order, `main`, `gh-pages`, merge, or deployment changes.

**Next micro-task (01.15):** define and test a dedicated light-surface text role for the white `.assessment-form` surface, then correct the existing `.quiz-option` contrast failure. Do not reuse `--ka-text` on white or change global body/progress-list text in that task.


## 18. Task 01.15 — Light-surface assessment text ownership and quiz contrast

**Status:** Implemented on the isolated Phase 1 branch.

### Source-grounded problem

- learning-ui.js renders each answer as a .quiz-option label inside .assessment-form; no markup or answer-generation change is needed.
- The active .assessment-form surface is white (#FFFFFF).
- premium-experience.css defines the inherited legacy --text:#EAF3FC; the existing .quiz-option rule therefore rendered pale text on white at approximately 1.12:1 contrast.
- The canonical --ka-text:#F3F7FC is also a light-on-dark role and is not suitable for the unselected white surface.
- The existing --ka-ink:#071522 is the established dark ink primitive. It is suitable as the source value for a dedicated semantic text role without changing the primitive or its existing brand-mark use.
- The selected option uses the premium dark surface --light-blue:#0C2A43; it must switch back to a light foreground when selected.

### Canonical decision

- Added exactly one semantic token in tokens.css: --ka-text-on-light:var(--ka-ink).
- Changed only the .quiz-option base foreground to var(--ka-text-on-light) for the white assessment surface.
- Added color:var(--ka-text) to the existing checked-option rule, preserving its current dark selected background while keeping selected answer text light.
- Preserved the white assessment form, border, selected background, radio accent, answer-key chip, markup, and answer interaction.

### Contrast evidence

- Previous unselected answer text: #EAF3FC on #FFFFFF = approximately **1.12:1**.
- New unselected answer text: #071522 on #FFFFFF = approximately **18.43:1**.
- New selected answer text: #F3F7FC on #0C2A43 = approximately **13.67:1**.
- Both new states exceed the WCAG AA normal-text threshold of **4.5:1**.
- The regression test computes these ratios from the token and surface values rather than relying only on a fixed expected number.

### Regression coverage

- Exactly one --ka-text-on-light declaration, aliased to --ka-ink.
- The dark ink primitive remains #071522; the primary light text token remains #F3F7FC.
- The assessment form remains white.
- Unselected quiz options use the dedicated light-surface token.
- Selected quiz options use --ka-text on the retained premium dark selection surface.
- Both unselected and selected text contrast ratios are asserted at or above 4.5:1.
- Direct legacy var(--text) references across the 16 loaded stylesheets reduce from four to three.

No assessment content, question order, answer IDs, scoring, attempt history, learning engine, XP, learner storage, curriculum, calculations, RTL logic, fonts, stylesheet order, main, gh-pages, merge, or deployment behavior changed.

**Next micro-task (01.17):** audit the two remaining global body/root var(--text) references, classify their active surfaces and winning cascade, and decide whether they need one shared semantic role or separate light/dark roles. Do not change global text until the cascade and surface evidence are documented.


## 19. Task 01.16 — Progress-list title fallback migration

**Status:** Implemented on the isolated Phase 1 branch.

### Scope and cascade evidence

- Migrated only `.progress-lesson-link strong` in `assets/css/styles.css` from `color:var(--text)` to `color:var(--ka-text)`.
- Preserved the later-loaded `premium-experience.css` rule `.progress-lesson-link strong{color:#E1ECF4}`; the effective progress-list title color remains unchanged.
- Audited all 16 CSS files linked by `index.html`: direct `var(--text)` references decreased from **3 to 2**.
- The two remaining direct references are global `body` text in `styles.css` and `html,body` text in `premium-experience.css`. They are intentionally left untouched for a separate global text-ownership audit.
- Updated the design-token regression test to require the canonical fallback, preserve the premium `#E1ECF4` override, and enforce the two-reference remainder.

### Verification boundary

- Static source verification was run against the exact PR-head versions of all 16 loaded stylesheets.
- The prior PR-head CI run #376 completed successfully on commit `1ec51a97686e0645dabd7f5fafcaf853d9e3843a`; that result does not verify this new task commit. A fresh CI run must be checked independently.
- No markup, JavaScript, learning content, XP, calculations, learner progress data, fonts, stylesheet order, `main`, `gh-pages`, merge, or deployment changes.

**Next micro-task (01.17):** audit the two remaining global body/root `var(--text)` references, classify their active surfaces and winning cascade, and decide whether they need one shared semantic role or separate light/dark roles. Do not change global text until the cascade and surface evidence are documented.

## 20. Task 01.17 — Global body/root text ownership audit

**Status:** Completed as a source-grounded audit and documentation artifact. No production CSS, markup, JavaScript, or test file was changed in this task.

### Exact source and cascade evidence

- Audited the 16 stylesheet links in the current `index.html` on branch `fix/phase1-drawer-bidi-deploy-safety`.
- Exactly two direct `var(--text)` references remain across those 16 stylesheets:
  1. `assets/css/styles.css` — the legacy `body` rule: `color:var(--text)`.
  2. `assets/css/premium-experience.css` — the premium `html,body` rule: `color:var(--text)`.
- The legacy `styles.css` root declares `--text:#172B3A`; its body surface is the legacy light baseline `--bg:#F6F9FC`.
- The later `premium-experience.css` root redeclares `--text:#EAF3FC` and its `html,body` rule sets the active dark-shell background to `#061321`.
- Stylesheet order is verified from `index.html`: `styles.css` loads first; `premium-experience.css` loads eighth; `tokens.css` loads thirteenth; `base.css` loads fourteenth.
- The premium `html,body` selector has two type selectors and therefore greater specificity than either `styles.css body` or the later `base.css body` selector. It wins the global `color` declaration despite `base.css` loading later.
- `base.css body` currently uses `color:var(--ka-text)`, where the canonical `--ka-text` is `#F3F7FC`; that lower-specificity rule does not replace the premium `#EAF3FC` shell color.
- The active dark-shell color `#EAF3FC` on `#061321` has approximately **16.68:1** contrast. Replacing it with `--ka-text:#F3F7FC` would raise contrast to approximately **17.39:1**, but would still change the existing computed color and is not an exact-value-preserving migration.
- The legacy light fallback `#172B3A` on `#F6F9FC` has approximately **13.77:1** contrast. Reusing `--ka-ink:#071522` would change that value and is not an exact-value-preserving replacement.

### Ownership decision

The two references must **not** be collapsed into one global text token. They represent two different surface contracts:

| Consumer | Surface contract | Source value / active state | Decision |
|---|---|---|---|
| `styles.css body` | Dormant legacy light-theme declaration | Declares `--text:#172B3A` and `--bg:#F6F9FC`, but is overridden in the current stack | Do not migrate until standalone legacy-theme support is confirmed; otherwise retire the stale declaration separately |
| `premium-experience.css html,body` | Active premium dark application shell | `#EAF3FC` on `#061321` | `--ka-text-shell:#EAF3FC` |

The `styles.css body` declaration is not an active fallback in the current loaded stack. If the premium stylesheet were omitted while `base.css` remained loaded, the later `base.css body` rule has equal specificity and wins by source order. The legacy `styles.css body` color/background would become effective only if both the premium and base layers were absent. That standalone mode is not represented by the current `index.html`.

The existing `--ka-text:#F3F7FC` remains the general light-on-dark primary text role. The existing `--ka-text-on-light` remains the high-contrast ink role used by the white assessment surface. Neither should replace the active shell value `#EAF3FC` when exact computed-value preservation is required.

### Next isolated tasks

**Task 01.18 — Active premium shell text migration**
- Add `--ka-text-shell:#EAF3FC` to `tokens.css`.
- Migrate only the `premium-experience.css html,body` color from `var(--text)` to `var(--ka-text-shell)`.
- Preserve the active shell color and its approximately 16.68:1 contrast on `#061321`.
- Leave the dormant `styles.css body` declaration untouched; verify direct references reduce from 2 to 1.

**Task 01.19 — Legacy body declaration disposition**
- Confirm whether a standalone legacy stylesheet mode is supported anywhere outside the current `index.html` stack.
- If it is supported, define a dedicated exact-value legacy-light role for `#172B3A` and migrate only that fallback.
- If it is not supported, retire the dormant `styles.css body` `color:var(--text)` declaration in an isolated cleanup, then audit legacy `--text` root declarations before removal.

### Verification boundary

- Static audit fetched and inspected all 16 stylesheet files from the exact branch head; the only direct references found were the two selectors listed above.
- Verified root token values, stylesheet order, the later `base.css body` rule, and selector-specificity ownership from the source.
- The exact branch-head CI run #379 (`45185415256`) completed successfully: `verify`, `browser`, and `package` passed; `deploy-preview` was skipped. Visual comparison and test-build artifacts were uploaded. This run verifies the pre-audit source commit `0e2e917`, not the documentation commit created for this audit.
- No production visual value, learning content, XP, calculations, learner progress, fonts, RTL behavior, main, gh-pages, merge, or deployment behavior changed.


## 21. Task 01.18 — Active premium shell text migration

**Status:** Implemented on the isolated Phase 1 branch.

### Scope and preserved behavior

- Added exactly one canonical token in `assets/css/tokens.css`: `--ka-text-shell:#EAF3FC`.
- Migrated only the active `html,body` foreground in `assets/css/premium-experience.css` from `var(--text)` to `var(--ka-text-shell)`.
- Preserved the active shell background `#061321` and the exact foreground value `#EAF3FC`; no intended computed visual change.
- Left the dormant legacy-light `styles.css body` declaration `color:var(--text)` untouched for the separate Task 01.19 disposition decision.
- Reduced direct `var(--text)` references across the 16 stylesheets linked by `index.html` from **2 to 1**.

### Regression coverage

- Exactly one canonical `--ka-text-shell` declaration with the preserved value `#EAF3FC`.
- The active premium `html,body` selector consumes the new token and retains background `#061321`.
- The dormant legacy-light body fallback remains unchanged.
- The shell text/background contrast is computed from the canonical token and asserted at or above WCAG AA normal-text threshold (4.5:1).
- The previous primary `--ka-text:#F3F7FC` role remains unchanged.

### Verification boundary

- Source preconditions were checked against the exact PR head before editing: `ebd94dd88291a0721f82a36d70e44487864bffa0`.
- Static assertions against the updated source verify one shell-token declaration, the exact shell consumer, the preserved legacy body fallback, and one remaining direct `var(--text)` reference.
- The prior exact-head CI run #381 completed successfully for `verify`, `browser`, and `package`; `deploy-preview` was skipped. That run verifies the pre-task documentation head, not this new implementation commit. A new CI run must be checked independently.
- No markup, JavaScript, learning content, XP, calculations, learner progress data, fonts, stylesheet order, RTL behavior, `main`, `gh-pages`, merge, or deployment changes.

**Next micro-task (01.19):** inspect repository-wide references and workflow/documentation evidence to determine whether a standalone legacy-light stylesheet mode is supported. If supported, give the dormant `#172B3A` body foreground an explicit legacy-light semantic role; if unsupported, retire only the dormant `styles.css body` foreground declaration and then audit whether its old `--text` root declaration is still consumed elsewhere. Do not modify global background, body typography, or the active premium shell in that task.

## 22. Task 01.19 — Legacy body foreground declaration disposition

**Status:** Implemented on the isolated Phase 1 branch.

### Standalone-mode support audit

- The current Git tree at 4c83c466a18e474fa0b267c4bfffccead2f61468 contains one production application entry point: root index.html. It loads the 16-file application stylesheet stack, including styles.css, premium-experience.css, tokens.css, and base.css.
- The only other HTML documents in the tree are the development BiDi harness and an archived pre-learning-experience snapshot. The BiDi harness loads tokens.css and base.css, not the root legacy stylesheet. The archived snapshot resolves its own backup-local assets/css/styles.css; it is not a supported alternate entry point for the current application.
- README.md describes one static HTML/CSS/Vanilla JavaScript application. docs/IMPLEMENTATION-LOG.md DEC-001 records that the approved Dark Navy + Glass direction supersedes the earlier light theme.
- .github/workflows/deploy-preview.yml is explicitly disabled with if: false. The QA workflow packages the root index.html; its deploy job is restricted to a manual dispatch on implementation/kpi-academy-mvp. No standalone legacy-light runtime or deployment target is defined.
- Inspected all 16 active stylesheets: before this change, the only direct var(--text) consumer was the dormant body declaration in assets/css/styles.css; the other 15 stylesheets had zero such consumers.
- Inspected all 23 tracked JavaScript modules: none reads --text, injects styles.css / premium-experience.css, or uses computed-style access to consume the legacy variable.
- The archived backup stylesheets still contain their historical --text consumers. They are deliberately excluded from the active runtime audit and are not modified.

**Decision:** no supported standalone legacy-light mode exists in the current product. Retire the dormant foreground declaration rather than creating a new token for an unsupported surface.

### Change and preservation

- Removed only color:var(--text) from the legacy body rule in assets/css/styles.css.
- Preserved the same rule's margin, background, font-family, and line-height declarations.
- Preserved the active premium shell's --ka-text-shell:#EAF3FC consumer and dark background #061321.
- Direct var(--text) consumers across the 16 loaded stylesheets decrease from **1 to 0**.
- The two legacy root declarations (--text:#172B3A in styles.css and --text:#EAF3FC in premium-experience.css) are now unconsumed. They are intentionally retained for the separate Task 01.20 declaration cleanup; no root palette declaration was removed in this task.

### Regression coverage

- Assert zero direct var(--text) consumers across the loaded stylesheet stack.
- Assert the two legacy root declarations remain temporarily, so their removal is isolated to Task 01.20.
- Assert the legacy body rule retains margin, background, font-family, and line-height without the retired foreground declaration.
- Keep the canonical premium shell token and its exact foreground/background contract unchanged.

### Verification boundary

- Source audit covered the exact PR head and all 16 loaded CSS files, the 23 tracked JavaScript modules, root and archived HTML entry points, README, implementation decisions, and both GitHub Actions workflows.
- Prior exact-head CI run #382 on 4c83c466a18e474fa0b267c4bfffccead2f61468 completed successfully: verify, browser, and package passed; deploy-preview was skipped. This verifies the parent commit, not this new change. The new head requires its own CI result.
- This task changes one production CSS declaration, its regression assertions, and this ownership record only. No HTML, JavaScript, curriculum, XP, calculations, learner progress, fonts, stylesheet order, RTL behavior, main, gh-pages, merge, or deployment changes.

**Next micro-task (01.20):** remove the two now-unconsumed legacy --text root declarations from styles.css and premium-experience.css, with tests confirming zero legacy declarations or consumers across the active 16-file stack. Leave archived backup files untouched.

## 23. Task 01.20 — Legacy `--text` root declaration cleanup

**Status:** Implemented on the isolated Phase 1 branch.

### Scope and exact changes

- Removed only the unconsumed `--text:#172B3A` declaration from the `:root` block in `assets/css/styles.css`.
- Removed only the unconsumed `--text:#EAF3FC` declaration from the `:root` block in `assets/css/premium-experience.css`.
- Left all neighboring legacy palette declarations intact; this task does not migrate `--bg`, `--surface`, `--muted`, `--border`, `--blue`, `--navy`, `--radius`, or `--shadow`.
- Left archived backup CSS untouched.
- Preserved the canonical `--ka-text:#F3F7FC`, `--ka-text-shell:#EAF3FC`, and `--ka-text-on-light` roles and all active consumers.

### Regression coverage

- The active 16-stylesheet stack must contain zero `var(--text)` consumers.
- The active 16-stylesheet stack must contain zero `--text:` declarations.
- The canonical primary and shell text tokens must retain their exact values.
- The active premium shell must continue consuming `--ka-text-shell` on `#061321`.
- The legacy body rule must retain its background and typography declarations.

### Verification evidence

- Pre-change PR head: `930cdf0dabc6e5a5f425ebbcee5fa2f20b1f2053`.
- Re-fetched all 16 stylesheet files linked by the exact-head `index.html`. The only remaining `--text:` declarations were the two targeted root aliases; no `var(--text)` consumers remained.
- CI run #383 on the exact parent head completed successfully: `verify`, `browser`, and `package` passed; `deploy-preview` was skipped. This is the parent baseline, not evidence for this new commit.
- The new commit's own CI must be checked independently. No local browser or project test execution is claimed in this task record.

No markup, JavaScript, learning content, XP, calculations, learner progress, fonts, stylesheet order, RTL behavior, `main`, `gh-pages`, merge, or deployment changes.

**Next micro-task (01.21):** perform a source-grounded inventory of the remaining active legacy root aliases and their consumers (palette, surfaces, border, radius, and shadow). Classify actual winning values and token ownership before selecting one isolated migration. Do not begin Home Dashboard or Lesson implementation during that audit.


## 24. Task 01.21 — Active Legacy Root Alias Ownership Audit

**Status:** Audit complete; documentation-only. No production CSS, tests, markup, or JavaScript were changed in this task.

### Repository and evidence boundary

- Audited the exact PR #4 head `f1e5888312cd561ae0bd2ab9afcd931712d8f2fc` on `fix/phase1-drawer-bidi-deploy-safety`.
- Re-read the stylesheet order from the branch's `index.html`. The active stack contains 16 stylesheets; `styles.css` loads first, `premium-experience.css` loads eighth, `tokens.css` loads thirteenth, and `base.css` loads fourteenth.
- Re-fetched and scanned all 16 loaded stylesheets. The only active legacy alias root declarations in scope are in `styles.css` and `premium-experience.css`. Later `tokens.css` and `base.css` define canonical `--ka-*` tokens but do not redefine these legacy aliases.
- Static reference counts below are occurrences of `var(--alias)` across the 16 loaded stylesheets, not counts of unique selectors.

### Root declaration values and effective cascade

The first-loaded `styles.css` declares the earlier light-theme values:

| Alias | `styles.css` value |
|---|---|
| `--blue` | `#2477B8` |
| `--navy` | `#17324D` |
| `--light-blue` | `#EAF4FC` |
| `--soft-blue` | `#D7EAF8` |
| `--bg` | `#F6F9FC` |
| `--surface` | `#fff` |
| `--muted` | `#718096` |
| `--border` | `#E4EBF2` |
| `--radius` | `16px` |
| `--shadow` | `0 8px 28px rgba(23,50,77,.055)` |

The later-loaded `premium-experience.css` re-declares the same aliases. Its values therefore win for the active page's root cascade:

| Alias | Effective premium value |
|---|---|
| `--blue` | `#19BDEB` |
| `--navy` | `#06182B` |
| `--light-blue` | `#0C2A43` |
| `--soft-blue` | `#123C5B` |
| `--bg` | `#061321` |
| `--surface` | `#0B2033` |
| `--muted` | `#9CB1C4` |
| `--border` | `rgba(129,177,211,.22)` |
| `--radius` | `20px` |
| `--shadow` | `0 18px 48px rgba(0,0,0,.28)` |

### Active CSS consumer inventory

| Alias | Total references | Distribution | Current role / disposition |
|---|---:|---|---|
| `--blue` | 19 | styles 18; visual-learning 1 | Accent, links, indicators and selected-state color. Keep until each consumer is matched to a canonical accent role. |
| `--navy` | 46 | styles 44; visual-learning 2 | Mixed heading, foreground and dark-surface role. Keep; it is overloaded and has no exact one-to-one canonical replacement. |
| `--light-blue` | 6 | styles 6 | Surface/state background, including the selected quiz surface. Keep until each surface/state is mapped separately. |
| `--soft-blue` | 0 | no active CSS consumers | Unused in the active stylesheet stack. Candidate for isolated alias retirement after a repository-wide HTML/JS reference check. |
| `--bg` | 1 | styles 1 | Used only by the early `body` background declaration; later Premium and base `body` background declarations replace that background. Treat as dormant in the current cascade, but do not remove during this audit. |
| `--surface` | 3 | styles 3 | Used by early sidebar/card/chapter surface rules; later Premium rules replace those backgrounds. Treat as overridden fallback consumers, not proof of an active surface color. |
| `--muted` | 52 | styles 50; visual-learning 2 | Secondary text and metadata across many components. Keep; the effective `#9CB1C4` differs from canonical `--ka-muted:rgba(235,243,251,.72)`. |
| `--border` | 66 | styles 40; premium 24; visual-learning 2 | Broad border primitive across shell, cards, lesson surfaces and visual-learning elements. Keep; the effective blue-tinted value differs from `--ka-border`. |
| `--radius` | 2 | styles 2 | Card/chapter shape primitive. Effective `20px` exactly matches `--ka-radius-md:20px`; suitable for a narrow, value-preserving migration. |
| `--shadow` | 12 | styles 7; premium 3; visual-learning 2 | General elevation shadow. Keep until consumers are split by elevation purpose; it is not equivalent to the canonical hover, drawer, button or glow shadows. |

All other active stylesheets in the 16-file stack had no references to these legacy aliases, apart from the distributions listed above.

### Canonical-token comparison

- `--blue:#19BDEB` is not an exact match for `--ka-blue:#1E7BE8` or `--ka-cyan:#19B5F0`. Do not globally substitute either token.
- `--bg:#061321` matches `--ka-bg:#061321`, but its only legacy consumer is overridden by later body-background declarations. Confirm the intended fallback contract before retiring it.
- `--surface:#0B2033` is not equal to `--ka-surface:rgba(12,34,53,.88)`.
- `--muted:#9CB1C4` is not equal to `--ka-muted:rgba(235,243,251,.72)`; changing it globally would alter secondary-text color.
- `--border:rgba(129,177,211,.22)` is not equal to `--ka-border:rgba(255,255,255,.10)`; the existing blue border tint must not be lost.
- `--radius:20px` is an exact value match for `--ka-radius-md:20px` and has only two CSS consumers.
- `--shadow:0 18px 48px rgba(0,0,0,.28)` is not equivalent to the current canonical hover/elevation, drawer, button or glow shadows.
- There is no direct canonical `--ka-navy`, `--ka-light-blue` or `--ka-soft-blue` token in `tokens.css` with the same semantic role and exact value.

### Decisions and next task

1. Do not perform a bulk alias replacement. The palette aliases are overloaded across foreground, accent, selected-state, border and surface roles.
2. Keep `--blue`, `--navy`, `--light-blue`, `--muted`, `--border` and `--shadow) pending consumer-by-consumer mapping.
3. Treat `--bg` and `--surface` as overridden fallbacks that need a separate removal decision; do not infer computed appearance from their declaration alone.
4. The lowest-risk next micro-task is to confirm that `--soft-blue` is absent from all active HTML and JavaScript sources, then remove only its unused declarations from the two active root blocks and add a zero-reference regression assertion.
5. A later isolated task can migrate the two `var(--radius)` consumers to `var(--ka-radius-md)`, preserving the exact effective `20px` value, before retiring the legacy radius declaration.

### Verification boundary

- This audit is source-grounded and covers the exact 16 stylesheets linked by the current branch's `index.html`; no production files were changed.
- CI run #384 on the audited head completed successfully: `verify`, `browser` and `package` passed; `deploy-preview` was skipped. This is the existing head's CI evidence, not a test run for this documentation-only audit commit.
- No computed-style snapshot was captured specifically for every alias consumer in this task. The winning root values above are established from stylesheet load order and root declaration order; selectors with later overrides are explicitly called out.
- No markup, JavaScript, curriculum, XP, calculations, learner progress, fonts, RTL behavior, `main`, `gh-pages`, merge or deployment changes.

**Task 01.22 completed:** the active `index.html` and all 23 production JavaScript files were checked for `soft-blue` references; none were found. The two unused root declarations were removed from the active base and premium stylesheets, and regression assertions now enforce zero declarations and zero `var()` consumers across the loaded stylesheet stack. No replacement token was introduced because the alias has no active semantic consumer.

**Next micro-task (01.23):** migrate only the two audited `var(--radius)` consumers to `var(--ka-radius-md)`, preserving the effective `20px` value and leaving unrelated geometry tokens untouched.


### Task 01.22 — Retire unused `--soft-blue` alias

**Repository evidence before editing**
- PR #4 was open and draft; branch `fix/phase1-drawer-bidi-deploy-safety` pointed to `7954f7a528fb98faca351d7f26a678a5996ee5f8`, targeting `implementation/kpi-academy-mvp`.
- The previous head's CI run #385 completed successfully: verify, browser and package passed; deploy-preview was skipped.
- The active `index.html` contains 23 production script references. Each referenced JavaScript file was fetched from the exact PR head and checked; zero `soft-blue` references were found. The active HTML file also contained zero matches.
- The loaded stylesheet audit identified exactly two unused root declarations: `--soft-blue:#D7EAF8` in `assets/css/styles.css` and `--soft-blue:#123C5B` in `assets/css/premium-experience.css`. No `var(--soft-blue)` consumers were present. `assets/css/tokens.css` had no declaration or consumer.

**Implementation**
- Removed only those two unused declarations.
- Added design-token regression assertions requiring zero `--soft-blue` declarations and zero `var(--soft-blue)` consumers across all stylesheets loaded by `index.html`.
- No replacement token was added: there is no active consumer to migrate, and the similarly named `--ka-soft` role is not assumed to be interchangeable.

**Preservation**
- No selector, computed color, background, spacing, radius, learning content, XP, calculation, learner progress, JavaScript, HTML, font, RTL behavior, or stylesheet load order was changed.
- No backup files, `main`, or `gh-pages` were modified. No merge or deployment occurred.

**Verification boundary**
- Static source checks confirmed both declarations were removed, no remaining `var(--soft-blue)` use exists in the two declaration-bearing active stylesheets, and the new regression assertions are present.
- The complete automated suite for this new commit is pending its PR-triggered CI run; the previous successful run #385 applies only to the parent commit.

**Task 01.23 completed:** migrated exactly two audited consumers in `assets/css/styles.css` from `var(--radius)` to `var(--ka-radius-md)`: the shared stat/module/content/empty-card rule and `.chapter-panel`. The 16-file stylesheet audit found no other `var(--radius)` consumers. The canonical token resolves to 20px because `tokens.css` loads after `premium-experience.css`. Seven canonical-radius consumers existed before this task (six in `styles.css`, one in `components.css); the migration brings the total to nine. Three `--ka-radius-md` declarations already exist (two in `styles.css`, one in `tokens.css); they were not changed. The earlier `--radius:16px` and later Premium `--radius:20px` root declarations are intentionally retained for the separate alias-retirement task.

**Next micro-task (01.24):** retire only the two now-unconsumed `--radius` root declarations from `styles.css` and `premium-experience.css`, after rechecking the active 16-file stylesheet stack. Keep other geometry tokens and duplicate `--ka-radius-md` declaration consolidation out of that task.


### Task 01.23 — Migrate the two audited radius consumers

**Repository evidence before editing**
- PR #4 was open and draft on `fix/phase1-drawer-bidi-deploy-safety`, targeting `implementation/kpi-academy-mvp`; exact pre-edit head: `c5e35395d42364544f97c8067ff4d8e953837339`.
- Re-fetched the exact-head `styles.css`, `premium-experience.css`, `tokens.css`, `components.css`, test file and ownership contract; the prior full inventory covered all 16 CSS files linked by `index.html`.
- Found exactly two `var(--radius)` consumers, both in `assets/css/styles.css`: the shared stat/module/content/empty-card rule and `.chapter-panel`. No other active stylesheet contains a legacy radius consumer.
- Seven `var(--ka-radius-md)` consumers existed before the migration: six in `styles.css` and one in `components.css`.
- The existing canonical radius has three declarations: `--ka-radius-md:16px` and `--ka-radius-md:20px` in `styles.css`, plus `--ka-radius-md:20px` in `tokens.css`. `tokens.css` loads after `premium-experience.css`, so its 20px declaration is the final canonical value.
- Legacy roots remain `--radius:16px` in `styles.css` and `--radius:20px` in later-loaded `premium-experience.css`.

**Implementation**
- Replaced only the two `border-radius:var(--radius)` consumers with `border-radius:var(--ka-radius-md)`.
- Added regression assertions for zero legacy consumers, nine total canonical consumers, the final 20px token, stylesheet order, both target selectors, and preservation of the existing canonical and legacy declarations.

**Preservation**
- No root declaration, other geometry token, selector structure, spacing, shadow, markup, JavaScript, learning content, XP, calculations, learner progress, fonts, RTL behavior, or stylesheet order changed.
- No backup files, `main`, or `gh-pages` changes. No merge or deployment.

**Verification boundary**
- Pre-edit inventory across all 16 loaded stylesheets found exactly two legacy consumers and seven existing canonical consumers.
- In-memory static assertions verified exactly two replacements, zero remaining `var(--radius)` consumers, nine canonical consumers, three unchanged canonical declarations, and two unchanged legacy root declarations.
- Parent-head CI run #386 completed successfully: verify, browser and package passed; deploy-preview was skipped. This is evidence for the parent only. The new commit requires its own CI run.
- No computed-style capture was run specifically for the radius migration; visual preservation is supported by the verified final 20px token and will be checked by the new browser run.

**Next micro-task (01.24):** remove only the two unconsumed legacy `--radius` root declarations after confirming zero active consumers. Duplicate canonical `--ka-radius-md` declaration consolidation remains a separate later task.

## 25. Task 01.24 — Retire legacy radius root declarations

**Status:** Implemented on the isolated Phase 1 branch.

### Repository evidence before editing
- PR #4 was open and draft on `fix/phase1-drawer-bidi-deploy-safety`, targeting `implementation/kpi-academy-mvp`; exact pre-edit head: `b4e76b793644bb5918c24e3b4e5b8196af7cf59a`.
- The branch ref and PR head agreed. The latest commits were the three Task 01.23 commits: `f3eca35` (CSS migration), `d6ec7df` (regression tests), and `b4e76b7` (documentation).
- CI run #387 on the exact pre-edit head completed successfully: `verify`, `browser`, and `package` passed; `deploy-preview` was skipped.
- Re-read `index.html` and fetched all 16 linked stylesheets from the exact head. The only legacy radius declarations were `--radius:16px` in `assets/css/styles.css` and `--radius:20px` in `assets/css/premium-experience.css`. The full active stylesheet stack had zero `var(--radius)` consumers.
- The canonical radius still has three declarations and nine consumers. The final canonical value remains `--ka-radius-md:20px` from the later-loaded `tokens.css`.

### Implementation
- Removed only the two now-unconsumed legacy root declarations.
- Updated `tests/design-tokens.test.js` to require zero legacy `--radius` declarations and zero consumers across the active stylesheet stack, with explicit checks for both declaration-bearing files.
- Left all three canonical `--ka-radius-md` declarations and all nine canonical consumers unchanged.

### Preservation
- No selectors, component radii, spacing, shadows, colors, stylesheet order, markup, JavaScript, curriculum, XP, calculations, learner progress, fonts, or RTL behavior changed.
- No archived backup files, `main`, or `gh-pages` were modified. No merge or deployment occurred.

### Verification boundary
- Pre-edit source audit covered all 16 stylesheets linked by the current `index.html`; it found exactly two legacy declarations and zero legacy consumers.
- In-memory source assertions after the edit confirm zero `--radius` declarations, zero `var(--radius)` consumers, nine `var(--ka-radius-md)` consumers, and three unchanged canonical declarations.
- CI run #387 verifies the parent commit only. The new commit requires its own PR-triggered CI run; no local Node or browser execution is claimed here.

**Next micro-task (01.25):** consolidate the three duplicate `--ka-radius-md` declarations into one canonical `20px` owner in `tokens.css`, after confirming all nine consumers resolve to that value and no stylesheet-specific radius fallback is required. Keep other radius sizes and component geometry out of scope.


## 26. Task 01.25 — Consolidate canonical medium-radius ownership

**Status:** Implemented on the isolated Phase 1 branch.

### Repository evidence before editing
- PR #4 was open and draft on `fix/phase1-drawer-bidi-deploy-safety`, targeting `implementation/kpi-academy-mvp`; exact pre-edit head: `cd78cde99f3a5955323befafbbf6454e160cba0b`.
- The exact-head commit was `refactor(tokens): retire legacy radius declarations`. CI run #388 for this exact head completed successfully.
- Re-read `index.html` and fetched all 16 linked stylesheets from the exact head. `styles.css` was first; `premium-experience.css` loaded eighth; `tokens.css` loaded thirteenth. No later stylesheet redefined `--ka-radius-md`.
- The active stack had exactly three declarations: `16px` and `20px` in separate `:root` blocks inside `styles.css`, plus `20px` in `tokens.css`. It had nine consumers: eight in `styles.css` and one in `components.css`.
- The separate HTML QA page, `dev/bidi-test.html`, loads `tokens.css` and `base.css`, not `styles.css`; it does not require a standalone `styles.css` radius fallback.
- The canonical `tokens.css` declaration loads after both `styles.css` and `premium-experience.css`, so the active application already resolves all nine consumers to `20px`.

### Implementation
- Removed only the two duplicate `--ka-radius-md` declarations from `assets/css/styles.css` (the `16px` legacy-root value and the `20px` visual-learning-root value).
- Kept the single `--ka-radius-md:20px` declaration in `assets/css/tokens.css`.
- Updated `tests/design-tokens.test.js` to require exactly one declaration in the loaded stack, zero declarations in `styles.css`, one declaration in `tokens.css`, nine consumers, and canonical token load order after both source layers.

### Preservation
- Left all nine consumers unchanged.
- Left `--ka-radius-sm`, `--ka-radius-lg`, `--ka-radius-control`, and `--ka-radius-pill` untouched.
- No component geometry, spacing, shadows, colors, markup, JavaScript, curriculum, XP, calculations, learner progress, fonts, RTL behavior, or stylesheet order changed.
- No backup files, `main`, or `gh-pages` changes. No merge or deployment.

### Verification boundary
- In-memory static checks over the fetched exact-head source confirm the two targeted declarations are removed from `styles.css`, the one canonical `20px` declaration remains in `tokens.css`, eight `styles.css` consumers remain, and stylesheet order is preserved. The pre-edit scan of all 16 active stylesheets found the ninth consumer in `components.css`.
- Parent-head CI run #388 completed successfully. The new commits require their own PR-triggered CI run; no local Node or browser execution is claimed here.

**Next micro-task (01.26):** audit the remaining canonical radius family (`--ka-radius-sm`, `--ka-radius-lg`, `--ka-radius-control`, and `--ka-radius-pill`) for duplicate declarations, consumer counts, and actual cascade ownership. Documentation-only; do not change their values or consumers in that audit.


## 27. Task 01.26 — Audit the remaining canonical radius family

**Status:** Documentation-only audit completed on the isolated Phase 1 branch.

### Repository and CI evidence before the audit
- PR #4 was open and draft, targeting `implementation/kpi-academy-mvp`; branch `fix/phase1-drawer-bidi-deploy-safety`.
- Exact PR head and branch head agreed at `9e077d969da7fb23a82e25721e47b0229c370f24`.
- Latest commits at the start of this task were `9e077d9` (documentation), `7d884e0` (radius regression tests), and `2758c54` (medium-radius declaration consolidation).
- CI run #390 on the exact head completed successfully: `verify`, `browser`, and `package` passed; `deploy-preview` was skipped. No deployment occurred.
- Re-fetched `index.html` from the exact head and enumerated all 16 linked stylesheets in source order. Also inspected the repository tree: the active app page is `index.html`; `dev/bidi-test.html` is the isolated QA page; the older backup HTML is archived under `backups/`.
- The QA page loads only `../assets/css/tokens.css` and `../assets/css/base.css`; it does not load `styles.css`. No other active HTML page was found that independently loads the legacy stylesheet stack.

### Exact declaration and consumer inventory

Counts below are across the 16 stylesheets linked by the active `index.html`, fetched at the exact head above.

| Token | Active declarations | Consumers | Winning value |
|---|---:|---:|---:|
| `--ka-radius-sm` | 2 | 1 | `16px` |
| `--ka-radius-lg` | 3 | 1 | `28px` |
| `--ka-radius-control` | 1 | 5 | `14px` |
| `--ka-radius-pill` | 1 | 2 | `999px` |

Declaration locations and cascade:
- `--ka-radius-sm`: `styles.css` declares `10px`; later `tokens.css` declares `16px`. The only consumer is in `shell.css` (the mobile bottom-navigation link). The effective value is `16px`.
- `--ka-radius-lg`: `styles.css` declares `22px` in its first root block and `28px` in a later root block; later `tokens.css` declares `28px`. The only consumer is the `.ka-welcome` hero in `styles.css`. The effective value is `28px`.
- `--ka-radius-control`: its single declaration is `14px` in `tokens.css`; five consumers are split across `components.css` (one) and `shell.css` (four). The effective value is `14px`.
- `--ka-radius-pill`: its single declaration is `999px` in `tokens.css`; both consumers are in `components.css`. The effective value is `999px`.

The load order is `styles.css` first, `premium-experience.css` eighth, `tokens.css` thirteenth, then `base.css`, `components.css`, and `shell.css`. No later active stylesheet redeclares these four radius tokens. Therefore `tokens.css` is the final owner of all four values; the earlier `styles.css` declarations for `sm` and `lg` are dormant duplicates in the active application cascade.

### Decision and preservation boundary
- Keep all four canonical declarations in `tokens.css` unchanged.
- The only cleanup candidate is the three earlier duplicate declarations in `styles.css`: `--ka-radius-sm:10px`, `--ka-radius-lg:22px`, and `--ka-radius-lg:28px`.
- Do not change any of the nine consumers, the four token values, component geometry, spacing, shadows, markup, JavaScript, learning content, XP, calculations, learner progress, fonts, or RTL behavior during this audit.
- No production source or test file was changed in Task 01.26. No backup files, `main`, or `gh-pages` were changed. No merge or deployment occurred.

### Verification boundary
- Static source inventory completed against all 16 active stylesheets at the exact PR head; counts, declaration locations, consumer locations, and load order were checked directly.
- The repository HTML inventory found no supported standalone page that loads `styles.css` without the later canonical `tokens.css` layer.
- CI #390 is successful for the pre-audit head. This task changes documentation only; its new commit still requires its own workflow state to be checked before claiming a new-head CI result.

**Next micro-task (01.27):** remove only the three dormant duplicate declarations for `--ka-radius-sm` and `--ka-radius-lg` from `assets/css/styles.css`. Keep the single canonical values in `tokens.css`, all nine consumers, and every component radius unchanged. Re-fetch the exact PR head and recheck all 16 stylesheets before editing.


## 28. Task 01.27 — Remove dormant radius-family declarations

**Status:** Implemented on the isolated Phase 1 branch.

### Repository and CI evidence before the edit
- Re-fetched PR #4 metadata and confirmed it was open, draft, unmerged, and based on implementation/kpi-academy-mvp; the branch and PR head both matched 72f7544f59c7585562037ec0430843a828b8d7e8.
- Inspected the latest branch commits: 72f7544 (radius-family audit), 9e077d9 (medium-radius consolidation record), 7d884e0 (medium-radius regression tests), and 2758c54 (medium-radius CSS consolidation).
- CI run #391 on the exact pre-edit head completed successfully: Verify, Browser, and Package passed; Deploy Preview was skipped. No deployment occurred.
- Re-fetched index.html and all 16 linked stylesheets at the exact head, then re-counted declarations and consumers before editing.

### Exact pre-edit inventory
| Token | Declarations before | Consumers before | Canonical value |
|---|---:|---:|---:|
| --ka-radius-sm | 2 | 1 | 16px |
| --ka-radius-lg | 3 | 1 | 28px |
| --ka-radius-control | 1 | 5 | 14px |
| --ka-radius-pill | 1 | 2 | 999px |

The three dormant duplicates were confined to two :root blocks in assets/css/styles.css: --ka-radius-sm:10px, --ka-radius-lg:22px, and --ka-radius-lg:28px. The canonical tokens.css layer loads later and owns the effective values.

### Implementation
- Removed only those three dormant declarations from assets/css/styles.css.
- Kept all four canonical declarations in assets/css/tokens.css unchanged.
- Added regression assertions for single declaration ownership, canonical values, and unchanged consumer counts for all four radius-family tokens.

### Preservation and verification boundary
- Post-edit source checks across the same 16 loaded stylesheets confirm one declaration each for sm, lg, control, and pill; values remain 16px, 28px, 14px, and 999px; consumer counts remain 1, 1, 5, and 2 respectively.
- The nine consumers in the audited four-token family are unchanged. The separate nine --ka-radius-md consumers are also unchanged.
- No markup, JavaScript, learning content, XP, calculations, progress data, font files, font activation, stylesheet order, RTL behavior, backup files, main, or gh-pages changes.
- The exact new-head CI result must be checked separately. No local Node or browser execution is claimed by this task record.

**Next micro-task (01.28):** Design System exit-gate review. Reconcile the blueprint, style-ownership map, token contract, and current CI/browser evidence; identify only genuine blockers to Home Dashboard implementation. Do not begin Home markup or Phase 2 during that review.
