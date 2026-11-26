# Home takeover: browser baseline and density correction

PR #4 was open and draft at `f453c8c60162ce3fe86ff3a7b69777dfbba72f35` before this work. Its exact-head QA run 45860775483 succeeded. The Blueprint, Design System Exit Gate, Token Ownership Contract, Component Specification, and Style Ownership Map exist; the design-system gate is a historical specification decision with documented legacy debt, not Home visual acceptance.

## Verified issue and change

At 390 × 844 with a fresh learner, the baseline dashboard was 7,832 CSS pixels tall and its resume link started at y=773, beneath the fixed bottom navigation starting at y=770. Chapter status was repeated across the primary route, progress summary, and study centre. At 768px the bottom navigation was displayed in normal flow, and the sidebar menu and mobile brand were hidden.

The Home now presents secondary progress and study details in a native, keyboard-operable disclosure. These existing features and their underlying data remain available when opened. Two-column phone chapter cards, reduced hero spacing, and a desktop progress/resume grid improve the hierarchy. The tablet shell exposes its existing menu and brand and fixes the bottom navigation to the viewport. No curriculum, formulas, engine, XP, assessment, or learner-storage code was changed.

## Local verification

Serve from the repository root with `python3 -m http.server 4173`, then open `http://localhost:4173/#dashboard`. The site needs HTTP for content fetches; it is not a public deployment.

- Before and after screenshots were captured in Chromium at 320, 360, 390, 430, 768, 1024 and 1365px. At 390 × 844, the updated fresh dashboard was approximately 4,630px tall with details collapsed; the resume action was above the mobile navigation. These figures describe the tested local browser and state, not a target or visual-acceptance claim.
- The browser smoke suite checks a fresh learner's visible resume action and bottom-navigation targets at four phone widths, tablet navigation and menu, disclosure access, chapter links, route actions, keyboard navigation, completed curriculum, lesson evidence and 90 XP, assessments, and backup restoration.
- The non-browser test files exercise the learning engine, assessment catalog, KPI calculations, lesson labs, curriculum integrity, rendering, simulator, study tools, assets, bidirectional helpers, and token contracts.

## Open gates and limitations

The approved Home and Lesson images were not available in this execution workspace. The captures have therefore not been compared to the approved references, and Phase 2 has not passed visual acceptance. The application is predominantly Arabic; `KPI.bidi.setLanguage` changes document attributes but is not a complete English-language experience. English and bilingual visual QA remain outstanding. Browser screenshots and control-size observations above concern the fresh Arabic dashboard; they do not establish accessibility or visual acceptance across every learner state and route. Phases 3–8 remain open. CI for the new commit must be checked separately.

### Keyboard focus follow-up

A real Tab traversal at 390 × 844 initially placed the focused shortcut underneath the fixed bottom bar even though its focus outline existed. The shell now reserves scroll clearance for both the sticky header and bottom navigation. A repeat Chromium capture showed the cyan outline and entire focused card unobscured. The browser regression checks the focused card's bounds after scrolling; this does not replace a complete keyboard and screen-reader audit.
