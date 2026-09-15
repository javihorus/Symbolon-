(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search || '');
  const raw = params.get('open');
  const id = raw && /^c\d{2}$/i.test(raw) ? raw.toLowerCase() : null;
  if(!id) return;

  const target = '#card/' + id;
  window.__SYMBOLON_OPEN_CARD__ = id;

  // Set the route before app-v8 performs its first render.
  if(window.location.hash !== target){
    window.location.hash = target;
  }

  function ensureCardRoute(){
    const root = document.querySelector('#app');
    if(root && root.querySelector('.card-detail')){
      // Once the requested card is visibly rendered, remove ?open= so later
      // navigation/refreshes behave normally while preserving ?v=...
      const clean = new URLSearchParams(window.location.search || '');
      clean.delete('open');
      const qs = clean.toString();
      history.replaceState(null,'',window.location.pathname+(qs?'?'+qs:'')+target);
      return true;
    }
    if(window.location.hash !== target) window.location.hash = target;
    window.dispatchEvent(new Event('hashchange'));
    return false;
  }

  let tries=0;
  function retry(){
    tries++;
    if(ensureCardRoute() || tries>=12) return;
    setTimeout(retry,120);
  }

  window.addEventListener('DOMContentLoaded',()=>setTimeout(retry,0),{once:true});
  setTimeout(retry,120);
})();
