(() => {
  'use strict';

  function openCard(id){
    if(!id) return;
    const target = '#card/' + id;
    if(location.hash === target){
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      location.hash = target;
    }
  }

  function upgradeFundamentalLinks(){
    document.querySelectorAll('.v10-fundamental[data-open-card]').forEach(card => {
      const id = card.dataset.openCard;
      if(!id) return;

      const hint = card.querySelector('.v10-card-copy > small');
      if(hint && !card.querySelector('[data-card-link]')){
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'primary v13-card-link';
        btn.dataset.cardLink = id;
        btn.textContent = 'Abrir ficha completa';
        hint.replaceWith(btn);
      }

      card.setAttribute('role','link');
      card.setAttribute('tabindex','0');
      card.style.cursor = 'pointer';
    });
  }

  document.addEventListener('click', e => {
    const explicit = e.target.closest('[data-card-link]');
    if(explicit){
      e.preventDefault();
      e.stopPropagation();
      openCard(explicit.dataset.cardLink);
      return;
    }

    const card = e.target.closest('.v10-fundamental[data-open-card]');
    if(card){
      e.preventDefault();
      e.stopPropagation();
      openCard(card.dataset.openCard);
    }
  }, true);

  document.addEventListener('keydown', e => {
    if(e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.v10-fundamental[data-open-card]');
    if(card){
      e.preventDefault();
      openCard(card.dataset.openCard);
    }
  }, true);

  const obs = new MutationObserver(() => requestAnimationFrame(upgradeFundamentalLinks));
  window.addEventListener('DOMContentLoaded', () => {
    upgradeFundamentalLinks();
    const root = document.querySelector('#app');
    if(root) obs.observe(root,{childList:true,subtree:true});
  });
  setTimeout(() => {
    upgradeFundamentalLinks();
    const root = document.querySelector('#app');
    if(root) obs.observe(root,{childList:true,subtree:true});
  }, 50);
})();
