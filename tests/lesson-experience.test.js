"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("assets/js/lesson-experience.js", "utf8");
const window = {};
vm.runInNewContext(source, { window });

const experience = window.KPI_LESSON_EXPERIENCE;
assert.ok(experience, "lesson experience module should register");
assert.equal(experience.taskCount, 5);
assert.equal(experience.calculatePercent(12000, 40000), 30);
assert.equal(experience.calculatePercent(5000, 20000), 25);
assert.ok(Math.abs(experience.calculatePercent(17000, 60000) - 28.3333333333) < 0.000001);
assert.equal(experience.calculatePercent(100, 0), null);
assert.equal(experience.calculatePercent(-1, 10), null);
assert.equal(experience.calculatePercent("bad", 10), null);

assert.equal(experience.evaluateAnswer("food-cost", "30").correct, true);
assert.equal(experience.evaluateAnswer("food-cost", "29").correct, false);
assert.equal(experience.evaluateAnswer("beverage-cost", "b").correct, true);
assert.equal(experience.evaluateAnswer("labor-cost", "25").correct, true);
assert.equal(experience.evaluateAnswer("interpretation", "b").correct, true);
assert.equal(experience.evaluateAnswer("interpretation", "a").correct, false);
assert.equal(experience.evaluateAnswer("food-cost", "").valid, false);
assert.equal(experience.evaluateAnswer("unknown", "1").valid, false);

console.log("Lesson experience tests passed (5 practical tasks, calculation and feedback validation).");
