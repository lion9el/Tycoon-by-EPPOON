# TYCOON - BENIN EDITION
### Application Professionnelle de Jeu - Version 1.0.0

## DESCRIPTION

Application de jeu de type clicker avec architecture modulaire professionnelle, gestion avancee des erreurs, validation des donnees et persistance securisee.

---

## STRUCTURE DU PROJET

```
Acceuil/
├── index.html                     # Point d'entree de l'application
├── README.md                      # Ce fichier
│
├── css/                           # Modules CSS
│   ├── global.css                 # Variables globales et styles de base
│   ├── splash-animations.css      # Animations du splash screen
│   ├── registration-form.css      # Styles du formulaire d'inscription
│   ├── bank-card.css             # Styles de la carte bancaire
│   └── game-interface.css        # Interface de jeu principale
│
├── js/                           # Modules JavaScript
│   ├── config.js                 # Configuration centrale
│   ├── error-handler.js          # Gestion centralisee des erreurs
│   ├── validator.js              # Validation des donnees
│   ├── game-state.js             # Gestion de l'etat du jeu
│   ├── ui-manager.js             # Gestion de l'interface
│   ├── click-handler.js          # Gestion des clics
│   ├── level-manager.js          # Gestion des niveaux
│   ├── form-handler.js           # Gestion du formulaire
│   ├── splash.js                 # Gestion du splash screen
│   └── main.js                   # Coordination generale
│
├── assets/                       # Ressources (images, sons, etc.)
└── tests/                        # Tests (pour developpement futur)
```

---

## FONCTIONNALITES PRINCIPALES

### Fonctionnalites de Base
- Systeme de clics avec gains progressifs
- 10 niveaux de progression
- 6 banques partenaires (UBA, Ecobank, BOA, NSIA, SGB, BGFI)
- Carte bancaire animee et personnalisee
- Systeme de progression par clics et achats

### Fonctionnalites Avancees
- Sauvegarde automatique toutes les 5 secondes
- Sauvegarde avant fermeture du navigateur
- Validation complete des donnees
- Gestion centralisee des erreurs
- Protection anti-spam des clics (50ms cooldown)
- Animations optimisees (max 10 simultanées)
- Reprise automatique de session
- Interface responsive (mobile et desktop)

### Fonctionnalites Techniques
- Architecture modulaire SOLID
- Isolation des erreurs par module
- Validation des entrees utilisateur
- Sanitization des donnees de sauvegarde
- Logging des erreurs critiques
- Health check de l'application
- Mode debug (Ctrl+Shift+D)

---

## ARCHITECTURE MODULAIRE

### Principe de Separation des Responsabilites

Chaque module a UNE et UNE SEULE responsabilite :

1. **config.js** - Configuration et constantes
2. **error-handler.js** - Gestion des erreurs
3. **validator.js** - Validation des donnees
4. **game-state.js** - Etat du jeu
5. **ui-manager.js** - Interface utilisateur
6. **click-handler.js** - Gestion des clics
7. **level-manager.js** - Gestion des niveaux
8. **form-handler.js** - Formulaire
9. **splash.js** - Ecran de chargement
10. **main.js** - Coordination

### Flux de Dependances

```
config.js (base, aucune dependance)
  ↓
error-handler.js (depend de: rien)
  ↓
validator.js (depend de: config, error-handler)
  ↓
game-state.js (depend de: config, error-handler, validator)
  ↓
ui-manager.js (depend de: game-state, error-handler)
  ↓
click-handler.js (depend de: game-state, ui-manager, config, error-handler)
level-manager.js (depend de: game-state, ui-manager, config, error-handler)
form-handler.js (depend de: game-state, ui-manager, validator, error-handler)
splash.js (depend de: config, error-handler)
  ↓
main.js (coordonne TOUS les modules)
```

### ORDRE D'IMPORTATION CRITIQUE

L'ordre dans index.html est OBLIGATOIRE :

```html
1. config.js           (configuration de base)
2. error-handler.js    (gestion d'erreurs)
3. validator.js        (validation)
4. game-state.js       (etat du jeu)
5. ui-manager.js       (interface)
6. click-handler.js    (clics)
7. level-manager.js    (niveaux)
8. form-handler.js     (formulaire)
9. splash.js           (splash screen)
10. main.js            (coordination)
```

**ATTENTION :** Modifier cet ordre causera des erreurs !

---

## GESTION DES ERREURS

### Systeme de Logging

Trois niveaux d'erreurs :
- **CRITICAL** : Erreurs graves (affichees a l'utilisateur)
- **WARNING** : Avertissements (logges seulement)
- **INFO** : Informations (logges seulement)

### Health Check

La fonction `ErrorHandler.checkHealth()` verifie :
- Disponibilite de localStorage
- Presence de tous les modules
- Nombre d'erreurs totales
- Nombre d'erreurs critiques

### Mode Debug

Appuyez sur **Ctrl+Shift+D** pour afficher :
- Version de l'application
- Etat complet du jeu
- Sante de l'application
- Historique des erreurs

---

## VALIDATION DES DONNEES

### Validation des Entrees

- **Nom** : 2-30 caracteres, lettres et accents uniquement
- **Entreprise** : 2-40 caracteres, lettres, chiffres et symboles &'-
- **Banque** : Doit etre dans la liste des banques valides
- **Argent** : Nombre positif ou nul
- **Niveau** : Entre 1 et 10
- **Clics** : Nombre positif ou nul

### Sanitization

Toutes les donnees sont nettoyees avant sauvegarde :
- Suppression des espaces superflus
- Conversion des types
- Verification des limites
- Structure garantie

---

## INSTALLATION

### Methode 1 : Ouvrir Directement

1. Telechargez le dossier `Acceuil`
2. Double-cliquez sur `index.html`
3. Le jeu se lance dans votre navigateur

### Methode 2 : Serveur Local

```bash
# Avec Python
cd Acceuil
python -m http.server 8000
# Ouvrir http://localhost:8000

# Avec Node.js
npx http-server
```

---

## UTILISATION

### Premiere Utilisation

1. Attendez le splash screen (17 secondes)
2. Remplissez le formulaire :
   - Votre nom
   - Nom de votre entreprise
   - Choisissez une banque
3. Cliquez sur "Demarrer"
4. Cliquez sur le symbole $ pour gagner de l'argent
5. Atteignez la cible de clics pour debloquer l'upgrade
6. Montez de niveau pour augmenter vos gains

### Reprendre une Session

Si vous avez deja joue :
1. Ouvrez l'application
2. Attendez le splash screen
3. Votre progression se charge automatiquement

### Reinitialiser

Cliquez sur "Reinitialiser" dans la barre du bas pour recommencer.

---

## GUIDE DE DEBUGGING

### Probleme avec l'argent ?
**Fichiers a verifier :**
- `js/game-state.js` (fonction set)
- `js/click-handler.js` (fonction handleClick)
- `js/validator.js` (fonction validateNumber)

### Probleme avec les niveaux ?
**Fichiers a verifier :**
- `js/level-manager.js` (fonction upgrade)
- `js/game-state.js` (fonctions getCurrentLevel, getNextLevel)

### Probleme d'affichage ?
**Fichiers a verifier :**
- `js/ui-manager.js` (toutes les fonctions update)
- `css/` (fichiers CSS correspondants)

### Probleme de sauvegarde ?
**Fichiers a verifier :**
- `js/game-state.js` (fonctions save/load)
- `js/validator.js` (fonction sanitizeSaveData)
- Console du navigateur (erreurs localStorage)

### Probleme avec le formulaire ?
**Fichiers a verifier :**
- `js/form-handler.js` (fonction validate)
- `js/validator.js` (fonctions validateName, validateCompany)
- `css/registration-form.css`

---

## PERSONNALISATION

### Modifier les Couleurs

Editez `css/global.css` :

```css
:root {
    --accent: #00ff95;  /* Couleur principale */
    --bg: #000000;      /* Fond */
}
```

### Modifier les Niveaux

Editez `js/config.js` :

```javascript
const LEVELS = [
    { cost: 0, gain: 100 },
    // Ajoutez vos niveaux ici
];
```

### Ajouter une Banque

Editez `js/config.js` :

```javascript
const BANKS = {
    nouvelle: { 
        name: 'Nouvelle Banque', 
        color: 'linear-gradient(...)', 
        code: 'NOU' 
    }
};
```

Puis editez `index.html` pour ajouter l'option dans le select.

### Modifier les Animations

Editez `css/splash-animations.css` (ATTENTION : animations complexes !)

---

## COMPATIBILITE

### Navigateurs Supportes
- Chrome / Edge (recommande)
- Firefox
- Safari
- Opera

### Appareils Supportes
- Desktop (Windows, Mac, Linux)
- Mobile (iOS, Android)
- Tablette

### Prerequis
- JavaScript active
- localStorage disponible
- Connexion internet (pour les fonts Google)

---

## SECURITE

### Protection des Donnees
- Validation stricte de toutes les entrees
- Sanitization avant sauvegarde
- Pas de code injectable
- Pas d'eval() ou de Function()

### Gestion des Erreurs
- Try/catch sur toutes les operations sensibles
- Logging des erreurs critiques
- Fallbacks pour operations echouees

---

## PERFORMANCE

### Optimisations
- Cache des elements DOM
- Pool d'animations limite (10 max)
- Cooldown anti-spam (50ms)
- Sauvegarde throttled (5 secondes)

### Taille des Fichiers
- CSS total : ~11 KB
- JS total : ~29 KB
- HTML : ~5 KB
- **Total : ~45 KB** (tres leger !)

---

## ROADMAP FUTURE

### Version 1.1
- Systeme de succes
- Statistiques detaillees
- Graphiques de progression

### Version 1.2
- Mode multijoueur
- Classements
- Evenements speciaux

### Version 2.0
- Shop d'ameliorations
- Mini-jeux
- Themes personnalisables

---

## SUPPORT

### En cas de probleme

1. Ouvrez la console du navigateur (F12)
2. Verifiez les erreurs affichees
3. Utilisez le mode debug (Ctrl+Shift+D)
4. Consultez la section "Guide de Debugging"

### Rapporter un Bug

Incluez dans votre rapport :
- Version du navigateur
- Systeme d'exploitation
- Etapes pour reproduire
- Messages d'erreur
- Export de l'etat (Ctrl+Shift+D)

---

## LICENCE

Code libre d'utilisation et de modification.
Cree avec passion pour le Benin.

---

## CREDITS

**Version :** 1.0.0
**Date :** Fevrier 2026
**Equipe :** Tycoon Development Team

---

**NOTE IMPORTANTE :** Cette application est concue pour etre EXTENSIBLE, MAINTENABLE et FONCTIONNELLE. L'architecture modulaire permet d'ajouter facilement de nouvelles fonctionnalites sans casser l'existant.
