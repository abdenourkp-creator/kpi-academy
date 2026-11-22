# KPI Academy — CSS Ownership & Token Migration Map

**Mission:** 01 — Design System Audit  
**Task:** 01.2 — Complete stylesheet ownership and token migration map  
**Audited branch:** `fix/phase1-drawer-bidi-deploy-safety`  
**Audited commit:** `9f98a7845c65d7ecc0b9f2ff6f50aea8142be594`  
**Scope:** all stylesheets linked by the current `index.html`; no application CSS or JavaScript was changed in this task.

## Executive decision

The application currently has three overlapping styling systems:

1. **Legacy application styling** in `styles.css`, including the original light theme, a later dark-theme adaptation, and multiple older `--ka-*` variable groups.
2. **Premium override styling** in `premium-experience.css`, which redefines the unprefixed legacy palette and repeats many of the same page and component selectors.
3. **The newer tokenized shell** in `tokens.css`, `base.css`, `components.css`, and `shell.css`.

The main problem is not simply that the app needs more attractive colors. It lacks a single, unambiguous owner for shared selectors and semantic tokens. The safest route is **incremental ownership migration**: establish canonical tokens, then migrate one UI surface at a time. Do not globally reorder or replace the stylesheets before their consumers are accounted for.

## 1. Verified stylesheet load order

The current `index.html` loads **16 stylesheets**, not 15. The following order is the actual source order. Rule-block counts are from a source-level brace scan; they are useful for inventory, not a substitute for browser-computed cascade analysis. Color counts are raw occurrences of hex or RGB/HSL color syntax, not unique colors.

| # | Stylesheet | Rule blocks | Source lines | Color occurrences | Current ownership |
|---:|---|---:|---:|---:|---|
| 1 | `styles.css` | 728 | 514 | 313 | Legacy app shell, dashboard, modules, lesson reader, calculator, assessment and progress styling |
| 2 | `lesson-experience.css` | 65 | 69 | 69 | BM-005 interactive lesson lab (`.le-*`) |
| 3 | `visual-learning.css` | 21 | 1 | 8 | Lesson visual cards and chapter-progress presentation |
| 4 | `study-tools.css` | 95 | 31 | 95 | Study dashboard, bookmarks, review, glossary, flashcards and skill/badge panels |
| 5 | `percentage-labs.css` | 20 | 1 | 28 | Percentage practice lab (`.pl-*`) |
| 6 | `simulator.css` | 25 | 1 | 28 | Management simulator scenarios and feedback (`.ka-sim-*`) |
| 7 | `live-venue.css` | 101 | 26 | 86 | Live venue / operational simulation (`.lv-*`) |
| 8 | `premium-experience.css` | 223 | 231 | 232 | Global premium/dark overrides and repeated page/component selectors |
| 9 | `bm001-lab.css` | 51 | 49 | 58 | BM-001 lab |
| 10 | `bm002-lab.css` | 52 | 8 | 59 | BM-002 lab |
| 11 | `bm003-lab.css` | 45 | 2 | 54 | BM-003 lab |
| 12 | `bm004-lab.css` | 45 | 2 | 54 | BM-004 lab |
| 13 | `tokens.css` | 1 | 19 | 46 | New semantic token layer; 89 unique `--ka-*` variables |
| 14 | `base.css` | 9 | 1 | 0 | Global base, focus-visible, reduced-motion and page-content baseline |
| 15 | `components.css` | 5 | 1 | 0 | Initial shared primitives: card, button, chip and progress |
| 16 | `shell.css` | 50 | 1 | 0 | Tokenized app shell, navigation, mobile drawer and header |

### Cascade implications

- `premium-experience.css` loads after the early feature sheets, so its repeated selectors can override them.
- The four tokenized files load after all feature sheets. Their custom-property declarations therefore win where names collide, while selectors in earlier files still remain active.
- BM-001 through BM-004 stylesheets load after the premium layer and retain their own isolated lab selectors.
- A stylesheet's source position does not make it the sole owner of a selector. Multiple files still define the same selector, and specificity can change the winner.

## 2. Measured selector overlap

The source scan found:

- **999 normalized selector strings** across the 16 stylesheets.
- **233 selector strings** are defined in more than one stylesheet.
- The largest pairwise overlap is `styles.css` + `premium-experience.css`: **179 shared selector strings**.
- Other significant overlaps: `premium-experience.css` + `shell.css` (25), `lesson-experience.css` + `premium-experience.css` (23), and `styles.css` + `shell.css` (21).

These are pairwise overlap counts; a selector appearing in three files contributes to more than one pair. The scan normalizes whitespace and comma-separated selector groups but does not calculate specificity or browser cascade winners.

### High-risk shared selector families

| Selector family | Current files | Required future owner |
|---|---|---|
| `.app-shell`, `.sidebar`, `.brand`, `.nav-link`, `.topbar`, `.page-content` | `styles.css`, `premium-experience.css`, `shell.css` | `shell.css` |
| `.ka-welcome`, `.ka-hero-*`, `.ka-product-facts`, `.ka-learning-section`, `.ka-route-grid`, `.ka-modules-section` | `styles.css`, `premium-experience.css` | New `dashboard.css` |
| `.learning-hero`, `.learning-resume`, `.learning-mini-card`, `.chapter-progress` | `styles.css`, `premium-experience.css`; markup from `learning-ui.js` | Dashboard page styles plus shared component primitives |
| `.lesson-reader`, `.lesson-body`, `.lesson-meta`, `.lesson-end` | `styles.css`, `premium-experience.css` | New `lesson-page.css` |
| `.lesson-visual-card`, `.chapter-progress-*` | `visual-learning.css`, with premium overrides | `visual-learning.css` using canonical tokens |
| `.le-hero`, `.le-data-grid`, `.le-task-*`, `.le-insight` | `lesson-experience.css`, `premium-experience.css` | Keep `lesson-experience.css` as the BM-005 lab owner; migrate its visual tokens carefully |
| `.bm001-*` through `.bm004-*` | One dedicated stylesheet per lab | Keep each dedicated lab stylesheet |
| `.st-*`, `.pl-*`, `.ka-sim-*`, `.lv-*` | Their respective feature stylesheets | Keep feature-local ownership; migrate colors and surfaces to tokens |

## 3. Token collision audit

### 3.1 The two legacy palette layers

`styles.css` declares the original unprefixed palette in its first `:root` block. `premium-experience.css` declares the same **14 unprefixed variables** again with different values:

| Legacy variable | Original value in `styles.css` | Premium override in `premium-experience.css` | Migration target |
|---|---|---|---|
| `--blue` | `#2477B8` | `#19BDEB` | Choose `--ka-blue` or `--ka-cyan` by role; not a blind alias |
| `--navy` | `#17324D` | `#06182B` | `--ka-bg-deep` / `--ka-ink` for dark surfaces; `--ka-text` for text on dark surfaces |
| `--light-blue` | `#EAF4FC` | `#0C2A43` | `--ka-blue-soft` or a glass surface |
| `--soft-blue` | `#D7EAF8` | `#123C5B` | `--ka-surface` / `--ka-glass-2`, according to contrast |
| `--bg` | `#F6F9FC` | `#061321` | `--ka-bg` |
| `--surface` | `#fff` | `#0B2033` | `--ka-surface` |
| `--text` | `#172B3A` | `#EAF3FC` | `--ka-text` |
| `--muted` | `#718096` | `#9CB1C4` | `--ka-muted` |
| `--border` | `#E4EBF2` | `rgba(129,177,211,.22)` | `--ka-border` or `--ka-border-blue` |
| `--success` | `#23865B` | `#19C987` | `--ka-success` |
| `--warning` | `#D99A32` | `#E7B95C` | `--ka-warning` |
| `--error` | `#C84B4B` | `#F06E78` | `--ka-danger` |
| `--radius` | `16px` | `20px` | Select `--ka-radius-*` per component |
| `--shadow` | `0 8px 28px rgba(23,50,77,.055)` | `0 18px 48px rgba(0,0,0,.28)` | Select a component-specific `--ka-shadow-*` |

The premium file currently acts as a global theme switch for legacy consumers. It must not simply be deleted: its selectors and dark values need to be migrated into their future owners first.

### 3.2 A second, older `--ka-*` system inside `styles.css`

`styles.css` contains **four `:root` blocks**, not one. Three blocks define older `--ka-*` values and a fourth defines typography variables. The newer `tokens.css` then declares 89 unique `--ka-*` variables.

Fifteen names overlap between `styles.css` and `tokens.css`, including:

- `--ka-blue`, `--ka-bg`, `--ka-surface`, `--ka-text`, `--ka-muted`, `--ka-border`;
- `--ka-success`, `--ka-warning`;
- `--ka-radius-sm`, `--ka-radius-md`, `--ka-radius-lg`;
- `--ka-font-ar`.

The later `tokens.css` values win for these names. Several older names remain only in `styles.css`, including `--ka-navy`, `--ka-light`, `--ka-soft`, `--ka-content`, `--ka-type-body`, `--ka-type-small`, `--ka-type-label`, `--ka-error`, and `--ka-shadow`. Some of these are still referenced by legacy selectors. In particular, old dark-navy text values must be checked before the corresponding surfaces are migrated; a dark heading token can become low-contrast on the new navy canvas.

**Decision:** `tokens.css` becomes the only owner of shared design tokens. Do not create another `:root` palette in a page or feature stylesheet. Remove old declarations only after their consumers have been migrated and checked.

### 3.3 Migration mapping rules

| Existing variable / pattern | New semantic direction | Rule |
|---|---|---|
| `--blue` | `--ka-blue` or `--ka-cyan` | Decide by purpose: blue for primary action structure; cyan for accent, active progress and luminous detail |
| `--navy` / `--ka-navy` | `--ka-bg-deep`, `--ka-ink`, or `--ka-text` | Context-specific. Never map dark navy text directly onto a dark panel |
| `--light-blue` / `--ka-light` | `--ka-blue-soft`, `--ka-glass-1` | Use for subtle selected or informational surfaces |
| `--soft-blue` / `--ka-soft` | `--ka-surface`, `--ka-glass-2` | Choose based on surface depth and contrast |
| `--bg` / `--ka-bg` | `--ka-bg` | Canonical page canvas |
| `--surface` / `--ka-surface` | `--ka-surface`, `--ka-ink-panel` | Choose based on card/panel hierarchy |
| `--text` / `--ka-text` | `--ka-text` | Primary readable text on dark surfaces |
| `--muted` / `--ka-muted` | `--ka-muted`, `--ka-faint` | Separate body-secondary from low-priority metadata |
| `--border` / `--ka-border` | `--ka-border`, `--ka-border-blue` | Neutral separation vs emphasized blue edge |
| `--success`, `--warning`, `--error` | `--ka-success`, `--ka-warning`, `--ka-danger` | Keep semantic status distinct from brand colors |
| `--radius`, `--ka-radius-*` | `--ka-radius-sm/md/lg/control/pill` | Choose by component contract; do not force one radius everywhere |
| `--shadow`, `--ka-shadow` | `--ka-shadow-glow`, `--ka-shadow-button`, `--ka-shadow-drawer` | Use a role-specific elevation, not one global shadow |
| `--ka-content` | Layout max-width rule | Keep layout width separate from color/surface tokens |
| `--ka-type-body/small/label` | `--ka-text-md/sm/xs` | Preserve semantic hierarchy; verify Arabic line-height separately |
| `--ka-font-ar` | Existing `--ka-font-ar` fallback | Keep the current fallback stack. No font upload or `@font-face` activation before Home and Lesson approval |

### 3.4 Hard-coded color debt

A source scan found approximately **1,130 raw color literal/function occurrences** across the 16 files. The largest concentrations are `styles.css` (313), `premium-experience.css` (232), and feature sheets such as `study-tools.css` (95), `live-venue.css` (86), and `lesson-experience.css` (69). These are not 1,130 different colors; many are repeated values and state styles.

The first migration should not replace all literals mechanically. Each literal must be classified as a semantic role (surface, border, action, status, chart, diagram, or focus) before it is mapped to a token. Lab feedback colors and charts require particular care because they communicate meaning.

## 4. Responsive breakpoint fragmentation

The current stylesheets use **13 distinct numeric width values**: 380, 390, 520, 600, 650, 700, 720, 760, 761, 900, 1023, 1024, and 1050px.

The target validation bands remain:

| Viewport | Intended class |
|---|---|
| 360–389px | Compact phone |
| 390–429px | Standard phone |
| 430–767px | Large phone |
| 768–1023px | Tablet |
| 1024px and above | Desktop |

These bands are a test matrix, not a reason to rewrite every media query at once. Consolidate only after the relevant page and feature components have been migrated and tested. Preserve safe-area padding and touch targets.

## 5. Runtime ownership: Home and Lesson

### Home Dashboard

The current `dashboard()` renderer in `assets/js/app.js` outputs:

- `.ka-dashboard` and `.ka-welcome` with the hero copy and action;
- `.ka-welcome-visual` containing the existing `assets/diagrams/academy/dashboard-command-center.svg`;
- `.ka-product-facts`, `.ka-learning-section`, `.ka-learning-route`, `.ka-modules-section`, and `.ka-method`.

The current `dashboardSummary()` in `learning-ui.js` reads `ENGINE.getDashboard()` and builds the learner summary, resume link, lesson/assessment/XP progress, and chapter progress. The existing data source should remain authoritative. The reference's circular progress ring and compact XP/lesson/assessment metric panel are presentation changes, not permission to hard-code values.

### Lesson Experience

The current `lessonView()` renderer in `app.js` loads the original Markdown lesson source and mounts the existing BM-001 through BM-004 labs. It also inserts lesson visual figures where the curriculum provides them.

The BM-005 interactive lab is owned by `lesson-experience.js` and its `.le-*` styles. It already has a case-data grid, five guided tasks, a progress indicator, feedback and an insight message. The future lesson redesign should wrap and visually organize these existing functions; it must not replace them with static mockup content or change XP/evidence rules.

## 6. Educational image-slot ownership

Image frames are part of the content architecture. They must have a clear teaching purpose and a designed fallback; no broken-image icons and no unrelated stock images.

| Slot | Current state | Target ratio | Subject / purpose | Rendering and accessibility contract |
|---|---|---:|---|---|
| Home hero | Existing command-centre SVG diagram; not the same visual role as the reference hospitality photo | 16:9 | Editorial hotel / restaurant service scene establishing premium hospitality identity | `object-fit: cover`; art-directed focal point; Arabic alt text; optional short caption; navy gradient fallback |
| Continue-learning card | Current resume panel is text-led and has no contextual image | 16:9 | Visual cue for the actual next lesson (invoice, cost sheet, coffee station, restaurant operation, etc.) | Crop to card frame; do not push title/progress/action out of view; topic-specific alt and caption |
| Lesson hero | Existing lesson figures are instructional diagrams for selected lessons | 16:9 | Topic-specific hospitality environment that contextualizes the lesson | Keep the existing diagram as a separate teaching asset; hero photo uses `cover`; accessible alt/caption; fallback |
| Hospitality case study | Current BM-005 case data is primarily text/data; no dedicated case photo frame | 4:3 | Restaurant, hotel, bar, kitchen, or front-office scenario | Keep the data and task controls visible; photo may stack above the case on compact phones; label synthetic scenarios as illustrative |
| Technical explainer | Existing diagrams and chapter visuals | 4:3 or 1:1 | Formula flow, stock process, service sequence, KPI relationship | `object-fit: contain`; preserve full diagram; descriptive alt and optional source/context caption |

### Asset rules

1. Every image slot has a stable semantic key, intended subject, aspect ratio, focal point, alt text, and optional caption.
2. Photography uses `cover`; instructional diagrams use `contain`.
3. On compact phones, imagery may stack above text but must not displace essential controls or make the learner scroll past decorative media to reach the task.
4. When an asset is unavailable, render a polished navy/blue placeholder with a topic label and icon. Never use a broken URL or silently substitute unrelated imagery.
5. Use original or appropriately licensed assets; keep source/provenance metadata with the asset. Do not embed text or fake business figures inside generated imagery.
6. Home and Lesson should be visually reviewed with real crops at 360, 390 and 430px before the image system is considered accepted.

## 7. Target CSS ownership architecture

This is the intended ownership model after incremental migration:

| Layer | Sole responsibility |
|---|---|
| `tokens.css` | Canonical semantic colors, surfaces, type scale, spacing, radii, shadows, motion, z-index and safe-area values |
| `base.css` | Reset, document/body defaults, global text behavior, focus and reduced-motion support |
| `components.css` | Reusable primitives with no page-specific layout assumptions |
| `shell.css` | App header, navigation, sidebar, drawer, responsive shell and safe-area layout |
| New `dashboard.css` | Home hero, learner identity, progress ring, metric panel, resume card and dashboard quick actions |
| New `lesson-page.css` | Lesson breadcrumb/progress/header/media/case/result/insight/navigation layout |
| `visual-learning.css` | Educational diagram frames and chapter visual/progress components |
| `lesson-experience.css` | BM-005 interactive lab only; keep its DOM hooks and behavior stable |
| `bm001-lab.css` … `bm004-lab.css` | Their respective lesson labs |
| `study-tools.css`, `percentage-labs.css`, `simulator.css`, `live-venue.css` | Isolated feature presentation, migrated to semantic tokens |
| `styles.css` | Temporary legacy source during migration; retire selectors only after their new owners are verified |
| `premium-experience.css` | Temporary override source; retire only after every required premium treatment has moved to its true owner |

### Safe migration order

1. Freeze the current source map and keep all current stylesheets in place.
2. Resolve the token namespace collision in a dedicated, tested change; do not silently change visual values while mapping.
3. Establish reusable component contracts in `components.css`.
4. Create scoped Home ownership in `dashboard.css`; keep the legacy Home styles available until the new page is verified.
5. Create scoped Lesson ownership in `lesson-page.css`; preserve Markdown renderer and lab mount points.
6. Migrate feature styles one family at a time, starting with the shared surfaces that are visibly inconsistent.
7. Remove legacy selectors only when no current markup or test relies on them.
8. Re-run functional and screenshot checks after each page migration.

**Do not reorder all CSS files as a shortcut.** The current order is a dependency; the goal is to make those dependencies unnecessary through explicit ownership.

## 8. Preservation and approval gates

- No changes to `main` or `gh-pages`.
- No PR merge and no deployment.
- No changes to curriculum JSON, Markdown lesson source, calculation engines, learner-state schema, XP awards, evidence gates, or backup/restore behavior.
- No font upload or `@font-face` activation before Home and Lesson approval.
- Keep the approved phone mockups as the visual target. The implementation must be responsive and functional, not a static image reproduction.
- This task is a source audit and documentation deliverable only; it makes no CSS or JavaScript runtime changes.
