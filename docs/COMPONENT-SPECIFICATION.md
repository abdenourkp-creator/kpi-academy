# KPI Academy — Component Specification

**Task:** 01.29 — Component specification  
**Branch:** `fix/phase1-drawer-bidi-deploy-safety`  
**PR:** #4 — open / draft / unmerged  
**Specification baseline:** `d5337ceeb33f12ef717b26cfd0651c6e575831e6`  
**Status:** Phase 1 design contract; documentation only  
**Reference authority:** The two owner-approved phone screenshots (Home Dashboard and Lesson Experience), interpreted through `VISUAL-TRANSFORMATION-BLUEPRINT.md`.

This document defines the presentation and interaction contracts for the shared shell and the two target experiences. It does not implement components. Names marked **proposed** are design hooks for later scoped implementation, not claims that those selectors or components already exist.

---

## 1. Purpose and non-negotiable boundaries

KPI Academy is a hospitality business-intelligence learning product. Its interface must make operational learning feel precise, practical, and premium—not like a generic course catalogue.

The component system must support this learning sequence:

**Understand → Calculate → Interpret → Decide**

The two approved phone screenshots are the visual acceptance references. The desktop experience must remain coherent, but mobile hierarchy, readability, and task reachability take priority during reconstruction.

### Preservation contract

Visual work may reorganize presentation, but it must not alter:

- curriculum manifests, lesson Markdown, lesson order, or lesson identifiers;
- KPI definitions, formulas, calculation engines, rounding rules, or displayed result semantics;
- XP awards, assessment thresholds, evidence gates, completion rules, or progress-state schema;
- learner data, local persistence, import/export, or backup compatibility;
- existing route hashes, functional destinations, or lab mount contracts;
- the behavior of BM-001 through BM-005 and the percentage labs.

Do not replace real learner values with mock numbers, sample names, rankings, ratings, or fabricated progress. Synthetic hospitality scenarios must be labelled as educational examples.

No new font file, font upload, or `@font-face` activation is permitted before the owner approves both reconstructed screens. Keep the currently loaded font/fallback behavior unchanged until that approval.

This specification does not authorize Phase 2, authentication, cloud sync, tracking, or new product scope.

---

## 2. Component taxonomy and implementation status

There are three distinct layers:

1. **Shared primitives** — low-level surfaces and controls with no page-specific assumptions.
2. **Shell components** — global navigation and application framing.
3. **Page components** — Home and Lesson compositions that consume existing runtime data and content.

### Existing shared primitives

At the reviewed source, `assets/css/components.css` defines four primitives:

| Existing selector | Responsibility | Contract |
|---|---|---|
| `.ka-card` | Shared surface | Canonical card gradient, border, medium radius, internal padding, primary text |
| `.ka-button` | Primary action surface | Minimum 48px height, button gradient, control radius, high-contrast label, button elevation |
| `.ka-chip` | Status / metadata | Compact inline label, subtle surface and border, pill radius |
| `.ka-progress` | Linear progress track | Quiet track, visible fill, pill ends |

These are the only components in this list confirmed as current shared primitives. Do not silently expand their global selectors to solve a page-specific layout problem.

### Proposed page-level components

The following are contracts for later work:

- Shell: app header, desktop sidebar, mobile bottom navigation, More drawer, learner identity.
- Home: brand hero, learner identity row, progress command panel, progress ring, metric group, continue-learning card, quick-action tile, learning-route panel, module card group.
- Lesson: lesson toolbar, breadcrumb, lesson progress strip, lesson identity, context-media frame, Markdown content surface, hospitality case panel, interactive-lab wrapper, result panel, business-insight panel, evidence/completion panel, previous/next navigation.

Proposed hooks should use the `ka-` namespace and be scoped to their page stylesheet. They must not collide with legacy selectors in `styles.css` or `premium-experience.css`.

---

## 3. Canonical design-token contract

`assets/css/tokens.css` is the canonical token owner. New components must consume semantic tokens rather than add page-local color literals or use unprefixed legacy aliases.

| Design role | Canonical token family |
|---|---|
| Page foundation | `--ka-bg`, `--ka-bg-deep`, `--ka-bg-radial`, `--ka-gradient-body` |
| Glass / card surfaces | `--ka-surface`, `--ka-glass-1`, `--ka-glass-2`, `--ka-glass-3`, `--ka-gradient-card` |
| Primary and secondary text | `--ka-text`, `--ka-text-shell`, `--ka-muted`, `--ka-faint` |
| Brand accent | `--ka-gold`, `--ka-gold-bright`, `--ka-gold-deep` |
| Action / progress accent | `--ka-blue`, `--ka-cyan`, `--ka-gradient-button`, `--ka-gradient-active` |
| Semantic feedback | `--ka-status-success`, `--ka-status-warning`, `--ka-status-error` |
| Borders and focus | `--ka-border`, `--ka-border-blue`, `--ka-focus` |
| Radius | `--ka-radius-sm`, `--ka-radius-md`, `--ka-radius-lg`, `--ka-radius-control`, `--ka-radius-pill` |
| Spacing | `--ka-space-1`, `--ka-space-2`, `--ka-space-3`, `--ka-space-4`, `--ka-space-6`, `--ka-space-8` |
| Typography | `--ka-text-xs`, `--ka-text-sm`, `--ka-text-md`, `--ka-text-lg`, `--ka-text-xl`, `--ka-text-2xl`, `--ka-text-display` |
| Elevation | `--ka-shadow-glow`, `--ka-gold-glow`, `--ka-shadow-drawer`, `--ka-shadow-button`, `--ka-elevation-card-hover` |
| Motion and stacking | `--ka-motion-fast`, `--ka-motion-normal`, `--ka-motion-slow`, `--ka-z-*` |
| Shell geometry | `--ka-header-height`, `--ka-nav-height`, `--ka-sidebar-width`, `--ka-safe-bottom` |

### Token use rules

- Gold is reserved for brand identity, achievement, and selected active emphasis. It is not a general-purpose text or border color.
- Blue/cyan communicates action, links, progress, and selected interactive states.
- Success, warning, and error tokens communicate meaning; never rely on color alone.
- Glass surfaces must retain sufficient text contrast. Blur and glow are decorative and may not be required for legibility.
- Use the radius token that matches the component scale; do not introduce a second radius system.
- Use the spacing scale as the default rhythm. Page-specific exceptions require a documented reason.
- Elevation should be restrained. A card must remain distinguishable without a large glow.
- Use logical spacing and border properties (`margin-inline`, `padding-inline`, `border-inline-*`) rather than left/right assumptions.

### Typography contract

The hierarchy is:

1. Display / brand headline
2. Page title
3. Section title
4. Component title
5. Body / instructional copy
6. Metadata / helper text
7. Numeric result / formula

Arabic is the primary interface language. English technical terms remain in their correct spelling and direction. Numeric results must be visually prominent without making instructional text secondary.

Use the existing tokenized type scale and current font fallback behavior. Do not upload, activate, or substitute font files in this task or before screen approval.

---

## 4. Shared shell components

### 4.1 App header

**Purpose:** Persistent identity, navigation access, page context, and learner account affordance.

**Anatomy:**
- menu control where the desktop sidebar is collapsed;
- KPI Academy mark and wordmark;
- current-page breadcrumb/title;
- optional status or notification control only when it has a real destination/action;
- learner avatar/account affordance only when its identity source is real.

**Behavior:**
- Desktop: compact top bar aligned with the main content region.
- Phone: compact header; the menu control and brand remain readable without pushing the page title off-screen.
- Header controls have accessible names, visible focus, and a minimum 44×44px hit area.
- No decorative notification icon or fake badge without a functional route and real state.

**Existing owner:** static header markup in `index.html`; shell presentation in `shell.css`; menu state wiring in `app.js`.

### 4.2 Desktop sidebar

**Purpose:** Full navigation for wider screens.

- Keep the brand at the top and navigation destinations grouped by learning purpose.
- Active route is clearly distinguishable by more than color alone.
- Sidebar width is governed by `--ka-sidebar-width`.
- Navigation labels remain visible; icon-only navigation is not the default desktop mode.
- Sidebar content must not cover the main content or create horizontal scrolling.

**Existing owner:** `#sidebar` and `.main-nav` in `index.html`; `.sidebar`, `.main-nav`, and `.nav-link` in the existing shell/legacy styles.

### 4.3 Mobile bottom navigation

**Purpose:** Persistent access to the five current primary destinations.

The existing destinations are Home, Modules, Tools, Progress, and More. Preserve their current hash routes and data-view hooks.

- Respect `env(safe-area-inset-bottom)` through `--ka-safe-bottom`.
- Keep every item comfortably tappable; 44px is the minimum target dimension.
- Active state uses a visible surface/indicator and accessible current-page semantics.
- The bar must not cover the last interactive control or lesson navigation. Reserve content clearance.
- Labels must remain legible at 360px width; do not solve crowding by shrinking text below a readable size.

**Existing owner:** `.mobile-bottom-nav` and `.mobile-bottom-link` in `index.html` / `shell.css`.

### 4.4 More drawer

**Purpose:** Secondary destinations on compact screens.

- Opens from the More control and closes through its close control, backdrop, and Escape key.
- `aria-expanded`, `aria-controls`, and hidden/visible state must agree with the visual state.
- A closed drawer must not receive pointer or keyboard interaction.
- Focus moves into the drawer when opened and returns to the trigger when closed.
- Drawer width is capped by the viewport; no content may render off-canvas.
- Backdrop is below the drawer and above the page; z-index uses the canonical stack.
- RTL and LTR must use logical positioning and a tested transform direction.

**Existing owner:** `#moreDrawer`, `#moreToggle`, and `.drawer-backdrop` in `index.html`; `shell.css` and existing drawer wiring in `app.js`. The specification does not claim every keyboard behavior is already implemented; these are acceptance requirements for the shell QA.

### 4.5 Learner identity

- Show only a name, level, or achievement supplied by a real profile/progress source.
- If profile identity is unavailable, use a neutral avatar fallback; do not infer a name or rank from initials or hard-coded sample content.
- Achievement chips must represent a real recorded state.

---

## 5. Home Dashboard component contracts

Home is a learner command centre, not a catalogue landing page. The visual order is the order below; secondary content may continue below the fold.

### 5.1 Brand hero — proposed page component

**Purpose:** Establish hospitality-specific identity and the promise of practical business intelligence.

**Anatomy:** concise Arabic headline, one supporting sentence, restrained brand accent, one primary action, and one contextual image frame.

**Rules:**
- The copy must remain readable over the image or surface; use a separate copy region when contrast requires it.
- Do not use a generic stock office/team image.
- The hero image is editorial context, not a chart or formula. Existing dashboard-command-centre SVG remains an instructional/analytical visual and must not be silently discarded or stretched into a photo role.
- Keep the primary action visible without scrolling on standard phones where the reference layout allows it.
- Do not add a second primary action with equal visual weight.

**Proposed hook:** `.ka-home-hero`.

### 5.2 Learner identity row — proposed page component

**Anatomy:** greeting/name, current learning level if supplied by the curriculum/progress system, and an optional genuine achievement/status chip.

- Never hard-code a learner name, rank, streak, or achievement.
- If the current data model does not provide a field, omit it rather than invent it.
- Keep identity subordinate to the progress command panel.

**Proposed hook:** `.ka-learner-identity`.

### 5.3 Progress command panel and progress ring — proposed page components

**Purpose:** Summarize verified learning progress at a glance.

**Metrics:** overall lesson progress, earned XP, completed lessons, and passed assessments. Display only values returned by the existing learning engine and validated curriculum totals.

**Rules:**
- The ring is a visualization of a real percentage, not an independent source of truth.
- Provide a nearby text value and accessible label; do not communicate progress through color or arc length alone.
- Use a stable empty/loading state while the curriculum or learning engine is unavailable.
- Do not count a lesson as complete merely because it was opened or scrolled.
- Do not recompute XP or assessment status in the presentation layer.

**Existing data owner:** `KPI_LEARNING_UI.dashboardSummary()` calls `ENGINE.getDashboard()`; the learning engine owns the underlying progress and XP calculations.

**Proposed hooks:** `.ka-progress-command`, `.ka-progress-ring`, `.ka-metric-group`.

### 5.4 Continue-learning card — proposed page component

**Purpose:** Give one clear next action based on the learner's actual state.

**Required content:** topic image slot, lesson code, localized lesson title, in-progress/recommended-next status, real progress when available, and one resume action.

**Selection ownership:** keep the current `learning-ui.js` selection rule: most recently updated in-progress lesson first; otherwise the first not-yet-completed lesson in curriculum order. If all lessons are complete, preserve the current completed-state destination.

**Rules:**
- The card action must route to the selected lesson hash, not a hard-coded lesson.
- A missing progress value must not be shown as a fabricated percentage.
- The image must not push the title, progress, or resume control below the card's visible content hierarchy.
- On compact phones, crop the image within its reserved frame; do not make the whole card a background image with text over an uncontrolled crop.

**Proposed hook:** `.ka-continue-card`.

### 5.5 Quick-action tiles — proposed page component

The reference calls for fast access to Analytics, Assessments, Lab/Simulator, and KPI Calculator. Each tile must map to a real current route or mount.

- Preserve existing destinations and hashes.
- Do not show an unavailable destination as active.
- Use one consistent icon, label, and full tile hit area.
- Keep labels explicit; avoid icon-only actions.
- At narrow widths, use a grid that preserves readable labels and touch targets.

**Proposed hook:** `.ka-quick-action-grid` / `.ka-quick-action`.

### 5.6 Learning route, modules, and secondary content

Preserve the existing Learn → Calculate → Analyze → Manage learning route, module cards, and study-tools widget. Their order and visual weight may be refined, but their content and destinations remain owned by the current renderers and modules data.

---

## 6. Lesson Experience component contracts

Lesson is an applied-learning workspace. Its hierarchy must make the sequence **concept → hospitality context → interaction → result → managerial interpretation** obvious.

### 6.1 Lesson toolbar and breadcrumb

- Provide a clear return path to the parent module/chapter.
- Show chapter context without repeating the full title.
- Maintain a stable position beneath the app header.
- On phones, wrap or shorten metadata before allowing horizontal overflow.

**Existing owner:** `.lesson-toolbar` generated by `lessonView()`.

### 6.2 Lesson progress strip

- Read completed/total lesson state from the existing learning engine and verified curriculum.
- Distinguish current, completed, and not-started states.
- Provide a text equivalent and accessible progress semantics.
- Do not award XP from the progress strip or from opening the lesson.

**Existing owner:** learning engine and `KPI_LEARNING_UI`; the lesson view also mounts `#lessonProgressMount`.

### 6.3 Lesson identity and outcome

**Anatomy:** lesson code, level, available XP label where applicable, localized title, chapter context, and a concise learning outcome.

- Technical English title/term may appear alongside Arabic when it improves precision.
- Keep lesson code and numeric metadata in an isolated LTR run.
- Available XP is not earned XP. Label it clearly.
- Do not rewrite the source manuscript's instructional claims in the visual wrapper.

**Existing owner:** `lessonView(code)` in `app.js`, curriculum manifest, and Arabic label mapping.

### 6.4 Lesson hero media frame — proposed page component

**Purpose:** Contextualize the actual lesson topic before the instructional content begins.

- Use a topic-relevant hospitality image, not generic decoration.
- Keep existing instructional diagrams as separate teaching assets.
- The hero photograph uses `object-fit: cover`; a formula/process diagram uses `contain`.
- Image caption is optional and should explain context, not repeat the alt text.
- The frame must never replace the lesson title, outcome, formula, or task controls.

**Proposed hook:** `.ka-lesson-hero-media`.

### 6.5 Learning-mode navigation

The reference may visually group explanation, practical lab, professional challenge, and checklist/verification. Show only modes that exist for the current lesson.

- Do not create decorative tabs that lead nowhere.
- Preserve the Markdown source order and evidence gates.
- If a mode is not supported by a lesson, omit it or mark it as unavailable only when the product has an explicit disabled-state pattern.

### 6.6 Markdown content surface

**Existing owner:** `lessonView()` loads `lesson.sourcePath` and passes the source through `markdownHtml()`.

The visual wrapper must preserve:

- all original headings, paragraphs, lists, tables, and worked examples;
- inline formulas, formula blocks, numeric units, and technical identifiers;
- lesson visual figures and their source/alt descriptions;
- section grouping for worked cases, mistakes, challenges, assessments, checklists, labs, and insights.

The Markdown renderer is content authority. A redesign may improve spacing, reading width, table overflow, and section presentation, but must not paraphrase or drop lesson content as a shortcut.

### 6.7 Hospitality case panel — proposed page component

**Purpose:** Make the operational context and its assumptions explicit before the learner calculates.

**Anatomy:** case context, venue/department, clearly labelled input facts, units/currency, and a concise statement of the decision question.

- Keep case data distinct from the learner's answer controls.
- Label synthetic values as **Illustrative training case** (or the equivalent Arabic label).
- Never embed business figures as text inside an image.
- Keep the case's input values visible while the learner works, without requiring excessive scrolling.
- On compact phones, the case image may stack above the facts; the figures and controls remain in normal document flow.

**Proposed hook:** `.ka-hospitality-case`.

### 6.8 Interactive-lab wrapper

The wrapper provides visual grouping only. It must not own or duplicate lab state.

Preserve the existing mount IDs and modules:
- `#bm001LabMount` → BM-001 lab module;
- `#bm002LabMount` → BM-002 lab module;
- `#bm003LabMount` → BM-003 lab module;
- `#bm004LabMount` → BM-004 lab module;
- `#lessonExperienceMount` → BM-005 / `KPI_LESSON_EXPERIENCE`;
- `#percentageLabMount` → the existing percentage-lab module for its supported lessons.

BM-005 currently owns five guided tasks, case-data values, score, local task feedback, progress, insight, and reset behavior. Its `.le-*` hooks and event delegation are functional contracts. A new outer card may wrap the lab, but must not rename or remove those hooks.

The BM-005 lab is practice, not an official assessment. It does not award XP and does not replace the four lesson-completion evidence items.

### 6.9 Result and calculation-trace panel

- Present the actual result returned by the existing calculation/task logic.
- Keep the unit, denominator/basis, and precision visible where needed.
- Separate the result from interpretation.
- Preserve validation messages and incorrect-answer feedback.
- Do not add a second calculation in the view layer.

**Proposed hook:** `.ka-result-panel`.

### 6.10 Business-insight panel

Explain:
1. what the result indicates;
2. what it does not prove;
3. what operational evidence a manager should inspect next;
4. what decision is reasonable within the limits of the data.

Do not turn a ratio into an unsupported causal claim or universal benchmark. Distinguish a teaching explanation from a real venue report.

**Proposed hook:** `.ka-business-insight`.

### 6.11 Lesson evidence and completion panel

The current completion contract is four evidence items: interactive lab, professional challenge, field checklist, and learner attestation. The existing learning UI awards 90 XP once per lesson only after the required evidence is completed.

- Preserve the four evidence keys and the engine's completion rules.
- Opening, reading, scrolling, or resetting a practice lab must not award XP.
- A completed lesson shows a stable completed state and prevents duplicate XP.
- Disabled controls must remain visibly and programmatically disabled.
- Keep feedback in a status/live region.

**Existing owner:** `KPI_LEARNING_UI.mountLessonPanel()` and the learning engine.

### 6.12 Previous / next lesson navigation

- Derive previous and next lessons from the actual curriculum order.
- Preserve the first/last lesson edge cases.
- Keep labels and destination hashes accurate.
- Do not bypass an assessment or evidence gate by changing navigation presentation.

**Existing owner:** `lessonView()` in `app.js`.

---

## 7. Component state matrix

All interactive components begin from a stable default state. Only states relevant to a component should be rendered; do not invent a loading or error state for a static decorative element.

| State | Required presentation and behavior |
|---|---|
| Default | Clear hierarchy, sufficient contrast, stable dimensions, no accidental motion |
| Hover | Subtle feedback on hover-capable devices; no essential information revealed only on hover |
| Active / pressed | Immediate pressed/selected feedback; active navigation also exposes current-page semantics |
| Focus-visible | Visible high-contrast outline with offset; focus is not removed by custom styling |
| Disabled | Programmatic disabled state, muted but readable treatment, no pointer/keyboard action |
| Loading | Stable reserved geometry, clear status text or labelled skeleton; no fabricated progress value |
| Empty | Explain why data/content is absent and provide a real next action when one exists |
| Error | Concise explanation, preserve user-entered work where possible, offer a real retry/recovery action |
| Completed | Explicit success/completed label, persistent state from the engine, no duplicate reward |

### Component-specific state notes

- Header/menu: expanded and collapsed; `aria-expanded` must match.
- Drawer: open/closed; closed state is hidden and non-interactive.
- Navigation: inactive/current; current destination is exposed semantically.
- Continue-learning: in-progress, recommended-next, all-complete, and catalog-loading.
- Progress ring: zero, partial, and complete; zero is not an error.
- Lab task: unanswered, invalid input, correct, incorrect, and re-edited; feedback is announced.
- Evidence panel: incomplete, ready-to-complete, and completed; XP is awarded only by the engine.
- Image frame: loaded, intentionally unavailable fallback, and optional caption; never show a broken-image icon.

---

## 8. Responsive behavior

These are validation bands, not a request to consolidate all existing media queries in one pass.

| Width | Layout contract |
|---|---|
| 360–389px | Compact phone: one-column reading flow, compact header, no horizontal page scroll, essential actions visible |
| 390–429px | Standard phone: reference-screen hierarchy, comfortable card padding, readable metric grouping |
| 430–767px | Large phone: use additional width for metric grouping without shrinking text |
| 768–1023px | Tablet: balanced content width; navigation may transition according to the existing shell behavior |
| 1024px+ | Desktop: full navigation and wider content grid; reading surfaces retain a controlled maximum width |

### Image and content relationship

- Images occupy a reserved frame with a fixed aspect ratio; they do not change the order of text and controls.
- On compact phones, image may stack before the associated copy, but the task title, progress, and action remain close together.
- Never position essential text over a photograph unless a verified contrast layer guarantees readability.
- Lesson tables may scroll within their own wrapper; the page itself must not overflow horizontally.
- The mobile bottom navigation must not cover the final control or previous/next navigation; reserve bottom clearance using the shell safe-area token.

---

## 9. Accessibility and bidirectional text

### Semantic and keyboard requirements

- Use landmarks for header, navigation, main content, and complementary panels.
- Keep a logical heading hierarchy; do not use headings solely for their visual size.
- All icon controls have accessible names. Decorative icons are hidden from assistive technology.
- Every form control has a programmatically associated label and clear validation feedback.
- Progress uses `role="progressbar"` with correct min/max/current values and a text equivalent.
- Dynamic task feedback uses a status/live region without repeatedly announcing the entire lab.
- Minimum interactive hit area target: 44×44 CSS pixels.
- Focus order follows visual and reading order. Drawer open/close behavior must preserve focus.
- Honor `prefers-reduced-motion`; motion is never required to understand state.

### RTL and LTR isolation

The document's Arabic RTL direction remains the outer reading context. Use logical CSS properties and do not manually reverse strings.

Isolate the following as LTR runs where appropriate:
- formulas and equations;
- percentages and numeric results;
- currency amounts and currency codes;
- dates and times;
- lesson/KPI identifiers;
- URLs, email addresses, and technical units.

Use semantic `dir="ltr"` or `<bdi>` boundaries for mixed-direction fragments, and preserve punctuation with the fragment it belongs to. Test Arabic text adjacent to English acronyms, parentheses, decimal values, slashes, and currency codes.

A component must not force the whole card or paragraph to LTR merely because it contains one formula.

---

## 10. Educational image-slot contracts

Image slots are content components with a teaching purpose, not decoration. Every slot must have a stable key, subject, image brief, ratio, crop, responsive behavior, alt text, optional caption, provenance, and designed fallback.

| Stable slot key | Ratio | Subject / image brief | Fit and responsive contract | Alt / caption contract |
|---|---:|---|---|---|
| `home.hero.hospitality` | 16:9 | Editorial premium hotel/restaurant operation: composed service environment, credible staff workflow, warm practical lighting, navy/gold visual character; no embedded text or invented metrics | Photography uses cover with a controlled focal point; wide frame on desktop, compact full-width frame on phone; copy remains separate and readable | Arabic alt describes the operational scene and its relevance; short caption optional |
| `home.continue.topic` | 16:9 | Topic-specific visual for the actual resume lesson: e.g. cost sheet/invoice, beverage station, stock count, service operation; subject must follow the selected lesson | Crop stays inside the card; title, lesson code, progress, and resume action remain visible and in normal flow | Alt names the topic represented; caption may identify the learning context |
| `lesson.hero.topic` | 16:9 | Hospitality context tied to the current lesson (restaurant, bar, kitchen, rooms, front office, or finance workflow) | Cover crop; separate from existing instructional diagrams; on compact phone it may stack above the lesson content but not between a formula and its controls | Topic-specific Arabic alt; optional contextual caption |
| `lesson.case.hospitality` | 4:3 | Restaurant/hotel/bar operational case showing the relevant department or process; synthetic case is explicitly educational | Photo may stack above the case facts on phone; facts, units, inputs, and task controls stay visible and are not baked into the image | Alt describes the operational scene; caption labels an illustrative scenario where relevant |
| `lesson.diagram.topic` | 4:3 or 1:1 | Formula flow, inventory process, service sequence, KPI relationship, or instructional diagram | Use contain, preserve the entire diagram, and allow a bounded scroll/zoom affordance only if implemented accessibly | Alt explains the diagram's teaching purpose; caption can define scope or source |

### Fallback and provenance

- If no approved asset exists, render an intentional navy/blue placeholder with a topic label and simple relevant icon. Never use a broken URL or unrelated stock image.
- Store source/licensing/provenance metadata with each real asset.
- Do not put text, formulas, financial figures, KPI values, or fake dashboard data inside generated photography.
- Do not let an image occupy the whole card background when it would reduce text contrast.
- Existing SVG diagrams remain instructional assets; do not replace them with photographs or distort their aspect ratio.
- Verify crops at 360, 390, and 430px before accepting Home/Lesson imagery.

---

## 11. Runtime ownership and preservation map

The presentation layer must consume these existing owners; it must not duplicate their business logic.

| Concern | Current source owner | Protected contract |
|---|---|---|
| App shell and navigation markup | `index.html` | Existing route hashes, IDs, ARIA hooks, and nav destinations |
| Shell behavior | `app.js` and `shell.css` | Menu/drawer state and route selection |
| Home composition | `dashboard()` in `app.js` | Existing Home sections, route links, and study-tools mount |
| Learner summary and resume candidate | `KPI_LEARNING_UI.dashboardSummary()` in `learning-ui.js` | Engine-derived metrics and most-recent in-progress / first incomplete selection |
| Learner state and XP | `learning-engine.js` | Progress schema, totals, XP transactions, completion and assessment rules |
| Curriculum and module content | `data/*.json` manifests | Lesson/module identifiers, order, titles, and source paths |
| Lesson source and Markdown composition | `lessonView()` and `markdownHtml()` in `app.js` | Original Markdown, tables, formulas, figures, and section content |
| BM-001 to BM-004 | Their dedicated lab modules and mount IDs | Existing calculations, inputs, feedback, and task behavior |
| BM-005 practice lab | `lesson-experience.js` and `.le-*` hooks | Five tasks, task feedback, progress, insight, reset; practice does not award XP |
| Percentage labs | `percentage-labs.js` and `#percentageLabMount` | Existing supported lesson mounts and validation |
| Lesson evidence / completion | `KPI_LEARNING_UI.mountLessonPanel()` and learning engine | Four evidence keys; 90 XP once per lesson after required evidence |
| Study tools | `study-tools.js` | Existing dashboard widget and lesson mount behavior |

### Required implementation discipline

- New components may receive already-computed data and callbacks, but may not become a second learning engine.
- Keep existing IDs and `data-*` hooks used by tests and lab modules.
- If a new wrapper is required, place it around the existing mount rather than replacing the mount node.
- Preserve the existing route hashes and current module/lesson selection behavior.
- Any later DOM refactor must include regression tests for all listed mount points and a real before/after browser capture.

---

## 12. Acceptance checklist for future implementation

A component is not accepted merely because it resembles the reference.

### Visual
- [ ] Hierarchy matches the approved Home or Lesson reference.
- [ ] Canonical tokens are used; no new unowned global palette.
- [ ] Spacing, radius, elevation, and typography are consistent.
- [ ] Text and controls remain readable over every surface.
- [ ] Images use the specified frame, crop, alt text, caption, provenance, and fallback.

### Functional
- [ ] Every visible action has a real route or behavior.
- [ ] Home metrics and resume lesson come from existing runtime owners.
- [ ] Lesson Markdown, formulas, tables, figures, and labs remain intact.
- [ ] XP, evidence, assessment, and progress behavior are unchanged.
- [ ] Loading, empty, error, disabled, and completed states are honest and stable.

### Responsive and accessible
- [ ] 360, 390, 430, tablet, and desktop layouts are checked.
- [ ] No horizontal page overflow or obscured action.
- [ ] Touch targets are at least 44×44px where applicable.
- [ ] Keyboard focus and drawer behavior are verified.
- [ ] Arabic/English mixed-direction cases are verified.
- [ ] Reduced-motion and status announcements work.

### Approval boundary
- [ ] Home Dashboard screenshot reviewed by the owner.
- [ ] Lesson Experience screenshot reviewed by the owner.
- [ ] No fonts are uploaded or activated before both approvals.
- [ ] No Phase 2 work begins before the relevant phase gate is explicitly closed.

---

## 13. Next sequence

1. Re-run the Phase 1 exit gate against this specification and the latest CI/browser evidence.
2. If the gate passes, begin Mission 02 with one isolated Home Dashboard task: establish the page-owned presentation shell while preserving the existing Home renderer and data source.
3. Reconstruct and review Home before beginning Lesson implementation.
4. Keep the PR draft and all changes on the isolated feature branch. Do not merge, deploy, or modify `main` / `gh-pages`.

**This task adds a component contract only. It does not close Phase 1, approve either screen, or authorize production UI changes.**
