/* Full callable + Auth + RTDB integration; refuses to run outside the local demo. */
const assert=require("node:assert/strict");
const {initializeApp}=require("firebase-admin/app");
const {getAuth}=require("firebase-admin/auth");
const {getDatabase}=require("firebase-admin/database");
const project="demo-rpb-alpha035",ns=project+"-default-rtdb";
if(process.env.FIREBASE_AUTH_EMULATOR_HOST!=="127.0.0.1:9099"||process.env.FIREBASE_DATABASE_EMULATOR_HOST!=="127.0.0.1:9000")throw Error("Local emulator only");
initializeApp({projectId:project,databaseURL:"https://"+ns+".firebaseio.com"});
const authUrl="http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key",callUrl="http://127.0.0.1:5001/"+project+"/us-central1/claimAccountRewards";
async function signup(name){const r=await fetch(authUrl,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:name+"-"+Date.now()+"@example.invalid",password:"TestOnly-12345",returnSecureToken:true})});const v=await r.json();assert.equal(r.status,200,JSON.stringify(v));return v}
async function call(token,data={},endpoint="claimAccountRewards"){const r=await fetch(callUrl.replace("claimAccountRewards",endpoint),{method:"POST",headers:{"content-type":"application/json",...(token?{authorization:"Bearer "+token}:{})},body:JSON.stringify({data})});return {status:r.status,body:await r.json()}}
async function run(){
 const a=await signup("alpha"),b=await signup("beta");const reject=await call(null);assert.equal(reject.status,401,JSON.stringify(reject.body));
 const concurrent=await Promise.all(Array.from({length:5},()=>call(a.idToken,{coins:999999,uid:b.localId,emailVerified:true})));
 for(const x of concurrent){assert.equal(x.status,200,JSON.stringify(x.body));assert.deepEqual(x.body.result.wallet,{coins:500,crystals:5});assert.equal(x.body.result.verificationClaimed,false)}
 const ref=getDatabase().ref("rpbSecure/users/"+a.localId);let record=(await ref.get()).val();assert.deepEqual(record.wallet,{coins:500,crystals:5});assert.equal(Object.keys(record.claims).length,1);
 await getAuth().updateUser(a.localId,{emailVerified:true});
 const verified=await Promise.all(Array.from({length:4},()=>call(a.idToken)));
 for(const x of verified){assert.equal(x.status,200,JSON.stringify(x.body));assert.deepEqual(x.body.result.wallet,{coins:1500,crystals:15});assert.equal(x.body.result.verificationClaimed,true)}
 record=(await ref.get()).val();assert.equal(Object.keys(record.claims).length,2);assert.deepEqual(record.wallet,{coins:1500,crystals:15});
 const dburl=(uid,token)=>"http://127.0.0.1:9000/rpbSecure/users/"+uid+".json?ns="+ns+"&auth="+encodeURIComponent(token);
 const own=await fetch(dburl(a.localId,a.idToken));assert.equal(own.status,200,await own.clone().text());
 const denied=await fetch(dburl(a.localId,a.idToken),{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({wallet:{coins:999999}})});assert.ok([401,403].includes(denied.status),await denied.text());
 const foreign=await fetch(dburl(a.localId,b.idToken));assert.ok([401,403].includes(foreign.status),await foreign.text());
 assert.equal((await getDatabase().ref("rpbSecure/users/"+b.localId).get()).exists(),false);
 assert.deepEqual((await ref.get()).val().wallet,{coins:1500,crystals:15});
 const draw={banner:"classic",count:10,requestId:"emulator-draw-0001"};
 const unverified=await call(b.idToken,draw,"drawBanner");assert.equal(unverified.status,400,JSON.stringify(unverified.body));
 const pulls=await Promise.all(Array.from({length:4},()=>call(a.idToken,draw,"drawBanner")));
 for(const x of pulls){assert.equal(x.status,200,JSON.stringify(x.body));assert.equal(x.body.result.wallet.crystals,5);assert.deepEqual(x.body.result.receipt,pulls[0].body.result.receipt)}
 const tooMuch=await call(a.idToken,{...draw,requestId:"emulator-draw-0002"},"drawBanner");assert.equal(tooMuch.status,400,JSON.stringify(tooMuch.body));
 const mismatch=await call(a.idToken,{...draw,count:1},"drawBanner");assert.equal(mismatch.status,409,JSON.stringify(mismatch.body));
 const final=(await ref.get()).val();assert.equal(final.wallet.crystals,5);assert.equal(Object.keys(final.draws).length,1);assert.equal(final.draws[draw.requestId].results.length,10);
 console.log("PASS Firebase emulator: actual gacha transaction, concurrent retry, insufficient funds, request conflict");
 console.log("PASS Firebase emulator: concurrent claims, verified identity, tampered payload ignored, own read, denied writes/cross-account read");
}
run().then(()=>process.exit(0),e=>{console.error(e);process.exit(1)});
