/* Experimental Firebase callable. NOT deployed and NOT connected to legacy profile. */
const {onCall,HttpsError}=require("firebase-functions/v2/https");
const {initializeApp}=require("firebase-admin/app");
const {getAuth}=require("firebase-admin/auth");
const {getDatabase}=require("firebase-admin/database");
const {accountRewards}=require("./domain.cjs");
const demo=process.env.FUNCTIONS_EMULATOR==="true"&&process.env.GCLOUD_PROJECT==="demo-rpb-alpha035";
initializeApp(demo?{projectId:"demo-rpb-alpha035",databaseURL:"https://demo-rpb-alpha035-default-rtdb.firebaseio.com"}:undefined);
exports.claimAccountRewards=onCall({region:"us-central1",maxInstances:5},async request=>{
 if(!request.auth)throw new HttpsError("unauthenticated","Inicia sesión primero.");
 const uid=request.auth.uid;
 let identity;try{identity=await getAuth().getUser(uid)}catch{throw new HttpsError("failed-precondition","Cuenta no disponible.")}
 if(identity.disabled||!identity.email)throw new HttpsError("failed-precondition","Cuenta no elegible.");
 const ref=getDatabase().ref("rpbSecure/users").child(uid),now=Date.now();
 try{
  const result=await ref.transaction(current=>{const next=accountRewards(current,identity,now);return next.record});
  const record=result.snapshot.val()||{};
  return {wallet:record.wallet||{coins:0,crystals:0},registrationClaimed:!!record.claims?.register,verificationClaimed:!!record.claims?.verify,emailVerified:identity.emailVerified===true};
 }catch(e){console.error("claimAccountRewards failed",e?.code||"unknown");throw new HttpsError("internal","No se pudo comprobar la recompensa.");}
});

const Gacha=require("./gacha.cjs");
exports.drawBanner=onCall({region:"us-central1",maxInstances:5},async request=>{
 if(!request.auth)throw new HttpsError("unauthenticated","Inicia sesión primero.");
 const q=request.data;if(!Gacha.validRequest(q))throw new HttpsError("invalid-argument","Invocación inválida.");
 const identity=await getAuth().getUser(request.auth.uid);
 if(identity.disabled||!identity.emailVerified)throw new HttpsError("failed-precondition","Verifica tu correo primero.");
 const ref=getDatabase().ref("rpbSecure/users").child(identity.uid),seed=Gacha.newSeed(),now=Date.now();
 try{
  // Read before transaction: Admin transactions may initially see a null local cache.
  // Do not abort on a stale insufficient-balance snapshot; return it unchanged and verify committed receipt.
  await ref.get();
  const result=await ref.transaction(current=>{
   try{return Gacha.settle(current,q,seed,now)}catch(e){if(["insufficient-crystals","request-conflict"].includes(e.message))return current;throw e}
  });
  const record=result.snapshot.val(),receipt=record?.draws?.[q.requestId];
  if(!receipt)throw new HttpsError("failed-precondition","Cristales insuficientes.");
  if(receipt.banner!==q.banner||receipt.count!==q.count)throw new HttpsError("already-exists","Identificador de invocación utilizado.");
  return {receipt,wallet:record.wallet,pity:record.pity,shards:record.shards||0};
 }catch(e){if(e instanceof HttpsError)throw e;console.error("drawBanner failed",e?.code||"unknown");throw new HttpsError("internal","No se pudo completar la invocación.")}
});
