/* Server-only account economy and rank domain. Never trust client balances or results. */
const REWARDS=Object.freeze({register:{coins:500,crystals:5},verify:{coins:1000,crystals:10}});
const RANKS=Object.freeze([{name:"Rookie",min:0},{name:"Rhythm",min:800},{name:"Harmony",min:1100},{name:"Virtuoso",min:1400},{name:"Starlight",min:1700},{name:"Encore",min:2000},{name:"Idol Legend",min:2300}]);
const validId=s=>typeof s==="string"&&/^[A-Za-z0-9_-]{1,128}$/.test(s);
const nonnegative=n=>Number.isSafeInteger(n)&&n>=0?n:0;
function accountRewards(existing,identity,now){
 if(!identity||!validId(identity.uid)||identity.disabled===true||typeof identity.email!=="string"||!identity.email||!Number.isSafeInteger(now)||now<0)throw Error("Account not eligible");
 const old=existing??{},claims={...(old.claims||{})},wallet={coins:nonnegative(old.wallet?.coins),crystals:nonnegative(old.wallet?.crystals)};
 const awarded=[];
 for(const type of ["register","verify"]){if(type==="verify"&&identity.emailVerified!==true)continue;if(claims[type])continue;const r=REWARDS[type];wallet.coins+=r.coins;wallet.crystals+=r.crystals;if(!Number.isSafeInteger(wallet.coins)||!Number.isSafeInteger(wallet.crystals))throw Error("Wallet overflow");claims[type]={at:now,coins:r.coins,crystals:r.crystals};awarded.push(type)}
 return {record:awarded.length?{...old,wallet,claims,version:1}:old,awarded};
}
function rankFor(mmr){if(!Number.isInteger(mmr)||mmr<0)throw Error("Invalid MMR");let i=RANKS.findLastIndex(r=>mmr>=r.min),tier=RANKS[i];if(i===RANKS.length-1)return {tier:tier.name,division:null};const span=RANKS[i+1].min-tier.min,division=["III","II","I"][Math.min(2,Math.floor((mmr-tier.min)*3/span))];return {tier:tier.name,division}}
function rankedSettlement(state,match){
 // This function is for an authenticated internal match adjudicator only.
 if(!match||!validId(match.id)||match.mode!=="ranked"||match.complete!==true||!["cherry","nova","draw"].includes(match.winner)||!Array.isArray(match.cherry)||!Array.isArray(match.nova)||match.cherry.length<1||match.cherry.length>5||match.nova.length!==match.cherry.length)throw Error("Invalid competitive match");
 const players=[...match.cherry,...match.nova];if(players.some(p=>!p||!validId(p.uid)||p.simulated!==false)||new Set(players.map(p=>p.uid)).size!==players.length)throw Error("Ranked requires distinct real players");
 if(Object.prototype.hasOwnProperty.call(state.processed||{},match.id))return state;
 const ratings={...(state.ratings||{})};const rating=p=>{const n=ratings[p.uid]?.mmr;return Number.isInteger(n)&&n>=0&&n<=10000?n:1000};
 const avg=team=>team.reduce((a,p)=>a+rating(p),0)/team.length;
 const a=avg(match.cherry),b=avg(match.nova),expected=1/(1+10**((b-a)/400)),actual=match.winner==="draw"?.5:match.winner==="cherry"?1:0,delta=Math.round(32*(actual-expected));
 for(const [team,change] of [[match.cherry,delta],[match.nova,-delta]])for(const p of team){const old=ratings[p.uid]||{},mmr=Math.max(0,Math.min(10000,rating(p)+change));ratings[p.uid]={...old,mmr,rank:rankFor(mmr),matches:nonnegative(old.matches)+1}}
 return {...state,ratings,processed:{...(state.processed||{}),[match.id]:true}};
}
module.exports={REWARDS,RANKS,accountRewards,rankFor,rankedSettlement};
