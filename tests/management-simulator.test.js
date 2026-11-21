const assert=require("node:assert/strict");
global.window=global;
require("../assets/js/management-simulator.js");
const api=global.KPI_SIMULATOR;
assert.ok(api);
assert.equal(api.stages.length,5);
assert.deepEqual(api.stages.map(x=>x.id),["context","evidence","decision","consequence","reflection"]);
assert.equal(api.scenarios.length,3);
assert.deepEqual(api.scenarios.map(x=>x.id),["food-cost","beverage-cost","labor-cost"]);
for(const scenario of api.scenarios){
 assert.equal(scenario.choices.length,3);
 assert.equal(scenario.choices.filter(x=>x.correct).length,1);
 assert.ok(scenario.evidence.length>=4);
 assert.ok(scenario.reflection.length>20);
}
const view=api.view();
assert.match(view,/بيانات تدريبية افتراضية/);
assert.match(view,/ارتفاع Food Cost/);
assert.match(view,/انحراف تكلفة المشروبات/);
assert.match(view,/ضغط تكلفة العمالة/);
assert.match(view,/لا تمنح XP/);
assert.doesNotMatch(view,/XP متاحة/);
console.log("Management Simulator passed: three explicitly synthetic cases, five stages, one defensible decision per case, no XP or official assessment.");
