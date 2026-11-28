import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url),R=require("./route-index.js");
let seed=713,count=0;
function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
for(let k=0;k<70;k++){
 let t=0,route=Array.from({length:k*13},()=>{t+=Math.floor(rnd()*7)/10;return {t,hold:rnd()<.2?rnd()*9:0}});
 if(k%9===0)route.reverse();
 const times=[-3,0,t,t+10,...Array.from({length:80},()=>rnd()*(t+4)-2),...route.slice(0,20).map(n=>n.t)];
 for(const time of times){
  const r=R.around(route,time);
  assert.equal(r.next,route.find(n=>n.t+(n.hold||0)>=time-.15));
  assert.equal(r.prev,route.reduce((last,n)=>n.t<=time?n:last,null));
  assert.equal(R.near(route,time),route.some(n=>n.t-time<=1&&n.t+(n.hold||0)>=time-.7));count++;
 }
}
R.clear();
console.log("PASS animation route lookup",count,"queries");
