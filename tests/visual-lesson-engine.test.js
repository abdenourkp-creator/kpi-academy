"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync("assets/js/visual-lesson-engine.js", "utf8");
const window = { setInterval, clearInterval };
vm.runInNewContext(source, { window });
const engine = window.KPI_VISUAL_LESSON_ENGINE;
assert.ok(engine, "visual lesson engine should register");
assert.equal(engine.version, "0.1.0");
const markdown = [
  "# BM-001 — Understanding Numbers",
  "## 1. Business Mystery — A Small Decimal, a Large Loss",
  "فرق بسيط في السعر قد يؤدي إلى خسارة كبيرة.",
  "## 2. What Is a Number?",
  "الأعداد تمثل كميات أو قيماً أو قياسات.",
  "## 3. Place Value — قيمة المنزلة",
  "في العدد 348.75 لكل رقم منزلة مختلفة.",
  "## 4. Worked Case — Invoice Check",
  "تحقق من مجموع الفاتورة قبل اعتمادها.",
  "## 5. Hospitality Applications",
  "راجع أسعار المشتريات والمخزون.",
  "## 6. Common Mistakes",
  "لا تهمل الفواصل العشرية والوحدات.",
  "## 7. Professional Challenge",
  "احسب الأثر المالي للفرق.",
  "## 8. Field Checklist",
  "راجع المصدر والوحدة والنتيجة."
].join("\n");
const sections = engine.extractSections(markdown);
assert.equal(sections.length, 8);
assert.equal(sections[0].title, "1. Business Mystery — A Small Decimal, a Large Loss");
const storyboard = engine.buildStoryboard({ code: "BM-001", title: "Understanding Numbers", markdown });
assert.equal(storyboard.lessonCode, "BM-001");
assert.equal(storyboard.scenes.length, 8);
assert.equal(storyboard.duration, 90);
assert.deepEqual(Array.from(storyboard.scenes, scene => scene.duration), [9, 11, 11, 12, 13, 12, 11, 11]);
assert.equal(storyboard.languageModes.includes("ar"), true);
assert.equal(storyboard.languageModes.includes("en"), true);
assert.equal(storyboard.scenes[0].kind, "hook");
assert.equal(storyboard.scenes[3].kind, "worked");
assert.equal(storyboard.scenes[5].kind, "mistakes");
assert.ok(storyboard.scenes.every(scene => scene.title && scene.visual.pattern));
const sparse = engine.buildStoryboard({ code: "TEST-001", title: "Minimal lesson", markdown: "# Minimal lesson\n\n## Core idea\n\nA simple educational concept." });
assert.equal(sparse.scenes.length, 8);
assert.equal(sparse.duration, 90);
assert.ok(sparse.scenes.every(scene => typeof scene.summary === "string"));
console.log("Visual lesson engine tests passed (8-scene storyboard, 90-second timing, role selection, fallback handling).");
