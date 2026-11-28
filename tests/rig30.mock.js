const assert=require('assert'),M=require('../assets/rig/motion35.js');
let samples=0,minimum=Infinity,maxError=0;
const bounds={ruby:[193,86,578,716],neko:[203,76,565,716],guizz:[193,107,578,719],meli:[204,72,567,717],zomby:[212,76,556,722]};
for(const [char,c] of Object.entries(M.cast))for(const action of M.actions)for(const side of [-1,1])for(let frame=0;frame<=40;frame++){
 const a=M.sample(action,M.durations[action]*frame/40,side,char),m=M.matrix(char,a);
 assert(Object.values(a).every(Number.isFinite));assert(Math.abs(a.head)<=1.65+1e-8);assert(a.scale>0&&a.alpha>=0&&a.alpha<=1);
 const x=M.point(m,0,0),y=M.point(m,100,0),z=M.point(m,0,100),dx=y.map((v,i)=>v-x[i]),dy=z.map((v,i)=>v-x[i]);
 const e=Math.abs(Math.hypot(...dx)-Math.hypot(...dy));maxError=Math.max(maxError,e);assert(e<1e-8);assert(Math.abs(dx[0]*dy[0]+dx[1]*dy[1])<1e-8);
 const determinant=m[0]*m[3]-m[1]*m[2];assert(determinant>0);minimum=Math.min(minimum,determinant);
 const b=bounds[char].map(v=>v/1.6);
 // Actual master bounds plus a conservative 7px margin for the rigid head rotation.
 for(const px of [b[0]-7,b[2]+7])for(const py of [b[1]-7,b[3]+7]){const p=M.point(m,px,py);assert(p.every(v=>v>=0&&v<=480),char+' '+action+' clipped '+p)}
 samples++;
}
for(const [char,c] of Object.entries(M.cast)){
 for(let x=100;x<=380;x+=2){const y=M.seamAt(char,x);assert(M.headMask(char,x,y-9)===1);assert(M.bodyMask(char,x,y)===1);assert(M.headMask(char,x,y+9)===0);
  // Where torso has not begun, the rotated head still covers the boundary.
  for(const deg of [-1.65,1.65]){const a=deg*Math.PI/180,dx=x-c.neck[0],dy=y-9-c.neck[1],sx=c.neck[0]+dx*Math.cos(a)+dy*Math.sin(a),sy=c.neck[1]-dx*Math.sin(a)+dy*Math.cos(a);assert(M.headMask(char,sx,sy)>.96);}
 }
 const [x,y,X,Y]=c.mouth;assert(Y/1.6<M.seamAt(char,(x+X)/3.2));const n=(X-x)*(Y-y)*4,base=new Uint8ClampedArray(n).fill(210),over=new Uint8ClampedArray(n).fill(230),r=M.repair(base,over,c.mouth);assert(r[3]===0);assert(r.length===n);
}
for(const char of Object.keys(M.cast)){const a=M.sample('idle-breathe',0,1,char),b=M.sample('idle-breathe',M.durations['idle-breathe'],1,char);for(const k of Object.keys(a))assert(Math.abs(a[k]-b[k])<1e-8);}
console.log(samples+' motion samples; equal-scale error '+maxError.toFixed(10)+'; minimum determinant '+minimum.toFixed(6)+'; five head seams, face masks and cyclic idle PASS');
