const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const bank = JSON.parse(fs.readFileSync(path.join(root, "data/assessments/business-mathematics.json"), "utf8"));

assert.equal(bank.moduleId, "business-mathematics");
assert.equal(bank.passThreshold, 80);
assert.equal(bank.retakes, "unlimited");
assert.match(bank.xpPolicy, /no XP/i);
assert.equal(bank.chapterAssessments.length, 8);
assert.equal(bank.finalAssessment.id, "bm-final-practical");

const all = bank.chapterAssessments.concat([bank.finalAssessment]);
assert.equal(all.length, 9);
assert.equal(new Set(all.map(item => item.id)).size, 9);
let total = 0;
const questionIds = new Set();
for (const assessment of all) {
  assert.equal(assessment.questions.length, assessment.questionCount);
  assert.ok(assessment.questionCount > 0);
  for (const question of assessment.questions) {
    assert.ok(question.id && question.prompt && Array.isArray(question.options));
    assert.equal(question.options.length, 4, question.id + " must provide four options");
    assert.equal(new Set(question.options.map(option => option.id)).size, 4);
    assert.ok(question.options.some(option => option.id === question.correctOption), question.id + " answer key must exist");
    assert.ok(question.explanation, question.id + " must explain the answer");
    assert.ok(!questionIds.has(question.id), question.id + " must be globally unique");
    questionIds.add(question.id);
    if (assessment.type === "chapter") {
      assert.match(question.sourceLesson, /^BM-\d{3}$/);
      assert.ok(fs.existsSync(path.join(root, "content/business-mathematics/lessons", question.sourceLesson + ".md")));
    } else {
      assert.equal(question.sourceLesson, null, "integrated final scenarios are not mislabelled as copied lesson questions");
    }
    total += 1;
  }
}
assert.equal(total, 50);
assert.equal(bank.chapterAssessments.reduce((n, item) => n + item.questions.length, 0), 40);
assert.equal(bank.finalAssessment.questions.length, 10);
console.log("Assessment catalog passed: 8 chapter exams + 1 integrated final exam; 50 unique four-option questions; valid answer keys, explanations and source provenance.");
