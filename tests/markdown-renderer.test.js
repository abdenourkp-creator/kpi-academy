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
const labelMapSource = extract("const AR_TITLES=", "\nfunction arLabel");
const labelSource = extract("function arLabel(value){", "\nwindow.KPI_AR_LABEL");
const escSource = extract("function esc(s){", "\nfunction fmt");
const fmtSource = extract("function fmt(s){", "\nfunction markdownHtml");
const rendererSource = extract("function markdownHtml(md){", "\nasync function lessonView");
const rendererFactory = new Function(
  labelMapSource + "\n" + labelSource + "\n" + escSource + "\n" + fmtSource + "\n" + rendererSource + "\nreturn markdownHtml;"
);
const render = rendererFactory();
const withoutLtrIsolation = html => html.replace(/<span class="ltr-term"[^>]*>(.*?)<\/span>/g, "$1");

const table = render([
  "| Item | Qty | Unit Price | Total |",
  "| --- | --- | --- | --- |",
  "| Water | 24 | 8.50 | 204.00 |",
  "| Juice | 12 | 15.00 | 180.00 |",
  "| Subtotal |  |  | 384.00 |"
].join("\n"));
assert.match(withoutLtrIsolation(table), /<th scope="col">Item<\/th>/);
assert.match(withoutLtrIsolation(table), /<td>Water<\/td>/);
assert.match(table, /<td>384\.00<\/td>/);
assert.doesNotMatch(table, /<td>---<\/td>/);
assert.equal((table.match(/<tr>/g) || []).length, 4, "separator row must not render");

const aligned = render([
  "| KPI | Result |",
  "| :--- | ---: |",
  "| Food Cost | 28% |"
].join("\n"));
assert.match(withoutLtrIsolation(aligned), /<th scope="col">KPI<\/th>/);
assert.match(aligned, /<td>28%<\/td>/);
assert.doesNotMatch(aligned, /:---|---:/);

const prose = render("## Business Controls\n\nReview **every invoice** before posting.");
assert.match(withoutLtrIsolation(prose), /<h2>Business Controls<\/h2>/);
assert.match(withoutLtrIsolation(prose), /<strong>every invoice<\/strong>/);

const lists = render("- First control\n- Second control\n\n1. Verify source\n2. Reconcile POS");
assert.match(withoutLtrIsolation(lists), /<ul><li>First control<\/li><li>Second control<\/li><\/ul>/);
assert.match(withoutLtrIsolation(lists), /<ol><li>Verify source<\/li><li>Reconcile POS<\/li><\/ol>/);


const nested = render("- Main control\n  - Check the source\n  - Verify the unit\n    1. Match the invoice\n    2. Reconcile the POS\n- Final control");
assert.match(withoutLtrIsolation(nested), /<ul><li>Main control<ul><li>Check the source<\/li><li>Verify the unit<ol><li>Match the invoice<\/li><li>Reconcile the POS<\/li><\/ol><\/li><\/ul><\/li><li>Final control<\/li><\/ul>/);
const escapedPipe = render("Level: Foundation \\| Chapter: Numerical Foundations");
assert.match(withoutLtrIsolation(escapedPipe), /Foundation \| Chapter/);

const lineBreak = render("First line<br />Second line");
assert.match(withoutLtrIsolation(lineBreak), /First line Second line/);

const escaped = render("User input: <img src=x onerror=alert(1)>");
assert.doesNotMatch(escaped, /<img/);
assert.match(withoutLtrIsolation(escaped), /&lt;img/);

const lessonDir = path.join(__dirname, "../content/business-mathematics/lessons");
const lessonFiles = fs.readdirSync(lessonDir).filter(name => /^BM-\d{3}\.md$/.test(name)).sort();
assert.equal(lessonFiles.length, 32, "the complete Business Mathematics lesson set must be present");
let totalSourceCharacters = 0;
let renderedTables = 0;
for (const file of lessonFiles) {
  const source = fs.readFileSync(path.join(lessonDir, file), "utf8");
  totalSourceCharacters += source.length;
  const html = render(source);
  assert.ok(html.length > 0, file + " must render non-empty content");
  assert.doesNotMatch(html, /<td>\s*:?-{3,}:?\s*<\/td>/, file + " must not expose Markdown table separators");
  assert.equal((html.match(/<table>/g) || []).length, (html.match(/<\/table>/g) || []).length, file + " table tags must balance");
  renderedTables += (html.match(/<table>/g) || []).length;
}
assert.ok(totalSourceCharacters > 20000, "lesson source set appears unexpectedly truncated");
console.log("Markdown renderer tests passed: 7 feature groups + all " + lessonFiles.length + " lesson files (" + totalSourceCharacters + " source characters; " + renderedTables + " tables rendered).");
