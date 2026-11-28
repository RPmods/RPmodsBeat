// Alpha 0.35 experimental domain logic. No production Firebase access.
export const SEASON = Object.freeze({id:"s0",name:"Los Inicios",endAt:null,levels:50});
export const REWARDS = Object.freeze({register:{coins:500,crystals:5},verify:{coins:1000,crystals:10}});
export const MISSIONS = Object.freeze([
 {id:"daily-songs",period:"day",label:"Completa 3 canciones",metric:"songs",target:3,coins:100,crystals:0},
 {id:"daily-perfect",period:"day",label:"Consigue 100 Perfect",metric:"perfect",target:100,coins:150,crystals:0},
 {id:"daily-combo",period:"day",label:"Alcanza 50 de combo",metric:"combo",target:50,coins:150,crystals:0},
 {id:"daily-versus",period:"day",label:"Completa una partida Versus",metric:"versus",target:1,coins:0,crystals:1},
 {id:"daily-accuracy",period:"day",label:"Consigue 90% de precisión",metric:"accuracy90",target:1,coins:100,crystals:0},
 {id:"weekly-songs",period:"week",label:"Completa 20 canciones",metric:"songs",target:20,coins:1000,crystals:0},
 {id:"weekly-perfect",period:"week",label:"Consigue 1000 Perfect",metric:"perfect",target:1000,coins:0,crystals:3},
 {id:"weekly-versus",period:"week",label:"Completa 10 partidas Versus",metric:"versus",target:10,coins:0,crystals:3},
 {id:"weekly-wins",period:"week",label:"Gana 5 partidas",metric:"wins",target:5,coins:0,crystals:2},
 {id:"weekly-hard",period:"week",label:"Completa 5 canciones en Experto",metric:"expert",target:5,coins:0,crystals:2},
 {id:"weekly-accuracy",period:"week",label:"Consigue 95% en 3 canciones",metric:"accuracy95",target:3,coins:1500,crystals:0},
 {id:"season-songs",period:"season",label:"Completa 50 canciones",metric:"songs",target:50,coins:1000,crystals:5},
 {id:"season-perfect",period:"season",label:"Consigue 5000 Perfect",metric:"perfect",target:5000,coins:2000,crystals:10},
 {id:"season-versus",period:"season",label:"Completa 30 partidas Versus",metric:"versus",target:30,coins:1000,crystals:5},
 {id:"beginner-first",period:"once",label:"Completa tu primera canción",metric:"songs",target:1,coins:500,crystals:0}
]);
export const SEASON_REWARDS=Object.freeze({1:{coins:500},5:{crystals:5},10:{cosmetic:"Marco Los Inicios"},15:{crystals:10},20:{cosmetic:"Accesorio épico S0"},25:{coins:3000},30:{crystals:15},35:{cosmetic:"Artista Fundador"},40:{cosmetic:"Legendario S0"},45:{crystals:20},50:{cosmetic:"Genesis"}});
export function periodKey(period,ms){
 if(!Number.isFinite(ms))throw Error("Hora inválida");
 const d=new Date(ms);
 if(period==="day")return d.toISOString().slice(0,10);
 if(period==="week"){d.setUTCHours(0,0,0,0);d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10);}
 if(period==="season")return SEASON.id;
 if(period==="once")return "lifetime";
 throw Error("Periodo inválido");
}
export function initialState(){return {coins:0,crystals:0,shards:0,xp:0,seasonXP:0,owned:[],pity:{},progress:{},claimed:{},processed:{}}}
export function missionKey(m,ms){return m.id+":"+periodKey(m.period,ms)}
export function recordResult(state,result,ms){
 if(!result||typeof result.id!=="string"||!result.id||result.id.length>128||Object.prototype.hasOwnProperty.call(state.processed,result.id))return state;
 if(result.completed!==true)return state;
 const bounded=(n,max)=>Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
 const accuracy=bounded(result.accuracy,100), metrics={songs:1,perfect:bounded(result.perfect,10000),combo:bounded(result.combo,10000),versus:result.versus?1:0,wins:result.versus&&result.win?1:0,expert:result.expert?1:0,accuracy90:accuracy>=90?1:0,accuracy95:accuracy>=95?1:0};
 const next={...state,processed:{...state.processed,[result.id]:true},progress:{...state.progress},xp:state.xp+100,seasonXP:state.seasonXP+100};
 for(const m of MISSIONS){const k=missionKey(m,ms),old=next.progress[k]||0;next.progress[k]=Math.min(m.target,m.metric==="combo"?Math.max(old,metrics.combo):old+metrics[m.metric]);}
 return next;
}
export function claimMission(state,id,ms){
 const m=MISSIONS.find(x=>x.id===id);if(!m)throw Error("Misión inexistente");
 const k=missionKey(m,ms);if(state.claimed[k]||(state.progress[k]||0)<m.target)return state;
 return {...state,coins:state.coins+m.coins,crystals:state.crystals+m.crystals,claimed:{...state.claimed,[k]:true}};
}
export function claimBonus(state,period,ms){
 if(!["day","week"].includes(period))throw Error("Periodo sin bonus");
 const k="bonus:"+period+":"+periodKey(period,ms);
 if(state.claimed[k]||!MISSIONS.filter(m=>m.period===period).every(m=>(state.progress[missionKey(m,ms)]||0)>=m.target))return state;
 return {...state,crystals:state.crystals+(period==="day"?2:5),claimed:{...state.claimed,[k]:true}};
}
export function claimSeason(state,level){
 const reward=SEASON_REWARDS[level],key="season:"+SEASON.id+":"+level;
 if(!reward||state.claimed[key]||Math.min(SEASON.levels,1+Math.floor(state.seasonXP/1000))<level)return state;
 return {...state,coins:state.coins+(reward.coins||0),crystals:state.crystals+(reward.crystals||0),owned:reward.cosmetic?[...new Set([...state.owned,reward.cosmetic])]:state.owned,claimed:{...state.claimed,[key]:true}};
}
// 2% base, +4 percentage points per pull beginning at 45; forced at 60.
export function exoticRate(counter){const n=counter+1;return n>=60?1:n>=45?Math.min(.98,.02+.04*(n-44)):.02}
export function pull(state,banner,rng=Math.random){
 if(!banner||typeof banner.group!=="string"||!banner.featured||!Array.isArray(banner.offBanner)||!banner.offBanner.length)throw Error("Banner inválido");
 if(!Number.isInteger(state.crystals)||state.crystals<1)throw Error("Cristales insuficientes");
 const p=state.pity[banner.group]||{exotic:0,epic:0,guaranteed:false};
 const roll=rng(),rate=exoticRate(p.exotic);
 let rarity,item,guaranteed=p.guaranteed;
 if(roll<rate){rarity="exotic";const win=guaranteed||rng()<.5;item=win?banner.featured:banner.offBanner[Math.min(banner.offBanner.length-1,Math.floor(rng()*banner.offBanner.length))];guaranteed=!win;}
 else {const u=(roll-rate)/(1-rate);rarity=u<.08/.98?"legendary":u<.35/.98||p.epic>=9?"epic":"rare";item=rarity+"-demo";}
 const duplicate=state.owned.includes(item),shardRate={rare:1,epic:3,legendary:8,exotic:20};
 const next={...state,crystals:state.crystals-1,shards:state.shards+(duplicate?shardRate[rarity]:0),owned:duplicate?state.owned:[...state.owned,item],pity:{...state.pity,[banner.group]:{exotic:rarity==="exotic"?0:p.exotic+1,epic:rarity==="rare"?p.epic+1:0,guaranteed}}};
 return {state:next,result:{item,rarity,duplicate}};
}
export function pullBatch(state,banner,count,rng=Math.random){
 if(![1,10].includes(count)||state.crystals<count)throw Error("Cristales insuficientes o cantidad inválida");
 const results=[];let next=state;for(let i=0;i<count;i++){const r=pull(next,banner,rng);next=r.state;results.push(r.result)}return {state:next,results};
}
export function layoutPlan(size,width,height,device){
 if(!Number.isInteger(size)||size<1||size>5||width<=0||height<=0)throw Error("Diseño inválido");
 const mobile=device==="mobile",portrait=height>=width;
 return {size,slots:2*size,axis:mobile&&portrait?"vertical":"horizontal",compact:mobile||height<600,teamColumns:mobile&&portrait?size:2};
}
export function balanceTeams(players,size){
 if(!Number.isInteger(size)||size<1||size>5||players.length!==size*2||new Set(players.map(p=>p.id)).size!==players.length||players.some(p=>!Number.isFinite(p.mmr)))throw Error("Alineación inválida");
 // exhaustive partition of at most ten solo players, deterministic tie break.
 const ordered=[...players].sort((a,b)=>b.mmr-a.mmr||String(a.id).localeCompare(String(b.id)));
 const total=ordered.reduce((a,p)=>a+p.mmr,0);let best=null;
 function visit(i,a,sum){if(a.length===size){const diff=Math.abs(total-2*sum);if(!best||diff<best.diff)best={a:[...a],diff};return;}if(ordered.length-i<size-a.length)return;visit(i+1,[...a,i],sum+ordered[i].mmr);visit(i+1,a,sum);}
 visit(1,[0],ordered[0].mmr);const selected=new Set(best.a);return {cherry:ordered.filter((_,i)=>selected.has(i)),nova:ordered.filter((_,i)=>!selected.has(i)),difference:best.diff};
}
