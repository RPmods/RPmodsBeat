const assert=require('assert');global.window=global;require('../rig-data.js');require('../motion.js');let count=0,err=0,minimum=Infinity;
for(const [c,m] of Object.entries(CBRigData)) for(const action of CherryMotion.actions) for(let t=0;t<=20;t++){
 const a=CherryMotion.sample(action,CherryMotion.durations[action]*t/20),v=CherryMotion.vertices(c,a),cut=Math.ceil((m.hairY+2)/32)*2;
 assert(v.every(Number.isFinite));
 // Verify distance between each head vertex and three reference vertices after rigid transformation.
 for(let y=0;y<=cut;y++)for(let x=0;x<=30;x++){let i=y*31+x;for(let [rx,ry] of [[0,0],[30,0],[0,cut]]){let j=ry*31+rx;const d=Math.hypot(v[i*2]-v[j*2],v[i*2+1]-v[j*2+1]),expected=Math.hypot(x-rx,y-ry)*16*.94;err=Math.max(err,Math.abs(d-expected));assert(Math.abs(d-expected)<.001);}}
 for(let y=0;y<30;y++)for(let x=0;x<30;x++){let i=y*31+x,j=i+1,k=i+31,l=k+1;for(let [a,b,c] of [[i,j,k],[j,l,k]]){let d=(v[2*b]-v[2*a])*(v[2*c+1]-v[2*a+1])-(v[2*b+1]-v[2*a+1])*(v[2*c]-v[2*a]);assert(d>0);minimum=Math.min(minimum,d)}}count++;
}console.log(`${count} muestras; error máximo de distancia facial ${err.toFixed(6)}px; mínima área orientada ${minimum.toFixed(3)}.`);
