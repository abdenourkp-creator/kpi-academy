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
- [ ] Browser runtime and visual QA
- [x] Automated Markdown renderer regression tests (tables, alignment rows, headings, emphasis, lists, line breaks, HTML escaping)
- [x] GitHub Actions QA workflow for JavaScript syntax, KPI engine tests, and Markdown renderer tests
- [ ] RTL/LTR and mobile accessibility QA
- [x] Deterministic 15-KPI calculation engine; Node.js runtime tests executed (16 calculation cases + 12 validation cases passed)
- [ ] Full browser UI interaction and visual QA (headless Chromium launch did not complete in the current environment)
- [x] Hospitality Accounting scope view migrated from the controlling Notion specification (six approved scope areas; no invented chapters/lessons)
- [ ] Hospitality Accounting detailed curriculum and assessment design (source outline not yet defined)
- [ ] Restaurant KPIs detailed curriculum
- [ ] Eight chapter assessments and final practical exam
- [ ] Evidence-based XP ledger and local progress persistence
- [ ] Analytics Lab and Management Simulator
- [ ] Admin content panel
- [ ] Deployment

The application must not claim features as implemented until they are built and tested. Implementation work is isolated on `implementation/kpi-academy-mvp`. The main branch's affected CSS file content was restored after an accidental update; its Git history retains the update and rollback commits. No further main-branch writes are permitted.