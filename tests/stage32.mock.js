const assert=require('assert'),fs=require('fs'),path=require('path'),C=require('../stage32.js');
const route=[{t:10,d:'left'},{t:10.5,d:'right',hold:1},{t:15,d:'up'},{t:15.4,d:'down'}];
for(const [t,value] of [[4.9,''],[5,'5'],[6,'4'],[7,'3'],[8,'2'],[9,'1'],[10,'GO!'],[10.7,''],[11.6,''],[12,'3'],[15,'GO!'],[20,'']])assert.equal(C.cue(route,t,20).value,value);
assert.equal(C.cue([],5,20).value,'');
const m=(side,idx,value,length,maxCombo=10,departed=false)=>({side,idx,notes:Array(length).fill({}),stats:{value,maxCombo,counts:{perfect:8}},departed});
const roster=[m(0,0,30,40),m(0,1,10,10),m(1,0,12,15),m(1,1,30,60),m(1,2,99,99,50,true)];
for(const [totals,a,b] of [[[100,90],'MVP','SVP'],[[90,100],'SVP','MVP'],[[90,90],'MVP','MVP']]){const awards=C.teamAwards(roster,totals);assert.equal(awards.get(roster[1]),a);assert.equal(awards.get(roster[2]),b);assert(!awards.has(roster[4]));assert.equal(awards.size,2)}
assert.equal(C.teamAwards([m(0,0,0,1),m(1,0,0,1)],[0,0]).size,0);
assert.equal(C.teamAwards(roster,[100,0],true).size,1);
for(let count=1;count<=5;count++){const people=Array.from({length:count},(_,i)=>m(0,i,1,2));for(const lead of people){const result=C.formation(people,new Map([[lead,'MVP']]));assert.equal(result[Math.floor((count-1)/2)],lead);assert.equal(new Set(result).size,count);assert.equal(people[0].idx,0)}}
const a=C.ffaAwards(roster.slice(2),m=>m.departed);assert.equal(a.get(roster[2]),'MVP');assert.equal(a.get(roster[3]),'SVP');assert(!a.has(roster[4]));
const src=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8');
const cut=(a,b)=>src.slice(src.indexOf(a),src.indexOf(b,src.indexOf(a)));
function element(){return {dataset:{},children:[],textContent:'',classes:new Set(),style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},querySelector(tag){return this.children.find(x=>x.tag===tag)||null},append(x){this.children.push(x)},replaceChildren(...x){this.children=x},animate(frames,opt){return {frames,opt,playState:'running',cancel(){this.playState='idle'}}}}}
const board=element(),self=element(),mate=element(),settings={gradeFade:true};
const ctx=new Function('CBStage32','board','settings','element',`
 const $=id=>board,CBChart={endFor:()=>20},chart={},diff='normal',document={createElement:tag=>Object.assign(element(),{tag})},window={matchMedia:()=>({matches:false})};
 function retrigger(){}
 ${cut('function turnSignal(','function ffaRanking(')}
 ${cut('function renderGrade(','function particles(')}
 return {turnSignal,renderGrade}
`)(C,board,settings,element);
assert.equal(ctx.turnSignal(self,route,5,true),'5');assert.equal(board.textContent,'5');assert.equal(self.children.length,0);
assert.equal(ctx.turnSignal(mate,route,5,false),'5');assert.equal(mate.children.length,1);assert.equal(mate.children[0].textContent,'5');
assert.equal(ctx.turnSignal(self,route,10,true),'GO!');assert.equal(board.textContent,'GO!');assert.equal(ctx.turnSignal(self,route,20,true),'');assert.equal(board.textContent,'');
const grade=element();ctx.renderGrade(grade,'perfect');assert.equal(grade.children[0].textContent,'PERFECT');assert.equal(grade._gradeAnim.opt.duration,1120);const first=grade.children[0],anim=grade._gradeAnim;
ctx.renderGrade(grade,'miss');assert.equal(anim.playState,'idle');assert.equal(grade.children[0],first);assert.equal(first.textContent,'MISS');assert(grade._gradeAnim.frames[0].opacity>0);settings.gradeFade=false;ctx.renderGrade(grade,'good');assert.equal(grade._gradeAnim.opt.duration,850);
console.log('Countdown board/local and teammates, fade/retrigger, normalized MVP/SVP and formations 1–5: PASS');
