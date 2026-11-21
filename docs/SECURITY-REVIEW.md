# KPI Academy — Focused Security Review

**Date:** 2026-11-20  
**Scope:** Client-side rendering of user-supplied KPI report context in the calculator.

## Finding: unescaped report context in result HTML

The calculator accepts a reporting period and outlet/scope from the learner. The KPI engine returns these context values with the calculation result. The result renderer previously inserted `period`, `scope`, and `currency` directly into an `innerHTML` template.

Because period and scope are user-controlled strings, HTML markup could be interpreted in the result panel. This creates a DOM injection / potential cross-site scripting path in a learner's local browser.

## Remediation

- Added a small HTML-escaping helper in `assets/js/calculator.js`.
- Escaped the report period, scope, and currency before rendering the result context.
- Added a browser regression test that submits an `img/onerror` payload as the scope, verifies the text is displayed literally, verifies no image element is created in the result panel, and confirms the test callback did not execute.

## Scope and limitations

This is a focused remediation of the observed rendering sink, not a complete security certification. The rest of the application should undergo a wider audit of all dynamic `innerHTML` construction, URL handling, Markdown rendering, stored learner notes, and future integrations before any high-assurance or multi-user deployment.

No authentication, server, cloud sync, or external AI service is part of this review.
