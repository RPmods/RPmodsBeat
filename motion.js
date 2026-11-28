/* Cherry Beat 0.35 — distortion-free character renderer; original art and cosmetic layers. */
'use strict';
window.CherryMotion=(()=>{
 const M=window.CBMotion35,{clamp,ease,neutral}=M;
 const data=window.CBRigData, imgs=new Map(), textures=new Map(), instances=new WeakMap();
 const canvas=(n=480)=>{let c=document.createElement('canvas');c.width=c.height=n;return c};
 const image=url=>{if(!imgs.has(url)){let im=new Image();imgs.set(url,new Promise(resolve=>{im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=url;if(im.complete)resolve(im.naturalWidth?im:null)}));if(imgs.size>64)imgs.delete(imgs.keys().next().value)}return imgs.get(url)};
 const variants={hair:['plum','ocean','emerald','peach','silver','rose'],eyes:['aqua','amber','violet','emerald','rose'],cloth:['mint','violet','gold','rose','blue','crimson','galaxy','legend-nebula','legend-rose','epic-ocean','epic-dream','zomby-starmap','zomby-void','zomby-astral','zomby-night','zomby-nexus']};
 const icons=['crown','moon','heart','notes','bow'];
 const effectIcons={'legend-nebula':'crown','legend-rose':'moon','legend-midnight':'notes','epic-ocean':'moon','epic-dream':'notes'};
 function appearance(c,l={}){let outfit=l.accessory?.startsWith('fx-')?l.accessory.slice(3):'original';if(outfit.startsWith('zomby-')&&c!=='zomby')outfit='original';let icon=effectIcons[outfit]||(icons.includes(l.accessory)?l.accessory:null);let fx=outfit==='exotic-galaxy'?`assets/ui/galaxy-${c}.svg`:outfit.startsWith('zomby-')||outfit.startsWith('legend-')?`assets/ui/${outfit}.svg`:l.accessory==='aura'?'assets/ui/aura.svg':null;return {outfit,icon,fx,cloth:l.cloth||'original'}}
 function assets(c,l={}){c=data[c]?c:'ruby';let p=`assets/rig/${c}/`,a=[p+'base.png'];for(let s of ['cloth','hair','eyes'])if(variants[s].includes(l[s])&&!(s==='cloth'&&l[s].startsWith('zomby-')&&c!=='zomby'))a.push(p+s+'-'+l[s]+'.png');return a}
 function staticLayers(c,l={},pose='idle',includeFx=true){let v=appearance(c,l),a=assets(c,l).reverse(),sizes=a.map(()=> 'contain'),positions=a.map(()=> 'center');if(v.icon){a.unshift(`assets/ui/${v.icon}.svg`);sizes.unshift('11% auto');positions.unshift(v.icon==='crown'?'50% 3%':'77% 25%')}if(v.fx&&includeFx){a.push(v.fx);sizes.push('contain');positions.push('center')}return {imgs:a,sizes,positions,...v}}
 function applyStatic(el,c,l,pose='idle',includeFx=true){let v=staticLayers(c,l,pose,includeFx);el.dataset.outfit=v.outfit;el.style.removeProperty('--orbit-image');el.style.setProperty('--equipped-size',v.sizes.join(','));el.style.setProperty('--equipped-position',v.positions.join(','));el.style.backgroundImage=v.imgs.map(u=>`url("${u}")`).join(',');el.style.backgroundSize=v.sizes.join(',');el.style.backgroundPosition=v.positions.join(',');el.style.backgroundRepeat='no-repeat';return v}
 function texture(c,l={}){
 c=data[c]?c:'ruby';let urls=assets(c,l),key=urls.join('|');
 if(!textures.has(key)){
  const promise=Promise.all([...urls.map(image),image('assets/rig/'+c+'/face-happy.png'),image('assets/rig/'+c+'/face-sad.png')]).then(ims=>{
   if(!ims[0])return null;let cv=canvas(768),ctx=cv.getContext('2d',{willReadFrequently:true});for(let im of ims.slice(0,urls.length))if(im)ctx.drawImage(im,0,0,768,768);ctx.globalCompositeOperation='destination-in';ctx.drawImage(ims[0],0,0,768,768);ctx.globalCompositeOperation='source-over';
   let rect=M.cast[c].mouth,[x,y,X,Y]=rect,w=X-x,h=Y-y,face=[null,null];try{const base=ctx.getImageData(x,y,w,h);for(let j=0;j<2;j++){const im=ims[urls.length+j];if(!im)continue;const p=document.createElement('canvas');p.width=w;p.height=h;const pc=p.getContext('2d',{willReadFrequently:true});pc.drawImage(im,x,y,w,h,0,0,w,h);const layer=pc.getImageData(0,0,w,h);layer.data.set(M.repair(base.data,layer.data,rect));pc.putImageData(layer,0,0);face[j]=p}}catch(e){/* file:// or tainted source: preserve base art, skip expression rather than warp it. */}
   let parts=null;try{
    const cut=M.cast[c].cut,top=Math.max(0,Math.floor((Math.min(...cut.map(p=>p[1]))-10)*1.6)),bottom=Math.min(768,Math.ceil((Math.max(...cut.map(p=>p[1]))+11)*1.6));
    const make=(y,h,head)=>{const part=document.createElement('canvas');part.width=768;part.height=h;const pc=part.getContext('2d',{willReadFrequently:true});pc.drawImage(cv,0,y,768,h,0,0,768,h);const im=pc.getImageData(0,0,768,h);for(let x=0;x<768;x++){const seam=M.seamAt(c,(x+.5)/1.6);for(let row=0;row<h;row++){const v=(row+y+.5)/1.6,f=head?1-ease((v-seam+2)/10):v>=seam-9?1:0;im.data[(row*768+x)*4+3]*=f}}pc.putImageData(im,0,0);return part};
    parts={head:make(0,bottom,true),body:make(top,768-top,false),top};
   }catch(e){/* Keep the unmodified original if reading the image is restricted. */}
   return {base:cv,face,rect,parts};
  }).catch(()=>null);textures.set(key,promise);if(textures.size>(document.documentElement.dataset.device==='mobile'?8:12))textures.delete(textures.keys().next().value)
 }
 return textures.get(key)
 }
 function render(i,a){
 if(!i.tex)return;const ctx=i.ctx,sc=i.cv.width/480,m=M.matrix(i.c,a);ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,i.cv.width,i.cv.height);ctx.setTransform(sc*m[0],sc*m[1],sc*m[2],sc*m[3],sc*m[4],sc*m[5]);ctx.imageSmoothingEnabled=true;ctx.globalAlpha=clamp(a.alpha);
 const parts=i.tex.parts,split=parts&&Math.abs(a.head)>.045&&a.alpha>.99;
 if(split){ctx.drawImage(parts.body,0,parts.top/1.6,480,parts.body.height/1.6);const [nx,ny]=M.cast[i.c].neck;ctx.save();ctx.translate(nx,ny);ctx.rotate(a.head*Math.PI/180);ctx.translate(-nx,-ny);ctx.drawImage(parts.head,0,0,480,parts.head.height/1.6)}
 else ctx.drawImage(i.tex.base,0,0,480,480);
 const face=i.tex.face[a.face<0?1:0];if(face&&Math.abs(a.face)>.01){let [x,y,X,Y]=i.tex.rect;ctx.globalAlpha=clamp(a.alpha*Math.abs(a.face));ctx.drawImage(face,x/1.6,y/1.6,(X-x)/1.6,(Y-y)/1.6)}
 ctx.globalAlpha=clamp(a.alpha);if(i.iconImage){const crown=i.icon==='crown',sz=crown?42:32,x=crown?219:322,y=crown?26:85;ctx.drawImage(i.iconImage,x,y,sz,sz)}if(split)ctx.restore();ctx.globalAlpha=1;ctx.setTransform(1,0,0,1,0,0);
 }
 function mount(el,c,l={}){
 c=data[c]?c:'ruby';const key=c+'|'+assets(c,l).join('|')+'|'+(l.accessory||'original'),old=instances.get(el);
 // Measure at mount only, not once per animation frame. Canvas has a stable resolution.
 if(old?.key===key&&el.contains(old.cv))return old;
 const mobile=document.documentElement.dataset.device==='mobile',size=Math.min(mobile?384:768,Math.max(mobile?144:192,Math.ceil(Math.max(el.clientWidth,el.clientHeight,120)*Math.min(mobile?1.25:1.6,window.devicePixelRatio||1)/32)*32));
 const cv=canvas(size);cv.className='motion-canvas';const i={key,c,cv,ctx:cv.getContext('2d'),last:neutral(),start:0,lastTime:0};
 instances.set(el,i);el.classList.remove('motion-ready');el.classList.add('motion-mounted');const f=applyStatic(el,c,l,'idle',true),fx=document.createElement('div');fx.className='motion-fx';if(f.fx)fx.style.backgroundImage='url('+f.fx+')';else fx.hidden=true;el.replaceChildren(fx,cv);i.icon=f.icon;if(f.icon)image('assets/ui/'+f.icon+'.svg').then(im=>{if(instances.get(el)===i)i.iconImage=im});
 texture(c,l).then(tex=>{if(instances.get(el)!==i||!el.contains(cv)||!tex)return;i.tex=tex;try{render(i,i.last);el.classList.add('motion-ready')}catch{el.classList.remove('motion-ready')}});return i
 }
 function update(el,c,l,action,t,stamp=action,side=1){
 const i=mount(el,c,l);if(i.stamp!==stamp||i.action!==action||t<i.lastTime){i.from={...i.last};i.start=t;i.action=action;i.stamp=stamp;i.renderAt=undefined}
 let a=M.sample(action,t-i.start,side,i.c),f=ease((t-i.start)/(action.startsWith('idle-')||action.startsWith('wardrobe-')?.30:.085));
 a=M.mix(i.from,a,f);i.last=a;i.lastTime=t;
 const mobile=document.documentElement.dataset.device==='mobile',fps=mobile?24:30;
 if(i.renderAt===undefined||t<i.renderAt||t-i.renderAt>=1/fps-.001){i.renderAt=t;if(i.tex)try{render(i,a);el.classList.add('motion-ready')}catch{el.classList.remove('motion-ready')}}
 return a
 }
 // Compatibility with the old geometry audit: now every vertex shares exactly one similarity transform.
 function vertices(c,a){const m=M.matrix(c,a),v=new Float32Array(31*31*2);for(let y=0;y<=30;y++)for(let x=0;x<=30;x++)v.set(M.point(m,x*16,y*16),(y*31+x)*2);return v}
 return {update,mount,assets,appearance,staticLayers,applyStatic,actions:M.actions,durations:M.durations,sample:M.sample,warm:(c,l)=>texture(c,l),vertices,engine:'rigid-sprite-35',backend:()=> 'Canvas2D'};
})();
