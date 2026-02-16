const Validator = (() => {
    // Référence sécurisée à CONFIG
    const getConfig = () => {
        return window.CONFIG || {
            GAME_CONFIG: {
                MIN_NAME_LENGTH: 2,
                MAX_NAME_LENGTH: 30,
                MIN_COMPANY_LENGTH: 2,
                MAX_COMPANY_LENGTH: 40
            },
            BANKS: {
                uba: {}, ecobank: {}, boa: {}, nsia: {}, sgb: {}, bgfibank: {}
            },
            LEVELS: Array(10).fill({})
        };
    };

    return {
        validateString: (str, min = 1, max = 100) => {
            if (typeof str !== 'string') {
                return { valid: false, error: "La valeur doit être une chaîne de caractères" };
            }
            const trimmed = str.trim();
            if (trimmed.length < min) {
                return { valid: false, error: `La longueur minimale est ${min} caractères` };
            }
            if (trimmed.length > max) {
                return { valid: false, error: `La longueur maximale est ${max} caractères` };
            }
            return { valid: true, value: trimmed };
        },
        
        validateNumber: (num, min = 0, max = Infinity) => {
            const value = Number(num);
            if (isNaN(value)) {
                return { valid: false, error: "La valeur doit être un nombre" };
            }
            if (value < min) {
                return { valid: false, error: `La valeur minimale est ${min}` };
            }
            if (value > max) {
                return { valid: false, error: `La valeur maximale est ${max}` };
            }
            return { valid: true, value };
        },
        
        validateName: function(name) {
            const config = getConfig();
            const result = this.validateString(name, 
                config.GAME_CONFIG.MIN_NAME_LENGTH, 
                config.GAME_CONFIG.MAX_NAME_LENGTH);
            
            if (!result.valid) return result;
            
            // Autorise lettres, espaces, tirets, apostrophes (caractères français)
            if (!/^[a-zA-Z\s\-'àáâãäåçèéêëìíîïðòóôõöùúûüýÿ]+$/.test(result.value)) {
                return { valid: false, error: "Le nom contient des caractères non valides" };
            }
            
            return result;
        },
        
        validateCompany: function(company) {
            const config = getConfig();
            const result = this.validateString(company,
                config.GAME_CONFIG.MIN_COMPANY_LENGTH,
                config.GAME_CONFIG.MAX_COMPANY_LENGTH);
            
            if (!result.valid) return result;
            
            // Autorise lettres, chiffres, espaces, tirets, apostrophes, esperluette
            if (!/^[a-zA-Z0-9\s\-'&àáâãäåçèéêëìíîïðòóôõöùúûüýÿ]+$/.test(result.value)) {
                return { valid: false, error: "Le nom d'entreprise contient des caractères non valides" };
            }
            
            return result;
        },
        
        validateBank: (bank) => {
            const config = getConfig();
            return config.BANKS[bank] ? 
                { valid: true, value: bank } : 
                { valid: false, error: "Banque non valide" };
        },
        
        validateGameState: function(state) {
            const errors = [];
            
            if (!this.validateName(state.name).valid) {
                errors.push({ field: "name", error: "Nom invalide" });
            }
            
            if (!this.validateCompany(state.comp).valid) {
                errors.push({ field: "comp", error: "Entreprise invalide" });
            }
            
            if (!this.validateBank(state.bank).valid) {
                errors.push({ field: "bank", error: "Banque non valide" });
            }
            
            if (!this.validateNumber(state.money, 0).valid) {
                errors.push({ field: "money", error: "Argent invalide" });
            }
            
            if (!this.validateNumber(state.lvl, 1, 10).valid) {
                errors.push({ field: "lvl", error: "Niveau invalide" });
            }
            
            if (!this.validateNumber(state.clicks, 0).valid) {
                errors.push({ field: "clicks", error: "Clics invalides" });
            }
            
            if (!this.validateNumber(state.target, 1).valid) {
                errors.push({ field: "target", error: "Cible invalide" });
            }
            
            return errors.length > 0 ? 
                { valid: false, errors } : 
                { valid: true };
        },
        
        sanitizeSaveData: function(data) {
            try {
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                
                const clean = {
                    name: parsed.name || "",
                    comp: parsed.comp || "",
                    bank: parsed.bank || "uba",
                    money: Number(parsed.money) || 0,
                    lvl: Number(parsed.lvl) || 1,
                    clicks: Number(parsed.clicks) || 0,
                    target: Number(parsed.target) || 30,
                    lastClickTime: Number(parsed.lastClickTime) || 0,
                    rawCotton: Number(parsed.rawCotton) || 0,
                    levels: getConfig().LEVELS || []
                };
                
                const validation = this.validateGameState(clean);
                if (!validation.valid) {
                    if (window.ErrorHandler) {
                        ErrorHandler.handleWarning("Données invalides", validation.errors);
                    }
                    return null;
                }
                
                return clean;
            } catch (e) {
                if (window.ErrorHandler) {
                    ErrorHandler.handleError("Erreur de sanitisation", e);
                }
                return null;
            }
        }
    };
})();