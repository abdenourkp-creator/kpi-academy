(function (root) {
"use strict";
const DIMENSIONS = Object.freeze(["guest", "profit", "flow", "team"]);
const EFFECTS = Object.freeze({
  overbook: { id:"overbook-backlog", delay:3, dimension:"flow", amount:-7, title:"تراكم ضغط المطبخ", detail:"قبول كل الطاولات دون ضبط القدرة التشغيلية خلق طابوراً متأخراً؛ الأثر ظهر الآن لا عند اتخاذ القرار." },
  overload: { id:"team-fatigue", delay:2, dimension:"team", amount:-8, title:"إجهاد الفريق", detail:"تحميل الفريق كل المحطات دون إعادة تصميم العمل خفّض قدرته على الاستجابة." },
  supplierGamble: { id:"supplier-trust", delay:2, dimension:"guest", amount:-8, title:"فقدان ثقة الضيف", detail:"بيع صنف غير مضمون أدى إلى إلغاء أو انتظار غير مبرر." },
  ignoreWaste: { id:"waste-variance", delay:2, dimension:"profit", amount:-9, title:"انحراف تكلفة غير معالج", detail:"تجاهل إشارة الهدر سمح باستمرار فرق الاستهلاك حتى الإغلاق." },
  falseClose: { id:"audit-integrity", delay:1, dimension:"profit", amount:-12, title:"فجوة تدقيق", detail:"تعديل الجرد بلا مستندات خلق رقماً لا يمكن الدفاع عنه في التقرير." }
});
function fresh() {
  return { turn:0, scores:[68,68,68,68], history:[], pending:[], consequences:[], flags:{}, done:false };
}
function clamp(value) { return Math.max(0, Math.min(100, value)); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function schedule(state, key) {
  const spec = EFFECTS[key];
  if (!spec) return;
  state.pending.push({ ...spec, dueAt:state.turn + spec.delay });
}
function resolveDue(state) {
  const due = state.pending.filter(item => item.dueAt <= state.turn);
  state.pending = state.pending.filter(item => item.dueAt > state.turn);
  due.forEach(item => {
    const index = DIMENSIONS.indexOf(item.dimension);
    const before = state.scores[index];
    state.scores[index] = clamp(before + item.amount);
    state.consequences.push({ id:item.id, title:item.title, detail:item.detail, dimension:item.dimension, amount:state.scores[index]-before, turn:state.turn });
    if (item.dimension === "team" && state.scores[3] < 45 && state.scores[2] > 0) {
      const flowBefore = state.scores[2];
      state.scores[2] = clamp(flowBefore - 4);
      state.consequences.push({ id:"fatigue-service-cascade", title:"أخطاء تحت الضغط", detail:"هبوط صحة الفريق إلى مستوى حرج زاد تعثر تدفق الخدمة.", dimension:"flow", amount:state.scores[2]-flowBefore, turn:state.turn });
    }
    if (item.dimension === "flow" && state.scores[2] < 45 && state.scores[0] > 0) {
      const guestBefore = state.scores[0];
      state.scores[0] = clamp(guestBefore - 4);
      state.consequences.push({ id:"service-guest-cascade", title:"تأثر تجربة الضيف", detail:"استمرار اختناق التشغيل انعكس على تجربة الضيوف.", dimension:"guest", amount:state.scores[0]-guestBefore, turn:state.turn });
    }
  });
}
function applyChoice(stateInput, eventIndex, choiceIndex, baseDelta, note) {
  const state = clone(stateInput);
  if (state.done) throw new Error("Shift is already closed.");
  if (eventIndex !== state.turn) throw new Error("Decision does not match the active event.");
  if (!Array.isArray(baseDelta) || baseDelta.length !== 4 || baseDelta.some(n => !Number.isFinite(n))) throw new Error("A decision must provide four numeric dimension changes.");
  if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex > 2) throw new Error("Invalid decision choice.");
  const before = state.scores.slice();
  state.scores = state.scores.map((value, index) => clamp(value + baseDelta[index]));
  const decision = { event:eventIndex, choice:choiceIndex, note:String(note || ""), before, immediate:state.scores.slice(), resolved:[] };
  const key = eventIndex + ":" + choiceIndex;
  const consequenceMap = { "0:1":"overbook", "1:1":"overload", "2:1":"supplierGamble", "3:2":"ignoreWaste", "5:2":"falseClose" };
  if (consequenceMap[key]) schedule(state, consequenceMap[key]);
  state.turn += 1;
  const consequenceStart = state.consequences.length;
  resolveDue(state);
  decision.resolved = state.consequences.slice(consequenceStart);
  state.history.push(decision);
  state.done = state.turn === 6;
  return state;
}
function getOutlook(state) {
  return state.pending.map(item => ({
    title:item.title,
    detail:"أثر مؤجل متوقع بعد " + Math.max(0,item.dueAt-state.turn) + " قرار/قرارات",
    dimension:item.dimension
  }));
}
function validate(state) {
  if (!state || !Number.isInteger(state.turn) || state.turn < 0 || state.turn > 6) return false;
  if (!Array.isArray(state.scores) || state.scores.length !== 4 || state.scores.some(n => !Number.isFinite(n) || n < 0 || n > 100)) return false;
  if (!Array.isArray(state.history) || state.history.length !== state.turn) return false;
  if (!Array.isArray(state.pending) || !Array.isArray(state.consequences)) return false;
  return state.done === (state.turn === 6);
}
root.KPI_LIVE_VENUE_ENGINE = { DIMENSIONS, EFFECTS, fresh, applyChoice, getOutlook, validate };
})(typeof window !== "undefined" ? window : globalThis);