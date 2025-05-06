# Exigences du Projet : Simulateur de Positions de Trading (Crypto)

## 1. Aperçu

**Objectif** : Ce document définit les exigences fonctionnelles, non fonctionnelles, techniques, et d’interface utilisateur pour le développement de l’application web **Simulateur de Positions de Trading (Crypto)**, une application client-side construite avec **React**, **Vite**, **TypeScript**, et **TailwindCSS**. L’application permet de simuler des stratégies de trading crypto à effet de levier, avec deux variantes : points d’entrée manuels (Variante 1) et calculés automatiquement (Variante 2).

**Portée** :

- Simulation de trades avec calculs de gains, pertes, frais, et ROI.
- Interface utilisateur responsive, bilingue (français/anglais), et accessible.
- Notifications via react-toastify, internationalisation via react-i18next, tests via Vitest.
- Aucune persistance ni backend requis (client-side uniquement).

## 2. Exigences Fonctionnelles

### 2.1. Paramètres d’Entrée

- **Champs Communs** :
  - Solde Total : Capital initial (ex. : 1000 $), positif.
  - Levier : Facteur de levier (ex. : 5x), maximum 100x, positif.
  - Prix Stop-Loss : Prix de liquidation, positif.
  - Pourcentage de Gain Cible : Profit par trade (ex. : 100 %), non négatif, défaut : 100 %.
  - Frais :
    - Maker (%) : Ordres limites (ex. : 0,1 %), non négatif, ignoré si 0 %.
    - Taker (%) : Ordres marché (ex. : 0,2 %), non négatif, ignoré si 0 %.
    - Financement (%) : Frais toutes les 3 heures (ex. : 0,01 %), non négatif, ignoré si 0 %.
  - Durée du Trade : Jours pour frais de financement (ex. : 10), positif ou 0 (alerte si 0).
  - Récupération des Pertes : Inclut pertes cumulées, réinitialisées après trade réussi, activée par défaut.
  - Symbole : Paire crypto (liste fixe : BTC/USDT, ETH/USDT, SOL/USDT).
- **Variante 1 : Points d’Entrée Manuels** :
  - Nombre de Trades : Entier positif (ex. : 3).
  - Prix d’Entrée : Liste de prix, positifs, > Stop-Loss.
- **Variante 2 : Points d’Entrée Calculés** :
  - Prix d’Entrée Initial : Positif, > Stop-Loss.
  - Pourcentages de Baisse : Liste de pourcentages (ex. : 50 %, 50 %), positifs, < 100 %, max 99.

### 2.2. Validations

- **Champs Communs** :
  - Solde Total > 0.
  - Levier > 0, ≤ 100 (toast si 0 : « Levier doit être supérieur à 0 »).
  - Stop-Loss < Prix d’Entrée (Variante 1 : chaque trade, Variante 2 : initial).
  - Gain Cible ≥ 0.
  - Frais (Maker, Taker, Financement) ≥ 0.
  - Durée ≥ 0 (toast si 0 : « Durée à 0 : frais de financement ignorés »).
- **Variante 1** :
  - Nombre de Trades ≥ 1.
  - Chaque Prix d’Entrée > Stop-Loss.
- **Variante 2** :
  - Pourcentages de Baisse > 0, < 100 %.
  - Maximum 99 pourcentages.
  - Prix d’Entrée Initial > Stop-Loss.
- **Suffisance du Solde** :
  - Taille minimale par position : 100 $.
  - Toast si solde < 100 $ : « Solde trop faible : minimum 100 $ requis ».
  - Si solde épuisé : Arrêter au dernier trade valide, toast : « Solde épuisé : impossible de financer tous les trades ».
- **Saisie Irréaliste** :
  - Si `soldeTotal × levier < 100 $`, bloquer simulation, toast : « Saisie irréaliste : position totale inférieure à 100 $ ».

### 2.3. Calculs

- **Montant par Trade** :
  - Variante 1 : `soldeTotal / nombreDeTrades` (min 100 $).
  - Variante 2 :
    - Calculer prix de liquidation jusqu’à `prixLiquidationN ≤ prixStopLoss`.
    - Exemple : Prix Initial 100 $, Baisse [50 %, 50 %] → 50 $, 25 $.
    - `nombreDeTrades` = nombre de prix calculés (max 99).
    - `montantParTrade = soldeTotal / nombreDeTrades` (min 100 $).
- **Prix de Sortie** :
  - `valeurPosition = montantParTrade × levier`.
  - `gainBrutCible = valeurPosition × (pourcentageGainCible/100) + pertesCumulees` (si récupération activée).
  - `fraisTotaux = (montantParTrade × fraisMaker/100) + (gainBrut × fraisTaker/100) + (valeurPosition × fraisFinancement/100 × (duréeJours × 24 / 3))`.
  - `gainNet = gainBrut - fraisTotaux`.
  - `prixSortie = prixEntree × (1 + pourcentageGainCible/100)`.
- **Pertes** :
  - Si liquidé : `perte = montantParTrade + (montantParTrade × fraisMaker/100)`.
  - Réinitialiser `pertesCumulees` après trade réussi.
  - Variante 2 : Prix d’entrée suivant = prix liquidation précédent.
- **Arrondi** : 2 décimales pour tous les calculs.

### 2.4. Sorties

- **Tableau par Trade** :
  - Colonnes : Numéro Trade, Symbole, Prix d’Entrée ($), Prix Sortie ($), Prix Liquidation ($), Montant Investi ($), Valeur Position ($), Frais Payés ($), Gain Brut ($), Profit/Perte Net ($).
- **Résumé Global** :
  - Solde Final ($).
  - Pertes Cumulées ($).
  - Gains Totaux ($).
  - ROI (%) : `((soldeFinal - soldeInitial) / soldeInitial) × 100`.

## 3. Exigences d’Interface Utilisateur (UI)

### 3.1. Formulaire

- **Disposition** :
  - Deux onglets : « Variante 1 : Entrée Manuelle », « Variante 2 : Calculée ».
  - Formulaire à gauche (desktop, 50 % largeur) ou pleine largeur (mobile).
- **Champs** :
  - Communs : Solde Total, Levier, Stop-Loss, Gain Cible, Frais (Maker, Taker, Financement), Durée, Récupération Pertes (case à cocher), Symbole (menu déroulant).
  - Variante 1 : Nombre de Trades, liste dynamique Prix d’Entrée.
  - Variante 2 : Prix d’Entrée Initial, liste dynamique Pourcentages de Baisse (boutons « + Ajouter », « - Supprimer »).
- **Boutons** :
  - « Simuler les Trades » : Bleu, désactivé si invalide.
  - « Réinitialiser » : Gris, toujours actif.
- **Infobulles** :
  - Activées au clic, style TailwindCSS.
  - Exemples : « Levier : Multiplie la taille… », « Frais Maker : Frais pour ordres limites ».

### 3.2. Résultats

- **Tableau** :
  - Responsive, défilement vertical (≤ 50 trades).
  - Triable par colonne (icônes flèches).
  - Pertes en rouge (`text-red-500`), profits en vert (`text-green-500`).
- **Carte Résumé** :
  - Affiche Solde Final, Pertes Cumulées, Gains Totaux, ROI (%).
  - Style : `bg-white`, ombre, coins arrondis.
- **Erreurs** :
  - Inline sous champs (ex. : « Stop-Loss doit être < Prix d’Entrée »).
  - Toasts (react-toastify, bas à droite, fermeture au clic) pour erreurs globales.

### 3.3. Interactions

- Conservation des entrées après simulation.
- Validation en temps réel avec erreurs immédiates.
- Support bilingue via react-i18next.
- Navigation clavier pour tous les éléments interactifs.

## 4. Exigences Techniques

### 4.1. Pile Technologique

- **Framework** : React (Vite + TypeScript).
- **Styling** : TailwindCSS (palette bleu/gris, contrastes WCAG).
- **Calculs** : TypeScript, client-side, arrondi à 2 décimales.
- **État** : Hooks React (`useState`, `useEffect`).
- **Tests** : Vitest, couverture ≥ 90 % pour calculs/validations.
- **i18n** : react-i18next (français/anglais).
- **Notifications** : react-toastify (fermeture au clic).

### 4.2. Structure

- Répertoires :
  - `src/components/` : `InputForm.tsx`, `TradeTable.tsx`, `SummaryCard.tsx`, etc.
  - `src/utils/` : `calculations.ts`, `validations.ts`, `types.ts`, `i18n.ts`.
  - `src/tests/` : Tests unitaires.
  - `src/i18n/` : `fr.json`, `en.json`.
- Fichiers racines : `App.tsx`, `main.tsx`, `index.css`.

### 4.3. Performance

- Gérer ≤ 50 trades sans latence notable.
- Utiliser `React.memo`, `useMemo` pour calculs coûteux.
- Temps de chargement initial < 2s (Vite optimisé).
- Bundle optimisé via purge TailwindCSS.

## 5. Exigences Non Fonctionnelles

### 5.1. Accessibilité

- Labels ARIA pour formulaires, tableau, toasts.
- Navigation clavier complète (tabulation, focus visible).
- Compatible lecteurs d’écran (NVDA, VoiceOver).
- Contrastes élevés (WCAG, ratio ≥ 4.5:1).

### 5.2. Navigateurs

- Support des dernières versions : Chrome, Firefox, Safari, Edge.
- Responsive : Mobile (min 320px) et desktop.

### 5.3. Qualité du Code

- Typage strict TypeScript, éviter `any`.
- Noms clairs (camelCase, PascalCase).
- Commentaires pour logique complexe.
- Couverture tests ≥ 90 % (Vitest).

### 5.4. Collaboration

- Git pour versionnement (branches : `main`, `feature/*`).
- Messages de commit : `<type>(<scope>): <description>` (ex. : `feat(form): add dynamic inputs`).
- CI via GitHub Actions (tests, linting).

## 6. Contraintes

- Pas de persistance (local storage ou backend) dans la version initiale.
- Symbole (BTC/USDT, etc.) est cosmétique, sans impact sur calculs.
- Toasts nécessitent clic pour fermeture.
- Budget temps : 20-27 jours (voir `implementation_plan.md`).

## 7. Hypothèses

- Utilisateurs familiers avec concepts de trading (levier, stop-loss).
- Environnement stable (Node.js ≥ 18, npm/yarn).
- Tests manuels suffisants pour validation UI.

## 8. Considérations Futures

- Persistance des simulations (local storage ou API).
- Intégration de données temps réel.
- Ajout de nouvelles variantes/stratégies.

## 9. Glossaire

- **Levier** : Facteur multiplicateur de la position.
- **Stop-Loss** : Prix de liquidation.
- **Frais Maker/Taker** : Frais pour ordres limites/marché.
- **Financement** : Frais périodiques (3h) pour positions à levier.
- **ROI** : Retour sur investissement (%).
- **Toast** : Notification temporaire (react-toastify).
- **Infobulle** : Texte explicatif au clic.
