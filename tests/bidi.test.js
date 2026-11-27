"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const source=fs.readFileSync(require("node:path").join(__dirname,"../assets/js/bidi.js"),"utf8");
const created=[];
const document={createElement(tag){assert.equal(tag,"bdi");const el={tagName:tag.toUpperCase(),attrs:{},lang:"",dir:"",set textContent(v){this.text=v}};created.push(el);return el;},documentElement:{lang:"ar",dir:"rtl"}};
const window={KPI:{i18n:{ar:{dir:"rtl"},en:{dir:"ltr"}}}};
vm.runInNewContext(source,{window,document});
const samples=[
 ["إجمالي الفاتورة 1250.50 MAD","ar"],
 ["MAD 125.00","en"],
 ["2026/11/21 — INV-0048","en"],
 ["Food Cost: 32.5%","en"],
 ["افتح POS-INV-204","ar"],
 ["support@example.com","en"],
 ["https://example.com/a?x=1&y=2","en"],
 ["(12.5%) — [Draft]","en"],
 ["2.5 kg + 500 ml","en"],
 ["إجمالي: (MAD 1,250.50) — INV-0048","ar"]
];
for(const [value,lang] of samples){const el=window.KPI.bidi.isolate(value,lang);assert.equal(el.text,value);assert.equal(el.lang,lang);assert.equal(el.dir,lang==="ar"?"rtl":"ltr");}
assert.equal(window.KPI.bidi.setLanguage("en"),true);
assert.equal(document.documentElement.lang,"en");
assert.equal(document.documentElement.dir,"ltr");
assert.equal(window.KPI.bidi.setLanguage("ar"),true);
assert.equal(document.documentElement.lang,"ar");
assert.equal(document.documentElement.dir,"rtl");
assert.equal(window.KPI.bidi.setLanguage("fr"),false);
assert.equal(created.length,samples.length);
console.log("BiDi tests passed: "+samples.length+" mixed-script, currency, numeric, punctuation, URL, identifier, and unit cases plus language switching.");
