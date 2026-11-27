/* Stage presentation helpers. No changes to scores, charts or networking. */
(function(root){
'use strict';
function cue(route,t,end){
 if(t>=end||!route.length)return {value:'',ongoing:false};
 const i=route.findIndex(n=>n.t+(n.hold||0)>=t-.18),next=route[i],prev=i<0?route.at(-1):route[i-1];
 const starts=(n,k)=>!k||n.t-(route[k-1].t+(route[k-1].hold||0))>1.5;
 const recent=route.some((n,k)=>t>=n.t-.06&&t<n.t+.65&&starts(n,k));
 const gap=next?next.t-t:Infinity;
 return {value:recent?'GO!':next&&gap>0&&gap<=5&&starts(next,i)?String(Math.ceil(gap)):'',ongoing:!!(next&&gap<=.18||prev&&t-(prev.t+(prev.hold||0))<.65)};
}
function teamAwards(members,totals,solo=false){
 const result=new Map();
 for(const side of solo?[0]:[0,1]){
  const best=members.filter(m=>m.side===side&&m.notes.length&&m.stats.value>0&&!m.departed).sort((a,b)=>b.stats.value/b.notes.length-a.stats.value/a.notes.length||b.stats.maxCombo-a.stats.maxCombo||b.stats.counts.perfect-a.stats.counts.perfect||a.idx-b.idx)[0];
  if(best)result.set(best,solo||totals[0]===totals[1]?'MVP':totals[side]>totals[1-side]?'MVP':'SVP');
 }
 return result;
}
function formation(members,awards){const list=members.slice();const i=list.findIndex(m=>awards.has(m));if(i>=0){const [lead]=list.splice(i,1);list.splice(Math.floor((members.length-1)/2),0,lead)}return list}
function ffaAwards(ranking,departed=()=>false){const result=new Map();if(ranking[0]?.stats.value>0&&!departed(ranking[0]))result.set(ranking[0],'MVP');const second=ranking.slice(1).find(m=>m.stats.value>0&&!departed(m));if(second)result.set(second,'SVP');return result}
const api={cue,teamAwards,formation,ffaAwards};
if(typeof module==='object'&&module.exports)module.exports=api;else root.CBStage32=api;
})(typeof window==='object'?window:globalThis);
