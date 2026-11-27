/* Team Sync v1: deterministic shared routes, equal per-note base weight and bounded bonus. */
(function(root){
'use strict';
const revision='team-sync-v1',baseMax=13000,bonusMax=1500,pattern=[1,2,1,3,2,'all',1,2,3,'all'];
function plan(base,n){
 if(!Number.isInteger(n)||n<3||n>5)throw Error('Team Sync requires 3–5 members');
 const routes=Array.from({length:n},()=>[]),groups=[],slots=[],counts=Array(n).fill(0);
 let chunk=[];
 for(let i=0;i<base.length;i++){
  const note=base[i],prev=base[i-1];
  if(chunk.length&&(note.t-prev.t>1.25||note.t-base[chunk[0]].t>=5.2||chunk.length>=13)){groups.push(chunk);chunk=[]}
  chunk.push(i);
 }
 if(chunk.length)groups.push(chunk);
 let sharedWeight=0;
 for(let g=0;g<groups.length;g++){
  const group=groups[g],kind=pattern[g%pattern.length],width=kind==='all'?n:Math.min(n,kind);
  const order=Array.from({length:n},(_,i)=>i).sort((a,b)=>counts[a]-counts[b]||((a-g%n+n)%n)-((b-g%n+n)%n)).slice(0,width);
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
