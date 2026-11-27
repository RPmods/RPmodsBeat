/* One cancellable result lifecycle, independent of frame rate and device profile. */
(function(root){
'use strict';
function create({now=()=>Date.now(),schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id),onMusic,onReveal,onCountdown,onExit}){
 let generation=0,timers=new Set(),phase='idle',deadline=0,music=false;
 function later(fn,ms){const token=generation,id=schedule(()=>{timers.delete(id);if(token===generation)fn()},Math.max(0,ms));timers.add(id)}
 function clear(){generation++;for(const id of timers)cancel(id);timers.clear();phase='idle';deadline=0;music=false}
 function pulse(){if(phase!=='results')return;let remaining=Math.max(0,deadline-now());onCountdown(Math.ceil(remaining/1000));if(remaining<=0){clear();onExit();return}later(pulse,Math.min(1000,remaining))}
 function reveal(){if(phase!=='transition')return;phase='results';deadline=now()+40000;onReveal();if(phase==='results')pulse()}
 function transition(){if(phase!=='replay')return;phase='transition';if(!music){music=true;onMusic()}if(phase==='transition')later(reveal,1000)}
 function start(duration){clear();phase='replay';later(transition,Math.max(0,duration-1000))}
 function check(){if(phase==='results'&&now()>=deadline){clear();onCountdown(0);onExit()}}
 return {start,clear,check,get phase(){return phase}};
}
const api={create};if(typeof module==='object'&&module.exports)module.exports=api;else root.CBResult321=api;
})(typeof window==='object'?window:globalThis);
