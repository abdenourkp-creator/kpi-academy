"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const window={};vm.runInNewContext(fs.readFileSync("assets/js/bm002-lab.js","utf8"),{window});
const lab=window.KPI_BM002_LAB;assert.ok(lab);assert.equal(lab.taskCount,7);
for(const [id,value] of [["sales-total","4075"],["report-gap","1200"],["line-revenue","1530"],["average-check","150"],["cogs","13000"],["water-variance","-2"]])assert.equal(lab.evaluate(id,value).correct,true,id+" should calculate correctly");
assert.equal(lab.evaluate("report-gap","1200").unit,"MAD");assert.equal(lab.evaluate("water-variance","2").correct,false,"variance sign must follow Actual minus Expected");
assert.equal(lab.evaluate("management-action","c").correct,true);assert.equal(lab.evaluate("management-action","a").correct,false);
assert.equal(lab.evaluate("average-check","").valid,false);assert.equal(lab.evaluate("unknown","1").valid,false);
console.log("BM-002 lab tests passed: seven arithmetic/reconciliation tasks, variance sign, validation and management decision.");
