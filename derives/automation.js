/* ========================================
   DERIVATIVES MODULE - AUTOMATION
   Production automatique
   
   EMPLACEMENT: js/derivatives/automation.js
   DÉPENDANCES: DerivativesTransform
   ======================================== */

const DerivativesAutomation = (() => {
    
    let isRunning = false;
    let automationTimer = null;
    const buildings = [];
    
    function start() {
        if (isRunning) return false;
        
        isRunning = true;
        automationTimer = setInterval(() => {
            tick();
        }, 1000);
        
        return true;
    }
    
    function stop() {
        if (automationTimer) {
            clearInterval(automationTimer);
            automationTimer = null;
        }
        isRunning = false;
        return true;
    }
    
    function tick() {
        buildings.forEach(building => {
            if (!building.active) return;
            
            const productionPerSecond = (building.productionRate * building.level) / 3600;
            
            if (productionPerSecond > 0) {
                DerivativesTransform.transform(building.recipeId, productionPerSecond);
            }
        });
    }
    
    function registerBuilding(buildingId, recipeId, productionRate, level) {
        const existing = buildings.find(b => b.id === buildingId);
        
        if (existing) {
            existing.recipeId = recipeId;
            existing.productionRate = productionRate;
            existing.level = level;
        } else {
            buildings.push({
                id: buildingId,
                recipeId,
                productionRate,
                level,
                active: true
            });
        }
        return true;
    }
    
    function updateBuildingLevel(buildingId, newLevel) {
        const building = buildings.find(b => b.id === buildingId);
        if (building) {
            building.level = newLevel;
            return true;
        }
        return false;
    }
    
    function toggleBuilding(buildingId) {
        const building = buildings.find(b => b.id === buildingId);
        if (building) {
            building.active = !building.active;
            return building.active;
        }
        return false;
    }
    
    return {
        start,
        stop,
        isRunning: () => isRunning,
        registerBuilding,
        updateBuildingLevel,
        toggleBuilding,
        getAllBuildings: () => buildings.map(b => ({ ...b }))
    };
})();

console.log('[Derivatives Automation] Chargé');
