﻿/* ========================================
   MODULE: ERROR HANDLER (Le Bouclier)
   Version: 1.1 - Stable
   ======================================== */

const ErrorHandler = (() => {
    return {
        init: () => {
            console.log("🛡️ Système de protection activé.");
            const display = document.getElementById('error-display');
            if (display) display.style.display = 'none';
        },
        // Ajout de la fonction manquante demandée par export-manager.js
        handleInfo: (msg) => {
            console.info("ℹ️ INFO:", msg);
        },
        handleError: (msg, error) => {
            console.error("❌ ERREUR:", msg, error);
            const display = document.getElementById('error-display');
            if (display) {
                display.textContent = "Erreur: " + msg;
                display.style.display = 'block';
                setTimeout(() => {
                    display.style.display = 'none';
                }, 5000);
            }
        },
        handleWarning: (msg, error) => {
            console.warn("⚠️ ALERTE:", msg, error);
        },
        // FONCTION MANQUANTE AJOUTÉE - utilisée par export-manager.js et autres
        safeSync: (fn, defaultValue = null) => {
            try {
                return fn();
            } catch (e) {
                ErrorHandler.handleError("Erreur d'exécution", e);
                return defaultValue;
            }
        }
    };
})();

/* ========================================
   LOGIQUE DE LANCEMENT (MAIN)
   ======================================== */

function startGame() {
    if (typeof FormHandler !== 'undefined') FormHandler.submit();
}

function applyUpgrade() {
    if (typeof LevelManager !== 'undefined') LevelManager.upgrade();
}

function showGameIfSaved() {
    const name = GameState.get('name');
    const comp = GameState.get('comp');
    if (name && comp) {
        const game = document.getElementById('main-game');
        if (typeof UIManager !== 'undefined') UIManager.updateUserInfo();
        if (game) {
            game.style.display = 'flex';
            setTimeout(() => {
                game.style.opacity = '1';
                if (typeof UIManager !== 'undefined') UIManager.updateAll();
            }, 100);
        }
        return true;
    }
    return false;
}

window.addEventListener('load', () => {
    ErrorHandler.init();
    
   /* Initialiser les modules */
    if (typeof BuildingsManager !== 'undefined') BuildingsManager.init();
    if (typeof ExportManager !== 'undefined') ExportManager.init();
    
    // CORRECTION: On appelle init() au lieu de initTabs()
    if (typeof AdvancedUIManager !== 'undefined' && AdvancedUIManager.init) {
        AdvancedUIManager.init();
    }

    // Gestion du clic principal
    const clickArea = document.getElementById('tap-btn');
    if (clickArea && typeof ClickHandler !== 'undefined') {
        clickArea.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            ClickHandler.handleClick(e);
        });
    }
});

// Écouteur global d'erreurs unique
window.addEventListener('error', (e) => {
    if (e.error !== null) {
        console.error('Erreur système:', e.error);
    }
});