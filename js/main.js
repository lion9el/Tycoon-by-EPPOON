/* ========================================
   MAIN APPLICATION
   Coordonne tous les modules
   ======================================== */

/* Fonction appelee au clic sur le bouton Demarrer */
function startGame() {
    FormHandler.submit();
}

/* Fonction appelee au clic sur le bouton Upgrade */
function applyUpgrade() {
    LevelManager.upgrade();
}

/* Fonction pour reinitialiser la progression */
function resetProgress() {
    if (confirm('Voulez-vous vraiment reinitialiser votre progression ?')) {
        if (GameState.reset()) {
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
        
        UIManager.updateUserInfo();
        
        if (game) {
            game.style.display = 'flex';
            setTimeout(() => {
                game.style.opacity = '1';
                UIManager.updateAll();
            }, 100);
        }
        return true;
    }
    return false;
}

/* Initialisation au chargement de la page */
window.addEventListener('load', () => {
    
    /* Initialiser ErrorHandler */
    ErrorHandler.init();
    
    /* Initialiser les modules */
    BuildingsManager.init();
    ExportManager.init();
    // UIManager.init(); // Commenté car pas de méthode init()
    Advanced// UIManager.init(); // Commenté car pas de méthode init()
    
    /* Charger les sauvegardes */
    const hasSave = GameState.load();
    DerivativesManager.load();
    BuildingsManager.load();
    ExportManager.load();
    
    /* Demarrer le splash screen */
    SplashModule.start(() => {
        /* Une fois le splash termine */
        if (hasSave && showGameIfSaved()) {
            /* Le jeu s'affiche directement */
        } else {
            /* Afficher le formulaire */
            FormHandler.show();
        }
    });

    /* Configurer les evenements de clic */
    const clickArea = document.getElementById('tap-btn');
    if (clickArea) {
        /* Empecher le comportement par defaut */
        clickArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
        }, { passive: false });

        /* Gerer les clics */
        clickArea.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            ClickHandler.handleClick(e);
        });
    }

    /* Sauvegarde periodique (toutes les 5 secondes) */
    setInterval(() => {
        const money = GameState.get('money');
        const lvl = GameState.get('lvl');
        
        if (money > 0 || lvl > 1) {
            GameState.save();
            DerivativesManager.save();
            BuildingsManager.save();
            ExportManager.save();
        }
    }, 5000);
    
    /* Mettre a jour l'UI periodiquement */
    setInterval(() => {
        AdvancedUIManager.updateAll();
    }, 2000);
    
    /* Maintenance des batiments */
    setInterval(() => {
        BuildingsManager.payMaintenance();
    }, 60000);
});

/* Sauvegarder avant de quitter */
window.addEventListener('beforeunload', () => {
    GameState.save();
    DerivativesManager.save();
    BuildingsManager.save();
    ExportManager.save();
});

/* Gestion des erreurs globales */
window.addEventListener('error', (e) => {
    console.error('Erreur detectee:', e.error);
});

// Ajout du marché dynamique
MarketManager.init();







