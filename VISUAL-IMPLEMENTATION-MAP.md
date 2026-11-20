# KPI Academy — Visual Implementation Map

**Branch:** `implementation/kpi-academy-mvp`  
**Date:** 2026-11-20

## Current application surfaces observed

- Main dashboard: `dashboard()` in `assets/js/app.js`.
- Module and chapter navigation: `modulesView()` and `moduleDetail()`.
- Business Mathematics lesson reader: `lessonView(code)` loads lesson Markdown via each lesson's `sourcePath`.
- BM-005 interactive learning lab is mounted by `KPI_LESSON_EXPERIENCE`.
- Analytics, simulator, and some KPI destinations remain placeholders; do not claim dashboard visualizations are live until data-driven charts are implemented.

## Resource placement map

| Resource | Where | When | Why | Status |
|---|---|---|---|---|
| Food Cost calculation | Business Mathematics → BM-005, after Hospitality Applications and before Worked Case | Reinforce Part ÷ Whole × 100 using the lesson's own 9,000 / 30,000 = 30% example | Make denominator choice visible before interpretation | Integrated; CI/browser verification pending |
| Prime Cost composition | Restaurant KPIs → Prime Cost concept | Before worked example | Show Food COGS + Beverage COGS + Labor Cost | Registered; placement pending |
| Gross Profit flow | Hospitality Accounting → Gross Profit | During concept explanation | Clarify Net Sales − COGS | Registered; placement pending |
| Break-even concept | Restaurant KPIs → Break-even Sales | Before or during worked example | Distinguish loss, break-even, and profit zones | Registered; placement pending |
| Inventory Turnover flow | Restaurant KPIs → Inventory Turnover | Before calculation exercise | Explain COGS / Average Inventory and period matching | Registered; placement pending |
| RevPASH visual | Restaurant KPIs → RevPASH | Before seat-hour example | Clarify available seat hours | Registered; placement pending |

## Dashboard implementation status

- The learner dashboard now renders an eight-row chapter completion chart from `KPI_LEARNING_ENGINE.getLessonProgress()` and the official Business Mathematics curriculum.
- This is learner progress, not restaurant trading performance. It uses actual locally stored lesson states and does not modify XP, assessment, or completion rules.
- Executive, Restaurant Performance, Cost Control, and Inventory dashboards remain specifications only because no operational restaurant dataset or live data feed exists.

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

- BM-005 Food Cost diagram: integrated using the exact values in section 2 of the lesson (9,000 MAD / 30,000 MAD = 30%). The diagram is positioned before the worked case and includes an Arabic learning objective and descriptive alt text.
- Other five diagrams remain registered but are not inserted: exact lesson placements in Hospitality Accounting and Restaurant KPIs are not supported by an approved detailed curriculum yet.
- Photography: no external photo has been added. Repository file actions available in this workflow support text assets; no photo binary was downloaded or verified, so none is represented as licensed/acquired.
