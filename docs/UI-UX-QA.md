# KPI Academy — UI/UX QA corrections

## Screenshot evidence corrections

- **D16 — confirmed:** Dashboard evidence 55237 is excluded. Lesson evidence is screenshots 55240–55243.
- **D17 — confirmed:** Dashboard evidence 55237 is excluded. Lesson evidence is screenshots 55240–55243.
- **D18 — confirmed:** Dashboard evidence 55237 is excluded. Lesson evidence is screenshots 55240–55243.
- **D20 — partially confirmed:** Screenshot 55243 shows very low-contrast table header text. Cell borders cannot be verified from the available screenshot.
- **D22 — confirmed using corrected lesson range:** Do not cite 55239. Re-evaluate and cite only lesson screenshots 55240–55243.
- Status vocabulary for all future QA records: GREEN, YELLOW, RED, GRAY, BLOCKED (words only).

## Phase 1 implementation evidence

- New design foundation files created: `assets/css/tokens.css`, `base.css`, `shell.css`, `components.css`.
- New bilingual and formatting scaffolding created: `assets/js/namespace.js`, `ar.js`, `en.js`, `bidi.js`, `formatting.js`.
- Inline SVG symbol sprite added to `index.html`; no external SVG sprite dependency.
- BiDi acceptance page created at `dev/bidi-test.html`.
- Existing CSS and JavaScript files were retained. Existing engine files and the storage key `kpi-academy.learning.v1` were not modified.
- Data JSON, content/, and tests/ were not modified.
- Phone rendering and interactive behavior remain GRAY until owner screenshots are reviewed.
