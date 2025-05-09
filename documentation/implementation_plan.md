# Plan d’Implémentation : Simulateur de Positions de Trading (Crypto)

## 1. Aperçu

**Objectif** : Ce document décrit le plan d’implémentation pour le développement de l’application web **Simulateur de Positions de Trading (Crypto)**, une application client-side construite avec **React**, **Vite**, **TypeScript**, et **TailwindCSS**. Il détaille les étapes, les tâches, les priorités, les dépendances, et les critères d’acceptation pour livrer une application fonctionnelle, accessible, et bilingue, respectant les exigences du cahier des charges (simulation de trading, ≤ 50 trades, UI responsive).

**Portée** :

- Développement de l’UI (formulaire, tableau, carte résumé).
- Implémentation des calculs (trades, frais, ROI) et validations.
- Intégration de react-toastify (notifications), react-i18next (i18n), et Vitest (tests).
- Respect des conventions (voir `cursor_project_rules.md`, `frontend_guidelines_document.md`).

## 2. Étapes d’Implémentation

### 2.1. Phase 1 : Initialisation du Projet

**Objectif** : Configurer l’environnement de développement et la structure initiale.
**Tâches** :

1. Initialiser le projet avec Vite :
   - Commande : `npm create vite@latest trading-simulator -- --template react-ts`.
   - Installer dépendances : React, TypeScript, TailwindCSS, react-toastify, react-i18next, Vitest.
2. Configurer TailwindCSS :
   - Ajouter `tailwind.config.js` et `index.css` (palette bleu/gris).
   - Configurer purge pour optimiser le build.
3. Configurer ESLint/Prettier :
   - Règles TypeScript/React (voir `cursor_project_rules.md`).
   - Script : `npm run lint` et `npm run format`.
4. Configurer Vitest :
   - Ajouter `vitest.config.ts` et scripts (`npm run test`).
5. Créer la structure des fichiers :
   - Répertoires : `src/components/`, `src/utils/`, `src/tests/`, `src/i18n/` (voir `backend_structure_document.md`).

**Dépendances** : Aucune.

**Priorité** : Élevée (base du projet).

**Critères d’Acceptation** :

- Projet lancé avec `npm run dev` (localhost:5173).
- TailwindCSS appliqué (ex. : bouton bleu avec `bg-blue-600`).
- ESLint/Prettier fonctionnels sans erreurs.
- Vitest configuré, test vide passant.
- Structure des fichiers créée.
  **Durée Estimée** : 1-2 jours (1 développeur).

### 2.2. Phase 2 : Définition des Types et Utilitaires

**Objectif** : Définir les interfaces TypeScript et les utilitaires de base.
**Tâches** :

1. Créer `src/utils/types.ts` :
   - Interfaces : `InputParameters`, `Trade`, `Summary` (voir `backend_structure_document.md`).
2. Implémenter `src/utils/calculations.ts` :
   - Fonctions : `calculateTrade`, `simulateTrades`, `calculateSummary`.
   - Inclure calcul des frais (maker, taker, financement basé sur durée).
3. Implémenter `src/utils/validations.ts` :
   - Fonctions : `validateCommonParams`, `validateVariant1`, `validateVariant2`, `checkUnrealisticInput`.
   - Gérer toasts pour erreurs critiques.
4. Écrire tests unitaires :
   - `src/tests/calculations.test.ts` : Tester calculs (ex. : gain net).
   - `src/tests/validations.test.ts` : Tester cas limites (ex. : solde < 100 $).

**Dépendances** : Phase 1 (Vitest configuré).

**Priorité** : Élevée (logique métier critique).

**Critères d’Acceptation** :

- Interfaces TypeScript sans erreurs.
- Calculs conformes à l’exemple du cahier des charges (ex. : trade avec levier 10x).
- Validations bloquent saisies irréalistes (ex. : `solde × levier < 100 $`).
- Couverture Vitest ≥ 90 % pour `calculations.ts` et `validations.ts`.

**Durée Estimée** : 3-4 jours (1 développeur).

### 2.3. Phase 3 : Développement du Formulaire

**Objectif** : Implémenter le formulaire pour Variante 1 et Variante 2.
**Tâches** :

1. Créer `src/components/InputForm.tsx` :
   - Onglets pour Variante 1/2 (TailwindCSS, `bg-blue-600` pour actif).
   - Champs communs : Solde Total, Levier, Stop-Loss, etc.
   - Variante 1 : Nombre de Trades, liste dynamique Prix d’Entrée.
   - Variante 2 : Prix d’Entrée Initial, liste dynamique Pourcentages de Baisse.
2. Ajouter `src/components/ErrorMessage.tsx` :
   - Afficher erreurs inline (ex. : `text-red-400`).
3. Intégrer validations :
   - Appeler `validations.ts` en temps réel (`useEffect`).
   - Désactiver bouton « Simuler » si erreurs.
4. Configurer react-toastify :
   - Toasts pour erreurs critiques (ex. : solde < 100 $).
   - Style : `bg-gray-800 text-white border-blue-600`.
5. Ajouter infobulles :
   - `src/components/Tooltip.tsx` (activées au clic).
   - Exemple : « Levier : Multiplie la taille… ».
6. Écrire tests :
   - `src/tests/InputForm.test.ts` : Tester saisie, erreurs, toasts.

**Dépendances** : Phase 2 (types, validations).

**Priorité** : Élevée (interface utilisateur principale).

**Critères d’Acceptation** :

- Formulaire responsive (desktop/mobile, min 320px).
- Validations en temps réel avec erreurs inline/toasts.
- Infobulles fonctionnelles au clic.
- Bouton « Simuler » activé/désactivé correctement.
- Tests Vitest passent pour `InputForm.tsx`.

**Durée Estimée** : 4-5 jours (1 développeur).

### 2.4. Phase 4 : Développement des Résultats

**Objectif** : Implémenter le tableau et la carte résumé.
**Tâches** :

1. Créer `src/components/TradeTable.tsx` :
   - 10 colonnes : Numéro Trade, Symbole, Prix d’Entrée, etc.
   - Triable par colonne (icônes flèches).
   - Défilement vertical (≤ 50 trades).
   - Couleurs : Pertes (`text-red-500`), Profits (`text-green-500`).
2. Créer `src/components/SummaryCard.tsx` :
   - Afficher Solde Final, Pertes Cumulées, Gains Totaux, ROI (%).
   - Style : `bg-white rounded-lg shadow`.
3. Intégrer calculs :
   - Appeler `simulateTrades` et `calculateSummary` depuis `InputForm.tsx`.
   - Passer résultats à `TradeTable` et `SummaryCard`.
4. Écrire tests :
   - `src/tests/TradeTable.test.ts` : Tester tri, affichage.
   - `src/tests/SummaryCard.test.ts` : Tester données.

**Dépendances** : Phase 3 (formulaire, calculs).

**Priorité** : Moyenne (dépend de l’UI principale).

**Critères d’Acceptation** :

- Tableau responsive, triable, avec défilement.
- Carte résumé affiche données correctes (ex. : ROI calculé).
- Couleurs conditionnelles appliquées.
- Tests Vitest passent pour `TradeTable` et `SummaryCard`.

**Durée Estimée** : 3-4 jours (1 développeur).

### 2.5. Phase 5 : Internationalisation

**Objectif** : Ajouter le support bilingue (français/anglais).
**Tâches** :

1. Configurer react-i18next :
   - Créer `src/i18n.ts` et `src/i18n/fr.json`, `en.json`.
   - Clés : `labels.balance`, `errors.insufficientBalance`, etc.
2. Intégrer dans les composants :

   - Utiliser `useTranslation` pour labels, erreurs, toasts.
   - Exemple :

     ```tsx
     const { t } = useTranslation();
     <label>{t("labels.balance")}</label>;
     ```

3. Ajouter sélecteur de langue devant le toggle dark/light mode:
   - Menu déroulant dans l’en-tête (ex. : FR/EN).
4. Tester traductions :
   - Vérifier français et anglais pour tous les textes.

**Dépendances** : Phase 3 (formulaire), Phase 4 (résultats).

**Priorité** : Moyenne (fonctionnalité secondaire).

**Critères d’Acceptation** :

- Tous les textes traduits (français/anglais).
- Toasts et erreurs traduits dynamiquement.
- Changement de langue sans rechargement.

**Durée Estimée** : 2-3 jours (1 développeur).

### 2.6. Phase 6 : Accessibilité

**Objectif** : Garantir la conformité WCAG.
**Tâches** :

1. Ajouter ARIA :
   - `aria-label` pour inputs (ex. : `Solde Total`).
   - `aria-describedby` pour erreurs.
   - `aria-sort` pour colonnes triables.
2. Supporter navigation clavier :
   - Tabulation pour onglets, champs, boutons.
   - Focus visible : `focus:ring-2 focus:ring-blue-600`.
3. Tester avec lecteurs d’écran :
   - Utiliser NVDA ou VoiceOver.
   - Vérifier toasts et infobulles.
4. Vérifier contrastes :
   - Utiliser Lighthouse ou WebAIM Contrast Checker.

**Dépendances** : Phase 3 (formulaire), Phase 4 (résultats).

**Priorité** : Moyenne (exigence non fonctionnelle).

**Critères d’Acceptation** :

- Navigation clavier fluide.
- ARIA labels sur tous les éléments interactifs.
- Contrastes conformes WCAG (ratio ≥ 4.5:1).
- Toasts annoncés par lecteurs d’écran.

  **Durée Estimée** : 2-3 jours (1 développeur).

### 2.7. Phase 7 : Tests et Validation

**Objectif** : Valider l’application et assurer la qualité.
**Tâches** :

1. Compléter tests unitaires :
   - Couverture ≥ 90 % pour `calculations.ts`, `validations.ts`, `InputForm.tsx`.
2. Tester manuellement :
   - Simuler trades pour Variante 1 et 2.
   - Vérifier erreurs (inline, toasts).
   - Tester responsive (mobile 320px, desktop).
3. Configurer CI :
   - GitHub Actions pour tests/linting sur push.
4. Corriger bugs identifiés.

**Dépendances** : Toutes les phases précédentes.

**Priorité** : Élevée (livraison finale).

**Critères d’Acceptation** :

- Tous les tests Vitest passent.
- Simulation correcte pour cas nominaux et limites.
- UI responsive et accessible.
- CI configuré, aucun bug critique.

**Durée Estimée** : 3-4 jours (1 développeur).

### 2.8. Phase 8 : Documentation et Build

**Objectif** : Finaliser la documentation et préparer le build.
**Tâches** :

1. Mettre à jour `README.md` :
   - Instructions d’installation, lancement, structure.
   - Glossaire (ex. : « Levier », « Toast »).
2. Compléter documentation :
   - Vérifier `SPECIFICATION.md`, `app_flow_document.md`, `backend_structure_document.md`, `frontend_guidelines_document.md`, `cursor_project_rules.md`.
3. Générer build de production :
   - Commande : `npm run build`.
   - Vérifier bundle size (`--report`).
4. Tester build :
   - Déployer localement (ex. : `npx serve dist`).

**Dépendances** : Phase 7 (tests validés).

**Priorité** : Moyenne (finalisation).

**Critères d’Acceptation** :

- `README.md` clair et complet.
- Build de production sans erreurs.
- Application fonctionnelle dans l’environnement de production.

**Durée Estimée** : 2 jours (1 développeur).

## 3. Résumé du Plan

- **Durée Totale Estimée** : 20-27 jours (1 développeur, sans parallélisation).
- **Phases Critiques** : Phases 1-3 (initialisation, types, formulaire) pour prototype fonctionnel.
- **Priorisation** :
  - Élevée : Phases 1, 2, 3, 7 (base technique, UI principale, validation).
  - Moyenne : Phases 4, 5, 6, 8 (résultats, i18n, accessibilité, documentation).
- **Ressources** : 1-2 développeurs (React/TypeScript), outils (VS Code/Cursor, GitHub).

## 4. Hypothèses

- Un développeur familier avec React/TypeScript.
- Aucun backend requis (client-side).
- Environnement de développement stable (Node.js ≥ 18, npm/yarn).
- Tests manuels suffisants pour validation initiale.

## 5. Glossaire

- **Vite** : Outil\* Outil de build rapide pour React.
- **TailwindCSS** : Framework CSS utilitaire.
- **react-toastify** : Bibliothèque pour notifications.
- **react-i18next** : Bibliothèque pour internationalisation.
- **Vitest** : Outil de test pour Vite.
- **ARIA** : Attributs pour accessibilité.
