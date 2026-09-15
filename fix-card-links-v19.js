(() => {
  'use strict';
  function hrefFor(id){ return `ficha.html?id=${encodeURIComponent(id)}&v=19`; }
  function upgrade(){
    document.querySelectorAll('.v10-fundamental[data-open-card]').forEach(card=>{
      const id=card.dataset.openCard;if(!id)return;
      card.onclick=null;card.style.cursor='default';card.removeAttribute('role');card.removeAttribute('tabindex');
      let link=card.querySelector('.v19-card-link');
      if(!link){
        const old=card.querySelector('[data-card-link], .v15-card-link, .v13-card-link, .v10-card-copy > small');
        link=document.createElement('a');
        link.className='primary v13-card-link v15-card-link v19-card-link';
        link.textContent='Abrir ficha completa';
        if(old)old.replaceWith(link);else card.querySelector('.v10-card-copy')?.appendChild(link);
      }
      link.href=hrefFor(id);
      link.onclick=e=>e.stopPropagation();
    });
  }
  const obs=new MutationObserver(()=>requestAnimationFrame(upgrade));
  window.addEventListener('DOMContentLoaded',()=>{upgrade();const root=document.querySelector('#app');if(root)obs.observe(root,{childList:true,subtree:true});});
  window.addEventListener('hashchange',()=>setTimeout(upgrade,0));
  setTimeout(()=>{upgrade();const root=document.querySelector('#app');if(root)obs.observe(root,{childList:true,subtree:true});},50);
})();
