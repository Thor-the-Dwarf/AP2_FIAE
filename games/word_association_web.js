/**
 * word_association_web.js - Assoziationsnetz (Read/Review)
 */

(function () {
    'use strict';

    class WordAssociationWeb extends GameBase {
        constructor() {
            super({
                expectedGameType: 'word_association_web',
                rootElementId: 'game-root'
            });

            this.centerWord = '';
            this.associations = [];
            this.configData = {};

            this.centerWordEl = null;
            this.gridEl = null;
            this.countEl = null;
            this.descriptionEl = null;
            this.feedbackEl = null;
            this.finishBtn = null;
            this.resetBtn = null;
        }

        onDataLoaded(data) {
            this.configData = data;

            this.centerWordEl = document.getElementById('center-word');
            this.gridEl = document.getElementById('association-grid');
            this.countEl = document.getElementById('count-label');
            this.descriptionEl = document.getElementById('game-description');
            this.feedbackEl = document.getElementById('feedback-box');
            this.finishBtn = document.getElementById('finish-btn');
            this.resetBtn = document.getElementById('reset-btn');

            if (data.title) {
                const titleEl = document.querySelector('.game-title');
                if (titleEl) titleEl.textContent = data.title;
                document.title = data.title;
            }

            if (data.topic && this.descriptionEl) {
                this.descriptionEl.textContent = data.topic;
            }

            this.centerWord = data.centerWord || data.title || 'Zentrum';
            this.associations = Array.isArray(data.associations) ? data.associations : [];

            this.render();

            if (this.finishBtn) {
                this.finishBtn.addEventListener('click', () => this.handleFinish());
            }
            if (this.resetBtn) {
                this.resetBtn.addEventListener('click', () => this.handleReset());
            }
        }

        render() {
            if (this.centerWordEl) this.centerWordEl.textContent = this.centerWord;
            if (this.countEl) this.countEl.textContent = String(this.associations.length);

            if (!this.gridEl) return;
            this.gridEl.innerHTML = '';

            this.associations.forEach((assoc) => {
                const card = document.createElement('article');
                card.className = 'association-card';

                const title = document.createElement('h3');
                title.textContent = assoc.word || 'Begriff';
                card.appendChild(title);

                const list = document.createElement('ul');
                list.className = 'association-list';

                const connections = Array.isArray(assoc.connections) ? assoc.connections : [];
                if (connections.length === 0) {
                    const empty = document.createElement('li');
                    empty.className = 'association-pill';
                    empty.textContent = 'Keine Verbindungen';
                    list.appendChild(empty);
                } else {
                    connections.forEach((conn) => {
                        const li = document.createElement('li');
                        li.className = 'association-pill';
                        li.textContent = conn;
                        list.appendChild(li);
                    });
                }

                card.appendChild(list);
                this.gridEl.appendChild(card);
            });
        }

        handleFinish() {
            this._saveProgressPercent(100, { done: true });
            if (this.feedbackEl) this.feedbackEl.textContent = 'Fortschritt gespeichert: 100%.';
        }

        handleReset() {
            this.clearProgress();
            if (this.feedbackEl) this.feedbackEl.textContent = 'Fortschritt zurueckgesetzt.';
        }
    }

    window.addEventListener('DOMContentLoaded', () => new WordAssociationWeb());
})();
