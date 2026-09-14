(() => {
  'use strict';

  const CARDS = window.SYMBOLON_CARDS || [];
  const INS = window.SYMBOLON_MANUAL_INSIGHTS || {};
  const STORAGE = 'symbolon_state_v1';
  let reading = null;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const route = () => (location.hash || '#home').slice(1);
  const shuffle = a => [...a].sort(() => Math.random() - .5);
  const app = () => document.querySelector('#app');
  const positions = [
    {key:'problem', label:'Problema', prompt:'¿Qué dinámica está en la raíz del asunto?'},
    {key:'way', label:'Camino', prompt:'¿Qué necesita hacerse consciente, desarrollarse o atravesarse?'},
    {key:'result', label:'Resultado', prompt:'¿Hacia qué integración puede conducir el proceso?'}
  ];

  function freshReading(){
    return {question:'', privateQuestion:false, cards:shuffle(CARDS).slice(0,3), step:-1, revealed:[false,false,false], notes:['','',''], finished:false};
  }

  function startScreen(){
    reading = freshReading();
    return `<div class="content ir-page">
      <div class="page-kicker">TIRADA SORPRESA · LECTURA INTERACTIVA</div>
      <h1 class="page-title">Piensa tu pregunta.<br>Después, saca las cartas.</h1>
      <p class="page-lede">Puedes escribir la pregunta para verla junto a la lectura o mantenerla completamente en privado. La tirada seguirá la estructura <strong>Problema → Camino → Resultado</strong>.</p>
      <div class="ir-question-box">
        <label for="irQuestion">Mi pregunta <span>(opcional)</span></label>
        <textarea id="irQuestion" placeholder="Ej.: ¿Qué necesito reconocer sobre esta relación? ¿Qué dinámica estoy repitiendo en el trabajo?"></textarea>
        <label class="ir-private"><input type="checkbox" id="irPrivate"> <span>No quiero escribirla. La mantengo en mente.</span></label>
        <div class="source-note">No necesitas formular una predicción. Funcionan mejor preguntas como “¿Qué necesito reconocer sobre…?” o “¿Qué me ayudaría a atravesar…?”.</div>
      </div>
      <button class="primary ir-big" data-ir-start>Barajar y comenzar</button>
      <button class="secondary" data-ir-back>← Volver a practicar</button>
    </div>`;
  }

  function archetypeLine(c){
    const a = `${c.glyphA||''} ${c.signA||''} · ${c.planetGlyphA||''} ${c.planetA||''}`.trim();
    const b = c.signB ? `${c.glyphB||''} ${c.signB||''} · ${c.planetGlyphB||''} ${c.planetB||''}`.trim() : '';
    return b ? `${a} × ${b}` : a;
  }

  function imageClues(c){
    const m = INS[c.id];
    if(!m) return '';
    const explicit = (m.explicit || []).slice(0,3);
    const anchors = (m.anchors || []).slice(0,4);
    return `<div class="ir-clues">
      <strong>Lee la imagen</strong>
      <p>${esc(m.focus || '')}</p>
      ${explicit.length ? `<ul>${explicit.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${anchors.length ? `<div class="anchor-chips">${anchors.map(x=>`<span>${esc(x)}</span>`).join('')}</div>` : ''}
    </div>`;
  }

  function readingScreen(){
    if(!reading) return startScreen();
    const idx = Math.max(0, reading.step);
    const p = positions[idx];
    const c = reading.cards[idx];
    const reveal = reading.revealed[idx];
    const q = reading.privateQuestion ? 'Tu pregunta permanece en tu mente.' : (reading.question ? `“${esc(reading.question)}”` : 'Mantén tu pregunta presente mientras miras la carta.');
    const prior = reading.cards.slice(0, idx).map((x,i)=>`<div class="ir-mini-card"><span>${positions[i].label}</span><img src="${x.image}" alt="${esc(x.title)}"><strong>${esc(x.title)}</strong></div>`).join('');

    return `<div class="content ir-page">
      <div class="ir-top"><button class="secondary" data-ir-back>← Salir</button><div class="ir-dots">${positions.map((x,i)=>`<i class="${i<idx?'done':i===idx?'active':''}"></i>`).join('')}</div><span>${idx+1}/3</span></div>
      <div class="page-kicker">${p.label.toUpperCase()}</div>
      <h1 class="page-title">${esc(p.prompt)}</h1>
      <p class="ir-question-reminder">${q}</p>
      ${prior ? `<div class="ir-prior">${prior}</div>` : ''}
      <section class="ir-draw ${reveal?'revealed':''}">
        ${reveal ? `
          <img class="ir-card-img" src="${c.image}" alt="${esc(c.title)}">
          <div class="ir-card-copy">
            <div class="page-kicker">CARTA ${String(c.number).padStart(2,'0')} · ${esc(archetypeLine(c))}</div>
            <h2>${esc(c.title)}</h2>
            <p class="ir-idea">${esc(c.idea)}</p>
            <label>Antes de leer la interpretación, ¿qué te llama la atención de la imagen?</label>
            <textarea data-ir-note="${idx}" placeholder="Un gesto, un color, un personaje, una sensación, un objeto…">${esc(reading.notes[idx])}</textarea>
            ${imageClues(c)}
            <button class="primary ir-big" data-ir-interpret="${idx}">Ver interpretación como ${esc(p.label)}</button>
          </div>` : `
          <div class="ir-card-back"><span>◐</span><small>${esc(p.label)}</small></div>
          <div class="ir-draw-copy"><h2>La carta todavía está boca abajo.</h2><p>No intentes elegir. Mantén la pregunta y pulsa cuando quieras sacar esta posición.</p><button class="primary ir-big" data-ir-draw="${idx}">Sacar carta ${idx+1}</button></div>`}
      </section>
    </div>`;
  }

  function interpretationScreen(idx){
    const c = reading.cards[idx];
    const p = positions[idx];
    const text = c[p.key];
    const next = idx < 2;
    return `<div class="content ir-page">
      <div class="page-kicker">${p.label.toUpperCase()} · ${esc(c.title)}</div>
      <h1 class="page-title">Ahora sí:<br>lee la dinámica.</h1>
      <section class="ir-interpretation">
        <div class="ir-interp-card"><img src="${c.image}" alt="${esc(c.title)}"><div><strong>${esc(c.title)}</strong><span>${esc(archetypeLine(c))}</span></div></div>
        <div class="ir-position-text"><span>${esc(p.label)}</span><p>${esc(text)}</p></div>
        <div class="ir-reflect"><strong>Conecta con tu pregunta</strong><p>${esc(p.prompt)}</p>${reading.notes[idx]?`<blockquote>Lo que tú viste primero: ${esc(reading.notes[idx])}</blockquote>`:''}</div>
      </section>
      ${next ? `<button class="primary ir-big" data-ir-next="${idx+1}">Ir a ${positions[idx+1].label}</button>` : `<button class="primary ir-big" data-ir-finish>Unir las tres cartas</button>`}
    </div>`;
  }

  function finalScreen(){
    const [a,b,c] = reading.cards;
    const q = reading.privateQuestion ? 'Pregunta mantenida en privado' : (reading.question || 'Pregunta mantenida en mente');
    return `<div class="content ir-page ir-final">
      <div class="page-kicker">LECTURA COMPLETA</div>
      <h1 class="page-title">Problema → Camino → Resultado</h1>
      <p class="page-lede"><strong>${esc(q)}</strong></p>
      <div class="ir-three">${reading.cards.map((x,i)=>`<article><span>${positions[i].label}</span><img src="${x.image}" alt="${esc(x.title)}"><h3>${esc(x.title)}</h3><small>${esc(archetypeLine(x))}</small></article>`).join('')}</div>
      <section class="ir-story">
        <div><span>1 · Problema</span><p>${esc(a.problem)}</p></div>
        <div><span>2 · Camino</span><p>${esc(b.way)}</p></div>
        <div><span>3 · Resultado</span><p>${esc(c.result)}</p></div>
      </section>
      <section class="ir-thread">
        <div class="page-kicker">EL HILO DE LA TIRADA</div>
        <h2>No son tres respuestas separadas.</h2>
        <p>La lectura parte de <strong>${esc(a.title)}</strong>: ${esc(a.idea)} El movimiento propuesto aparece en <strong>${esc(b.title)}</strong>: ${esc(b.potential)}. Si ese trabajo se integra, <strong>${esc(c.title)}</strong> señala una dirección de resultado: ${esc(c.potential)}.</p>
        <p class="ir-question-to-user">Pregúntate: <strong>¿qué tendría que cambiar en mí para pasar realmente de la primera escena a la tercera?</strong></p>
      </section>
      <section class="ir-notes-summary">
        <h3>Lo que viste tú</h3>
        ${reading.notes.map((n,i)=>n?`<p><strong>${positions[i].label}:</strong> ${esc(n)}</p>`:'').join('') || '<p>No escribiste observaciones. También puedes hacer la lectura solo mirando.</p>'}
      </section>
      <div class="hero-actions"><button class="primary" data-ir-save>Guardar en mi diario</button><button class="secondary" data-ir-again>Hacer otra tirada</button><button class="secondary" data-ir-cards>Ver las fichas de estas cartas</button></div>
      <div class="source-note">La tirada se utiliza aquí como herramienta de reflexión. El resultado describe una posible integración del proceso, no una predicción inevitable.</div>
    </div>`;
  }

  function renderReading(){
    if(route() !== 'practice/surprise') return;
    const root = app(); if(!root) return;
    if(!reading || reading.step === -1) root.innerHTML = startScreen();
    else if(reading.finished) root.innerHTML = finalScreen();
    else root.innerHTML = readingScreen();
    root.focus({preventScroll:true});
    window.scrollTo(0,0);
  }

  function saveJournal(){
    try{
      const state = JSON.parse(localStorage.getItem(STORAGE) || '{}');
      state.journal = Array.isArray(state.journal) ? state.journal : [];
      const today = new Date().toISOString().slice(0,10);
      const q = reading.privateQuestion ? 'Pregunta mantenida en privado' : (reading.question || 'Pregunta mantenida en mente');
      state.journal.push({
        id:'j'+Date.now(), date:today, theme:'Tirada sorpresa', question:q,
        spread:'Problema · Camino · Resultado', cards:reading.cards.map(c=>c.id),
        initial:`Problema: ${reading.cards[0].problem}\n\nCamino: ${reading.cards[1].way}\n\nResultado: ${reading.cards[2].result}`,
        emotions:reading.notes.filter(Boolean).map((n,i)=>`${positions[i].label}: ${n}`).join('\n'),
        conclusion:`Hilo: ${reading.cards[0].title} → ${reading.cards[1].title} → ${reading.cards[2].title}.`,
        followup:'', createdAt:new Date().toISOString()
      });
      state.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE, JSON.stringify(state));
      location.hash = '#journal';
      location.reload();
    }catch(e){ alert('No se pudo guardar la lectura.'); }
  }

  document.addEventListener('input', e => {
    if(route()!=='practice/surprise' || !reading) return;
    if(e.target.id==='irQuestion') reading.question=e.target.value;
    if(e.target.matches('[data-ir-note]')) reading.notes[+e.target.dataset.irNote]=e.target.value;
  }, true);

  document.addEventListener('change', e => {
    if(route()!=='practice/surprise' || !reading) return;
    if(e.target.id==='irPrivate'){
      reading.privateQuestion=e.target.checked;
      const q=document.querySelector('#irQuestion'); if(q){q.disabled=e.target.checked;if(e.target.checked)q.value='';}
      if(e.target.checked)reading.question='';
    }
  }, true);

  document.addEventListener('click', e => {
    if(route()!=='practice/surprise') return;
    const start=e.target.closest('[data-ir-start]'); if(start){
      const q=document.querySelector('#irQuestion'); const priv=document.querySelector('#irPrivate');
      reading.question=q?.value.trim()||''; reading.privateQuestion=!!priv?.checked; reading.step=0; renderReading(); return;
    }
    if(e.target.closest('[data-ir-back]')){ location.hash='#practice'; return; }
    const draw=e.target.closest('[data-ir-draw]'); if(draw){ reading.revealed[+draw.dataset.irDraw]=true; renderReading(); return; }
    const interp=e.target.closest('[data-ir-interpret]'); if(interp){
      const idx=+interp.dataset.irInterpret; const root=app(); if(root) root.innerHTML=interpretationScreen(idx); window.scrollTo(0,0); return;
    }
    const next=e.target.closest('[data-ir-next]'); if(next){ reading.step=+next.dataset.irNext; renderReading(); return; }
    if(e.target.closest('[data-ir-finish]')){ reading.finished=true; renderReading(); return; }
    if(e.target.closest('[data-ir-save]')){ saveJournal(); return; }
    if(e.target.closest('[data-ir-again]')){ reading=freshReading(); renderReading(); return; }
    if(e.target.closest('[data-ir-cards]')){ location.hash='#cards'; return; }
  }, true);

  function takeOver(){
    if(route()!=='practice/surprise') return;
    const root=app(); if(!root) return;
    if(root.querySelector('.ir-page')) return;
    renderReading();
  }

  const obs = new MutationObserver(()=>requestAnimationFrame(takeOver));
  window.addEventListener('DOMContentLoaded',()=>{const root=app();if(root)obs.observe(root,{childList:true,subtree:true});takeOver();});
  window.addEventListener('hashchange',()=>setTimeout(()=>{if(route()==='practice/surprise'){reading=null;takeOver();}},0));
  setTimeout(()=>{const root=app();if(root)obs.observe(root,{childList:true,subtree:true});takeOver();},80);
})();
