# KPI Academy — Visual Implementation Map

**Branch:** `implementation/kpi-academy-mvp`  
**Date:** 2026-11-20

## Current application surfaces observed

- Main dashboard: `dashboard()` in `assets/js/app.js`.
- Module and chapter navigation: `modulesView()` and `moduleDetail()`.
- Business Mathematics lesson reader: `lessonView(code)` loads the original Markdown via each lesson's `sourcePath`, then groups sections by pedagogical purpose, adds a section index, highlights standalone formulas, and preserves previous/next navigation.
- BM-005 interactive learning lab is mounted by `KPI_LESSON_EXPERIENCE`.
- KPI Calculator: existing deterministic calculator, with the 15-entry registry and calculation behavior preserved.
- Analytics Lab: functional period comparison using an explicitly synthetic educational dataset and the existing KPI Engine; not connected to live restaurant data.
- Management Simulator: reusable five-stage shell; approved scenario manuscripts are still a content dependency.

## Resource placement map

| Resource | Where | When | Why | Status |
|---|---|---|---|---|
| Food Cost calculation | Business Mathematics → BM-005, after Hospitality Applications and before Worked Case | Reinforce Part ÷ Whole × 100 using the lesson's own 9,000 / 30,000 = 30% example | Make denominator choice visible before interpretation | Integrated; browser smoke and screenshot reviewed |
| Prime Cost composition | Restaurant KPIs → Prime Cost concept | Before worked example | Show Food COGS + Beverage COGS + Labor Cost | Registered; placement pending |
| Gross Profit flow | Hospitality Accounting → Gross Profit | During concept explanation | Clarify Net Sales − COGS | Registered; placement pending |
| Break-even concept | Restaurant KPIs → Break-even Sales | Before or during worked example | Distinguish loss, break-even, and profit zones | Registered; placement pending |
| Inventory Turnover flow | Restaurant KPIs → Inventory Turnover | Before calculation exercise | Explain COGS / Average Inventory and period matching | Registered; placement pending |
| RevPASH visual | Restaurant KPIs → RevPASH | Before seat-hour example | Clarify available seat hours | Registered; placement pending |

## Responsive verification status

- Playwright viewport checks cover 360, 390, 430, 768, 1024, and 1366px for dashboard, module discovery, Restaurant KPI registry, lesson reader, calculator, Analytics Lab, and simulator.
- Visual comparison artifacts include the pre-redesign baseline and the redesigned desktop screens, plus redesigned responsive captures across 360–1024px.
- Full keyboard, screen-reader, color-contrast, and exhaustive RTL/LTR accessibility acceptance remains open.

## Dashboard implementation status

- The learner dashboard now renders an eight-row chapter completion chart from `KPI_LEARNING_ENGINE.getLessonProgress()` and the official Business Mathematics curriculum.
- This is learner progress, not restaurant trading performance. It uses actual locally stored lesson states and does not modify XP, assessment, or completion rules.
- Executive, Restaurant Performance, Cost Control, and Inventory dashboards remain specifications only because no operational restaurant dataset or live data feed exists.

## Analytics Lab implementation status

- Three synthetic periods are explicitly disclosed as educational sample data.
- Gross Profit, Gross Profit Margin, Labor Cost %, Prime Cost, and Prime Cost % are calculated through KPIEngine.
- Metric selection updates a horizontal comparison chart and its formula/interpretation/limitations. A source table displays the calculated values.
- No actual restaurant performance or external benchmarks are represented.

## Management Simulator implementation status

- A reusable five-stage interface exists: Business Context, Available Evidence, Management Decision, Possible Consequences, Reflection & Feedback.
- The approved MVP scope mentions three scenarios, but the controlling sources reviewed do not contain complete approved scenario manuscripts. The interface therefore displays a clear content dependency and awards no XP.

## Dashboard specifications — planned, not implemented

| Dashboard | Audience | KPIs | Recommended visualization | Decision supported |
|---|---|---|---|---|
| Executive | Owner / General Manager | Revenue, Gross Profit, Gross Profit Margin, Food Cost %, Beverage Cost %, Labor Cost %, Prime Cost %, Average Check | KPI summary, revenue trend, cost composition, period comparison | Identify margin and cost pressure |
| Restaurant Performance | Restaurant Manager | Daily sales, Food vs Beverage Sales, Sales Mix, Average Check, Contribution Margin, Break-even | Line trend, stacked bars, mix chart, contribution comparison | Adjust menu, staffing and sales focus |
| Cost Control | F&B Controller / Chef / Manager | Food COGS, Beverage COGS, Labor Cost, Prime Cost, Waste % | Cost trend, composition bars, variance table | Investigate cost leakage |
| Inventory | Storekeeper / Manager | Inventory movement, turnover, purchasing, consumption, variance, waste | Stock movement, turnover trend, variance bars | Reorder, investigate variance and reduce waste |

All charts must be rendered from application data and official KPI Registry definitions. This document is a specification, not evidence that the dashboard screens are implemented.

## Placement rules

1. Insert a visual only after the lesson's official definition and before independent practice.
2. Add a concise caption, learning objective, alt text, and a realistic hospitality example.
3. Never infer an exact lesson ID from a topic label; verify it against curriculum JSON first.
4. Keep formulas consistent with the KPI Registry. In particular, Waste % uses the approved internal denominator, Sales Mix must identify Unit Mix or Revenue Mix, and RevPASH uses available seat hours.
5. Keep functional charts data-driven; SVG diagrams are explanatory illustrations only.


## Visual integration record

- BM-005 Food Cost diagram: integrated using the exact values in section 2 of the lesson (9,000 MAD / 30,000 MAD = 30%). The diagram is positioned before the worked case and includes an Arabic learning objective and descriptive alt text. Browser smoke and desktop/mobile screenshot review completed.
- Other five diagrams remain registered but are not inserted: exact lesson placements in Hospitality Accounting and Restaurant KPIs are not supported by an approved detailed curriculum yet.
- Photography: no external photo has been added. Repository file actions available in this workflow support text assets; no photo binary was downloaded or verified, so none is represented as licensed/acquired.
