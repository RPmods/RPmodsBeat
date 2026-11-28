const assert=require('assert'),fs=require('fs'),path=require('path'),A=require('../assets/characters36/art.js'),P=require('../assets/characters36/poses.js');
const source=fs.readFileSync(path.join(__dirname,'../motion.js'),'utf8');
const win={CBArt36:A,CBPoses36:P},document={documentElement:{dataset:{device:'pc'}},createElement:tag=>{
 assert.equal(tag,'template');let svg;return {set innerHTML(s){const parts=[...s.matchAll(/<g data-part="([^"]+)"/g)].map(m=>({dataset:{part:m[1]},attrs:{},setAttribute(k,v){this.attrs[k]=v}}));svg={classList:{add(){}},setAttribute(){},querySelectorAll:()=>parts}},get content(){return {firstElementChild:svg}}}
}};
new Function('window','document',source)(win,document);const E=win.CherryMotion;
function inspect(svg){const ids=[...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]),refs=[...svg.matchAll(/url\(#([^\)]+)\)/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);assert(refs.every(r=>ids.includes(r)));assert(!/NaN|undefined|url\(#[^)]*\s/.test(svg));assert(!/\.png|assets\/rig\//.test(svg));assert.equal((svg.match(/<g(?:\s|>)/g)||[]).length,(svg.match(/<\/g>/g)||[]).length);return [...svg.matchAll(/<path d="([^"]+)"/g)].map(x=>x[1]).join('|')}
const accessories=['crown','moon','heart','notes','bow','aura','fx-legend-nebula','fx-legend-rose','fx-legend-midnight','fx-epic-ocean','fx-epic-dream','fx-exotic-galaxy','fx-zomby-starmap','fx-zomby-void','fx-zomby-astral','fx-zomby-night','fx-zomby-nexus'];
let variants=0,motions=0;
for(const c of Object.keys(A.cast)){
 const original=A.art(c,{}),geo=inspect(original),base=A.materials(c,{});
 for(const [slot,colors,field] of [['hair',A.hair,'hair'],['cloth',A.cloth,'cloth'],['eyes',A.eyes,'eye']])for(const color of Object.keys(colors)){
  const look={[slot]:color},m=A.materials(c,look),allowed=!color.startsWith('zomby-')||c==='zomby';
  for(const k of ['hair','cloth','eye','skin','dark','accent'])if(k!==field||!allowed)assert.deepStrictEqual(m[k],base[k]);
  assert.equal(inspect(A.art(c,look)),geo,'recolor changed geometry '+c+' '+slot+' '+color);variants++;
 }
 for(const a of accessories){const look={accessory:a};inspect(A.art(c,look));if(a.includes('zomby-')&&c!=='zomby')assert.equal(A.appearance(c,look).outfit,'original');variants++}
 const nasty=decodeURIComponent(E.picture(c,{hair:'constructor',eyes:'__proto__',cloth:'toString',accessory:'fx-unknown'}).split(',')[1]);inspect(nasty);assert.equal(inspect(nasty),geo);
 const parts=[...original.matchAll(/data-part="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(parts).size,parts.length);for(const k of Object.keys(P.transforms(P.neutral())))if(k!=='accessory')assert(parts.includes(k),k);
 const el={dataset:{},style:{removeProperty(){},setProperty(){}},classList:{add(){}},contains(s){return this.svg===s},replaceChildren(s){this.svg=s;this.mounts=(this.mounts||0)+1}};
 let first=E.mount(el,c,{hair:'plum',cloth:'mint',eyes:'aqua',accessory:'bow'});
 for(let j=0;j<180;j++){E.update(el,c,{hair:'plum',cloth:'mint',eyes:'aqua',accessory:'bow'},'idle-breathe',j/30,'idle');assert.equal(el.svg,first.svg)}
 assert.equal(el.mounts,1);assert(first.parts.get('actor').attrs.opacity==='1');const second=E.mount(el,c,{hair:'ocean'});assert(second!==first);assert.equal(el.mounts,2);
 for(const action of P.actions)for(const side of [-1,1])for(let frame=0;frame<=40;frame++){
  let p=P.sample(action,P.durations[action]*frame/40,side,c);assert(Object.values(p).every(Number.isFinite));assert(p.alpha>=0&&p.alpha<=1);
  for(const [k,t] of Object.entries(P.transforms(p)))assert(!/NaN|Infinity|scale|skew/.test(t),k);
  const v=P.visibility(p);assert.equal(Number(v['eyes-open'])+Number(v['eyes-closed']),1);assert.equal(Number(v['mouth-neutral'])+Number(v['mouth-happy'])+Number(v['mouth-sad']),1);
  for(const s of ['left','right']){const l=s==='left',hx=200+(l?-15:15)+p.hipX,hy=280+p.hipY,fx=200+(l?p.lFoot:p.rFoot),fy=341-(l?p.lLift:p.rLift),q=P.legSolve(hx,hy,fx,fy,s),rad=d=>d*Math.PI/180;
   const dx=-34*Math.sin(rad(q.upper))-29*Math.sin(rad(q.absolute)),dy=34*Math.cos(rad(q.upper))+29*Math.cos(rad(q.absolute));assert(Math.hypot(dx,dy)<=63.0001);if(Math.hypot(fx-hx,fy-hy)<=62.9)assert(Math.hypot(hx+dx-fx,hy+dy-fy)<1e-6);
  }motions++
 }
}
console.log(variants+' cosmetic variants, original geometry/material isolation, valid SVG IDs/references; '+motions+' key pose samples, joint solve, 900 live updates on mocked DOM PASS');
