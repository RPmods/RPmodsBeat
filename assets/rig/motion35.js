/* Cherry Beat 0.35 — authored pose library for the five original chibi masters.
   Coordinates use the original 480px art space; mouth bounds use the 768px master.
   No bone weights, shear, non-uniform scale, or stretching of the illustrated pixels. */
(function(root){
'use strict';
const cast={
 ruby:{pivot:[240,447],mouth:[363,324,420,362],sway:2.3,step:12,lift:24,energy:1.08,phase:0},
 neko:{pivot:[240,447],mouth:[359,318,420,356],sway:2.7,step:14,lift:27,energy:1.12,phase:.5},
 guizz:{pivot:[240,449],mouth:[363,347,417,385],sway:1.65,step:10,lift:18,energy:.90,phase:1.3},
 meli:{pivot:[240,448],mouth:[363,335,423,373],sway:1.5,step:9,lift:16,energy:.85,phase:2.1},
 zomby:{pivot:[240,451],mouth:[385,297,439,335],sway:1.25,step:8,lift:15,energy:.80,phase:2.8}
};
const durations={left:.65,right:.65,up:.82,down:.55,entry:1.8,exit:1.5,victory:3.6,defeat:3.1,miss:1.2,perfect:1.25,'look-left':1.3,'look-right':1.3,'idle-breathe':6,'idle-tired':6.8,'idle-dance':6.8,'idle-excited':5.8,...Object.fromEntries(['wave','bow','spin','dance','think','pose','cheer'].map(x=>['wardrobe-'+x,4.7])),...Object.fromEntries(Array.from({length:5},(_,i)=>['fail-'+(i+1),1.4+i*.1])),...Object.fromEntries(Array.from({length:5},(_,i)=>['cheer-'+(i+1),1.3+i*.1]))};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},TAU=Math.PI*2;
const neutral=()=>({x:0,y:0,angle:0,scale:1,alpha:1,face:0,fx:0});
function sample(action,time,side=1,char='ruby'){
 const c=cast[char]||cast.ruby,a=neutral(),t=Math.max(0,Number(time)||0),d=durations[action]||1,q=clamp(t/d),p=TAU*q;
 const w=Math.sin(Math.PI*q),s=Math.sin(p),pulse=(rise=.20,fall=.60)=>ease(q/rise)*(1-ease((q-fall)/(1-fall))),h=pulse(),beat=Math.sin(TAU*t/4.8+c.phase);
 if(action.startsWith('idle-')){
  const cycle=TAU*t/d+c.phase,soft=(1-Math.cos(cycle))/2;
  a.angle=c.sway*.42*Math.sin(cycle);a.y=-1.7*soft;
  if(action==='idle-dance'){a.angle=c.sway*.9*Math.sin(cycle*2);a.x=c.step*.22*Math.sin(cycle);a.y=-3.5*Math.sin(cycle*2)**2}
  if(action==='idle-tired'){a.angle=c.sway*.65*soft;a.y=1.2*soft;a.face=-.35*soft}
  if(action==='idle-excited'){a.y=-4.5*Math.sin(cycle)**2;a.angle=c.sway*.65*Math.sin(cycle);a.face=.7*soft}
  return a
 }
 switch(action){
 case 'left':case 'right':{const sign=action==='left'?-1:1;const pre=q<.19?Math.sin(Math.PI*q/.19):0;a.x=sign*c.step*h;a.angle=sign*(c.sway*1.65*h-.9*pre);a.y=-3*h+1.8*pre;a.face=.26*h;break}
 case 'up':{const u=clamp((q-.12)/.70);a.y=-c.lift*4*u*(1-u);a.angle=-side*c.sway*.65*w;a.face=.8*w;a.fx=w;break}
 case 'down':a.angle=side*c.sway*1.25*h;a.y=2.2*h;a.scale=1-.025*h;break;
 case 'entry':a.x=side*65*(1-ease(q));a.alpha=ease(q*4);a.y=-8*w;a.angle=side*2*w;break;
 case 'exit':a.x=side*64*ease(q);a.alpha=1-ease(q);a.y=8*w;break;
 case 'miss':case 'defeat':{const f=action==='defeat'?ease(q/.26):pulse(.16,.62);a.angle=-side*c.sway*1.65*f;a.y=1.5*f;a.face=-f;break}
 case 'perfect':a.y=-c.lift*.55*h;a.angle=-side*c.sway*h;a.face=h;a.fx=h;break;
 case 'victory':a.angle=c.sway*Math.sin(p*2)*w;a.y=-c.lift*.65*Math.sin(p*2)**2*w;a.face=ease(q/.16);a.fx=w;break;
 case 'look-left':case 'look-right':a.angle=(action==='look-left'?-1:1)*c.sway*.8*h;a.x=(action==='look-left'?-1:1)*3*h;break;
 case 'wardrobe-wave':a.angle=-c.sway*1.1*h+.55*Math.sin(p*4)*h;a.y=-2*h;a.face=h;break;
 case 'wardrobe-bow':a.angle=c.sway*1.8*h;a.y=2*h;a.scale=1-.018*h;break;
 case 'wardrobe-spin':a.angle=c.sway*1.5*s;a.x=c.step*.6*s;a.y=-5*w;a.face=.5*w;break;
 case 'wardrobe-dance':a.angle=c.sway*1.55*Math.sin(p*2)*w;a.x=c.step*.55*s;a.y=-c.lift*.42*Math.sin(p*2)**2*w;a.face=.65*w;break;
 case 'wardrobe-think':a.angle=-c.sway*1.3*h;a.x=-3*h;a.face=-.24*h;break;
 case 'wardrobe-pose':a.angle=c.sway*1.6*h;a.x=c.step*.35*h;a.face=.9*h;break;
 case 'wardrobe-cheer':a.y=-c.lift*.66*Math.sin(p*2)**2*w;a.angle=c.sway*Math.sin(p)*w;a.face=w;a.fx=w;break;
 default:{const good=action.startsWith('cheer-'),bad=action.startsWith('fail-'),n=+(action.split('-')[1]||1);if(good||bad){a.angle=side*c.sway*(.65+n*.16)*h*(n%2?1:-1);a.x=side*(n%2?1:-1)*c.step*.25*h;a.y=good?-c.lift*(.18+n*.045)*h:1.4*h;a.face=good?h:-h;a.fx=good?h:0}}
 }
 return a
}
function mix(a,b,f){const out={};for(const k of Object.keys(b))out[k]=(a?.[k]??b[k])*(1-f)+b[k]*f;return out}
function matrix(char,a){const [px,py]=(cast[char]||cast.ruby).pivot,ang=a.angle*Math.PI/180,s=a.scale,c=Math.cos(ang)*s,k=Math.sin(ang)*s;return [c,k,-k,c,px+a.x-c*px+k*py,py+a.y-k*px-c*py]}
function point(m,x,y){return [m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]]}
/* Color-adapted feathered facial patches. The original drawn mouth stays intact;
   only the oval skin surround is blended. Coordinates are authored per master. */
function repair(base,overlay,rect){
 const out=new Uint8ClampedArray(overlay),w=rect[2]-rect[0],h=rect[3]-rect[1];let delta=[0,0,0],n=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,r=Math.hypot((x+.5-w/2)/(w/2),(y+.5-h/2)/(h/2));if(r>.64&&r<.9&&overlay[i+3]>150&&base[i+3]>200&&overlay[i]>165&&base[i]>165){for(let k=0;k<3;k++)delta[k]+=base[i+k]-overlay[i+k];n++}}
 delta=delta.map(x=>n?clamp(x/n,-48,48):0);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,r=Math.hypot((x+.5-w/2)/(w/2),(y+.5-h/2)/(h/2)),f=1-ease((r-.52)/.48),skin=ease((overlay[i]-105)/120);for(let k=0;k<3;k++)out[i+k]=clamp(overlay[i+k]+delta[k]*skin,0,255);out[i+3]=Math.round(overlay[i+3]*f)}
 return out
}
const api={cast,durations,actions:Object.keys(durations),neutral,sample,mix,matrix,point,repair,ease,clamp};
if(typeof module==='object'&&module.exports)module.exports=api;else root.CBMotion35=api;
})(typeof window==='object'?window:globalThis);
