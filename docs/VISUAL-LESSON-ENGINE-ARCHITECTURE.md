# KPI Academy — Visual Lesson Engine Architecture

**Status:** Foundation implementation  
**Branch:** feature/visual-lesson-engine-foundation  
**Product decision:** In-app, automatic lesson-to-motion-graphics workflow; 90 seconds; Arabic and English editions.

## 1. Product boundary

The Visual Lesson Engine is a learning-media subsystem inside KPI Academy. It supplements the canonical written lesson; it does not replace, rewrite, or silently modify the approved lesson manuscript.

It must preserve the existing learning model:

Knowledge Modules → Chapters → Lessons → Practical Activities → Assessments.

Video generation does not award XP, mark a lesson complete, change assessment scores, or create an academic credential.

## 2. Architecture principles

1. Vanilla JavaScript, HTML, CSS and JSON remain the application stack. No React, Replit, or external app builder.
2. The visual engine is isolated from the lesson reader, KPI calculation engine, and learning-state engine.
3. Lesson Markdown is the source of truth. Every scene keeps a reference to its source section.
4. Generation is deterministic where possible: the same lesson revision and configuration should produce the same storyboard.
5. Provider credentials must never be placed in browser JavaScript or static JSON.
6. No AI-generated factual claim may be added unless it is supported by the source lesson or an explicitly approved reference.
7. Arabic and English are separate narration/render variants sharing the same visual timing and brand system.
8. A video is not considered final until narration, synchronization, RTL/LTR rendering, duration, and export checks pass.

## 3. Target production pipeline

Lesson Markdown → Content Extractor → Learning Script → Storyboard JSON → Scene Renderer → TTS → Audio Alignment → Video Renderer → QA → Lesson Media Asset

### Browser application

- Reads the lesson already loaded by the lesson reader.
- Requests or creates a storyboard.
- Shows scene preview and generation status.
- Plays the visual preview.
- Displays approved Arabic and English editions.
- Reads the final media manifest and embeds the completed video in the lesson.

### Production API (next backend milestone)

A same-origin API is required for secure AI/TTS orchestration. The static GitHub Pages application cannot securely store API secrets or run a durable render worker.

Proposed endpoints:

- POST /api/visual-lessons — create a job from lessonCode, lessonRevision, language, durationSeconds, and renderProfile.
- GET /api/visual-lessons/:jobId — retrieve job state, validation results, and progress.
- GET /api/visual-lessons/:jobId/manifest — retrieve the approved scene and media manifest.
- GET /media/visual-lessons/:lessonCode/:revision/:language.mp4 — retrieve the rendered asset.

Job states:

queued → extracting → scripting → storyboarding → rendering-voice → rendering-video → quality-check → ready

Terminal failure state: failed, with a machine-readable stage and error code. Retries must be idempotent and must not create duplicate media assets.

### Worker responsibilities

1. Validate the lesson code and revision against the curriculum manifest.
2. Extract source sections and learning objectives.
3. Generate an evidence-grounded narration script; retain source-section references.
4. Produce exactly eight scenes and 90 seconds total.
5. Render the scene timeline using SVG/HTML/CSS animation templates.
6. Generate narration through a server-side TTS adapter.
7. Align narration segments to scene timing; if speech does not fit, revise the script and regenerate timing rather than accelerating speech unnaturally.
8. Render a silent visual master and mux narration/music with FFmpeg.
9. Run quality checks for duration, dimensions, missing frames, audio presence, clipping, text overflow, and Arabic shaping.
10. Publish only validated media and its JSON manifest.

## 4. Rendering strategy

### Selected direction

Template-driven vector motion graphics are the default renderer. The visual grammar includes:

- Concept reveal
- Process and flow diagrams
- Comparisons
- Timelines
- Number and formula builds
- KPI cards and charts
- Decision trees
- Checklists and recap sequences

This is preferable to generating a separate AI video clip for every scene: it is repeatable, editable, brand-consistent, and avoids per-clip generation credits.

### Export

The backend renderer should produce a 1920×1080 master at 30 fps, H.264 video, AAC audio, and MP4 container. A mobile rendition can be generated later from the same scene manifest. FFmpeg performs final muxing and encoding.

The initial in-browser preview is not an MP4 export and must not be labelled as one.

## 5. Language and typography

- Arabic edition: lang="ar" and dir="rtl" for Arabic text containers.
- English edition: lang="en" and dir="ltr".
- Mixed technical expressions are isolated using bdi or direction-specific spans.
- Do not reverse Arabic characters manually.
- Use browser text shaping with locally bundled, licensed fonts.
- Candidate fonts: Noto Sans Arabic for Arabic and IBM Plex Sans for English.
- Currency, decimals, formulas, and identifiers require explicit LTR isolation and locale-aware formatting.
- Technical vocabulary uses a versioned bilingual glossary.
- TTS pronunciation overrides are stored as data, not embedded in lesson prose.

## 6. Cost and quota controls

The product target is USD 10–20/month. This is a budget ceiling, not a claim of unlimited third-party AI usage.

- Use deterministic templates and local SVG assets for visuals.
- Cache generated storyboards by lesson revision and configuration.
- Cache narration by normalized text, voice, locale, and pronunciation dictionary version.
- Never re-render a lesson if a valid media manifest already exists.
- Track character consumption and provider quota.
- Provide an explicit quota/usage estimate before enabling paid TTS or LLM calls.
- Use provider adapters so a vendor can be changed without changing the lesson reader.
- Keep provider API keys on the server only.

Unlimited video generation is only realistic for the template/rendering layer while compute and storage remain available. AI text and TTS APIs have provider quotas or usage costs.

## 7. Security, privacy and reliability

- Do not send learner notes, assessment answers, XP ledger, or personal progress to content-generation providers.
- Send only the lesson text needed for the requested asset.
- Validate lesson IDs against the local curriculum manifest; do not accept arbitrary remote URLs.
- Sanitize all model output before rendering.
- Use job IDs and idempotency keys.
- Bound job duration, payload size, and retry count.
- Keep the original lesson available if video generation fails.
- Show a useful failure state and permit a safe retry.
- Do not auto-publish a failed or partially rendered asset.

## 8. Current implementation status

### Implemented in this foundation

- Isolated KPI_VISUAL_LESSON_ENGINE browser module.
- Markdown heading/section extraction.
- Deterministic eight-scene storyboard generation.
- Exact 90-second scene timing.
- Scene role classification and safe text escaping.
- Vector scene preview templates.
- Scene navigation and timed preview controls.
- Lesson-reader mount point integration.
- Dedicated stylesheet and automated unit tests.

### Not implemented yet

- LLM-backed narration writing or translation.
- Azure/ElevenLabs TTS adapter.
- Server-side job queue and render worker.
- MP4 rendering and storage.
- Automatic background job execution when a lesson is opened.
- Final audio/video QA and publish manifest.
- Production deployment and quota metering.

The current UI must clearly call itself a generated visual storyboard preview, not a completed narrated video.

## 9. Acceptance gates

A release cannot be called complete until:

- [ ] Each source lesson creates a grounded storyboard.
- [ ] Scene durations sum to exactly 90 seconds.
- [ ] Arabic and English scripts are reviewed independently.
- [ ] Narration duration fits the scene timeline naturally.
- [ ] Arabic letters shape correctly and mixed LTR expressions remain ordered.
- [ ] All text remains within safe areas at desktop and mobile dimensions.
- [ ] Final MP4 has audio and video streams.
- [ ] Final duration is within the declared tolerance.
- [ ] No unsupported claims are introduced.
- [ ] Repeated requests reuse valid cached assets.
- [ ] Failure never blocks reading or completing the original lesson.
- [ ] Video generation never changes XP, completion, or assessment state.
