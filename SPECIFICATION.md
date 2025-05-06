# Cahier des Charges Fonctionnel : Simulateur de Positions de Trading (Crypto)

## 1. Aperçu

**Objectif** : Développer une application web côté client utilisant **React (Vite + TypeScript + TailwindCSS)** pour simuler des stratégies de trading crypto à effet de levier. Les utilisateurs configurent des paramètres (levier, prix d’entrée, stop-loss, frais, pourcentages de baisse), simulent des trades et visualisent les résultats via un tableau et un résumé. Deux variantes sont proposées :

- **Variante 1** : Points d’entrée manuels.
- **Variante 2** : Points d’entrée calculés automatiquement après le premier trade selon des pourcentages de baisse.

**Portée** :

- Application exclusivement client-side, sans backend ni API.
- Simulation de multiples trades avec gestion des pertes (réinitialisées après trade réussi), calcul des frais (financement ajusté selon durée saisie), et métriques incluant le ROI.
- Interface bilingue (français/anglais), accessible, avec infobulles et alertes pour saisies irréalistes via react-toastify.

---

## 2. Exigences Fonctionnelles

### 2.1. Paramètres d’Entrée

Les utilisateurs saisissent les paramètres via un formulaire :

- **Paramètres Communs** :
  - **Solde Total** : Capital initial (ex. : 1000 $). Positif, sans limite maximale.
  - **Levier** : Facteur de levier (ex. : 5x). Saisie manuelle, maximum 100x.
  - **Prix Stop-Loss** : Prix de liquidation. Positif.
  - **Pourcentage de Gain Cible** : Profit par trade (ex. : 100 %). Par défaut : 100 %. Non négatif.
  - **Frais** :
    - Frais Maker (%) : Ordres limites (ex. : 0,1 %). Non négatif, ignoré si 0 %.
    - Frais Taker (%) : Ordres marché (ex. : 0,2 %). Non négatif, ignoré si 0 %.
    - Taux de Financement (%) : Frais toutes les 3 heures (ex. : 0,01 %). Non négatif, ignoré si 0 %. Durée saisie par l’utilisateur (jours, défaut : 10, pas de limite maximale).
  - **Récupération des Pertes** : Inclut pertes cumulées dans gain cible, réinitialisées après trade réussi (prix de sortie atteint). Par défaut : activée.
  - **Symbole** : Paire crypto. Liste prédéfinie fixe (BTC/USDT, ETH/USDT, SOL/USDT).
  - **Durée du Trade** : Nombre de jours pour frais de financement (ex. : 10). Positif ou 0 (si 0, ignorer frais de financement avec alerte).
- **Variante 1 : Points d’Entrée Manuels** :
  - **Nombre de Trades** : Nombre de trades (ex. : 3). Entier positif, sans limite.
  - **Prix d’Entrée** : Liste de prix par trade. Positifs, supérieurs au prix stop-loss.
- **Variante 2 : Points d’Entrée Calculés** :
  - **Prix d’Entrée Initial** : Prix du premier trade. Positif.
  - **Pourcentages de Baisse** : Liste de pourcentages (ex. : 50 %, 50 %). Positifs, < 100 %, maximum 99.

### 2.2. Validations

- **Solde Total** : > 0.
- **Levier** : > 0 et ≤ 100. Si 0, alerte via toast : « Levier doit être supérieur à 0. »
- **Prix Stop-Loss** :
  - Variante 1 : < Prix d’Entrée pour chaque trade.
  - Variante 2 : < Prix d’Entrée Initial.
- **Pourcentage de Gain Cible** : ≥ 0.
- **Frais (Maker, Taker, Financement)** : ≥ 0.
- **Durée du Trade** : ≥ 0. Si 0, alerte via toast : « Durée de trade à 0 : frais de financement ignorés. »
- **Variante 1** :
  - Nombre de Trades ≥ 1.
  - Chaque Prix d’Entrée > Prix Stop-Loss.
- **Variante 2** :
  - Pourcentages de Baisse > 0 et < 100 %.
  - Maximum 99 pourcentages.
  - Prix d’Entrée Initial > Prix Stop-Loss.
- **Suffisance du Solde** :
  - Taille minimale par position : 100 $.
  - Si sol CDMde < 100 $, alerte via toast : « Solde trop faible : minimum 100 $ requis. »
  - Si solde insuffisant pour tous les trades :
    - Arrêter au dernier trade valide.
    - Afficher erreur via toast : « Solde épuisé : impossible de financer tous les trades. »
- **Saisies Irréalistes** :
  - Si `soldeTotal × levier < 100 $`, bloquer simulation et afficher toast : « Saisie irréaliste : position totale inférieure à 100 $. »

### 2.3. Logique et Calculs

Calculs effectués côté client, arrondis à 2 décimales :

1. **Montant par Trade** :

   - **Variante 1** :
     - `montantParTrade = soldeTotal / nombreDeTrades` (minimum 100 $).
   - **Variante 2** :
     - Calculer prix de liquidation jusqu’à `prixLiquidationN ≤ prixStopLoss` (inclus si égal) :
       - Trade 1 : `prixLiquidation1 = prixEntreeInitial × (1 - pourcentageBaisse1/100)`
       - Trade 2 : `prixLiquidation2 = prixLiquidation1 × (1 - pourcentageBaisse2/100)`
       - Pour pour Thorcentages identiques (ex. : 50 %, 50 %), calcul basé sur prix d’entrée précédent (ex. : 20 $ → 10 $ → 5 $).
       - Maximum 99 trades.
     - `nombreDeTrades = nombre de prix calculés`.
     - `montantParTrade = soldeTotal / nombreDeTrades` (minimum 100 $).
   - Si `montantParTrade < 100 $`, arrêter et afficher erreur : « Solde épuisé : impossible de financer tous les trades. »

2. **Calcul du Prix de Sortie** :

   - Pour chaque trade :
     - `valeurPosition = montantParTrade × levier`
     - `gainBrutCible = valeurPosition × (pourcentageGainCible/100) + pertesCumulees` (si récupération activée).
     - `fraisTotaux = (montantParTrade × fraisMaker/100) + (gainBrut × fraisTaker/100) + (valeurPosition × fraisFinancement/100 × nombrePériodes)` où `nombrePériodes = (duréeJours × 24h) / 3h` (0 si durée = 0).
     - `gainNet = gainBrut - fraisTotaux`
     - `prixSortie = prixEntree × (1 + pourcentageGainCible/100)`

3. **Gestion des Pertes** :

   - Si trade liquidé :
     - `perte = montantParTrade + (montantParTrade × fraisMaker/100)`
     - `soldeTotal -= perte`
     - `pertesCumulees += perte`
   - Réinitialiser `pertesCumulees` à 0 après trade réussi.
   - **Variante 2** : Prix d’entrée suivant = prix liquidation précédent.

4. **Exemple de Calcul** :
   - **Entrée** :
     - Solde Total : 1000 $
     - Levier : 10x
     - Montant par Trade : 100 $
     - Prix d’Entrée : 100 $
     - Gain Cible : 100 %
     - Frais : Maker 0,1 %, Taker 0,2 %, Financement 0,01 %
     - Pourcentages de Baisse : [50 %, 50 %]
     - Prix Stop-Loss : 20 $
     - Durée : 5 jours
     - Récupération Pertes : Activée
   - **Trade 1** :
     - Valeur Position : `100 × 10 = 1000 $`
     - Gain Brut : `1000 $`
     - Frais : `(100 × 0,001) + (1000 × 0,002) + (1000 × 0,0001 × (5 × 24 / 3)) = 0,1 + 2 + 4 = 6,1 $`
     - Gain Net : `1000 - 6,1 = 993,9 $`
     - Prix Sortie : `100 × (1 + 1) = 200 $`
     - Prix Liquidation : `100 × (1 - 0,5) = 50 $`
   - **Trade 2** (si liquidé) :
     - Prix d’Entrée : `50 $`
     - Gain Cible : `1000 + 100 = 1100 $`
     - Prix Sortie : `50 × (1 + 1100/1000) = 105 $`
     - Prix Liquidation : `50 × (1 - 0,5) = 25 $`
   - **Trade 3** :
     - Prix d’Entrée : `25 $`
     - Prix Liquidation : `25 × (1 - 0,5) = 12,5 $` (stop, car < 20 $).

### 2.4. Sortie

- **Tableau par Trade** (responsive, TailwindCSS) :
  - Colonnes : Numéro Trade, Symbole, Prix d’Entrée ($), Prix Sortie ($), Prix Liquidation ($), Montant Investi ($), Valeur Position ($), Frais Payés ($), Gain Brut ($), Profit/Perte Net ($).
- **Résumé Global** (carte TailwindCSS) :
  - Solde Final ($)
  - Pertes Cumulées ($)
  - Gains Totaux ($)
  - ROI (%) : `((soldeFinal - soldeInitial) / soldeInitial) × 100`

---

## 3. Exigences d’Interface Utilisateur (UI)

### 3.1. Formulaire d’Entrée

- **Disposition** : Deux onglets (« Variante 1 : Entrée Manuelle », « Variante 2 : Calculée »).
- **Champs Communs** :
  - Solde Total : Numérique.
  - Levier : Numérique (max 100).
  - Prix Stop-Loss : Numérique.
  - Pourcentage Gain Cible : Numérique (défaut : 100).
  - Frais Maker : Numérique (défaut : 0,1).
  - Frais Taker : Numérique (défaut : 0,2).
  - Frais Financement : Numérique (défaut : 0,01).
  - Durée Trade : Numérique (défaut : 10).
  - Récupération Pertes : Case à cocher (cochée par défaut).
  - Symbole : Menu déroulant (BTC/USDT, ETH/USDT, SOL/USDT).
- **Variante 1** :
  - Nombre de Trades : Numérique.
  - Prix d’Entrée : Liste dynamique de champs numériques (générée selon Nombre de Trades).
- **Variante 2** :
  - Prix d’Entrée Initial : Numérique.
  - Pourcentages de Baisse : Liste dynamique (max 99), avec boutons « Ajouter % » et « Supprimer % ».
- **Boutons** :
  - **Simuler les Trades** : Désactivé si validations échouent.
  - **Réinitialiser** : Efface toutes les entrées.
- **Infobulles** (activées au clic, stylées avec TailwindCSS) :
  - Levier : « Multiplie la taille de la position, augmente gains et pertes. »
  - Frais Maker/Taker : « Frais pour ordres limites/au marché. »
  - Taux de Financement : « Frais toutes les 3h pour la durée spécifiée. »
  - Récupération Pertes : « Inclut pertes passées, réinitialisé après succès. »
  - Durée Trade : « Durée en jours pour calculer les frais de financement. »

### 3.2. Affichage des Résultats

- **Tableau par Trade** :
  - Responsive, défilement vertical pour ≤ 50 trades.
  - Triable par colonne.
  - Pertes nettes en rouge, profits en vert.
- **Carte Résumé** :
  - Affiche Solde Final, Pertes Cumulées, Gains Totaux, ROI (%).
  - Style TailwindCSS : fond blanc, ombre légère, coins arrondis, texte lisible.
- **Erreurs et Alertes** :
  - Erreurs inline sous champs invalides (ex. : « Prix Stop-Loss doit être < Prix d’Entrée »).
  - Toasts (react-toastify, fermeture au clic) pour :
    - Solde < 100 $ : « Solde trop faible : minimum 100 $ requis. »
    - Levier = 0 : « Levier doit être supérieur à 0. »
    - Durée = 0 : « Durée de trade à 0 : frais de financement ignorés. »
    - Saisie irréaliste : « Saisie irréaliste : position totale inférieure à 100 $. »
    - Solde épuisé : « Solde épuisé : impossible de financer tous les trades. »

### 3.3. Interactions UI

- Conservation des entrées utilisateur après simulation.
- Validation en temps réel avec erreurs immédiates.
- Infobulles activées au clic.
- Support bilingue (français/anglais) via **react-i18next**.

---

## 4. Exigences Techniques

### 4.1. Pile Technologique

- **Framework** : React (Vite + TypeScript).
- **Styling** : TailwindCSS (palette bleu/gris, contrastes élevés pour lisibilité).
- **Calculs** : TypeScript, client-side, arrondi à 2 décimales.
- **Gestion d’État** : Hooks React (useState, useEffect).
- **Tests** : Vitest (optimisé pour Vite), couverture 90 % pour calculs/validations.
- **Internationalisation** : react-i18next (français/anglais).
- **Notifications** : react-toastify pour toasts.

### 4.2. Structure du Projet

```
src/
├── components/
│   ├── InputForm.tsx        # Formulaire avec onglets
│   ├── TradeTable.tsx       # Tableau résultats
│   ├── SummaryCard.tsx      # Carte résumé
│   ├── ErrorMessage.tsx     # Messages d’erreur inline
│   ├── Tooltip.tsx          # Infobulles
│   └── Toast.tsx            # Gestion toasts
├── utils/
│   ├── calculations.ts      # Logique calculs
│   ├── validations.ts       # Validations
│   ├── types.ts            # Interfaces TypeScript
│   └── i18n.ts             # Configuration i18n
├── App.tsx                  # Composant principal
├── index.css                # TailwindCSS
└── main.tsx                 # Point d’entrée
```

### 4.3. Performance

- Gérer ≤ 50 trades sans latence notable.
- Utiliser mémoïsation (React.memo, useMemo) pour calculs coûteux.
- Responsive pour mobile (min 320px) et desktop.

### 4.4. Accessibilité

- Labels ARIA pour formulaires et tableau.
- Navigation clavier complète.
- Compatibilité lecteurs d’écran (ex. : NVDA, VoiceOver).
- Contrastes élevés (conforme WCAG).

---

## 5. Tâches de Développement

1. **Configuration Projet** :
   - Initialiser Vite + React + TypeScript + TailwindCSS + Vitest + react-i18next + react-toastify.
   - Configurer ESLint/Prettier.
   - **Critères d’Acceptation** : Projet fonctionnel, styles/tests/i18n configurés, toasts fonctionnels.
2. **Définir Types TypeScript** :
   - Interfaces pour Trade, InputParameters, Summary dans `types.ts`.
   - **Critères** : Pas d’erreurs TypeScript.
3. **Implémenter Calculs** :
   - `calculations.ts` : Montant par trade, prix sortie/liquidation, frais (périodes ajustées selon durée).
   - Tests unitaires Vitest (90 % couverture).
   - **Critères** : Calculs conformes à l’exemple, tests passent.
4. **Implémenter Validations** :
   - `validations.ts` : Règles, saisies irréalistes (position totale < 100 $), alertes.
   - **Critères** : Validations complètes, toasts pour erreurs.
5. **Construire Formulaire** :
   - `InputForm.tsx` : Onglets, champs dynamiques, infobulles au clic, réinitialisation, conservation entrées.
   - **Critères** : Responsive, validations temps réel, infobulles/toasts fonctionnels.
6. **Construire Tableau** :
   - `TradeTable.tsx` : ≤ 50 trades, triable, défilement vertical.
   - **Critères** : Responsive, tri fonctionnel, couleurs profits/pertes.
7. **Construire Carte Résumé** :
   - `SummaryCard.tsx` : Solde Final, Pertes Cumulées, Gains Totaux, ROI (%).
   - **Critères** : Données correctes, style cohérent.
8. **Intégrer Composants** :
   - `App.tsx` : Combiner formulaire, tableau, carte, gérer état avec hooks.
   - **Critères** : Simulation fluide, résultats affichés correctement.
9. **Accessibilité et i18n** :
   - Ajouter ARIA, navigation clavier, support français/anglais.
   - **Critères** : Accessible, bilingue, testé avec lecteur d’écran.
10. **Rédiger Documentation** :
    - README : Instructions setup, structure projet, glossaire (ex. : « Maker : frais ordre limite »).
    - **Critères** : Documentation claire, utilisable par développeurs.

---

## 6. Exigences Non Fonctionnelles

- **Navigateurs** : Dernières versions Chrome, Firefox, Safari, Edge.
- **Responsive** : Mobile (min 320px) et desktop.
- **Qualité Code** : TypeScript best practices, noms variables clairs, commentaires pour logique complexe.
- **Tests** : Unitaires (Vitest), 90 % couverture pour calculs/validations.

---

## 7. Hypothèses

- Pas de persistance des données (pas de local storage).
- Symbole n’affecte pas calculs (cosmétique).
- Toasts nécessitent clic pour fermeture.
- Pas de benchmarks performance spécifiques, mais fluidité attendue pour ≤ 50 trades.

---

## 8. Considérations Futures

- Sauvegarde simulations (local storage) : À faire plus tard.
- Données prix temps réel : À faire plus tard.
- Nouvelles variantes/stratégies : À faire plus tard.

---

## 9. Wireframe (Description Textuelle)

**Disposition Générale** :

- **En-tête** : Titre centré « Simulateur de Trading Crypto » (bleu foncé, texte blanc, fond gris).
- **Contenu Principal** :
  - Deux onglets en haut : « Variante 1 : Entrée Manuelle » | « Variante 2 : Calculée » (style TailwindCSS, onglet actif surligné en bleu).
  - **Section Formulaire** (gauche, 50 % largeur sur desktop, pleine largeur sur mobile) :
    - **Champs Communs** :
      - Solde Total : Champ texte (label à gauche, infobulle icône « ? » à droite).
      - Levier : Champ texte.
      - Prix Stop-Loss : Champ texte.
      - Pourcentage Gain Cible : Champ texte (défaut 100).
      - Frais Maker/Taker/Financement : Champs texte (défauts 0,1/0,2/0,01).
      - Durée Trade : Champ texte (défaut 10).
      - Récupération Pertes : Case à cocher (cochée).
      - Symbole : Menu déroulant (BTC/USDT, ETH/USDT, SOL/USDT).
    - **Variante 1** :
      - Nombre de Trades : Champ texte.
      - Prix d’Entrée : Liste champs texte (dynamique, ajoutés selon Nombre de Trades).
    - **Variante 2** :
      - Prix d’Entrée Initial : Champ texte.
      - Pourcentages de Baisse : Liste champs texte (boutons « + Ajouter % » / « - Supprimer »).
    - **Boutons** (alignés à droite) :
      - « Simuler les Trades » (bleu, désactivé si invalide).
      - « Réinitialiser » (gris, toujours actif).
  - **Section Résultats** (droite, 50 % largeur sur desktop, sous formulaire sur mobile) :
    - **Tableau** : 10 colonnes (Numéro Trade, Symbole, etc.), défilement vertical, triable (icônes flèches), pertes en rouge/profits en vert.
    - **Carte Résumé** : Sous tableau, fond blanc, ombre, affiche Solde Final, Pertes Cumulées, Gains Totaux, ROI (%).
- **Toasts** : Apparaissent en bas à droite, style bleu/gris, nécessitent clic pour fermer.

**Mobile** :

- Onglets empilés en haut.
- Formulaire et résultats en pleine largeur, résultats sous formulaire.
- Boutons Simuler/Réinitialiser centrés sous formulaire.

---

## 10. Glossaire

- **Levier** : Facteur multiplicateur de la taille de la position.
- **Frais Maker** : Frais appliqués aux ordres limites.
- **Frais Taker** : Frais appliqués aux ordres au marché.
- **Taux de Financement** : Frais périodique (toutes les 3h) pour positions à levier, basé sur durée saisie.
- **Prix Stop-Loss** : Prix auquel la position est liquidée.
- **Récupération des Pertes** : Inclut pertes cumulées dans gains cibles, réinitialisé après trade réussi.
- **ROI** : Retour sur investissement, exprimé en pourcentage.
