/* ========================================
   DERIVATIVES MODULE - TRANSFORM
   Transformations de produits
   
   EMPLACEMENT: js/derivatives/transform.js
   DÉPENDANCES: DerivativesConfig, DerivativesStorage, GameState
   ======================================== */

const DerivativesTransform = (() => {
    
    const history = [];
    
    function transform(recipeId, multiplier = 1) {
        const recipe = DerivativesConfig.getRecipe(recipeId);
        if (!recipe) return null;
        
        const inputAmount = recipe.input.baseAmount * multiplier;
        
        // Vérifier input
        let inputAvailable = false;
        if (recipe.input.product === 'rawCotton') {
            const stock = GameState.get('rawCotton') || 0;
            inputAvailable = stock >= inputAmount;
        } else {
            inputAvailable = DerivativesStorage.get(recipe.input.product) >= inputAmount;
        }
        
        if (!inputAvailable) return null;
        
        // Retirer input
        if (recipe.input.product === 'rawCotton') {
            const current = GameState.get('rawCotton') || 0;
            GameState.set('rawCotton', current - inputAmount);
        } else {
            if (!DerivativesStorage.remove(recipe.input.product, inputAmount)) {
                return null;
            }
        }
        
        // Ajouter outputs
        const results = {};
        recipe.outputs.forEach(output => {
            const produced = (inputAmount * output.percentage) / 100;
            DerivativesStorage.add(output.product, produced);
            results[output.product] = produced;
        });
        
        // Historique
        history.push({
            recipeId,
            recipeName: recipe.name,
            inputAmount,
            outputs: results,
            timestamp: Date.now()
        });
        
        if (history.length > 100) history.shift();
        
        return results;
    }
    
    function canTransform(recipeId, multiplier = 1) {
        const recipe = DerivativesConfig.getRecipe(recipeId);
        if (!recipe) return false;
        
        const inputAmount = recipe.input.baseAmount * multiplier;
        
        if (recipe.input.product === 'rawCotton') {
            return (GameState.get('rawCotton') || 0) >= inputAmount;
        }
        return DerivativesStorage.get(recipe.input.product) >= inputAmount;
    }
    
    function calculateOutputs(recipeId, multiplier = 1) {
        const recipe = DerivativesConfig.getRecipe(recipeId);
        if (!recipe) return null;
        
        const inputAmount = recipe.input.baseAmount * multiplier;
        const outputs = {};
        
        recipe.outputs.forEach(output => {
            outputs[output.product] = (inputAmount * output.percentage) / 100;
        });
        
        return outputs;
    }
    
    return {
        transform,
        canTransform,
        calculateOutputs,
        getHistory: (limit = 10) => history.slice(-limit).reverse()
    };
})();

console.log('[Derivatives Transform] Chargé');
