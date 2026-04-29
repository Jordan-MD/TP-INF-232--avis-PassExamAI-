// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const API_BASE = window.location.origin === 'null' || window.location.protocol === 'file:' 
  ? 'http://127.0.0.1:8000' 
  : '';

// ═══════════════════════════════════════════════════════════════
// DATA SETS
// ═══════════════════════════════════════════════════════════════
const FACULTIES_DATA = {
  "Faculté des Sciences": ["Informatique", "Mathématiques", "Physique", "Chimie", "Biosciences", "Sciences de la Terre"],
  "Faculté des Lettres": ["Langues", "Lettres Modernes", "Histoire", "Géographie", "Philosophie", "Sociologie"],
  "Sciences de l'Éducation": ["Pédagogie", "Administration Scolaire", "Conseil d'Orientation"],
  "École Normale Supérieure": ["Maths-SVT", "Lettres", "Sciences Humaines"],
  "Polytechnique": ["Génie Civil", "Génie Informatique", "Génie Électrique", "Génie Mécanique", "Génie Télécom"]
};

// ═══════════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════════
const TRANSLATIONS = {
  fr: {
    logo:"UY1 / Enquête IA", stepOf:"Question", of:"sur",
    start:"Commencer l'enquête →", next:"Suivant →", back:"← Retour",
    submit:"Valider et Envoyer ✓", continue:"Continuer →",
    sending:"Transmission en cours...", retry:"Erreur — Réessayer ?",
    required:"Cette question est essentielle pour l'étude, merci d'y répondre.",
    academicStudy:"📊 Étude académique (INF 232)",
    consentTitle:"L'IA dans l'enseignement supérieur —", consentAccent:"votre expérience nous intéresse.",
    minutes:"~5-7 minutes", anonymous:"100% Anonyme", numQuestions:"22 questions",
    consentText:"<strong>Objectif :</strong> Collecter des données pour une analyse descriptive sur l'impact des outils d'IA (ChatGPT, etc.) à l'Université de Yaoundé I. <br><strong>Confidentialité :</strong> Vos réponses sont traitées de manière agrégée et strictement anonyme.",
    tyTitle:"Merci pour votre précieuse contribution !",
    tyText:"Vos données ont été enregistrées avec succès. Elles vont maintenant alimenter l'analyse descriptive en temps réel sur notre tableau de bord.",
    tyDashboard:"Accéder au Dashboard d'Analyse →",
    sections:{S0:"Profil Académique",S1:"Perception & Attitudes",S2:"Pratiques & Éducation",S3:"Validation PassExamAI"},
    filiereLabel: "Dans quelle filière es-tu inscrit ?",
    filierePlaceholder: "Sélectionnez d'abord votre faculté"
  }
};

// ═══════════════════════════════════════════════════════════════
// QUESTIONS SETUP
// ═══════════════════════════════════════════════════════════════
const lang = 'fr'; // On force le français comme demandé
const T = TRANSLATIONS[lang];

const QUESTIONS_BASE = [
  // SECTION 0 : PROFIL
  {section:"S0",id:"niveau_etudes",type:"radio",num:"Q1",label: "À quel niveau d'études es-tu actuellement inscrit à l'Université ?",options:["Licence 1","Licence 2","Licence 3","Master 1","Master 2","Doctorat","Autre"]},
  {section:"S0",id:"faculte",type:"radio",num:"Q2",label: "De quelle faculté ou école dépends-tu ?",options:Object.keys(FACULTIES_DATA)},
  {section:"S0",id:"filiere",type:"radio",num:"Q2b",label: "Quelle est ta filière d'études spécifique ?", options:[]}, 
  {section:"S0",id:"genre",type:"radio",num:"Q3",cols:2,label: "Quel est ton genre ?",options:["Homme","Femme"]},
  {section:"S0",id:"utilise_ia",type:"radio",num:"Q4",cols:2,label: "As-tu déjà utilisé un outil basé sur l'Intelligence Artificielle (IA) dans ta vie quotidienne ou académique ?",options:["Oui","Non"]},
  {section:"S0",id:"outils_ia",type:"checkbox",num:"Q5",cols:2,optional:true,label: "Parmi ces outils, lesquels connais-tu ou utilises-tu ?",hint:"Sélectionne tout ce qui s'applique",options:["ChatGPT (OpenAI)","Gemini (Google)","Claude (Anthropic)","GitHub Copilot (Code)","Midjourney / DALL-E (Images)","Autre outil spécialisé","Aucun"]},
  {section:"S0",id:"contextes_ia",type:"checkbox",num:"Q5b",max:2,optional:true,label: "Dans quels contextes principaux fais-tu appel à l'IA ?",options:[{label:"Études & Révisions",emoji:"📚"},{label:"Productivité (Emails, Planning)",emoji:"⚙️"},{label:"Recherche documentaire",emoji:"🔍"},{label:"Loisirs & Création",emoji:"🎨"},{label:"Programmation / Code",emoji:"💻"}]},
  
  // SECTION 1 : PERCEPTION
  {section:"S1",id:"niveau_connaissance_ia",type:"likert",num:"Q6",label: "Comment auto-évalues-tu ton niveau de connaissance globale sur le fonctionnement de l'IA ?",likertLabels:["Nul","Très faible","Moyen","Bon","Expert"]},
  {section:"S1",id:"ia_opportunite",type:"likert",num:"Q7",label: "Dans quelle mesure penses-tu que l'IA représente une opportunité majeure pour l'avenir de l'éducation ?",likertLabels:["Pas du tout","Faiblement","Neutre","Favorable","Totalement"]},
  {section:"S1",id:"ia_menace_emploi",type:"likert",num:"Q8",label: "Es-tu inquiet que l'IA puisse remplacer certains métiers ou menacer ton futur emploi ?",likertLabels:["Pas inquiet","Peu inquiet","Neutre","Inquiet","Très inquiet"]},
  {section:"S1",id:"confiance_ia",type:"likert",num:"Q9",label: "Quel est ton degré de confiance envers les informations générées par une Intelligence Artificielle ?",likertLabels:["Nulle","Faible","Moyenne","Grande","Totale"]},
  {section:"S1",id:"dangers_ia",type:"checkbox",num:"Q10",optional:true,label: "Quels sont les dangers liés à l'IA qui te préoccupent le plus ?",options:["Atteinte à la vie privée","Perte d'emplois","Désinformation (Fake news)","Dépendance intellectuelle","Biais algorithmiques"]},
  
  // SECTION 2 : ÉDUCATION
  {section:"S2",id:"frequence_ia_etudes",type:"radio",num:"Q11",label: "À quelle fréquence utilises-tu l'IA pour tes travaux universitaires (devoirs, révisions) ?",options:["Jamais","Rarement (1 fois/mois)","Parfois (1 fois/semaine)","Souvent (plusieurs fois/semaine)","Quotidiennement"]},
  {section:"S2",id:"usage_ia_etudes",type:"checkbox",num:"Q12",optional:true,label: "Plus précisément, pour quelles tâches académiques utilises-tu l'IA ?",options:["Résumer des longs textes","Expliquer des concepts complexes","Générer des exercices d'entraînement","Aide à la rédaction de rapports","Aide à la programmation (code)"]},
  {section:"S2",id:"methode_preparation_exam",type:"checkbox",num:"Q13",label: "Quelle est ta méthode principale pour préparer tes examens actuellement ?",options:["Relire mes notes de cours","Traiter des anciens sujets (annales)","Travailler en groupe d'étude","Prendre des cours de soutien (tutorat)","Utiliser des outils d'IA","Aucune méthode structurée"]},
  {section:"S2",id:"difficulte_preparation",type:"radio",num:"Q14",label: "Quelle est ta plus grande difficulté lors de la préparation d'un examen ?",options:["Manque de méthode de travail","Manque de ressources pédagogiques","Manque de temps (mauvaise gestion)","Manque de motivation","Aucune difficulté particulière"]},
  {section:"S2",id:"ia_ameliore_reussite",type:"likert",num:"Q15",label: "Penses-tu qu'une utilisation encadrée de l'IA pourrait significativement améliorer les taux de réussite à l'UY1 ?",likertLabels:["Non","Peu probable","Peut-être","Probablement","Certainement"]},
  {section:"S2",id:"freins_ia_etudes",type:"checkbox",num:"Q16",optional:true,label: "Selon toi, quels sont les principaux freins à l'adoption de l'IA par les étudiants ?",options:["Manque de confiance technique","Coût des abonnements Premium","Problèmes de connexion Internet","Peur d'être accusé de triche","Aucun frein identifié"]},
  
  // SECTION 3 : VALIDATION
  {section:"S3",id:"_intro",type:"info",num:"CONCEPT",label: "Imagine une plateforme conçue pour accompagner les étudiants de l'UY1. Elle permet de générer des plans de révision personnalisés et des examens blancs à partir de vos propres supports de cours."},
  {section:"S3",id:"solution_repond_probleme",type:"likert",num:"Q17",label: "Dans quelle mesure penses-tu que PassExamAI répond à un réel besoin des étudiants de l'UY1 ?",likertLabels:["Inutile","Peu utile","Moyennement","Très utile","Indispensable"]},
  {section:"S3",id:"fonctionnalites_utiles",type:"checkbox",num:"Q18",optional:true,label: "Quelles fonctionnalités te semblent les plus pertinentes pour ta réussite ?",options:["Roadmap de révision automatique","Génération d'exercices corrigés","Chatbot tuteur disponible 24h/24","Simulation d'examens chronométrés","Analyse des points faibles"]},
  {section:"S3",id:"utiliserait_app",type:"radio",num:"Q19",label: "Si PassExamAI était disponible demain, quelle serait ton intention d'utilisation ?",options:["Je ne l'utiliserai pas","Je l'essayerai par curiosité","Je l'utiliserai ponctuellement","Je l'utiliserai pour chaque examen"]},
  {section:"S3",id:"format_prefere",type:"radio",num:"Q20",label: "Quel format d'application préférerais-tu utiliser ?",options:["Application Web (Navigateur)","Application Mobile (iOS/Android)","Les deux (Synchrone)"]},
  {section:"S3",id:"budget_mensuel",type:"radio",num:"Q21",label: "Quel budget mensuel serais-tu prêt à consacrer pour un accès complet à un tel service ?",options:["Uniquement si c'est gratuit","Moins de 1 000 FCFA","Entre 1 000 et 3 000 FCFA","Entre 3 000 et 5 000 FCFA","Plus de 5 000 FCFA"]},
  {section:"S3",id:"suggestions",type:"textarea",num:"Q22",optional:true,label: "As-tu des suggestions ou des remarques pour améliorer ce projet avant son lancement ?",placeholder:"Tes idées comptent..."},
];

const QUESTIONS = QUESTIONS_BASE;
const REAL_Q    = QUESTIONS.filter(q => q.type !== 'info');
const TOTAL     = REAL_Q.length;
let currentIndex = 0;
const answers    = {};

// ═══════════════════════════════════════════════════════════════
// LOGIC
// ═══════════════════════════════════════════════════════════════

function initTheme() {
  const saved = localStorage.getItem('survey-theme');
  const auto  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || auto);
}
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('survey-theme', t);
}
function toggleTheme() {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

function renderConsent() {
  document.getElementById('logo-text').textContent  = T.logo;
  document.getElementById('step-label').textContent = T.stepOf;
  document.getElementById('step-of').textContent    = T.of;

  document.getElementById('consent-screen').innerHTML = `
    <div class="consent-tag">${T.academicStudy}</div>
    <h1>${T.consentTitle}<br><em>${T.consentAccent}</em></h1>
    <div class="consent-meta">
      <span class="meta-pill"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${T.minutes}</span>
      <span class="meta-pill"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>${T.anonymous}</span>
      <span class="meta-pill"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>${T.numQuestions}</span>
    </div>
    <div class="consent-box">${T.consentText}</div>
    <button id="btn-start" class="btn btn-primary" style="width:100%;padding:16px;font-size:16px;">${T.start}</button>
  `;

  document.getElementById('btn-start').onclick = startSurvey;
  document.getElementById('theme-toggle').onclick = toggleTheme;
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}

function buildInput(q) {
  const val = answers[q.id];

  if (q.type === 'text') {
    return `<input class="custom-input" data-id="${q.id}" type="text" placeholder="${esc(q.placeholder||'')}" value="${esc(val||'')}" />`;
  }

  if (q.type === 'textarea') {
    return `<textarea class="custom-input" data-id="${q.id}" placeholder="${esc(q.placeholder||'')}">${esc(val||'')}</textarea>`;
  }

  if (q.type === 'radio') {
    const rows = q.options.map(opt => {
      const sel = val === opt ? ' selected' : '';
      return `<div class="option-card${sel}" data-value="${esc(opt)}"><span class="option-dot"></span><span class="option-text">${opt}</span></div>`;
    }).join('');
    return `<div class="options-grid ${q.cols===2?'cols-2':''}" data-input="radio" data-id="${q.id}">${rows}</div>`;
  }

  if (q.type === 'checkbox') {
    const sel = Array.isArray(val) ? val : [];
    const rows = q.options.map(opt => {
      const label = typeof opt === 'object' ? opt.label : opt;
      const emoji = typeof opt === 'object' ? opt.emoji : null;
      const isSel = sel.indexOf(label) !== -1 ? ' selected' : '';
      const checkSvg = '<svg class="check-svg" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="var(--bg)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      return `<div class="option-card${isSel}" data-value="${esc(label)}"><span class="option-check">${checkSvg}</span>${emoji ? `<span class="option-emoji">${emoji}</span>` : ''}<span class="option-text">${label}</span></div>`;
    }).join('');
    return `<div class="options-grid" data-input="checkbox" data-id="${q.id}" data-max="${q.max||99}">${rows}</div>`;
  }

  if (q.type === 'likert') {
    const labels = q.likertLabels || ['1','2','3','4','5'];
    const btns = [1,2,3,4,5].map((n, i) => {
      const sel = val === n ? ' selected' : '';
      return `<button class="likert-btn${sel}" data-value="${n}"><span class="likert-num">${n}</span><span class="likert-label-text">${labels[i]||''}</span></button>`;
    }).join('');
    return `<div class="likert-scale" data-input="likert" data-id="${q.id}">${btns}</div>`;
  }

  return '';
}

function renderQuestion(q, idx) {
  const sLabel  = T.sections[q.section] || '';
  const isFirst = idx === 0;
  const isLast  = idx === QUESTIONS.length - 1;
  
  let html = `
    <div class="section-tag">${sLabel}</div>
  `;

  if (q.type === 'info') {
    html += `<div class="info-card">${q.label.replace(/\n/g,'<br>')}</div>`;
  } else {
    html += `
      <div class="question-label"><span class="q-num">${q.num}</span>${q.label}</div>
      ${q.hint ? `<p class="hint">${q.hint}</p>` : ''}
      <div id="input-container-${q.id}">${buildInput(q)}</div>
      <p class="error-msg" id="err-${idx}">${T.required}</p>
    `;
  }

  const nextLabel = isLast ? T.submit : (q.type === 'info' ? T.continue : T.next);
  html += `
    <div class="nav-row">
      ${!isFirst ? `<button class="btn btn-ghost" onclick="goBack()">${T.back}</button>` : '<span></span>'}
      <button class="btn btn-primary" onclick="goNext(${idx})">${nextLabel}</button>
    </div>
  `;

  return html;
}

function buildAllScreens() {
  const container = document.getElementById('questions-container');
  container.innerHTML = '';
  QUESTIONS.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'question-screen';
    div.id = `qs-${idx}`;
    div.innerHTML = renderQuestion(q, idx);
    container.appendChild(div);
    bindListeners(div, q, idx);
  });
}

function bindListeners(div, q, idx) {
  const input = div.querySelector('.custom-input');
  if (input) {
    input.oninput = (e) => {
      answers[q.id] = e.target.value;
      clearError(idx);
    };
  }

  div.querySelectorAll('.option-card[data-value]').forEach(card => {
    card.onclick = () => {
      const grid = card.closest('.options-grid');
      const inputType = grid ? grid.dataset.input : (card.closest('[data-input]') ? card.closest('[data-input]').dataset.input : null);
      
      if (inputType === 'radio') {
        grid.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        answers[q.id] = card.dataset.value;
        if (q.id === 'faculte') {
          updateFiliereOptions(card.dataset.value);
        }
      } 
      else if (inputType === 'checkbox') {
        const gridBox = card.closest('.options-grid');
        const maxN = parseInt(gridBox.dataset.max, 10) || 99;
        let arr = Array.isArray(answers[q.id]) ? [...answers[q.id]] : [];
        
        if (card.classList.contains('selected')) {
          arr = arr.filter(v => v !== card.dataset.value);
          card.classList.remove('selected');
        } else {
          if (arr.length >= maxN) return;
          arr.push(card.dataset.value);
          card.classList.add('selected');
        }
        answers[q.id] = arr;
      }
      clearError(idx);
    };
  });

  div.querySelectorAll('.likert-btn').forEach(btn => {
    btn.onclick = () => {
      const scale = btn.closest('.likert-scale');
      scale.querySelectorAll('.likert-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      answers[q.id] = parseInt(btn.dataset.value, 10);
      clearError(idx);
    };
  });
}

function updateFiliereOptions(faculty) {
  const filiereIdx = QUESTIONS.findIndex(q => q.id === 'filiere');
  if (filiereIdx === -1) return;
  
  const filiereQ = QUESTIONS[filiereIdx];
  filiereQ.options = FACULTIES_DATA[faculty] || [];
  answers['filiere'] = null; 
  
  const screen = document.getElementById(`qs-${filiereIdx}`);
  if (screen) {
    const container = screen.querySelector(`#input-container-filiere`);
    if (container) {
      container.innerHTML = buildInput(filiereQ);
      bindListeners(screen, filiereQ, filiereIdx);
    }
  }
}

function isValid(q) {
  if (q.optional || q.type === 'info') return true;
  const v = answers[q.id];
  if (v === undefined || v === null) return false;
  if (typeof v === 'string' && v.trim() === '') return false;
  if (Array.isArray(v) && v.length === 0) return false;
  return true;
}

function clearError(idx) {
  const el = document.getElementById(`err-${idx}`);
  if (el) el.style.display = 'none';
}

function showError(idx) {
  const el = document.getElementById(`err-${idx}`);
  if (el) el.style.display = 'block';
}

function goNext(idx) {
  if (!isValid(QUESTIONS[idx])) { showError(idx); return; }
  clearError(idx);
  if (idx === QUESTIONS.length - 1) { submitSurvey(idx); return; }
  showScreen(idx + 1);
}

function goBack() {
  if (currentIndex > 0) showScreen(currentIndex - 1);
}

function showScreen(idx) {
  const currentScreen = document.getElementById(`qs-${currentIndex}`);
  if (currentScreen) currentScreen.classList.remove('active');
  
  currentIndex = idx;
  const nextScreen = document.getElementById(`qs-${currentIndex}`);
  if (nextScreen) nextScreen.classList.add('active');
  
  updateProgress();
  window.scrollTo({top:0, behavior:'smooth'});
}

function updateProgress() {
  const q       = QUESTIONS[currentIndex];
  const realIdx = REAL_Q.findIndex(rq => rq.id === q.id);
  const prog    = realIdx >= 0 ? ((realIdx + 1) / TOTAL * 100) : (currentIndex / QUESTIONS.length * 100);
  document.getElementById('progress-bar').style.width = prog + '%';
  document.getElementById('cur-step').textContent     = realIdx >= 0 ? realIdx + 1 : '—';
  document.getElementById('tot-steps').textContent    = TOTAL;
}

function startSurvey() {
  document.getElementById('consent-screen').style.display = 'none';
  buildAllScreens();
  currentIndex = 0;
  document.getElementById('qs-0').classList.add('active');
  updateProgress();
}

async function submitSurvey(idx) {
  const btn = document.querySelector(`#qs-${idx} .btn-primary`);
  btn.disabled = true;
  btn.textContent = T.sending;

  const payload = {
    niveau_etudes:            answers.niveau_etudes            || '',
    faculte:                  answers.faculte                  || '',
    filiere:                  answers.filiere                  || '',
    genre:                    answers.genre                    || '',
    utilise_ia:               (answers.utilise_ia==='Oui') ? 'oui' : 'non',
    outils_ia:                answers.outils_ia                || [],
    contextes_ia:             answers.contextes_ia             || [],
    niveau_connaissance_ia:   answers.niveau_connaissance_ia   ?? 1,
    ia_opportunite:           answers.ia_opportunite           ?? 1,
    ia_menace_emploi:         answers.ia_menace_emploi         ?? 1,
    confiance_ia:             answers.confiance_ia             ?? 1,
    dangers_ia:               answers.dangers_ia               || [],
    frequence_ia_etudes:      answers.frequence_ia_etudes      || '',
    usage_ia_etudes:          answers.usage_ia_etudes          || [],
    methode_preparation_exam: answers.methode_preparation_exam || [],
    difficulte_preparation:   answers.difficulte_preparation   || '',
    ia_ameliore_reussite:     answers.ia_ameliore_reussite     ?? 1,
    freins_ia_etudes:         answers.freins_ia_etudes         || [],
    solution_repond_probleme: answers.solution_repond_probleme ?? 1,
    fonctionnalites_utiles:   answers.fonctionnalites_utiles   || [],
    utiliserait_app:          answers.utiliserait_app          || '',
    format_prefere:           answers.format_prefere           || '',
    budget_mensuel:           answers.budget_mensuel           || '',
    suggestions:              answers.suggestions              || '',
  };

  try {
    const res = await fetch(`${API_BASE}/api/submit`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('API Error');

    document.getElementById('questions-container').style.display = 'none';
    document.getElementById('progress-bar-wrap').style.display   = 'none';
    document.getElementById('step-counter').style.display        = 'none';
    
    const ty = document.getElementById('thankyou-screen');
    ty.innerHTML = `
      <span class="ty-icon">🎉</span>
      <h2>${T.tyTitle}</h2>
      <p>${T.tyText}</p>
      <a href="#" id="ty-dashboard-link" class="btn btn-primary" style="display:inline-block;margin-top:24px;text-decoration:none;">${T.tyDashboard}</a>
    `;
    ty.classList.add('active');
    
    // Set dynamic link for dashboard
    const dashUrl = (window.location.protocol === 'file:' || window.location.hostname === '') ? 'dashboard.html' : '/dashboard';
    document.getElementById('ty-dashboard-link').href = dashUrl;

    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.textContent = T.retry;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderConsent();
  
  // Add direct link to dashboard in header
  const dashUrl = (window.location.protocol === 'file:' || window.location.hostname === '') ? 'dashboard.html' : '/dashboard';
  const logo = document.getElementById('logo');
  if (logo) {
    const dashLink = document.createElement('a');
    dashLink.href = dashUrl;
    dashLink.innerHTML = '<span style="margin-right:5px">📊</span> Dashboard';
    dashLink.style.cssText = 'margin-left:16px; font-size:11px; font-weight:600; font-family:var(--font-mono); color:var(--accent2); text-decoration:none; padding:4px 8px; border:1px solid var(--border); border-radius:6px; transition:0.2s; display:inline-flex; align-items:center';
    dashLink.onmouseover = () => { dashLink.style.background = 'var(--bg2)'; dashLink.style.borderColor = 'var(--accent2)'; };
    dashLink.onmouseout = () => { dashLink.style.background = 'transparent'; dashLink.style.borderColor = 'var(--border)'; };
    logo.appendChild(dashLink);
  }
});