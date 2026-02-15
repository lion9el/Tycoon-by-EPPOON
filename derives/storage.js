/* ========================================
   DERIVATIVES MODULE - STORAGE
   Gestion du stockage des dérivés
   
   EMPLACEMENT: js/derivatives/storage.js
   DÉPENDANCES: DerivativesConfig
   ======================================== */

const DerivativesStorage = (() => {
    
    const inventory = {
        fiber: 0,
        seeds: 0,
        oil: 0,
        cake: 0,
        textile: 0
    };
    
    let maxCapacity = 1000;
    
    function add(product, amount) {
        if (amount <= 0 || !inventory.hasOwnProperty(product)) return false;
        
        const available = maxCapacity - getTotalUsed();
        if (available <= 0) return false;
        
        inventory[product] += Math.min(amount, available);
        return true;
    }
    
    function remove(product, amount) {
        if (amount <= 0 || !inventory.hasOwnProperty(product)) return false;
        if (inventory[product] < amount) return false;
        
        inventory[product] -= amount;
        return true;
    }
    
    function get(product) {
        return inventory[product] || 0;
    }
    
    function getAll() {
        return { ...inventory };
    }
    
    function getTotalUsed() {
        return Object.values(inventory).reduce((sum, qty) => sum + qty, 0);
    }
    
    function setMaxCapacity(capacity) {
        if (capacity > 0) {
            maxCapacity = capacity;
            return true;
        }
        return false;
    }
    
    function getCapacity() {
        return maxCapacity;
    }
    
    function save() {
        try {
            localStorage.setItem('derivatives_storage', JSON.stringify({
                inventory,
                maxCapacity
            }));
            return true;
        } catch (e) {
            return false;
        }
    }
    
    function load() {
        try {
            const saved = localStorage.getItem('derivatives_storage');
            if (saved) {
                const data = JSON.parse(saved);
                Object.assign(inventory, data.inventory || {});
                maxCapacity = data.maxCapacity || 1000;
                return true;
            }
        } catch (e) {}
        return false;
    }
    
    return {
        add,
        remove,
        get,
        getAll,
        getTotalUsed,
        getAvailable: () => maxCapacity - getTotalUsed(),
        isFull: () => getTotalUsed() >= maxCapacity,
        setMaxCapacity,
        getCapacity,
        save,
        load
    };
})();

console.log('[Derivatives Storage] Chargé');
