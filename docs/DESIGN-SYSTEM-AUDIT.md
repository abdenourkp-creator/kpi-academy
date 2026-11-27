# KPI Academy — Design System Audit & Specification

**Mission:** 01 — Design System Audit  
**Status:** Audit deliverable; implementation not yet changed  
**Reference targets:** Owner-approved Home Dashboard and Lesson Experience phone mockups  
**Branch:** `fix/phase1-drawer-bidi-deploy-safety`

## Executive finding

The repository already contains the beginnings of a premium navy / cyan / gold design system, but it does not yet have one authoritative styling layer. The current cascade mixes a legacy light application theme, a dark premium override, a newer tokenized shell, and several feature stylesheets that still hard-code light surfaces and legacy color variables.

The next visual implementation must not be a broad stylesheet reorder or a global CSS rewrite. That would risk the working lesson labs, simulator, analytics, and calculator. The safer path is to define a tokenized component layer and migrate one surface at a time, beginning with Home, then the shared Lesson shell.

## 1. Confirmed application architecture

- HTML5, CSS3, Vanilla JavaScript, JSON curriculum manifests, Markdown lesson manuscripts.
- `index.html` loads the app shell and 16 stylesheets.
- Existing rendering and data logic lives primarily in `assets/js/app.js`, `learning-engine.js`, `learning-ui.js`, and lesson / lab modules.
- Current feature set includes dashboard, modules, lesson reader, KPI calculator, analytics lab, management simulator, progress and assessments.
- Preserve existing data, routes, calculations, learner state, XP rules, evidence gates, and curriculum files.

## 2. Stylesheet load order observed in index.html

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

**Cascade implication:** the legacy base stylesheet establishes the original light theme; premium-experience replaces many legacy variables and selectors; the tokenized shell then styles shared shell elements. Feature stylesheets are not uniformly tokenized, and some feature-specific rules are loaded after the premium layer. A simple global reorder could silently alter working labs and tools.

## 3. Confirmed style ownership and conflict map

| File | Current responsibility | Audit finding |
|---|---|---|
| `styles.css` | Legacy app layout and most page/component styling | 59,955 bytes; 514 lines; 728 parsed selector blocks; legacy light palette plus legacy variables |
| `premium-experience.css` | Dark hospitality visual override | 16,020 bytes; 231 lines; approximately 223 selector blocks; redefines legacy palette variables and overrides shared page surfaces |
| `tokens.css` | New design tokens | 89 unique `--ka-*` variables in a single `:root` block; includes colors, surfaces, radii, spacing, typography, shadows, motion, and z-index |
| `base.css` | Tokenized global base and accessibility foundations | Small and token-based; includes focus-visible and reduced-motion behavior |
| `components.css` | Initial tokenized primitives | Only five small primitives currently: card, button, chip, progress track |
| `shell.css` | Tokenized app shell, navigation and drawer | Token-based shared shell; loaded last among shared system files |
| `lesson-experience.css` | BM-005 interactive lesson lab | Contains a light paper-like surface with hard-coded colors; must be reconciled deliberately, not blindly darkened |
| `visual-learning.css` | Lesson visual card and chapter progress | Contains white surfaces and legacy variable references |
| `study-tools.css` | Study tools and review panels | Contains hard-coded light panels, controls, and borders |
| `simulator.css` | Management simulator | Contains hard-coded light scenario and feedback panels |

The complete 16-file stylesheet inventory, selector overlap scan, breakpoint list, token collisions, and migration mapping are documented in `docs/STYLE-OWNERSHIP-MAP.md`. No stylesheet order change or CSS migration has been made.

## 4. Key architectural risks

### R1 — Two competing token systems
The legacy variables (`--blue`, `--navy`, `--bg`, `--surface`, etc.) coexist with the newer `--ka-*` token namespace. The premium layer redefines the legacy variables to make the old UI dark. New components should use `--ka-*`; legacy selectors should be migrated deliberately with a mapping table.

### R2 — Cascade ownership is unclear
Several shared selectors are defined in more than one stylesheet, including app shell, sidebar, brand, navigation, topbar, and page content. Do not reorder the full stylesheet list until every dependent selector and feature view is accounted for.

### R3 — Mixed visual surfaces
The main shell is dark, while some learning tools and labs still use light cards. A light work surface can be valid as a deliberate contrast, but the current mix is inconsistent and not consistently expressed as a design decision.

### R4 — Component system is underdeveloped
The tokenized component layer currently provides only a few primitives. The target references require reusable patterns for dashboard metrics, progress rings, learner identity, image-led learning cards, lesson mode tabs, hospitality case studies, calculator inputs, result visualization, insight callouts, and lesson navigation.

### R5 — Image treatment is not yet a system
The app has existing diagrams and visual assets, but no documented shared contract for editorial photography, educational diagrams, responsive crops, captions, and fallbacks across Home and lessons.

## 5. Design-system specification to implement

### 5.1 Brand and color roles
- **Foundation:** midnight navy / deep ink for the application canvas.
- **Surface:** layered blue-black glass panels with restrained borders.
- **Primary action:** cyan / electric blue reserved for active controls, progress, and primary calls to action.
- **Achievement / identity:** warm gold reserved for brand marks, XP, premium labels, and selected highlights.
- **Semantic states:** success, warning, danger; never communicate state by color alone.
- **Lighting:** restrained cyan edge light and subtle gold reflection. Avoid broad neon glow around every card.

Use the existing `--ka-*` namespace as the authoritative direction. Do not add new ad-hoc palette variables in page styles.

### 5.2 Typography roles
Define tokens for:
- Arabic display headline;
- English / Latin technical title;
- page and section headings;
- body and long-form lesson text;
- labels and metadata;
- numeric values, formulas, IDs, currencies, and percentages.

Arabic is the primary interface direction. Technical fragments must be isolated as LTR units; do not manually reverse strings. Keep the existing font fallback until the owner approves Home and Lesson.

### 5.3 Spacing and layout
Use a consistent spacing scale and responsive content width. Mobile-first content should avoid edge-to-edge dense text. Establish explicit breakpoints for:
- compact phone: 360–389px;
- standard phone: 390–429px;
- large phone: 430–767px;
- tablet: 768–1023px;
- desktop: 1024px and above.

These are proposed design breakpoints for validation, not a claim that every current stylesheet already implements them.

### 5.4 Shared component contracts
Create reusable components / classes for:
1. App header and brand lockup.
2. Learner identity row and achievement chip.
3. Progress ring and metric rows.
4. Continue-learning card.
5. Quick-action tile.
6. Lesson breadcrumb and progress strip.
7. Lesson identity / title block.
8. Lesson mode navigation.
9. Hospitality case-study panel.
10. Educational image / diagram frame.
11. Calculator input group.
12. Result visualization and formula trace.
13. Business insight callout.
14. Previous / next lesson controls.
15. Empty, loading, error, and unavailable-image states.

Each component contract must specify: semantic purpose, surface token, border/radius, spacing, typography, interaction/focus state, mobile stacking, and RTL behavior.

## 6. Educational image slots — required content architecture

Images must be planned as content slots, not decorative filler. Each slot needs an explicit subject, aspect ratio, crop behavior, alt text, optional caption, and fallback.

| Placement | Proposed ratio | Purpose | Example subject |
|---|---:|---|---|
| Home hero | 16:9 | Establish premium hospitality context | Refined restaurant service / hotel reception detail |
| Continue-learning card | 16:9 | Preview the current learning topic | Financial dashboard, calculator, invoice, or stock sheet |
| Lesson hero | 16:9 | Anchor the concept in its operational setting | Restaurant floor, bar mise en place, finance office |
| Hospitality case study | 4:3 | Make the scenario concrete | Restaurant, hotel, bar, or kitchen operation |
| Technical explainer | 4:3 or 1:1 | Teach a process or relationship | Original diagram, annotated workflow, KPI chart |

**Responsive behavior:** images use a fixed aspect-ratio frame, `object-fit: cover` for photography, and `contain` for diagrams. Preserve the focal point per asset. Never stretch an image or allow it to push essential lesson controls below an unreasonable distance.

**Accessibility:** informative images get meaningful alt text; decorative images use empty alt text. Captions identify the educational context. Synthetic operational examples must be labelled as illustrative.

**Fallback:** show a designed navy / blue diagram placeholder with a topic icon and concise label; never show a broken-image icon or unrelated stock image.

### Initial image briefs
- Home hero: premium hotel / restaurant service moment, dark navy ambience, warm practical lighting, editorial composition, clear negative space for Arabic headline; no embedded text or logos.
- Continue-learning: close-up of hospitality business analysis tools (calculator, invoice, sales report, stock sheet), composition readable at phone-card crop.
- Lesson hero: topic-specific hospitality environment; for BM-005 use a refined restaurant setting connected to sales, food cost, and gross profit.
- Case-study card: realistic restaurant or hotel operation, with the subject visible in a 4:3 crop and no embedded figures or claims.

## 7. Migration sequence and guardrails

1. Finish the remaining stylesheet inventory, including all BM lab and venue CSS.
2. Create a token-to-legacy-variable mapping; do not delete legacy variables until their consumers are migrated.
3. Define shared component contracts and image-frame behavior.
4. Implement Home only, scoped to dashboard selectors; preserve existing data sources.
5. Review Home screenshots before proceeding.
6. Implement Lesson shell and reusable case / calculator / result components; preserve lesson-specific lab logic.
7. Reconcile intentional light work surfaces with the dark shell using explicit surface variants.
8. Run mobile and desktop regression screenshots and functional tests.
9. Only after Home and Lesson approval, consider font activation.

## 8. Mission 01 exit criteria

- [x] Actual stylesheet load order recorded from `index.html`.
- [x] Token namespace and existing shared primitives inspected.
- [x] Main legacy/premium/tokenized cascade risks identified.
- [x] Lesson and learning-tool surface inconsistencies identified.
- [x] Educational image slots, aspect ratios, content purpose, and fallback behavior specified.
- [x] Complete selector/token inventory for all 16 loaded stylesheets, including BM labs and venue styles.
- [ ] Owner review of the design-system specification.

**Decision:** Do not change the stylesheet load order or replace the existing global CSS in this mission. The next focused task is to complete the remaining feature stylesheet inventory and produce the final token migration map before the first visual component is rebuilt.


## 9. Latest source audit

The stylesheet count and selector-block count above have been corrected against the current `index.html` and CSS sources. The detailed ownership and token migration deliverable is `docs/STYLE-OWNERSHIP-MAP.md`.

Key verified findings:
- 16 stylesheets are loaded in `index.html`.
- `styles.css` contains 728 parsed selector blocks and four `:root` blocks.
- 233 normalized selector strings are shared by multiple stylesheets.
- The older `--ka-*` declarations in `styles.css` overlap the newer token namespace in `tokens.css`.
- The current feature CSS contains substantial hard-coded color usage and fragmented breakpoints.

The next implementation must resolve token ownership without a global stylesheet reorder, then build scoped Home and Lesson page layers while preserving the existing data and interaction engines.
