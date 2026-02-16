/* ========================================
   MODULE: EXPORT MANAGER
   Gestion des exportations via le Port de Cotonou
   ======================================== */

const ExportManager = (() => {
    
    /* Destinations d'exportation */
    const DESTINATIONS = {
        asia: {
            name: 'Asie',
            countries: ['Chine', 'Bangladesh', 'Vietnam'],
            priceMultiplier: 1.5,
            shippingTime: 30,      // jours
            unlockLevel: 6,
            color: '#FF4500'
        },
        europe: {
            name: 'Europe',
            countries: ['France', 'Allemagne', 'Italie'],
            priceMultiplier: 1.8,
            shippingTime: 20,
            unlockLevel: 6,
            color: '#4169E1'
        },
        africa: {
            name: 'Afrique',
            countries: ['Nigeria', 'Ghana', 'Togo'],
            priceMultiplier: 1.2,
            shippingTime: 5,
            unlockLevel: 5,
            color: '#32CD32'
        }
    };
    
    /* Historique des exportations */
    const exportHistory = [];
    
    /* Exportations en cours */
    const activeShipments = [];
    
    /* Verifier si l'exportation est disponible */
    function isExportAvailable() {
        const currentLevel = GameState.get('lvl');
        return currentLevel >= 5;
    }
    
    /* Verifier si une destination est debloquee */
    function isDestinationUnlocked(destination) {
        const currentLevel = GameState.get('lvl');
        const dest = DESTINATIONS[destination];
        return dest && currentLevel >= dest.unlockLevel;
    }
    
    /* Calculer le prix d'exportation */
    function calculateExportPrice(derivativeType, amount, destination) {
        if (!DerivativesManager.DERIVATIVES[derivativeType]) {
            return 0;
        }
        
        const basePrice = DerivativesManager.DERIVATIVES[derivativeType].baseValue;
        const dest = DESTINATIONS[destination];
        
        if (!dest) return 0;
        
        /* Prix de base * quantite * multiplicateur destination */
        let totalPrice = basePrice * amount * dest.priceMultiplier;
        
        /* Bonus du terminal portuaire */
        const exportBonus = BuildingsManager.getExportBonus();
        totalPrice *= exportBonus;
        
        return Math.floor(totalPrice);
    }
    
    /* Creer une exportation */
    function createExport(derivativeType, amount, destination) {
        return ErrorHandler.safeSync(() => {
            /* Verifications */
            if (!isExportAvailable()) {
                ErrorHandler.handleWarning('Exportation non debloquee');
                return null;
            }
            
            if (!isDestinationUnlocked(destination)) {
                ErrorHandler.handleWarning('Destination non debloquee');
                return null;
            }
            
            /* Verifier le stock */
            const stock = DerivativesManager.getStock();
            if (!stock[derivativeType] || stock[derivativeType] < amount) {
                ErrorHandler.handleWarning('Stock insuffisant pour l\'exportation');
                return null;
            }
            
            /* Calculer le prix */
            const totalPrice = calculateExportPrice(derivativeType, amount, destination);
            const dest = DESTINATIONS[destination];
            
            /* Creer l'expedition */
            const shipment = {
                id: Date.now() + Math.random(),
                derivativeType: derivativeType,
                amount: amount,
                destination: destination,
                price: totalPrice,
                departureTime: Date.now(),
                arrivalTime: Date.now() + (dest.shippingTime * 24 * 60 * 60 * 1000),
                status: 'in_transit'
            };
            
            /* Retirer du stock */
            const currentStock = stock[derivativeType];
            DerivativesManager.getStock()[derivativeType] = currentStock - amount;
            
            /* Ajouter aux expeditions actives */
            activeShipments.push(shipment);
            
            /* Sauvegarder */
            save();
            
            UIManager.showToast(`Exportation vers ${dest.name} lancee !`);
            ErrorHandler.handleInfo(`Exportation creee: ${amount}kg vers ${destination}`);
            
            return shipment;
        }, null);
    }
    
    /* Verifier les arrivees */
    function checkArrivals() {
        const now = Date.now();
        const arrivedShipments = [];
        
        activeShipments.forEach((shipment, index) => {
            if (shipment.status === 'in_transit' && now >= shipment.arrivalTime) {
                shipment.status = 'arrived';
                arrivedShipments.push(shipment);
                
                /* Ajouter l'argent */
                const currentMoney = GameState.get('money');
                GameState.set('money', currentMoney + shipment.price);
                
                /* Deplacer vers l'historique */
                exportHistory.push(shipment);
                
                /* Retirer des expeditions actives */
                activeShipments.splice(index, 1);
                
                const dest = DESTINATIONS[shipment.destination];
                UIManager.showToast(
                    `Exportation arrivee en ${dest.name} : +${shipment.price.toLocaleString()} FCFA !`
                );
            }
        });
        
        if (arrivedShipments.length > 0) {
            save();
        }
        
        return arrivedShipments;
    }
    
    /* Obtenir les expeditions actives */
    function getActiveShipments() {
        return [...activeShipments];
    }
    
    /* Obtenir l'historique */
    function getExportHistory(limit = 50) {
        return exportHistory.slice(-limit);
    }
    
    /* Obtenir les statistiques d'exportation */
    function getStats() {
        const totalExports = exportHistory.length;
        const totalRevenue = exportHistory.reduce((sum, exp) => sum + exp.price, 0);
        
        /* Par destination */
        const byDestination = {};
        exportHistory.forEach(exp => {
            if (!byDestination[exp.destination]) {
                byDestination[exp.destination] = {
                    count: 0,
                    revenue: 0
                };
            }
            byDestination[exp.destination].count++;
            byDestination[exp.destination].revenue += exp.price;
        });
        
        /* Par produit */
        const byProduct = {};
        exportHistory.forEach(exp => {
            if (!byProduct[exp.derivativeType]) {
                byProduct[exp.derivativeType] = {
                    count: 0,
                    amount: 0,
                    revenue: 0
                };
            }
            byProduct[exp.derivativeType].count++;
            byProduct[exp.derivativeType].amount += exp.amount;
            byProduct[exp.derivativeType].revenue += exp.price;
        });
        
        return {
            totalExports,
            totalRevenue,
            activeShipments: activeShipments.length,
            byDestination,
            byProduct
        };
    }
    
    /* Obtenir les destinations disponibles */
    function getAvailableDestinations() {
        return Object.entries(DESTINATIONS)
            .filter(([key, _]) => isDestinationUnlocked(key))
            .map(([key, dest]) => ({
                id: key,
                ...dest
            }));
    }
    
    /* Sauvegarder */
    function save() {
        try {
            const saveData = {
                active: activeShipments,
                history: exportHistory.slice(-100)
            };
            localStorage.setItem('tycoon_exports', JSON.stringify(saveData));
            return true;
        } catch (e) {
            ErrorHandler.handleWarning('Impossible de sauvegarder les exportations', e);
            return false;
        }
    }
    
    /* Charger */
    function load() {
        try {
            const saved = localStorage.getItem('tycoon_exports');
            if (saved) {
                const data = JSON.parse(saved);
                activeShipments.push(...(data.active || []));
                exportHistory.push(...(data.history || []));
                return true;
            }
        } catch (e) {
            ErrorHandler.handleWarning('Impossible de charger les exportations', e);
        }
        return false;
    }
    
    /* Initialiser - verifier les arrivees periodiquement */
    function init() {
        setInterval(() => {
            if (isExportAvailable()) {
                checkArrivals();
            }
        }, 10000); // Verifier toutes les 10 secondes
        
        ErrorHandler.handleInfo('Export Manager initialise');
    }
    
    /* Interface publique */
    return {
        DESTINATIONS,
        isExportAvailable,
        isDestinationUnlocked,
        calculateExportPrice,
        createExport,
        checkArrivals,
        getActiveShipments,
        getExportHistory,
        getStats,
        getAvailableDestinations,
        save,
        load,
        init
    };
})();
