/* Experimental Firebase callable. NOT deployed and NOT connected to legacy profile. */
const {onCall,HttpsError}=require("firebase-functions/v2/https");
const {initializeApp}=require("firebase-admin/app");
const {getAuth}=require("firebase-admin/auth");
const {getDatabase}=require("firebase-admin/database");
const {accountRewards}=require("./domain.cjs");
initializeApp();
exports.claimAccountRewards=onCall({region:"us-central1",maxInstances:5},async request=>{
 if(!request.auth)throw new HttpsError("unauthenticated","Inicia sesión primero.");
 const uid=request.auth.uid;
 let identity;try{identity=await getAuth().getUser(uid)}catch{throw new HttpsError("failed-precondition","Cuenta no disponible.")}
 if(identity.disabled||!identity.email)throw new HttpsError("failed-precondition","Cuenta no elegible.");
 const ref=getDatabase().ref("rpbSecure/users").child(uid),now=Date.now();
 try{
  const result=await ref.transaction(current=>{const next=accountRewards(current,identity,now);return next.awarded.length?next.record:undefined});
  const record=result.snapshot.val()||{};
  return {wallet:record.wallet||{coins:0,crystals:0},registrationClaimed:!!record.claims?.register,verificationClaimed:!!record.claims?.verify,emailVerified:identity.emailVerified===true};
 }catch(e){console.error("claimAccountRewards failed",e?.code||"unknown");throw new HttpsError("internal","No se pudo comprobar la recompensa.");}
});
