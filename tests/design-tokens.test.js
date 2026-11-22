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
assert.equal(count(/--success\s*:/g, css), 0, "legacy --success declarations must be retired");
assert.equal(count(/var\(\s*--success\b/g, css), 0, "legacy --success references must be retired");
assert.equal(count(/--warning\s*:/g, css), 0, "legacy --warning declarations must be retired");
assert.equal(count(/var\(\s*--warning\b/g, css), 0, "legacy --warning references must be retired");
assert.equal(count(/--ka-status-warning\s*:/g, css), 1, "status warning token must have one canonical declaration");
assert.match(tokens, /--ka-status-warning\s*:\s*#E7B95C\s*;/, "status warning token must preserve the effective premium warning value");
assert.match(tokens, /--ka-warning\s*:\s*#F5B942\s*;/, "the existing canonical warning accent must remain unchanged");
assert.equal(count(/var\(\s*--ka-status-warning\s*\)/g, styles), 3, "all three legacy warning consumers must use the canonical status token");
assert.equal(count(/--error\s*:/g, css), 0, "legacy --error declarations must be retired");
assert.equal(count(/var\(\s*--error\b/g, css), 0, "legacy --error references must be retired");
assert.equal(count(/--ka-status-error\s*:/g, css), 1, "status error token must have one canonical declaration");
assert.match(tokens, /--ka-status-error\s*:\s*#F06E78\s*;/, "status error token must preserve the effective premium error value");
assert.match(tokens, /--ka-danger\s*:\s*#F2616B\s*;/, "the existing canonical danger accent must remain unchanged");
assert.equal(count(/var\(\s*--ka-status-error\s*\)/g, styles), 7, "all seven legacy error consumers must use the canonical status token");

assert.equal(count(/--ka-layout-content-max-width\s*:/g, css), 1, "content max-width token must have one declaration");
assert.equal(count(/--ka-elevation-card-hover\s*:/g, css), 1, "card hover elevation token must have one declaration");
assert.equal(count(/--ka-status-success\s*:/g, css), 1, "status success token must have one canonical declaration");
assert.match(tokens, /--ka-status-success\s*:\s*#19C987\s*;/, "status success token must preserve the effective premium success value");
assert.equal(count(/var\(\s*--ka-status-success\s*\)/g, styles), 13, "all 13 legacy success consumers must use the canonical status token");
assert.match(tokens, /--ka-success\s*:\s*#2ECC8F\s*;/, "the existing canonical success accent must remain unchanged");
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

assert.equal(
  count(/var\(\s*--text\b/g, css),
  8,
  "only the certificate secondary-copy fallback should leave the legacy --text alias in this task"
);
assert.match(
  styles,
  /\.certificate-panel p\{[^}]*color:\s*var\(--ka-muted\)/,
  "certificate descriptive copy must use the canonical muted fallback"
);
assert.match(
  cssByPath.get("assets/css/premium-experience.css"),
  /\.certificate-panel p(?:,|\s*\{)[^{}]*color:\s*#A2B8C9/,
  "the active premium certificate-copy color must remain unchanged"
);
assert.match(
  tokens,
  /--ka-muted\s*:\s*rgba\(235,243,251,\.72\)\s*;/,
  "canonical muted text token must retain its audited value"
);

console.log(
  "Design token migration tests passed: canonical ownership, preserved layout/elevation and success/warning values, retired aliases, and migrated consumers verified."
);
