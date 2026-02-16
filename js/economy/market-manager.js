/* ========================================
   MODULE: MARKET MANAGER
   Prix dynamiques + événements réalistes pour le coton au Bénin 2026
   ======================================== */

const MarketManager = (() => {
    
    const BASE_PRICES = {
        seed: 50,
        fiber: 200,
        oil: 800,
        cake: 150,
        textile: 2000
    };
    
    let currentPrices = { ...BASE_PRICES };
    let globalFactor = 1.0;
    let beninBonus = 1.0;
    
    const EVENTS = [
        { name: "Subvention Gouv", effect: () => { beninBonus = 1.15; }, duration: 3, prob: 0.08, desc: "Subvention coton boostée !" },
        { name: "Chute mondiale", effect: () => { globalFactor *= 0.75; }, duration: 5, prob: 0.12, desc: "Prix coton international en baisse..." },
        { name: "Sécheresse Nord", effect: () => { beninBonus *= 0.80; }, duration: 4, prob: 0.10, desc: "Sécheresse – attention aux stocks !" },
        { name: "Boom GDIZ", effect: () => { currentPrices.textile *= 1.30; }, duration: 4, prob: 0.06, desc: "Textile premium en hausse !" }
    ];
    
    let activeEvent = null;
    let eventTimer = 0;
    
    function updateMarket() {
        globalFactor += (Math.random() - 0.5) * 0.10;
        globalFactor = Math.max(0.70, Math.min(1.40, globalFactor));
        
        if (!activeEvent && Math.random() < 0.15) {
            const possible = EVENTS.filter(e => Math.random() < e.prob);
            if (possible.length) {
                activeEvent = possible[Math.floor(Math.random() * possible.length)];
                eventTimer = activeEvent.duration;
                activeEvent.effect();
                if (typeof UIManager !== 'undefined' && UIManager.showToast) {
                    UIManager.showToast(activeEvent.name + " ! " + activeEvent.desc, 8000);
                }
            }
        }
        
        if (activeEvent) {
            eventTimer--;
            if (eventTimer <= 0) {
                beninBonus = 1.0;
                activeEvent = null;
            }
        }
        
        Object.keys(currentPrices).forEach(key => {
            currentPrices[key] = Math.floor(BASE_PRICES[key] * globalFactor * beninBonus * (1 + (Math.random() - 0.5) * 0.05));
        });
    }
    
    function getCurrentPrice(type) {
        return currentPrices[type] || BASE_PRICES[type];
    }
    
    function init() {
        setInterval(updateMarket, 60000);
        updateMarket();
        console.log("Marché dynamique activé");
    }
    
    return { init, getCurrentPrice };
})();
