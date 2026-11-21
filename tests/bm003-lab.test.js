"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const window={};vm.runInNewContext(fs.readFileSync("assets/js/bm003-lab.js","utf8"),{window});
const lab=window.KPI_BM003_LAB;assert.ok(lab);assert.equal(lab.taskCount,10);
for(const [id,value] of [["priority","140"],["parentheses","300"],["equal-precedence","27"],["division-first","180"],["bracketed-division","46.67"],["cocktail-cost","14"],["average-check","196.67"],["beverage-cost","30"],["inverse-check","29500"]])assert.equal(lab.evaluate(id,value).correct,true,id+" should be correct");
assert.equal(lab.evaluate("formula-choice","b").correct,true);assert.equal(lab.evaluate("formula-choice","a").correct,false);
assert.equal(lab.evaluate("equal-precedence","24").correct,false);assert.equal(lab.evaluate("average-check","196.67").unit,undefined);
assert.equal(lab.evaluate("priority","").valid,false);assert.equal(lab.evaluate("missing","1").valid,false);
console.log("BM-003 tests passed: precedence, parentheses, left-to-right rules, hospitality formulas, formula choice and inverse check.");
