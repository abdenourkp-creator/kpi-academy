# KPI Academy — Canonical Token Ownership Contract

**Mission:** 01 — Design System Audit  
**Tasks:** 01.5 — Layout / elevation migration; 01.6 — Semantic success-state migration; 01.7 — Semantic warning-state migration; 01.8 — Semantic error-state migration; 01.9 — Secondary-text fallback migration  
**Audited branch:** `fix/phase1-drawer-bidi-deploy-safety`  
**Audited commit:** `79291914aaaee1682d0658d729d0f42c7365ea16`  
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

**Next micro-task (01.14):** migrate only the `.lesson-name` fallback from `var(--text)` to `var(--ka-text)`, preserving the later premium `#DDEAF4` override. Do not change the global body, progress-list title, or quiz-option text in that task.


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
