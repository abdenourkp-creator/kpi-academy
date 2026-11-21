"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
assert.ok(!html.includes("\\n<link"),"HTML head must not contain a literal escaped newline between tags");
assert.equal((html.match(/id="sidebar"/g)||[]).length,1,"sidebar ID must be unique");
assert.equal((html.match(/id="app"/g)||[]).length,1,"application mount ID must be unique");
assert.equal((html.match(/id="menuToggle"/g)||[]).length,1,"mobile menu ID must be unique");
const tags=html.match(/<[a-z][^>]*>/gi)||[];
for(const tag of tags){
  const attrs=[...tag.matchAll(/\s([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=|\s|>)/g)].map(match=>match[1].toLowerCase());
  const seen=new Set();
  for(const attr of attrs){assert.ok(!seen.has(attr),"duplicate "+attr+" attribute in "+tag);seen.add(attr);}
}
const localRefs=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match=>match[1])
  .filter(value=>!value.startsWith("#")&&!/^(?:https?:|data:|mailto:|tel:|\/\/)/i.test(value));
for(const ref of localRefs){
  const clean=ref.split(/[?#]/)[0];
  assert.ok(fs.existsSync(path.join(root,clean)),"HTML references missing local asset: "+clean);
}
const archiveScript=html.indexOf('src="assets/js/live-venue-archive.js"');
const venueScript=html.indexOf('src="assets/js/live-venue.js"');
assert.ok(archiveScript>=0&&venueScript>archiveScript,"archive module must load before Live Venue UI");
assert.equal((html.match(/<script\b/g)||[]).length,(html.match(/<\/script>/g)||[]).length,"script tags must be balanced");
assert.equal((html.match(/<link\\b/g)||[]).length,(html.match(/<link\\b[^>]*>/g)||[]).length,"stylesheet tags must be well formed");
console.log("Release integrity passed: HTML structure, unique app mounts, duplicate attributes, local asset references, and Live Venue dependency order.");
