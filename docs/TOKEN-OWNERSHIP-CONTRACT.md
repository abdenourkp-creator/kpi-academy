# KPI Academy — Canonical Token Ownership Contract

**Mission:** 01 — Design System Audit  
**Tasks:** 01.5 — Layout / elevation migration; 01.6 — Semantic success-state migration  
**Audited branch:** `fix/phase1-drawer-bidi-deploy-safety`  
**Audited commit:** `79291914aaaee1682d0658d729d0f42c7365ea16`  
**Implementation base:** `c78d94f199e2885f927f33fad1cd03c28fc25c6f`  
**Scope:** all 16 stylesheets loaded by the current `index.html`; static CSS custom-property declarations and `var()` references. This task migrates the two low-risk layout/elevation tokens while preserving their effective values; no JavaScript, curriculum, learner-state, XP, calculation, or font-loading behavior is changed.

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
| `--warning` | `--ka-warning` | Keep warning separate from decorative gold |
| `--error` | `--ka-danger` | Preserve semantic state |
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
3. Migrate the remaining direct semantic aliases (`--text`, `--muted`, `--warning`, `--error`) in small selector groups.
4. Split overloaded `--navy`, `--blue`, `--border`, and `--light-blue` by consumer role.
5. Introduce explicit surface variants for dark shell panels and any intentional light work surfaces.
6. Retire unused legacy tokens only after a repository-wide CSS and JavaScript search.
7. Remove duplicate root declarations from `styles.css` after the consumers are migrated.
8. Keep `premium-experience.css` as a temporary compatibility layer until its page/component ownership has been moved into `dashboard.css`, `lesson-page.css`, or shared primitives.
9. Do not globally reorder stylesheets during this work. Any future load-order change requires a visual and functional regression pass across the app and labs.

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
