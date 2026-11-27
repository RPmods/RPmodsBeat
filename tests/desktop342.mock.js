const assert=require('assert'),fs=require('fs'),path=require('path');
const source=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8'),html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const extract=source.slice(source.indexOf('function applyDevice(){'),source.indexOf('// Space is reserved',source.indexOf('function applyDevice(){')));
const run=new Function('settings','document','$','let noteGeometry={};'+extract+';applyDevice();return {settings,geometry:noteGeometry}');
assert(html.includes('id="pcLane"'));assert(!html.includes('id="mobileLane"'));assert(!source.includes("$('mobileLane')"));
let cases=0;
for(const deviceProfile of ['pc','mobile'])for(const pcLane of [undefined,'vertical','horizontal','bad'])for(const mobileLane of ['vertical','horizontal']){
 const settings={deviceProfile,pcLane,mobileLane,videoQuality:deviceProfile==='pc'?'hd':'lite'},nodes=new Map();
 const $=id=>{if(!nodes.has(id))nodes.set(id,{dataset:{}});return nodes.get(id)};
 const r=run(settings,{documentElement:{dataset:{}}},$);
 assert.equal(r.geometry,null);
 assert.equal($('game').dataset.lane,deviceProfile==='mobile'?'vertical':pcLane==='vertical'?'vertical':'horizontal');
 assert.equal($('game').dataset.mobileLayout,deviceProfile==='mobile'?'yes':'no');
 assert.equal(settings.mobileLane,'vertical');assert.equal($('pcOptions').hidden,deviceProfile==='mobile');
 assert.equal($('videoQuality').value,settings.videoQuality);assert(settings.pcMotion&&settings.pcParticles);cases++;
}
const geom=source.match(/if\(!noteGeometry\|\|noteGeometry\.vertical!==vertical\)\{[^\n]+/)[0];
const measure=new Function('settings','runway','target','vertical','getComputedStyle','noteGeometry',geom+';return noteGeometry');
for(const w of [130,200,260,340,440])for(const h of [120,250,400,800]){
 const r=measure({deviceProfile:'pc'},{clientWidth:w,clientHeight:h,style:{setProperty(){}}},{},true,()=>{},null);
 assert(r.noteSize<=64&&r.noteSize<=w/4);assert.equal(r.hit,h-r.noteSize/2-8);cases++;
}
console.log(cases+' preference, legacy migration and vertical geometry checks PASS');
