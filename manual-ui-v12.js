(() => {
  'use strict';
  const INS=window.SYMBOLON_MANUAL_INSIGHTS||{};
  const CARDS=window.SYMBOLON_CARDS||[];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const route=()=> (location.hash||'#home').slice(1);
  const card=id=>CARDS.find(c=>c.id===id);
  function ensureNav(){
    const nav=document.querySelector('.main-nav'); if(!nav)return;
    if(!nav.querySelector('[data-spreads-nav]')){
      const b=document.createElement('button');b.setAttribute('data-spreads-nav','1');b.innerHTML='Ⅲ <span>Tiradas</span>';b.onclick=()=>location.hash='#spreads';
      const practice=nav.querySelector('[data-route="practice"]'); practice?.after(b);
    }
    nav.querySelector('[data-spreads-nav]')?.classList.toggle('active',route()==='spreads');
  }
  function manualSection(id){
    const m=INS[id]; if(!m)return'';
    return `<section class="manual-source"><div class="manual-meta">BASE DEL PDF · PÁGINA${m.p.length>1?'S':''} ${m.p.join('–')}</div><h2>Lee la imagen antes de interpretar</h2><p class="manual-focus">${esc(m.focus)}</p><div class="manual-columns"><div class="manual-box"><strong>Lo que el PDF utiliza para explicarla</strong>${m.explicit?.length?`<ul>${m.explicit.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>No desarrolla de forma explícita un detalle visual concreto en esta ficha.</p>'}</div><div class="manual-box"><strong>Anclas visuales para recordarla</strong><div class="anchor-chips">${(m.anchors||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div></div></div><div class="source-note">La primera columna resume únicamente elementos que el PDF relaciona con la interpretación. Las anclas visuales son observaciones pedagógicas para estudiar la imagen; no se presentan como significado oficial cuando el texto no las desarrolla.</div></section>`;
  }
  function augmentCard(){
    const r=route(); if(!r.startsWith('card/'))return;
    const id=r.split('/')[1],root=document.querySelector('#app'); if(!root||root.querySelector('.manual-source'))return;
    const target=root.querySelector('.detail-title')?.parentElement; if(!target)return;
    const wrap=document.createElement('div');wrap.innerHTML=manualSection(id);const node=wrap.firstElementChild;
    const first=target.querySelector('.detail-section'); if(first) target.insertBefore(node,first); else target.appendChild(node);
  }
  function augmentGuided(){
    const root=document.querySelector('#app'); if(!root)return;
    const stage=root.querySelector('.guided-card-stage'); if(!stage||stage.querySelector('.manual-guided'))return;
    const img=stage.querySelector('img'); if(!img)return;
    const title=img.getAttribute('alt')||'';const c=CARDS.find(x=>x.title===title);if(!c||!INS[c.id])return;const m=INS[c.id];
    const box=document.createElement('div');box.className='manual-guided';box.innerHTML=`<strong>Lee la imagen</strong><p>${esc(m.focus)}</p><div class="anchor-chips">${m.anchors.slice(0,3).map(x=>`<span>${esc(x)}</span>`).join('')}</div>`;
    const copy=stage.querySelector('.guided-teach-copy');copy?.appendChild(box);
  }
  function spreadsPage(){
    const root=document.querySelector('#app'); if(!root)return;
    root.innerHTML=`<div class="content spreads-page"><div class="page-kicker">MÉTODO DE TIRADAS</div><h1 class="page-title">Problema → Camino → Resultado</h1><p class="page-lede">Symbolon no cambia de significado al azar según la posición. La posición cambia la pregunta que le haces a la misma dinámica: ¿qué está bloqueado?, ¿qué necesita hacerse consciente?, ¿en qué puede convertirse el proceso?</p><div class="spread-intro"><article class="spread-position"><div class="n">I</div><h3>Problema</h3><p>La primera carta muestra la raíz o trasfondo del asunto: la persona interna, conflicto o dinámica que necesita ser recordada y reconocida.</p></article><article class="spread-position"><div class="n">II</div><h3>Camino</h3><p>Las cartas intermedias muestran el trabajo que toca hacer: qué función desarrollar, admitir, atravesar o integrar para mover el problema.</p></article><article class="spread-position"><div class="n">III</div><h3>Resultado</h3><p>La última carta describe hacia qué integración puede conducir el proceso si se realiza el camino. No es una predicción fija, sino la consecuencia psicológica del recorrido.</p></article></div><section class="spread-card"><h3>1 carta</h3><p>Úsala cuando quieras identificar el núcleo de un asunto. Formula una pregunta abierta, extrae una carta y léela como <strong>Problema</strong>: ¿qué dinámica interna está actuando aquí?</p><div class="spread-flow"><span>Pregunta</span><b>→</b><span>1 carta = Problema</span><b>→</b><span>Reconocer</span></div></section><section class="spread-card"><h3>3 cartas</h3><p>Es la forma más clara para aprender el método y la que usamos en el curso.</p><div class="spread-flow"><span>1 · Problema</span><b>→</b><span>2 · Camino</span><b>→</b><span>3 · Resultado</span></div><p>No leas tres definiciones separadas. Busca una frase de transformación: <em>“Parto de…, necesito atravesar…, y eso puede llevarme a…”</em>.</p></section><section class="spread-card"><h3>5 cartas</h3><p>El mismo método puede ampliarse manteniendo la estructura del folleto: primera carta como Problema, varias cartas intermedias como Camino y última como Resultado.</p><div class="spread-flow"><span>1 · Problema</span><b>→</b><span>2 · Camino</span><span>3 · Camino</span><span>4 · Camino</span><b>→</b><span>5 · Resultado</span></div><p>Las cartas 2–4 no son tres problemas nuevos. Son etapas o funciones necesarias dentro del mismo proceso.</p></section><section class="spread-card"><h3>Cómo leer cada posición</h3><ol><li><strong>Mira la imagen antes del texto.</strong> Nombra personajes, gestos, dirección, objetos, luz, color y tensión.</li><li><strong>Identifica los arquetipos.</strong> ¿Qué dos funciones internas aparecen y cómo se relacionan?</li><li><strong>Adapta la dinámica a la posición.</strong> En Problema observa bloqueo/sombra; en Camino busca la tarea consciente; en Resultado busca integración o consecuencia.</li><li><strong>Une las cartas.</strong> Explica qué cambia de una posición a la siguiente.</li></ol></section><section class="spread-card"><h3>Cómo formular preguntas</h3><p>Prioriza preguntas de autoconocimiento: “¿Qué necesito reconocer sobre…?”, “¿Qué dinámica estoy repitiendo?”, “¿Qué me ayudaría a atravesar…?”. Evita convertir el sistema en una máquina de sí/no o en afirmaciones cerradas sobre terceros.</p></section><section class="spread-practice"><div class="page-kicker">ENTRENAMIENTO</div><h2>La tirada se aprende practicando posiciones</h2><p>En Estudio guiado encontrarás ejercicios donde la misma carta aparece como Problema, Camino y Resultado. El objetivo es que aprendas a transformar el significado, no a memorizar tres párrafos.</p><div class="hero-actions"><a class="primary v10-link" href="#guided">Ir a Estudio guiado</a><a class="secondary v10-link" href="#practice/surprise">Hacer una tirada sorpresa</a></div></section><div class="source-note">Base del método: documentación editorial de Symbolon y referencias al folleto original de Peter Orban, Ingrid Zinnel y Thea Weller. El PDF aportado contiene las 78 cartas y comentarios interpretativos, pero no incluye un capítulo de tiradas estructurado; por eso esta sección diferencia la metodología de tirada del contenido visual del PDF.</div></div>`;
  }
  function apply(){ensureNav();if(route()==='spreads')spreadsPage();augmentCard();augmentGuided();}
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  window.addEventListener('DOMContentLoaded',()=>{const a=document.querySelector('#app');if(a)obs.observe(a,{childList:true,subtree:true});apply();});
  window.addEventListener('hashchange',()=>setTimeout(apply,0));
  setTimeout(()=>{const a=document.querySelector('#app');if(a)obs.observe(a,{childList:true,subtree:true});apply();},50);
})();