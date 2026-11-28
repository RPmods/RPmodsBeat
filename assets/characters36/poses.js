/* Independent cutout key poses. No skinning, shearing or body-wide rotation.
   Every limb has a physical pivot; feet use a two-bone solve to stay planted. */
(function(root){
'use strict';
const durations={left:.65,right:.65,up:.82,down:.55,entry:1.8,exit:1.5,victory:3.6,defeat:3.1,miss:1.2,perfect:1.25,'look-left':1.3,'look-right':1.3,'idle-breathe':6,'idle-tired':6.8,'idle-dance':6.8,'idle-excited':5.8,...Object.fromEntries(['wave','bow','spin','dance','think','pose','cheer'].map(x=>['wardrobe-'+x,4.7])),...Object.fromEntries(Array.from({length:5},(_,i)=>['fail-'+(i+1),1.4+i*.1])),...Object.fromEntries(Array.from({length:5},(_,i)=>['cheer-'+(i+1),1.3+i*.1]))};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v)},rad=v=>v*Math.PI/180,deg=v=>v*180/Math.PI;
const neutral=()=>({x:0,y:0,hipX:0,hipY:0,head:0,lArm:17,rArm:-17,lFore:5,rFore:-5,lFoot:-18,rFoot:18,lLift:0,rLift:0,face:0,blink:0,alpha:1,accessory:0});
const P=(v={})=>({...neutral(),...v}),N=P();
const clips={
 left:[[0,N],[.15,P({hipX:3,hipY:2,lArm:11,rArm:-30,rFore:-20})],[.36,P({hipX:-7,hipY:1,head:-5,lArm:78,lFore:22,rArm:-27,rFore:-24,lFoot:-28,face:.6})],[.64,P({hipX:-4,head:-3,lArm:53,lFore:12,rArm:-22,lFoot:-22})],[1,N]],
 right:[[0,N],[.15,P({hipX:-3,hipY:2,rArm:-11,lArm:30,lFore:20})],[.36,P({hipX:7,hipY:1,head:5,rArm:-78,rFore:-22,lArm:27,lFore:24,rFoot:28,face:.6})],[.64,P({hipX:4,head:3,rArm:-53,rFore:-12,lArm:22,rFoot:22})],[1,N]],
 up:[[0,N],[.18,P({hipY:8,head:2,lArm:27,rArm:-27,lFore:20,rFore:-20})],[.44,P({y:-25,hipY:4,head:-3,lArm:116,rArm:-116,lFore:22,rFore:-22,lLift:7,rLift:4,face:1})],[.72,P({y:-10,hipY:2,lArm:70,rArm:-70,lFore:10,rFore:-10,face:.8})],[.86,P({hipY:7,lArm:25,rArm:-25})],[1,N]],
 down:[[0,N],[.3,P({hipY:11,head:6,lArm:34,rArm:-34,lFore:28,rFore:-28,lFoot:-23,rFoot:23,blink:1})],[.57,P({hipY:7,head:4,lArm:25,rArm:-25})],[1,N]],
 perfect:[[0,N],[.25,P({y:-12,head:-4,lArm:108,rArm:-52,lFore:30,rFore:-27,lLift:3,face:1})],[.48,P({lArm:76,rArm:-37,lFore:38,rFore:-24,face:1})],[.78,P({lArm:42,rArm:-25,face:1})],[1,N]],
 miss:[[0,N],[.26,P({hipY:6,head:7,lArm:8,rArm:-8,lFore:15,rFore:-15,face:-1,blink:1})],[.6,P({hipY:5,head:5,face:-1})],[1,N]],
 defeat:[[0,N],[.32,P({hipY:8,head:9,lArm:7,rArm:-7,face:-1})],[1,P({hipY:6,head:6,lArm:10,rArm:-10,face:-1})]],
 victory:[[0,N],[.17,P({hipY:5,lArm:60,rArm:-60,lFore:20,rFore:-20,face:1})],[.36,P({y:-16,head:-4,lArm:136,rArm:-128,lFore:10,rFore:-10,face:1})],[.55,P({hipY:5,lArm:98,rArm:-95,face:1})],[.73,P({y:-9,head:3,lArm:115,rArm:-130,lFore:25,rFore:-30,face:1})],[1,P({lArm:68,rArm:-36,lFore:32,rFore:-20,face:1})]],
 entry:[[0,P({x:-65,alpha:0})],[.35,P({x:-32,lFoot:-25,rLift:6,lArm:30,rArm:-7,alpha:1})],[.65,P({x:-9,lLift:5,rFoot:26,lArm:8,rArm:-30,alpha:1})],[1,N]],
 exit:[[0,N],[.45,P({x:28,rLift:5,lFoot:-25,lArm:10,rArm:-32,alpha:.8})],[1,P({x:65,alpha:0})]],
 'look-left':[[0,N],[.35,P({head:-6,hipX:-2})],[1,P({head:-4,hipX:-1})]],
 'look-right':[[0,N],[.35,P({head:6,hipX:2})],[1,P({head:4,hipX:1})]],
 'wardrobe-wave':[[0,N],[.22,P({rArm:-132,rFore:-32,face:1,head:3})],[.4,P({rArm:-125,rFore:-4,face:1})],[.55,P({rArm:-133,rFore:-35,face:1})],[.7,P({rArm:-125,rFore:-5,face:1})],[1,N]],
 'wardrobe-bow':[[0,N],[.36,P({hipY:8,head:10,lArm:8,rArm:-8,lFore:24,rFore:-24,blink:1})],[.68,P({hipY:5,head:7,blink:1})],[1,N]],
 'wardrobe-spin':[[0,N],[.25,P({hipX:-6,lFoot:-25,rLift:5,head:-5,lArm:50,rArm:-40})],[.5,P({hipX:6,rFoot:26,lLift:4,head:5,lArm:37,rArm:-54,face:1})],[.75,P({hipX:-3,head:-3,lArm:34,rArm:-25})],[1,N]],
 'wardrobe-dance':[[0,N],[.22,P({hipX:-5,lFoot:-28,head:-4,lArm:65,rArm:-28,face:1})],[.48,P({hipX:5,rFoot:28,head:4,lArm:28,rArm:-65,face:1})],[.72,P({y:-8,lArm:80,rArm:-80,face:1})],[1,N]],
 'wardrobe-think':[[0,N],[.38,P({head:-7,rArm:-25,rFore:-125,lArm:8,face:0})],[.7,P({head:-4,rArm:-25,rFore:-112,lArm:8})],[1,N]],
 'wardrobe-pose':[[0,N],[.35,P({head:5,hipX:4,lArm:41,lFore:115,rArm:-92,rFore:-24,face:1})],[.78,P({head:4,hipX:4,lArm:41,lFore:110,rArm:-72,rFore:-24,face:1})],[1,N]],
 'wardrobe-cheer':[[0,N],[.25,P({hipY:5,lArm:45,rArm:-45,face:1})],[.48,P({y:-18,lArm:125,rArm:-125,lFore:12,rFore:-12,face:1})],[.7,P({hipY:4,lArm:85,rArm:-85,face:1})],[1,N]]
};
function mix(a,b,f){const o={};for(const k of Object.keys(N))o[k]=(a?.[k]??N[k])*(1-f)+(b?.[k]??N[k])*f;return o}
function sample(action,time,side=1,char='ruby'){
 const t=Math.max(0,Number(time)||0),d=durations[action]||1,q=clamp(t/d),vibe={ruby:1,neko:1.05,guizz:.9,meli:.85,zomby:.82}[char]||1;
 if(action.startsWith('idle-')){
  const p=2*Math.PI*t/d,phase={ruby:0,neko:.7,guizz:1.4,meli:2.1,zomby:2.8}[char]||0,blink=((t+phase)%4.65)>4.45&&((t+phase)%4.65)<4.57;
  let a=P({hipY:1.4*(1-Math.cos(p))/2,head:.8*Math.sin(p),lArm:17+1.7*Math.sin(p),rArm:-17-1.7*Math.sin(p),blink:blink?1:0,accessory:2*Math.sin(p)});
  if(action==='idle-dance'){a.hipX=2.8*Math.sin(p);a.head=2.3*Math.sin(p);a.lArm+=8*Math.sin(p*2);a.rArm+=8*Math.sin(p*2)}
  if(action==='idle-tired'){a.head=3;a.hipY+=2;a.face=-.5}
  if(action==='idle-excited'){a.lArm=25+7*Math.sin(p);a.rArm=-25-7*Math.sin(p);a.face=.7;a.hipY+=1.2*Math.sin(p)**2}
  return a
 }
 let seq=clips[action];if(!seq&&/^(cheer|fail)-[1-5]$/.test(action)){const good=action.startsWith('cheer'),n=Number(action.slice(-1));seq=[[0,N],[.32,P(good?{head:side*3,lArm:n%2?83:38,rArm:n%2?-38:-83,lFore:22,rFore:-22,y:-4-n,face:1}:{head:side*5,hipY:4,lArm:9,rArm:-9,face:-1})],[.72,P(good?{face:1,lArm:35,rArm:-35}:{face:-1,head:side*3})],[1,N]]}
 if(!seq)return N;let j=1;while(j<seq.length-1&&q>seq[j][0])j++;let [start,a]=seq[j-1],[end,b]=seq[j],o=mix(a,b,ease((q-start)/(end-start)));
 if(action==='entry'||action==='exit')o.x*=side<0?-1:1;
 for(const k of ['head','hipX','hipY','y'])o[k]*=vibe;
 return o
}
// Inverse kinematics in local coordinates, two rigid links of 34 and 29 units.
// Shoes are anchored independently from the shin angle.
function legSolve(hx,hy,fx,fy,side){let x=fx-hx,y=fy-hy,r=Math.hypot(x,y),d=clamp(r,7,62.9),dir=Math.atan2(-x,y),bend=Math.acos(clamp((34*34+d*d-29*29)/(2*34*d),-1,1));let a=dir+(side==='left'?1:-1)*bend;const kx=hx-34*Math.sin(a),ky=hy+34*Math.cos(a);let tx=hx+x*(d/(r||1)),ty=hy+y*(d/(r||1)),b=Math.atan2(-(tx-kx),ty-ky);return {upper:deg(a),lower:deg(b-a),absolute:deg(b)}}
const fmt=v=>Math.round(v*1000)/1000;
function transforms(a){
 const t={},num=fmt,translate=(x,y)=>'translate('+num(x)+' '+num(y)+')',rotate=(v,x,y)=>'rotate('+num(v)+(x===undefined?'':' '+x+' '+y)+')';
 t.actor=translate(a.x,a.y);t.upper=translate(a.hipX,a.hipY);
 t.head=rotate(a.head,200,201);t.accessory=translate(0,a.accessory);
 for(const [side,s] of [['left',-1],['right',1]]){const L=s===-1;const shx=200+s*28;t[side+'Arm']=translate(shx,222)+' '+rotate(L?a.lArm:a.rArm);t[side+'Fore']='translate(0 30) '+rotate(L?a.lFore:a.rFore);
 const hx=200+s*15+a.hipX,hy=280+a.hipY,fx=200+(L?a.lFoot:a.rFoot),fy=341-(L?a.lLift:a.rLift),leg=legSolve(hx,hy,fx,fy,side);
 t[side+'Leg']=translate(hx,hy)+' '+rotate(leg.upper);t[side+'Shin']='translate(0 34) '+rotate(leg.lower);
 t[side+'Shoe']='translate(0 29) '+rotate(-leg.absolute)+' translate(0 -29)';
 }return t
}
function visibility(a){const blink=a.blink>.6,face=a.face>.42?'happy':a.face<-.42?'sad':'neutral';return {'eyes-open':!blink,'eyes-closed':blink,'mouth-neutral':face==='neutral','mouth-happy':face==='happy','mouth-sad':face==='sad'}}
const api={durations,actions:Object.keys(durations),neutral,sample,mix,ease,clamp,legSolve,transforms,visibility};
if(typeof module==='object'&&module.exports)module.exports=api;else root.CBPoses36=api;
})(typeof window==='object'?window:globalThis);
