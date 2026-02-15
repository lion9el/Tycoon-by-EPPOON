/* MODULE: CONFIGURATION */
const CONFIG = (() => {
    const VERSION = '1.0.0';
    const GAME_CONFIG = {
        CLICK_COOLDOWN: 50,
        MAX_ANIMATIONS: 10,
        SAVE_INTERVAL: 5000,
        SPLASH_DURATION: 17000,
        SPLASH_FADE_OUT: 2000,
        PARTICLE_COUNT: 40,
        MIN_NAME_LENGTH: 2,
        MIN_COMPANY_LENGTH: 2,
        MAX_NAME_LENGTH: 30,
        MAX_COMPANY_LENGTH: 40
    };
    const LEVELS = [
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
    ];
    const BANKS = {
        uba: { name: 'UBA', color: 'linear-gradient(135deg, #d4141c 0%, #7a0b0f 100%)', code: 'UBA' },
        ecobank: { name: 'Ecobank', color: 'linear-gradient(135deg, #00a4e4 0%, #005a80 100%)', code: 'ECO' },
        boa: { name: 'BOA', color: 'linear-gradient(135deg, #f39200 0%, #9c5d00 100%)', code: 'BOA' },
        nsia: { name: 'NSIA', color: 'linear-gradient(135deg, #00a651 0%, #005a26 100%)', code: 'NSI' },
        sgb: { name: 'SG Benin', color: 'linear-gradient(135deg, #e30613 0%, #000 100%)', code: 'SGB' },
        bgfibank: { name: 'BGFI Bank', color: 'linear-gradient(135deg, #1c2b59 0%, #0d152b 100%)', code: 'BGF' }
    };
    const ERROR_MESSAGES = {
        SAVE_FAILED: 'Impossible de sauvegarder',
        LOAD_FAILED: 'Impossible de charger',
        INVALID_NAME: 'Nom invalide',
        INVALID_COMPANY: 'Entreprise invalide'
    };
    const SUCCESS_MESSAGES = {
        LEVEL_UP: 'Niveau {level} debloque !'
    };
    const STORAGE_KEYS = {
        SAVE_DATA: 'tycoon_save',
        SETTINGS: 'tycoon_settings'
    };
    return { VERSION, GAME_CONFIG, LEVELS, BANKS, ERROR_MESSAGES, SUCCESS_MESSAGES, STORAGE_KEYS };
})();
