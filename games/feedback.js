(function () {
  'use strict';

  const CONFIG_PATH = '../config.local.js';
  const FIREBASE_APP_URL = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
  const FIREBASE_DB_URL = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js';

  function loadOptionalScript(src) {
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }

  function getConfig() {
    if (window.FEEDBACK_CONFIG && window.FEEDBACK_CONFIG.firebase) return window.FEEDBACK_CONFIG;
    return null;
  }

  async function ensureFirebase() {
    if (window.firebase && window.firebase.apps && window.firebase.apps.length) return true;
    await loadOptionalScript(CONFIG_PATH);
    const cfg = getConfig();
    if (!cfg || !cfg.firebase || !cfg.firebase.apiKey) return false;
    await loadOptionalScript(FIREBASE_APP_URL);
    await loadOptionalScript(FIREBASE_DB_URL);
    if (!window.firebase || !window.firebase.apps) return false;
    if (!window.firebase.apps.length) window.firebase.initializeApp(cfg.firebase);
    return true;
  }

  function buildDrawer() {
    const fab = document.createElement('button');
    fab.className = 'feedback-fab';
    fab.type = 'button';
    fab.innerHTML = '<span>💬</span><span>Kommentar</span>';

    const submitFab = document.createElement('button');
    submitFab.className = 'feedback-fab secondary hidden';
    submitFab.type = 'button';
    submitFab.id = 'feedback-submit-inline';
    submitFab.innerHTML = '<span>📨</span><span>Senden</span>';

    const drawer = document.createElement('div');
    drawer.className = 'feedback-drawer';
    drawer.innerHTML = `
      <div class="feedback-resizer" id="feedback-resizer"></div>
      <div class="feedback-header">
        <strong>Kommentar</strong>
        <button class="feedback-close" type="button" aria-label="Schliessen">✕</button>
      </div>
      <div class="feedback-body">
        <div class="feedback-section">
          <div style="font-size:0.85rem; margin-bottom:0.4rem; color:hsl(var(--txt-muted));">Allgemeinkommentar</div>
          <textarea class="feedback-textarea" id="feedback-comment" placeholder="Allgemeine Hinweise zur Aufgabe..."></textarea>
        </div>
      </div>
      <div class="feedback-footer">
        <button class="btn primary" id="feedback-submit" type="button">Submit</button>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(submitFab);
    document.body.appendChild(drawer);

    return { fab, submitFab, drawer };
  }

  async function submitFeedback() {
    const ok = await ensureFirebase();
    if (!ok) return;
    const cfg = getConfig();
    const comment = document.getElementById('feedback-comment').value.trim();

    let meta = {};
    try {
      const id = sessionStorage.getItem('game_payload_id');
      if (id) {
        const raw = sessionStorage.getItem('game_payload_' + id);
        if (raw) {
          const payload = JSON.parse(raw);
          meta = {
            game_type: payload.game_type || payload.gameType || null,
            title: payload.title || null,
            file_id: id
          };
        }
      }
    } catch (_) { }

    const doc = {
      comment: comment,
      url: window.location.href,
      created_at: new Date().toISOString(),
      ...meta
    };

    const db = window.firebase.database();
    const ref = db.ref(cfg.collection || 'feedback');
    await ref.push(doc);
    showToast('Feedback gesendet');
  }

  function init() {
    const { fab, submitFab, drawer } = buildDrawer();
    const closeBtn = drawer.querySelector('.feedback-close');
    const submitBtn = drawer.querySelector('#feedback-submit');
    const resizer = drawer.querySelector('#feedback-resizer');

    const openDrawer = () => {
      drawer.classList.add('open');
      submitFab.classList.remove('hidden');
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      submitFab.classList.add('hidden');
    };

    fab.addEventListener('click', () => {
      if (drawer.classList.contains('open')) closeDrawer();
      else openDrawer();
    });
    closeBtn.addEventListener('click', closeDrawer);
    submitBtn.addEventListener('click', () => submitFeedback());
    submitFab.addEventListener('click', () => submitFeedback());

    let resizing = false;
    resizer.addEventListener('mousedown', () => { resizing = true; });
    window.addEventListener('mouseup', () => { resizing = false; });
    window.addEventListener('mousemove', (e) => {
      if (!resizing) return;
      const h = Math.max(160, Math.min(window.innerHeight * 0.9, window.innerHeight - e.clientY));
      drawer.style.height = `${h}px`;
    });
  }

  function showToast(message) {
    let toast = document.querySelector('.feedback-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'feedback-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
