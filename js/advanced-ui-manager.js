/* ========================================
   MODULE: ADVANCED UI MANAGER
   Gestion de l'interface des systemes avances
   ======================================== */

const AdvancedUIManager = (() => {
    
    /* Onglet actif */
    let activeTab = 'production';
    
    /* Initialiser les onglets */
    function initTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                switchTab(tabName);
            });
        });
    }
    
    /* Changer d'onglet */
    function switchTab(tabName) {
        /* Desactiver tous les onglets */
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        
        /* Activer l'onglet selectionne */
        const tab = document.querySelector(`.tab[data-tab="${tabName}"]`);
        const panel = document.getElementById(`panel-${tabName}`);
        
        if (tab) tab.classList.add('active');
        if (panel) panel.classList.add('active');
        
        activeTab = tabName;
        
        /* Mettre a jour le contenu */
        updateActivePanel();
    }
    
    /* Mettre a jour le panneau actif */
    function updateActivePanel() {
        switch(activeTab) {
            case 'derivatives':
                updateDerivativesPanel();
                break;
            case 'buildings':
                updateBuildingsPanel();
                break;
            case 'export':
                updateExportPanel();
                break;
            case 'stats':
                updateStatsPanel();
                break;
        }
    }
    
    /* PANEL DERIVES */
    function updateDerivativesPanel() {
        const grid = document.getElementById('derivatives-grid');
        if (!grid) return;
        
        const unlocked = DerivativesManager.getUnlockedDerivatives();
        const stock = DerivativesManager.getStock();
        
        grid.innerHTML = '';
        
        unlocked.forEach(derivative => {
            const amount = stock[derivative.type] || 0;
            const value = amount * derivative.baseValue;
            
            const card = document.createElement('div');
            card.className = 'derivative-card';
            card.innerHTML = `
                <div class="derivative-icon">📦</div>
                <div class="derivative-name">${derivative.name}</div>
                <div class="derivative-amount">${Math.floor(amount)} kg</div>
                <div class="derivative-value">${Math.floor(value).toLocaleString()} FCFA</div>
                <button class="transform-btn" onclick="sellDerivative('${derivative.type}')">
                    Vendre
                </button>
            `;
            grid.appendChild(card);
        });
        
        /* Section transformation */
        updateTransformSection();
    }
    
    /* Section transformation */
    function updateTransformSection() {
        const section = document.getElementById('transform-section');
        if (!section) return;
        
        const currentLevel = GameState.get('lvl');
        section.innerHTML = '';
        
        /* Transformation coton -> fibre + graines */
        if (currentLevel >= 3) {
            const transformCard = document.createElement('div');
            transformCard.className = 'quick-transform';
            transformCard.innerHTML = `
                <div class="transform-row">
                    <div class="transform-input">
                        <div class="transform-label">Coton Brut</div>
                        <input type="number" id="cotton-amount" value="100" min="10" max="10000" 
                               style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: rgba(0,0,0,0.3); color: white;">
                    </div>
                    <div class="transform-arrow">→</div>
                    <div class="transform-output">
                        <div class="transform-label">Fibre + Graines</div>
                        <div class="transform-value" id="cotton-output">35kg + 60kg</div>
                    </div>
                </div>
                <button class="transform-btn" onclick="transformCotton()">Egrener le Coton</button>
            `;
            section.appendChild(transformCard);
        }
        
        /* Transformation graines -> huile + tourteaux */
        if (currentLevel >= 4) {
            const stock = DerivativesManager.getStock();
            const transformCard = document.createElement('div');
            transformCard.className = 'quick-transform';
            transformCard.innerHTML = `
                <div class="transform-row">
                    <div class="transform-input">
                        <div class="transform-label">Graines (Stock: ${Math.floor(stock.seed)}kg)</div>
                        <input type="number" id="seed-amount" value="100" min="10" max="${Math.floor(stock.seed)}" 
                               style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: rgba(0,0,0,0.3); color: white;">
                    </div>
                    <div class="transform-arrow">→</div>
                    <div class="transform-output">
                        <div class="transform-label">Huile + Tourteaux</div>
                        <div class="transform-value" id="seed-output">15L + 80kg</div>
                    </div>
                </div>
                <button class="transform-btn" onclick="transformSeeds()">Triturer les Graines</button>
            `;
            section.appendChild(transformCard);
        }
        
        /* Transformation fibre -> textile */
        if (currentLevel >= 5) {
            const stock = DerivativesManager.getStock();
            const transformCard = document.createElement('div');
            transformCard.className = 'quick-transform';
            transformCard.innerHTML = `
                <div class="transform-row">
                    <div class="transform-input">
                        <div class="transform-label">Fibre (Stock: ${Math.floor(stock.fiber)}kg)</div>
                        <input type="number" id="fiber-amount" value="10" min="1" max="${Math.floor(stock.fiber)}" 
                               style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: rgba(0,0,0,0.3); color: white;">
                    </div>
                    <div class="transform-arrow">→</div>
                    <div class="transform-output">
                        <div class="transform-label">Textile</div>
                        <div class="transform-value" id="fiber-output">8m</div>
                    </div>
                </div>
                <button class="transform-btn" onclick="transformFiber()">Filer le Textile</button>
            `;
            section.appendChild(transformCard);
        }
    }
    
    /* PANEL BATIMENTS */
    function updateBuildingsPanel() {
        const list = document.getElementById('buildings-list');
        if (!list) return;
        
        const available = BuildingsManager.getAvailableBuildings();
        list.innerHTML = '';
        
        available.forEach(building => {
            const card = document.createElement('div');
            card.className = 'building-card' + (!building.owned && !BuildingsManager.isUnlocked(building.type) ? ' locked' : '');
            
            const currentMoney = GameState.get('money');
            const canAfford = currentMoney >= building.cost;
            const canUpgrade = building.owned && building.level < building.maxLevel;
            
            card.innerHTML = `
                <div class="building-header">
                    <div class="building-info">
                        <div class="building-name">${building.name}</div>
                        <div class="building-desc">${building.description}</div>
                    </div>
                    <div class="building-level">
                        ${building.owned ? `Niveau ${building.level}/${building.maxLevel}` : 'Non construit'}
                    </div>
                </div>
                ${building.owned ? `
                <div class="building-stats">
                    <div class="stat-item">
                        <div class="stat-label">Production</div>
                        <div class="stat-value">${BuildingsManager.getProductionRate(building.type)} /h</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Maintenance</div>
                        <div class="stat-value">${building.maintenanceCost * building.level} FCFA/h</div>
                    </div>
                </div>
                ` : ''}
                <button class="building-btn" 
                        ${!canAfford || (!building.owned && !BuildingsManager.isUnlocked(building.type)) || (building.owned && building.level >= building.maxLevel) ? 'disabled' : ''}
                        onclick="purchaseBuilding('${building.type}')">
                    ${!building.owned ? 'Construire' : (canUpgrade ? 'Ameliorer' : 'Niveau MAX')} - ${building.cost.toLocaleString()} FCFA
                </button>
            `;
            
            list.appendChild(card);
        });
    }
    
    /* PANEL EXPORT */
    function updateExportPanel() {
        updateDestinations();
        updateShipments();
        updateExportHistory();
    }
    
    function updateDestinations() {
        const grid = document.getElementById('destinations-grid');
        if (!grid) return;
        
        const destinations = ExportManager.getAvailableDestinations();
        grid.innerHTML = '';
        
        Object.values(ExportManager.DESTINATIONS).forEach(dest => {
            const unlocked = destinations.find(d => d.name === dest.name);
            
            const card = document.createElement('div');
            card.className = 'destination-card' + (!unlocked ? ' locked' : '');
            card.innerHTML = `
                <div class="destination-name">${dest.name}</div>
                <div class="destination-bonus">×${dest.priceMultiplier} prix</div>
                <div style="font-size: 0.6rem; opacity: 0.6;">${dest.shippingTime} jours</div>
            `;
            grid.appendChild(card);
        });
    }
    
    function updateShipments() {
        const list = document.getElementById('shipments-list');
        if (!list) return;
        
        const shipments = ExportManager.getActiveShipments();
        
        if (shipments.length === 0) {
            list.innerHTML = '<div style="text-align: center; opacity: 0.5; padding: 20px;">Aucune expedition en cours</div>';
            return;
        }
        
        list.innerHTML = '';
        
        shipments.forEach(shipment => {
            const now = Date.now();
            const progress = ((now - shipment.departureTime) / (shipment.arrivalTime - shipment.departureTime)) * 100;
            const timeLeft = Math.ceil((shipment.arrivalTime - now) / (1000 * 60 * 60 * 24));
            
            const card = document.createElement('div');
            card.className = 'shipment-card';
            card.innerHTML = `
                <div class="shipment-header">
                    <div>
                        <div style="font-weight: 900;">${DerivativesManager.DERIVATIVES[shipment.derivativeType].name}</div>
                        <div style="font-size: 0.7rem; opacity: 0.6;">${shipment.amount}kg → ${ExportManager.DESTINATIONS[shipment.destination].name}</div>
                    </div>
                    <div class="shipment-status">En Transit</div>
                </div>
                <div style="margin: 10px 0;">
                    <div style="font-size: 0.7rem; opacity: 0.6;">Valeur: ${shipment.price.toLocaleString()} FCFA</div>
                    <div style="font-size: 0.7rem; opacity: 0.6;">Arrivee dans ${timeLeft} jour${timeLeft > 1 ? 's' : ''}</div>
                </div>
                <div class="shipment-progress">
                    <div class="shipment-progress-bar" style="width: ${Math.min(100, progress)}%"></div>
                </div>
            `;
            list.appendChild(card);
        });
    }
    
    function updateExportHistory() {
        const history = document.getElementById('export-history');
        if (!history) return;
        
        const exports = ExportManager.getExportHistory(10);
        
        if (exports.length === 0) {
            history.innerHTML = '<div style="text-align: center; opacity: 0.5; padding: 20px;">Aucune exportation</div>';
            return;
        }
        
        history.innerHTML = '';
        exports.reverse().forEach(exp => {
            const div = document.createElement('div');
            div.style.cssText = 'padding: 10px; border-bottom: 1px solid var(--border); font-size: 0.75rem;';
            div.innerHTML = `
                <div style="font-weight: 600;">${DerivativesManager.DERIVATIVES[exp.derivativeType].name} → ${ExportManager.DESTINATIONS[exp.destination].name}</div>
                <div style="opacity: 0.6;">${exp.amount}kg - ${exp.price.toLocaleString()} FCFA</div>
            `;
            history.appendChild(div);
        });
    }
    
    /* PANEL STATISTIQUES */
    function updateStatsPanel() {
        updateStatsOverview();
        updateStatsProduction();
        updateStatsExports();
    }
    
    function updateStatsOverview() {
        const overview = document.getElementById('stats-overview');
        if (!overview) return;
        
        const money = GameState.get('money');
        const level = GameState.get('lvl');
        const stockValue = DerivativesManager.getStockValue();
        const buildingStats = BuildingsManager.getStats();
        
        overview.innerHTML = `
            <div class="stat-card">
                <div class="stat-card-label">Capital Total</div>
                <div class="stat-card-value">${Math.floor(money).toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-label">Valeur Stock</div>
                <div class="stat-card-value">${Math.floor(stockValue).toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-label">Batiments</div>
                <div class="stat-card-value">${buildingStats.totalBuildings}</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-label">Production/h</div>
                <div class="stat-card-value">${buildingStats.totalProduction}</div>
            </div>
        `;
    }
    
    function updateStatsProduction() {
        const production = document.getElementById('stats-production');
        if (!production) return;
        
        const stats = DerivativesManager.getProductionStats();
        
        production.innerHTML = `
            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; margin-top: 10px;">
                <div style="font-size: 0.8rem; margin-bottom: 10px;">Transformations totales: <strong>${stats.totalTransformations}</strong></div>
                <div style="font-size: 0.8rem;">Ventes totales: <strong>${stats.totalSales}</strong></div>
            </div>
        `;
    }
    
    function updateStatsExports() {
        const exports = document.getElementById('stats-exports');
        if (!exports) return;
        
        const stats = ExportManager.getStats();
        
        exports.innerHTML = `
            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; margin-top: 10px;">
                <div style="font-size: 0.8rem; margin-bottom: 10px;">Exportations: <strong>${stats.totalExports}</strong></div>
                <div style="font-size: 0.8rem; margin-bottom: 10px;">Revenus: <strong>${stats.totalRevenue.toLocaleString()} FCFA</strong></div>
                <div style="font-size: 0.8rem;">En cours: <strong>${stats.activeShipments}</strong></div>
            </div>
        `;
    }
    
    /* Mettre a jour tous les panels */
    function updateAll() {
        updateActivePanel();
    }
    
    /* Initialiser */
    function init() {
        initTabs();
        ErrorHandler.handleInfo('AdvancedUIManager initialise');
    }
    
    /* Interface publique */
    return {
        init,
        switchTab,
        updateAll,
        updateDerivativesPanel,
        updateBuildingsPanel,
        updateExportPanel,
        updateStatsPanel
    };
})();

/* Fonctions globales pour les boutons */
function sellDerivative(type) {
    const stock = DerivativesManager.getStock();
    const amount = stock[type] || 0;
    
    if (amount > 0) {
        const value = DerivativesManager.sellDerivative(type, amount);
        UIManager.showToast(`Vendu pour ${value.toLocaleString()} FCFA !`);
        AdvancedUIManager.updateAll();
        UIManager.updateAll();
    }
}

function transformCotton() {
    const input = document.getElementById('cotton-amount');
    const amount = parseInt(input.value) || 0;
    
    if (amount > 0) {
        DerivativesManager.transformCotton(amount);
        UIManager.showToast('Coton egrene !');
        AdvancedUIManager.updateDerivativesPanel();
    }
}

function transformSeeds() {
    const input = document.getElementById('seed-amount');
    const amount = parseInt(input.value) || 0;
    
    if (amount > 0) {
        const result = DerivativesManager.transformSeeds(amount);
        if (result) {
            UIManager.showToast('Graines triturees !');
            AdvancedUIManager.updateDerivativesPanel();
        }
    }
}

function transformFiber() {
    const input = document.getElementById('fiber-amount');
    const amount = parseInt(input.value) || 0;
    
    if (amount > 0) {
        const result = DerivativesManager.transformFiber(amount);
        if (result) {
            UIManager.showToast('Textile file !');
            AdvancedUIManager.updateDerivativesPanel();
        }
    }
}

function purchaseBuilding(type) {
    const success = BuildingsManager.purchase(type);
    if (success) {
        UIManager.updateAll();
        AdvancedUIManager.updateBuildingsPanel();
    }
}
