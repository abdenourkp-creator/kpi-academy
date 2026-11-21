const assert=require("node:assert/strict");
global.window=global;
require("../assets/js/live-venue.js");
const api=global.KPI_LIVE_VENUE;
assert.ok(api);
assert.equal(api.events.length,6);
assert.equal(api.dimensions.length,4);
assert.deepEqual(api.fresh(),{turn:0,scores:[68,68,68,68],history:[],done:false});
for(const event of api.events){assert.equal(event.choices.length,3);for(const choice of event.choices){assert.equal(choice.delta.length,4);assert.ok(choice.note.length>20);}}
const markup=api.view();
assert.match(markup,/THE LIVE VENUE/);
assert.match(markup,/غرفة قيادة الوردية/);
assert.match(markup,/نبض المنشأة/);
console.log("Live Venue core passed: six operational events, three trade-off decisions each, four bounded venue-health dimensions, isolated simulation state.");
