/* Opt-in PixiJS note layer. The existing game remains the timing/input authority. */
(function(root){"use strict";
const dirs=["left","down","up","right"],glyph={left:"←",down:"↓",up:"↑",right:"→"},colors={left:"#e96ab0",down:"#79d1c4",up:"#87a9ef",right:"#f08793"};
function project(n,t,hit,speed,vertical,width,height,size,held,order=dirs){
 const x=held?hit:hit+(n.t-t)*speed,end=hit+(n.t+(n.hold||0)-t)*speed;
 return vertical?{x:(order.indexOf(n.d)+.5)*width/4,y:2*hit-x,tailX:(order.indexOf(n.d)+.5)*width/4,tailY:2*hit-end,tailW:size*.45,tailH:Math.max(0,end-x)}:{x,y:height/2,tailX:x,tailY:height/2,tailW:Math.max(0,end-x),tailH:size*.28};
}
let app=null,loading=null,layer=null,cache=new Map(),active=new Map(),free=[],failed=false,lastW=0,lastH=0;
function enabled(){return new URLSearchParams(location.search).get("rpb-pixi")==="1"}
function script(){if(root.PIXI)return Promise.resolve(root.PIXI);return new Promise((resolve,reject)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/pixi.js@8.19.0/dist/pixi.min.js";const timer=setTimeout(()=>{s.remove();reject(Error("PixiJS timeout"))},8000);s.onload=()=>{clearTimeout(timer);root.PIXI?resolve(root.PIXI):reject(Error("PixiJS missing"))};s.onerror=()=>{clearTimeout(timer);s.remove();reject(Error("PixiJS unavailable"))};document.head.append(s)})}
function fallback(e){failed=true;layer?.classList.remove("rpb-pixi-active");if(app?.canvas)app.canvas.hidden=true;console.warn("RPB Pixi fallback",e?.message||e);return false}
function warm(target){
 if(!enabled()||failed)return Promise.resolve(false);if(app)return Promise.resolve(true);if(loading)return loading;
 layer=target;loading=(async()=>{try{const P=await script();const instance=new P.Application();await instance.init({width:1,height:1,backgroundAlpha:0,preference:"webgl",antialias:false,resolution:Math.min(root.devicePixelRatio||1,1.5),autoDensity:true,autoStart:false,sharedTicker:false});app=instance;app.stop();app.canvas.className="rpb-note-canvas";app.canvas.hidden=true;app.canvas.setAttribute("aria-hidden","true");app.canvas.addEventListener("webglcontextlost",e=>{e.preventDefault();fallback(Error("WebGL context lost"))});target.append(app.canvas);return true}catch(e){return fallback(e)}})();return loading;
}
function texture(dir,label,hold,sync,held){
 const key=[dir,label,hold,sync,held].join("|");if(cache.has(key))return cache.get(key);
 const cv=document.createElement("canvas");cv.width=cv.height=128;const c=cv.getContext("2d"),grad=c.createLinearGradient(0,0,128,128);grad.addColorStop(0,colors[dir]);grad.addColorStop(1,"#29324f");c.fillStyle=grad;c.strokeStyle=held?"#fff6c1":hold?"#ffdd96":sync?"#f4c9ff":"#ffffffa8";c.lineWidth=hold||held?5:3;c.beginPath();c.roundRect(3,3,122,122,18);c.fill();c.stroke();c.textAlign="center";c.textBaseline="middle";c.fillStyle="#fff";c.font="bold "+(label?"62":"76")+"px sans-serif";c.fillText(glyph[dir],64,label?52:64);if(label){c.font="bold 22px sans-serif";c.fillText(String(label).slice(0,8),64,100,112)}const tex=root.PIXI.Texture.from(cv);cache.set(key,tex);return tex;
}
function acquire(id){let entry=active.get(id);if(entry)return entry;entry=free.pop();if(!entry){const P=root.PIXI,tail=new P.Sprite(P.Texture.WHITE),note=new P.Sprite(P.Texture.EMPTY);tail.anchor.set(0,.5);note.anchor.set(.5);app.stage.addChild(tail,note);entry={tail,note}}entry.note.visible=true;active.set(id,entry);return entry}
function release(id,entry){entry.note.visible=entry.tail.visible=false;active.delete(id);free.push(entry)}
function reset(){for(const [id,entry] of active)release(id,entry);layer?.classList.remove("rpb-pixi-active");if(app?.canvas)app.canvas.hidden=true}
function draw(notes,from,to,t,hit,speed,vertical,size,hold,order,keyLabel){
 if(!app||failed||!layer||!enabled())return false;
 try{if(!app.canvas.isConnected)layer.append(app.canvas);const width=layer.clientWidth,height=layer.clientHeight;if(!width||!height)return false;
 if(width!==lastW||height!==lastH){app.renderer.resize(width,height);lastW=width;lastH=height}
 const visible=new Set();
 for(let i=from;i<to;i++){const n=notes[i];if(!n||n.done||!n.el)continue;visible.add(n.id);const entry=acquire(n.id),held=hold?.n===n,p=project(n,t,hit,speed,vertical,width,height,size,held,order);entry.note.texture=texture(n.d,keyLabel(n.d),!!n.hold,n.teamWidth>1,held);entry.note.position.set(p.x,p.y);entry.note.width=entry.note.height=size;entry.tail.visible=!!n.hold&&p.tailH>=0&&p.tailW>0;entry.tail.tint=held?0xffe7a6:0xd5b4de;entry.tail.alpha=.88;entry.tail.anchor.set(vertical?.5:0,vertical?0:.5);entry.tail.position.set(p.tailX,p.tailY);entry.tail.width=p.tailW;entry.tail.height=p.tailH;
 }
 for(const [id,entry] of active)if(!visible.has(id))release(id,entry);
 app.canvas.hidden=false;app.render();layer.classList.add("rpb-pixi-active");return true
 }catch(e){return fallback(e)}
}
const api={project,warm,draw,reset,status:()=>failed?"fallback":app?"pixi-webgl":loading?"loading":"dom"};
if(typeof module!=="undefined")module.exports=api;else root.RPBPixiNotes=api;
})(typeof window!=="undefined"?window:globalThis);
