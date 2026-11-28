import * as C from "./core.mjs";
const check=(cond,msg)=>{if(!cond)throw Error(msg);console.log("PASS "+msg)};
const time=Date.UTC(2026,10,28,12);
let s=C.initialState();let result={id:"match1",completed:true,perfect:100,combo:50,accuracy:95,versus:true,win:true,expert:true};
s=C.recordResult(s,result,time);check(C.recordResult(s,result,time)===s,"duplicate match ignored");
check(C.recordResult(s,{...result,id:"abandoned",completed:false},time)===s,"unfinished match ignored");
s=C.claimMission(s,"daily-perfect",time);check(s.coins===150&&C.claimMission(s,"daily-perfect",time)===s,"mission claim only once");
check(C.claimMission(s,"daily-songs",time)===s,"incomplete mission not claimable");
s=C.recordResult(s,{...result,id:"match2"},time);s=C.recordResult(s,{...result,id:"match3"},time);
s=C.claimBonus(s,"day",time);check(s.crystals===2&&C.claimBonus(s,"day",time)===s,"daily bonus once");
check(C.claimMission(s,"daily-perfect",time+86400000)===s,"daily reset");
check(C.periodKey("week",Date.UTC(2026,10,29))!==C.periodKey("week",Date.UTC(2026,10,30)),"Monday UTC weekly reset");
check(C.periodKey("season",time)===C.periodKey("season",time+86400000*365)&&C.SEASON.endAt===null,"indefinite season");
s=C.claimSeason(s,1);check(s.coins===650&&C.claimSeason(s,1)===s,"season reward once");
check(C.claimSeason(s,50)===s,"locked season milestone");
const b={group:"limited",featured:"featured",offBanner:["off"]};
s={...C.initialState(),crystals:120};
for(let i=0;i<59;i++)s=C.pull(s,b,()=>.999).state;
check(s.pity.limited.exotic===59,"hard pity reached");
let p=C.pull(s,b,()=>.999);s=p.state;check(p.result.item==="off"&&s.pity.limited.guaranteed,"lost 50/50 stores guarantee");
for(let i=0;i<59;i++)s=C.pull(s,b,()=>.999).state;
p=C.pull(s,b,()=>.999);check(p.result.item==="featured"&&p.state.crystals===0&&!p.state.pity.limited.guaranteed,"featured guaranteed by pull 120");
s={...C.initialState(),crystals:10};const batch=C.pullBatch(s,b,10,()=>.999);check(batch.results[9].rarity==="epic"&&batch.state.crystals===0,"10-pull epic guarantee and debit");
check(C.pull({...C.initialState(),crystals:1,pity:{limited:{exotic:59,epic:0,guaranteed:true}}},{...b,featured:"other"},()=>.999).result.item==="other","limited pity carry");
check(C.pull({...C.initialState(),crystals:1,pity:{limited:{exotic:59,epic:0,guaranteed:true}}},{...b,group:"standard"},()=>.999).result.rarity==="rare","standard pity independent");
let blocked=false;try{C.pullBatch(C.initialState(),b,10)}catch{blocked=true}check(blocked,"insufficient balance rejected");
for(let n=1;n<=5;n++){const players=Array.from({length:n*2},(_,i)=>({id:String(i),mmr:1000+i*50}));let teams=C.balanceTeams(players,n);check(teams.cherry.length===n&&teams.nova.length===n&&new Set([...teams.cherry,...teams.nova].map(x=>x.id)).size===2*n,"unique balanced teams "+n+"v"+n);check(C.layoutPlan(n,360,640,"mobile").axis==="vertical"&&C.layoutPlan(n,1920,1080,"pc").slots===n*2,"layout "+n+"v"+n)}

check(Object.keys(C.SEASON_REWARDS).length===50,"all 50 season rewards configured");
s={...C.initialState(),seasonXP:49000};
for(let level=1;level<=50;level++){const before=s;s=C.claimSeason(s,level);if(s===before||C.claimSeason(s,level)!==s)throw Error("milestone claim "+level)}
check(Object.keys(s.claimed).length===50,"all 50 milestones claimable exactly once");
check(C.claimSeason(s,"__proto__")===s&&C.claimSeason(s,51)===s,"invalid season levels ignored");
const p2=(id,mmr=1000)=>({id,mmr});
const parties=[[p2("a"),p2("b")],[p2("c"),p2("d")],[p2("e")],[p2("f")]];
const teams=C.balanceParties(parties,3);
check(teams!==null&&parties.every(group=>[teams.cherry,teams.nova].some(team=>group.every(p=>team.includes(p)))),"premade groups not split");
check(C.balanceParties([[p2("a"),p2("b")],[p2("c"),p2("d")],[p2("e"),p2("f")]],3)===null,"impossible group partition rejected");
check(C.exoticRate(43)===.02&&C.exoticRate(44)===.06&&C.exoticRate(59)===1,"soft and hard pity boundaries");
