/* ========================================
   MODULE: UI MANAGER
   Gestion de la mise a jour de l'interface
   ======================================== */

const UIManager = (() => {

    /* Mettre a jour l'affichage complet */
    function updateAll() {
        updateMoney();
        updateLevel();
        updateGain();
        updateProgress();
        updateUpgradeButton();
        updateCard();
    }

    /* Mettre a jour l'argent */
    function updateMoney() {
        const moneyEl = document.getElementById('out-money');
        if (!moneyEl) return;
        
        const money = GameState.get('money');
        moneyEl.textContent = Math.floor(money).toLocaleString('fr-FR') + ' FCFA';
    }

    /* Mettre a jour le niveau */
    function updateLevel() {
        const lvlEl = document.getElementById('out-lvl');
        if (!lvlEl) return;
        
        const lvl = GameState.get('lvl');
        const levels = GameState.get('levels');
        
        if (lvl >= levels.length) {
            lvlEl.textContent = 'MAX NIVEAU';
        } else {
            lvlEl.textContent = 'NIVEAU ' + lvl;
        }
    }

    /* Mettre a jour le gain par clic */
    function updateGain() {
        const gainEl = document.getElementById('out-gain');
        if (!gainEl) return;
        
        const current = GameState.getCurrentLevel();
        if (current) {
            gainEl.textContent = '+ ' + current.gain.toLocaleString('fr-FR') + ' FCFA';
        }
    }

    /* Mettre a jour la barre de progression */
    function updateProgress() {
        const barEl = document.getElementById('out-bar');
        if (!barEl) return;
        
        const clicks = GameState.get('clicks');
        const target = GameState.get('target');
        const lvl = GameState.get('lvl');
        const levels = GameState.get('levels');
        
        if (lvl >= levels.length) {
            barEl.style.width = '100%';
        } else {
            const progress = Math.min(100, (clicks / target) * 100);
            barEl.style.width = progress + '%';
        }
    }

    /* Mettre a jour le bouton d'upgrade */
    function updateUpgradeButton() {
        const btnEl = document.getElementById('upgrade-btn');
        const costEl = document.getElementById('out-cost');
        if (!btnEl) return;
        
        const lvl = GameState.get('lvl');
        const levels = GameState.get('levels');
        const clicks = GameState.get('clicks');
        const target = GameState.get('target');
        const money = GameState.get('money');
        
        if (lvl >= levels.length) {
            btnEl.style.display = 'none';
            return;
        }
        
        const next = GameState.getNextLevel();
        if (costEl && next) {
            costEl.textContent = next.cost.toLocaleString('fr-FR');
        }
        
        if (clicks >= target && money >= next.cost) {
            btnEl.style.display = 'block';
        } else {
            btnEl.style.display = 'none';
        }
    }

    /* Mettre a jour la carte bancaire */
    function updateCard() {
        const cardEl = document.getElementById('card-element');
        const bankNameEl = document.getElementById('out-bank-name');
        if (!cardEl) return;
        
        const bank = GameState.get('bank');
        const bankData = GameState.getBank(bank);
        
        cardEl.style.background = bankData.color;
        if (bankNameEl) {
            bankNameEl.textContent = bankData.name;
        }
    }

    /* Afficher un toast */
    function showToast(message, duration = 2000) {
        const toast = document.getElementById('success-toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    /* Afficher un message d'erreur */
    function showError(elementId) {
        const errorEl = document.getElementById(elementId);
        if (errorEl) {
            errorEl.style.display = 'block';
        }
    }

    /* Cacher un message d'erreur */
    function hideError(elementId) {
        const errorEl = document.getElementById(elementId);
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    }

    /* Mettre a jour les infos utilisateur */
    function updateUserInfo() {
        const outName = document.getElementById('out-name');
        const outComp = document.getElementById('out-comp');
        
        if (outName) outName.textContent = GameState.get('name');
        if (outComp) outComp.textContent = GameState.get('comp');
    }

    /* Interface publique */
    return {
        updateAll,
        updateMoney,
        updateLevel,
        updateGain,
        updateProgress,
        updateUpgradeButton,
        updateCard,
        showToast,
        showError,
        hideError,
        updateUserInfo
    };
})();
