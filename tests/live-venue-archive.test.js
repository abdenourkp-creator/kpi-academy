const assert=require("node:assert/strict");
global.window=global;
require("../assets/js/live-venue-archive.js");
const archiveApi=global.KPI_LIVE_VENUE_ARCHIVE;
function snapshot(id,offset=0){
  return {id,completedAt:"2026-11-21T10:00:00.000Z",scores:[70+offset,65+offset,80-offset,72],
    decisions:Array.from({length:6},(_,i)=>({eventIndex:i,eventTitle:"Event "+i,choiceIndex:i%3,choiceLabel:"Choice "+(i%3),note:"Note "+i,immediateScores:[70,65,80,72]})),
    consequences:[{id:"effect-"+id,title:"Resolved effect",dimension:"flow",amount:-4}],
    pending:[{id:"pending-"+id,title:"Unresolved effect",dimension:"profit",dueAt:7}]};
}
function memoryStorage(seed=null,failGet=false,failSet=false){
  let value=seed;
  return {getItem(){if(failGet)throw Error("storage unavailable");return value;},
    setItem(key,next){if(failSet)throw Error("quota exceeded");value=next;},
    raw(){return value;}};
}
let storage=memoryStorage();
let archive=archiveApi.createArchive(storage);
assert.equal(archive.save({...snapshot("unfinished"),decisions:[]}).reason,"incomplete","incomplete shifts must never be saved");
assert.equal(archive.list().length,0);
assert.equal(archive.save(snapshot("one")).saved,true);
assert.equal(archive.save(snapshot("one")).duplicate,true,"saving the same session twice must be idempotent");
assert.equal(archive.list().length,1);
archive.save(snapshot("two",1));archive.save(snapshot("three",2));
const comparison=archive.compare(archive.list()[0],archive.list()[1]);
assert.deepEqual(comparison.map(item=>item.change),[1,1,-1,0],"comparison must report every dimension independently");
archive.save(snapshot("four",3));archive.save(snapshot("five",4));archive.save(snapshot("six",5));
assert.equal(archive.list().length,5,"archive must retain at most five completed shifts");
assert.equal(archive.list()[0].id,"six");
assert.equal(archive.list().some(item=>item.id==="one"),false,"oldest shifts must be evicted first");
assert.equal(archiveApi.validSnapshot({}),false);
const malformed=snapshot("malformed");malformed.decisions[4].eventIndex=1;
assert.equal(archiveApi.validSnapshot(malformed),false,"decision history must contain all six events in exact order");
const duplicateStorage=memoryStorage(JSON.stringify([snapshot("same"),snapshot("same")]));
assert.equal(archiveApi.createArchive(duplicateStorage).list().length,1,"duplicate session IDs in legacy storage must be deduplicated");

const corrupt=memoryStorage("{broken-json");
const corruptArchive=archiveApi.createArchive(corrupt);
assert.deepEqual(corruptArchive.list(),[],"corrupt storage must degrade to an empty archive");
assert.equal(corruptArchive.save(snapshot("recovered")).saved,true,"a later valid save must recover from corrupt storage");
assert.equal(corruptArchive.isPersistent(),true,"malformed JSON must not be confused with unavailable storage");
assert.equal(JSON.parse(corrupt.raw()).length,1);

const unavailable=memoryStorage(null,true,false);
const unavailableArchive=archiveApi.createArchive(unavailable);
assert.deepEqual(unavailableArchive.list(),[]);
assert.equal(unavailableArchive.save(snapshot("memory-only")).saved,true);
assert.equal(unavailableArchive.isPersistent(),false,"storage failures must be exposed as local-only fallback");

const quota=memoryStorage(null,false,true);
const quotaArchive=archiveApi.createArchive(quota);
assert.equal(quotaArchive.save(snapshot("quota")).persistent,false,"quota failures must not be reported as persistent saves");
assert.equal(quotaArchive.list().length,1,"failed persistence may retain a session-only in-memory copy");

const schemaMismatch=memoryStorage(JSON.stringify([{id:"legacy",completedAt:"now",scores:[1,2,3,4],decisions:[],consequences:[],pending:[]}]));
const schemaArchive=archiveApi.createArchive(schemaMismatch);
assert.deepEqual(schemaArchive.list(),[],"incompatible archive versions must be ignored safely");
console.log("Live Venue archive passed: completed-only persistence, idempotency, five-shift retention, four-dimension comparison, corrupt/unavailable/quota storage, and schema isolation.");
