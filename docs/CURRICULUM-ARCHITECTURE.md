# KPI Academy — Hospitality Accounting & Restaurant KPIs Curriculum Blueprint

**Status:** Proposed academic architecture; not yet published as learner-facing curriculum  
**Date:** 2026-11-20  
**Product boundary:** KPI Academy only  
**Technology boundary:** Existing HTML, CSS, Vanilla JavaScript and JSON application

## Provenance and design rule

This is an original KPI Academy curriculum blueprint, not a transcription of Notion lesson pages. It is derived from the six approved Hospitality Accounting scope areas in `data/hospitality-accounting-scope.json`, the three-module MVP structure in `data/modules.json`, and the 15 definitions in `data/kpi-registry.json`.

The scope file explicitly says it defines subject areas, not a detailed chapter or lesson sequence. Accordingly, this document proposes a teaching structure; it does not claim that the proposed chapters, lessons, assessments, XP, or completion rules were already approved in the source material.

No lessons have been added to the live module catalogue. Hospitality Accounting and Restaurant KPIs remain planned modules until their curriculum content, question banks, and technical integration are ready.

## Academic sequence

**Business Mathematics → Hospitality Accounting → Restaurant KPIs**

- **Business Mathematics** provides the numerical foundation: percentages, ratios, weighted averages, equations, variance, units, and data interpretation.
- **Hospitality Accounting** develops the ability to read the financial language of a hospitality operation: revenue, expenses, COGS, gross profit, and the P&L.
- **Restaurant KPIs** applies that language through the exact 15 indicators already defined in the KPI registry.

This is a recommended learning sequence, not a new Career Path or a role-based training programme.

---

# Module 02 — Hospitality Accounting

## Module purpose

Build the learner's ability to read and explain basic hospitality financial information, trace the relationship between revenue and expenses, understand COGS and gross profit, and interpret a Profit & Loss statement without confusing accounting values with operational assumptions.

## Approved subject boundary

The proposed structure stays within the six existing scope areas:

1. Financial Statements
2. Revenue
3. Expenses
4. Cost of Goods Sold (COGS)
5. Gross Profit
6. Profit & Loss (P&L) Literacy

Net Profit appears only as a P&L line and interpretation outcome already named in `data/modules.json`. The module must not introduce tax advice, statutory reporting rules, audit certification, advanced double-entry bookkeeping, or jurisdiction-specific accounting standards without a separately approved scope.

## Proposed structure — 6 chapters / 24 lessons

| Chapter | Lesson | Proposed title | Learner outcome |
|---|---|---|---|
| 1. Financial Statement Foundations | HA-001 | Why Hospitality Businesses Use Financial Statements | Explain what financial statements communicate and why management reads them |
|  | HA-002 | Reporting Period, Outlet Scope and Currency | Check period, outlet, currency, and comparable scope before reading figures |
|  | HA-003 | Financial Statement vs Operational Report | Distinguish a financial statement from POS, stock, payroll, and operating reports |
|  | HA-004 | How Revenue, Expenses and Profit Connect | Map the basic relationship between the approved statement concepts |
| 2. Revenue | HA-005 | Understanding Hospitality Revenue | Identify revenue within an outlet or operating context |
|  | HA-006 | Gross Sales, Discounts, Refunds and Net Sales | Explain the relationship using the definitions supplied by a report |
|  | HA-007 | Revenue by Outlet and Business Area | Read and compare restaurant, bar, lounge, and other outlet revenue without double counting |
|  | HA-008 | Revenue Reconciliation and Data Quality | Reconcile sales totals to their source records and explain discrepancies |
| 3. Expenses | HA-009 | Understanding Hospitality Expenses | Recognise expenses and explain their effect on financial performance |
|  | HA-010 | Cost of Sales vs Operating Expenses | Distinguish COGS from other expense lines in a P&L |
|  | HA-011 | Fixed and Variable Expense Behaviour | Interpret cost behaviour as a planning concept while stating its assumptions |
|  | HA-012 | Expense Period, Scope and Supporting Evidence | Check that expense figures belong to the same period and business scope |
| 4. Cost of Goods Sold | HA-013 | What COGS Represents | Explain COGS and distinguish it from purchases alone |
|  | HA-014 | Opening Inventory, Purchases and Closing Inventory | Apply the Academy's COGS formula consistently |
|  | HA-015 | Inventory Valuation, Transfers and Adjustments | Identify why valuation basis, transfers, and adjustments must be documented |
|  | HA-016 | COGS Calculation and Reconciliation | Calculate COGS and reconcile the inputs to inventory and purchase records |
| 5. Gross Profit | HA-017 | Understanding Gross Profit | Calculate Net Sales minus COGS |
|  | HA-018 | Gross Profit vs Gross Profit Margin | Distinguish a currency result from a percentage measure |
|  | HA-019 | How Revenue and COGS Change Gross Profit | Explain how revenue, quantity, price, and COGS can affect the result |
|  | HA-020 | Reading Gross Profit in Context | Interpret the figure without assuming it represents final business profit |
| 6. P&L Literacy | HA-021 | Anatomy of a Hospitality P&L | Identify the main statement sections and their relationship |
|  | HA-022 | Reading Revenue and Expense Lines | Read line items and check the scope and definitions behind them |
|  | HA-023 | Gross Profit, Operating Result and Net Profit | Interpret reported profit lines without inventing missing accounting treatments |
|  | HA-024 | Monthly P&L Review and Management Commentary | Prepare a short, evidence-based explanation of a sample P&L |

## Module learning outcomes

On completion, a learner should be able to:

- Explain the purpose and limitations of basic financial statements.
- Read revenue and expense lines with a consistent period and outlet scope.
- Distinguish gross sales, discounts, refunds, and net sales when the report supplies those definitions.
- Calculate COGS using opening inventory, purchases, and closing inventory.
- Explain gross profit and distinguish it from gross profit margin and net profit.
- Read a basic P&L and identify missing, inconsistent, or non-comparable values.
- Write a short management commentary that separates known facts from assumptions.

## Concept dependencies

`BM-001…BM-032` → HA-001…HA-024.

Within the module:

- Revenue and expense literacy precede COGS and gross profit interpretation.
- COGS depends on consistent units, periods, and inventory valuation.
- Gross Profit depends on a correctly defined Net Sales base and COGS.
- P&L reading depends on all previous chapters.

## Assessment design proposal

- One chapter assessment after each of the six chapters.
- One integrated P&L case as the final practical assessment.
- Questions should assess both numerical accuracy and the ability to interpret scope, period, definitions, and missing data.
- No external accreditation claim.
- No new XP or certificate rule is authorised by this blueprint.

---

# Module 03 — Restaurant KPIs

## Module purpose

Teach learners to calculate, validate, interpret, and communicate the exact 15 Restaurant KPIs already defined in `data/kpi-registry.json`. The registry remains the single formula authority. A lesson may explain a formula and its assumptions but must not silently replace the registry definition.

## Approved KPI inventory

The curriculum must cover these 15 IDs and formulas without changing them:

| KPI ID | Registry KPI | Authoritative calculation |
|---|---|---|
| `food-cost` | Food Cost % | Food COGS ÷ Food Net Sales × 100 |
| `beverage-cost` | Beverage Cost % | Beverage COGS ÷ Beverage Net Sales × 100 |
| `cogs` | COGS | Opening Inventory + Purchases − Closing Inventory |
| `gross-profit` | Gross Profit | Net Sales − COGS |
| `gross-profit-margin` | Gross Profit Margin % | Gross Profit ÷ Net Sales × 100 |
| `labor-cost` | Labor Cost % | Included Labor Cost ÷ Net Sales × 100 |
| `prime-cost` | Prime Cost | COGS + Included Labor Cost |
| `prime-cost-percent` | Prime Cost % | Prime Cost ÷ Net Sales × 100 |
| `average-check` | Average Check | Net Sales ÷ Number of Checks |
| `sales-mix` | Sales Mix % | Unit Mix or Revenue Mix; the mode must be explicitly selected |
| `contribution-margin` | Contribution Margin | Selling Price − Variable Cost |
| `break-even-sales` | Break-even Sales | Fixed Costs ÷ Contribution Margin Ratio |
| `inventory-turnover` | Inventory Turnover | Period COGS ÷ Average Inventory |
| `waste` | Waste % | Recorded Waste Cost ÷ Food & Beverage COGS × 100 |
| `revpash` | RevPASH | Net F&B Revenue ÷ Available Seat Hours |

The registry's assumptions are part of the syllabus. In particular:
- Labor Cost must follow the outlet's documented definition of included labor.
- Sales Mix must distinguish Unit Mix from Revenue Mix.
- Waste % uses the KPI Academy internal denominator; it must not be presented as a universal industry definition.
- RevPASH must account for seats and operating time that were unavailable.
- Inventory Turnover must use a consistent valuation basis and reporting period.
- Break-even Sales requires a positive, non-zero contribution-margin ratio.

## Proposed structure — 6 chapters / 24 lessons

| Chapter | Lesson | Proposed title | KPI coverage / learner outcome |
|---|---|---|---|
| 1. KPI Literacy and Data Discipline | RK-001 | What a KPI Measures | Explain the purpose and limits of a performance indicator |
|  | RK-002 | Period, Outlet Scope and Denominator | Match numerator, denominator, scope, and reporting period |
|  | RK-003 | Source Data and Validation | Trace POS, inventory, purchasing, payroll, and seat-capacity inputs |
|  | RK-004 | From Calculation to Interpretation | Explain a KPI with its unit, base, period, assumptions, and limits |
| 2. Sales and Guest Performance | RK-005 | Average Check | Calculate Net Sales ÷ Number of Checks and distinguish Checks from Covers |
|  | RK-006 | Sales Mix — Unit Mix | Calculate an item's unit share of total units |
|  | RK-007 | Sales Mix — Revenue Mix | Calculate an item's Net Sales share of total Net Sales |
|  | RK-008 | Comparing Sales Performance | Compare outlets and periods without mixing definitions or denominators |
| 3. Cost of Goods and Cost Control | RK-009 | Cost of Goods Sold | Calculate COGS from opening inventory, purchases, and closing inventory |
|  | RK-010 | Food Cost % | Calculate Food Cost using Food COGS and Food Net Sales |
|  | RK-011 | Beverage Cost % | Calculate Beverage Cost using Beverage COGS and Beverage Net Sales |
|  | RK-012 | Waste % | Apply the Academy denominator and explain its internal-definition limitation |
| 4. Profitability and Break-even | RK-013 | Gross Profit | Calculate Net Sales minus COGS |
|  | RK-014 | Gross Profit Margin % | Express gross profit as a share of Net Sales |
|  | RK-015 | Contribution Margin | Calculate Selling Price minus Variable Cost per unit |
|  | RK-016 | Break-even Sales | Calculate the sales level required to cover Fixed Costs under the registry assumptions |
| 5. Labor and Prime Cost | RK-017 | Labor Cost % | Calculate included labor cost against the matching Net Sales base |
|  | RK-018 | Defining Included Labor | Identify which wages, overtime, benefits, and employer costs the outlet policy includes |
|  | RK-019 | Prime Cost | Combine COGS and included labor using consistent definitions |
|  | RK-020 | Prime Cost % | Calculate Prime Cost as a percentage of Net Sales and interpret its components |
| 6. Inventory and Seat Productivity | RK-021 | Average Inventory | Calculate the opening/closing average and recognise when a documented daily/monthly average is supplied |
|  | RK-022 | Inventory Turnover | Calculate period COGS ÷ Average Inventory and label the period |
|  | RK-023 | Available Seat Hours | Calculate available seats × operating hours, adjusting unavailable seats/time |
|  | RK-024 | RevPASH | Calculate Net F&B Revenue ÷ Available Seat Hours and interpret the capacity basis |

## Module learning outcomes

On completion, a learner should be able to:

- Select the correct KPI and use its exact registry formula.
- Check that input values share the same reporting period, outlet scope, and currency.
- Identify denominator errors and distinguish missing data from zero.
- Calculate all 15 registered KPIs using traceable input data.
- Explain assumptions and validation limits for each result.
- Interpret a KPI alongside related measures rather than treating one number as a complete diagnosis.
- Recommend an evidence-based next check or action without inventing an external benchmark.

## Concept dependencies

`Business Mathematics` → basic data validation, percentages, equations, ratios, averages, units, and variance.

`Hospitality Accounting` → revenue, expenses, COGS, gross profit, and P&L vocabulary.

Then:

- Food Cost and Beverage Cost depend on COGS and the matching Net Sales base.
- Gross Profit Margin depends on Gross Profit and Net Sales.
- Prime Cost depends on COGS and the documented Included Labor Cost.
- Break-even Sales depends on Contribution Margin and a valid Contribution Margin Ratio.
- Inventory Turnover depends on Average Inventory.
- RevPASH depends on Available Seat Hours.
- Sales Mix depends on a clearly selected Unit or Revenue mode.

## Assessment design proposal

- One assessment after each of the six chapters.
- One integrated outlet-performance case covering all 15 registered KPIs.
- Include both calculation questions and interpretation tasks that ask for source, scope, denominator, period, assumptions, and decision limits.
- Keep the existing KPI engine as the calculation authority; tests must compare lessons, registry, and engine results.
- No fixed “good KPI” benchmarks unless the source, period, operating model, and context are explicitly supplied.
- No new XP, credential, or completion rule is authorised by this blueprint.

---

## Technical integration gates

The current learning engine is deliberately specialised around Business Mathematics:
- 32 fixed lesson codes (`BM-001…BM-032`)
- eight chapter-assessment IDs plus `bm-final-practical`
- a fixed 90-XP lesson award and four evidence gates
- a fixed course-completion and certificate-eligibility check

Therefore, the two proposed curricula must **not** be inserted by copying BM codes or by changing those fixed rules. Before either module becomes live, the application needs a backward-compatible multi-module catalogue design that:

1. Keeps the existing Business Mathematics storage key, schema, progress, XP ledger, assessment history, and backup restore behavior working unchanged.
2. Adds module-qualified lesson and assessment identifiers for new content.
3. Separates per-module completion requirements from the existing BM completion rule.
4. Treats new-module XP and certificate rules as explicit product decisions, not assumptions made by the curriculum author.
5. Validates every lesson, assessment, KPI formula reference, and source file before the module is published.
6. Supports import of old BM backups without requiring the new modules to exist in the backup.

## Publication checklist

- [ ] Review and approve chapter order and lesson objectives.
- [ ] Map each lesson to its approved scope item or registry KPI.
- [ ] Author original lesson manuscripts with learning objectives, worked cases, common errors, practical exercises, and evidence criteria.
- [ ] Independently verify every worked calculation and answer key.
- [ ] Prepare chapter assessments and integrated practical cases.
- [ ] Add lesson and assessment integrity tests.
- [ ] Implement and test backward-compatible multi-module learning support.
- [ ] Test old backup import/export and ensure no BM progress or XP is lost.
- [ ] Complete RTL/LTR, keyboard, screen-reader, mobile, and formula-rendering checks.
- [ ] Publish only after the content and application gates both pass.

**Current publication state:** Architecture only. No Hospitality Accounting or Restaurant KPIs learner-facing lessons or assessments are represented as complete.
