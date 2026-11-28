import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";
import vm from "node:vm";
const root=new URL("../../",import.meta.url);
const read=p=>readFileSync(new URL(p,root),"utf8");
const baseline="f784ee3f36b896abea3bdf72ea6631e76f98f98c";
const source=execFileSync("git",["show",baseline+":motion.js"],{cwd:root,encoding:"utf8"});
const window={};vm.runInNewContext(read("rig-data.js"),{window});
function load(src){const w={CBRigData:window.CBRigData};vm.runInNewContext(src,{window:w});return w.CherryMotion}
const old=load(source),next=load(read("motion.js"));let poses=0,coords=0;
for(const c of Object.keys(window.CBRigData))for(const action of old.actions)for(const t of [0,.11,.37,.81,1.8,3.2]){
 const a=old.sample(action,t,1),b=old.vertices(c,a),n=next.vertices(c,a);
 assert.equal(n.length,b.length);for(let i=0;i<b.length;i++)assert.equal(n[i],b[i],c+" "+action+" "+i);poses++;coords+=b.length;
}
console.log("PASS mesh equality",poses,"poses",coords,"coordinates");
for(const [hostname,search,expected] of [["rpmods.github.io","?rpb-emulator=1",false],["localhost","",false],["localhost","?rpb-emulator=1",true],["127.0.0.1","?rpb-emulator=1",true],["example.org","",false],["[::1]","?rpb-emulator=1",false]]){
 const w={CB_FIREBASE:{projectId:"production"}};vm.runInNewContext(read("dev/alpha035/dev-guard.js"),{window:w,location:{hostname,search},URLSearchParams});assert.equal(!!w.CB_FIREBASE.useEmulators,expected);assert.notEqual(w.CB_FIREBASE.projectId,"production");assert.equal(w.RPB_DEV_MODE,true)
}
console.log("PASS production isolation, six host/query cases");
for(const path of ["index.html","dev/alpha035/index.html"]){const src=read(path);const ids=[...src.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size,path+" duplicate ids");}
console.log("PASS HTML id uniqueness");
for(const path of ["game.js","online.js","motion.js","alpha-notice.js","dev/alpha035/studio-intro.js","dev/alpha035/dev-guard.js","dev/alpha035/perf.js"])new vm.Script(read(path),{filename:path});
console.log("PASS JavaScript syntax");
