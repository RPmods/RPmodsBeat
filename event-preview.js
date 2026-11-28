/* Preview only: no song registration, autoplay, gameplay or Firebase integration. */
(()=>{'use strict';
 const $=id=>document.getElementById(id), open=$('event01Open'), dialog=$('event01Dialog'), close=$('event01Close'), audio=$('event01Audio'), status=$('event01Status');
 if(!open||!dialog||!close||!audio||!status)return;
 const asset='assets/audio/event01-preview.mp3';
 const normal='Audio de prueba · 1:48 · No jugable todavía.';
 open.addEventListener('click',()=>{
  if(dialog.open)return;
  dialog.showModal();
  window.CBLobby?.stop(false);
  status.textContent=normal;
  audio.volume=Math.max(0,Math.min(1,Number($('lobbyVolume')?.value??50)/100));
  audio.src=asset;
 });
 close.addEventListener('click',()=>dialog.close());
 audio.addEventListener('error',()=>{if(dialog.open)status.textContent='El audio del adelanto aún no está disponible. Próximamente.';});
 audio.addEventListener('ended',()=>{if(dialog.open)status.textContent='Fin del adelanto · Evento en preparación.';});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&dialog.open)audio.pause();});
 dialog.addEventListener('close',()=>{
  audio.pause();audio.removeAttribute('src');audio.load();
  if($('home')?.classList.contains('active')&&!$('shell')?.classList.contains('hidden')&&$('game')?.classList.contains('hidden'))window.CBLobby?.play();
 });
})();
