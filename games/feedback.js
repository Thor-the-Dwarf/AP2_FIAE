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
    const cfgLoaded = await loadOptionalScript(CONFIG_PATH);
    if (!cfgLoaded) {
      // allow localStorage config
    }
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

    const backdrop = document.createElement('div');
    backdrop.className = 'feedback-backdrop';

    const drawer = document.createElement('div');
    drawer.className = 'feedback-drawer';
    drawer.innerHTML = `
      <div class="feedback-header">
        <strong>Kommentar-Mode</strong>
        <button class="feedback-close" type="button" aria-label="Schliessen">✕</button>
      </div>
      <div class="feedback-body">
        <div class="feedback-section">
          <div style="font-size:0.85rem; color:hsl(var(--txt-muted));">
            Tipp: Markiere und bearbeite Text direkt im Vorschau-Bereich. Keine Buttons funktionieren dort.
          </div>
        </div>
        <div class="feedback-section">
          <div style="font-size:0.85rem; margin-bottom:0.4rem; color:hsl(var(--txt-muted));">Tags</div>
          <div class="feedback-tags" id="feedback-tags"></div>
          <input class="feedback-input" id="feedback-tag-input" placeholder="Tag hinzufuegen und Enter druecken" />
        </div>
        <div class="feedback-section">
          <div style="font-size:0.85rem; margin-bottom:0.4rem; color:hsl(var(--txt-muted));">Allgemeinkommentar</div>
          <textarea class="feedback-textarea" id="feedback-comment" placeholder="Allgemeine Hinweise zur Aufgabe..."></textarea>
        </div>
        <div class="feedback-section feedback-preview" id="feedback-preview"></div>
      </div>
      <div class="feedback-footer">
        <button class="btn primary" id="feedback-submit" type="button">Submit</button>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(submitFab);
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    return { fab, submitFab, backdrop, drawer };
  }

  function cloneGameContent() {
    const root = document.getElementById('game-root') || document.body;
    const clone = root.cloneNode(true);

    clone.querySelectorAll('input, textarea, select').forEach(el => {
      el.setAttribute('disabled', 'true');
    });

    clone.querySelectorAll('[draggable]').forEach(el => {
      el.setAttribute('draggable', 'false');
    });

    clone.querySelectorAll('*').forEach(el => {
      if (['INPUT', 'TEXTAREA', 'SELECT', 'SCRIPT', 'STYLE'].includes(el.tagName)) return;
      const hasText = Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (hasText) {
        el.setAttribute('contenteditable', 'true');
      }
    });

    return clone;
  }

  function setupTags() {
    const tagWrap = document.getElementById('feedback-tags');
    const input = document.getElementById('feedback-tag-input');
    const tags = [];

    try {
      const id = sessionStorage.getItem('game_payload_id');
      if (id) {
        const raw = sessionStorage.getItem('game_payload_' + id);
        if (raw) {
          const payload = JSON.parse(raw);
          if (Array.isArray(payload.tags)) {
            payload.tags.forEach(t => tags.push(String(t)));
          }
        }
        if (!tags.length) {
          inferTagsFromId(id).forEach(t => tags.push(t));
        }
      }
    } catch (_) { }

    function render() {
      tagWrap.innerHTML = '';
      tags.forEach((t, idx) => {
        const chip = document.createElement('span');
        chip.className = 'feedback-tag';
        chip.innerHTML = `${t}<button type="button" aria-label="Tag entfernen">×</button>`;
        chip.querySelector('button').addEventListener('click', () => {
          tags.splice(idx, 1);
          render();
        });
        tagWrap.appendChild(chip);
      });
    }

    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      tags.push(value);
      input.value = '';
      render();
    });

    render();
    return () => tags.slice();
  }

  function inferTagsFromId(id) {
    const lower = String(id || '').toLowerCase();
    const tags = [];
    if (lower.includes('teil02')) tags.push('AP2', 'FIAE');
    if (lower.includes('teil03')) tags.push('WISO');
    if (lower.includes('qualität') || lower.includes('qualitaet')) tags.push('QS');
    if (lower.includes('bereitstellen')) tags.push('Deployment');
    if (lower.includes('test')) tags.push('Tests');
    if (lower.includes('debug') || lower.includes('fehler')) tags.push('Debug');
    return tags.slice(0, 4);
  }

  async function submitFeedback(getTags) {
    const ok = await ensureFirebase();
    if (!ok) return;
    const cfg = getConfig();
    const comment = document.getElementById('feedback-comment').value.trim();
    const preview = document.getElementById('feedback-preview');
    const editedText = preview ? preview.innerText.trim() : '';

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
      tags: getTags(),
      comment: comment,
      edited_text: editedText,
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
    const { fab, submitFab, backdrop, drawer } = buildDrawer();
    const preview = document.getElementById('feedback-preview');
    const closeBtn = drawer.querySelector('.feedback-close');
    const submitBtn = drawer.querySelector('#feedback-submit');
    const getTags = setupTags();

    const openDrawer = () => {
      preview.innerHTML = '';
      preview.appendChild(cloneGameContent());
      drawer.classList.add('open');
      backdrop.classList.add('open');
      submitFab.classList.remove('hidden');
      // no-op
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      submitFab.classList.add('hidden');
    };

    fab.addEventListener('click', () => {
      if (drawer.classList.contains('open')) closeDrawer();
      else openDrawer();
    });
    closeBtn.addEventListener('click', closeDrawer);
    submitBtn.addEventListener('click', () => submitFeedback(getTags));
    submitFab.addEventListener('click', () => submitFeedback(getTags));
    backdrop.addEventListener('click', closeDrawer);
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
