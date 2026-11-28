import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url),E=require("./event-engine.js");
const chart={duration:20,events:{version:1,cues:[
{id:"d",type:"dialogue",start:1,end:3,speaker:"Wizz",text:"Comienza el escenario"},
{id:"l",type:"light",start:2,end:4,tone:"nova"},
{id:"c",type:"caption",start:5,end:7,text:"Interludio",difficulties:["hard"]}
]}};
assert.deepEqual(E.compile({duration:20},"normal"),[]);
const normal=E.compile(chart,"normal"),hard=E.compile(chart,"hard");
assert.equal(normal.length,2);assert.equal(hard.length,3);
assert.equal(E.sample(normal,1).text.id,"d");
assert.equal(E.sample(normal,2).light.id,"l");
assert.equal(E.sample(normal,3).text,null);
assert.equal(E.sample(normal,4).light,null);
assert.equal(E.sample(hard,5).text.id,"c");
let painted=[];const player=E.controller(chart,"hard",v=>painted.push(v));
player.update(1);player.update(1.2);assert.equal(painted.length,1);
player.update(5);assert.equal(painted.at(-1).text.id,"c");
player.update(1);assert.equal(painted.at(-1).text.id,"d");
player.clear();assert.equal(painted.at(-1).text,null);
assert.throws(()=>E.compile({...chart,events:{version:2,cues:[]}},"normal"));
assert.throws(()=>E.compile({...chart,events:{version:1,cues:[...chart.events.cues,{id:"x",type:"caption",start:2,end:3,text:"Overlap"}]}},"normal"));
assert.throws(()=>E.compile({...chart,events:{version:1,cues:[{id:"x",type:"script",start:1,end:2}]}},"normal"));
assert.throws(()=>E.compile({...chart,events:{version:1,cues:[{id:"x",type:"light",start:1,end:21,tone:"gold"}]}},"normal"));
console.log("PASS event engine: backwards compatible, difficulty, boundaries, seek, dedup, validation");
