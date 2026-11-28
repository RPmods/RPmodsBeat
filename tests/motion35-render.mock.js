const assert=require('assert'),fs=require('fs'),path=require('path'),M=require('../assets/rig/motion35.js');
const rig=JSON.parse(fs.readFileSync(path.join(__dirname,'../rig-data.js'),'utf8').replace(/^window.CBRigData=/,'').trim().replace(/;$/,''));
const source=fs.readFileSync(path.join(__dirname,'../motion.js'),'utf8');
const listeners={},window={CBMotion35:M,CBRigData:rig,devicePixelRatio:1,addEventListener:(k,f)=>listeners[k]=f};
let reads=0,draws=0;
function element(tag){
 const set=new Set(),o={tag,dataset:{},style:{setProperty(){},removeProperty(){}},classList:{add(...x){x.forEach(k=>set.add(k))},remove(...x){x.forEach(k=>set.delete(k))},contains:k=>set.has(k)},children:[],replaceChildren(...kids){this.children=kids},contains(e){return this.children.includes(e)},get clientWidth(){reads++;return this._size||200},get clientHeight(){reads++;return this._size||200}};
 if(tag==='canvas'){const ctx={drawImage(){draws++},getImageData(x,y,w,h){return {data:new Uint8ClampedArray(w*h*4).fill(220)}},putImageData(){},setTransform(){},clearRect(){},save(){},restore(){},translate(){},rotate(){}};o.getContext=()=>ctx}
 return o
}
const document={documentElement:{dataset:{device:'pc'}},createElement:element};class Image{set src(s){this.url=s;this.complete=true;this.naturalWidth=768;this.onload?.()}}
new Function('window','document','Image',source)(window,document,Image);
const E=window.CherryMotion;
(async()=>{
 const cast=Object.keys(M.cast);for(const char of cast){
  const look={hair:'plum',cloth:'mint',eyes:'aqua',accessory:'crown'},art=element('div');await E.warm(char,look);
  const a=E.mount(art,char,look);await Promise.resolve();assert(a.tex&&a.tex.parts&&a.tex.face.every(Boolean));assert(art.classList.contains('motion-ready'));assert.equal(a.cv.width,224);
  const r=reads;for(let j=0;j<80;j++){const before=draws;E.update(art,char,look,'idle-breathe',j/30,'loop');assert(draws-before<=4)}assert.equal(reads,r);
  art._size=450;listeners.resize();E.update(art,char,look,'up',4,'jump');assert(a.cv.width>=450);assert(reads>r);
  document.documentElement.dataset.device='mobile';const b=E.mount(art,char,look);assert(b!==a&&b.cv.width<=384);await Promise.resolve();assert(b.tex&&art.classList.contains('motion-ready'));document.documentElement.dataset.device='pc';
 }
 assert.equal(E.backend(),'Canvas2D');assert.equal(E.actions.length,M.actions.length);
 console.log('Five character compositions, cosmetic layers, expression/part generation, mount, 400 frames, resize and mobile resolution PASS (mock canvas)');
})().catch(e=>{console.error(e);process.exitCode=1});
