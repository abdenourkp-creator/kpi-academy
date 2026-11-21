const assert = require("node:assert/strict");

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
  clear() { this.data.clear(); }
}

global.window = global;
global.localStorage = new MemoryStorage();
const enginePath = require.resolve("../assets/js/learning-engine.js");
function loadEngine() {
  delete require.cache[enginePath];
  require(enginePath);
  return global.KPI_LEARNING_ENGINE;
}

let engine = loadEngine();
assert.equal(engine.getDashboard().earnedXp, 0);
assert.equal(engine.getDashboard().availableXp, 2880);

assert.equal(engine.startLesson("BM-001").ok, true);
assert.equal(engine.getDashboard().inProgressLessons, 1);
assert.equal(engine.getDashboard().earnedXp, 0, "opening a lesson must never award XP");

const blocked = engine.completeLesson("BM-001");
assert.equal(blocked.ok, false);
assert.equal(blocked.reason, "evidence-incomplete");

engine.saveLessonEvidence("BM-001", { interactiveLab: true, professionalChallenge: true });
assert.equal(engine.completeLesson("BM-001").ok, false, "all evidence gates are required");

engine.saveLessonEvidence("BM-001", {
  interactiveLab: true,
  professionalChallenge: true,
  fieldChecklist: true,
  learnerAttested: true
});
const completed = engine.completeLesson("BM-001");
assert.equal(completed.ok, true);
assert.equal(completed.xpAwarded, 90);
assert.equal(engine.getDashboard().earnedXp, 90);
assert.equal(engine.completeLesson("BM-001").xpAwarded, 0, "completion must be idempotent");
assert.equal(engine.getDashboard().earnedXp, 90, "duplicate completion must not duplicate XP");

function assessment(id, count) {
  return {
    id,
    questions: Array.from({ length: count }, (_, i) => ({
      id: id + "-q" + i,
      options: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }],
      correctOption: "B"
    }))
  };
}
const malformed = assessment("bm-final-practical", 2);
malformed.questions[0].correctOption = "Z";
assert.equal(engine.submitAssessment(malformed, {}).ok, false, "unknown answer keys must be rejected");

const sample = assessment("bm-chapter-01", 5);
const passAnswers = Object.fromEntries(sample.questions.map(q => [q.id, "B"]));
const failAnswers = Object.fromEntries(sample.questions.map((q, i) => [q.id, i < 3 ? "B" : "A"]));
const firstAttempt = engine.submitAssessment(sample, passAnswers);
assert.equal(firstAttempt.ok, true);
assert.equal(firstAttempt.attempt.score, 100);
assert.equal(firstAttempt.attempt.passed, true);
assert.equal(firstAttempt.xpAwarded, 0, "assessment attempts do not award XP");
const retry = engine.submitAssessment(sample, failAnswers);
assert.equal(retry.attempt.score, 60);
assert.equal(retry.attempt.passed, false);
const summary = engine.getAssessmentSummary(sample.id);
assert.equal(summary.attemptCount, 2);
assert.equal(summary.bestScore, 100);
assert.equal(summary.latestScore, 60);
assert.equal(summary.passed, true, "a previous passing attempt remains valid after a failed retake");

for (let n = 2; n <= 8; n++) {
  const exam = assessment("bm-chapter-" + String(n).padStart(2, "0"), 5);
  engine.submitAssessment(exam, Object.fromEntries(exam.questions.map(q => [q.id, "B"])));
}
assert.equal(engine.getCourseStatus().chaptersPassed, 8);
assert.equal(engine.getCourseStatus().complete, false, "final examination is mandatory");
assert.equal(engine.getCertificateEligibility().eligible, false);

const finalExam = assessment("bm-final-practical", 10);
engine.submitAssessment(finalExam, Object.fromEntries(finalExam.questions.map(q => [q.id, "B"])));
assert.equal(engine.getCourseStatus().complete, true);
assert.equal(engine.getCertificateEligibility().eligible, true);
assert.equal(engine.getCertificateEligibility().externalAccreditation, false);

const exported = engine.exportBackup();
const snapshot = engine.getDashboard();
engine.resetProgress();
assert.equal(engine.getDashboard().earnedXp, 0);
const restored = engine.importBackup(exported);
assert.equal(restored.ok, true);
assert.equal(restored.restored, true);
assert.equal(engine.getDashboard().earnedXp, snapshot.earnedXp);
assert.equal(engine.getDashboard().passedAssessments, 9);

assert.equal(engine.importBackup("{broken").ok, false);
const wrongBackup = JSON.parse(exported);
wrongBackup.state.xpTransactions.push({
  transactionId: "duplicate",
  sourceType: "lesson-completion",
  sourceId: "BM-001",
  amount: 900,
  evidence: { interactiveLab: true, professionalChallenge: true, fieldChecklist: true, learnerAttested: true }
});
assert.equal(engine.importBackup(wrongBackup).ok, false, "invalid/tampered XP ledger must be rejected");

engine = loadEngine();
assert.equal(engine.getDashboard().earnedXp, snapshot.earnedXp, "state must survive reload from localStorage");
assert.equal(engine.getDashboard().courseComplete, true);

engine.resetProgress();
assert.equal(engine.getDashboard().earnedXp, 0);
const retainedStorage = global.localStorage;
delete global.localStorage;
engine = loadEngine();
assert.equal(engine.getStorageStatus().persistent, false, "missing browser storage must be reported");
const volatileWrite = engine.startLesson("BM-002");
assert.equal(volatileWrite.ok, true);
assert.equal(volatileWrite.persisted, false, "volatile progress must never be described as saved");
global.localStorage = retainedStorage;
engine = loadEngine();
console.log("Learning Engine tests passed: evidence-gated and idempotent XP, attempt history/retakes/best/latest, pass thresholds, course/certificate gate, backup validation, reload persistence, and no-storage warning.");
