/* RPB Event Engine v1. Cosmetic cues only; never changes notes, input, scoring or audio. */
(function(root){"use strict";
const diffs=["easy","normal","hard"],types=["dialogue","caption","light"],tones=["cherry","nova","violet","gold"];
const validText=(s,n)=>typeof s==="string"&&s.trim().length>0&&s.length<=n;
function compile(chart,diff){
 if(!diffs.includes(diff)||!Number.isFinite(chart?.duration)||chart.duration<=0)throw Error("Ruta inválida");
 if(chart.events===undefined)return [];
 if(!chart.events||chart.events.version!==1||!Array.isArray(chart.events.cues)||chart.events.cues.length>512)throw Error("Formato de eventos inválido");
 const result=[],ids=new Set();
 for(const cue of chart.events.cues){
  if(!cue||!validText(cue.id,64)||ids.has(cue.id)||!types.includes(cue.type)||!Number.isFinite(cue.start)||!Number.isFinite(cue.end)||cue.start<0||cue.end<=cue.start||cue.end>chart.duration)throw Error("Evento inválido");
  ids.add(cue.id);
  if(cue.difficulties!==undefined&&(!Array.isArray(cue.difficulties)||!cue.difficulties.length||cue.difficulties.some(d=>!diffs.includes(d))))throw Error("Dificultad inválida");
  if(cue.type==="light"&&!tones.includes(cue.tone))throw Error("Luz inválida");
  if(cue.type!=="light"&&!validText(cue.text,240))throw Error("Texto inválido");
  if(cue.type==="dialogue"&&!validText(cue.speaker,48))throw Error("Personaje inválido");
  if(cue.difficulties&&!cue.difficulties.includes(diff))continue;
  result.push({id:cue.id,type:cue.type,start:cue.start,end:cue.end,...(cue.type==="light"?{tone:cue.tone}:{text:cue.text,...(cue.type==="dialogue"?{speaker:cue.speaker}:{})})});
 }
 result.sort((a,b)=>a.start-b.start||a.id.localeCompare(b.id));
 // Single cue per channel; subtitles must never overlap each other.
 const endByChannel={text:-1,light:-1};
 for(const cue of result){const channel=cue.type==="light"?"light":"text";if(cue.start<endByChannel[channel])throw Error("Eventos superpuestos: "+channel);endByChannel[channel]=cue.end}
 return result;
}
function sample(cues,seconds){
 if(!Number.isFinite(seconds)||seconds<0)return {text:null,light:null};
 let text=null,light=null;
 for(const cue of cues){if(cue.start>seconds)break;if(seconds>=cue.end)continue;if(cue.type==="light")light=cue;else text=cue}
 return {text,light};
}
function controller(chart,diff,paint){
 const cues=compile(chart,diff);let key=null;
 function update(t){if(!cues.length)return;const frame=sample(cues,t),next=(frame.text?.id||"")+"|"+(frame.light?.id||"");if(key===next)return;key=next;paint(frame)}
 function clear(){if(key!==null){key=null;paint({text:null,light:null})}}
 return {update,clear,count:cues.length};
}
const api={compile,sample,controller};if(typeof module!=="undefined")module.exports=api;else root.RPBEvents=api;
})(typeof window!=="undefined"?window:globalThis);
