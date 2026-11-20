const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const appSource = fs.readFileSync(path.join(__dirname, "../assets/js/app.js"), "utf8");
function extract(startMarker, endMarker) {
  const start = appSource.indexOf(startMarker);
  const end = appSource.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, "Could not extract " + startMarker);
  return appSource.slice(start, end).trim();
}
const escSource = extract("function esc(s){", "\nfunction fmt");
const fmtSource = extract("function fmt(s){", "\nfunction markdownHtml");
const rendererSource = extract("function markdownHtml(md){", "\nasync function lessonView");
const rendererFactory = new Function(
  escSource + "\n" + fmtSource + "\n" + rendererSource + "\nreturn markdownHtml;"
);
const render = rendererFactory();

const table = render([
  "| Item | Qty | Unit Price | Total |",
  "| --- | --- | --- | --- |",
  "| Water | 24 | 8.50 | 204.00 |",
  "| Juice | 12 | 15.00 | 180.00 |",
  "| Subtotal |  |  | 384.00 |"
].join("\n"));
assert.match(table, /<th>Item<\/th>/);
assert.match(table, /<td>Water<\/td>/);
assert.match(table, /<td>384\.00<\/td>/);
assert.doesNotMatch(table, /<td>---<\/td>/);
assert.equal((table.match(/<tr>/g) || []).length, 4, "separator row must not render");

const aligned = render([
  "| KPI | Result |",
  "| :--- | ---: |",
  "| Food Cost | 28% |"
].join("\n"));
assert.match(aligned, /<th>KPI<\/th>/);
assert.match(aligned, /<td>28%<\/td>/);
assert.doesNotMatch(aligned, /:---|---:/);

const prose = render("## Business Controls\n\nReview **every invoice** before posting.");
assert.match(prose, /<h2>Business Controls<\/h2>/);
assert.match(prose, /<strong>every invoice<\/strong>/);

const lists = render("- First control\n- Second control\n\n1. Verify source\n2. Reconcile POS");
assert.match(lists, /<ul><li>First control<\/li><li>Second control<\/li><\/ul>/);
assert.match(lists, /<ol><li>Verify source<\/li><li>Reconcile POS<\/li><\/ol>/);

const lineBreak = render("First line<br />Second line");
assert.match(lineBreak, /First line Second line/);

const escaped = render("User input: <img src=x onerror=alert(1)>");
assert.doesNotMatch(escaped, /<img/);
assert.match(escaped, /&lt;img/);

console.log("Markdown renderer tests passed: 7 groups (tables, aligned separators, headings, emphasis, lists, line breaks, HTML escaping).");
