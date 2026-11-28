import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url),P=require("./pixi-notes.js");
let count=0;for(const vertical of [false,true])for(const dir of ["left","down","up","right"])for(const held of [false,true])for(const t of [1,2,3]){
 const n={d:dir,t:2,hold:2},hit=100,speed=30,w=400,h=200,size=40,order=["left","up","down","right"],x=held?hit:hit+(n.t-t)*speed,end=hit+(n.t+n.hold-t)*speed,r=P.project(n,t,hit,speed,vertical,w,h,size,held,order);
 assert.equal(r.x,vertical?(order.indexOf(dir)+.5)*100:x);
 assert.equal(r.y,vertical?2*hit-x:h/2);
 assert.equal(vertical?r.tailH:r.tailW,Math.max(0,end-x));count++;
}
console.log("PASS Pixi note geometry",count,"cases");
