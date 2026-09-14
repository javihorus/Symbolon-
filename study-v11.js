(() => {
  'use strict';
  const CARDS = window.SYMBOLON_CARDS || [];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const app = () => document.querySelector('#app');
  const route = () => (location.hash || '#home').slice(1);
  const KEY = 'symbolon_guided_v1';
  let session = null;

  const chunk = (arr,size) => Array.from({length:Math.ceil(arr.length/size)},(_,i)=>arr.slice(i*size,i*size+size));
  const fundamentalGroups = chunk(CARDS.slice(0,12).map(c=>c.id),3);
  const comboGroups = chunk(CARDS.slice(12,78).map(c=>c.id),3);

  const LESSONS = [
    ...fundamentalGroups.map((ids,i)=>({id:`base-${i+1}`,stage:'LAS 12 FUNDAMENTALES',title:[
      'Impulso, placer y mente','Cuidado, identidad y servicio','Vínculo, deseo y sentido','Límite, libertad y entrega'
    ][i],subtitle:`3 cartas · ${ids.map(id=>CARDS.find(c=>c.id===id)?.title).join(' · ')}`,cards:ids,kind:'cards',xp:20})),
    {id:'bridge',stage:'PUENTE',title:'La fórmula A + B',subtitle:'Aprende a pensar en dos funciones a la vez',cards:['c01','c02','c07','c08'],kind:'bridge',xp:25},
    ...comboGroups.map((ids,i)=>({id:`combo-${i+1}`,stage:'66 COMBINACIONES',title:`Combinaciones · bloque ${i+1}`,subtitle:`${ids.length} cartas · reconocer A + B antes de interpretar`,cards:ids,kind:'cards',xp:30})),
    {id:'read-1',stage:'LECTURA',title:'Una carta en contexto',subtitle:'La misma carta cambia según la pregunta',cards:['c01','c18','c43','c65'],kind:'position',xp:35},
    {id:'read-2',stage:'LECTURA',title:'Problema · Camino · Resultado',subtitle:'Aprende a adaptar la carta a su posición',cards:['c21','c34','c58','c71'],kind:'position',xp:40},
    {id:'read-3',stage:'LECTURA',title:'Tirada completa',subtitle:'Construye una narrativa entre tres cartas',cards:['c13','c47','c78'],kind:'final',xp:50}
  ];

  function load(){
    try{return {...{completed:[],xp:0,streak:0,lastStudy:'',sessions:0,perfect:0},...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return{completed:[],xp:0,streak:0,lastStudy:'',sessions:0,perfect:0}}
  }
  let progress = load();
  function save(){localStorage.setItem(KEY,JSON.stringify(progress));}
  function card(id){return CARDS.find(c=>c.id===id)}
  function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
  function sample(a,n){return shuffle(a).slice(0,n)}
  function today(){return new Date().toISOString().slice(0,10)}
  function yesterday(){const d=new Date();d.setDate(d.getDate()-1);return d.toISOString().slice(0,10)}
  function updateStreak(){const t=today();if(progress.lastStudy===t)return;if(progress.lastStudy===yesterday())progress.streak=(progress.streak||0)+1;else progress.streak=1;progress.lastStudy=t;}

  function ensureNav(){
    const nav=document.querySelector('.main-nav'); if(!nav)return;
    if(!nav.querySelector('[data-guided-nav]')){
      const b=document.createElement('button');
      b.setAttribute('data-guided-nav','1');
      b.innerHTML='◆ <span>Estudio guiado</span>';
      b.onclick=()=>location.hash='#guided';
      const course=nav.querySelector('[data-route="course"]');
      course?.after(b);
    }
    const b=nav.querySelector('[data-guided-nav]');
    b?.classList.toggle('active',route().startsWith('guided'));
  }

  function nextLessonIndex(){
    let last=-1;
    LESSONS.forEach((l,i)=>{if(progress.completed.includes(l.id))last=Math.max(last,i)});
    return Math.min(last+1,LESSONS.length-1);
  }
  function guidedHome(){
    const next=nextLessonIndex();
    const done=progress.completed.length;
    const pct=Math.round(done/LESSONS.length*100);
    let lastStage='';
    const nodes=LESSONS.map((l,i)=>{
      const completed=progress.completed.includes(l.id);
      const unlocked=i<=next || completed;
      const stageHead=l.stage!==lastStage?`<div class="guided-stage"><span>${esc(l.stage)}</span></div>`:'';
      lastStage=l.stage;
      return `${stageHead}<button class="guided-node ${completed?'done':''} ${!unlocked?'locked':''}" data-guided-lesson="${esc(l.id)}" ${!unlocked?'disabled':''}>
        <span class="guided-orb">${completed?'✓':!unlocked?'🔒':i+1}</span>
        <span class="guided-node-copy"><strong>${esc(l.title)}</strong><small>${esc(l.subtitle)}</small></span>
        <span class="guided-xp">+${l.xp} XP</span>
      </button>`;
    }).join('');
    return `<div class="content guided-home">
      <div class="page-kicker">ESTUDIO GUIADO</div>
      <h1 class="page-title">Aprende jugando,<br>pero entendiendo.</h1>
      <p class="page-lede">Lecciones cortas y progresivas. Cada nivel mezcla imagen, reconocimiento, significado y aplicación. No avanzas por leer: avanzas por demostrar que reconoces la dinámica.</p>
      <div class="guided-dashboard">
        <div><strong>${progress.streak||0}</strong><span>🔥 días de racha</span></div>
        <div><strong>${progress.xp||0}</strong><span>XP acumulados</span></div>
        <div><strong>${done}/${LESSONS.length}</strong><span>niveles completados</span></div>
        <div><strong>${pct}%</strong><span>recorrido</span></div>
      </div>
      <div class="guided-progress"><i style="width:${pct}%"></i></div>
      <div class="guided-callout"><strong>Cómo funciona.</strong> Primero ves una carta y su lógica. Después desaparece la explicación y tienes que reconocerla. Las cartas que fallas vuelven a salir en la misma sesión.</div>
      <div class="guided-path">${nodes}</div>
    </div>`;
  }

  function wrongOptions(field,c,n=3){
    return sample(CARDS.filter(x=>x.id!==c.id).map(x=>x[field]).filter(Boolean),n);
  }
  function pairLabel(c){return `${c.glyphA||''} ${c.signA||''}${c.signB?` + ${c.glyphB||''} ${c.signB}`:''}`.trim()}
  function randomPairOptions(c){
    const correct=pairLabel(c);
    const pool=sample(CARDS.filter(x=>x.id!==c.id).map(pairLabel).filter(x=>x&&x!==correct),3);
    return shuffle([correct,...pool]);
  }
  function titleOptions(c){return shuffle([c.title,...sample(CARDS.filter(x=>x.id!==c.id).map(x=>x.title),3)])}
  function shadowOptions(c){return shuffle([c.shadow,...wrongOptions('shadow',c,3)])}
  function ideaOptions(c){return shuffle([c.idea,...wrongOptions('idea',c,3)])}

  function buildSteps(lesson){
    const cs=lesson.cards.map(card).filter(Boolean);
    const steps=[];
    if(lesson.kind==='cards'){
      cs.slice(0,3).forEach(c=>steps.push({type:'teach',c}));
      cs.slice(0,3).forEach(c=>steps.push({type:'title',c}));
      const quizPool=sample(cs,Math.min(3,cs.length));
      quizPool.forEach((c,i)=>steps.push({type:i%2?'shadow':'archetype',c}));
    }else if(lesson.kind==='bridge'){
      cs.forEach(c=>steps.push({type:'teachPair',c}));
      cs.forEach(c=>steps.push({type:'archetype',c}));
    }else if(lesson.kind==='position'){
      cs.forEach((c,i)=>steps.push({type:'position',c,position:['problem','way','result'][i%3]}));
      sample(cs,2).forEach(c=>steps.push({type:'idea',c}));
    }else if(lesson.kind==='final'){
      steps.push({type:'finalIntro',cards:cs});
      cs.forEach((c,i)=>steps.push({type:'position',c,position:['problem','way','result'][i]}));
      steps.push({type:'finalThread',cards:cs});
    }
    return steps;
  }

  function startLesson(id){
    const lesson=LESSONS.find(x=>x.id===id); if(!lesson)return;
    session={lesson,steps:buildSteps(lesson),index:0,correct:0,answered:false,lastCorrect:null};
    renderSession();
  }

  function topbar(){
    const total=session.steps.length, current=Math.min(session.index+1,total);
    return `<div class="guided-lesson-top"><button data-guided-exit>×</button><div class="guided-lesson-progress"><i style="width:${Math.round(session.index/total*100)}%"></i></div><span>${current}/${total}</span></div>`;
  }
  function choices(options,correct){
    return `<div class="guided-choices">${options.map(o=>`<button data-guided-answer="${esc(o)}" data-guided-correct="${o===correct?'1':'0'}">${esc(o)}</button>`).join('')}</div>`;
  }
  function stepHtml(step){
    const c=step.c;
    if(step.type==='teach')return `<div class="guided-card-stage"><div class="guided-instruction">MIRA · RELACIONA · RECUERDA</div><img src="${c.image}" alt="${esc(c.title)}"><div class="guided-teach-copy"><div class="page-kicker">${esc(pairLabel(c))}</div><h2>${esc(c.title)}</h2><h3>${esc(c.idea)}</h3><p>${esc(c.psychology)}</p><div class="guided-mini-grid"><div><strong>Deseo</strong><span>${esc(c.desire)}</span></div><div><strong>Sombra</strong><span>${esc(c.shadow)}</span></div><div><strong>Recurso</strong><span>${esc(c.potential)}</span></div></div></div><button class="primary guided-continue" data-guided-continue>Lo tengo</button></div>`;
    if(step.type==='teachPair')return `<div class="guided-card-stage"><div class="guided-instruction">FÓRMULA A + B</div><img src="${c.image}" alt="${esc(c.title)}"><div class="guided-teach-copy"><div class="page-kicker">${esc(pairLabel(c))}</div><h2>${esc(c.title)}</h2><p><strong>A</strong> aporta una necesidad. <strong>B</strong> aporta otra. La carta nace de cómo esas dos fuerzas cooperan, se bloquean o compiten.</p><div class="guided-highlight">${esc(c.idea)}</div></div><button class="primary guided-continue" data-guided-continue>Entendido</button></div>`;
    if(step.type==='title')return `<div class="guided-question"><div class="guided-instruction">RECONOCE LA IMAGEN</div><h2>¿Qué carta es?</h2><img src="${c.image}" alt="Carta Symbolon">${choices(titleOptions(c),c.title)}</div>`;
    if(step.type==='archetype')return `<div class="guided-question"><div class="guided-instruction">RECONOCE LOS ARQUETIPOS</div><h2>¿Qué funciones forman esta carta?</h2><img src="${c.image}" alt="${esc(c.title)}">${choices(randomPairOptions(c),pairLabel(c))}</div>`;
    if(step.type==='shadow')return `<div class="guided-question"><div class="guided-instruction">SOMBRA</div><h2>${esc(c.title)}</h2><p>¿Cuál de estas frases describe mejor su sombra?</p>${choices(shadowOptions(c),c.shadow)}</div>`;
    if(step.type==='idea')return `<div class="guided-question"><div class="guided-instruction">IDEA ESENCIAL</div><h2>${esc(c.title)}</h2>${choices(ideaOptions(c),c.idea)}</div>`;
    if(step.type==='position'){
      const names={problem:'Problema',way:'Camino',result:'Resultado'};
      const correct=c[step.position];
      const options=shuffle([c.problem,c.way,c.result]);
      return `<div class="guided-question"><div class="guided-instruction">LECTURA POR POSICIÓN</div><h2>${names[step.position]}</h2><img src="${c.image}" alt="${esc(c.title)}"><h3>${esc(c.title)}</h3><p>¿Qué interpretación encaja mejor cuando aparece como <strong>${names[step.position]}</strong>?</p>${choices(options,correct)}</div>`;
    }
    if(step.type==='finalIntro')return `<div class="guided-final"><div class="guided-instruction">TIRADA COMPLETA</div><h2>Problema → Camino → Resultado</h2><div class="guided-three">${step.cards.map((x,i)=>`<div><span>${['Problema','Camino','Resultado'][i]}</span><img src="${x.image}"><strong>${esc(x.title)}</strong></div>`).join('')}</div><p>Ahora vas a interpretar cada posición por separado y después unirlas en una sola narrativa.</p><button class="primary guided-continue" data-guided-continue>Empezar lectura</button></div>`;
    if(step.type==='finalThread')return `<div class="guided-final"><div class="guided-instruction">INTEGRACIÓN</div><h2>Une las tres cartas</h2><div class="guided-three">${step.cards.map(x=>`<div><img src="${x.image}"><strong>${esc(x.title)}</strong></div>`).join('')}</div><div class="guided-thread"><strong>1.</strong> Nombra el conflicto de la primera.<br><strong>2.</strong> Explica qué movimiento pide la segunda.<br><strong>3.</strong> Describe qué integración ofrece la tercera.</div><p>Una lectura Symbolon no es sumar tres definiciones: es explicar <strong>qué cambia</strong> de una carta a la siguiente.</p><button class="primary guided-continue" data-guided-continue>Finalizar nivel</button></div>`;
    return '';
  }

  function renderSession(){
    if(!session)return;
    const root=app(); if(!root)return;
    if(session.index>=session.steps.length){finishLesson();return;}
    const step=session.steps[session.index];
    root.innerHTML=`<div class="content guided-lesson">${topbar()}<div class="guided-step">${stepHtml(step)}</div><div id="guidedFeedback"></div></div>`;
  }

  function answer(btn){
    if(!session || session.answered)return;
    session.answered=true;
    const ok=btn.dataset.guidedCorrect==='1';
    session.lastCorrect=ok;
    if(ok)session.correct++;
    const fb=document.querySelector('#guidedFeedback');
    document.querySelectorAll('[data-guided-answer]').forEach(b=>{
      b.disabled=true;
      if(b.dataset.guidedCorrect==='1')b.classList.add('correct');
      else if(b===btn)b.classList.add('wrong');
    });
    fb.innerHTML=`<div class="guided-feedback ${ok?'ok':'bad'}"><strong>${ok?'✓ Correcto':'✕ Todavía no'}</strong><span>${ok?'Has reconocido la dinámica.':'Mira la respuesta correcta y vuelve a relacionarla con la imagen.'}</span><button class="primary" data-guided-next>Continuar</button></div>`;
  }
  function nextStep(){if(!session)return;session.index++;session.answered=false;renderSession();}

  function finishLesson(){
    const l=session.lesson;
    const questionCount=session.steps.filter(s=>!['teach','teachPair','finalIntro','finalThread'].includes(s.type)).length;
    const pct=questionCount?Math.round(session.correct/questionCount*100):100;
    const passed=pct>=70;
    if(passed && !progress.completed.includes(l.id))progress.completed.push(l.id);
    if(passed){updateStreak();progress.xp=(progress.xp||0)+l.xp;progress.sessions=(progress.sessions||0)+1;if(pct===100)progress.perfect=(progress.perfect||0)+1;save();}
    const root=app();
    root.innerHTML=`<div class="content guided-result"><div class="guided-result-medal">${passed?'✦':'↻'}</div><div class="page-kicker">${passed?'NIVEL COMPLETADO':'REPASA Y PRUEBA OTRA VEZ'}</div><h1>${esc(l.title)}</h1><div class="guided-result-stats"><div><strong>${pct}%</strong><span>aciertos</span></div><div><strong>${passed?'+'+l.xp:0}</strong><span>XP</span></div><div><strong>${progress.streak||0}</strong><span>🔥 racha</span></div></div><p>${passed?'Ya puedes avanzar al siguiente nivel. Las cartas difíciles volverán a aparecer más adelante.':'Necesitas al menos un 70%. El objetivo no es acertar por suerte: es reconocer la lógica de la carta.'}</p><div class="hero-actions"><button class="primary" data-guided-home>${passed?'Continuar camino':'Volver al camino'}</button><button class="secondary" data-guided-retry="${esc(l.id)}">Repetir nivel</button></div></div>`;
    session=null;
  }

  function enhance(){
    ensureNav();
    const r=route();
    if(r==='guided'){app().innerHTML=guidedHome();}
    else if(r.startsWith('guided/lesson/')){const id=r.split('/')[2];startLesson(id);}
  }

  // Fix robusto de las cartas fundamentales V10: funciona aunque otro render sustituya los nodos.
  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-open-card]');
    if(open){e.preventDefault();e.stopPropagation();location.hash='#card/'+open.dataset.openCard;return;}
    const node=e.target.closest('[data-guided-lesson]');
    if(node&&!node.disabled){location.hash='#guided/lesson/'+node.dataset.guidedLesson;return;}
    const ans=e.target.closest('[data-guided-answer]'); if(ans){answer(ans);return;}
    if(e.target.closest('[data-guided-continue]')){nextStep();return;}
    if(e.target.closest('[data-guided-next]')){nextStep();return;}
    if(e.target.closest('[data-guided-exit]')){session=null;location.hash='#guided';return;}
    if(e.target.closest('[data-guided-home]')){location.hash='#guided';return;}
    const retry=e.target.closest('[data-guided-retry]');if(retry){location.hash='#guided/lesson/'+retry.dataset.guidedRetry;return;}
  },true);

  window.addEventListener('hashchange',()=>setTimeout(enhance,0));
  setTimeout(enhance,0);
})();
