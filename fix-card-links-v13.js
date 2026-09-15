(() => {
  'use strict';

  function hrefFor(id){
    const path = location.pathname || '/';
    return `${path}?v=16&open=${encodeURIComponent(id)}#card/${encodeURIComponent(id)}`;
  }

  function upgradeFundamentalLinks(){
    document.querySelectorAll('.v10-fundamental[data-open-card]').forEach(card => {
      const id = card.dataset.openCard;
      if(!id) return;

      card.onclick = null;
      card.style.cursor = 'default';
      card.removeAttribute('role');
      card.removeAttribute('tabindex');

      let link = card.querySelector('.v15-card-link');
      if(!link){
        const old = card.querySelector('[data-card-link], .v13-card-link, .v10-card-copy > small');
        link = document.createElement('a');
        link.className = 'primary v13-card-link v15-card-link';
        link.textContent = 'Abrir ficha completa';
        link.setAttribute('aria-label', `Abrir ficha completa de ${card.querySelector('h2')?.textContent || 'esta carta'}`);
        if(old) old.replaceWith(link);
        else card.querySelector('.v10-card-copy')?.appendChild(link);
      }
      link.href = hrefFor(id);
      link.dataset.nativeCardLink = id;
      link.onclick = e => e.stopPropagation();
    });
  }

  const obs = new MutationObserver(() => requestAnimationFrame(upgradeFundamentalLinks));
  window.addEventListener('DOMContentLoaded', () => {
    upgradeFundamentalLinks();
    const root = document.querySelector('#app');
    if(root) obs.observe(root,{childList:true,subtree:true});
  });
  window.addEventListener('hashchange',()=>setTimeout(upgradeFundamentalLinks,0));
  setTimeout(() => {
    upgradeFundamentalLinks();
    const root = document.querySelector('#app');
    if(root) obs.observe(root,{childList:true,subtree:true});
  }, 50);
})();
