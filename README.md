# KPI Academy

A knowledge-led Hospitality KPI and Business Intelligence learning product.

## MVP modules
1. Business Mathematics — Foundation (8 chapters, 32 lessons)
2. Hospitality Accounting
3. Restaurant KPIs

## Product flow
Knowledge Modules → Chapters → Lessons → Practical Activities → Assessments

## Technology
- HTML5
- CSS3
- Vanilla JavaScript
- JSON for curriculum manifests
- Markdown source files for full lesson manuscripts
- GitHub Pages planned; deployment not yet configured

## Current implementation status
- [x] Responsive application shell and Arabic RTL navigation
- [x] Dashboard and three-module overview
- [x] Business Mathematics 8-chapter / 32-lesson manifest
- [x] Full source lesson files BM-001 through BM-032 migrated from KPI Academy Notion pages
- [x] Lesson list and in-app reader (first-pass Markdown rendering)
- [ ] Browser runtime and visual QA for learner progress, assessment flows, and lesson evidence controls
- [x] Automated Markdown renderer regression tests (tables, alignment rows, headings, emphasis, lists, line breaks, HTML escaping) across all 32 source lessons
- [x] Curriculum integrity tests for approved module IDs, chapter/lesson totals, XP ceiling, Accounting scope boundaries, and all 15 KPI definitions
- [x] GitHub Actions QA workflow for JavaScript syntax, KPI engine tests, Markdown renderer tests, curriculum integrity, learning-state rules, and assessment-bank integrity
- [ ] RTL/LTR and mobile accessibility QA
- [x] Deterministic 15-KPI calculation engine; Node.js runtime tests executed (16 calculation cases + 12 validation cases passed)
- [ ] Full browser UI interaction and visual QA (headless Chromium launch did not complete in the current environment)
- [x] Hospitality Accounting scope view migrated from the controlling Notion specification (six approved scope areas; no invented chapters/lessons)
- [ ] Hospitality Accounting detailed curriculum and assessment design (source outline not yet defined)
- [ ] Restaurant KPIs detailed curriculum
- [x] Eight chapter assessments and integrated final practical exam (50 source-derived / curriculum-based questions; 80% pass threshold)
- [x] Versioned local learning state with lesson evidence, idempotent 90-XP awards, and an auditable XP transaction ledger
- [x] Assessment attempts with unlimited retakes and retained best/latest scores; 80% passing rules and certificate eligibility gate
- [x] Local backup export/restore with schema and XP-ledger validation
- [ ] Actual PDF certificate generation (eligibility is calculated; certificate file generation is not implemented)
- [ ] Analytics Lab and Management Simulator
- [ ] Admin content panel
- [ ] Deployment

The application must not claim features as implemented until they are built and tested. Implementation work is isolated on `implementation/kpi-academy-mvp`. The main branch's affected CSS file content was restored after an accidental update; its Git history retains the update and rollback commits. No further main-branch writes are permitted.

## Learning Engine implementation notes

- Local storage key: `kpi-academy.learning.v1` (versioned schema, single-device scope).
- Lesson XP is granted once only after the learner self-attests completion of the interactive lab, professional challenge, and field checklist. Opening a lesson awards zero XP.
- The local learner can export and restore a JSON backup. Restore validates schema, evidence records, duplicate awards, and assessment-score consistency.
- Business Mathematics has eight five-question chapter assessments and one ten-question integrated final practical exam. Passing score is 80%; retakes are unlimited; attempt history, best score, and latest score are retained.
- Chapter questions are based on source lesson assessment items; answer choices/distractors and the integrated final scenarios were authored for this MVP from curriculum concepts and remain subject to academic review.
- Assessments do not award XP under the controlling product decision.
- Certificate eligibility is calculated only after all eight chapter assessments and the final assessment are passed. The certificate remains internal and is not external accreditation.
- Client-side assessments are self-study tools: question keys and local records are accessible to the learner; there is no authentication, proctoring, server-side grade verification, or cross-device sync.
