(() => {
  'use strict';
  const CARDS = window.SYMBOLON_CARDS || [];
  const COURSE = window.SYMBOLON_COURSE || {modules:[]};
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const app = () => document.querySelector('#app');
  const route = () => (location.hash || '#home').slice(1);

  function ensureNav(){
    const nav=document.querySelector('.main-nav');
    if(!nav) return;
    const course=nav.querySelector('[data-route="course"] span');
    if(course) course.textContent='Ruta de estudio';
    if(!nav.querySelector('[data-v10-fundamentals]')){
      const btn=document.createElement('button');
      btn.setAttribute('data-v10-fundamentals','1');
      btn.innerHTML='◉ <span>Las 12 fundamentales</span>';
      btn.onclick=()=>location.hash='#fundamentals';
      const courseBtn=nav.querySelector('[data-route="course"]');
      courseBtn?.after(btn);
    }
  }

  function coursePage(){
    const modules=COURSE.modules||[];
    return `<div class="content v10-study">
      <div class="page-kicker">RUTA DE ESTUDIO</div>
      <h1 class="page-title">Así se aprende<br>Symbolon.</h1>
      <p class="page-lede">No tienes que memorizar 78 definiciones ni completar 13 módulos antes de tocar las cartas. El sistema se aprende en cuatro fases.</p>
      <div class="v10-path">
        <article class="v10-phase featured"><span>FASE 1 · EMPIEZA AQUÍ</span><h2>Las 12 cartas fundamentales</h2><p>Son las 12 personas internas. Aprende qué quiere cada una, qué teme, cómo se expresa en sombra y cuál es su recurso consciente.</p><a href="#fundamentals" class="primary v10-link">Estudiar las 12</a></article>
        <article class="v10-phase"><span>FASE 2</span><h2>Comprende A + B</h2><p>Las otras 66 cartas son combinaciones entre dos de esas 12 funciones. No son 66 conceptos aislados.</p><a href="#module/m5" class="secondary v10-link">Clase de combinaciones</a></article>
        <article class="v10-phase"><span>FASE 3</span><h2>Estudia las 66 combinaciones</h2><p>Mira la escena, reconoce las dos funciones y después comprende la dinámica psicológica que forman juntas.</p><a href="#cards" class="secondary v10-link">Abrir las 78 cartas</a></article>
        <article class="v10-phase"><span>FASE 4</span><h2>Haz lecturas</h2><p>Primero una carta, después dos y finalmente Problema → Camino → Resultado y casos completos.</p><a href="#practice" class="secondary v10-link">Ir al entrenador</a></article>
      </div>
      <div class="notice v10-notice"><strong>¿Entonces para qué sirven los 13 módulos?</strong> Son clases de apoyo. Te enseñan lenguaje visual, astrología, combinaciones, posiciones y técnica de lectura. No son el orden en el que debes memorizar las cartas.</div>
      <div class="section-head"><div><div class="page-kicker">CLASES DE APOYO</div><h2>Los 13 módulos</h2></div><p>Consúltalos mientras avanzas por las cuatro fases.</p></div>
      <div class="module-grid">${modules.map(m=>`<article class="module-card" onclick="location.hash='#module/${esc(m.id)}'"><div class="top"><span>MÓDULO ${esc(m.number)}</span><span>${esc(m.duration)}</span></div><h3>${esc(m.title)}</h3><p>${esc(m.subtitle)}</p><div class="card-flags"><span>Clase</span><span>Ejemplos</span><span>Práctica</span></div></article>`).join('')}</div>
    </div>`;
  }

  function fundamentalCard(c){
    return `<article class="v10-fundamental" data-open-card="${esc(c.id)}">
      <div class="v10-card-image"><img src="${c.image}" alt="${esc(c.title)}"></div>
      <div class="v10-card-copy">
        <div class="page-kicker">CARTA ${String(c.number).padStart(2,'0')}</div>
        <h2>${esc(c.title)}</h2>
        <div class="astro-big">${esc(c.glyphA)} ${esc(c.signA)} · ${esc(c.planetGlyphA)} ${esc(c.planetA)}</div>
        <h3>${esc(c.idea)}</h3>
        <p>${esc(c.psychology)}</p>
        <div class="v10-four">
          <div><strong>Deseo</strong><span>${esc(c.desire)}</span></div>
          <div><strong>Miedo</strong><span>${esc(c.fear)}</span></div>
          <div><strong>Sombra</strong><span>${esc(c.shadow)}</span></div>
          <div><strong>Recurso</strong><span>${esc(c.potential)}</span></div>
        </div>
        <div class="v10-remember"><strong>Frase para recordarla:</strong> ${esc(c.remember)}</div>
        <small>Toca aquí para abrir la ficha completa: ejemplos, Problema · Camino · Resultado y práctica.</small>
      </div>
    </article>`;
  }

  function fundamentalsPage(){
    const base=CARDS.filter(c=>c.family==='fundamental').slice(0,12);
    return `<div class="content v10-study">
      <div class="page-kicker">FASE 1 · BASE DEL SISTEMA</div>
      <h1 class="page-title">Las 12 personas<br>internas.</h1>
      <p class="page-lede">Empieza aquí. Estas 12 cartas son el alfabeto de Symbolon. Las 66 restantes se entienden combinando estas funciones.</p>
      <div class="v10-method">
        <h2>Cómo estudiarlas</h2>
        <ol>
          <li><strong>Mira la imagen</strong> antes de leer.</li>
          <li><strong>Entiende qué función representa</strong>, no memorices una definición.</li>
          <li><strong>Aprende su polaridad:</strong> deseo, miedo, sombra y recurso.</li>
          <li><strong>Quédate con una frase</strong> que puedas recordar.</li>
          <li><strong>Explícala con tus palabras</strong> sin mirar la ficha.</li>
        </ol>
        <p><strong>Ritmo recomendado:</strong> 3 cartas por sesión. Cuando puedas explicar las 12 sin mirar, pasa a las combinaciones.</p>
      </div>
      <div class="v10-fundamental-list">${base.map(fundamentalCard).join('')}</div>
      <div class="hero-actions"><a class="primary v10-link" href="#practice/archetypes">Practicar las 12</a><a class="secondary v10-link" href="#course">Volver a la ruta</a></div>
    </div>`;
  }

  function bindFundamentals(){
    document.querySelectorAll('[data-open-card]').forEach(el=>el.onclick=()=>location.hash='#card/'+el.dataset.openCard);
  }

  function resetLibraryFilters(){
    const search=document.querySelector('#cardSearch');
    const family=document.querySelector('#familyFilter');
    const status=document.querySelector('#statusFilter');
    if(search && search.value){ search.value=''; search.dispatchEvent(new Event('input',{bubbles:true})); }
    if(family && family.value!=='all'){ family.value='all'; family.dispatchEvent(new Event('change',{bubbles:true})); }
    if(status && status.value!=='all'){ status.value='all'; status.dispatchEvent(new Event('change',{bubbles:true})); }
    const fav=document.querySelector('#favFilter'); if(fav?.classList.contains('active')) fav.click();
    const diff=document.querySelector('#diffFilter'); if(diff?.classList.contains('active')) diff.click();
  }

  function enhanceLibrary(){
    const root=app(); if(!root) return;
    resetLibraryFilters();
    setTimeout(()=>{
      const title=root.querySelector('.page-title');
      if(title) title.textContent='78 = 12 + 66';
      const lede=root.querySelector('.page-lede');
      if(lede) lede.innerHTML='Aquí están las <strong>78 cartas completas</strong>: 12 fundamentales + 66 combinaciones. Cada tarjeta muestra ahora una idea esencial; al tocarla se abre la explicación completa.';

      const toolbar=root.querySelector('.toolbar');
      if(toolbar && !root.querySelector('.v10-library-count')){
        const info=document.createElement('div');
        info.className='v10-library-count';
        info.innerHTML='<strong>78</strong><span>cartas cargadas · 12 fundamentales + 66 combinaciones</span>';
        toolbar.before(info);
      }

      // Remove the matrix from the main learning flow: it remains a concept, but it was confusing here.
      const matrix=root.querySelector('.matrix');
      if(matrix){
        const head=matrix.previousElementSibling;
        const legend=matrix.nextElementSibling;
        head?.remove(); legend?.remove(); matrix.remove();
      }

      const grid=root.querySelector('#cardGrid');
      if(!grid) return;
      grid.querySelectorAll('.v10-group-title').forEach(x=>x.remove());
      const tiles=[...grid.querySelectorAll('.symbolon-card[data-card]')];
      tiles.forEach(tile=>{
        const c=CARDS.find(x=>x.id===tile.dataset.card); if(!c) return;
        const body=tile.querySelector('.body');
        if(body && !body.querySelector('.v10-card-summary')){
          const p=document.createElement('p'); p.className='v10-card-summary'; p.textContent=c.idea; body.appendChild(p);
          const hint=document.createElement('small'); hint.className='v10-open-hint'; hint.textContent='Toca para ver la explicación completa →'; body.appendChild(hint);
        }
      });
      if(tiles[0]){
        const h=document.createElement('div'); h.className='v10-group-title'; h.innerHTML='<div class="page-kicker">PRIMERO</div><h2>12 cartas fundamentales</h2><p>El alfabeto del sistema.</p>'; grid.insertBefore(h,tiles[0]);
      }
      if(tiles[12]){
        const h=document.createElement('div'); h.className='v10-group-title'; h.innerHTML='<div class="page-kicker">DESPUÉS</div><h2>66 combinaciones</h2><p>Dos funciones internas interactuando.</p>'; grid.insertBefore(h,tiles[12]);
      }
    },30);
  }

  function enhanceModule(){
    const root=app(); if(!root) return;
    const section=[...root.querySelectorAll('.section-head')].find(x=>x.textContent.includes('MAPA VISUAL')||x.textContent.includes('Antes de entrar al detalle'));
    if(section){
      const kicker=section.querySelector('.page-kicker'); if(kicker) kicker.textContent='CARTAS GUÍA';
      const h=section.querySelector('h2'); if(h) h.textContent='Ejemplos de esta clase';
      const p=section.querySelector('p'); if(p) p.textContent='Estas cartas ilustran la teoría del módulo. No tienes que memorizarlas aquí: el estudio sistemático está en Las 12 fundamentales y Las 78 cartas.';
    }
    if(!root.querySelector('.v10-module-role')){
      const hero=root.querySelector('.module-hero');
      if(hero){ const n=document.createElement('div'); n.className='notice v10-module-role'; n.innerHTML='<strong>Este módulo es una clase de apoyo.</strong> Úsalo para entender el sistema; no es una lista de cartas que tengas que memorizar.'; hero.after(n); }
    }
  }

  function enhanceHome(){
    const root=app(); if(!root || root.querySelector('.v10-start-here')) return;
    const stats=root.querySelector('.stats');
    if(stats){
      const box=document.createElement('div'); box.className='v10-start-here';
      box.innerHTML='<div class="page-kicker">EMPIEZA POR AQUÍ</div><h2>No empieces por los 13 módulos.</h2><p>Primero aprende las 12 cartas fundamentales. Después entiende las 66 combinaciones y entonces pasa a las tiradas.</p><div class="hero-actions"><a class="primary v10-link" href="#course">Ver la ruta de estudio</a><a class="secondary v10-link" href="#fundamentals">Estudiar las 12</a></div>';
      stats.before(box);
    }
  }

  function enhanceCardDetail(){
    const root=app(); if(!root || root.querySelector('.v10-detail-guide')) return;
    const detail=root.querySelector('.card-detail');
    if(detail){
      const guide=document.createElement('div'); guide.className='notice v10-detail-guide';
      guide.innerHTML='<strong>Ficha completa.</strong> Estúdiala en este orden: imagen → idea esencial → dinámica psicológica → deseo/miedo/sombra/recurso → Problema/Camino/Resultado → frase para recordarla.';
      detail.before(guide);
    }
  }

  function enhance(){
    ensureNav();
    const r=route();
    if(r==='course'){ app().innerHTML=coursePage(); }
    else if(r==='fundamentals'){ app().innerHTML=fundamentalsPage(); bindFundamentals(); }
    else if(r==='cards') enhanceLibrary();
    else if(r.startsWith('module/')) enhanceModule();
    else if(r.startsWith('card/')) enhanceCardDetail();
    else if(r==='home') enhanceHome();
  }

  window.addEventListener('hashchange',()=>setTimeout(enhance,0));
  setTimeout(enhance,0);
})();
