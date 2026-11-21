const assert = require("node:assert/strict");
global.window = global;
require("../assets/js/live-venue-engine.js");
const engine = global.KPI_LIVE_VENUE_ENGINE;
assert.ok(engine);
assert.deepEqual(engine.fresh(), {
  turn: 0, scores: [68, 68, 68, 68], history: [], pending: [], consequences: [], flags: {}, done: false
});
let state = engine.fresh();
assert.equal(engine.validate(state), true);
state = engine.applyChoice(state, 0, 1, [-5, 5, -8, -4], "قبول كل الطاولات");
assert.equal(state.turn, 1);
assert.equal(state.pending.length, 1);
assert.equal(state.pending[0].id, "overbook-backlog");
assert.equal(state.consequences.length, 0);
assert.equal(engine.getOutlook(state).length, 1);
assert.throws(() => engine.applyChoice(state, 0, 0, [0, 0, 0, 0], "قرار خارج التسلسل"), /active event/);
state = engine.applyChoice(state, 1, 0, [3, 2, 5, 7], "إعادة توزيع الفريق");
assert.equal(state.consequences.length, 1, "delayed consequence must resolve on its scheduled decision");
assert.equal(state.consequences[0].id, "overbook-backlog");
assert.equal(state.scores[2], 58, "backlog must affect flow after a delay, not at decision time");
assert.equal(state.pending.length, 0);
assert.equal(engine.validate(state), true);

let cascade = engine.fresh();
cascade = engine.applyChoice(cascade, 0, 1, [-5, 5, -8, -4], "فتح كل الطاولات");
cascade = engine.applyChoice(cascade, 1, 1, [-4, 1, -7, -9], "تحميل الفريق");
cascade = engine.applyChoice(cascade, 2, 1, [-7, 3, -8, -3], "الاستمرار في بيع صنف غير مضمون");
assert.ok(cascade.consequences.some(item => item.id === "overbook-backlog"));
assert.ok(cascade.consequences.some(item => item.id === "service-guest-cascade"),
  "critical flow failure must cascade into guest experience");
assert.equal(engine.validate(cascade), true);

let waste = engine.fresh();
waste = engine.applyChoice(waste, 0, 0, [5, 3, 7, 4], "إعادة توزيع");
waste = engine.applyChoice(waste, 1, 0, [3, 2, 5, 7], "تبسيط قائمة المشروبات");
waste = engine.applyChoice(waste, 2, 0, [4, 1, 6, 5], "تحديث التوفر");
waste = engine.applyChoice(waste, 3, 2, [-8, 0, -5, -1], "تجاهل الهدر");
waste = engine.applyChoice(waste, 4, 0, [-2, 2, 10, 4], "استعادة الضيف");
assert.ok(waste.consequences.some(item => item.id === "waste-variance"),
  "unresolved waste must affect profit later in the shift");

let closed = engine.applyChoice(waste, 5, 2, [-10, -10, -2, -3], "تعديل الجرد دون مستندات");
assert.equal(closed.done, true);
assert.ok(closed.consequences.some(item => item.id === "audit-integrity"));
assert.throws(() => engine.applyChoice(closed, 6, 0, [0, 0, 0, 0], "قرار بعد الإغلاق"), /already closed/);
assert.equal(engine.validate(closed), true);
console.log("Live Venue causal engine passed: ordered decisions, delayed effects, forecasts, cascading operational failure, close-out integrity, and immutable state transitions.");
