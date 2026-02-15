/* ========================================
   MODULE: SPLASH SCREEN & PARTICULES
   Gestion de l'animation d'introduction
   ======================================== */

const SplashModule = (() => {
    
    /* Initialisation des particules flottantes */
    function initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.width = p.style.height = Math.random() * 3 + 2 + 'px';
            p.style.animationDelay = Math.random() * 17 + 's';
            container.appendChild(p);
        }
    }

    /* Demarrer la sequence splash */
    function start(onComplete) {
        initParticles();

        /* Timer du splash (17s) */
        setTimeout(() => {
            const splash = document.getElementById('splash');
            
            if (splash) {
                splash.style.transition = 'opacity 2s';
                splash.style.opacity = '0';
            }
            
            setTimeout(() => {
                if (splash) splash.style.display = 'none';
                if (onComplete) onComplete();
            }, 2000);
        }, 17000);
    }

    /* Interface publique du module */
    return {
        start: start
    };
})();
