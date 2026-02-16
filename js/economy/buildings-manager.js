/* ========================================
   MODULE: BUILDINGS MANAGER
   Gestion des batiments industriels
   ======================================== */

const BuildingsManager = (() => {
    
    /* Types de batiments */
    const BUILDING_TYPES = {
        GINNING: 'ginning',         // Usine d'egrenage
        CRUSHING: 'crushing',       // Usine de trituration
        SPINNING: 'spinning',       // Filature
        WAREHOUSE: 'warehouse',     // Entrepot
        PORT: 'port'               // Terminal portuaire
    };
    
    /* Configuration des batiments */
    const BUILDINGS = {
        ginning: {
            name: 'Usine d\'Egrenage',
            description: 'Separe la fibre de la graine',
            baseCost: 5000,
            unlockLevel: 3,
            productionRate: 100,    // kg/heure
            maintenanceCost: 50,    // FCFA/heure
            maxLevel: 5,
            upgradeMultiplier: 2.5,
            icon: 'factory'
        },
        crushing: {
            name: 'Usine de Trituration',
            description: 'Transforme les graines en huile',
            baseCost: 15000,
            unlockLevel: 4,
            productionRate: 50,
            maintenanceCost: 100,
            maxLevel: 5,
            upgradeMultiplier: 2.5,
            icon: 'oil'
        },
        spinning: {
            name: 'Filature',
            description: 'Transforme la fibre en textile',
            baseCost: 30000,
            unlockLevel: 5,
            productionRate: 30,
            maintenanceCost: 150,
            maxLevel: 5,
            upgradeMultiplier: 2.5,
            icon: 'textile'
        },
        warehouse: {
            name: 'Entrepot',
            description: 'Augmente la capacite de stockage',
            baseCost: 2000,
            unlockLevel: 2,
            storageBonus: 1000,     // kg supplementaires
            maintenanceCost: 20,
            maxLevel: 10,
            upgradeMultiplier: 1.8,
            icon: 'warehouse'
        },
        port: {
            name: 'Terminal Portuaire',
            description: 'Acces au Port Autonome de Cotonou',
            baseCost: 100000,
            unlockLevel: 6,
            exportBonus: 1.5,       // Multiplicateur de prix a l\'export
            maintenanceCost: 500,
            maxLevel: 3,
            upgradeMultiplier: 3,
            icon: 'ship'
        }
    };
    
    /* Batiments du joueur */
    const ownedBuildings = {};
    
    /* Initialiser les batiments */
    function init() {
        Object.keys(BUILDINGS).forEach(type => {
            if (!ownedBuildings[type]) {
                ownedBuildings[type] = {
                    owned: false,
                    level: 0,
                    lastMaintenance: Date.now()
                };
            }
        });
    }
    
    /* Verifier si un batiment est debloque */
    function isUnlocked(buildingType) {
        const currentLevel = GameState.get('lvl');
        const building = BUILDINGS[buildingType];
        return building && currentLevel >= building.unlockLevel;
    }
    
    /* Obtenir le cout d'achat/amelioration */
    function getCost(buildingType) {
        const building = BUILDINGS[buildingType];
        const owned = ownedBuildings[buildingType];
        
        if (!building) return 0;
        
        if (!owned.owned) {
            return building.baseCost;
        }
        
        /* Cout d'amelioration */
        return Math.floor(
            building.baseCost * 
            Math.pow(building.upgradeMultiplier, owned.level)
        );
    }
    
    /* Acheter ou ameliorer un batiment */
    function purchase(buildingType) {
        return ErrorHandler.safeSync(() => {
            const building = BUILDINGS[buildingType];
            const owned = ownedBuildings[buildingType];
            
            if (!building || !owned) {
                ErrorHandler.handleWarning('Batiment invalide');
                return false;
            }
            
            if (!isUnlocked(buildingType)) {
                ErrorHandler.handleWarning('Batiment non debloque');
                return false;
            }
            
            /* Verifier le niveau max */
            if (owned.owned && owned.level >= building.maxLevel) {
                ErrorHandler.handleWarning('Niveau maximum atteint');
                return false;
            }
            
            const cost = getCost(buildingType);
            const currentMoney = GameState.get('money');
            
            if (currentMoney < cost) {
                ErrorHandler.handleWarning('Fonds insuffisants');
                return false;
            }
            
            /* Acheter/Ameliorer */
            GameState.set('money', currentMoney - cost);
            
            if (!owned.owned) {
                owned.owned = true;
                owned.level = 1;
                UIManager.showToast(`${building.name} construite !`);
            } else {
                owned.level++;
                UIManager.showToast(`${building.name} niveau ${owned.level} !`);
            }
            
            owned.lastMaintenance = Date.now();
            
            /* Sauvegarder */
            save();
            
            ErrorHandler.handleInfo(`Batiment ${buildingType} niveau ${owned.level}`);
            return true;
        }, false);
    }
    
    /* Obtenir le taux de production d'un batiment */
    function getProductionRate(buildingType) {
        const building = BUILDINGS[buildingType];
        const owned = ownedBuildings[buildingType];
        
        if (!building || !owned || !owned.owned) {
            return 0;
        }
        
        /* Taux de base * niveau */
        return building.productionRate * owned.level;
    }
    
    /* Obtenir le bonus de stockage total */
    function getTotalStorageBonus() {
        const warehouse = ownedBuildings.warehouse;
        if (!warehouse || !warehouse.owned) {
            return 1000; // Stockage de base
        }
        
        return 1000 + (BUILDINGS.warehouse.storageBonus * warehouse.level);
    }
    
    /* Obtenir le bonus d'exportation */
    function getExportBonus() {
        const port = ownedBuildings.port;
        if (!port || !port.owned) {
            return 1.0;
        }
        
        return 1.0 + (BUILDINGS.port.exportBonus * port.level * 0.1);
    }
    
    /* Calculer les couts de maintenance */
    function calculateMaintenance() {
        let totalCost = 0;
        
        Object.entries(ownedBuildings).forEach(([type, owned]) => {
            if (owned.owned) {
                const building = BUILDINGS[type];
                totalCost += building.maintenanceCost * owned.level;
            }
        });
        
        return totalCost;
    }
    
    /* Payer la maintenance (appele periodiquement) */
    function payMaintenance() {
        const cost = calculateMaintenance();
        if (cost === 0) return true;
        
        const currentMoney = GameState.get('money');
        
        if (currentMoney >= cost) {
            GameState.set('money', currentMoney - cost);
            
            /* Mettre a jour le timestamp */
            Object.values(ownedBuildings).forEach(owned => {
                if (owned.owned) {
                    owned.lastMaintenance = Date.now();
                }
            });
            
            return true;
        }
        
        ErrorHandler.handleWarning('Fonds insuffisants pour la maintenance');
        return false;
    }
    
    /* Obtenir les batiments possedes */
    function getOwnedBuildings() {
        return Object.entries(ownedBuildings)
            .filter(([_, owned]) => owned.owned)
            .map(([type, owned]) => ({
                type,
                ...BUILDINGS[type],
                level: owned.level,
                productionRate: getProductionRate(type)
            }));
    }
    
    /* Obtenir les batiments disponibles a l'achat */
    function getAvailableBuildings() {
        return Object.entries(BUILDINGS)
            .filter(([type, _]) => isUnlocked(type))
            .map(([type, building]) => ({
                type,
                ...building,
                owned: ownedBuildings[type].owned,
                level: ownedBuildings[type].level,
                cost: getCost(type)
            }));
    }
    
    /* Obtenir les statistiques des batiments */
    function getStats() {
        return {
            totalBuildings: getOwnedBuildings().length,
            totalProduction: Object.keys(ownedBuildings)
                .reduce((sum, type) => sum + getProductionRate(type), 0),
            maintenanceCost: calculateMaintenance(),
            storageCapacity: getTotalStorageBonus(),
            exportBonus: getExportBonus()
        };
    }
    
    /* Sauvegarder */
    function save() {
        try {
            localStorage.setItem('tycoon_buildings', JSON.stringify(ownedBuildings));
            return true;
        } catch (e) {
            ErrorHandler.handleWarning('Impossible de sauvegarder les batiments', e);
            return false;
        }
    }
    
    /* Charger */
    function load() {
        try {
            const saved = localStorage.getItem('tycoon_buildings');
            if (saved) {
                const data = JSON.parse(saved);
                Object.assign(ownedBuildings, data);
                return true;
            }
        } catch (e) {
            ErrorHandler.handleWarning('Impossible de charger les batiments', e);
        }
        return false;
    }
    
    /* Interface publique */
    return {
        BUILDING_TYPES,
        BUILDINGS,
        init,
        isUnlocked,
        getCost,
        purchase,
        getProductionRate,
        getTotalStorageBonus,
        getExportBonus,
        calculateMaintenance,
        payMaintenance,
        getOwnedBuildings,
        getAvailableBuildings,
        getStats,
        save,
        load
    };
})();
