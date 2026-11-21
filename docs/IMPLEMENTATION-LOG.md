# KPI Academy — Implementation Log

## Product decisions

- **DEC-001 — Dark Navy + Glass:** The two approved phone mockups supersede the light theme in the earlier UI/UX specification. This is the active visual direction. Notion is not modified.
- **DEC-002 — Navigation:** Five bottom items plus More. Home = Dashboard; Modules = Knowledge Modules; Tools = KPI Calculator; Progress = Assessments & Progress; More drawer = Analytics Lab, Management Simulator, Settings/Admin. All seven destinations remain available.
- **DEC-003 — Protected logic:** This work rebuilds UI and interactions only. Existing calculation, learning, XP engines, storage layer, and current storage keys remain protected. No storage migration without an approved plan.
- **DEC-004 — Reference authority:** The two mockups attached with the final decision message are the approved references: first Home, second Lesson / Applied Lab. The eight earlier screenshots represent the current build; image 55236 is not a reference.
- **DEC-005 — Existing data loading:** Keep the current fetch()-based data loading. Double-click (file://) opening is not supported until the data-layer phase. Do not modify data/*.json, content/, or tests/.
- **DEC-006 — Optional future data layer:** A later Phase 6 may keep JSON as the source and generate JavaScript data files. A loader would try window.KPI.data first, then fall back to fetch(). Planning only; implementation requires explicit owner approval.
- **DEC-007 — Isolated work branch:** UI rebuild work is performed on the separate branch ui-rebuild. Do not modify the published branch or merge/publish until explicit approval.

## Phase 1

Additive shell foundation only. Existing application engines and storage remain unchanged. New styles are loaded after the existing stylesheet stack so Phase 1 visual changes are limited to the shell.
