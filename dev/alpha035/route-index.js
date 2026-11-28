/* Indexed animation-route lookup. Notes are immutable in time within each match. */
(function(root){"use strict";
let index=new WeakMap();
function lookup(route){
 let d=index.get(route);if(d&&d.length===route.length&&d.first===route[0]&&d.last===route.at(-1))return d;
 const starts=new Float64Array(route.length),ends=new Float64Array(route.length);let sorted=true,max=-Infinity;
 for(let i=0;i<route.length;i++){const n=route[i],t=n.t,end=t+(n.hold||0);if(!Number.isFinite(t)||!Number.isFinite(end)||(i&&t<starts[i-1]))sorted=false;starts[i]=t;max=Math.max(max,end);ends[i]=max}
 d={length:route.length,first:route[0],last:route.at(-1),starts,ends,sorted};index.set(route,d);return d;
}
function lower(arr,x,strict=false){let a=0,b=arr.length;while(a<b){const m=(a+b)>>>1;if(strict?arr[m]<=x:arr[m]<x)a=m+1;else b=m}return a}
function around(route,t){
 const d=lookup(route);
 if(!d.sorted||!Number.isFinite(t))return {next:route.find(n=>n.t+(n.hold||0)>=t-.15),prev:route.reduce((last,n)=>n.t<=t?n:last,null)};
 return {next:route[lower(d.ends,t-.15)],prev:route[lower(d.starts,t,true)-1]??null};
}
function near(route,t){
 const d=lookup(route);
 if(!d.sorted||!Number.isFinite(t))return route.some(n=>n.t-t<=1&&n.t+(n.hold||0)>=t-.7);
 const n=route[lower(d.ends,t-.7)];return !!n&&n.t-t<=1;
}
const api={around,near,clear:()=>{index=new WeakMap()}};
if(typeof module!=="undefined")module.exports=api;else root.RPBRouteIndex=api;
})(typeof window!=="undefined"?window:globalThis);
