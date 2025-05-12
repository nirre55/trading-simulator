# Simulateur de Trading

Un simulateur interactif pour planifier et analyser des stratégies de trading en fonction de différents points d'entrée, avec support pour la récupération de pertes.

## Fonctionnalités

- **Deux modes de simulation :**
  - **Entrée manuelle** : Définissez directement vos prix d'entrée
  - **Entrée calculée** : Générez automatiquement des prix d'entrée à partir d'un prix initial et de pourcentages de baisse

- **Calculs avancés :**
  - Calcul du risque total et du profit potentiel
  - Détermination du ratio risque/récompense
  - Estimation des frais (maker, taker, financement)
  - Calcul des prix de liquidation
  - Support pour le mode de récupération de pertes

- **Interface utilisateur :**
  - Interface moderne et réactive avec TailwindCSS
  - Mode clair/sombre
  - Support multilingue (français et anglais)
  - Affichage détaillé des trades dans un tableau
  - Validation des entrées utilisateur

## Technologies

- **Frontend :** React 18 avec TypeScript
- **Build :** Vite
- **Styles :** TailwindCSS
- **Tests :** Vitest et Testing Library
- **Internationalisation :** i18next

## Structure du Code

- `src/components/` : Composants React organisés par catégorie
  - `features/` : Composants principaux (SimulationResults, TradeDetailsTable, etc.)
  - `forms/` : Formulaires et champs d'entrée
  - `layout/` : Structure de page et navigation
  - `ui/` : Composants UI réutilisables

- `src/utils/` : Logique métier et calculs
  - `calculationTypes.ts` : Types et fonctions de calcul communes
  - `calculations.ts` : Point d'entrée pour les calculs
  - `manualCalculations.ts` : Calculs pour le mode manuel
  - `calculatedCalculations.ts` : Calculs pour le mode calculé
  - `validations.ts` : Validation des entrées

- `src/i18n/` : Fichiers de traduction et configuration

## Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Exécuter les tests
npm test
```

## Mode Récupération de Perte

Le simulateur prend en charge deux stratégies de trading :

1. **Sans récupération :** Chaque trade est indépendant, avec son propre profit cible basé uniquement sur son montant.

2. **Avec récupération :** Chaque trade suivant vise à récupérer les pertes potentielles des trades précédents. Le profit cible est ajusté en conséquence.

## Exemples d'utilisation

### Mode Manuel

1. Sélectionnez l'onglet "Points d'entrée manuels"
2. Définissez les paramètres communs (solde, levier, stop-loss, etc.)
3. Ajoutez vos prix d'entrée manuellement
4. Cliquez sur "Simuler" pour voir les résultats

### Mode Calculé

1. Sélectionnez l'onglet "Points d'entrée calculés"
2. Définissez les paramètres communs
3. Entrez un prix d'entrée initial et un pourcentage de baisse
4. Cliquez sur "Simuler" pour générer automatiquement les points d'entrée et voir les résultats

## Tests

Le projet inclut une suite complète de tests unitaires et d'intégration pour garantir le bon fonctionnement des calculs et des composants UI.

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests avec couverture
npm test -- --coverage
```

## Développement

Pour contribuer au projet, assurez-vous de :

1. Maintenir la couverture de tests
2. Mettre à jour les fichiers de traduction pour toute nouvelle fonctionnalité
3. Suivre les conventions de code existantes
