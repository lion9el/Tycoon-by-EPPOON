/* ========================================
   MAIN APPLICATION
   Coordonne tous les modules
   ======================================== */

/* Fonction appelee au clic sur le bouton Demarrer */
function startGame() {
    if (typeof FormHandler !== 'undefined') FormHandler.submit();
}

/* Fonction appelee au clic sur le bouton Upgrade */
function applyUpgrade() {
    if (typeof LevelManager !== 'undefined') LevelManager.upgrade();
}

/* Fonction pour reinitialiser la progression */
function resetProgress() {
    if (confirm('Voulez-vous vraiment reinitialiser votre progression ?')) {
        if (typeof GameState !== 'undefined' && GameState.reset()) {
            location.reload();
        }
    }
}

/* Afficher le jeu directement si sauvegarde existe */
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

/* Initialisation au chargement de la page */
window.addEventListener('load', () => {
    
    /* 1. Initialiser ErrorHandler en premier */
    if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.init();
    }
    
    /* 2. Initialiser les modules moteurs */
    if (typeof BuildingsManager !== 'undefined') BuildingsManager.init();
    if (typeof ExportManager !== 'undefined') ExportManager.init();
    if (typeof MarketManager !== 'undefined') MarketManager.init(); // Déplacé ici pour sécurité
    
    /* 3. Initialiser l'interface avancée (CORRECTIF de la ligne brisée) */
    if (typeof AdvancedUIManager !== 'undefined' && AdvancedUIManager.initTabs) {
        AdvancedUIManager.initTabs();
    }
    
    /* 4. Charger les sauvegardes */
    const hasSave = (typeof GameState !== 'undefined') ? GameState.load() : false;
    if (typeof DerivativesManager !== 'undefined') DerivativesManager.load();
    if (typeof BuildingsManager !== 'undefined') BuildingsManager.load();
    if (typeof ExportManager !== 'undefined') ExportManager.load();
    
    /* 5. Demarrer le splash screen */
    if (typeof SplashModule !== 'undefined') {
        SplashModule.start(() => {
            if (hasSave && showGameIfSaved()) {
                console.log("🎮 Session restaurée.");
            } else {
                if (typeof FormHandler !== 'undefined') FormHandler.show();
            }
        });
    }

    /* 6. Configurer la zone de clic (Coton) */
    const clickArea = document.getElementById('tap-btn');
    if (clickArea && typeof ClickHandler !== 'undefined') {
        clickArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
        }, { passive: false });

        clickArea.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            ClickHandler.handleClick(e);
        });
    }

    /* 7. Boucles automatiques */
    // Sauvegarde (5s)
    setInterval(() => {
        if (typeof GameState !== 'undefined') {
            const money = GameState.get('money');
            if (money > 0) {
                GameState.save();
                if (typeof DerivativesManager !== 'undefined') DerivativesManager.save();
                if (typeof BuildingsManager !== 'undefined') BuildingsManager.save();
                if (typeof ExportManager !== 'undefined') ExportManager.save();
            }
        }
    }, 5000);
    
    // Mise à jour UI (2s)
    setInterval(() => {
        if (typeof AdvancedUIManager !== 'undefined') AdvancedUIManager.updateAll();
    }, 2000);
    
    // Maintenance (1min)
    setInterval(() => {
        if (typeof BuildingsManager !== 'undefined') BuildingsManager.payMaintenance();
    }, 60000);
});

/* Sauvegarder avant de quitter */
window.addEventListener('beforeunload', () => {
    if (typeof GameState !== 'undefined') {
        GameState.save();
        DerivativesManager.save();
        BuildingsManager.save();
        ExportManager.save();
    }
});

/* Gestion des erreurs globales */
window.addEventListener('error', (e) => {
    if (e.error) console.error('Erreur détectée:', e.error);
});