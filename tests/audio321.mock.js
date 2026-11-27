const assert=require('assert'),fs=require('fs'),path=require('path'),R=require('../result321.js');
function clock(){
 let time=0,id=0;const tasks=new Map(),events=[];
 const life=R.create({now:()=>time,schedule:(fn,ms)=>{tasks.set(++id,{fn,at:time+ms});return id},cancel:i=>tasks.delete(i),onMusic:()=>events.push(['music',time]),onReveal:()=>events.push(['reveal',time]),onCountdown:n=>events.push(['count',n,time]),onExit:()=>events.push(['exit',time])});
 function to(t){while(true){let next=[...tasks].filter(([,v])=>v.at<=t).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;tasks.delete(next[0]);time=next[1].at;next[1].fn()}time=t}
 return {life,events,to,jump:t=>{time=t},tasks}
}
for(const d of [4500,9800,10200]){
 const c=clock();c.life.start(d);c.to(d-1001);assert.equal(c.events.length,0);c.to(d-1000);assert.equal(c.events[0][0],'music');c.to(d);assert.equal(c.events[1][0],'reveal');assert.equal(c.events[1][1]-c.events[0][1],1000);assert.equal(c.events[2][1],40);c.to(d+39999);assert.equal(c.life.phase,'results');c.to(d+40000);assert.equal(c.events.at(-1)[0],'exit');assert.equal(c.life.phase,'idle');assert.equal(c.tasks.size,0)
}
for(const at of [100,9000,15000]){
 const c=clock();c.life.start(9800);c.to(at);c.life.clear();let n=c.events.length;c.to(100000);assert.equal(c.events.length,n);assert.equal(c.tasks.size,0);
}
{
 const c=clock();c.life.start(9800);c.to(9800);c.jump(60000);c.life.check();assert.equal(c.events.at(-1)[0],'exit');assert.equal(c.tasks.size,0);c.life.check();assert.equal(c.events.filter(e=>e[0]==='exit').length,1);
}
{
 const c=clock();c.life.start(9800);c.to(8800);c.life.start(4500);c.to(13300);assert.equal(c.events.filter(e=>e[0]==='reveal').length,1);assert.equal(c.events.filter(e=>e[0]==='music').length,2);
}
console.log('Replay lead-in, 40s expiry, cancellation, new match, hidden-tab deadline PASS');
const source=fs.readFileSync(path.join(__dirname,'../lobby-audio.js'),'utf8');
async function lobby(){
 let audio,decoded=false,fetchCount=0;const listeners={},window={},document={hidden:false,addEventListener:(k,f)=>listeners[k]=f},location={protocol:'https:'};const starts=[];
 class Audio{constructor(){audio=this;this.paused=true;this.currentTime=0;this.plays=0}play(){this.plays++;this.paused=false;return Promise.resolve()}pause(){this.paused=true}}
 const nodes=[];class AC{constructor(){this.state='running';this.currentTime=0;this.destination={};AC.last=this}resume(){this.state='running';return Promise.resolve()}createGain(){return {gain:{value:0,cancelAndHoldAtTime(){},linearRampToValueAtTime(){}},connect(){},disconnect(){}}}createBufferSource(){const node={connect(){},disconnect(){},start(_,offset){starts.push(offset)},stop(){this.stopped=true}};nodes.push(node);return node}decodeAudioData(){return Promise.resolve({duration:57})}}
 window.AudioContext=AC;let release;const gate=new Promise(r=>{release=r});
 new Function('window','document','location','Audio','fetch','AbortController','setTimeout','clearTimeout','console',source)(window,document,location,Audio,async()=>{fetchCount++;await gate;return {ok:true,arrayBuffer:async()=>new ArrayBuffer(0)}},class{abort(){}},()=>1,()=>{},{warn(){}});
 const L=window.CBLobby;let pending=L.unlock();await L.play();assert.equal(audio.plays,1);assert.equal(audio.currentTime,0);assert.equal(starts.length,0);await L.play();assert.equal(audio.plays,1);
 release();await pending;assert.equal(fetchCount,1);audio.currentTime=8;L.stop(true);assert(audio.paused);assert.equal(audio.currentTime,0);
 await L.play();assert.equal(starts[0],0);await L.play();assert.equal(starts.length,1);
 AC.last.currentTime=6;document.hidden=true;listeners.visibilitychange();assert(nodes[0].stopped);document.hidden=false;listeners.visibilitychange();await Promise.resolve();assert.equal(starts[1],6);
 AC.last.currentTime=9;L.stop(true);await L.play();assert.equal(starts[2],0);assert(nodes[1].stopped);L.stop();assert(nodes[2].stopped);assert(audio.paused);
 console.log('Lobby fallback without decode delay, no duplicate playback, initial offset 0, visibility resume, reset on real exit PASS');
}
lobby().catch(e=>{console.error(e);process.exitCode=1});
