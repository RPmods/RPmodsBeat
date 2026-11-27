/* Shared, deterministic presentation and CPU helpers for 0.31. */
(function(root){
'use strict';
const directions=['left','up','down','right'];
const difficulty=['easy','normal','hard'];
const names=['LunaVex','AsterNoir','MikaPulse','RenEcho','SoraLynx','NaviRose','KaiTempo','YumiNova','RinSky','EchoMint','VelvetNova','HaruBeat','NekoFrost','MochiRush','KiraBloom','IrisChord','YoruPixel','AkariLoop','NamiNote','VioletSync','AquaRiff','RikaMoon','ZenoWave','EmiQuartz','MiraTempo','KumoStar','SukiDrift','RavenKey','NixMelody','FuyuStep','OrionRush','RubySignal','LioChime','AriSpark','MioFlare','ToriPulse','KyoRhythm','LumiVox','SenaArc','VesperTap','RuiEcho','YunaPhase','KeiStorm','NoraMint','AoiChord','RyoGlide','HanaFlux','NovaReed','MakiSonic','EriBeat','SableTone','KoiWave','RinOrbit','FayeTune','LukaFrost','IonaRush','TamaVex','SumiKey','NeroSync','RinaGlow'];
function hash(value){let h=2166136261;for(const c of String(value)){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0}
function random(seed){let x=hash(seed);x^=x>>>16;x=Math.imul(x,0x7feb352d);x^=x>>>15;x=Math.imul(x,0x846ca68b);return ((x^x>>>16)>>>0)/4294967296}
function roster(seed){const a=names.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random(seed+'|name|'+i)*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,10)}
function botGrade(seed,level,side,slot,index){
 const id=seed+'|'+side+'|'+slot, streak=(random(id+'|phrase|'+Math.floor(index/8))-.5)*.19, form=(random(id+'|form')-.5)*.10;
 const base=({rookie:[.29,.58,.83],standard:[.53,.82,.94],expert:[.77,.94,.99]})[level]||[.53,.82,.94];
 const a=Math.max(.12,Math.min(.90,base[0]+streak+form)), b=Math.max(a+.035,Math.min(.97,base[1]+streak*.65+form*.5)), c=Math.max(b+.012,Math.min(.997,base[2]+streak*.3));
 const u=random(id+'|note|'+index);return u<a?'perfect':u<b?'great':u<c?'good':'miss';
}
function botDelta(seed,level,side,slot,index,w){const g=botGrade(seed,level,side,slot,index),u=random(seed+'|timing|'+side+'|'+slot+'|'+index), sign=u<.5?-1:1, r=random(seed+'|offset|'+side+'|'+slot+'|'+index);const a=g==='perfect'?0:g==='great'?w[0]:g==='good'?w[1]:w[2],b=g==='perfect'?w[0]:g==='great'?w[1]:g==='good'?w[2]:w[3]+.025;return sign*(a+(b-a)*(.1+.8*r))}
function pick(list,u=Math.random()){return list[Math.min(list.length-1,Math.floor(u*list.length))]}
function chooseDifficulty(pref){return difficulty.includes(pref)?pref:pick(difficulty)}
const compatiblePreference=(a,b)=>!a&&!b||!!a&&!!b&&(a==='any'||b==='any'||a===b);
const api={directions,difficulty,hash,random,roster,botGrade,botDelta,pick,chooseDifficulty,compatiblePreference};
if(typeof module==='object'&&module.exports)module.exports=api;else root.CB31=api;
})(typeof window==='object'?window:globalThis);
