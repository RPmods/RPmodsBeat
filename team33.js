/* Team Sync v1: deterministic shared routes, equal per-note base weight and bounded bonus. */
(function(root){
'use strict';
const revision='team-sync-v2',baseMax=13000,bonusMax=1500,pattern=[1,2,1,3,2,'all',1,2,3,'all'];
function plan(base,n,sections=[],seed='default'){
 if(!Number.isInteger(n)||n<3||n>5)throw Error('Team Sync requires 3–5 members');
 const routes=Array.from({length:n},()=>[]),groups=[],slots=[],counts=Array(n).fill(0);
 let chunk=[],lastSection=null;
 const at=t=>sections.find(x=>t>=x.start&&t<x.end)||null;
 function random(g){let h=2166136261;for(const c of seed+'|'+g)h=Math.imul(h^c.charCodeAt(0),16777619);h^=h>>>16;h=Math.imul(h,0x7feb352d);h^=h>>>15;h=Math.imul(h,0x846ca68b);h^=h>>>16;return (h>>>0)/4294967296}
 for(let i=0;i<base.length;i++){
  const note=base[i],prev=base[i-1],section=at(note.t);
  if(chunk.length&&(section!==lastSection||((!section||section.mode==='auto')&&(note.t-prev.t>1.25||note.t-base[chunk[0]].t>=5.2||chunk.length>=13)))){groups.push(chunk);chunk=[]}
  chunk.push(i);lastSection=section;
 }
 if(chunk.length)groups.push(chunk);
 let sharedWeight=0;
 for(let g=0;g<groups.length;g++){
  const group=groups[g],section=at(base[group[0]].t),kind=section?.mode==='all'?'all':section?.mode==='relay'?1:section?.mode==='duo'?2:section?.mode==='trio'?3:sections.length?2+Math.floor(random(g+'|width')*Math.min(2,n-2)):pattern[g%pattern.length],width=kind==='all'?n:Math.min(n,kind);
  const shift=Math.floor(random(g)*n),order=section?.mode==='relay'?[((section.slot-1)%n+n)%n]:Array.from({length:n},(_,i)=>i).sort((a,b)=>counts[a]-counts[b]||((a-shift+n)%n)-((b-shift+n)%n)).slice(0,width);
  for(const i of group){
   slots[i]=order.slice();
   if(width>1)sharedWeight+=width/n;
   for(const j of order){routes[j].push({...base[i],teamIndex:i,teamWidth:width});counts[j]++}
  }
 }
 return {routes,slots,sharedWeight,size:n,length:base.length};
}
function totals(p,members,weights,limit=Infinity){
 const values=[new Float64Array(p.length),new Float64Array(p.length)],hits=[new Uint8Array(p.length),new Uint8Array(p.length)],minimum=[new Float64Array(p.length).fill(1),new Float64Array(p.length).fill(1)];
 for(const m of members){
  const side=m.side;if(side!==0&&side!==1)continue;
  const seen=new Set();
  for(const e of m.stats.events){
   const i=e.teamIndex;if(e.t>limit||!Number.isInteger(i)||!p.slots[i]?.includes(m.idx)||seen.has(i)||!Object.hasOwn(weights,e.g))continue;
   seen.add(i);const v=weights[e.g];values[side][i]+=v;hits[side][i]++;minimum[side][i]=Math.min(minimum[side][i],v);
  }
 }
 return [0,1].map(side=>{
  let base=0,bonus=0;
  for(let i=0;i<p.length;i++){
   const width=p.slots[i].length;base+=values[side][i]/width;
   if(width>1&&hits[side][i]===width)bonus+=minimum[side][i]*width/p.size;
  }
  const basePoints=Math.round(baseMax*base/Math.max(1,p.length)),bonusPoints=Math.round(bonusMax*bonus/(p.sharedWeight||1));
  return {base:basePoints,bonus:bonusPoints,total:basePoints+bonusPoints};
 });
}
const api={revision,baseMax,bonusMax,plan,totals};
if(typeof module==='object'&&module.exports)module.exports=api;else root.CBTeam33=api;
})(typeof window==='object'?window:globalThis);
