/* ========================================
   DERIVATIVES MODULE - PUBLIC API
   Interface publique UNIQUE
   
   EMPLACEMENT: js/derivatives/api.js
   DÉPENDANCES: Tous les modules derivatives/*
   
   IMPORTANT:
   Les autres fichiers (market-manager.js, buildings-manager.js, 
   advanced-ui-manager.js) doivent UNIQUEMENT utiliser DerivativesAPI
   et JAMAIS accéder directement aux autres modules.
   ======================================== */

const DerivativesAPI = (() => {
    
    /* Initialisation */
    function init() {
        DerivativesStorage.load();
        console.log('[Derivatives API] Module initialisé');
        return true;
    }
    
    /* Stockage */
    function getStock(product) {
        return DerivativesStorage.get(product);
    }
    
    function getAllStock() {
        return DerivativesStorage.getAll();
    }
    
    function addToStock(product, amount) {
        return DerivativesStorage.add(product, amount);
    }
    
    function removeFromStock(product, amount) {
        return DerivativesStorage.remove(product, amount);
    }
    
    function getStorageInfo() {
        return {
            used: DerivativesStorage.getTotalUsed(),
            capacity: DerivativesStorage.getCapacity(),
            available: DerivativesStorage.getAvailable(),
            isFull: DerivativesStorage.isFull(),
            percentage: Math.round((DerivativesStorage.getTotalUsed() / DerivativesStorage.getCapacity()) * 100)
        };
    }
    
    function setStorageCapacity(capacity) {
        return DerivativesStorage.setMaxCapacity(capacity);
    }
    
    /* Transformation */
    function transform(recipeId, multiplier = 1) {
        return DerivativesTransform.transform(recipeId, multiplier);
    }
    
    function canTransform(recipeId, multiplier = 1) {
        return DerivativesTransform.canTransform(recipeId, multiplier);
    }
    
    function calculateOutputs(recipeId, multiplier = 1) {
        return DerivativesTransform.calculateOutputs(recipeId, multiplier);
    }
    
    function getTransformHistory(limit = 10) {
        return DerivativesTransform.getHistory(limit);
    }
    
    /* Automatisation */
    function startAutomation() {
        return DerivativesAutomation.start();
    }
    
    function stopAutomation() {
        return DerivativesAutomation.stop();
    }
    
    function isAutomationRunning() {
        return DerivativesAutomation.isRunning();
    }
    
    function registerBuilding(buildingId, recipeId, productionRate, level) {
        return DerivativesAutomation.registerBuilding(buildingId, recipeId, productionRate, level);
    }
    
    function updateBuildingLevel(buildingId, newLevel) {
        return DerivativesAutomation.updateBuildingLevel(buildingId, newLevel);
    }
    
    /* Informations */
    function getProducts() {
        return Object.values(DerivativesConfig.PRODUCTS);
    }
    
    function getProduct(productId) {
        return DerivativesConfig.getProduct(productId);
    }
    
    function getRecipes() {
        return Object.values(DerivativesConfig.RECIPES);
    }
    
    function getRecipe(recipeId) {
        return DerivativesConfig.getRecipe(recipeId);
    }
    
    function getProductValue(productId) {
        const product = DerivativesConfig.getProduct(productId);
        return product ? product.baseValue : 0;
    }
    
    function calculateStockValue() {
        const stock = DerivativesStorage.getAll();
        let totalValue = 0;
        
        Object.entries(stock).forEach(([productId, amount]) => {
            totalValue += amount * getProductValue(productId);
        });
        
        return totalValue;
    }
    
    /* Sauvegarde */
    function save() {
        return DerivativesStorage.save();
    }
    
    function load() {
        return DerivativesStorage.load();
    }
    
    /* INTERFACE PUBLIQUE */
    return {
        init,
        
        // Stockage
        getStock,
        getAllStock,
        addToStock,
        removeFromStock,
        getStorageInfo,
        setStorageCapacity,
        calculateStockValue,
        
        // Transformation
        transform,
        canTransform,
        calculateOutputs,
        getTransformHistory,
        
        // Automatisation
        startAutomation,
        stopAutomation,
        isAutomationRunning,
        registerBuilding,
        updateBuildingLevel,
        
        // Informations
        getProducts,
        getProduct,
        getRecipes,
        getRecipe,
        getProductValue,
        
        // Sauvegarde
        save,
        load
    };
})();

console.log('[Derivatives API] ✅ Interface publique prête');
