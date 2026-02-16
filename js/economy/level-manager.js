/* ========================================
   MODULE: LEVEL MANAGER
   Gestion des niveaux et upgrades
   ======================================== */

const LevelManager = (() => {

    /* Appliquer un upgrade */
    function upgrade() {
        const lvl = GameState.get('lvl');
        const levels = GameState.get('levels');
        
        /* Verifier si max niveau atteint */
        if (lvl >= levels.length) return false;

        const next = GameState.getNextLevel();
        const money = GameState.get('money');
        const clicks = GameState.get('clicks');
        const target = GameState.get('target');
        
        /* Verifier les conditions */
        if (money >= next.cost && clicks >= target) {
            /* Deduire le cout */
            GameState.set('money', money - next.cost);
            
            /* Monter de niveau */
            const newLevel = lvl + 1;
            GameState.set('lvl', newLevel);
            
            /* Reinitialiser les clics */
            GameState.set('clicks', 0);
            
            /* Augmenter la difficulte */
            const newTarget = 30 + (newLevel * 50);
            GameState.set('target', newTarget);
            
            /* Notification */
            UIManager.showToast('Niveau ' + newLevel + ' debloque !');
            
            /* Mettre a jour l'UI */
            UIManager.updateAll();
            
            return true;
        }
        
        return false;
    }

    /* Verifier si un upgrade est possible */
    function canUpgrade() {
        const lvl = GameState.get('lvl');
        const levels = GameState.get('levels');
        
        if (lvl >= levels.length) return false;

        const next = GameState.getNextLevel();
        const money = GameState.get('money');
        const clicks = GameState.get('clicks');
        const target = GameState.get('target');
        
        return money >= next.cost && clicks >= target;
    }

    /* Obtenir les infos du niveau actuel */
    function getCurrentInfo() {
        const lvl = GameState.get('lvl');
        const current = GameState.getCurrentLevel();
        const clicks = GameState.get('clicks');
        const target = GameState.get('target');
        
        return {
            level: lvl,
            gain: current ? current.gain : 0,
            clicks: clicks,
            target: target,
            progress: target > 0 ? (clicks / target) * 100 : 0
        };
    }

    /* Obtenir les infos du prochain niveau */
    function getNextInfo() {
        const lvl = GameState.get('lvl');
        const levels = GameState.get('levels');
        
        if (lvl >= levels.length) return null;
        
        const next = GameState.getNextLevel();
        
        return {
            level: lvl + 1,
            cost: next.cost,
            gain: next.gain
        };
    }

    /* Interface publique */
    return {
        upgrade,
        canUpgrade,
        getCurrentInfo,
        getNextInfo
    };
})();
