# Business Mathematics — Academic Audit Record

**Repository:** `abdenourkp-creator/kpi-academy`  
**Branch audited:** `implementation/kpi-academy-mvp`  
**Baseline commit:** `0388f7d1114e0da420eac64f7fe33f89beea55f5`  
**Audit date:** 2026-11-20  
**Scope:** Business Mathematics curriculum, all lesson manuscripts, eight chapter assessments, final practical examination, and the assessment-catalog validation test.

## Executive result

The audit reviewed all 32 lesson files (BM-001 through BM-032), the eight-chapter curriculum map, all 40 chapter-assessment questions, and all 10 integrated final-examination questions.

The course has a coherent foundation-to-application sequence. It moves from numerical literacy through percentages, ratios, averages, equations, variance, units/productivity, and business interpretation. The lesson manuscripts consistently use hospitality examples and repeatedly teach learners to identify the denominator, period, outlet scope, unit, data source, and assumptions before interpreting a number.

Three precision issues were identified and corrected in this pass:

1. **Duplicate distractor — Chapter 2, question ch02-q05.** Options B and D both displayed `−15 pp`, although the correct answer is `−6 pp`. Option D is now `+6 pp`, a distinct sign-error distractor.
2. **Ambiguous financial base — final-q01.** The prompt said “Sales” while asking the learner to calculate Gross Profit. It now says “Net Sales”, matching the course formula `Gross Profit = Net Sales − COGS`.
3. **Ambiguous table-audit instruction — BM-030.** The POS exercise includes a deliberately inconsistent Coffee row (`40 × 15` does not equal the displayed `500`) and a reported total. The task now explicitly instructs learners to recalculate each row, sum their recalculated values, identify the inconsistent row, and then compare the recalculated sum with Report Total.

The assessment-catalog test now rejects duplicate option labels, not merely duplicate option IDs. This closes the validation gap that allowed the first issue to pass structural checks.

## Curriculum coverage review

| Chapter | Lessons | Main coverage | Academic observation |
|---|---|---|---|
| 1. Numerical Foundations | BM-001–004 | Number types, place value, operations, order of operations, rounding, truncation, units and accuracy | Strong foundational sequence; useful emphasis on source validation and dimensional consistency |
| 2. Percentages & Percentage Change | BM-005–009 | Part/whole, percentage calculation, original value, sequential change, percentage points | Strong denominator discipline; assessment distractor duplication corrected |
| 3. Ratios & Proportions | BM-010–013 | Ratios, simplification, direct/inverse proportion, resource allocation | Good distinction between mathematical proportionality and operational assumptions |
| 4. Averages & Weighted Averages | BM-014–017 | Mean, median, weighted average, Average Check, Covers, spread and segmentation | Good use of hospitality performance data; reinforces that one average can hide distribution |
| 5. Business Equations | BM-018–021 | Variables, equations, formula rearrangement, reconstruction of missing values | Good transfer from arithmetic to business formulas; appropriate warnings about unknowable values |
| 6. Variance Analysis | BM-022–025 | Reference comparisons, signed/magnitude variance, variance %, favorable/unfavorable, flexible budget | Strong treatment of context; avoids interpreting positive/negative signs as inherently good or bad |
| 7. Units, Rates & Productivity | BM-026–029 | Metric conversions, rates, labor hours, productivity, capacity and utilization | Good use of unit analysis and seat-hours; clock hours are distinguished from labor hours |
| 8. Tables, Data & Business Interpretation | BM-030–032 | Table validation, trends, charts, decision chain and executive interpretation | Appropriate capstone; BM-030 instructions clarified to make the data-check sequence explicit |

## Assessment review

- Eight chapter assessments, five questions each: **40 questions**.
- Integrated final practical examination: **10 questions**.
- Total: **50 questions across nine assessments**.
- Pass threshold: **80%**.
- Retakes: **unlimited**.
- Assessment XP: **none**, consistent with the existing product decision and learning engine.
- Every question has four option IDs, one keyed correct option, and an explanation.
- Chapter questions identify a source lesson; integrated final questions are intentionally not labelled as copied lesson questions.

The 50 keyed answers were checked against the stated lesson concepts and their calculations. The duplicated label in ch02-q05 was the structural defect found in the single-answer option set. The final-q01 terminology correction improves financial-definition precision without changing its arithmetic or answer key.

## Learning and product constraints preserved

This audit did not change the learning engine, local storage, backup format, lesson codes, XP policy, pass threshold, retake policy, or assessment-attempt history.

The following remain unchanged:

- Storage key: `kpi-academy.learning.v1`
- Schema version: `1`
- Lesson completion XP: `90` per eligible lesson, once only
- Four evidence gates for lesson completion
- Eight chapter assessments plus `bm-final-practical`
- Assessment threshold: `80%`
- Assessment XP: `0`

## Remaining academic work

1. Perform a second-pass independent recalculation of all worked examples and learner challenge datasets, including edge cases such as rounding policy, zero denominators, unavailable seat-hours, and mixed outlet scopes.
2. Add teacher-side marking rubrics for the open-ended professional challenges; the current answer key is strongest on selected-response questions.
3. Add source-to-lesson traceability for each concept and each final-assessment competency.
4. Continue a separate accessibility audit for mathematical notation, mixed Arabic/English direction, keyboard use, and screen-reader interpretation.
5. Do not present this internal review as external accreditation or formal third-party validation.

## Changes in this audit pass

- Corrected the duplicate distractor in `data/assessments/business-mathematics.json`.
- Clarified Net Sales in the integrated final examination prompt.
- Clarified the recalculation sequence in `content/business-mathematics/lessons/BM-030.md`.
- Strengthened `tests/assessment-catalog.test.js` to assert non-empty and unique option labels.

The CI workflow is the authoritative execution check after this commit. No local or remote test result is claimed by this document.
