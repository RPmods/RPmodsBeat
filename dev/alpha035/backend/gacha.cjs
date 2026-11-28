/* Server-only gacha: authoritative catalogue, debit, pity and replay-safe receipt. */
const {createHmac,randomBytes}=require("node:crypto");
const POOLS=Object.freeze({exotic:["exotic-galaxy","zomby-nexus"],legendary:["legend-nebula","legend-rose","zomby-astral","zomby-night"],epic:["set-ocean","set-plum","zomby-starmap","zomby-void"],rare:["accessory-moon","accessory-notes","accessory-bow","eyes-aqua","eyes-violet","cloth-gold","hair-peach","hair-silver","hair-rose","cloth-blue","cloth-crimson","eyes-emerald","eyes-rose"]});
const SHARDS={rare:1,epic:3,legendary:8,exotic:20};
function validRequest(q){return q&&["all","classic","zomby"].includes(q.banner)&&[1,10].includes(q.count)&&typeof q.requestId==="string"&&/^[a-zA-Z0-9_-]{16,80}$/.test(q.requestId)}
function seeded(seed){let counter=0;return ()=>createHmac("sha256",seed).update(String(counter++)).digest().readUInt32BE(0)/4294967296}
function settle(existing,q,seed,now){
 if(!validRequest(q))throw Error("invalid-request");
 const old=existing||{},prior=old.draws?.[q.requestId];
 if(prior){if(prior.banner!==q.banner||prior.count!==q.count)throw Error("request-conflict");return old}
 const balance=old.wallet?.crystals;
 if(!Number.isSafeInteger(balance)||balance<q.count)throw Error("insufficient-crystals");
 const group=q.banner==="all"?"standard":"limited",featured=q.banner==="zomby"?"zomby-nexus":"exotic-galaxy";
 const stored=old.pity?.[group]||{},cap=(v,max)=>Number.isInteger(v)?Math.min(max,Math.max(0,v)):0;
 let p={exotic:cap(stored.exotic,59),epic:cap(stored.epic,9),guaranteed:group==="limited"&&stored.guaranteed===true};
 const inventory={...(old.inventory||{})},results=[],rng=seeded(seed);let shards=Number.isSafeInteger(old.shards)&&old.shards>=0?old.shards:0;
 const pick=a=>a[Math.floor(rng()*a.length)];
 for(let i=0;i<q.count;i++){
  const n=p.exotic+1,rate=n>=60?1:n>=45?Math.min(.98,.02+.04*(n-44)):.02,v=rng();let rarity,id;
  if(v<rate){rarity="exotic";if(group==="standard"){id=pick(POOLS.exotic);p.guaranteed=false}else{const won=p.guaranteed||rng()<.5;id=won?featured:pick(POOLS.exotic.filter(x=>x!==featured));p.guaranteed=!won}}
  else{const u=(v-rate)/(1-rate);rarity=u<.08/.98?"legendary":u<.35/.98||p.epic>=9?"epic":"rare";const pool=POOLS[rarity].filter(x=>group==="standard"||rarity==="rare"||(q.banner==="zomby"?x.startsWith("zomby-"):!x.startsWith("zomby-")));id=pick(pool)}
  const duplicate=inventory[id]===true;inventory[id]=true;const reward=duplicate?SHARDS[rarity]:0;shards+=reward;results.push({id,rarity,duplicate,shards:reward});
  p={...p,exotic:rarity==="exotic"?0:p.exotic+1,epic:rarity==="rare"?p.epic+1:0};
 }
 if(!Number.isSafeInteger(shards))throw Error("wallet-overflow");
 const receipt={banner:q.banner,count:q.count,at:now,results};
 return {...old,wallet:{...old.wallet,crystals:balance-q.count},inventory,pity:{...(old.pity||{}),[group]:p},shards,draws:{...(old.draws||{}),[q.requestId]:receipt}};
}
module.exports={POOLS,validRequest,settle,newSeed:()=>randomBytes(32)};
