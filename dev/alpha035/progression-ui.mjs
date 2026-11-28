import {record,claim,view} from "./progression.mjs";
const $=id=>document.getElementById(id);
let period="day";
const labels={day:"Diarias · reinicio 00:00 UTC",week:"Semanales · lunes 00:00 UTC",season:"Temporada 0 — Los Inicios · indefinida",once:"Principiante · objetivos únicos"};
const reward=r=>[r.coins?r.coins+" BC":"",r.crystals?r.crystals+" BCR":"",r.cosmetic?r.cosmetic+" (desbloqueo reservado)":""].filter(Boolean).join(" + ");
const element=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
function act(action){if(!window.CBGame?.devProgressClaim)return;const done=CBGame.devProgressClaim(action);$("rpbMissionStatus").textContent=done?"Recompensa guardada en tu perfil local.":"No hay recompensa disponible.";render()}
function card(title,detail,buttonText,disabled,onClick,progress){const row=element("article",undefined,"rpb-mission-card"),copy=element("div");copy.append(element("strong",title),element("small",detail));if(progress){const bar=element("progress");bar.max=progress.max;bar.value=progress.value;bar.setAttribute("aria-label",title);copy.append(bar)}const btn=element("button",buttonText,"secondary");btn.type="button";btn.disabled=disabled;btn.onclick=onClick;row.append(copy,btn);return row}
function render(){
 const allowed=window.RPB_DEV_MODE&&!window.CBOnline?.active&&window.CBGame?.canSwitch();
 const open=$("rpbMissionsOpen"),profileOpen=$("rpbMissionsProfile");if(open)open.disabled=!allowed;if(profileOpen)profileOpen.disabled=!allowed;
 if(!$("rpbMissionsDialog")?.open)return;
 const state=CBGame.profile(),s=view(state,period,Date.now()),list=$("rpbMissionList"),season=$("rpbSeasonTrack");
 $("rpbMissionHeading").textContent=labels[period];$("rpbMissionSummary").textContent="Nivel "+s.level+" · Temporada "+s.seasonLevel+"/50 · "+s.coins+" BC · "+s.crystals+" BCR";
 document.querySelectorAll("[data-rpb-period]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.rpbPeriod===period)));
 list.replaceChildren();season.replaceChildren();season.hidden=period!=="season";
 for(const m of s.missions)list.append(card(m.label,m.progress+"/"+m.target+" · "+reward(m),m.claimed?"Reclamado":"Reclamar",!allowed||m.claimed||m.progress<m.target,()=>act({type:"mission",id:m.id}),{max:m.target,value:m.progress}));
 if(s.bonus)list.append(card("Bonus de "+(period==="day"?"día":"semana"),s.bonus.crystals+" BCR",s.bonus.claimed?"Reclamado":"Reclamar",!allowed||!s.bonus.claimable,()=>act({type:"bonus",period})));
 for(const m of s.season)season.append(card("Nivel "+m.level,reward(m.reward),m.claimed?"Reclamado":"Reclamar",!allowed||!m.claimable,()=>act({type:"season",level:m.level})));
 $("rpbClaimAll").disabled=!allowed||!(s.missions.some(m=>!m.claimed&&m.progress>=m.target)||s.bonus?.claimable||s.season.some(m=>m.claimable));
}
function open(){if(!window.RPB_DEV_MODE||window.CBOnline?.active||!window.CBGame?.canSwitch())return;const d=$("rpbMissionsDialog");if(!d.open)d.showModal();$("rpbMissionStatus").textContent="Progreso experimental local. Los cosméticos de temporada quedan reservados hasta que exista su arte.";render()}
function init(){for(const id of ["rpbMissionsOpen","rpbMissionsProfile"]){$(id).disabled=false;$(id).onclick=open} $("rpbMissionClose").onclick=()=>$("rpbMissionsDialog").close();$("rpbClaimAll").onclick=()=>act({type:"all",period});document.querySelectorAll("[data-rpb-period]").forEach(b=>b.onclick=()=>{period=b.dataset.rpbPeriod;render()});window.addEventListener("rpb-profile-updated",render);window.addEventListener("focus",render);setInterval(()=>{if($("rpbMissionsDialog").open)render()},60000);render()}
export const api={record,claim,view};if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
