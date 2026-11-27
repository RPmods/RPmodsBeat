const assert=require('assert'),fs=require('fs'),path=require('path'),T=require('../team33.js');
const weights={perfect:1,great:.8,good:.5,miss:0};
const window={};new Function('window',fs.readFileSync(path.join(__dirname,'../levels.js'),'utf8'))(window);
let cases=0;
for(const {id,chart} of window.CHERRY_LEVELS)for(const [diff,base] of Object.entries(chart.charts))for(const n of [3,4,5]){
 const p=T.plan(base,n),counts=p.routes.map(r=>r.length),clone=T.plan(base,n);
 assert.deepStrictEqual(p,clone);assert.equal(p.length,base.length);
 assert(p.slots.every(s=>s.length>=1&&s.length<=n&&new Set(s).size===s.length));
 assert(p.slots.some(s=>s.length===1));assert(p.slots.some(s=>s.length===2));assert(p.slots.some(s=>s.length===3));assert(p.slots.some(s=>s.length===n));
 assert(Math.max(...counts)-Math.min(...counts)<=13);assert(Math.min(...counts)>=base.length*.44);
 for(let i=0;i<n;i++){const r=p.routes[i];assert.equal(new Set(r.map(a=>a.teamIndex)).size,r.length);for(let j=0;j<r.length;j++){const a=r[j],b=base[a.teamIndex];assert(p.slots[a.teamIndex].includes(i));assert.equal(a.t,b.t);assert.equal(a.d,b.d);assert.equal(a.hold,b.hold);assert.equal(a.teamWidth,p.slots[a.teamIndex].length);if(j)assert(a.t>=r[j-1].t)}}
 const make=(grades)=>[0,1].flatMap(side=>p.routes.map((r,idx)=>({side,idx,stats:{events:r.map(a=>({t:a.t,teamIndex:a.teamIndex,g:grades[side]}))}})));
 let m=make(['perfect','good']),z=T.totals(p,m,weights);
 assert.deepStrictEqual(z,[{base:13000,bonus:1500,total:14500},{base:6500,bonus:750,total:7250}]);
 assert.deepStrictEqual(T.totals(p,make(['miss','miss']),weights),[{base:0,bonus:0,total:0},{base:0,bonus:0,total:0}]);
 const idx=p.slots.findIndex(s=>s.length>1),slot=p.slots[idx][0],person=m.find(a=>a.side===0&&a.idx===slot),event=person.stats.events.find(e=>e.teamIndex===idx);
 event.g='miss';let missed=T.totals(p,m,weights)[0];assert(missed.bonus<1500&&missed.base<13000);event.g='perfect';
 person.stats.events=person.stats.events.filter(e=>e!==event);assert.deepStrictEqual(T.totals(p,m,weights)[0],missed);
 person.stats.events.push(event,event);assert.equal(T.totals(p,m,weights)[0].total,14500);
 let partial=T.totals(p,m,weights,base[Math.floor(base.length/2)].t);assert(partial[0].total>0&&partial[0].total<14500);
 assert.equal(T.totals(p,m,weights,Infinity)[0].total,14500);
 cases++;
}
console.log(cases+' chart/difficulty/team combinations: balanced, deterministic, preserved directions/holds, 14500 cap, partial/miss/duplicate/replay PASS');
const p=T.plan(Array.from({length:60},(_,i)=>({t:i*.3,d:'left',hold:0})),5),members=p.routes.map((r,idx)=>({side:0,idx,stats:{events:r.map(a=>({t:a.t,teamIndex:a.teamIndex,g:'great'}))}}));
assert.deepStrictEqual(T.totals(p,members,weights)[0],{base:10400,bonus:1200,total:11600});
assert.equal(T.totals(T.plan([],3),[],weights)[0].total,0);
console.log('Great weighting, empty chart, no score inflation PASS');
