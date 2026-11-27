/* One lobby soundtrack. Decode during boot; never wait for decoding to begin playback.
   A real menu entry starts at 0; tab visibility alone preserves the position. */
(()=>{'use strict';
const url='assets/audio/lobby-loop.mp3';
let ctx=null,buffer=null,loading=null,source=null,tail=null,htmlPending=false,wanted=false,volume=.5,offset=0,epoch=0;
const fallback=new Audio(url);fallback.loop=true;fallback.preload='auto';fallback.volume=volume;
function ramp(gain,v,seconds=.18){if(!gain||!ctx)return;let p=gain.gain,t=ctx.currentTime;try{if(p.cancelAndHoldAtTime)p.cancelAndHoldAtTime(t);else{p.cancelScheduledValues(t);p.setValueAtTime(p.value,t)}p.linearRampToValueAtTime(v,t+seconds)}catch{p.value=v}}
function unlock(){try{if(!ctx){let AC=window.AudioContext||window.webkitAudioContext;if(AC)ctx=new AC()}if(ctx?.state!=='running')ctx?.resume().catch(()=>{})}catch{}return preload()}
function preload(){if(buffer)return Promise.resolve(true);if(loading)return loading;if(!ctx||location.protocol==='file:')return Promise.resolve(false);
 loading=(async()=>{let ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),8000);try{let r=await fetch(url,{signal:ctrl.signal});if(!r.ok)throw Error('HTTP '+r.status);buffer=await ctx.decodeAudioData(await r.arrayBuffer());return !!buffer}catch(e){console.warn('Lobby BGM: reproducción HTML de respaldo',e);return false}finally{clearTimeout(timer);loading=null}})();return loading}
function killTail(){if(tail){try{tail.node.stop()}catch{}tail=null}}
function htmlPosition(t){try{fallback.currentTime=t}catch{}}
async function play(){
 wanted=true;if(document.hidden)return;
 if(source||htmlPending||!fallback.paused)return;
 const token=++epoch;killTail();unlock();
 if(buffer&&ctx?.state==='running'){
  try{fallback.pause();let node=ctx.createBufferSource(),gain=ctx.createGain();node.buffer=buffer;node.loop=true;node.connect(gain);gain.connect(ctx.destination);gain.gain.value=0;
   const at=((offset%buffer.duration)+buffer.duration)%buffer.duration;node.start(0,at);source={node,gain,started:ctx.currentTime-at};
   node.onended=()=>{try{node.disconnect();gain.disconnect()}catch{}};ramp(gain,volume,.25);return;
  }catch(e){source=null;console.warn('Lobby BGM: Web Audio no disponible',e)}
 }
 htmlPosition(offset);fallback.volume=volume;htmlPending=true;
 try{await fallback.play();if(token===epoch&&(!wanted||document.hidden))fallback.pause()}catch{}finally{if(token===epoch)htmlPending=false}
}
function stop(fade=false,keep=false){
 if(!keep)wanted=false;++epoch;htmlPending=false;killTail();
 if(source){const s=source;offset=keep?Math.max(0,ctx.currentTime-s.started):0;source=null;if(fade&&!keep){tail=s;ramp(s.gain,0,.18);try{s.node.stop(ctx.currentTime+.18)}catch{}}else{try{s.node.stop()}catch{}}}
 else if(!fallback.paused||keep)offset=keep?fallback.currentTime||0:0;
 else if(!keep)offset=0;
 fallback.pause();if(!keep)htmlPosition(0);
}
function setVolume(v){volume=Number.isFinite(v)?Math.max(0,Math.min(1,v)):.5;fallback.volume=volume;if(source)ramp(source.gain,volume,.12)}
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(wanted)stop(false,true)}else if(wanted)play()});
document.addEventListener('pointerdown',()=>{if(wanted&&!source&&!htmlPending&&fallback.paused)play()},{passive:true});
window.CBLobby={unlock,preload,play,stop,setVolume};
})();
