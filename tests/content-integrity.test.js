const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));

const modules = readJson("data/modules.json");
const bm = readJson("data/business-mathematics.json");
const accounting = readJson("data/hospitality-accounting-scope.json");
const registry = readJson("data/kpi-registry.json");

assert.deepEqual(modules.map(m => m.id), [
  "business-mathematics",
  "hospitality-accounting",
  "restaurant-kpis"
], "MVP must contain exactly the three approved modules");

assert.equal(bm.moduleId, "business-mathematics");
assert.equal(bm.chapters.length, 8, "Business Mathematics must have 8 chapters");
const lessons = bm.chapters.flatMap(chapter => chapter.lessons);
assert.equal(lessons.length, 32, "Business Mathematics must have 32 lessons");
assert.equal(new Set(lessons.map(lesson => lesson.code)).size, 32, "lesson codes must be unique");
assert.equal(lessons.reduce((sum, lesson) => sum + lesson.availableXp, 0), 2790, "31 eligible lessons award 2,790 XP");
assert.ok(lessons.every(lesson => lesson.availableXp === (lesson.code === "BM-005" ? 0 : 90)), "practice must carry zero XP and eligible lessons 90");
for (const lesson of lessons) {
  assert.ok(fs.existsSync(path.join(root, lesson.sourcePath)), lesson.code + " source file must exist");
  assert.ok(fs.statSync(path.join(root, lesson.sourcePath)).size > 500, lesson.code + " source file appears incomplete");
}

assert.equal(accounting.moduleId, "hospitality-accounting");
assert.equal(accounting.approvedScope.length, 6, "Accounting must preserve the six approved scope areas");
assert.match(accounting.curriculumStatus, /chapter and lesson structure not specified/i);
assert.match(accounting.curriculumNotice, /ليست منهجاً تفصيلياً/);
assert.equal(modules.find(m => m.id === "hospitality-accounting").chapters.length, 0,
  "do not invent Accounting chapters before source approval");

assert.equal(registry.kpis.length, 15, "KPI registry must contain 15 indicators");
assert.equal(new Set(registry.kpis.map(kpi => kpi.id)).size, 15, "KPI IDs must be unique");
for (const kpi of registry.kpis) {
  assert.ok(kpi.name && kpi.formula && kpi.unit && kpi.period, kpi.id + " must define name, formula, unit and period");
  assert.ok(Array.isArray(kpi.inputs) && kpi.inputs.length > 0, kpi.id + " must define inputs");
}
const byId = Object.fromEntries(registry.kpis.map(kpi => [kpi.id, kpi]));
assert.match(byId["sales-mix"].formula, /Unit Mix.*Revenue Mix/);
assert.match(byId.waste.formula, /Food & Beverage COGS/);
assert.match(byId.revpash.formula, /Available Seat Hours/);

console.log("Content integrity passed: 3 modules, 8 chapters, 32 source-backed lessons, 2,790 XP, 6 Accounting scope areas, and 15 KPI definitions.");
