/* ========================================
   MODULE: DERIVATIVES MANAGER
   Gestion des derives du coton
   ======================================== */

const DerivativesManager = (() => {
    
    /* Types de derives */
    const DERIVATIVE_TYPES = {
        SEED: 'seed',           // Graines de coton
        FIBER: 'fiber',         // Fibre de coton
        OIL: 'oil',             // Huile de coton
        CAKE: 'cake',           // Tourteaux
        TEXTILE: 'textile'      // Textile fini
    };
    
    /* Configuration des derives */
    const DERIVATIVES = {
        seed: {
            name: 'Graines de Coton',
            baseValue: 50,      // FCFA par kg
            unlockLevel: 3,     // Niveau requis
            description: 'Matiere premiere pour l\'huile',
            color: '#8B4513'
        },
        fiber: {
            name: 'Fibre de Coton',
            baseValue: 200,     // FCFA par kg
            unlockLevel: 3,
            description: 'Base du textile',
            color: '#F5F5DC'
        },
        oil: {
            name: 'Huile de Coton',
            baseValue: 800,     // FCFA par litre
            unlockLevel: 4,
            description: 'Huile alimentaire raffinee',
            color: '#FFD700'
        },
        cake: {
            name: 'Tourteaux',
            baseValue: 150,     // FCFA par kg
            unlockLevel: 4,
            description: 'Aliment pour betail',
            color: '#8B7355'
        },
        textile: {
            name: 'Textile Made in Benin',
            baseValue: 2000,    // FCFA par metre
            unlockLevel: 5,
            description: 'Tissu premium beninois',
            color: '#4169E1'
        }
    };
    
    /* Ratios de transformation */
    const TRANSFORMATION_RATIOS = {
        /* 100kg de coton graine donnent : */
        cottonToFiberAndSeed: {
            fiber: 35,          // 35kg de fibre
            seed: 60            // 60kg de graines
        },
        /* 100kg de graines donnent : */
        seedToOilAndCake: {
            oil: 15,            // 15L d'huile
            cake: 80            // 80kg de tourteaux
        },
        /* 1kg de fibre donne : */
        fiberToTextile: {
            textile: 0.8        // 0.8m de textile
        }
    };
    
    /* Stock des derives */
    const stock = {
        seed: 0,
        fiber: 0,
        oil: 0,
        cake: 0,
        textile: 0
    };
    
    /* Historique de production */
    const productionHistory = [];
    
    /* Verifier si un derive est debloque */
    function isUnlocked(derivativeType) {
        const currentLevel = GameState.get('lvl');
        const derivative = DERIVATIVES[derivativeType];
        return derivative && currentLevel >= derivative.unlockLevel;
    }
    
    /* Obtenir les derives debloques */
    function getUnlockedDerivatives() {
        const currentLevel = GameState.get('lvl');
        return Object.entries(DERIVATIVES)
            .filter(([_, data]) => currentLevel >= data.unlockLevel)
            .map(([type, data]) => ({ type, ...data }));
    }
    
    /* Transformer le coton brut en derives */
    function transformCotton(cottonAmount) {
        if (!isUnlocked(DERIVATIVE_TYPES.FIBER)) {
            return null;
        }
        
        const ratios = TRANSFORMATION_RATIOS.cottonToFiberAndSeed;
        const fiberProduced = (cottonAmount * ratios.fiber) / 100;
        const seedProduced = (cottonAmount * ratios.seed) / 100;
        
        stock.fiber += fiberProduced;
        stock.seed += seedProduced;
        
        /* Logger la production */
        logProduction('cotton_transform', {
            input: cottonAmount,
            outputs: {
                fiber: fiberProduced,
                seed: seedProduced
            }
        });
        
        return {
            fiber: fiberProduced,
            seed: seedProduced
        };
    }
    
    /* Transformer les graines en huile et tourteaux */
    function transformSeeds(seedAmount) {
        if (!isUnlocked(DERIVATIVE_TYPES.OIL)) {
            return null;
        }
        
        if (stock.seed < seedAmount) {
            ErrorHandler.handleWarning('Stock de graines insuffisant');
            return null;
        }
        
        const ratios = TRANSFORMATION_RATIOS.seedToOilAndCake;
        const oilProduced = (seedAmount * ratios.oil) / 100;
        const cakeProduced = (seedAmount * ratios.cake) / 100;
        
        stock.seed -= seedAmount;
        stock.oil += oilProduced;
        stock.cake += cakeProduced;
        
        logProduction('seed_transform', {
            input: seedAmount,
            outputs: {
                oil: oilProduced,
                cake: cakeProduced
            }
        });
        
        return {
            oil: oilProduced,
            cake: cakeProduced
        };
    }
    
    /* Transformer la fibre en textile */
    function transformFiber(fiberAmount) {
        if (!isUnlocked(DERIVATIVE_TYPES.TEXTILE)) {
            return null;
        }
        
        if (stock.fiber < fiberAmount) {
            ErrorHandler.handleWarning('Stock de fibre insuffisant');
            return null;
        }
        
        const ratio = TRANSFORMATION_RATIOS.fiberToTextile.textile;
        const textileProduced = fiberAmount * ratio;
        
        stock.fiber -= fiberAmount;
        stock.textile += textileProduced;
        
        logProduction('fiber_transform', {
            input: fiberAmount,
            outputs: {
                textile: textileProduced
            }
        });
        
        return {
            textile: textileProduced
        };
    }
    
    /* Vendre un derive */
    function sellDerivative(derivativeType, amount) {
        if (!stock[derivativeType] || stock[derivativeType] < amount) {
            ErrorHandler.handleWarning('Stock insuffisant pour la vente');
            return 0;
        }
        
        const derivative = DERIVATIVES[derivativeType];
        const totalValue = amount * derivative.baseValue;
        
        stock[derivativeType] -= amount;
        
        /* Ajouter l'argent au joueur */
        const currentMoney = GameState.get('money');
        GameState.set('money', currentMoney + totalValue);
        
        logProduction('sale', {
            derivative: derivativeType,
            amount: amount,
            value: totalValue
        });
        
        return totalValue;
    }
    
    /* Logger une operation de production */
    function logProduction(type, data) {
        const entry = {
            type: type,
            data: data,
            timestamp: Date.now()
        };
        
        productionHistory.push(entry);
        
        /* Limiter l'historique */
        if (productionHistory.length > 100) {
            productionHistory.shift();
        }
    }
    
    /* Obtenir le stock actuel */
    function getStock() {
        return { ...stock };
    }
    
    /* Obtenir la valeur totale du stock */
    function getStockValue() {
        let totalValue = 0;
        
        for (const [type, amount] of Object.entries(stock)) {
            if (DERIVATIVES[type]) {
                totalValue += amount * DERIVATIVES[type].baseValue;
            }
        }
        
        return totalValue;
    }
    
    /* Obtenir les statistiques de production */
    function getProductionStats() {
        const stats = {
            totalTransformations: productionHistory.length,
            totalSales: productionHistory.filter(e => e.type === 'sale').length,
            byType: {}
        };
        
        /* Compter par type */
        productionHistory.forEach(entry => {
            if (!stats.byType[entry.type]) {
                stats.byType[entry.type] = 0;
            }
            stats.byType[entry.type]++;
        });
        
        return stats;
    }
    
    /* Sauvegarder l'etat des derives */
    function save() {
        try {
            const saveData = {
                stock: stock,
                history: productionHistory.slice(-50) // Garder les 50 dernieres operations
            };
            localStorage.setItem('tycoon_derivatives', JSON.stringify(saveData));
            return true;
        } catch (e) {
            ErrorHandler.handleWarning('Impossible de sauvegarder les derives', e);
            return false;
        }
    }
    
    /* Charger l'etat des derives */
    function load() {
        try {
            const saved = localStorage.getItem('tycoon_derivatives');
            if (saved) {
                const data = JSON.parse(saved);
                Object.assign(stock, data.stock || {});
                productionHistory.push(...(data.history || []));
                return true;
            }
        } catch (e) {
            ErrorHandler.handleWarning('Impossible de charger les derives', e);
        }
        return false;
    }
    
    /* Interface publique */
    return {
        DERIVATIVE_TYPES,
        DERIVATIVES,
        TRANSFORMATION_RATIOS,
        isUnlocked,
        getUnlockedDerivatives,
        transformCotton,
        transformSeeds,
        transformFiber,
        sellDerivative,
        getStock,
        getStockValue,
        getProductionStats,
        save,
        load
    };
})();
