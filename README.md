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
- [x] Premium learner dashboard and three-module discovery experience, driven by actual local learning progress
- [x] Dashboard learning summary with Continue Learning action, real earned XP and passed-assessment progress
- [x] Business Mathematics 8-chapter / 32-lesson manifest
- [x] Full source lesson files BM-001 through BM-032 migrated from KPI Academy Notion pages
- [x] Structured lesson reader with semantic learning panels, formula blocks, section navigation, previous/next lesson links, nested Markdown lists, tables, bold/italic/inline code, explicit line breaks, and safe HTML escaping
- [x] Playwright browser smoke: dashboard, lesson evidence gates, XP award, exam pass/retake, backup export/restore, and no uncaught runtime errors
- [x] Initial desktop/mobile screenshot review of dashboard, modules, lesson reader, calculator, Analytics Lab, simulator, and progress
- [ ] Comprehensive accessibility audit (keyboard, screen reader, contrast, and full RTL/LTR review)
- [x] Automated Markdown renderer regression tests (tables, alignment rows, headings, emphasis, lists, line breaks, HTML escaping) across all 32 source lessons
- [x] Curriculum integrity tests for approved module IDs, chapter/lesson totals, XP ceiling, Accounting scope boundaries, and all 15 KPI definitions
- [x] GitHub Actions QA workflow for JavaScript syntax, KPI engine tests, Markdown renderer tests, curriculum integrity, learning-state rules, and assessment-bank integrity
- [x] Mobile overflow smoke at 390px for dashboard, progress, lesson reader, final exam, Analytics Lab, and simulator; RTL page and LTR lesson metadata verified
- [ ] Full keyboard, screen-reader, contrast, and RTL/LTR accessibility audit
- [x] Deterministic 15-KPI calculation engine; Node.js runtime tests executed (16 calculation cases + 12 validation cases passed)
- [x] Automated browser interaction smoke via Playwright / Chromium on GitHub Actions, including Analytics Lab, simulator stages, and KPI registry rendering
- [x] Before/after desktop screenshots and redesigned mobile screenshots captured as a CI artifact at 1365px and 390px
- [ ] Remaining responsive breakpoints (360px, 430px, 768px, 1024px) and complete language-direction visual acceptance
- [x] Hospitality Accounting scope view migrated from the controlling Notion specification (six approved scope areas; no invented chapters/lessons)
- [x] Restaurant KPIs module detail displays the exact 15-entry approved KPI registry; no unapproved curriculum is presented
- [ ] Hospitality Accounting detailed curriculum and assessment design (source outline not yet defined)
- [ ] Restaurant KPIs detailed curriculum
- [x] Eight chapter assessments and integrated final practical exam (50 source-derived / curriculum-based scenario questions; 80% pass threshold; final set remains subject to academic review)
- [x] Versioned local learning state with lesson evidence, idempotent 90-XP awards, and an auditable XP transaction ledger
- [x] Assessment attempts with unlimited retakes and retained best/latest scores; 80% passing rules and certificate eligibility gate
- [x] Local backup export/restore with schema and XP-ledger validation
- [ ] Actual PDF certificate generation (eligibility is calculated; certificate file generation is not implemented)
- [x] Analytics Lab with three explicitly synthetic sample periods; calculations use the deterministic KPI Engine and display units, formulas, interpretation, source, and limitations
- [x] Reusable Management Simulator workspace with five stages; approved scenario manuscripts and decision feedback remain a content dependency
- [ ] Admin content panel
- [ ] Deployment

The application must not claim features as implemented until they are built and tested. Implementation work is isolated on `implementation/kpi-academy-mvp`. The main branch's affected CSS file content was restored after an accidental update; its Git history retains the update and rollback commits. No further main-branch writes are permitted.

## Analytics and simulator implementation notes

- Analytics Lab uses a clearly labelled synthetic three-period educational dataset. It is not connected to a live restaurant, POS, or user trading data.
- Gross Profit, Gross Profit Margin, Labor Cost %, Prime Cost, and Prime Cost % are calculated by the existing deterministic KPI Engine. The interface includes period/scope/currency, source disclosure, formulas, interpretation, and limitations. No benchmarks are invented.
- Management Simulator currently provides a reusable five-stage scenario workspace (context, evidence, decision, consequences, reflection). The approved source documents specify three scenarios as MVP scope but do not yet provide complete scenario manuscripts, datasets, options, or feedback rules. No scenario or XP is fabricated.

## Learning Engine implementation notes

- Local storage key: `kpi-academy.learning.v1` (versioned schema, single-device scope).
- Lesson XP is granted once only after the learner self-attests completion of the interactive lab, professional challenge, and field checklist. Opening a lesson awards zero XP.
- The local learner can export and restore a JSON backup. Restore validates schema, evidence records, duplicate awards, and assessment-score consistency.
- Business Mathematics has eight five-question chapter assessments and one ten-question integrated final practical exam. Passing score is 80%; retakes are unlimited; attempt history, best score, and latest score are retained.
- Chapter questions are based on source lesson assessment items; answer choices/distractors and the integrated final scenarios were authored for this MVP from curriculum concepts and remain subject to academic review.
- Assessments do not award XP under the controlling product decision.
- Certificate eligibility is calculated only after all eight chapter assessments and the final assessment are passed. The certificate remains internal and is not external accreditation.
- Client-side assessments are self-study tools: question keys and local records are accessible to the learner; there is no authentication, proctoring, server-side grade verification, or cross-device sync.
