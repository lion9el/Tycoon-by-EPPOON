/* ========================================
   MODULE: CLICK HANDLER
   Gestion des clics et animations flottantes
   ======================================== */

const ClickHandler = (() => {

    /* Configuration */
    const CLICK_COOLDOWN = 50; // ms
    const MAX_ANIMATIONS = 10;
    
    /* Pool d'animations */
    let animationPool = [];

    /* Creer une animation flottante */
    function createFloatAnimation(x, y, amount) {
        /* Nettoyer le pool si trop d'animations */
        if (animationPool.length > MAX_ANIMATIONS) {
            const old = animationPool.shift();
            if (old && old.parentNode) {
                old.parentNode.removeChild(old);
            }
        }

        const float = document.createElement('div');
        float.className = 'float-gain';
        float.textContent = '+' + amount.toLocaleString('fr-FR');
        float.style.left = x + 'px';
        float.style.top = y + 'px';
        
        document.body.appendChild(float);
        animationPool.push(float);
        
        /* Supprimer apres l'animation */
        setTimeout(() => {
            if (float.parentNode) {
                float.parentNode.removeChild(float);
            }
            const index = animationPool.indexOf(float);
            if (index > -1) {
                animationPool.splice(index, 1);
            }
        }, 800);
    }

    /* Gerer un clic */
    function handleClick(e) {
        /* Protection anti-spam */
        const now = Date.now();
        const lastClick = GameState.get('lastClickTime');
        
        if (now - lastClick < CLICK_COOLDOWN) return;
        
        GameState.set('lastClickTime', now);

        /* Obtenir le niveau actuel */
        const current = GameState.getCurrentLevel();
        if (!current) return;

        /* Ajouter l'argent */
        const currentMoney = GameState.get('money');
        GameState.set('money', currentMoney + current.gain);
        
        /* Incrementer les clics si necessaire */
        const clicks = GameState.get('clicks');
        const target = GameState.get('target');
        
        if (clicks < target) {
            GameState.set('clicks', clicks + 1);
        }

        /* Obtenir les coordonnees du clic */
        let x, y;
        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else if (e.clientX !== undefined) {
            x = e.clientX;
            y = e.clientY;
        } else {
            x = window.innerWidth / 2;
            y = window.innerHeight / 2;
        }
        
        /* Creer l'animation */
        createFloatAnimation(x, y, current.gain);
        
        /* Mettre a jour l'UI */
        UIManager.updateAll();
    }

    /* Nettoyer toutes les animations */
    function cleanup() {
        animationPool.forEach(anim => {
            if (anim && anim.parentNode) {
                anim.parentNode.removeChild(anim);
            }
        });
        animationPool = [];
    }

    /* Interface publique */
    return {
        handleClick,
        cleanup
    };
})();
