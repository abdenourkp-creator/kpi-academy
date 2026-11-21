"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const registryPath = path.join(__dirname, "..", "data", "visual-assets.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
assert.equal(registry.schemaVersion, 1);
assert.ok(Array.isArray(registry.assets) && registry.assets.length >= 1);
const ids = new Set();
for (const asset of registry.assets) {
  assert.ok(asset.id && !ids.has(asset.id), "asset IDs must be present and unique");
  ids.add(asset.id);
  assert.ok(asset.name && asset.category && asset.module && asset.purpose);
  assert.ok(asset.localPath, asset.id + " must declare a local path");
  const absolute = path.join(__dirname, "..", asset.localPath);
  assert.ok(fs.existsSync(absolute), asset.id + " path must exist: " + asset.localPath);
  assert.ok(fs.statSync(absolute).size > 100, asset.id + " file must not be empty");
  if (asset.localPath.endsWith(".svg")) {
    const svg = fs.readFileSync(absolute, "utf8");
    assert.match(svg, /^<svg\s/);
    assert.match(svg, /viewBox=/);
    assert.match(svg, /<title/);
    assert.match(svg, /<desc/);
    assert.match(svg, /<\/svg>\s*$/);
  }
}
console.log("Visual asset registry tests passed (" + registry.assets.length + " assets; all local paths and SVG accessibility metadata verified).");
