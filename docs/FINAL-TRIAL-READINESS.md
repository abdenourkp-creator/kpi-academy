# KPI Academy — Pre-Trial Release Gate

## Purpose
This checklist defines the quality gate for the first controlled product trial. Passing automated checks is necessary, but does not replace a human review of the learning experience and hospitality terminology.

## Scope protected during hardening
- Work remains on `implementation/kpi-academy-mvp`.
- No deployment, GitHub Pages activation, or production publication is part of this phase.
- The learning engine, XP transaction rules, lesson evidence requirements, and existing learning storage schema are protected.
- Live Venue archive uses its own local namespace: `kpiAcademy.liveVenue.shifts.v1`.
- Training data and simulation outcomes must remain clearly labelled as synthetic.

## Automated release gates
1. JavaScript syntax checks for application, engines, labs, and tests.
2. KPI engine calculations and invalid-input handling.
3. Curriculum source, lesson registry, XP totals, KPI registry, and visual asset integrity.
4. Learning engine, assessment, lesson practice, and study-tool regression suites.
5. Live Venue event order, delayed consequences, cascading effects, and close-out validation.
6. Archive persistence: completed shifts only, idempotency, five-shift retention, malformed data, unavailable storage, quota failure, and schema mismatch.
7. HTML structure, duplicate attributes, local asset references, and script dependency order.
8. Playwright browser flow: navigation, lessons, assessments, recovery, backup/restore, Live Venue completion and comparison, mobile overflow, and uncaught page errors.
9. Before/after visual capture on desktop plus responsive captures across 360, 390, 430, 768, and 1024 pixel widths.
10. Static test package assembly.

## Manual review required before inviting trial users
- Read at least one lesson from each currently implemented module and verify formula definitions, denominator choices, units, and worked examples.
- Verify Arabic RTL flow, English KPI terminology, focus visibility, labels, and error messages on a physical phone.
- Complete two Live Venue shifts and inspect the archive comparison and the local-storage behavior.
- Confirm all displayed sample data is labelled as illustrative, not operational benchmark data.
- Confirm the Hospitality Accounting module remains an approved scope outline until its detailed chapter and lesson content is approved. Do not invent curriculum to make the module look complete.

## Exit criteria
A trial candidate is ready only when:
- all CI jobs pass, including browser, visual capture, and package;
- the generated visual artifacts have been inspected, not merely uploaded;
- no known blocking defects remain;
- the manual review items above are completed and recorded.

A green unit-test job alone is not release approval.
