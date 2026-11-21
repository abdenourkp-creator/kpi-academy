(function(root){
"use strict";
const STORAGE_KEY="kpiAcademy.liveVenue.shifts.v1";
const MAX_SHIFTS=5;
const DIMENSIONS=["guest","profit","flow","team"];
function clone(value){return JSON.parse(JSON.stringify(value));}
function validSnapshot(item){
  if(!item||typeof item.id!=="string"||!item.id.trim()||
     typeof item.completedAt!=="string"||!Number.isFinite(Date.parse(item.completedAt))||
     !Array.isArray(item.scores)||item.scores.length!==4||
     !item.scores.every(n=>Number.isFinite(n)&&n>=0&&n<=100)||
     !Array.isArray(item.decisions)||item.decisions.length!==6||
     !Array.isArray(item.consequences)||!Array.isArray(item.pending))return false;
  const ordered=item.decisions.every((decision,index)=>
    decision&&decision.eventIndex===index&&Number.isInteger(decision.choiceIndex)&&
    decision.choiceIndex>=0&&decision.choiceIndex<=2&&
    typeof decision.eventTitle==="string"&&typeof decision.choiceLabel==="string"&&
    typeof decision.note==="string"&&Array.isArray(decision.immediateScores)&&
    decision.immediateScores.length===4&&decision.immediateScores.every(n=>Number.isFinite(n)&&n>=0&&n<=100));
  const effects=[...item.consequences,...item.pending];
  return ordered&&effects.every(effect=>effect&&typeof effect.id==="string"&&
    typeof effect.title==="string"&&DIMENSIONS.includes(effect.dimension));
}
function normalize(items){
  if(!Array.isArray(items))return [];
  const seen=new Set(),clean=[];
  for(const item of items){
    if(!validSnapshot(item)||seen.has(item.id))continue;
    seen.add(item.id);clean.push(item);
    if(clean.length===MAX_SHIFTS)break;
  }
  return clean;
}
function createArchive(storage){
  let target=storage,memory=[],persistent=true,readable=true;
  if(arguments.length===0){try{target=root.localStorage;}catch(error){target=null;persistent=false;}}
  function read(){
    if(!target){persistent=false;return clone(memory);}
    let raw;
    try{raw=target.getItem(STORAGE_KEY);}
    catch(error){readable=false;persistent=false;return clone(memory);}
    if(raw===null){memory=[];persistent=true;return [];}
    let parsed;
    try{parsed=JSON.parse(raw);}
    catch(error){memory=[];persistent=true;return [];}
    if(!Array.isArray(parsed)){memory=[];persistent=true;return [];}
    memory=normalize(parsed);
    persistent=true;
    return clone(memory);
  }
  function write(items){
    memory=normalize(items);
    if(!target){persistent=false;return false;}
    try{target.setItem(STORAGE_KEY,JSON.stringify(memory));persistent=readable;return readable;}
    catch(error){persistent=false;return false;}
  }
  function save(snapshot){
    if(!validSnapshot(snapshot))return {saved:false,reason:"incomplete",persistent};
    const current=read();
    if(current.some(item=>item.id===snapshot.id))return {saved:false,duplicate:true,persistent};
    const next=[clone(snapshot),...current].slice(0,MAX_SHIFTS);
    const stored=write(next);
    return {saved:true,persistent:stored,retained:next.length};
  }
  function list(){return read();}
  function compare(newer,older){
    if(!validSnapshot(newer)||!validSnapshot(older))return null;
    return DIMENSIONS.map((key,index)=>({key,before:older.scores[index],after:newer.scores[index],change:newer.scores[index]-older.scores[index]}));
  }
  return {key:STORAGE_KEY,limit:MAX_SHIFTS,save,list,compare,isPersistent:()=>persistent};
}
root.KPI_LIVE_VENUE_ARCHIVE={STORAGE_KEY,MAX_SHIFTS,DIMENSIONS,validSnapshot,createArchive};
})(typeof window!=="undefined"?window:globalThis);
