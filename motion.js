/* Cherry Beat 0.36 — articulated vector sprites, generated from clean drawing layers.
   No previous PNG, recolour overlay, mesh, WebGL or global image warping. */
'use strict';
window.CherryMotion=(()=>{
 const A=window.CBArt36,P=window.CBPoses36,instances=new WeakMap(),staticCache=new Map();let serial=0;
 const normalize=(c,l={})=>{c=Object.hasOwn(A.cast,c)?c:'ruby';return {c,l:{hair:Object.hasOwn(A.hair,l.hair)?l.hair:'original',cloth:Object.hasOwn(A.cloth,l.cloth)&&(!l.cloth.startsWith('zomby-')||c==='zomby')?l.cloth:'original',eyes:Object.hasOwn(A.eyes,l.eyes)?l.eyes:'original',accessory:A.appearance(c,l).outfit!=='original'?'fx-'+A.appearance(c,l).outfit:A.appearance(c,l).icon||'original'}}};
 const key=(c,l)=>c+'|'+l.hair+'|'+l.cloth+'|'+l.eyes+'|'+l.accessory;
 function poseMarkup(svg,a){
  const transforms=P.transforms(a),visible=P.visibility(a);
  return svg.replace(/<g data-part="([^"]+)"(?: transform="[^"]*")?(?: display="none")?>/g,(_,id)=>{
   const t=transforms[id],v=visible[id];return '<g data-part="'+id+'"'+(t?' transform="'+t+'"':'')+(v===false?' display="none"':'')+(id==='actor'?' opacity="'+P.clamp(a.alpha)+'"':'')+'>'
  })
 }
 function picture(c,l,pose='idle',includeFx=true){
  const n=normalize(c,l);let id=key(n.c,n.l)+'|'+pose+'|'+includeFx;
  if(staticCache.has(id))return staticCache.get(id);
  let a=pose==='idle'?P.neutral():P.sample(pose,(P.durations[pose]||1)*(pose==='entry'?1:.38),1,n.c);
  // Static thumbnails are never transparent or displaced.
  a={...a,alpha:1,x:0,y:0};
  const svg=poseMarkup(A.art(n.c,n.l,'preview',includeFx),a),url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  staticCache.set(id,url);if(staticCache.size>96)staticCache.delete(staticCache.keys().next().value);return url
 }
 function appearance(c,l){return A.appearance(c,l)}
 function staticLayers(c,l={},pose='idle',includeFx=true){const a=appearance(c,l);return {imgs:[picture(c,l,pose,includeFx)],sizes:['contain'],positions:['center'],...a}}
 function applyStatic(el,c,l={},pose='idle',includeFx=true){
  const a=staticLayers(c,l,pose,includeFx);el.dataset.outfit=a.outfit;
  el.style.removeProperty('--orbit-image');el.style.setProperty('--equipped-size','contain');el.style.setProperty('--equipped-position','center');el.style.backgroundImage='url("'+a.imgs[0]+'")';el.style.backgroundSize='contain';el.style.backgroundPosition='center';el.style.backgroundRepeat='no-repeat';return a
 }
 function draw(i,a){
  const t=P.transforms(a),v=P.visibility(a);
  for(const [id,transform] of Object.entries(t)){const e=i.parts.get(id);if(e&&i.prev[id]!==transform){i.prev[id]=transform;e.setAttribute('transform',transform)}}
  for(const [id,show] of Object.entries(v)){const e=i.parts.get(id);if(e&&i.prev[id]!==show){i.prev[id]=show;e.setAttribute('display',show?'inline':'none')}}
  const opacity=String(Math.round(P.clamp(a.alpha)*1000)/1000);if(i.prev.alpha!==opacity){i.prev.alpha=opacity;i.parts.get('actor').setAttribute('opacity',opacity)}
 }
 function mount(el,c,l={}){
  const n=normalize(c,l),k=key(n.c,n.l),old=instances.get(el);if(old?.key===k&&el.contains(old.svg))return old;
  const t=document.createElement('template');t.innerHTML=poseMarkup(A.art(n.c,n.l,'cb36-'+(++serial)+'-',true),P.neutral());
  const svg=t.content.firstElementChild;svg.classList.add('motion-canvas','character-vector');svg.setAttribute('focusable','false');const parts=new Map([...svg.querySelectorAll('[data-part]')].map(e=>[e.dataset.part,e]));
  const i={key:k,c:n.c,svg,parts,prev:{},last:P.neutral(),lastTime:0,start:0};instances.set(el,i);
  el.dataset.outfit=A.appearance(n.c,n.l).outfit;el.style.removeProperty('--orbit-image');el.classList.add('motion-mounted','motion-ready','painted');el.replaceChildren(svg);draw(i,i.last);return i
 }
 function update(el,c,l,action,t,stamp=action,side=1){
  const i=mount(el,c,l);
  if(i.stamp!==stamp||i.action!==action||t<i.lastTime){i.from={...i.last};i.start=t;i.action=action;i.stamp=stamp;i.renderAt=undefined}
  const idle=action.startsWith('idle-'),elapsed=t-i.start,blend=P.ease(elapsed/(idle?.22:.075));
  let a=P.sample(action,elapsed,side,i.c);a=P.mix(i.from,a,blend);i.last=a;i.lastTime=t;
  const fps=document.documentElement.dataset.device==='mobile'?20:30;
  if(i.renderAt===undefined||t<i.renderAt||t-i.renderAt>=1/fps-.001){i.renderAt=t;draw(i,a)}return a
 }
 // The legacy preloader no longer downloads hundreds of overlapping PNG layers.
 const assets=(c,l={})=>[picture(c,l)];const warm=(c,l)=>Promise.resolve(picture(c,l));
 return {update,mount,assets,appearance,staticLayers,applyStatic,actions:P.actions,durations:P.durations,sample:P.sample,warm,engine:'vector-cutout-36',backend:()=> 'SVG layers',picture,poseMarkup};
})();
