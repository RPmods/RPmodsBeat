const fs=require('fs'),assert=require('assert'),path=require('path'),CB31=require('../mobile31.js');
const s=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
const cut=(a,b)=>{const x=s.indexOf(a),y=s.indexOf(b,x);assert(x>=0&&y>x);return s.slice(x,y)};
const block=cut('const SKILL={','let chartMinGap'),gameplay=cut('function judge(','function botAdvance(');
const h=new Function(`
 const els=new Map(),cl={contains:()=>false,toggle(){},remove(){},add(){}};
 const $=id=>{if(!els.has(id))els.set(id,{style:{},dataset:{},classList:cl,setAttribute(){}});return els.get(id)};
 const window={addEventListener(){}},ResizeObserver=undefined,music={currentTime:0,paused:false},settings={offset:0,deviceProfile:'mobile',effects:false},CBChart={endFor:()=>300},chart={},diff='normal',state='playing',glyph={left:'←'},held=new Set(),weights={perfect:1,great:.8,good:.5,miss:0},windows={normal:[.045,.085,.135,.18]};
 let activeHold=null,resumeGrace=0,cursor=0,notes=[],onlineMatch=null;
 const p={events:[],counts:{perfect:0,great:0,good:0,miss:0},value:0,judged:0,combo:0,maxCombo:0,stars:0};
 function retrigger(){}function feedback(){}function particles(){}function updateHud(){}function starCount(){return 0}
 ${block}
 ${gameplay}
 return {load(list){notes=list;cursor=0;activeHold=null;held.clear();p.events=[];music.currentTime=0;resetSkill()},manual(g='perfect'){judge(p,'p',{t:music.currentTime,d:'left'},g,music.currentTime,0,false);skillHUD(music.currentTime)},down(t,source='touch'){music.currentTime=t;skillDown(source)},up(t,source='touch'){music.currentTime=t;skillUp(source)},advance(t){music.currentTime=t;advance(t,t)},hold(){held.add('left')},blur(t){music.currentTime=t;clearSkillInput()},read(){return {charge:skill.charge,active:skill.active,unlocked:skill.unlocked,uses:skill.uses,auto:skill.autoCount,events:p.events.slice(),hold:activeHold?.assisted}}}
`)();
const near=(x,y)=>Math.abs(x-y)<.00001,charge=()=>{for(let i=0;i<40;i++)h.manual()};
h.load([{t:1.5,d:'left'},{t:3,d:'left'},{t:4.5,d:'left'},{t:5.3,d:'left'},{t:7.2,d:'left'},{t:9,d:'left'}]);
for(let i=0;i<39;i++)h.manual();assert(!h.read().unlocked);h.manual();assert(h.read().unlocked);
h.down(1);h.advance(1.6);h.up(2.25);assert(near(h.read().charge,75)&&h.read().auto===1&&!h.read().active);
h.advance(3.3);assert.equal(h.read().events.at(-1).g,'miss');h.down(4);h.up(5);assert(near(h.read().charge,55));h.advance(5.5);h.down(6);h.advance(8.75);assert(!h.read().unlocked&&near(h.read().charge,0)&&h.read().auto===3);h.advance(9.3);assert.equal(h.read().events.at(-1).g,'miss');
h.load([{t:1.1,d:'left',hold:2},{t:5,d:'left'}]);charge();h.down(1);h.advance(1.2);assert(h.read().hold);h.up(1.7);assert.equal(h.read().events.at(-1).g,'miss');
h.load([{t:1.1,d:'left',hold:2},{t:5,d:'left'}]);charge();h.down(1);h.advance(1.2);h.hold();h.up(1.7);h.advance(3.2);assert(h.read().events.at(-1).g==='perfect'&&h.read().events.at(-1).assisted&&near(h.read().charge,86));
h.load([{t:1.5,d:'left'},{t:2.5,d:'left'},{t:8,d:'left'}]);charge();h.down(1,'keyboard');h.down(1.1,'touch');h.up(1.5,'keyboard');assert(h.read().active);h.blur(2);assert(!h.read().active&&near(h.read().charge,80));h.advance(2.8);assert.equal(h.read().events.at(-1).g,'miss');
console.log('Beat Surge cumulative reserve, release, reactivation, holds, input loss PASS');
const weights={perfect:1,great:.8,good:.5,miss:0},w=[.045,.085,.135,.18],means=[];
for(const level of ['rookie','standard','expert']){let scores=[];for(let k=0;k<100;k++){assert.equal(new Set(CB31.roster(k)).size,10);let score=0;for(let i=0;i<160;i++){let g=CB31.botGrade(k,level,1,0,i),d=Math.abs(CB31.botDelta(k,level,1,0,i,w));assert.equal(g,CB31.botGrade(k,level,1,0,i));assert.equal(g,d<=w[0]?'perfect':d<=w[1]?'great':d<=w[2]?'good':'miss');score+=weights[g]}scores.push(score/160*100)}let avg=scores.reduce((a,b)=>a+b)/scores.length;means.push(avg);console.log(level,avg.toFixed(1),Math.min(...scores).toFixed(1),Math.max(...scores).toFixed(1))}
assert(means[0]<means[1]&&means[1]<means[2]);assert(CB31.compatiblePreference('any','hard'));assert(!CB31.compatiblePreference('easy','hard'));assert.equal(CB31.chooseDifficulty('hard'),'hard');console.log('48000 CPU notes: deterministic, variable and level ordered PASS');
