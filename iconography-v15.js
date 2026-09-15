(() => {
  'use strict';
  const CARDS = window.SYMBOLON_CARDS || [];
  const INS = window.SYMBOLON_MANUAL_INSIGHTS || {};
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const route = () => (location.hash || '#home').slice(1);

  function cardById(id){ return CARDS.find(c=>c.id===id); }

  function memorySteps(c,m){
    const a=m.anchors||[];
    const first=a[0]||'figura principal';
    const second=a[1]||'objeto central';
    const third=a[2]||'contraste de la escena';
    return [
      {n:'01',title:'Localiza el centro',text:`Empieza por «${first}». Describe qué hace o qué lugar ocupa antes de interpretar.`},
      {n:'02',title:'Busca la segunda pista',text:`Después mira «${second}». Pregúntate qué añade o contradice respecto a la primera pista.`},
      {n:'03',title:'Encuentra la tensión',text:`Observa «${third}». Úsalo para reconocer hacia dónde se mueve, se bloquea o se divide la escena.`},
      {n:'04',title:'Ponle una frase',text:`Une lo que has visto con esta idea: ${c.idea}`}
    ];
  }

  function iconographySection(c,m){
    const anchors=m.anchors||[];
    const explicit=m.explicit||[];
    const combo=c.signB
      ? `${c.glyphA} ${c.signA} · ${c.planetGlyphA} ${c.planetA}  ×  ${c.glyphB} ${c.signB} · ${c.planetGlyphB} ${c.planetB}`
      : `${c.glyphA} ${c.signA} · ${c.planetGlyphA} ${c.planetA}`;
    const pages=(m.p||[]).join('–');
    return `<section class="iconography-v15">
      <div class="page-kicker">ICONOGRAFÍA · MEMORIA VISUAL</div>
      <h2>Aprende esta carta mirando la escena</h2>
      <p class="iconography-lede">La idea no es memorizar una definición aislada. Usa la imagen como mapa: personaje, gesto, objetos, dirección, contraste, color y atmósfera te ayudan a reconstruir la dinámica.</p>

      <div class="iconography-hero">
        <button type="button" class="iconography-image" data-v15-zoom="${esc(c.image)}" aria-label="Ampliar imagen de ${esc(c.title)}">
          <img src="${esc(c.image)}" alt="${esc(c.title)}">
          <span>Ampliar imagen</span>
        </button>
        <div class="iconography-summary">
          <div class="iconography-combo">${esc(combo)}</div>
          <h3>${esc(m.focus || c.idea)}</h3>
          <p><strong>Idea esencial:</strong> ${esc(c.idea)}</p>
          <p><strong>Dinámica psicológica:</strong> ${esc(c.psychology)}</p>
          <div class="iconography-polarity">
            <div><span>Sombra</span><strong>${esc(c.shadow)}</strong></div>
            <div><span>Recurso</span><strong>${esc(c.potential)}</strong></div>
          </div>
        </div>
      </div>

      <div class="iconography-heading"><span>01</span><div><h3>Qué detalles de la imagen explica el PDF</h3><p>Estos puntos proceden del contenido del PDF aportado y son la capa que debes priorizar para comprender la iconografía.</p></div></div>
      <div class="iconography-evidence">
        ${explicit.length ? explicit.map((x,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><p>${esc(x)}</p></article>`).join('') : '<article><p>En esta ficha el PDF no desarrolla de manera explícita un símbolo visual concreto. La lectura visual inferior se presenta solo como apoyo pedagógico.</p></article>'}
      </div>

      <div class="iconography-heading"><span>02</span><div><h3>Anclas visuales</h3><p>Detalles que conviene localizar en segundos cuando vuelva a aparecer la carta.</p></div></div>
      <div class="iconography-anchor-grid">
        ${anchors.map((x,i)=>`<div><b>${String(i+1).padStart(2,'0')}</b><span>${esc(x)}</span></div>`).join('')}
      </div>

      <div class="iconography-heading"><span>03</span><div><h3>Cómo leerla con los ojos</h3><p>Una secuencia corta para reconstruir el significado sin consultar la definición.</p></div></div>
      <div class="iconography-steps">
        ${memorySteps(c,m).map(s=>`<article><span>${s.n}</span><div><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p></div></article>`).join('')}
      </div>

      <div class="iconography-memory">
        <div class="page-kicker">ANCLA DE 10 SEGUNDOS</div>
        <strong>${esc(anchors.slice(0,3).join(' → ') || c.title)}</strong>
        <span>→</span>
        <p>${esc(c.remember || c.idea)}</p>
      </div>

      <div class="iconography-heading"><span>04</span><div><h3>La misma imagen según la posición</h3><p>No cambies de carta: cambia la pregunta que haces a la misma escena.</p></div></div>
      <div class="iconography-positions">
        <article><strong>Problema</strong><p>${esc(c.problem)}</p></article>
        <article><strong>Camino</strong><p>${esc(c.way)}</p></article>
        <article><strong>Resultado</strong><p>${esc(c.result)}</p></article>
      </div>

      <div class="source-note">PDF de referencia: página${(m.p||[]).length>1?'s':''} ${esc(pages)}. Los apartados “Qué detalles explica el PDF” resumen esa fuente. “Anclas visuales” y “Cómo leerla con los ojos” son una organización pedagógica del curso para facilitar memoria visual y no se presentan como texto oficial del manual.</div>
    </section>`;
  }

  function augmentCard(){
    const r=route();
    if(!r.startsWith('card/')) return;
    const id=r.split('/')[1];
    const c=cardById(id), m=INS[id], root=document.querySelector('#app');
    if(!c||!m||!root||root.querySelector('.iconography-v15')) return;
    const manual=root.querySelector('.manual-source');
    const astro=root.querySelector('.astro-guide-section');
    const title=root.querySelector('.detail-title');
    const wrap=document.createElement('div');
    wrap.innerHTML=iconographySection(c,m);
    const node=wrap.firstElementChild;
    if(manual) manual.after(node);
    else if(astro) astro.after(node);
    else title?.after(node);
  }

  function enhanceGuided(){
    const stage=document.querySelector('#app .guided-card-stage');
    if(!stage||stage.querySelector('.iconography-guided-v15')) return;
    const img=stage.querySelector('img');
    if(!img) return;
    const c=CARDS.find(x=>x.title===(img.getAttribute('alt')||''));
    const m=c&&INS[c.id];
    if(!c||!m) return;
    const box=document.createElement('div');
    box.className='iconography-guided-v15';
    box.innerHTML=`<strong>Memoria visual</strong><p>${esc(m.focus)}</p><div>${(m.anchors||[]).slice(0,3).map(x=>`<span>${esc(x)}</span>`).join('')}</div>${m.explicit?.[0]?`<small>${esc(m.explicit[0])}</small>`:''}`;
    stage.querySelector('.guided-teach-copy')?.appendChild(box);
  }

  function zoom(src){
    const host=document.querySelector('#modalHost');
    if(!host) return;
    host.innerHTML=`<div class="modal-backdrop v15-zoom-backdrop"><div class="v15-zoom-modal"><button type="button" class="modal-close" data-v15-close>×</button><img src="${esc(src)}" alt="Carta ampliada"></div></div>`;
  }

  document.addEventListener('click',e=>{
    const z=e.target.closest('[data-v15-zoom]');
    if(z){ e.preventDefault(); zoom(z.dataset.v15Zoom); return; }
    if(e.target.closest('[data-v15-close]')||e.target.classList.contains('v15-zoom-backdrop')) document.querySelector('#modalHost').innerHTML='';
  });

  function apply(){ augmentCard(); enhanceGuided(); }
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  window.addEventListener('DOMContentLoaded',()=>{const root=document.querySelector('#app');if(root)obs.observe(root,{childList:true,subtree:true});apply();});
  window.addEventListener('hashchange',()=>setTimeout(apply,0));
  setTimeout(()=>{const root=document.querySelector('#app');if(root)obs.observe(root,{childList:true,subtree:true});apply();},80);
})();
