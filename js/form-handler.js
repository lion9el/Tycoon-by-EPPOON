/* ========================================
   MODULE: FORM HANDLER
   Gestion du formulaire d'inscription
   ======================================== */

const FormHandler = (() => {

    /* Valider le formulaire */
    function validate() {
        const nameIn = document.getElementById('in-name');
        const compIn = document.getElementById('in-comp');
        
        let hasError = false;
        
        const nameValue = nameIn ? nameIn.value.trim() : '';
        const compValue = compIn ? compIn.value.trim() : '';
        
        /* Validation du nom */
        if (!nameValue || nameValue.length < 2) {
            UIManager.showError('err-name');
            hasError = true;
        } else {
            UIManager.hideError('err-name');
        }

        /* Validation de l'entreprise */
        if (!compValue || compValue.length < 2) {
            UIManager.showError('err-comp');
            hasError = true;
        } else {
            UIManager.hideError('err-comp');
        }

        return !hasError;
    }

    /* Soumettre le formulaire */
    function submit() {
        const nameIn = document.getElementById('in-name');
        const compIn = document.getElementById('in-comp');
        const bankIn = document.getElementById('in-bank');
        const btnGo = document.getElementById('btn-go');
        
        /* Valider */
        if (!validate()) return false;

        /* Desactiver le bouton */
        if (btnGo) btnGo.disabled = true;

        /* Sauvegarder les donnees */
        GameState.update({
            name: nameIn.value.trim(),
            comp: compIn.value.trim(),
            bank: bankIn ? bankIn.value : 'uba'
        });

        /* Mettre a jour l'UI */
        UIManager.updateUserInfo();

        /* Transition vers le jeu */
        transitionToGame();
        
        return true;
    }

    /* Transition du formulaire vers le jeu */
    function transitionToGame() {
        const reg = document.getElementById('registration-screen');
        const game = document.getElementById('main-game');
        
        if (reg) reg.style.opacity = '0';
        
        setTimeout(() => {
            if (reg) reg.style.display = 'none';
            if (game) game.style.display = 'flex';
            
            setTimeout(() => {
                if (game) game.style.opacity = '1';
                UIManager.updateAll();
            }, 50);
        }, 1000);
    }

    /* Afficher le formulaire */
    function show() {
        const reg = document.getElementById('registration-screen');
        if (reg) {
            reg.style.display = 'flex';
            setTimeout(() => {
                reg.style.opacity = '1';
            }, 100);
        }
    }

    /* Interface publique */
    return {
        validate,
        submit,
        show
    };
})();
