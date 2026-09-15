(() => {
  'use strict';
  const CARDS = window.SYMBOLON_CARDS || [];
  const MANUAL = window.SYMBOLON_MANUAL_INSIGHTS || {};
  const root = document.getElementById('cardApp');
  const zoom = document.getElementById('fichaZoom');
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const SIGN_INFO = {
    Aries:['Fuego · Cardinal','iniciativa, impulso, separación, acción y capacidad de comenzar'],
    Tauro:['Tierra · Fijo','valor, cuerpo, placer, estabilidad, posesión y conservación'],
    Géminis:['Aire · Mutable','curiosidad, palabra, intercambio, flexibilidad y conexión'],
    Cáncer:['Agua · Cardinal','protección, memoria, sensibilidad, necesidad y pertenencia'],
    Leo:['Fuego · Fijo','identidad, creatividad, orgullo, visibilidad y expresión personal'],
    Virgo:['Tierra · Mutable','discernimiento, servicio, técnica, orden y mejora'],
    Libra:['Aire · Cardinal','vínculo, espejo, equilibrio, elección y negociación'],
    Escorpio:['Agua · Fijo','intensidad, apego, poder, crisis y transformación'],
    Sagitario:['Fuego · Mutable','sentido, creencia, expansión, visión y búsqueda de verdad'],
    Capricornio:['Tierra · Cardinal','límite, estructura, responsabilidad, tiempo y autoridad'],
    Acuario:['Aire · Fijo','libertad, distancia, diferencia, innovación y ruptura de patrones'],
    Piscis:['Agua · Mutable','entrega, imaginación, empatía, disolución e intuición']
  };
  const PLANET_INFO = {
    Marte:['acción, deseo, corte, afirmación y conflicto','El glifo ♂ recuerda una energía que se dirige y actúa.'],
    Venus:['atracción, valor, placer, belleza, vínculo y receptividad','El glifo ♀ sirve como ancla para valorar, atraer y encarnar.'],
    Mercurio:['mente, lenguaje, mediación, análisis, intercambio y movimiento','El glifo ☿ ayuda a recordar conexión, traducción y circulación.'],
    Luna:['emoción, memoria, hábito, cuidado, necesidad y pertenencia','La media luna ☽ recuerda ciclos, receptividad y cambio emocional.'],
    Sol:['identidad, centro, conciencia, creatividad y expresión','El círculo con punto ☉ es una ancla visual para el centro del yo.'],
    Plutón:['poder profundo, compulsión, crisis y transformación','♇ marca intensidad, descenso y transformación de fondo.'],
    Júpiter:['expansión, sentido, confianza, creencia y crecimiento','♃ funciona como ancla de ampliación de horizonte y significado.'],
    Saturno:['límite, realidad, responsabilidad, forma, tiempo y maduración','♄ recuerda estructura, ley, límite y aprendizaje por realidad.'],
    Urano:['ruptura, libertad, innovación, distancia y despertar','♅ sirve como ancla de cambio, diferencia y emancipación.'],
    Neptuno:['imaginación, fusión, idealización, sensibilidad y trascendencia','♆, como tridente, recuerda apertura, disolución y mundo imaginal.']
  };

  function pairText(c){
    const a = `${c.glyphA||''} ${c.signA||''} · ${c.planetGlyphA||''} ${c.planetA||''}`.trim();
    const b = c.signB ? `${c.glyphB||''} ${c.signB||''} · ${c.planetGlyphB||''} ${c.planetB||''}`.trim() : '';
    return b ? `${a} × ${b}` : a;
  }
  function pagesText(m){
    if(!m?.p?.length) return 'Sin página verificada';
    return `PDF aportado · ${m.p.length>1?'páginas':'página'} ${m.p.join('–')}`;
  }
  function anchorsHtml(m){
    const list = m?.anchors || [];
    if(!list.length) return '<p>No hay anclas visuales registradas todavía para esta carta.</p>';
    return `<div class="visual-anchor-grid">${list.map((a,i)=>`<div class="visual-anchor"><b>${i+1}. ${esc(a)}</b><span>${i===0?'Empieza por este detalle y úsalo para entrar en la escena.':i===1?'Relaciona este elemento con la tensión principal de la carta.':i===2?'Úsalo para recordar qué parte de la dinámica está en conflicto.':'Cierra con este detalle para reconstruir el significado completo.'}</span></div>`).join('')}</div>`;
  }
  function explicitHtml(m){
    const xs=m?.explicit||[];
    return xs.length?`<ul>${xs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>El PDF no desarrolla de forma expresa detalles iconográficos adicionales para esta carta.</p>';
  }
  function astroBlock(glyph,sign,planetGlyph,planet){
    if(!sign) return '';
    const s=SIGN_INFO[sign]||['',''];
    const p=PLANET_INFO[planet]||['',''];
    return `<div class="astro-v19"><div class="glyph">${esc(glyph||'')}</div><h3>${esc(sign)}</h3><small>Signo · ${esc(s[0])}</small><p>${esc(s[1])}</p></div>
    <div class="astro-v19"><div class="glyph">${esc(planetGlyph||'')}</div><h3>${esc(planet)}</h3><small>Planeta / función psicológica</small><p>${esc(p[0])}</p><p><em>${esc(p[1])}</em></p></div>`;
  }
  function render(c){
    const m=MANUAL[c.id]||{};
    const idx=CARDS.findIndex(x=>x.id===c.id);
    const prev=CARDS[(idx-1+CARDS.length)%CARDS.length];
    const next=CARDS[(idx+1)%CARDS.length];
    document.title=`${c.title} · SYMBOLON`;
    root.innerHTML=`
      <div class="ficha-hero">
        <aside class="ficha-image-card">
          <img src="${esc(c.image)}" alt="${esc(c.title)}" loading="eager">
          <div class="ficha-image-actions">
            <button class="primary" id="zoomCard">Ampliar imagen</button>
            <a class="secondary" href="entrada.html#fundamentals">Las 12 fundamentales</a>
          </div>
        </aside>
        <article>
          <div class="ficha-kicker">SYMBOLON · ${String(c.number).padStart(2,'0')} · ${c.family==='fundamental'?'FUNDAMENTAL':'COMBINACIÓN'}</div>
          <h1 class="ficha-title">${esc(c.title)}</h1>
          <p class="ficha-subtitle">${esc(c.idea)}</p>
          <div class="ficha-glyphs"><span class="ficha-glyph-chip"><b>${esc(c.glyphA||'')}</b> ${esc(c.signA||'')}</span><span class="ficha-glyph-chip"><b>${esc(c.planetGlyphA||'')}</b> ${esc(c.planetA||'')}</span>${c.signB?`<span class="ficha-glyph-chip"><b>${esc(c.glyphB||'')}</b> ${esc(c.signB||'')}</span><span class="ficha-glyph-chip"><b>${esc(c.planetGlyphB||'')}</b> ${esc(c.planetB||'')}</span>`:''}</div>

          <section class="ficha-section">
            <div class="ficha-kicker">ICONOGRAFÍA · MEMORIA VISUAL</div>
            <h2>Aprende esta carta mirando la escena</h2>
            <p class="ficha-remember">${esc(m.focus || c.remember || c.idea)}</p>
            <div class="iconography-grid">
              <div class="iconography-box"><h3>Lo que el PDF explica de la imagen</h3>${explicitHtml(m)}<div class="ficha-source">${esc(pagesText(m))}</div></div>
              <div class="iconography-box"><h3>Anclas visuales</h3>${anchorsHtml(m)}</div>
            </div>
            <h3>Cómo reconstruir el significado sin memorizar</h3>
            <p>Mira primero <strong>${esc((m.anchors||[])[0]||'la figura principal')}</strong>. Después observa <strong>${esc((m.anchors||[])[1]||'la acción')}</strong>. Pregúntate qué tensión aparece en <strong>${esc((m.anchors||[])[2]||'la relación entre los elementos')}</strong>. Por último, usa <strong>${esc((m.anchors||[])[3]||'el ambiente de la escena')}</strong> para recordar hacia dónde puede evolucionar la dinámica.</p>
          </section>

          <section class="ficha-section">
            <div class="ficha-kicker">SIGNIFICADO PSICOLÓGICO</div>
            <h2>Qué dinámica representa</h2>
            <p>${esc(c.psychology)}</p>
            <div class="psych-grid">
              <div class="psych-item"><span>Deseo</span><strong>${esc(c.desire)}</strong></div>
              <div class="psych-item"><span>Miedo</span><strong>${esc(c.fear)}</strong></div>
              <div class="psych-item"><span>Sombra</span><strong>${esc(c.shadow)}</strong></div>
              <div class="psych-item"><span>Recurso</span><strong>${esc(c.potential)}</strong></div>
            </div>
            ${c.examples?.length?`<h3>Ejemplos cotidianos</h3><ul>${c.examples.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
            ${c.question?`<h3>Pregunta de autoconocimiento</h3><p><strong>${esc(c.question)}</strong></p>`:''}
          </section>

          <section class="ficha-section">
            <div class="ficha-kicker">ASTROLOGÍA DE APOYO</div>
            <h2>Qué significan los glifos</h2>
            <p><strong>${esc(pairText(c))}</strong></p>
            <div class="astro-grid-v19">${astroBlock(c.glyphA,c.signA,c.planetGlyphA,c.planetA)}${c.signB?astroBlock(c.glyphB,c.signB,c.planetGlyphB,c.planetB):''}</div>
            <p>${c.signB?`Esta carta combina dos funciones. No basta con memorizar dos palabras: observa en la imagen si ambas energías cooperan, compiten, se rechazan o una domina a la otra.`:`En esta carta fundamental, signo y planeta describen la misma persona interna desde dos ángulos: el signo muestra el estilo y el planeta la función psicológica.`}</p>
          </section>

          <section class="ficha-section">
            <div class="ficha-kicker">LECTURA</div>
            <h2>Problema · Camino · Resultado</h2>
            <div class="reading-grid">
              <div class="reading-card"><span>Problema</span><p>${esc(c.problem)}</p></div>
              <div class="reading-card"><span>Camino</span><p>${esc(c.way)}</p></div>
              <div class="reading-card"><span>Resultado</span><p>${esc(c.result)}</p></div>
            </div>
          </section>

          <div class="ficha-nav"><a class="secondary" href="ficha.html?id=${encodeURIComponent(prev.id)}&v=19">← ${esc(prev.title)}</a><a class="secondary" href="ficha.html?id=${encodeURIComponent(next.id)}&v=19">${esc(next.title)} →</a></div>
        </article>
      </div>`;
    document.getElementById('zoomCard')?.addEventListener('click',()=>{
      zoom.hidden=false;
      zoom.innerHTML=`<div class="ficha-zoom-inner"><button id="closeZoom" aria-label="Cerrar">×</button><img src="${esc(c.image)}" alt="${esc(c.title)} ampliada"></div>`;
      document.getElementById('closeZoom')?.addEventListener('click',()=>{zoom.hidden=true;zoom.innerHTML='';});
    });
    zoom.addEventListener('click',e=>{if(e.target===zoom){zoom.hidden=true;zoom.innerHTML='';}});
  }

  const id=(new URLSearchParams(location.search).get('id')||'').toLowerCase();
  const card=CARDS.find(c=>c.id===id);
  if(card) render(card);
  else root.innerHTML=`<div class="ficha-error"><div class="ficha-kicker">FICHA NO ENCONTRADA</div><h1>Esta carta no existe.</h1><p>Vuelve a la biblioteca y abre una carta de nuevo.</p><a class="primary" href="entrada.html#cards">Ir a Las 78 cartas</a></div>`;
})();
