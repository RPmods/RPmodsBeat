const fs=require('fs'),assert=require('assert'),path=require('path'),T=require('../team33.js'),C=require('../chart-schema.js');
const w={};new Function('window',fs.readFileSync(path.join(__dirname,'../levels.js'),'utf8'))(w);
for(const {chart} of w.CHERRY_LEVELS)for(const d of C.diffs){
 const c=C.clone(chart),base=c.charts[d],a=base[0].t,b=base[Math.floor(base.length/5)].t,z=base[Math.floor(base.length/3)].t;
 c.teamSections={[d]:[{start:a,end:b,mode:'relay',slot:5},{start:b,end:z,mode:'all'}]};
 assert.equal(C.validate(c).errors.length,0);
 for(const n of [3,4,5]){
  const p=T.plan(base,n,c.teamSections[d],'room-1');assert.deepStrictEqual(p,T.plan(base,n,c.teamSections[d],'room-1'));
  base.forEach((note,i)=>{if(note.t>=a&&note.t<b)assert.deepStrictEqual(p.slots[i],[(5-1)%n]);else if(note.t>=b&&note.t<z)assert.equal(p.slots[i].length,n);else assert(p.slots[i].length>=2&&p.slots[i].length<n)});
 }
 assert.deepStrictEqual(C.compile(c).teamSections,c.teamSections);
 c.teamSections[d][1].start=a;assert(C.validate(c).errors.some(e=>e.msg.includes('superpuesto')));
}
console.log('Authored relay and full team sections, gap policy, compile/export and overlap validation PASS');
const source=fs.readFileSync(path.join(__dirname,'../online.js'),'utf8'),a=source.indexOf('api.rename=async'),b=source.indexOf('function bind(){',a);
assert(a>=0&&b>a);
let user={uid:'alice'},data={'users/alice':{profile:{name:'Alice',coins:8000}},'publicProfiles/alice':{name:'Alice'}},publicWrites=0;
const api={},D={runTransaction:async (key,fn)=>{let next=fn(data[key]);if(next===undefined)return {committed:false};data[key]=next;return {committed:true,snapshot:{val:()=>next}}}},CBGame={canSwitch:()=>true,useProfile:()=>{}};
const code=new Function('api','D','CBGame','user','data','publishPublic','authUI','msg','error','R',`let active=true,connected=true,room=null,saveChain=Promise.resolve(),saveError=false;${source.slice(a,b)}`);
code(api,D,CBGame,user,data,async()=>{publicWrites++},()=>{},()=>{},e=>e.message,x=>x);
(async()=>{await api.rename('AliceOne');assert.equal(data['users/alice'].profile.coins,8000);assert.equal(data['users/alice'].profile.renameCount,1);await api.rename('AliceTwo');assert.equal(data['users/alice'].profile.coins,3000);assert.equal(data['users/alice'].profile.renameCount,2);await assert.rejects(()=>api.rename('AliceThree'));assert.equal(data['users/alice'].profile.name,'AliceTwo');assert.equal(publicWrites,2);
await api.rankSubmit('aiscream','normal','123abcd',8765,300);await api.rankSubmit('aiscream','normal','123abcd',8000,300);assert.equal(data['leaderboards/aiscream/normal/123abcd/alice'].accuracy,8765);await api.rankSubmit('aiscream','normal','123abcd',9876,300);assert.equal(data['leaderboards/aiscream/normal/123abcd/alice'].accuracy,9876);await api.rankSubmit('aiscream','normal','123abcd',11000,300);assert.equal(data['leaderboards/aiscream/normal/123abcd/alice'].accuracy,9876);console.log('First rename free, later cost and insufficient balance; best-only leaderboard PASS')})().catch(e=>{console.error(e);process.exitCode=1});
