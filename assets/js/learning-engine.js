(function (root) {
  "use strict";

  const STORAGE_KEY = "kpi-academy.learning.v1";
  const BACKUP_TAG = "KPI_ACADEMY_LEARNING_BACKUP";
  const SCHEMA_VERSION = 1;
  const LESSON_XP = 90;
  const PASS_THRESHOLD = 80;
  const LESSON_CODES = new Set(Array.from({ length: 32 }, (_, i) => "BM-" + String(i + 1).padStart(3, "0")));
  const ASSESSMENT_IDS = new Set([
    ...Array.from({ length: 8 }, (_, i) => "bm-chapter-" + String(i + 1).padStart(2, "0")),
    "bm-final-practical"
  ]);

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function now() {
    return new Date().toISOString();
  }

  function freshState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      createdAt: now(),
      updatedAt: now(),
      lessonProgress: {},
      lessonEvidence: {},
      assessmentAttempts: [],
      xpTransactions: []
    };
  }

  function isObject(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  function validateState(state) {
    if (!isObject(state) || state.schemaVersion !== SCHEMA_VERSION) {
      return { ok: false, reason: "unsupported-schema" };
    }
    if (!isObject(state.lessonProgress) || !isObject(state.lessonEvidence) ||
        !Array.isArray(state.assessmentAttempts) || !Array.isArray(state.xpTransactions)) {
      return { ok: false, reason: "invalid-state-shape" };
    }

    const transactionIds = new Set();
    const awardedLessons = new Set();
    for (const tx of state.xpTransactions) {
      if (!isObject(tx) || typeof tx.transactionId !== "string" ||
          transactionIds.has(tx.transactionId) || tx.sourceType !== "lesson-completion" ||
          !LESSON_CODES.has(tx.sourceId) || tx.amount !== LESSON_XP ||
          !isObject(tx.evidence) || !tx.evidence.interactiveLab ||
          !tx.evidence.professionalChallenge || !tx.evidence.fieldChecklist ||
          !tx.evidence.learnerAttested || awardedLessons.has(tx.sourceId)) {
        return { ok: false, reason: "invalid-xp-ledger" };
      }
      const lesson = state.lessonProgress[tx.sourceId];
      if (!lesson || lesson.status !== "completed") {
        return { ok: false, reason: "xp-without-completed-lesson" };
      }
      transactionIds.add(tx.transactionId);
      awardedLessons.add(tx.sourceId);
    }

    for (const [code, progress] of Object.entries(state.lessonProgress)) {
      if (!LESSON_CODES.has(code) || !isObject(progress) ||
          !["in-progress", "completed"].includes(progress.status)) {
        return { ok: false, reason: "invalid-lesson-progress" };
      }
      if (progress.status === "completed") {
        const evidence = state.lessonEvidence[code];
        const hasLedgerEntry = state.xpTransactions.some(tx => tx.sourceId === code);
        if (!isObject(evidence) ||
            ["interactiveLab", "professionalChallenge", "fieldChecklist", "learnerAttested"].some(key => evidence[key] !== true) ||
            !hasLedgerEntry) {
          return { ok: false, reason: "completed-lesson-without-evidence-or-xp" };
        }
      }
    }

    for (const [code, evidence] of Object.entries(state.lessonEvidence)) {
      if (!LESSON_CODES.has(code) || !isObject(evidence) ||
          ["interactiveLab", "professionalChallenge", "fieldChecklist", "learnerAttested"]
            .some(key => typeof evidence[key] !== "boolean")) {
        return { ok: false, reason: "invalid-lesson-evidence" };
      }
    }

    const attemptIds = new Set();
    for (const attempt of state.assessmentAttempts) {
      if (!isObject(attempt) || !ASSESSMENT_IDS.has(attempt.assessmentId) ||
          typeof attempt.attemptId !== "string" || attemptIds.has(attempt.attemptId) ||
          !Number.isInteger(attempt.score) || attempt.score < 0 || attempt.score > 100 ||
          typeof attempt.passed !== "boolean" || attempt.passed !== (attempt.score >= PASS_THRESHOLD) ||
          !Number.isInteger(attempt.questionCount) || attempt.questionCount < 1 ||
          !Number.isInteger(attempt.correctCount) || attempt.correctCount < 0 ||
          attempt.correctCount > attempt.questionCount ||
          attempt.score !== Math.round((attempt.correctCount / attempt.questionCount) * 100) ||
          !isObject(attempt.answers)) {
        return { ok: false, reason: "invalid-assessment-attempt" };
      }
      attemptIds.add(attempt.attemptId);
    }

    return { ok: true };
  }

  function getStorage() {
    try {
      return root && root.localStorage ? root.localStorage : null;
    } catch (_) {
      return null;
    }
  }

  let memoryState = freshState();
  let storageAvailable = false;
  let storageWarning = null;

  function readInitialState() {
    const storage = getStorage();
    if (!storage) {
      storageWarning = "browser-storage-unavailable";
      return;
    }
    try {
      const raw = storage.getItem(STORAGE_KEY);
      storageAvailable = true;
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const check = validateState(parsed);
      if (!check.ok) {
        try {
          storage.setItem(STORAGE_KEY + ".recovery." + Date.now(), raw);
        } catch (_) {}
        storageWarning = check.reason;
        return;
      }
      memoryState = parsed;
    } catch (_) {
      storageAvailable = false;
      storageWarning = "storage-read-failed";
    }
  }

  function persist(nextState) {
    nextState.updatedAt = now();
    memoryState = nextState;
    const storage = getStorage();
    if (!storage) {
      storageAvailable = false;
      storageWarning = "browser-storage-unavailable";
      return { ok: true, persisted: false, warning: storageWarning };
    }
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      storageAvailable = true;
      storageWarning = null;
      return { ok: true, persisted: true };
    } catch (_) {
      storageAvailable = false;
      storageWarning = "storage-write-failed";
      return { ok: true, persisted: false, warning: storageWarning };
    }
  }

  function isLessonCode(code) {
    return LESSON_CODES.has(code);
  }

  function isAssessmentId(id) {
    return ASSESSMENT_IDS.has(id);
  }

  function startLesson(code) {
    if (!isLessonCode(code)) return { ok: false, reason: "unknown-lesson" };
    const next = clone(memoryState);
    const current = next.lessonProgress[code];
    if (current && current.status === "completed") {
      return { ok: true, completed: true, persisted: storageAvailable };
    }
    next.lessonProgress[code] = {
      status: "in-progress",
      firstOpenedAt: current ? current.firstOpenedAt : now(),
      updatedAt: now()
    };
    return persist(next);
  }

  function saveLessonEvidence(code, evidence) {
    if (!isLessonCode(code)) return { ok: false, reason: "unknown-lesson" };
    if (!isObject(evidence)) return { ok: false, reason: "invalid-evidence" };
    const allowed = ["interactiveLab", "professionalChallenge", "fieldChecklist", "learnerAttested"];
    const next = clone(memoryState);
    const current = next.lessonEvidence[code] || {
      interactiveLab: false,
      professionalChallenge: false,
      fieldChecklist: false,
      learnerAttested: false
    };
    for (const key of allowed) {
      if (typeof evidence[key] === "boolean") current[key] = evidence[key];
    }
    next.lessonEvidence[code] = current;
    if (!next.lessonProgress[code] || next.lessonProgress[code].status !== "completed") {
      const previous = next.lessonProgress[code] || {};
      next.lessonProgress[code] = {
        status: "in-progress",
        firstOpenedAt: previous.firstOpenedAt || now(),
        updatedAt: now()
      };
    }
    return persist(next);
  }

  function completeLesson(code) {
    if (!isLessonCode(code)) return { ok: false, reason: "unknown-lesson" };
    const existing = memoryState.lessonProgress[code];
    if (existing && existing.status === "completed") {
      return { ok: true, alreadyCompleted: true, xpAwarded: 0, totalXp: getEarnedXp() };
    }
    const evidence = memoryState.lessonEvidence[code] || {};
    const required = ["interactiveLab", "professionalChallenge", "fieldChecklist", "learnerAttested"];
    const missing = required.filter(key => evidence[key] !== true);
    if (missing.length) return { ok: false, reason: "evidence-incomplete", missing };

    const next = clone(memoryState);
    const completedAt = now();
    next.lessonProgress[code] = {
      status: "completed",
      firstOpenedAt: (next.lessonProgress[code] || {}).firstOpenedAt || completedAt,
      completedAt,
      updatedAt: completedAt
    };

    const transactionId = "lesson-completion:" + code;
    if (!next.xpTransactions.some(tx => tx.transactionId === transactionId)) {
      next.xpTransactions.push({
        transactionId,
        sourceType: "lesson-completion",
        sourceId: code,
        amount: LESSON_XP,
        evidence: clone(evidence),
        createdAt: completedAt
      });
    }
    const result = persist(next);
    return Object.assign({ completed: true, alreadyCompleted: false, xpAwarded: LESSON_XP, totalXp: getEarnedXp() }, result);
  }

  function getLessonProgress(code) {
    return {
      progress: memoryState.lessonProgress[code] ? clone(memoryState.lessonProgress[code]) : null,
      evidence: memoryState.lessonEvidence[code] ? clone(memoryState.lessonEvidence[code]) : {
        interactiveLab: false,
        professionalChallenge: false,
        fieldChecklist: false,
        learnerAttested: false
      }
    };
  }

  function submitAssessment(assessment, answers) {
    if (!assessment || !isAssessmentId(assessment.id) || !Array.isArray(assessment.questions) ||
        !assessment.questions.length || !isObject(answers)) {
      return { ok: false, reason: "invalid-assessment" };
    }
    const seen = new Set();
    let correctCount = 0;
    const reviewedAnswers = {};
    for (const question of assessment.questions) {
      if (!question || typeof question.id !== "string" || seen.has(question.id) ||
          !Array.isArray(question.options) || question.options.length < 2 ||
          typeof question.correctOption !== "string" ||
          !question.options.some(option => option && option.id === question.correctOption) ||
          new Set(question.options.map(option => option && option.id)).size !== question.options.length) {
        return { ok: false, reason: "invalid-question-definition" };
      }
      seen.add(question.id);
      const selected = answers[question.id] || null;
      const validOption = selected && question.options.some(option => option.id === selected);
      reviewedAnswers[question.id] = {
        selected: validOption ? selected : null,
        correct: validOption && selected === question.correctOption,
        correctOption: question.correctOption
      };
      if (reviewedAnswers[question.id].correct) correctCount += 1;
    }
    const questionCount = assessment.questions.length;
    const score = Math.round((correctCount / questionCount) * 100);
    const attemptsForAssessment = memoryState.assessmentAttempts.filter(a => a.assessmentId === assessment.id);
    const submittedAt = now();
    const attempt = {
      attemptId: assessment.id + ":" + (attemptsForAssessment.length + 1) + ":" + Date.now(),
      assessmentId: assessment.id,
      attemptNumber: attemptsForAssessment.length + 1,
      score,
      correctCount,
      questionCount,
      passed: score >= PASS_THRESHOLD,
      answers: reviewedAnswers,
      submittedAt
    };
    const next = clone(memoryState);
    next.assessmentAttempts.push(attempt);
    const saved = persist(next);
    return Object.assign({
      ok: true,
      attempt: clone(attempt),
      summary: getAssessmentSummary(assessment.id),
      xpAwarded: 0
    }, saved);
  }

  function getAssessmentSummary(assessmentId) {
    if (!isAssessmentId(assessmentId)) return null;
    const attempts = memoryState.assessmentAttempts
      .filter(item => item.assessmentId === assessmentId)
      .slice()
      .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
    const best = attempts.reduce((current, item) => !current || item.score > current.score ? item : current, null);
    const latest = attempts.length ? attempts[attempts.length - 1] : null;
    return {
      assessmentId,
      attemptCount: attempts.length,
      passed: attempts.some(item => item.passed),
      bestScore: best ? best.score : null,
      latestScore: latest ? latest.score : null,
      latestPassed: latest ? latest.passed : false,
      attempts: clone(attempts)
    };
  }

  function getEarnedXp() {
    return memoryState.xpTransactions.reduce((total, item) => total + item.amount, 0);
  }

  function getCourseStatus(assessmentIds) {
    const ids = Array.isArray(assessmentIds) ? assessmentIds : Array.from(ASSESSMENT_IDS);
    const passedIds = ids.filter(id => {
      const summary = getAssessmentSummary(id);
      return summary && summary.passed;
    });
    const finalPassed = passedIds.includes("bm-final-practical");
    const chaptersPassed = passedIds.filter(id => /^bm-chapter-\d{2}$/.test(id)).length;
    return {
      passedAssessmentCount: passedIds.length,
      totalAssessmentCount: ids.length,
      chaptersPassed,
      totalChapters: 8,
      finalPassed,
      complete: ids.length === 9 && chaptersPassed === 8 && finalPassed
    };
  }

  function getDashboard() {
    const completedLessons = Object.values(memoryState.lessonProgress).filter(item => item.status === "completed").length;
    const inProgressLessons = Object.values(memoryState.lessonProgress).filter(item => item.status === "in-progress").length;
    const attemptedAssessments = new Set(memoryState.assessmentAttempts.map(item => item.assessmentId)).size;
    const course = getCourseStatus();
    return {
      totalLessons: 32,
      completedLessons,
      inProgressLessons,
      notStartedLessons: 32 - completedLessons - inProgressLessons,
      earnedXp: getEarnedXp(),
      availableXp: 32 * LESSON_XP,
      xpTransactions: memoryState.xpTransactions.length,
      attemptedAssessments,
      passedAssessments: course.passedAssessmentCount,
      totalAssessments: course.totalAssessmentCount,
      courseComplete: course.complete,
      certificateEligible: course.complete
    };
  }

  function getCertificateEligibility() {
    const course = getCourseStatus();
    return {
      eligible: course.complete,
      certificateTitle: "Certificate of Completion — Business Mathematics — KPI Academy Foundation Level",
      externalAccreditation: false,
      passedChapterAssessments: course.chaptersPassed,
      totalChapterAssessments: 8,
      finalExamPassed: course.finalPassed,
      rule: "Eight chapter assessments and the final practical examination must each be passed at 80% or above."
    };
  }

  function exportBackup() {
    return JSON.stringify({
      backupTag: BACKUP_TAG,
      app: "KPI Academy",
      schemaVersion: SCHEMA_VERSION,
      exportedAt: now(),
      state: memoryState
    }, null, 2);
  }

  function importBackup(raw) {
    let backup;
    try {
      backup = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch (_) {
      return { ok: false, reason: "invalid-json" };
    }
    if (!isObject(backup) || backup.backupTag !== BACKUP_TAG || backup.app !== "KPI Academy" ||
        backup.schemaVersion !== SCHEMA_VERSION) {
      return { ok: false, reason: "unsupported-backup" };
    }
    const check = validateState(backup.state);
    if (!check.ok) return check;
    const next = clone(backup.state);
    const saved = persist(next);
    return Object.assign({ restored: true }, saved);
  }

  function resetProgress() {
    const next = freshState();
    const result = persist(next);
    return Object.assign({ reset: true }, result);
  }

  readInitialState();

  root.KPI_LEARNING_ENGINE = Object.freeze({
    version: SCHEMA_VERSION,
    storageKey: STORAGE_KEY,
    lessonXp: LESSON_XP,
    passThreshold: PASS_THRESHOLD,
    getState: () => clone(memoryState),
    getStorageStatus: () => ({ persistent: storageAvailable, warning: storageWarning, storage: "localStorage", deviceScope: "single-device" }),
    startLesson,
    saveLessonEvidence,
    completeLesson,
    getLessonProgress,
    submitAssessment,
    getAssessmentSummary,
    getCourseStatus,
    getDashboard,
    getCertificateEligibility,
    exportBackup,
    importBackup,
    resetProgress
  });
})(typeof window !== "undefined" ? window : globalThis);
