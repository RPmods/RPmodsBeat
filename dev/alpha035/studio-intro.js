(()=>{'use strict';
 const intro=document.getElementById('rpbStudioIntro'),notice=document.getElementById('alphaNotice'),skip=document.getElementById('rpbIntroSkip');
 if(!intro||!notice||!skip)return;
 let closed=false,timer=0;const previous=notice.inert;
 function finish(){if(closed)return;closed=true;clearTimeout(timer);intro.hidden=true;notice.inert=previous;delete notice.dataset.introPending;document.dispatchEvent(new Event('rpb-intro-finished'));if(document.activeElement===skip)document.getElementById('alphaNoticeContinue')?.focus({preventScroll:true});}
 notice.dataset.introPending='1';notice.inert=true;intro.hidden=false;
 skip.addEventListener('click',finish);intro.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finish()}});
 timer=setTimeout(finish,7000);
})();