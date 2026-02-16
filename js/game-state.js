/* ========================================
   MODULE: GAME STATE
   Gestion de l'etat du jeu et sauvegarde
   ======================================== */

const GameState = (() => {
    
    /* Etat prive du jeu */
    const state = {
        name: '',
        comp: '',
        bank: 'uba',
        money: 0,
        lvl: 1,
        clicks: 0,
        target: 30,
        lastClickTime: 0,
        // AJOUT: stock de coton brut pour les transformations
        rawCotton: 0,
        levels: [
            { cost: 0, gain: 100 },
            { cost: 500, gain: 200 },
            { cost: 2000, gain: 500 },
            { cost: 5000, gain: 1000 },
            { cost: 15000, gain: 2500 },
            { cost: 40000, gain: 5000 },
            { cost: 100000, gain: 10000 },
            { cost: 250000, gain: 25000 },
            { cost: 600000, gain: 50000 },
            { cost: 1500000, gain: 100000 }
        ]
    };

    /* Configuration des banques */
    const BANKS = {
        uba: { name: 'UBA', color: 'linear-gradient(135deg, #d4141c 0%, #7a0b0f 100%)' },
        ecobank: { name: 'Ecobank', color: 'linear-gradient(135deg, #00a4e4 0%, #005a80 100%)' },
        boa: { name: 'BOA', color: 'linear-gradient(135deg, #f39200 0%, #9c5d00 100%)' },
        nsia: { name: 'NSIA', color: 'linear-gradient(135deg, #00a651 0%, #005a26 100%)' },
        sgb: { name: 'SG Benin', color: 'linear-gradient(135deg, #e30613 0%, #000 100%)' },
        bgfibank: { name: 'BGFI Bank', color: 'linear-gradient(135deg, #1c2b59 0%, #0d152b 100%)' }
    };

    /* Sauvegarder la progression */
    function save() {
        try {
            localStorage.setItem('tycoon_save', JSON.stringify(state));
            return true;
        } catch (e) {
            console.warn('Impossible de sauvegarder:', e);
            return false;
        }
    }

    /* Charger la progression */
    function load() {
        try {
            const saved = localStorage.getItem('tycoon_save');
            if (saved) {
                const data = JSON.parse(saved);
                Object.assign(state, data);
                return true;
            }
        } catch (e) {
            console.warn('Impossible de charger:', e);
        }
        return false;
    }

    /* Reinitialiser la progression */
    function reset() {
        try {
            localStorage.removeItem('tycoon_save');
            return true;
        } catch (e) {
            console.error('Erreur lors de la reinitialisation:', e);
            return false;
        }
    }

    /* Getters pour acceder a l'etat */
    function get(key) {
        return state[key];
    }

    function getAll() {
        return { ...state };
    }

    /* Setters pour modifier l'etat */
    function set(key, value) {
        state[key] = value;
    }

    function update(updates) {
        Object.assign(state, updates);
    }

    /* Obtenir les infos d'une banque */
    function getBank(bankId) {
        return BANKS[bankId] || BANKS.uba;
    }

    function getAllBanks() {
        return BANKS;
    }

    /* Obtenir le niveau actuel */
    function getCurrentLevel() {
        return state.levels[state.lvl - 1];
    }

    function getNextLevel() {
        return state.levels[state.lvl];
    }

    /* Interface publique */
    return {
        save,
        load,
        reset,
        get,
        getAll,
        set,
        update,
        getBank,
        getAllBanks,
        getCurrentLevel,
        getNextLevel
    };
})();