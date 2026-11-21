# KPI Academy — Learning Experience Transformation Strategy

**Status:** Approved working strategy for product discovery and learning-experience development  
**Working branch:** `implementation/kpi-academy-mvp`  
**Baseline commit reviewed:** `eaa06391ecfc57d77852723a23bff69a91b6713a`  
**Scope:** Existing KPI Academy only. No unrelated academy or project content is included.

---

## 1. Product North Star

KPI Academy should help a hospitality professional move from recognising a business term to making a defensible operational or financial decision using evidence.

The product is not successful merely because a learner finishes lessons, earns XP, or calculates a KPI. It is successful when the learner can:

1. Explain a concept accurately.
2. Select the correct data and formula for a real operating question.
3. Calculate and validate a result.
4. Interpret the result within its period, outlet scope, denominator, units, and assumptions.
5. Identify what additional evidence is needed.
6. Recommend and communicate an appropriate next action.

**North-star outcome:** demonstrated decision competence in hospitality business mathematics, accounting, and restaurant performance analysis.

The experience should feel premium because it is clear, useful, reliable, and professionally relevant—not because it is visually elaborate.

## 2. Verified Product Baseline

The current repository is a Vanilla JavaScript application with a local-first learning engine and deterministic KPI calculation engine.

Verified at the reviewed branch:

- Three approved MVP modules are listed.
- Business Mathematics is the only detailed learner-facing curriculum: 8 chapters and 32 lessons.
- The Business Mathematics assessment catalogue contains 8 chapter assessments and one final practical assessment, 50 questions total.
- The existing learning engine uses the storage key `kpi-academy.learning.v1`, schema version 1, 90 XP per eligible lesson, four completion evidence flags, and an 80% assessment pass threshold.
- The four evidence flags are `interactiveLab`, `professionalChallenge`, `fieldChecklist`, and `learnerAttested`.
- Hospitality Accounting has an approved scope/blueprint, but not a published detailed learner curriculum.
- Restaurant KPIs has an approved 15-entry formula registry and curriculum blueprint, but not a published detailed learner curriculum.
- KPI Calculator, Analytics Lab, and Management Simulator are present. Analytics and simulator examples are synthetic educational data, not live restaurant integrations.
- Authentication, cloud sync, team accounts, server-side progress verification, subscription management, admin content tools, and certificate-file generation are not implemented.
- A focused security review fixed one user-controlled HTML rendering issue, but it is not a full security certification.
- The latest QA run observed for commit `eaa06391ecfc57d77852723a23bff69a91b6713a` completed successfully.

These are repository observations, not a claim that every screen or lesson has passed independent pedagogical, accessibility, or real-device review.

## 3. Learning Experience Principles

### 3.1 Active learning over passive reading

A lesson should not be a long article with a quiz at the end. Learners must regularly retrieve, predict, calculate, compare, explain, and decide.

### 3.2 Authentic hospitality context

Use operationally credible contexts: invoices, POS reports, stock counts, recipe yields, payroll summaries, covers, checks, seat capacity, purchasing, and P&L extracts. Clearly label synthetic training data.

### 3.3 Worked example before independent practice

Introduce a concept, demonstrate a fully worked example, explain why each step is taken, then fade support across guided and independent tasks.

### 3.4 Feedback explains the reasoning

Feedback must identify why an answer is correct or incorrect, show the relevant step, expose common misconceptions, and provide a useful next action. A green check alone is insufficient.

### 3.5 Evidence before mastery claims

Opening a lesson is not learning. Self-attestation may be one part of evidence, but must not be the only evidence that a learner can perform a skill. XP and completion rules must remain honest and consistent with the existing engine until an explicitly approved, tested migration is designed.

### 3.6 Cognitive load and accessibility

Use short content segments, one principal idea per section, meaningful visual hierarchy, legible formulas, mobile-first tables, keyboard access, screen-reader labels, adequate contrast, and deliberate Arabic/English direction handling.

### 3.7 No false authority

Do not invent industry benchmarks, external accreditation, job guarantees, financial outcomes, or live integrations. Every benchmark and recommendation must state its source, scope, period, and limitations.

## 4. Standard Lesson Blueprint

Each lesson should be designed against this sequence. Not every lesson needs identical visual components, but every relevant learning function must be covered.

1. **Orientation:** lesson objective, prerequisites, estimated effort, and practical relevance.
2. **Retrieval warm-up:** one or two short questions that activate prerequisite knowledge.
3. **Business problem:** a realistic hospitality situation with a clear question and known/unknown data.
4. **Concept explanation:** precise definition, boundaries, units, and when the concept is useful.
5. **Visual model:** a diagram, process map, annotated report, or formula breakdown that teaches rather than decorates.
6. **Worked example:** step-by-step solution with explicit reasoning and validation.
7. **Guided practice:** learner completes the next step with hints available.
8. **Independent practice:** a new example without step-by-step scaffolding.
9. **Interpretation:** explain what the result means and what it does not prove.
10. **Professional decision:** select or propose a next action and justify it with evidence.
11. **Common misconceptions:** targeted correction of likely errors.
12. **Field transfer:** a realistic workplace observation or task, with safety and authority boundaries.
13. **Mastery check:** short assessment aligned directly to the objective.
14. **Reflection and retrieval schedule:** what the learner can now do, what remains uncertain, and when to revisit it.

### Lesson quality requirements

Every lesson manuscript must have:
- Observable learning objectives.
- Correct and internally consistent definitions.
- At least one fully checked worked example where calculation is relevant.
- Clearly identified data source, period, outlet scope, unit, denominator, and assumptions where applicable.
- At least one learner action, not only explanatory prose.
- Feedback or an answer rationale for assessed responses.
- A distinction between facts, assumptions, and recommendations.
- A traceable link to the chapter objective and assessment blueprint.

## 5. A More Meaningful Learning Loop

The learner journey should be:

**Diagnose → Learn → Retrieve → Model → Practise → Apply → Explain → Decide → Review**

- Diagnose: establish prerequisite knowledge and confidence.
- Learn: explain the concept in a compact, structured form.
- Retrieve: ask the learner to recall before showing the answer.
- Model: demonstrate expert reasoning on a worked example.
- Practise: progressively reduce hints.
- Apply: use a fresh hospitality scenario.
- Explain: require the learner to interpret the result in words.
- Decide: make a bounded operational or financial recommendation.
- Review: schedule spaced retrieval and show progress against skills.

This sequence is the intended learning architecture; it is not a claim that all stages are currently implemented.

## 6. Assessment and Mastery Architecture

Assessment should measure more than arithmetic accuracy.

Use four complementary evidence types:

1. **Knowledge:** definitions, concepts, formula selection, and limitations.
2. **Calculation:** correct inputs, formula, units, and numerical result.
3. **Interpretation:** meaning, denominator, period, scope, assumptions, and data limitations.
4. **Decision communication:** justified action, further evidence required, and concise management explanation.

### Feedback model

For each task, provide:
- Result: correct, partly correct, or incorrect.
- Reasoning: the key step or concept.
- Misconception: what likely caused the error, when inferable.
- Hint: a smaller prompt before revealing the full solution.
- Retry: a new or varied practice item where appropriate.
- Transfer: one sentence about workplace application.

Open-ended professional challenges need a marking rubric before they can be treated as mastery evidence.

### Existing learning-engine preservation

Do not change the current storage key, schema, lesson codes, XP ledger, assessment history, pass threshold, backup/restore behavior, or evidence gates as part of visual work.

Before changing the completion model, design and test a backward-compatible migration. Do not award new XP for repeated attempts or passive page visits.

## 7. Priority Learning Experience Workstreams

### Workstream A — Lesson experience

- Review all 32 BM lessons against the standard blueprint.
- Identify lessons that are primarily long-form reading.
- Check consistency between manuscript, rendered sections, diagrams, labs, challenges, checklists, and assessments.
- Improve mixed Arabic/English notation and formula rendering.
- Introduce progressive disclosure only where it reduces cognitive load.
- Build reusable learning components rather than one-off lesson-specific hacks.

### Workstream B — Practice engine

- Inventory current interactive activities and their actual behavior.
- Identify which tasks require calculation, selection, interpretation, or written reasoning.
- Add guided practice and meaningful hints where a learning objective requires them.
- Make validation messages explain the error.
- Keep practice separate from official assessment records unless explicitly designed otherwise.

### Workstream C — Assessment quality

- Map every assessment question to a learning objective and source lesson.
- Audit distractors, answer keys, explanations, difficulty, and cognitive demand.
- Add applied questions that require reading context and validating inputs.
- Create rubrics for professional challenges and practical work.
- Use varied data in retakes where feasible, without changing existing history semantics.

### Workstream D — Learning progression

- Replace vanity-only progress with skill evidence and clear next steps.
- Show what the learner can do, what needs practice, and why.
- Make review scheduling useful and transparent.
- Keep XP as a secondary motivational signal, not a proxy for competence.
- Avoid punitive streak mechanics or manipulative engagement loops.

### Workstream E — Visual and interaction system

- Maintain a coherent premium design system without sacrificing reading comfort.
- Prioritise mobile lesson readability and accessible controls.
- Make tables responsive and formulas direction-safe.
- Use diagrams to explain relationships and processes.
- Ensure every button and control has a working, tested action.

### Workstream F — Content expansion

- Keep Business Mathematics as the pilot module.
- Do not publish Hospitality Accounting lessons until the full lesson sequence, examples, and assessments are authored and independently checked.
- Do not publish Restaurant KPI lessons until every lesson maps to the approved KPI registry and preserves its exact formulas, assumptions, units, and periods.
- Do not invent KPI benchmarks.
- Do not claim formal accreditation.

## 8. Delivery Sequence and Gates

### Gate 0 — Baseline and safety
- Confirm the working branch and commit.
- Confirm deployment remains disabled during the audit.
- Confirm the latest QA result.
- Preserve the current progress schema and backup behavior.
- Create a verified screen, route, interaction, and content inventory.

**Exit condition:** the team knows exactly what exists and what must not be broken.

### Gate 1 — Learning audit
- Audit all BM lessons and all nine assessments.
- Build a lesson-to-objective-to-assessment traceability matrix.
- Identify academic, pedagogical, interaction, and accessibility defects.
- Rank issues by learner harm and frequency.

**Exit condition:** approved learning backlog with evidence and acceptance criteria.

### Gate 2 — BM-001 pilot redesign
- Redesign one representative foundation lesson end-to-end.
- Include retrieval, worked example, guided practice, independent task, interpretation, professional decision, and review.
- Test on narrow mobile screens and desktop.
- Run content, calculation, accessibility, and interaction checks.
- Compare the new experience with the existing lesson before expanding.

**Exit condition:** BM-001 meets the approved lesson standard without breaking learning records.

### Gate 3 — Reusable learning system
- Extract reusable components from the successful pilot.
- Apply the system to a small, varied sample of lessons.
- Validate different lesson types: numerical, conceptual, data interpretation, and decision-focused.
- Only then scale across BM-001…BM-032.

**Exit condition:** repeatable lesson architecture with consistent quality.

### Gate 4 — Complete and validate Business Mathematics
- Improve all 32 lessons based on the approved standard.
- Verify all 50 assessment questions and answer explanations.
- Add rubrics and practical evidence where appropriate.
- Complete the mobile, accessibility, and regression audit.

**Exit condition:** the Foundation module demonstrates a coherent, assessable learning experience.

### Gate 5 — Author next modules
- Develop Hospitality Accounting in dependency order.
- Develop Restaurant KPIs directly from the approved registry.
- Add cross-module applied cases only when prerequisite knowledge is available.
- Validate content independently before learner-facing publication.

**Exit condition:** complete, traceable curricula with tested assessments.

### Gate 6 — Optional commercial platform work
Only after learning value is validated:
- Conduct market interviews and willingness-to-pay tests.
- Define free and paid boundaries based on differentiated value.
- Design authentication, secure backend, privacy, billing, account recovery, and data portability.
- Implement server-side entitlement checks before offering paid access.
- Run a closed beta before any public commercial launch.

**Exit condition:** evidence of repeated user value, secure paid access, and a supportable business model.

## 9. Measurement Framework

Measure learning and product value separately.

### Learning measures
- Objective mastery rate.
- First-attempt and eventual accuracy.
- Error patterns by concept.
- Delayed retrieval performance.
- Practical task completion quality.
- Interpretation and decision rubric scores.
- Transfer performance on a new scenario.

### Experience measures
- Time to first meaningful learning action.
- Lesson abandonment by section.
- Hint usage and retry patterns.
- Mobile usability defects.
- Accessibility defects.
- Learner-reported clarity and confidence, treated as perception rather than proof of competence.

### Product measures
- Activation into a meaningful learning task.
- Return to a scheduled review.
- Repeated use of practice tools.
- Completion of applied cases.
- Retention and support burden.

Do not optimise for time-on-site, streak length, or XP volume at the expense of learning.

## 10. First Execution Sprint

The next sprint is not a broad redesign. It is a bounded evidence-gathering and pilot-design sprint.

1. Inspect the actual rendering and interaction of BM-001 and BM-005.
2. Inspect the lesson completion panel and establish what each evidence flag currently proves.
3. Audit the nine assessment structures and feedback quality.
4. Review all 32 lesson manuscripts against the standard blueprint.
5. Build a prioritised defect register with examples and acceptance criteria.
6. Draft the BM-001 pilot lesson architecture without changing the source manuscript or application code.
7. Select a representative second lesson to test whether the approach generalises.

**First implementation target:** a complete, reusable learning experience demonstrated in BM-001, then validated on another lesson type before scaling.

## 11. Explicit Boundaries

- Work only on `implementation/kpi-academy-mvp`.
- Do not modify `main`.
- Do not push or publish to `gh-pages`.
- Do not re-enable deployment during the audit.
- Do not introduce a framework or app-builder platform.
- Do not mix KPI Academy with HOSPITIUM, ATLAS, or unrelated projects.
- Do not alter learning storage, XP, assessments, KPI formulas, or backup formats without a documented compatibility plan and tests.
- Do not add payment gates, authentication claims, cloud sync, AI features, or enterprise capabilities until implemented and tested.
- Do not describe synthetic examples as live business data.
- Keep a recoverable history and record every material change.

---

## Decision

**The first priority is learning quality, not monetisation or visual polish.**

Business Mathematics is the pilot. BM-001 is the first end-to-end redesign candidate, but it must be audited against the actual lesson renderer, current evidence gates, and assessment behavior before implementation. A second lesson type must validate the reusable design before scaling to the full module.

The commercial model remains a later workstream, conditional on evidence that the learning experience delivers repeated, measurable value.
