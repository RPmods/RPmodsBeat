'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../online.js'),'utf8');
const body=source.slice(source.indexOf('api.redeem=async(code)=>'),source.indexOf('\n};',source.indexOf('api.redeem=async(code)=>'))+3);
assert(body.startsWith('api.redeem='));
async function run({used=0,emptyFirst=false,missing=false,alwaysEmpty=false,denied=false}={}){
 let current=missing?null:{profile:{coins:246,tickets:2,name:'Player'},redemptions:used?{cherry343:used}:{},updatedAt:1};
 let listening=false,tries=0,profile=null;
 const snap=x=>({val:()=>x});
 const D={get:async p=>snap(p.startsWith('codes/')?{enabled:true,repeatable:false,coins:500,tickets:5}:current),onValue:(p,fn)=>{listening=true;fn(snap(current));return()=>{listening=false}},runTransaction:async(p,fn)=>{assert(listening);if(denied)throw Object.assign(Error('Permission denied'),{code:'PERMISSION_DENIED'});let x=fn(alwaysEmpty||emptyFirst&&tries===0?null:current);tries++;if(x===undefined)return {committed:false,snapshot:snap(current)};current=x;return {committed:true,snapshot:snap(current)}}};
 const api={now:Date.now};const window={CBGame:{useProfile:p=>{profile=p}}};
 new Function('api','D','R','active','user','connected','session','saveChain','saveError','window','error',body)(api,D,p=>p,true,{uid:'u'},true,1,Promise.resolve(),false,window,e=>e.code==='PERMISSION_DENIED'?'Acceso denegado.':e.message);
 let result,err;try{result=await api.redeem('cherry343')}catch(e){err=e.message}assert(!listening);return {result,err,tries,current,profile};
}
(async()=>{let r=await run();assert.deepEqual(r.result,{coins:500,tickets:5});assert.equal(r.profile.coins,746);assert.equal(r.profile.tickets,7);assert.equal(r.current.redemptions.cherry343,1);
r=await run({emptyFirst:true});assert.equal(r.tries,2);assert.equal(r.current.profile.coins,746);
r=await run({used:1});assert.equal(r.err,'Código ya utilizado.');assert.equal(r.current.profile.coins,246);
r=await run({missing:true});assert.match(r.err,/Perfil no disponible/);
r=await run({alwaysEmpty:true});assert.match(r.err,/No se pudo sincronizar/);
r=await run({denied:true});assert.match(r.err,/Acceso denegado/);
console.log('6 redeem mock cases passed');})().catch(e=>{console.error(e);process.exitCode=1});
