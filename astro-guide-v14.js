(() => {
  'use strict';
  const CARDS = window.SYMBOLON_CARDS || [];
  const route = () => (location.hash || '#home').slice(1);
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const SIGNS = {
    Aries:{element:'Fuego',mode:'Cardinal',meaning:'iniciativa, impulso, separación y capacidad de comenzar'},
    Tauro:{element:'Tierra',mode:'Fijo',meaning:'valor, cuerpo, placer, estabilidad y conservación'},
    Géminis:{element:'Aire',mode:'Mutable',meaning:'curiosidad, lenguaje, intercambio y multiplicidad'},
    Cáncer:{element:'Agua',mode:'Cardinal',meaning:'protección, memoria, sensibilidad y pertenencia'},
    Leo:{element:'Fuego',mode:'Fijo',meaning:'identidad, creatividad, orgullo y expresión personal'},
    Virgo:{element:'Tierra',mode:'Mutable',meaning:'discernimiento, orden, servicio y mejora'},
    Libra:{element:'Aire',mode:'Cardinal',meaning:'vínculo, equilibrio, espejo, elección y negociación'},
    Escorpio:{element:'Agua',mode:'Fijo',meaning:'intensidad, apego, poder, crisis y transformación'},
    Sagitario:{element:'Fuego',mode:'Mutable',meaning:'sentido, visión, fe, expansión y búsqueda de verdad'},
    Capricornio:{element:'Tierra',mode:'Cardinal',meaning:'límite, estructura, responsabilidad, tiempo y autoridad'},
    Acuario:{element:'Aire',mode:'Fijo',meaning:'libertad, distancia, diferencia, innovación y ruptura de patrones'},
    Piscis:{element:'Agua',mode:'Mutable',meaning:'entrega, imaginación, empatía, disolución y apertura a lo invisible'}
  };

  const PLANETS = {
    Marte:{glyph:'♂',meaning:'acción, deseo, corte, afirmación y conflicto',visual:'círculo con flecha: úsalo como recordatorio de energía que se dirige hacia fuera'},
    Venus:{glyph:'♀',meaning:'atracción, valor, placer, belleza, vínculo y receptividad',visual:'círculo sobre una cruz: úsalo para reconocer la función de valorar, atraer y encarnar'},
    Mercurio:{glyph:'☿',meaning:'mente, lenguaje, mediación, análisis, intercambio y movimiento',visual:'creciente, círculo y cruz: una buena ancla para recordar conexión entre niveles y traducción'},
    Luna:{glyph:'☽',meaning:'emoción, memoria, cuidado, necesidad, hábito y pertenencia',visual:'la media luna recuerda ciclos, receptividad y cambio emocional'},
    Sol:{glyph:'☉',meaning:'identidad, centro, conciencia, creatividad y deseo de expresión',visual:'círculo con punto central: una ancla visual para el centro del yo'},
    Plutón:{glyph:'♇',meaning:'poder profundo, compulsión, crisis, muerte simbólica y transformación',visual:'reconócelo como glifo plutoniano; en el curso lo usamos como marcador de intensidad y transformación'},
    Júpiter:{glyph:'♃',meaning:'expansión, sentido, creencia, confianza, visión y crecimiento',visual:'el glifo de Júpiter sirve como ancla para reconocer ampliación de horizonte y significado'},
    Saturno:{glyph:'♄',meaning:'límite, realidad, responsabilidad, estructura, tiempo y maduración',visual:'el glifo de Saturno marca contención, forma, ley y aprendizaje a través del límite'},
    Urano:{glyph:'♅',meaning:'ruptura, libertad, innovación, distancia y despertar',visual:'el glifo de Urano funciona como ancla de cambio súbito, diferencia y emancipación'},
    Neptuno:{glyph:'♆',meaning:'imaginación, fusión, idealización, sensibilidad y trascendencia',visual:'su tridente es una ancla fácil para reconocer apertura, disolución y mundo imaginal'}
  };

  function signBox(glyph,name){
    const s=SIGNS[name]||{};
    return `<div class="astro-guide-box"><div class="astro-glyph">${esc(glyph||'')}</div><div><strong>${esc(name||'')}</strong><span>Signo · ${esc(s.element||'')} · ${esc(s.mode||'')}</span><p>${esc(s.meaning||'')}</p></div></div>`;
  }
  function planetBox(glyph,name){
    const p=PLANETS[name]||{};
    return `<div class="astro-guide-box"><div class="astro-glyph">${esc(glyph||p.glyph||'')}</div><div><strong>${esc(name||'')}</strong><span>Planeta / principio psicológico</span><p>${esc(p.meaning||'')}</p>${p.visual?`<small>${esc(p.visual)}</small>`:''}</div></div>`;
  }

  function sectionFor(c){
    const first=`${signBox(c.glyphA,c.signA)}${planetBox(c.planetGlyphA,c.planetA)}`;
    const second=c.signB?`${signBox(c.glyphB,c.signB)}${planetBox(c.planetGlyphB,c.planetB)}`:'';
    const combo=c.signB
      ? `Esta carta cruza dos paquetes simbólicos: <strong>${esc(c.signA)} / ${esc(c.planetA)}</strong> aporta ${esc(SIGNS[c.signA]?.meaning||'una función')}; <strong>${esc(c.signB)} / ${esc(c.planetB)}</strong> aporta ${esc(SIGNS[c.signB]?.meaning||'otra función')}. La interpretación nace de observar cómo cooperan, chocan o se bloquean dentro de la escena.`
      : `Aquí signo y planeta describen la misma persona interna desde dos ángulos: <strong>${esc(c.signA)}</strong> muestra el estilo de experiencia y <strong>${esc(c.planetA)}</strong> la función psicológica que la mueve.`;
    return `<section class="astro-guide-section">
      <div class="page-kicker">ASTROLOGÍA DE APOYO</div>
      <h2>Qué significan los símbolos de esta carta</h2>
      <p class="astro-guide-intro">No necesitas memorizar astrología completa. Aprende a reconocer qué función aporta cada glifo.</p>
      <div class="astro-guide-grid">${first}${second}</div>
      <div class="astro-combo-note">${combo}</div>
      <div class="source-note">Esta sección usa astrología psicológica general como apoyo pedagógico. Los glifos sirven para identificar las funciones presentes; no se presentan como una “traducción literal” del dibujo de cada símbolo.</div>
    </section>`;
  }

  function augmentCard(){
    const r=route(); if(!r.startsWith('card/'))return;
    const id=r.split('/')[1], c=CARDS.find(x=>x.id===id), root=document.querySelector('#app');
    if(!c||!root||root.querySelector('.astro-guide-section'))return;
    const title=root.querySelector('.detail-title'); if(!title)return;
    const wrap=document.createElement('div');wrap.innerHTML=sectionFor(c);const node=wrap.firstElementChild;
    title.after(node);
  }

  function augmentGuided(){
    const root=document.querySelector('#app'); if(!root)return;
    const stage=root.querySelector('.guided-card-stage'); if(!stage||stage.querySelector('.astro-guided'))return;
    const img=stage.querySelector('img'); if(!img)return;
    const c=CARDS.find(x=>x.title===(img.getAttribute('alt')||'')); if(!c)return;
    const box=document.createElement('div');box.className='astro-guided';
    box.innerHTML=`<strong>Glifos</strong><p>${esc(c.glyphA)} ${esc(c.signA)} · ${esc(c.planetGlyphA)} ${esc(c.planetA)}${c.signB?` &nbsp;×&nbsp; ${esc(c.glyphB)} ${esc(c.signB)} · ${esc(c.planetGlyphB)} ${esc(c.planetB)}`:''}</p><small>${esc(PLANETS[c.planetA]?.meaning||'')}${c.planetB?` + ${esc(PLANETS[c.planetB]?.meaning||'')}`:''}</small>`;
    stage.querySelector('.guided-teach-copy')?.appendChild(box);
  }

  function apply(){augmentCard();augmentGuided();}
  const obs=new MutationObserver(()=>requestAnimationFrame(apply));
  window.addEventListener('DOMContentLoaded',()=>{const root=document.querySelector('#app');if(root)obs.observe(root,{childList:true,subtree:true});apply();});
  window.addEventListener('hashchange',()=>setTimeout(apply,0));
  setTimeout(()=>{const root=document.querySelector('#app');if(root)obs.observe(root,{childList:true,subtree:true});apply();},60);
})();
