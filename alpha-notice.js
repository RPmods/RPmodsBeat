/* Startup information only. No changes to START, device selection, or loading. */
(()=>{'use strict';
 const notice=document.getElementById('alphaNotice'), button=document.getElementById('alphaNoticeContinue'), boot=document.getElementById('boot');
 const content=boot?.querySelector('.boot-content');
 if(!notice||!button||!content)return;
 const previous=content.inert;
 let closed=false,autoTimer=0,finishTimer=0;
 const finish=()=>{clearTimeout(finishTimer);notice.hidden=true;content.inert=previous;};
 const dismiss=()=>{if(closed)return;closed=true;clearTimeout(autoTimer);const restoreFocus=notice.contains(document.activeElement);notice.classList.add('is-leaving');if(restoreFocus)button.blur();finishTimer=setTimeout(()=>{finish();if(restoreFocus){const chooser=document.getElementById('deviceChooser'),target=chooser&&!chooser.hidden?chooser.querySelector('button'):document.getElementById('bootStart');if(target&&!target.hidden&&!target.disabled)target.focus({preventScroll:true});}},600);};
 button.addEventListener('click',dismiss);
 notice.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dismiss();}});
 content.inert=true;
 notice.classList.add('is-managed');
 const start=()=>{autoTimer=setTimeout(dismiss,6000)};
 if(notice.dataset.introPending)document.addEventListener('rpb-intro-finished',start,{once:true});else start();
})();
