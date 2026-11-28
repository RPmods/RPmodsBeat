import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import * as G from "./gacha-local.mjs";
const src=readFileSync(new URL("../../game.js",import.meta.url),"utf8");
const pools=new Function("return "+src.match(/const pools=(\{[^\n]+\});/)[1])();
const spin=src.slice(src.indexOf("function spin(count)"),src.indexOf("$('spinGacha').onclick"));
function mockRun(balance,known=[],startPity={},mode=true){
 const profile={tickets:balance,coins:150,owned:[...known],gachaHistory:[],rpbGacha:{pity:startPity,shards:0}},nodes=new Map();let timer,cleared=0,saved=0;
 function el(){return {style:{setProperty(){}},classList:{add(){},remove(){}},children:[],hidden:false,append(...c){this.children.push(...c)},replaceChildren(){this.children=[]}}}
 const $=id=>{if(!nodes.has(id))nodes.set(id,el());return nodes.get(id)};
 const module={...G,rollBatch:(d,b,n,v)=>G.rollBatch(d,b,n,v,()=>.999)};
 const f=new Function("profile","pools","RPBGacha","window","$","document","store","syncProfile","localBannerMode","lookup","own","grantItem","gachaCard","rarityLabel","renderGachaHistory","renderInventory","renderShop","refreshBannerStatus","setTimeout","clearTimeout","pullOne","let spinBusy=false,summonPool='classic';"+spin+";return spin;");
 const call=f(profile,pools,module,{RPBGacha:module},$,{createElement:el},{set(){saved++}},()=>{},()=>mode,id=>({id,name:id,exclusive:true}),id=>profile.owned.includes(id),item=>profile.owned.push(item.id),el,{rare:"Raro",epic:"Épico",legendary:"Legendario",exotic:"Exótico"},()=>{},()=>{},()=>{},()=>{},fn=>{timer=fn;return 1},()=>{cleared++},()=>{throw Error("Legacy draw must not run")});
 return {profile,$,call,finish:()=>timer?.(),saved:()=>saved,cleared:()=>cleared}
}
let r=mockRun(10);r.call(10);assert.equal(r.profile.tickets,0);assert.equal(r.profile.gachaHistory.length,10);assert.equal(r.saved(),1);assert.equal(r.profile.rpbGacha.pity.limited.epic,0);assert.equal(r.profile.rpbGacha.shards,8);assert.equal(r.$("rpbGachaSkip").hidden,false);r.call(1);assert.equal(r.saved(),1);r.$("rpbGachaSkip").onclick();assert.equal(r.$("rpbGachaSkip").hidden,true);const cleared=r.cleared();r.finish();assert.equal(r.cleared(),cleared);assert.equal(r.$("gachaReveal").children[0].children.length,10);console.log("PASS actual spin function: debit, history, duplicate shards, skip idempotency");
r=mockRun(0);r.call(1);assert.equal(r.saved(),0);assert.equal(r.profile.gachaHistory.length,0);console.log("PASS actual spin function: insufficient funds");
