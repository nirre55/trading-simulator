# Spécification Fonctionnelle : Simulateur de Positions de Trading (Crypto)

## Objectif 

Développer une application web **côté client** en **React** (Vite + TypeScript + TailwindCSS) pour simuler des stratégies de trading de cryptomonnaies avec levier. L’application permettra aux utilisateurs de configurer des trades, définir des paramètres (levier, prix d’entrée, prix max de perte, frais, pourcentage de drop), et visualiser les résultats sous forme de tableau. Deux variantes seront proposées : une avec des points d’entrée manuels et une avec des points d’entrée calculés automatiquement après le premier trade.

## Fonctionnalités principales

### 1. Paramètres d’entrée
- **Balance totale** : Montant disponible pour investir (ex. 1000 $).
- **Levier** : Facteur de levier (ex. 5x, 10x, 20x, etc.).
- **Prix d’entrée** : Prix initial de l’actif pour chaque trade.
- **Prix max de perte** : Prix défini par l’utilisateur où la position est liquidée.
- **Pourcentage de gain cible** : Configurable, par défaut 100 %.
- **Frais** :
  - Maker (ex. 0.1 %).
  - Taker (ex. 0.2 %).
  - Funding rate (ex. 0.01 %, configurable).
- **Récupération des pertes** : Option activée/désactivée (par défaut activée) pour inclure les pertes cumulées dans le gain cible des trades suivants.
- **Symbole** : Actif crypto (ex. BTC/USDT).
- **Variante 1 : Points d’entrée manuels** :
  - Nombre de trades (fixe, défini par l’utilisateur).
  - Liste de prix d’entrée (un par trade).
- **Variante 2 : Premier point d’entrée, suivants calculés** :
  - Prix d’entrée initial.
  - Liste de pourcentages de drop (ex. 50 %, 25 %, définis par l’utilisateur) pour calculer les prix de liquidation.

### 2. Validations
- Balance totale > 0.
- Levier > 0.
- Prix max de perte < prix d’entrée initial (variante 2).
- Prix d’entrée de chaque trade > prix max de perte (variante 1).
- % de gain cible ≥ 0.
- Frais (maker, taker, funding) ≥ 0.
- Nombre de trades ≥ 1 (variante 1).
- % de drop > 0 et < 100 % (variante 2).
- Balance suffisante pour couvrir tous les trades.

### 3. Sortie
- **Tableau par trade** :
  - Numéro du trade.
  - Symbole.
  - Prix d’entrée.
  - Prix de sortie (pour atteindre le gain cible).
  - Prix de liquidation.
  - Montant investi.
  - Valeur totale de la position (investissement × levier).
  - Gain/perte net (après frais).
- **Résumé global** :
  - Balance finale.
  - Pertes cumulées.
  - Gains totaux (si tous les trades atteignent le prix de sortie).

## Logique et Calculs

### 1. Calcul du montant max par trade
- **Variante 1** : `montantParTrade = balanceTotale / nombreDeTrades`.
- **Variante 2** :
  - Calculer le nombre de trades possibles avant que le prix d’entrée atteigne le prix max de perte :
    - Trade 1 : `prixLiquidation1 = prixEntreeInitial × (1 - %drop1/100)`.
    - Trade 2 : `prixLiquidation2 = prixLiquidation1 × (1 - %drop2/100)`.
    - Continuer jusqu’à ce que `prixLiquidationN ≤ prixMaxPerte`.
    - `nombreDeTrades = nombre de prix de liquidation calculés`.
  - `montantParTrade = balanceTotale / nombreDeTrades`.

### 2. Calcul du prix de sortie
- Valeur de la position = `montantInvesti × levier`.
- Gain brut cible = `valeurPosition × (%gainCible/100) + pertesCumulées` (si option activée).
- Frais totaux = `(montantInvesti × fraisMaker/100) + (gainBrut × fraisTaker/100) + (valeurPosition × fraisFunding/100)`.
- Gain net = `gainBrut - fraisTotaux`.
- Prix de sortie = `prixEntree × (1 + %gainCible/100)`.

### 3. Gestion des pertes
- Si trade liquidé : perte = `montantInvesti + (montantInvesti × fraisMaker/100)`.
- Mettre à jour `balanceTotale -= perte` et `pertesCumulées += perte`.
- Variante 2 : Prix d’entrée du trade suivant = `prixLiquidation` du trade précédent.

### 4. Exemple
- **Paramètres** : Balance : 1000 $, levier : 10x, montant investi : 100 $, prix d’entrée : 100 $, %gain : 100 %, frais : 0.1 % maker, 0.2 % taker, 0.01 % funding, %drop : [50 %, 25 %], prix max perte : 20 $, récupération des pertes activée.
- **Trade 1** :
  - Valeur position : 100 $ × 10 = 1000 $.
  - Gain brut : 1000 $.
  - Frais : (100 × 0.001) + (1000 × 0.002) + (1000 × 0.0001) = 0.1 + 2 + 0.1 = 2.2 $.
  - Gain net : 1000 - 2.2 = 997.8 $.
  - Prix de sortie : 100 × (1 + 1) = 200 $.
  - Prix liquidation : 100 × (1 - 0.5) = 50 $.
- **Trade 2** (si perte) :
  - Prix d’entrée : 50 $.
  - Gain cible : 1000 + 100 (perte) = 1100 $.
  - Prix de sortie : 50 × (1 + 1100/1000) = 105 $.
  - Prix liquidation : 50 × (1 - 0.25) = 37.5 $.
  - Arrêt si prochain prix liquidation (37.5 × 0.75) < 20 $.

## Interface Utilisateur (UI)

### 1. Formulaire d’entrée
- **Champs communs** :
  - Balance totale (`input number`).
  - Levier (`select` : 5x, 10x, 20x, etc.).
  - Prix max de perte (`input number`).
  - % gain cible (`input number`, défaut : 100).
  - Frais maker/taker/funding (`input number`, ex. 0.1, 0.2, 0.01).
  - Récupération des pertes (`checkbox`, défaut : coché).
  - Symbole (`input text`, ex. BTC/USDT).
- **Variante 1** :
  - Nombre de trades (`input number`).
  - Liste dynamique de prix d’entrée (`input number`, un par trade).
- **Variante 2** :
  - Prix d’entrée initial (`input number`).
  - Liste dynamique de % de drop (`input number`, ex. 50, 25).
- Bouton “Simuler” (désactivé si validations échouent).

### 2. Affichage des résultats
- **Tableau** (TailwindCSS) :
  - Colonnes : Trade #, Symbole, Prix d’entrée, Prix de sortie, Prix liquidation, Montant investi, Valeur position, Gain/Perte net.
- **Résumé** (card TailwindCSS) :
  - Balance finale, Pertes cumulées, Gains totaux.

### 3. Validations UI
- Afficher des messages d’erreur sous chaque champ en cas d’échec (ex. “Prix max de perte doit être inférieur au prix d’entrée”).
- Désactiver le bouton “Simuler” si les inputs sont invalides.

## Stack Technologique
- **Framework** : React (Vite + TypeScript).
- **Design** : TailwindCSS.
- **Calculs** : Côté client, implémentés en TypeScript.
- **Données** : Pas d’API, basé sur les inputs utilisateur.
