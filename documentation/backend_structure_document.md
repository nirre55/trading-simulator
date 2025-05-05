# Structure Logicielle : Simulateur de Positions de Trading (Crypto)

## 1. Aperçu

**Objectif** : Ce document décrit l’architecture logicielle et la structure du code de l’application **Simulateur de Positions de Trading (Crypto)**, une application web côté client développée avec **React**, **Vite**, **TypeScript**, et **TailwindCSS**. Étant donné l’absence de backend (pas d’API ou de persistance serveur), la structure se concentre sur l’organisation des composants React, la gestion des calculs, des validations, et de l’état côté client, ainsi que l’intégration des bibliothèques comme **react-toastify** et **react-i18next**.

**Portée** :

- Architecture modulaire pour les fonctionnalités de simulation de trading (Variante 1 : entrée manuelle, Variante 2 : calculée).
- Organisation des fichiers pour maintenir lisibilité et évolutivité.
- Gestion des calculs (trades, frais, ROI) et validations en TypeScript.
- Considérations pour une future intégration backend (ex. : API, persistance).

---

## 2. Architecture Générale

### 2.1. Vue d’Ensemble

L’application est une **Single Page Application (SPA)** exécutée entièrement dans le navigateur. Elle suit une architecture **composant-based** avec React, utilisant des **hooks** pour la gestion d’état et des **utilitaires TypeScript** pour les calculs et validations. Les données (entrées utilisateur, résultats) sont gérées en mémoire et ne sont pas persistantes.

- **Couches Principales** :
  - **Présentation (UI)** : Composants React pour le formulaire, le tableau, la carte résumé, et les toasts/infobulles.
  - **Logique Métier** : Fonctions TypeScript pour les calculs (prix sortie, liquidation, frais) et validations (solde, levier, etc.).
  - **Gestion d’État** : Hooks React (`useState`, `useEffect`) pour stocker et mettre à jour les entrées/résultats.
  - **Utilitaires** : Modules pour internationalisation (react-i18next), notifications (react-toastify), et types TypeScript.

- **Bibliothèques Externes** :
  - **react-toastify** : Notifications interactives (fermeture au clic).
  - **react-i18next** : Support bilingue (français/anglais).
  - **Vitest** : Tests unitaires pour calculs et validations.
  - **TailwindCSS** : Styling responsive (palette bleu/gris).

### 2.2. Principes d’Architecture

- **Modularité** : Chaque composant ou utilitaire a une responsabilité unique (ex. : `InputForm.tsx` pour le formulaire, `calculations.ts` pour la logique métier).
- **Typage Strict** : Utilisation de TypeScript pour des interfaces claires (ex. : `Trade`, `InputParameters`).
- **Performance** : Mémoïsation (`React.memo`, `useMemo`) pour optimiser les calculs (≤ 50 trades).
- **Accessibilité** : Labels ARIA, navigation clavier, contrastes élevés (WCAG).
- **Évolutivité** : Structure permettant l’ajout de futures fonctionnalités (ex. : persistance, API).

---

## 3. Structure des Fichiers

### 3.1. Arborescence

La structure des fichiers est conçue pour séparer les préoccupations (UI, logique, types, tests) et faciliter la maintenance.

```bash
src/
├── components/                # Composants React
│   ├── InputForm.tsx          # Formulaire avec onglets (Variante 1/2)
│   ├── TradeTable.tsx         # Tableau des résultats par trade
│   ├── SummaryCard.tsx        # Carte résumé (Solde, ROI, etc.)
│   ├── ErrorMessage.tsx       # Messages d’erreur inline
│   ├── Tooltip.tsx            # Infobulles (activées au clic)
│   └── Toast.tsx              # Gestion des toasts (react-toastify)
├── utils/                     # Modules utilitaires
│   ├── calculations.ts        # Calculs (montant, prix sortie, frais)
│   ├── validations.ts         # Validations des entrées
│   ├── types.ts               # Interfaces TypeScript
│   └── i18n.ts                # Configuration react-i18next
├── App.tsx                    # Composant principal (orchestration)
├── index.css                  # Styles TailwindCSS
├── main.tsx                   # Point d’entrée React
├── tests/                     # Tests unitaires (Vitest)
│   ├── calculations.test.ts   # Tests des calculs
│   ├── validations.test.ts    # Tests des validations
│   └── InputForm.test.ts      # Tests du formulaire
├── i18n/                      # Fichiers de traduction
│   ├── fr.json                # Traductions français
│   └── en.json                # Traductions anglais
└── vite.config.ts             # Configuration Vite

```

### 3.2. Rôles des Répertoires

- **components/** : Contient des composants React réutilisables, chacun avec une responsabilité spécifique (ex. : `TradeTable.tsx` pour afficher le tableau).
- **utils/** : Modules TypeScript pour la logique métier, validations, et types. Séparés des composants pour faciliter les tests.
- **tests/** : Tests unitaires avec Vitest, couvrant 90 % des calculs/validations.
- **i18n/** : Fichiers JSON pour les traductions (français/anglais).
- **Racine** : Fichiers principaux (`App.tsx`, `main.tsx`) et configuration globale.

---

## 4. Détails des Composants

### 4.1. Composants Principaux

1. **InputForm.tsx** :
   - **Rôle** : Affiche le formulaire avec onglets pour Variante 1 et Variante 2.
   - **Props** : Aucun (gère l’état interne via `useState`).
   - **État** : Entrées utilisateur (solde, levier, etc.), erreurs de validation.
   - **Interactions** :
     - Gère les champs dynamiques (ex. : liste Prix d’Entrée pour Variante 1).
     - Appelle `validations.ts` pour vérifier les entrées en temps réel.
     - Déclenche la simulation via `calculations.ts` sur clic de « Simuler ».
     - Affiche toasts (via `Toast.tsx`) pour erreurs critiques.
   - **Accessibilité** : Labels ARIA, navigation clavier.

2. **TradeTable.tsx** :
   - **Rôle** : Affiche le tableau des résultats (10 colonnes : Numéro Trade, Symbole, etc.).
   - **Props** : Liste des trades (interface `Trade[]`).
   - **État** : Ordre de tri (colonne, ascendant/descendant).
   - **Interactions** :
     - Tri par colonne sur clic des en-têtes.
     - Défilement vertical pour ≤ 50 trades.
     - Couleurs conditionnelles (pertes en rouge, profits en vert).
   - **Accessibilité** : ARIA pour tableau, focus clavier.

3. **SummaryCard.tsx** :
   - **Rôle** : Affiche le résumé (Solde Final, Pertes Cumulées, Gains Totaux, ROI %).
   - **Props** : Données du résumé (interface `Summary`).
   - **État** : Aucun (composant statique).
   - **Interactions** : Mise en forme avec TailwindCSS (fond blanc, ombre).
   - **Accessibilité** : Texte lisible, contrastes élevés.

4. **ErrorMessage.tsx** :
   - **Rôle** : Affiche les erreurs inline sous les champs invalides.
   - **Props** : Message d’erreur (string).
   - **Interactions** : Style TailwindCSS (texte rouge, icône).

5. **Tooltip.tsx** :
   - **Rôle** : Gère les infobulles (ex. : « Levier : Multiplie la taille… »).
   - **Props** : Contenu (string), activé au clic.
   - **Interactions** : Affiche/ferme au clic, style TailwindCSS.

6. **Toast.tsx** :
   - **Rôle** : Encapsule react-toastify pour les notifications.
   - **Props** : Type (error, info), message, options (ex. : position).
   - **Interactions** :
     - Position bas à droite, fermeture au clic.
     - Style bleu/gris via TailwindCSS.
     - Intégré avec react-i18next pour traductions.
   - **Accessibilité** : ARIA labels pour lecteurs d’écran.

### 4.2. Composant Racine

- **App.tsx** :
  - **Rôle** : Orchestre les composants, gère l’état global.
  - **État** :
    - Mode actif (Variante 1 ou 2).
    - Résultats de la simulation (trades, résumé).
  - **Interactions** :
    - Rend `InputForm.tsx`, `TradeTable.tsx`, `SummaryCard.tsx`.
    - Inclut `ToastContainer` (react-toastify).
    - Gère les changements d’onglet.
  - **Accessibilité** : Structure sémantique HTML, ARIA pour onglets.

---

## 5. Logique Métier (Utils)

### 5.1. calculations.ts

- **Rôle** : Implémente les calculs pour les trades.
- **Fonctions Principales** :
  - `calculateTrade(params: InputParameters, tradeIndex: number)` : Calcule un trade (montant, prix sortie, liquidation, frais, gain net).
  - `simulateTrades(params: InputParameters)` : Simule tous les trades, gère récupération des pertes.
  - `calculateSummary(trades: Trade[])` : Calcule Solde Final, Pertes Cumulées, Gains Totaux, ROI (%).
- **Entrées** : Interface `InputParameters` (solde, levier, etc.).
- **Sorties** : Interfaces `Trade` et `Summary`.
- **Performance** : Utilise `useMemo` pour éviter recalculs inutiles.

### 5.2. validations.ts

- **Rôle** : Valide les entrées utilisateur.
- **Fonctions Principales** :
  - `validateCommonParams(params: InputParameters)` : Vérifie solde, levier, stop-loss, frais, durée.
  - `validateVariant1(params: InputParameters)` : Vérifie Nombre de Trades, Prix d’Entrée.
  - `validateVariant2(params: InputParameters)` : Vérifie Prix d’Entrée Initial, Pourcentages de Baisse.
  - `checkUnrealisticInput(params: InputParameters)` : Vérifie `soldeTotal × levier ≥ 100 $`.
- **Sorties** : Objet d’erreurs (ex. : `{ balance: "Solde trop faible" }`) ou toasts pour cas critiques.
- **Accessibilité** : Messages d’erreur traduits via react-i18next.

### 5.3. types.ts

- **Rôle** : Définit les interfaces TypeScript.
- **Interfaces Principales** :
  - `InputParameters` : Solde Total, Levier, Stop-Loss, etc.
  - `Trade` : Numéro, Symbole, Prix d’Entrée, Sortie, Liquidation, etc.
  - `Summary` : Solde Final, Pertes Cumulées, Gains Totaux, ROI.
- **Utilisation** : Typage strict pour composants et utilitaires.

### 5.4. i18n.ts

- **Rôle** : Configure react-i18next pour le support bilingue.
- **Fichiers** :
  - `fr.json` : Traductions français (ex. : `"errors.insufficientBalance": "Solde trop faible : minimum 100 $ requis."`).
  - `en.json` : Traductions anglais.
- **Intégration** : Utilisé dans composants (`useTranslation`) et toasts.

---

## 6. Gestion d’État

- **Approche** : Hooks React (`useState`, `useEffect`) pour un état localisé.
- **État Global (App.tsx)** :
  - `variant: 'manual' | 'calculated'` : Variante active.
  - `results: { trades: Trade[], summary: Summary }` : Résultats simulation.
- **État Local (InputForm.tsx)** :
  - `formData: InputParameters` : Entrées utilisateur.
  - `errors: Record<string, string>` : Erreurs de validation.
- **Synchronisation** :
  - `useEffect` pour valider les entrées à chaque changement.
  - Conservation des entrées après simulation via `useState`.

---

## 7. Tests

- **Outil** : Vitest, intégré avec Vite.
- **Couverture** : 90 % pour `calculations.ts`, `validations.ts`, et composants critiques (`InputForm.tsx`).
- **Exemples de Tests** :
  - `calculations.test.ts` : Vérifie calculs de trades (ex. : gain net avec frais).
  - `validations.test.ts` : Teste cas limites (ex. : solde < 100 $, levier = 0).
  - `InputForm.test.ts` : Simule saisie utilisateur, vérifie erreurs/toasts.

---

## 8. Considérations Futures (Backend Potentiel)

Bien que l’application soit actuellement client-side, une future intégration backend pourrait inclure :

- **API REST** :
  - Endpoints : `/simulations` (POST pour sauvegarder, GET pour récupérer).
  - Données : Entrées utilisateur, résultats (JSON).
- **Base de Données** :
  - MongoDB ou PostgreSQL pour persistance des simulations.
  - Schéma : `{ userId, simulationId, inputParameters, results }`.
- **Authentification** :
  - OAuth2 ou JWT pour sécuriser l’accès utilisateur.
- **Structure** :
  - Framework : Node.js avec Express.
  - Répertoires : `/controllers`, `/models`, `/routes`, `/middleware`.
- **Intégration** :
  - Client : Appels API via `fetch` dans `App.tsx`.
  - Mise à jour : Ajouter `api.ts` dans `utils/` pour gérer requêtes.
- **Statut** : À implémenter plus tard (local storage ou API temps réel).

---

## 9. Hypothèses

- Aucun backend n’est requis pour la version actuelle.
- Les calculs sont suffisamment performants pour ≤ 50 trades sans serveur.
- Les traductions sont statiques (fichiers JSON, pas d’API i18n).
- Les toasts sont gérés localement par react-toastify.

---

## 10. Glossaire

- **Composant** : Élément React réutilisable (ex. : `InputForm.tsx`).
- **Hook** : Fonction React pour gérer état ou effets (ex. : `useState`).
- **Toast** : Notification temporaire via react-toastify.
- **Infobulle** : Texte explicatif affiché au clic.
- **TypeScript** : Langage ajoutant typage statique à JavaScript.
- **TailwindCSS** : Framework CSS pour styles utilitaires.
