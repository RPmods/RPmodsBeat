// Real local game progression bridge. Never writes a cloud profile.
import * as C from "./core.mjs";
const nonneg=n=>Number.isSafeInteger(n)&&n>=0?n:0;
const dictionary=x=>x&&typeof x==="object"&&!Array.isArray(x)?x:{};
export function readProgress(profile){
 const p=dictionary(profile.rpbProgress);
 return {...C.initialState(),coins:nonneg(profile.coins),crystals:nonneg(profile.tickets),shards:nonneg(p.shards),xp:nonneg(p.xp),seasonXP:nonneg(p.seasonXP),owned:Array.isArray(p.owned)?p.owned.filter(x=>typeof x==="string"):[],progress:dictionary(p.progress),claimed:dictionary(p.claimed),processed:dictionary(p.processed)};
}
function commit(profile,next){
 const {coins,crystals,pity,...progress}=next;
 profile.coins=coins;profile.tickets=crystals;profile.rpbProgress=progress;
}
export function record(profile,result,ms){
 const old=readProgress(profile);
 if(!result||result.completed!==true||result.forfeit===true||!Number.isFinite(result.accuracy)||result.accuracy<20||!Number.isInteger(result.noteCount)||result.noteCount<1||result.judged!==result.noteCount)return false;
 const next=C.recordResult(old,result,ms);if(next===old)return false;commit(profile,next);return true;
}
export function claim(profile,action,ms){
 const old=readProgress(profile);let next=old;
 if(action?.type==="mission"&&C.MISSIONS.some(m=>m.id===action.id))next=C.claimMission(old,action.id,ms);
 else if(action?.type==="bonus"&&["day","week"].includes(action.period))next=C.claimBonus(old,action.period,ms);
 else if(action?.type==="season")next=C.claimSeason(old,action.level);
 else if(action?.type==="all"&&["day","week","season","once"].includes(action.period)){
  for(const m of C.MISSIONS.filter(m=>m.period===action.period))next=C.claimMission(next,m.id,ms);
  if(["day","week"].includes(action.period))next=C.claimBonus(next,action.period,ms);
  if(action.period==="season")for(let n=1;n<=C.SEASON.levels;n++)next=C.claimSeason(next,n);
 }
 if(next===old)return false;commit(profile,next);return true;
}
export function view(profile,period,ms){
 const s=readProgress(profile);return {coins:s.coins,crystals:s.crystals,xp:s.xp,level:1+Math.floor(s.xp/1000),seasonXP:s.seasonXP,seasonLevel:Math.min(50,1+Math.floor(s.seasonXP/1000)),unlocks:[...s.owned],missions:C.MISSIONS.filter(m=>m.period===period).map(m=>({...m,progress:s.progress[C.missionKey(m,ms)]||0,claimed:!!s.claimed[C.missionKey(m,ms)]})),bonus:["day","week"].includes(period)?{claimable:C.claimBonus(s,period,ms)!==s,claimed:!!s.claimed["bonus:"+period+":"+C.periodKey(period,ms)],crystals:period==="day"?2:5}:null,season:period==="season"?Object.entries(C.SEASON_REWARDS).map(([level,reward])=>({level:Number(level),reward,claimed:!!s.claimed["season:s0:"+level],claimable:C.claimSeason(s,Number(level))!==s})):[]};
}
