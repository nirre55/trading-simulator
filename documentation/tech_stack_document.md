# Pile Technologique : Simulateur de Positions de Trading (Crypto)

## 1. Aperçu

**Objectif** : Ce document décrit la pile technologique utilisée pour le développement de l’application web **Simulateur de Positions de Trading (Crypto)**, une application client-side qui simule des stratégies de trading crypto à effet de levier. Il détaille chaque technologie, son rôle, sa version recommandée, et les raisons de son choix, en respectant les exigences du projet (UI responsive, bilingue, accessible, calculs client-side).

**Portée** :

- Technologies frontend : React, Vite, TypeScript, TailwindCSS.
- Bibliothèques : react-toastify (notifications), react-i18next (internationalisation).
- Tests : Vitest.
- Alignement avec les conventions définies dans `frontend_guidelines_document.md`, `cursor_project_rules.md`, et `project_requirements_document.md`.

## 2. Technologies Principales

### 2.1. React

- **Rôle** : Framework JavaScript pour construire l’interface utilisateur (UI) via des composants réutilisables.
- **Version Recommandée** : Dernière stable.
- **Utilisation** :
  - Création de composants comme `InputForm.tsx`, `TradeTable.tsx`, `SummaryCard.tsx` (voir `backend_structure_document.md`).
  - Gestion de l’état avec hooks (`useState`, `useEffect`).
  - Optimisation via `React.memo` et `useMemo` pour ≤ 50 trades.
- **Raison du Choix** :
  - Écosystème riche et performant pour Single Page Applications (SPA).
  - Support des hooks pour une gestion d’état simple et localisée.
  - Large communauté, compatible avec TypeScript et Vite.
- **Références** :
  - Conventions : `frontend_guidelines_document.md` (section 4).
  - Structure : `backend_structure_document.md` (section 4).

### 2.2. Vite

- **Rôle** : Outil de build et serveur de développement pour une configuration rapide et un bundling optimisé.
- **Version Recommandée** : Dernière stable.
- **Utilisation** :
  - Initialisation du projet : `npm create vite@latest -- --template react-ts`.
  - Serveur de développement avec hot module replacement (HMR).
  - Build de production : `npm run build` avec rapport de bundle (`--report`).
- **Raison du Choix** :
  - Temps de démarrage et build plus rapides que Webpack.
  - Intégration native avec TypeScript et TailwindCSS.
  - Support de Vitest pour tests unitaires.
- **Références** :
  - Plan : `implementation_plan.md` (phase 1).
  - Optimisation : `frontend_guidelines_document.md` (section 9).

### 2.3. TypeScript

- **Rôle** : Langage pour ajouter un typage statique à JavaScript, garantissant la robustesse du code.
- **Version Recommandée** : Dernière stable.
- **Utilisation** :
  - Définition d’interfaces : `InputParameters`, `Trade`, `Summary` dans `src/utils/types.ts`.
  - Typage des props et fonctions (ex. : `calculateTrade` dans `calculations.ts`).
  - Éviter `any`, utiliser `unknown` si nécessaire.
- **Raison du Choix** :
  - Détection d’erreurs à la compilation (ex. : validations incorrectes).
  - Amélioration de la maintenabilité pour logique complexe (calculs de trades).
  - Intégration transparente avec React et Vite.
- **Références** :
  - Conventions : `cursor_project_rules.md` (section 2.1).
  - Structure : `backend_structure_document.md` (section 5.3).

### 2.4. TailwindCSS

- **Rôle** : Framework CSS utilitaire pour un styling rapide et responsive.
- **Version Recommandée** : Dernière stable.
- **Utilisation** :
  - Palette bleu/gris : `bg-blue-600`, `bg-gray-800`, `text-white` (voir `frontend_guidelines_document.md`).
  - Classes inline dans JSX (ex. : `<button className="bg-blue-600 text-white px-4 py-2 rounded">`).
  - Responsive : Breakpoints `sm`, `md` pour mobile (min 320px) et desktop.
  - Purge des classes inutilisées dans `vite.config.ts` pour bundle léger.
- **Raison du Choix** :
  - Productivité accrue grâce à des classes utilitaires.
  - Personnalisation facile via `tailwind.config.js` (ex. : palette).
  - Conformité WCAG pour contrastes (ex. : ratio ≥ 4.5:1).
- **Références** :
  - Guidelines : `frontend_guidelines_document.md` (section 3).
  - Accessibilité : `project_requirements_document.md` (section 5.1).

## 3. Bibliothèques Complémentaires

### 3.1. react-toastify

- **Rôle** : Bibliothèque pour afficher des notifications interactives (toasts).
- **Version Recommandée** : Dernière stable.
- **Utilisation** :
  - Notifications pour erreurs (ex. : « Solde trop faible : minimum 100 $ requis »).
  - Position : `bottom-right`, fermeture au clic (`autoClose: false`, `closeOnClick: true`).
  - Style : `bg-gray-800 text-white border-blue-600` via TailwindCSS.
  - Accessibilité : `ariaLabel` pour lecteurs d’écran.
- **Raison du Choix** :
  - Configuration simple et personnalisable.
  - Support des traductions via react-i18next.
  - Compatible avec navigation clavier et WCAG.
- **Références** :
  - Conventions : `frontend_guidelines_document.md` (section 7).
  - Exigences : `project_requirements_document.md` (section 3.2).

### 3.2. react-i18next

- **Rôle** : Bibliothèque pour l’internationalisation (support bilingue français/anglais).
- **Version Recommandée** : Dernière stable.
- **Utilisation** :
  - Fichiers de traduction : `src/i18n/fr.json`, `src/i18n/en.json`.
  - Clés structurées : `labels.balance`, `errors.insufficientBalance`.
  - Intégration dans composants via `useTranslation` :

    ```tsx
    const { t } = useTranslation();
    <label>{t('labels.balance')}</label>
    ```

  - Sélecteur de langue optionnel dans l’en-tête.
- **Raison du Choix** :
  - Gestion efficace des traductions statiques.
  - Intégration transparente avec React.
  - Support des langues multiples pour évolutivité.
- **Références** :
  - Conventions : `frontend_guidelines_document.md` (section 6).
  - Plan : `implementation_plan.md` (phase 5).

## 4. Tests

### 4.1. Vitest

- **Rôle** : Outil de test unitaire pour valider la logique métier et les composants.
- **Version Recommandée** : Dernière stable.
- **Utilisation** :
  - Tests dans `src/tests/` (ex. : `calculations.test.ts`, `InputForm.test.ts`).
  - Couverture ≥ 90 % pour `calculations.ts`, `validations.ts`, `InputForm.tsx`.
  - Intégration CI via GitHub Actions.
  - Exemple :

    ```tsx
    describe('calculateTrade', () => {
      it('computes net profit correctly', () => {
        const params = { balance: 1000, leverage: 10, /* ... */ };
        expect(calculateTrade(params, 1).netProfit).toBeCloseTo(950, 2);
      });
    });
    ```

- **Raison du Choix** :
  - Compatible avec Vite, rapide et léger.
  - Support des mocks pour react-toastify et react-i18next.
  - Couverture détaillée pour logique critique.
- **Références** :
  - Conventions : `cursor_project_rules.md` (section 3).
  - Plan : `implementation_plan.md` (phase 7).

## 5. Outils de Développement

### 5.1. Node.js

- **Rôle** : Environnement d’exécution pour Vite, tests, et scripts.
- **Version Recommandée** : Dernière stable.
- **Utilisation** :
  - Installation des dépendances : `npm install`.
  - Scripts : `npm run dev`, `npm run build`, `npm run test`.
- **Raison du Choix** :
  - Standard pour projets JavaScript/TypeScript.
  - Support robuste pour Vite et Vitest.

### 5.2. Git

- **Rôle** : Versionnement du code et collaboration.
- **Version Recommandée** : Dernière stable.
- **Utilisation** :
  - Dépôt : GitHub/GitLab.
  - Branches : `main`, `feature/*`.
  - Messages de commit : `<type>(<scope>): <description>` (ex. : `feat(form): add dynamic inputs`).
- **Raison du Choix** :
  - Standard pour gestion de code source.
  - Intégration CI/CD via GitHub Actions.

### 5.3. Éditeurs

- **Rôle** : Environnement de développement.
- **Recommandés** : VS Code ou Cursor.
- **Utilisation** :
  - Extensions : ESLint, Prettier, TailwindCSS IntelliSense.
  - Configuration TypeScript pour autocomplétion.
- **Raison du Choix** :
  - Support avancé pour TypeScript et React.
  - Productivité accrue avec TailwindCSS.

## 6. Intégration des Technologies

- **React + Vite** : Vite fournit un environnement rapide pour développer et bundler React.
- **TypeScript + React** : Typage strict pour composants et logique métier.
- **TailwindCSS + React** : Styling inline rapide, responsive, et accessible.
- **react-toastify + react-i18next** : Notifications traduites pour erreurs utilisateur.
- **Vitest + TypeScript** : Tests unitaires pour calculs et validations.
- **Git + CI** : Collaboration et validation automatisée.

## 7. Considérations Futures

- **Persistance** : Ajout de local storage ou API (Node.js/Express) pour sauvegarder simulations.
- **Données Temps Réel** : Intégration d’API crypto (ex. : Binance) pour prix dynamiques.
- **Bibliothèques** : Ajout de recharts pour visualisations graphiques.
- **Tests** : Ajout de tests E2E (ex. : Playwright).

## 8. Hypothèses

- Environnement Node.js stable (≥ 18.x).
- Développeurs familiers avec React/TypeScript.
- Pas de dépendances externes complexes (ex. : bases de données).

## 9. Glossaire

- **React** : Framework pour interfaces utilisateur.
- **Vite** : Outil de build et serveur de développement.
- **TypeScript** : Langage pour typage statique.
- **TailwindCSS** : Framework CSS utilitaire.
- **react-toastify** : Bibliothèque pour notifications.
- **react-i18next** : Bibliothèque pour internationalisation.
- **Vitest** : Outil de test unitaire.
