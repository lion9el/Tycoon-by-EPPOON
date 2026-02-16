/* ========================================
   DERIVATIVES MODULE - CONFIG
   Configuration des produits dérivés
   
   EMPLACEMENT: js/derivatives/config.js
   DÉPENDANCES: Aucune
   ======================================== */

const DerivativesConfig = (() => {
    
    const PRODUCTS = {
        fiber: {
            id: 'fiber',
            name: 'Fibre de Coton',
            unit: 'kg',
            baseValue: 500,
            unlockLevel: 3,
            description: 'Fibre pure pour textile'
        },
        seeds: {
            id: 'seeds',
            name: 'Graines de Coton',
            unit: 'kg',
            baseValue: 50,
            unlockLevel: 3,
            description: 'Graines pour huile'
        },
        oil: {
            id: 'oil',
            name: 'Huile de Coton',
            unit: 'L',
            baseValue: 800,
            unlockLevel: 4,
            description: 'Huile alimentaire'
        },
        cake: {
            id: 'cake',
            name: 'Tourteaux',
            unit: 'kg',
            baseValue: 150,
            unlockLevel: 4,
            description: 'Aliment bétail'
        },
        textile: {
            id: 'textile',
            name: 'Textile',
            unit: 'm',
            baseValue: 2000,
            unlockLevel: 5,
            description: 'Made in Benin'
        }
    };
    
    const RECIPES = {
        ginning: {
            id: 'ginning',
            name: 'Égrenage',
            input: { product: 'rawCotton', baseAmount: 100 },
            outputs: [
                { product: 'fiber', percentage: 35 },
                { product: 'seeds', percentage: 60 }
            ]
        },
        crushing: {
            id: 'crushing',
            name: 'Trituration',
            input: { product: 'seeds', baseAmount: 100 },
            outputs: [
                { product: 'oil', percentage: 15 },
                { product: 'cake', percentage: 80 }
            ]
        },
        spinning: {
            id: 'spinning',
            name: 'Filature',
            input: { product: 'fiber', baseAmount: 1 },
            outputs: [
                { product: 'textile', percentage: 80 }
            ]
        }
    };
    
    return {
        PRODUCTS,
        RECIPES,
        getProduct: (id) => PRODUCTS[id],
        getRecipe: (id) => RECIPES[id]
    };
})();

console.log('[Derivatives Config] Chargé');
