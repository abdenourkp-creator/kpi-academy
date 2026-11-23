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

function relativeLuminance(hex) {
  const value = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) throw new Error("Expected a six-digit hex color");
  const channels = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(value.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

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
  1,
  "only the dormant legacy-light body fallback should remain after migrating the active premium shell to its canonical token"
);
assert.equal(
  count(/--ka-text-shell\s*:/g, css),
  1,
  "the premium shell text role must have exactly one canonical declaration"
);
assert.match(
  tokens,
  /--ka-text-shell\s*:\s*#EAF3FC\s*;/,
  "the premium shell text token must preserve the active legacy computed color"
);
assert.match(
  cssByPath.get("assets/css/premium-experience.css"),
  /html,body\{background:#061321;color:var\(--ka-text-shell\)\}/,
  "the active premium shell must consume the canonical shell text token without changing its background"
);
assert.match(
  styles,
  /body\{margin:0;background:var\(--bg\);color:var\(--text\)/,
  "the dormant legacy-light body declaration must remain untouched for the separate disposition task"
);
const shellTextHex = tokens.match(/--ka-text-shell\s*:\s*(#[0-9a-f]{6})/i)?.[1];
assert.ok(shellTextHex, "premium shell text color must be resolvable from the canonical token");
assert.ok(
  contrastRatio(shellTextHex, "#061321") >= 4.5,
  "premium shell text must retain WCAG AA normal-text contrast on the dark shell"
);
assert.match(
  styles,
  /\.lesson-name\{[^}]*color:\s*var\(--ka-text\)/,
  "lesson-row titles must use the canonical primary-text fallback"
);
assert.match(
  cssByPath.get("assets/css/premium-experience.css"),
  /\.lesson-name\{\s*color:\s*#DDEAF4\s*;?\s*\}/,
  "the premium lesson-row title color override must remain unchanged"
);
assert.match(
  styles,
  /\.progress-lesson-link strong\{[^}]*color:\s*var\(--ka-text\)/,
  "progress-list lesson titles must use the canonical primary-text fallback"
);
assert.match(
  cssByPath.get("assets/css/premium-experience.css"),
  /\.progress-lesson-link strong\{\s*color:\s*#E1ECF4\s*;?\s*\}/,
  "the premium progress-list title color override must remain unchanged"
);

assert.equal(
  count(/--ka-text-on-light\s*:/g, css),
  1,
  "the light-surface text role must have one canonical declaration"
);
assert.match(
  tokens,
  /--ka-text-on-light\s*:\s*var\(--ka-ink\)\s*;/,
  "light-surface text must resolve through the canonical ink primitive"
);
assert.match(
  tokens,
  /--ka-ink\s*:\s*#071522\s*;/,
  "the dark ink primitive must retain its audited value"
);
assert.match(
  styles,
  /\.assessment-form\{[^}]*background:\s*#fff\b/i,
  "the assessment form must retain its white surface"
);
assert.match(
  styles,
  /\.quiz-option\{[^}]*color:\s*var\(--ka-text-on-light\)/,
  "unselected quiz options must use the dedicated light-surface text role"
);
assert.match(
  styles,
  /\.quiz-option:has\(input:checked\)\{[^}]*background:\s*var\(--light-blue\)[^}]*color:\s*var\(--ka-text\)/,
  "selected quiz options must use light text on the dark selected surface"
);
const inkHex = tokens.match(/--ka-ink\s*:\s*(#[0-9a-f]{6})/i)?.[1];
const selectedTextHex = tokens.match(/--ka-text\s*:\s*(#[0-9a-f]{6})/i)?.[1];
const selectedSurfaceHex = cssByPath.get("assets/css/premium-experience.css").match(/--light-blue\s*:\s*(#[0-9a-f]{6})/i)?.[1];
assert.ok(inkHex && selectedTextHex && selectedSurfaceHex, "quiz contrast colors must be resolvable from canonical source tokens");
assert.ok(
  contrastRatio(inkHex, "#FFFFFF") >= 4.5,
  "unselected quiz text must meet WCAG AA normal-text contrast on the white assessment surface"
);
assert.ok(
  contrastRatio(selectedTextHex, selectedSurfaceHex) >= 4.5,
  "selected quiz text must meet WCAG AA normal-text contrast on the premium selected surface"
);

assert.match(
  styles,
  /\.certificate-panel p\{[^}]*color:\s*var\(--ka-muted\)/,
  "certificate descriptive copy must use the canonical muted fallback"
);
assert.match(
  cssByPath.get("assets/css/premium-experience.css"),
  /\.certificate-panel p(?:,|\s*\{)[^{}]*\{[^}]*color:\s*#A2B8C9/,
  "the active premium certificate-copy color must remain unchanged"
);
assert.match(
  tokens,
  /--ka-muted\s*:\s*rgba\(235,243,251,\.72\)\s*;/,
  "canonical muted text token must retain its audited value"
);

assert.match(
  styles,
  /\.calc-field\{[^}]*color:\s*var\(--ka-text\)/,
  "calculator field labels must use the canonical primary-text fallback"
);
assert.match(
  tokens,
  /--ka-text\s*:\s*#F3F7FC\s*;/,
  "canonical primary text token must retain its audited value"
);
assert.match(
  cssByPath.get("assets/css/premium-experience.css"),
  /\.calc-section h2,\.calc-field\s*\{\s*color:\s*#E2ECF4\s*;?\s*\}/,
  "the premium calculator field-label color override must remain unchanged"
);

assert.match(
  styles,
  /\.calc-field input,\.calc-field select\{[^}]*color:\s*var\(--ka-text\)/,
  "calculator input and select fallbacks must use the canonical primary-text token"
);
assert.match(
  cssByPath.get("assets/css/premium-experience.css"),
  /\.calc-field input,\.calc-field select\{[^}]*color:\s*#F2F7FB\s*;?\s*\}/,
  "the premium calculator input/select color override must remain unchanged"
);

assert.match(
  styles,
  /\.result-details dd\{[^}]*color:\s*var\(--ka-text\)/,
  "calculated result detail values must use the canonical primary-text fallback"
);
assert.match(
  cssByPath.get("assets/css/premium-experience.css"),
  /\.result-details dd\{\s*color:\s*#E5EFF6\s*;?\s*\}/,
  "the premium calculated-result detail color override must remain unchanged"
);

console.log(
  "Design token migration tests passed: canonical ownership, preserved layout/elevation and status values, light-surface quiz contrast, retired aliases, and migrated consumers verified."
);
