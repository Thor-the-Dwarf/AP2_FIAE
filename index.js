(function () {
    'use strict';

    /**
     * ZWECK:
     * Hauptlogik für das Pauker-Tool im lokalen Offline-Modus.
     * Nutzt die 'app_index.js' für die Struktur und lädt JSONs direkt.
     */

    // --- 1. Global Setup & State ---
    const THEME_KEY = 'globalTheme_v1';
    const STATE_KEY = 'paukerAppState_v1';
    const PROGRESS_KEY = 'pauker_progress_v1';

    // UI References
    const themeToggleApp = document.getElementById('theme-toggle-app');
    const menuBtn = document.getElementById('menu-tree-btn');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const viewTitleEl = document.getElementById('view-title');
    const viewPathEl = document.getElementById('view-path');
    const viewBodyEl = document.getElementById('view-body');
    const contentEl = document.querySelector('.content');
    const contentHeader = document.getElementById('content-header');
    const treeRootEl = document.getElementById('tree-root');
    const drawerTitleEl = document.getElementById('drawer-title');
    const drawerResizer = document.getElementById('drawer-resizer');
    const treeDrawer = document.getElementById('tree-drawer');
    const searchInput = document.getElementById('tree-search');
    const autocompleteEl = document.getElementById('autocomplete');
    const filterTeilEl = document.getElementById('filter-teil');
    const filterTypEl = document.getElementById('filter-typ');
    const filterLevelEl = document.getElementById('filter-level');

    // App State
    let appState = {
        selectedId: null,
        openedIds: [],
        drawerOpen: false,
        drawerWidth: 320
    };
    let rootTree = [];
    let rootName = 'Database';
    let progressCache = loadProgressMap();
    let searchIndex = [];

    // --- 2. Theme Logic ---
    function applyTheme(theme) {
        const rootEl = document.documentElement;
        if (theme === 'light') {
            rootEl.classList.add('theme-light');
            themeToggleApp.textContent = '☀️';
        } else {
            rootEl.classList.remove('theme-light');
            themeToggleApp.textContent = '🌙';
        }

        // Update iframe if exists
        const iframe = document.querySelector('iframe.game-iframe');
        if (iframe && iframe.contentDocument) {
            if (theme === 'light') iframe.contentDocument.documentElement.classList.add('theme-light');
            else iframe.contentDocument.documentElement.classList.remove('theme-light');
        }
    }

    function initTheme() {
        let stored = localStorage.getItem(THEME_KEY);
        const initial = (stored === 'light' || stored === 'dark') ? stored : 'dark';
        applyTheme(initial);
    }

    function toggleTheme() {
        const isLight = document.documentElement.classList.contains('theme-light');
        const next = isLight ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
    }

    // --- 3. App Logic ---
    function init() {
        loadAppState();
        initTheme();

        // Event Listeners
        themeToggleApp.addEventListener('click', toggleTheme);
        menuBtn.onclick = toggleDrawer;
        drawerBackdrop.onclick = () => setDrawer(false);

        initResizer();
        applyDrawerState();
        initLocalApp();
        initProgressListener();
        initSearchUi();
        initFilterUi();
    }

    function loadAppState() {
        try {
            const raw = localStorage.getItem(STATE_KEY);
            if (raw) Object.assign(appState, JSON.parse(raw));
        } catch (_) { }
    }

    function saveAppState() {
        localStorage.setItem(STATE_KEY, JSON.stringify(appState));
    }

    function toggleDrawer() {
        setDrawer(!appState.drawerOpen);
    }

    function setDrawer(isOpen) {
        appState.drawerOpen = isOpen;
        saveAppState();
        applyDrawerState();
    }

    function applyDrawerState() {
        if (appState.drawerWidth) {
            treeDrawer.style.setProperty('--drawer-width', appState.drawerWidth + 'px');
        }

        if (appState.drawerOpen) {
            document.getElementById('app-view').classList.add('tree-open');
            menuBtn.classList.add('active');
            drawerBackdrop.classList.add('active');
        } else {
            document.getElementById('app-view').classList.remove('tree-open');
            menuBtn.classList.remove('active');
            drawerBackdrop.classList.remove('active');
        }
    }

    function initResizer() {
        if (!drawerResizer) return;
        let isResizing = false;

        drawerResizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            drawerResizer.classList.add('resizing');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            let newWidth = e.clientX;
            if (newWidth < 200) newWidth = 200;
            if (newWidth > window.innerWidth * 0.8) newWidth = window.innerWidth * 0.8;
            appState.drawerWidth = newWidth;
            treeDrawer.style.setProperty('--drawer-width', newWidth + 'px');
        });

        window.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                drawerResizer.classList.remove('resizing');
                saveAppState();
            }
        });
    }

    async function initLocalApp() {
        // Zuerst im Cache (localStorage) nach einem dynamisch erstellten Index suchen
        const cachedIndex = localStorage.getItem('pauker_remote_index_v1');
        if (cachedIndex) {
            try {
                rootTree = JSON.parse(cachedIndex);
            } catch (e) {
                rootTree = window.DATABASE_INDEX || [];
            }
        } else {
            rootTree = window.DATABASE_INDEX || [];
        }

        drawerTitleEl.textContent = rootName;

        treeRootEl.innerHTML = '';
        buildTreeHelper(treeRootEl, rootTree, 0);
        refreshProgressLabels();
        searchIndex = buildSearchIndex(rootTree);

        showOverviewMessage('Bitte wähle eine Datei aus dem Menü.');

        applySelectedCss();

        // Restore last selected
        if (appState.selectedId) {
            const node = findNode(rootTree, appState.selectedId);
            if (node) selectNode(node.id);
        }
    }

    function showOverviewMessage(message) {
        viewTitleEl.textContent = 'Bereit';
        viewPathEl.textContent = rootName;
        viewBodyEl.innerHTML = `<p style="padding:2rem; color:hsl(var(--txt-muted))">${message}</p>`;
        contentHeader.classList.remove('hidden');
        contentEl.classList.remove('full-screen');
        viewBodyEl.classList.remove('iframe-container');
        viewBodyEl.classList.add('card');
    }

    window.goToOverview = function () {
        appState.selectedId = null;
        saveAppState();
        applySelectedCss();
        showOverviewMessage('Bitte wähle eine Datei aus dem Menü.');
    };

    // --- 3a. Search Index (Logic only, UI comes later) ---
    function buildSearchIndex(nodes, path = []) {
        const index = [];
        nodes.forEach(node => {
            const currentPath = [...path, node.name];
            if (node.isFolder && node.children) {
                index.push(...buildSearchIndex(node.children, currentPath));
                return;
            }
            if (!node.isFolder) {
                const title = (node.name || '').replace(/\.[^.]+$/, '');
                const entry = {
                    id: node.id,
                    title: title,
                    path: currentPath.join(' / '),
                    kind: node.kind || ''
                };
                entry.tokens = tokenizeForSearch([entry.title, entry.path, entry.id]);
                index.push(entry);
            }
        });
        return index;
    }

    function tokenizeForSearch(values) {
        const joined = values.filter(Boolean).join(' ').toLowerCase();
        return joined
            .replace(/[^a-z0-9äöüß\- ]/gi, ' ')
            .split(/\s+/)
            .filter(Boolean);
    }

    function searchEntries(query, limit = 20) {
        const q = (query || '').trim().toLowerCase();
        if (!q) return [];
        const qTokens = tokenizeForSearch([q]);
        const results = [];
        for (const entry of searchIndex) {
            let score = 0;
            for (const t of qTokens) {
                if (entry.title.toLowerCase().includes(t)) score += 3;
                if (entry.path.toLowerCase().includes(t)) score += 2;
                if (entry.id.toLowerCase().includes(t)) score += 1;
            }
            if (score > 0) results.push({ entry, score });
        }
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, limit).map(r => r.entry);
    }

    function initSearchUi() {
        if (!searchInput || !autocompleteEl) return;

        let activeIndex = -1;
        let currentResults = [];

        const hide = () => {
            autocompleteEl.classList.add('hidden');
            autocompleteEl.innerHTML = '';
            activeIndex = -1;
            currentResults = [];
        };

        const showResults = (results) => {
            if (!results.length) {
                hide();
                return;
            }
            currentResults = results;
            autocompleteEl.innerHTML = results.map((r, idx) => `
                <div class="autocomplete-item" data-idx="${idx}" role="option" tabindex="0">
                    <div class="autocomplete-title">${r.title}</div>
                    <div class="autocomplete-path">${r.path}</div>
                </div>
            `).join('');
            autocompleteEl.classList.remove('hidden');
        };

        const pickActive = (idx) => {
            const items = autocompleteEl.querySelectorAll('.autocomplete-item');
            items.forEach(i => i.classList.remove('is-active'));
            if (idx >= 0 && idx < items.length) {
                items[idx].classList.add('is-active');
                items[idx].focus();
            }
        };

        const openEntry = (entry) => {
            if (!entry) return;
            selectNode(entry.id);
            hide();
        };

        searchInput.addEventListener('input', (e) => {
            const q = e.target.value;
            const results = searchEntries(q, 10);
            showResults(results);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (autocompleteEl.classList.contains('hidden')) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = Math.min(activeIndex + 1, currentResults.length - 1);
                pickActive(activeIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = Math.max(activeIndex - 1, 0);
                pickActive(activeIndex);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const entry = currentResults[activeIndex] || currentResults[0];
                openEntry(entry);
            } else if (e.key === 'Escape') {
                hide();
            }
        });

        autocompleteEl.addEventListener('click', (e) => {
            const item = e.target.closest('.autocomplete-item');
            if (!item) return;
            const idx = Number(item.dataset.idx);
            openEntry(currentResults[idx]);
        });

        autocompleteEl.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            const item = e.target.closest('.autocomplete-item');
            if (!item) return;
            const idx = Number(item.dataset.idx);
            openEntry(currentResults[idx]);
        });

        document.addEventListener('click', (e) => {
            if (e.target === searchInput || autocompleteEl.contains(e.target)) return;
            hide();
        });
    }

    // --- 3b. Filter UI (Teil/Spieltyp) ---
    function initFilterUi() {
        if (!filterTeilEl || !filterTypEl || !filterLevelEl) return;

        const bindGroup = (groupEl) => {
            groupEl.querySelectorAll('.filter-chip').forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.classList.toggle('is-active');
                    btn.setAttribute('aria-pressed', btn.classList.contains('is-active') ? 'true' : 'false');
                    applyFilters();
                });
            });
        };

        bindGroup(filterTeilEl);
        bindGroup(filterTypEl);
        bindGroup(filterLevelEl);
    }

    function getActiveFilterValues(groupEl) {
        if (!groupEl) return [];
        return Array.from(groupEl.querySelectorAll('.filter-chip.is-active'))
            .map(btn => btn.textContent.trim().toLowerCase());
    }

    function applyFilters() {
        const teilFilters = getActiveFilterValues(filterTeilEl);
        const typFilters = getActiveFilterValues(filterTypEl);
        const levelFilters = getActiveFilterValues(filterLevelEl);
        const hasAnyFilter = teilFilters.length || typFilters.length || levelFilters.length;

        const nodes = Array.from(document.querySelectorAll('.tree-node'));

        // First pass: hide/show leaf nodes
        nodes.forEach(nodeEl => {
            const isFolder = nodeEl.dataset.isFolder === '1';
            const kind = nodeEl.dataset.kind;

            if (isFolder) {
                nodeEl.classList.remove('is-filtered');
                return;
            }

            if (!hasAnyFilter) {
                nodeEl.classList.remove('is-filtered');
                return;
            }

            if (kind !== 'json') {
                nodeEl.classList.add('is-filtered');
                return;
            }

            const teil = (nodeEl.dataset.teil || '').toLowerCase();
            const typ = (nodeEl.dataset.typ || '').toLowerCase();
            const level = (nodeEl.dataset.level || 'unbekannt').toLowerCase();

            const teilOk = !teilFilters.length || teilFilters.includes(teil);
            const typOk = !typFilters.length || typFilters.includes(typ);
            const levelOk = !levelFilters.length || levelFilters.includes(level);

            nodeEl.classList.toggle('is-filtered', !(teilOk && typOk && levelOk));
        });

        // Second pass: hide folders without visible children
        const reversed = nodes.slice().reverse();
        reversed.forEach(nodeEl => {
            const isFolder = nodeEl.dataset.isFolder === '1';
            if (!isFolder) return;

            if (!hasAnyFilter) {
                nodeEl.classList.remove('is-filtered');
                return;
            }

            const children = nodeEl.querySelectorAll('.tree-children .tree-node');
            const hasVisibleChild = Array.from(children).some(child => !child.classList.contains('is-filtered'));
            nodeEl.classList.toggle('is-filtered', !hasVisibleChild);
            if (hasVisibleChild) {
                nodeEl.classList.remove('tree-node--collapsed');
                const btn = nodeEl.querySelector('.tree-toggle');
                if (btn) btn.textContent = '▾';
            }
        });
    }

    function inferTeilFromId(id) {
        if (!id) return '';
        const lower = id.toLowerCase();
        if (lower.includes('teil01')) return 'teil01';
        if (lower.includes('teil02')) return 'teil02';
        if (lower.includes('teil03')) return 'teil03';
        return '';
    }

    function inferSpieltypFromId(id) {
        if (!id) return '';
        const lower = id.toLowerCase();
        if (lower.includes('ap2qq')) return 'quiz';
        if (lower.includes('ap2mp')) return 'matching';
        if (lower.includes('ap2eg')) return 'escape';
        if (lower.includes('ap2waw')) return 'what&why';
        if (lower.includes('ap2wbi')) return 'wer bin ich';
        return '';
    }


    function inferLevelFromId(id) {
        if (!id) return 'unbekannt';
        const lower = id.toLowerCase();
        if (lower.includes('ap2eg')) return 'schwer';
        if (lower.includes('ap2mp')) return 'mittel';
        if (lower.includes('ap2qq') || lower.includes('ap2waw') || lower.includes('ap2wbi')) return 'leicht';
        return 'unbekannt';
    }

    function loadProgressMap() {
        try {
            const raw = localStorage.getItem(PROGRESS_KEY);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (_) {
            return {};
        }
    }

    function getProgressForId(id) {
        return progressCache[id] || null;
    }

    function initProgressListener() {
        window.addEventListener('storage', (e) => {
            if (e && e.key === PROGRESS_KEY) {
                progressCache = loadProgressMap();
                refreshProgressLabels();
            }
        });
    }

    function refreshProgressLabels() {
        const map = progressCache || {};
        document.querySelectorAll('.tree-node').forEach(nodeEl => {
            const kind = nodeEl.dataset.kind || '';
            const id = nodeEl.dataset.id;
            const row = nodeEl.querySelector('.tree-row');
            const label = row ? row.querySelector('.tree-label') : null;
            if (!row || !label) return;

            if (kind !== 'json') {
                const existing = row.querySelector('.tree-progress');
                if (existing) existing.remove();
                return;
            }

            const entry = map[id];
            if (!entry || typeof entry.percent !== 'number') {
                const existing = row.querySelector('.tree-progress');
                if (existing) existing.remove();
                return;
            }

            let progressEl = row.querySelector('.tree-progress');
            if (!progressEl) {
                progressEl = document.createElement('span');
                progressEl.className = 'tree-progress';
                row.insertBefore(progressEl, label);
            }
            progressEl.textContent = `${entry.percent}%`;
        });
    }

    function buildTreeHelper(container, nodes, level) {
        nodes.forEach(node => {
            const div = document.createElement('div');
            div.className = 'tree-node';
            div.dataset.id = node.id;
            div.dataset.kind = node.kind || '';
            div.dataset.isFolder = node.isFolder ? '1' : '0';
            if (!node.isFolder && node.kind === 'json') {
                div.dataset.teil = inferTeilFromId(node.id);
                div.dataset.typ = inferSpieltypFromId(node.id);
                div.dataset.level = inferLevelFromId(node.id);
            }

            const isCollapsed = !appState.openedIds.includes(node.id);
            if (isCollapsed) div.classList.add('tree-node--collapsed');

            const row = document.createElement('div');
            row.className = 'tree-row';
            row.style.setProperty('--level', level);
            row.onclick = (e) => onNodeClick(e, node);

            if (node.isFolder) {
                const btn = document.createElement('button');
                btn.className = 'tree-toggle';
                btn.textContent = isCollapsed ? '▸' : '▾';
                btn.onclick = (e) => {
                    e.stopPropagation();
                    toggleNode(div, node.id, btn);
                };
                row.appendChild(btn);
            } else {
                const sp = document.createElement('span');
                sp.className = 'tree-spacer';
                row.appendChild(sp);
            }

            const icon = document.createElement('span');
            icon.className = 'tree-icon';
            const isOpen = appState.openedIds.includes(node.id);
            icon.textContent = node.isFolder ? (isOpen ? "📂" : "📁") : (node.kind !== "json" ? "👁" : "🏋");
            row.appendChild(icon);

            if (!node.isFolder && node.kind === 'json') {
                const progress = getProgressForId(node.id);
                if (progress && typeof progress.percent === 'number') {
                    const progressEl = document.createElement('span');
                    progressEl.className = 'tree-progress';
                    progressEl.textContent = `${progress.percent}%`;
                    row.appendChild(progressEl);
                }
            }

            const label = document.createElement('button');
            label.className = 'tree-label';
            const cleanLabel = node.name.replace(/\.[^.]+$/, '');
            label.textContent = cleanLabel;
            label.title = cleanLabel;
            row.appendChild(label);


            div.appendChild(row);

            const childCont = document.createElement('div');
            childCont.className = 'tree-children';
            if (node.isFolder && node.children) {
                buildTreeHelper(childCont, node.children, level + 1);
            }
            div.appendChild(childCont);
            container.appendChild(div);
        });
    }

    function toggleNode(div, id, btn) {
        const idx = appState.openedIds.indexOf(id);
        if (idx >= 0) {
            appState.openedIds.splice(idx, 1);
            div.classList.add('tree-node--collapsed');
            btn.textContent = '▸';
        } else {
            appState.openedIds.push(id);
            div.classList.remove('tree-node--collapsed');
            btn.textContent = '▾';
        }
        saveAppState();
        const icon = div.querySelector('.tree-icon');
        const node = findNode(rootTree, id);
        if (icon && node && node.isFolder) {
            icon.textContent = appState.openedIds.includes(id) ? '📂' : '📁';
        }
    }

    function onNodeClick(e, node) {
        if (node.isFolder) {
            const div = document.querySelector(`.tree-node[data-id="${node.id}"]`);
            if (div) {
                const btn = div.querySelector('.tree-toggle');
                toggleNode(div, node.id, btn);
            }
            return;
        }

        // Dateien auswählen
        selectNode(node.id);

        // PDFs und Dokumente zusätzlich direkt im neuen Tab öffnen
        if (node.kind === 'pdf' || node.kind === 'pptx') {
            window.open(node.id, '_blank');
        }
    }

    function selectNode(id) {
        appState.selectedId = id;
        saveAppState();
        applySelectedCss();
        renderViewForId(id);
    }

    function applySelectedCss() {
        document.querySelectorAll('.tree-node').forEach(n => {
            if (n.dataset.id === appState.selectedId) n.classList.add('tree-node--selected');
            else n.classList.remove('tree-node--selected');
        });
    }

    function findNode(nodes, id) {
        for (const n of nodes) {
            if (n.id === id) return n;
            if (n.children) {
                const f = findNode(n.children, id);
                if (f) return f;
            }
        }
        return null;
    }

    function findPath(nodes, id, path = []) {
        for (const n of nodes) {
            const sub = [...path, n.name];
            if (n.id === id) return sub;
            if (n.children) {
                const f = findPath(n.children, id, sub);
                if (f) return f;
            }
        }
        return null;
    }

    async function renderViewForId(id) {
        const node = findNode(rootTree, id);
        if (!node) return;

        viewTitleEl.textContent = node.name;
        const p = findPath(rootTree, id) || [node.name];
        viewPathEl.textContent = p.join(' / ');

        if (node.isFolder) {
            contentHeader.classList.remove('hidden');
            contentEl.classList.remove('full-screen');
            viewBodyEl.classList.remove('iframe-container');
            viewBodyEl.classList.add('card');
            const list = (node.children || []).map(c => `<li>${c.name}</li>`).join('');
            viewBodyEl.innerHTML = `<h3>Inhalt:</h3><ul>${list || '<li>Leer</li>'}</ul>`;
        } else {
            if (node.kind === 'json') {
                contentHeader.classList.add('hidden');
                contentEl.classList.add('full-screen');
                viewBodyEl.innerHTML = '';
                viewBodyEl.classList.remove('card');
                viewBodyEl.classList.add('iframe-container');

                // Falls die Daten fehlen (dynamischer Index), müssen wir sie nachladen
                if (!node.data) {
                    viewBodyEl.innerHTML = '';
                    try {
                        const resp = await fetch(node.id);
                        if (!resp.ok) throw new Error("Datei nicht gefunden.");
                        node.data = await resp.json();
                    } catch (e) {
                        const isFile = window.location.protocol === 'file:';
                        const help = isFile
                            ? 'Du hast die Datei per file:// geöffnet. Der Browser blockiert lokale Fetches. Öffne die Seite über http:// oder starte Chrome mit --allow-file-access-from-files.'
                            : 'Bitte versuche es erneut.';
                        viewBodyEl.innerHTML = `
                            <div style="padding:2rem;">
                                <h2 style="margin-top:0; color:hsl(var(--error));">Spieldaten konnten nicht geladen werden</h2>
                                <p style="color:hsl(var(--txt-muted));">
                                    ${e.message} ${help}
                                </p>
                            </div>
                        `;
                        return;
                    }
                }

                if (node.data) {
                    sessionStorage.setItem('game_payload_' + node.id, JSON.stringify(node.data));
                }
                loadGame(node);
            } else if (node.kind === 'pdf') {
                contentHeader.classList.remove('hidden');
                contentEl.classList.remove('full-screen');
                viewBodyEl.classList.remove('iframe-container');
                viewBodyEl.classList.add('card');
                viewBodyEl.innerHTML = `
                    <div style="padding: 2rem; text-align: center;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">📄</div>
                        <h2>PDF Dokument</h2>
                        <p style="color: hsl(var(--txt-muted)); margin-bottom: 2rem;">
                            Die Datei <strong>${node.name}</strong> wurde in einem neuen Tab geöffnet.
                        </p>
                        <button class="btn primary" onclick="window.open('${node.id}', '_blank')">
                            Datei erneut öffnen
                        </button>
                    </div>
                `;
            } else {
                contentHeader.classList.remove('hidden');
                contentEl.classList.remove('full-screen');
                viewBodyEl.classList.remove('iframe-container');
                viewBodyEl.classList.add('card');
                viewBodyEl.innerHTML = `
                    <div style="padding: 2rem; text-align: center;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">📂</div>
                        <h2>Dokument</h2>
                        <p style="color: hsl(var(--txt-muted)); margin-bottom: 2rem;">
                            Datei: <strong>${node.name}</strong>
                        </p>
                        <button class="btn primary" onclick="window.open('${node.id}', '_blank')">
                            Herunterladen / Öffnen
                        </button>
                    </div>
                `;
            }
        }
    }

    function loadGame(node) {
        const iframe = document.createElement('iframe');
        iframe.className = 'game-iframe';
        // Detect base path for GitHub Pages vs local
        const basePath = window.location.pathname.includes('.html')
            ? window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1)
            : window.location.pathname;
        iframe.src = `${basePath}games/game_loader.html?file=${encodeURIComponent(node.id)}`;
        viewBodyEl.appendChild(iframe);

        iframe.onload = () => {
            const isLight = document.documentElement.classList.contains('theme-light');
            if (isLight) iframe.contentDocument.documentElement.classList.add('theme-light');
        };
    }

    // --- 4. Globale Hilfsfunktionen & Remote Indexing ---

    // Wird vom "Cache leeren" Button aufgerufen
    window.clearDriveCache = async function () {
        const isGithub = window.location.href.includes('github.io');

        let msg = 'Möchtest du den Cache leeren?';
        if (isGithub) msg += '\n\nHINWEIS: Auf GitHub Pages wird zusätzlich versucht, neue Dateien im "database"-Ordner direkt zu finden.';

        if (!confirm(msg)) return;

        localStorage.removeItem(STATE_KEY);
        sessionStorage.clear();

        if (isGithub) {
            await rebuildIndexFromGithub();
        } else {
            localStorage.removeItem('pauker_remote_index_v1');
            window.location.reload();
        }
    };

    /**
     * ZWECK: Scannt den 'database'-Ordner direkt über die GitHub API,
     * damit neue Dateien ohne 'update_index.js' sofort erscheinen.
     */
    async function rebuildIndexFromGithub() {
        const url = window.location.href;
        // Erwarte: https://owner.github.io/repo/
        const match = url.match(/https?:\/\/([^.]+)\.github\.io\/([^/?#]+)/);
        if (!match) {
            alert("URL-Format nicht erkannt. Nutze manuelles Update.");
            window.location.reload();
            return;
        }

        const owner = match[1];
        const repo = match[2];

        try {
            console.log(`Starte Remote-Indexierung für ${owner}/${repo}...`);
            const api = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
            const resp = await fetch(api);
            if (!resp.ok) throw new Error(`GitHub API Fehler: ${resp.status}`);

            const data = await resp.json();
            if (!data.tree) throw new Error("Keine Baum-Daten erhalten.");

            // Filtere alles in 'database/'
            const rawNodes = data.tree.filter(n => n.path.startsWith('database/') && n.path !== 'database');
            const tree = buildTreeFromFlatList(rawNodes);

            localStorage.setItem('pauker_remote_index_v1', JSON.stringify(tree));
            alert("Index erfolgreich von GitHub aktualisiert!");
            window.location.reload();
        } catch (err) {
            alert("Remote-Update fehlgeschlagen (evtl. API-Limit überschritten?): " + err.message);
            window.location.reload();
        }
    }

    /**
     * Hilfsfunktion: Baut aus der flachen Git-Liste einen hierarchischen Baum
     */
    function buildTreeFromFlatList(list) {
        const root = [];
        const map = { 'database': { children: root } };

        list.forEach(n => {
            const parts = n.path.split('/');
            let currentPath = '';

            parts.forEach((part, i) => {
                const parentPath = currentPath;
                currentPath = currentPath ? `${currentPath}/${part}` : part;

                if (!map[currentPath]) {
                    const isFolder = (n.type === 'tree') || (i < parts.length - 1);
                    const node = {
                        id: currentPath,
                        name: part,
                        isFolder: isFolder
                    };

                    if (isFolder) {
                        node.children = [];
                    } else {
                        const ext = part.split('.').pop().toLowerCase();
                        if (ext === 'json') node.kind = 'json';
                        else if (ext === 'pdf') node.kind = 'pdf';
                        else if (ext === 'pptx' || ext === 'ppt') node.kind = 'pptx';
                    }

                    map[currentPath] = node;
                    if (map[parentPath]) {
                        map[parentPath].children.push(node);
                    }
                }
            });
        });
        return root;
    }

    // Initialize
    init();

})();
