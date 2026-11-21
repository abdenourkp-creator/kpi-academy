(function(root){
"use strict";
const STORAGE_KEY="kpiAcademy.liveVenue.shifts.v1";
const MAX_SHIFTS=5;
const DIMENSIONS=["guest","profit","flow","team"];
function clone(value){return JSON.parse(JSON.stringify(value));}
function validSnapshot(item){
  return !!item && typeof item.id==="string" && item.id.length>0 &&
    typeof item.completedAt==="string" && Array.isArray(item.scores) && item.scores.length===4 &&
    item.scores.every(n=>Number.isFinite(n)&&n>=0&&n<=100) &&
    Array.isArray(item.decisions) && item.decisions.length===6 &&
    Array.isArray(item.consequences) && Array.isArray(item.pending);
}
function normalize(items){
  if(!Array.isArray(items))return [];
  return items.filter(validSnapshot).slice(0,MAX_SHIFTS);
}
function createArchive(storage){
  let target=storage, memory=[], persistent=true;
  if(arguments.length===0){try{target=root.localStorage;}catch(error){target=null;persistent=false;}}
  function read(){
    if(!target)return clone(memory);
    try{
      const raw=target.getItem(STORAGE_KEY);
      if(raw===null)return clone(memory);
      const parsed=JSON.parse(raw);
      const clean=normalize(parsed);
      memory=clean;
      return clone(clean);
    }catch(error){persistent=false;return clone(memory);}
  }
  function write(items){
    memory=normalize(items);
    if(!target){persistent=false;return false;}
    try{target.setItem(STORAGE_KEY,JSON.stringify(memory));return true;}
    catch(error){
      persistent=false;
      try{
        const reduced=memory.slice(0,MAX_SHIFTS);
        target.setItem(STORAGE_KEY,JSON.stringify(reduced));
        persistent=true;
        return true;
      }catch(retryError){return false;}
    }
  }
  function save(snapshot){
    if(!validSnapshot(snapshot))return {saved:false,reason:"incomplete"};
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
