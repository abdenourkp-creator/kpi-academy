"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const stylesheetPaths = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css)"/g)]
  .map((match) => match[1]);
assert.ok(stylesheetPaths.includes("assets/css/styles.css"), "legacy stylesheet must be loaded");
assert.ok(stylesheetPaths.includes("assets/css/tokens.css"), "canonical token stylesheet must be loaded");
assert.ok(
  stylesheetPaths.indexOf("assets/css/tokens.css") > stylesheetPaths.indexOf("assets/css/styles.css"),
  "canonical tokens must load after the legacy consumers"
);

const cssByPath = new Map(stylesheetPaths.map((relativePath) => [
  relativePath,
  fs.readFileSync(path.join(root, relativePath), "utf8")
]));
const css = [...cssByPath.values()].join("\n");
const tokens = cssByPath.get("assets/css/tokens.css");
const styles = cssByPath.get("assets/css/styles.css");
const count = (pattern, source) => (source.match(pattern) || []).length;

assert.equal(count(/--ka-content\s*:/g, css), 0, "legacy --ka-content declaration must be retired");
assert.equal(count(/--ka-shadow\s*:/g, css), 0, "legacy --ka-shadow declaration must be retired");
assert.equal(count(/var\(\s*--ka-content(?:\s*,|\s*\))/g, css), 0, "legacy --ka-content references must be retired");
assert.equal(count(/var\(\s*--ka-shadow(?:\s*,|\s*\))/g, css), 0, "legacy --ka-shadow references must be retired");

assert.equal(count(/--ka-layout-content-max-width\s*:/g, css), 1, "content max-width token must have one declaration");
assert.equal(count(/--ka-elevation-card-hover\s*:/g, css), 1, "card hover elevation token must have one declaration");
assert.match(tokens, /--ka-layout-content-max-width\s*:\s*1180px\s*;/, "content max-width must preserve 1180px");
assert.match(
  tokens,
  /--ka-elevation-card-hover\s*:\s*0 18px 50px rgba\(20,35,59,\.08\)\s*;/,
  "card hover elevation must preserve the effective legacy shadow"
);
assert.equal(
  count(/var\(\s*--ka-layout-content-max-width\s*\)/g, styles),
  2,
  "page content and footer must retain both content-width consumers"
);
assert.equal(
  count(/var\(\s*--ka-elevation-card-hover\s*\)/g, styles),
  1,
  "module-card hover must retain its elevation consumer"
);

console.log(
  "Design token migration tests passed: canonical ownership, preserved values, retired aliases, and all 3 consumers verified."
);
