/* Opt-in diagnostics, ?rpb-perf=1. Does not drive the musical clock. */
(()=>{"use strict";
if(new URLSearchParams(location.search).get("rpb-perf")!=="1")return;
const frame=[],draw=[];let previous=null,lastReport=0,panel;
const push=(arr,n)=>{if(!Number.isFinite(n)||n<0)return;arr.push(n);if(arr.length>180)arr.shift()};
const percentile=(arr,p)=>{if(!arr.length)return 0;const sorted=[...arr].sort((a,b)=>a-b);return sorted[Math.min(sorted.length-1,Math.ceil(sorted.length*p)-1)]};
const mean=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;
function snapshot(){const avg=mean(frame);return {samples:frame.length,fps:avg?Math.round(1000/avg):0,frameP95:percentile(frame,.95),drawP95:percentile(draw,.95),backend:window.CherryMotion?.backend?.()||"unknown",width:innerWidth,height:innerHeight}}
function start(){const now=performance.now();if(previous!==null){const gap=now-previous;if(gap>1000||document.hidden){frame.length=0;draw.length=0}else push(frame,gap)}previous=now;return now}
function end(now){push(draw,performance.now()-now);if(now-lastReport<1000)return;lastReport=now;const s=snapshot();if(!panel){panel=document.createElement("output");panel.id="rpbPerfOverlay";panel.setAttribute("aria-label","Diagnóstico gráfico");panel.style.cssText="position:fixed;right:8px;top:8px;padding:8px 10px;background:#111827e8;color:#fff;font:11px/1.5 monospace;z-index:1450;border:1px solid #68728c;border-radius:7px;pointer-events:none;white-space:pre";document.body.append(panel)}
panel.hidden=false;panel.textContent="RPB PERF · "+s.backend+"\n"+s.fps+" FPS · p95 "+s.frameP95.toFixed(1)+" ms\nCPU draw p95 "+s.drawP95.toFixed(1)+" ms\n"+s.width+" × "+s.height;}
function reset(){previous=null;lastReport=0;frame.length=0;draw.length=0;if(panel)panel.hidden=true}
document.addEventListener("visibilitychange",reset);window.RPBPerf={start,end,reset,snapshot};
})();