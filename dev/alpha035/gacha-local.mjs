// Guest-only experimental banner logic. Production rolls must be server-authoritative.
import {exoticRate} from "./core.mjs";
const rates={rare:1,epic:3,legendary:8,exotic:20};
const groups=["limited","standard"];
const counter=(n,max)=>Number.isInteger(n)?Math.max(0,Math.min(max,n)):0;
function normalized(data,group){const p=data?.pity?.[group]||{};return {exotic:counter(p.exotic,59),epic:counter(p.epic,9),guaranteed:group==="limited"&&p.guaranteed===true}}
export function bannerFor(selection,pools){
 if(!["all","classic","zomby"].includes(selection))throw Error("Banner inválido");
 const group=selection==="all"?"standard":"limited",featured=selection==="zomby"?"zomby-nexus":"exotic-galaxy";
 const exotic=[...pools.exotic],pickPool=r=>pools[r].filter(id=>group==="standard"||r==="rare"||(selection==="zomby"?id.startsWith("zomby-"):!id.startsWith("zomby-")));
 if(!exotic.length||!exotic.includes(featured)||exotic.length<2)throw Error("Catálogo exótico incompleto");
 const catalog={rare:pickPool("rare"),epic:pickPool("epic"),legendary:pickPool("legendary"),exotic};
 if(Object.values(catalog).some(a=>!a.length))throw Error("Banner sin catálogo");
 return {group,featured:group==="limited"?featured:null,offBanner:exotic.filter(x=>x!==featured),pools:catalog};
}
export function rollBatch(data,banner,count,balance,rng=Math.random){
 if(![1,10].includes(count)||!Number.isSafeInteger(balance)||balance<count||!groups.includes(banner.group))throw Error("Cristales insuficientes o banner inválido");
 let p=normalized(data,banner.group);const result=[];
 const random=()=>{const x=rng();if(!Number.isFinite(x)||x<0||x>=1)throw Error("Generador aleatorio inválido");return x};
 const pick=pool=>{if(!Array.isArray(pool)||!pool.length)throw Error("Catálogo vacío");return pool[Math.floor(random()*pool.length)]};
 for(let i=0;i<count;i++){const rate=exoticRate(p.exotic),v=random();let rarity,id;
  if(v<rate){rarity="exotic";if(banner.group==="standard"){id=pick(banner.pools.exotic);p.guaranteed=false}else{const win=p.guaranteed||random()<.5;id=win?banner.featured:pick(banner.offBanner);p.guaranteed=!win}}
  else{const u=(v-rate)/(1-rate);rarity=u<.08/.98?"legendary":u<.35/.98||p.epic>=9?"epic":"rare";id=pick(banner.pools[rarity])}
  p={...p,exotic:rarity==="exotic"?0:p.exotic+1,epic:rarity==="rare"?p.epic+1:0};result.push({id,rarity,duplicateShards:rates[rarity]});
 }
 return {pity:{...(data?.pity||{}),[banner.group]:p},result};
}
export function bannerStatus(data,banner){const p=normalized(data,banner.group);return {...p,rate:exoticRate(p.exotic),shards:Number.isSafeInteger(data?.shards)&&data.shards>=0?data.shards:0}}
