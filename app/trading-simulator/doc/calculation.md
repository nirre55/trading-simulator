# Calcul des Trades avec et sans Récupération de Perte

Ce document fournit les formules pour calculer les métriques des trades dans le **Simulateur de Positions de Trading (Crypto)**, avec des exemples numériques pour **trois trades** pour la **Variante 1 (Entrée Manuelle)** et **quatre trades** pour la **Variante 2 (Calculée)**. Les calculs incluent un **prix minimum acceptable** (`stopLoss`) pour arrêter la génération des trades dans la Variante 2, et la récupération de perte ajuste le profit pour inclure les pertes des trades précédents.

## Paramètres de Base

- **Balance** (`balance`) : `1000 $`
- **Levier** (`leverage`) : `10`
- **Gain Cible** (`gainTarget`) : `100 %`
- **Frais Maker** (`makerFee`) : `0.1 %`
- **Frais de Financement** (`fundingFee`) : `0.01 %`
- **Durée** (`duration`) : `5 jours`
- **Prix Minimum Acceptable** (`stopLoss`) : `20 $` (prix en dessous duquel l’actif n’ira pas, utilisé pour arrêter les trades dans la Variante 2)

### Paramètres pour Variante 1 (Entrée Manuelle)
- **Prix d’Entrée** (`entryPrices`) : `[100 $, 90 $, 80 $]`
- **Nombre de Trades** (`numberOfTrades`) : `3`
- **Montant par Trade (sans levier)** : `1000 / 3 ≈ 333.33 $`
- **Montant Total de la Position** (`tradeAmount`) : `333.33 * 10 = 3,333.33 $`
- **Prix Moyen d’Entrée** (`averageEntryPrice`) : `(100 + 90 + 80) / 3 = 90 $`

### Paramètres pour Variante 2 (Calculée)
- **Prix d’Entrée Initial** (`initialEntryPrice`) : `100 $`
- **Pourcentage de Baisse** (`drop`) : `50 %`
- **Nombre de Trades** (`numberOfTrades`) : `4` (généré jusqu’à `entryPrice ≤ stopLoss`)
- **Prix d’Entrée** (`entryPrices`) : `[100, 50, 25, 12.5]` (générés : `100 * 0.5 = 50`, `50 * 0.5 = 25`, `25 * 0.5 = 12.5`)
- **Montant par Trade (sans levier)** : `1000 / 4 = 250 $`
- **Montant Total de la Position** (`tradeAmount`) : `250 * 10 = 2,500 $`
- **Prix Moyen d’Entrée** (`averageEntryPrice`) : `(100 + 50 + 25 + 12.5) / 4 = 187.5 / 4 = 46.875 $`

## Formules

### 1. Montant par Trade (sans levier)
- **Formule** : `baseTradeAmount = balance / numberOfTrades`
- **Description** : Montant investi par trade sans levier.

### 2. Montant Total de la Position
- **Formule** : `tradeAmount = baseTradeAmount * leverage`
- **Description** : Montant total de la position par trade, avec levier.

### 3. Prix de Liquidation
- **Formule** : `liquidationPrice = entryPrice * (1 - 1/leverage)`
- **Description** : Prix auquel la position est liquidée.

### 4. Perte par Trade
- **Formule** : `loss = baseTradeAmount`
- **Description** : Perte potentielle par trade, égale au montant investi sans levier.

### 5. Risque Total
- **Formule** : `riskTotal = baseTradeAmount * numberOfTrades`
- **Description** : Somme des montants investis sans levier pour tous les trades.

### 6. Frais par Trade
- **Formule** :
  - `makerFeePerTrade = tradeAmount * (makerFee / 100) * 2`
  - `fundingFeePerTrade = tradeAmount * (fundingFee / 100) * duration`
  - `fees = makerFeePerTrade + fundingFeePerTrade`
- **Description** : Frais totaux (Maker + Financement) pour un trade.

### 7. Frais Totaux
- **Formule** : `totalFees = fees * numberOfTrades`
- **Description** : Somme des frais pour tous les trades.

### 8. Profit Potentiel (Sans Récupération)
- **Formule** : `profit = tradeAmount * (gainTarget / 100)`
- **Description** : Profit attendu basé sur le gain cible appliqué à la position totale.

### 9. Prix de Sortie (Sans Récupération)
- **Formule** : `targetPrice = entryPrice + (profit * entryPrice / tradeAmount)`
- **Description** : Prix cible pour atteindre le profit attendu.

### 10. Profit Potentiel (Avec Récupération)
- **Formule** :
  - Trade 1 : `profit = tradeAmount * (gainTarget / 100)`
  - Trade n (n ≥ 2) : `profit = tradeAmount * (gainTarget / 100) + baseTradeAmount * (n - 1)`
- **Description** : Profit inclut le gain cible et les pertes des trades précédents.

### 11. Prix de Sortie (Avec Récupération)
- **Formule** : `targetPrice = entryPrice + (profit * entryPrice / tradeAmount)`
- **Description** : Prix cible ajusté pour atteindre le profit avec récupération.

### 12. Gain Cible Ajusté
- **Formule** : `adjustedGainTarget = ((targetPrice - entryPrice) / entryPrice) * 100`
- **Description** : Pourcentage de gain par trade basé sur `targetPrice`.

### 13. Ratio Risque/Récompense
- **Formule** : `riskRewardRatio = profit / baseTradeAmount`
- **Description** : Rapport entre profit potentiel et perte par trade.

## Exemple Numérique : Variante 1 (Entrée Manuelle)

### Calculs Préliminaires
- `averageEntryPrice = (100 + 90 + 80) / 3 = 90 $`
- `entryPrices = [100, 90, 80]`
- `baseTradeAmount = 1000 / 3 ≈ 333.33 $`
- `tradeAmount = 333.33 * 10 = 3,333.33 $`

### Sans Récupération de Perte (`recovery = false`)

#### 1. Montant par Trade (sans levier)
- `1000 / 3 ≈ 333.33 $`
- **Résultat** : `baseTradeAmount = 333.33 $`

#### 2. Montant Total de la Position
- `333.33 * 10 = 3,333.33 $`
- **Résultat** : `tradeAmount = 3,333.33 $`

#### 3. Prix de Liquidation
- Trade 1 : `100 * (1 - 1/10) = 90 $`
- Trade 2 : `90 * (1 - 1/10) = 81 $`
- Trade 3 : `80 * (1 - 1/10) = 72 $`
- **Résultat** : `liquidationPrice = [90, 81, 72] $`

#### 4. Perte par Trade
- `loss = 333.33 $`
- **Résultat** : `loss = [333.33, 333.33, 333.33] $`

#### 5. Risque Total
- `333.33 * 3 = 999.99 $`
- **Résultat** : `riskTotal = 999.99 $`

#### 6. Frais par Trade
- `makerFeePerTrade = 3,333.33 * (0.1 / 100) * 2 = 6.67 $`
- `fundingFeePerTrade = 3,333.33 * (0.01 / 100) * 5 = 0.17 $`
- `fees = 6.67 + 0.17 = 6.84 $`
- **Résultat** : `fees = 6.84 $`

#### 7. Frais Totaux
- `6.84 * 3 = 20.52 $`
- **Résultat** : `totalFees = 20.52 $`

#### 8. Profit Potentiel
- `profit = 3,333.33 * (100 / 100) = 3,333.33 $`
- **Résultat** : `profit = [3,333.33, 3,333.33, 3,333.33] $`

#### 9. Prix de Sortie
- Trade 1 : `100 + (3,333.33 * 100 / 3,333.33) = 100 + 100 = 200 $`
- Trade 2 : `90 + (3,333.33 * 90 / 3,333.33) = 90 + 90 = 180 $`
- Trade 3 : `80 + (3,333.33 * 80 / 3,333.33) = 80 + 80 = 160 $`
- **Résultat** : `targetPrice = [200, 180, 160] $`

#### 10. Gain Cible Ajusté
- Trade 1 : `((200 - 100) / 100) * 100 = 100 %`
- Trade 2 : `((180 - 90) / 90) * 100 = 100 %`
- Trade 3 : `((160 - 80) / 80) * 100 = 100 %`
- **Résultat** : `adjustedGainTarget = [100, 100, 100] %`

#### 11. Ratio Risque/Récompense
- `3,333.33 / 333.33 ≈ 10.00`
- **Résultat** : `riskRewardRatio = [10.00, 10.00, 10.00]`

#### Profil des Trades (Tableau)
| Trade | Prix d’Entrée ($) | Montant Total ($) | Prix de Liquidation ($) | Prix de Sortie ($) | Profit Potentiel ($) | Frais ($) | Ratio Risque/Récompense |
|-------|-------------------|-------------------|-------------------------|--------------------|----------------------|-----------|-------------------------|
| 1     | 100.00            | 3,333.33          | 90.00                   | 200.00             | 3,333.33             | 6.84      | 10.00                   |
| 2     | 90.00             | 3,333.33          | 81.00                   | 180.00             | 3,333.33             | 6.84      | 10.00                   |
| 3     | 80.00             | 3,333.33          | 72.00                   | 160.00             | 3,333.33             | 6.84      | 10.00                   |

#### Résultats Globaux
- **Profit Cible Total** : `3,333.33 * 3 = 9,999.99 $`
- **Risque Total** : `999.99 $`
- **Frais Totaux** : `20.52 $`
- **Ratio Risque/Récompense Global** : `9,999.99 / 999.99 ≈ 10.00`

### Avec Récupération de Perte (`recovery = true`)

#### Scénario : Trade 2 Gagnant
- **Profit Potentiel** :
  - Trade 1 : `3,333.33 * 1 = 3,333.33 $`
  - Trade 2 : `3,333.33 * 1 + 333.33 = 3,666.66 $`
  - Trade 3 : `3,333.33 * 1 + 333.33 * 2 = 3,999.99 $`
- **Prix de Sortie** :
  - Trade 1 : `100 + (3,333.33 * 100 / 3,333.33) = 200 $`
  - Trade 2 : `90 + (3,666.66 * 90 / 3,333.33) = 90 + 99 ≈ 189 $`
  - Trade 3 : `80 + (3,999.99 * 80 / 3,333.33) = 80 + 96 ≈ 176 $`
- **Gain Cible Ajusté** :
  - Trade 1 : `((200 - 100) / 100) * 100 = 100 %`
  - Trade 2 : `((189 - 90) / 90) * 100 ≈ 110 %`
  - Trade 3 : `((176 - 80) / 80) * 100 = 120 %`
- **Ratio Risque/Récompense** :
  - Trade 1 : `3,333.33 / 333.33 ≈ 10.00`
  - Trade 2 : `3,666.66 / 333.33 ≈ 11.00`
  - Trade 3 : `3,999.99 / 333.33 ≈ 12.00`

#### Profil des Trades (Tableau)
| Trade | Prix d’Entrée ($) | Montant Total ($) | Prix de Liquidation ($) | Prix de Sortie ($) | Profit Potentiel ($) | Frais ($) | Ratio Risque/Récompense |
|-------|-------------------|-------------------|-------------------------|--------------------|----------------------|-----------|-------------------------|
| 1     | 100.00            | 3,333.33          | 90.00                   | 200.00             | 3,333.33             | 6.84      | 10.00                   |
| 2     | 90.00             | 3,333.33          | 81.00                   | 189.00             | 3,666.66             | 6.84      | 11.00                   |
| 3     | 80.00             | 3,333.33          | 72.00                   | 176.00             | 3,999.99             | 6.84      | 12.00                   |

#### Résultats Globaux (Trade 2 Gagnant)
- **Profit Cible Total** : `3,666.66 $` (seul Trade 2 atteint `targetPrice`)
- **Risque Total** : `333.33 $` (perte de Trade 1)
- **Frais Totaux** : `20.52 $`
- **Ratio Risque/Récompense Global** : `3,666.66 / 333.33 ≈ 11.00`

#### Scénario : Trade 3 Gagnant
- **Profit Potentiel** : Identique au tableau ci-dessus.
- **Résultats Globaux** :
  - Profit Cible Total : `3,999.99 $` (seul Trade 3 atteint `targetPrice`)
  - Risque Total : `333.33 * 2 = 666.66 $` (pertes de Trades 1 et 2)
  - Frais Totaux : `20.52 $`
  - Ratio Risque/Récompense Global : `3,999.99 / 666.66 ≈ 6.00`

## Exemple Numérique : Variante 2 (Calculée)

### Calculs Préliminaires
- **Génération des Prix d’Entrée** :
  - `entryPrices = [100, 50, 25, 12.5]` (arrêt à `12.5 ≤ stopLoss = 20`)
- `numberOfTrades = 4`
- `baseTradeAmount = 1000 / 4 = 250 $`
- `tradeAmount = 250 * 10 = 2,500 $`
- `averageEntryPrice = (100 + 50 + 25 + 12.5) / 4 = 46.875 $`

### Sans Récupération de Perte (`recovery = false`)

#### 1. Montant par Trade (sans levier)
- `250 $`
- **Résultat** : `baseTradeAmount = 250 $`

#### 2. Montant Total de la Position
- `2,500 $`
- **Résultat** : `tradeAmount = 2,500 $`

#### 3. Prix de Liquidation
- Trade 1 : `100 * (1 - 1/10) = 90 $`
- Trade 2 : `50 * (1 - 1/10) = 45 $`
- Trade 3 : `25 * (1 - 1/10) = 22.5 $`
- Trade 4 : `12.5 * (1 - 1/10) = 11.25 $`
- **Résultat** : `liquidationPrice = [90, 45, 22.5, 11.25] $`

#### 4. Perte par Trade
- `loss = 250 $`
- **Résultat** : `loss = [250, 250, 250, 250] $`

#### 5. Risque Total
- `250 * 4 = 1,000 $`
- **Résultat** : `riskTotal = 1,000 $`

#### 6. Frais par Trade
- `makerFeePerTrade = 2,500 * (0.1 / 100) * 2 = 5.00 $`
- `fundingFeePerTrade = 2,500 * (0.01 / 100) * 5 = 0.13 $`
- `fees = 5.00 + 0.13 = 5.13 $`
- **Résultat** : `fees = 5.13 $`

#### 7. Frais Totaux
- `5.13 * 4 = 20.52 $`
- **Résultat** : `totalFees = 20.52 $`

#### 8. Profit Potentiel
- `profit = 2,500 * (100 / 100) = 2,500 $`
- **Résultat** : `profit = [2,500, 2,500, 2,500, 2,500] $`

#### 9. Prix de Sortie
- Trade 1 : `100 + (2,500 * 100 / 2,500) = 100 + 100 = 200 $`
- Trade 2 : `50 + (2,500 * 50 / 2,500) = 50 + 50 = 100 $`
- Trade 3 : `25 + (2,500 * 25 / 2,500) = 25 + 25 = 50 $`
- Trade 4 : `12.5 + (2,500 * 12.5 / 2,500) = 12.5 + 12.5 = 25 $`
- **Résultat** : `targetPrice = [200, 100, 50, 25] $`

#### 10. Gain Cible Ajusté
- Trade 1 : `((200 - 100) / 100) * 100 = 100 %`
- Trade 2 : `((100 - 50) / 50) * 100 = 100 %`
- Trade 3 : `((50 - 25) / 25) * 100 = 100 %`
- Trade 4 : `((25 - 12.5) / 12.5) * 100 = 100 %`
- **Résultat** : `adjustedGainTarget = [100, 100, 100, 100] %`

#### 11. Ratio Risque/Récompense
- `2,500 / 250 = 10.00`
- **Résultat** : `riskRewardRatio = [10.00, 10.00, 10.00, 10.00]`

#### Profil des Trades (Tableau)
| Trade | Prix d’Entrée ($) | Montant Total ($) | Prix de Liquidation ($) | Prix de Sortie ($) | Profit Potentiel ($) | Frais ($) | Ratio Risque/Récompense |
|-------|-------------------|-------------------|-------------------------|--------------------|----------------------|-----------|-------------------------|
| 1     | 100.00            | 2,500.00          | 90.00                   | 200.00             | 2,500.00             | 5.13      | 10.00                   |
| 2     | 50.00             | 2,500.00          | 45.00                   | 100.00             | 2,500.00             | 5.13      | 10.00                   |
| 3     | 25.00             | 2,500.00          | 22.50                   | 50.00              | 2,500.00             | 5.13      | 10.00                   |
| 4     | 12.50             | 2,500.00          | 11.25                   | 25.00              | 2,500.00             | 5.13      | 10.00                   |

#### Résultats Globaux
- **Profit Cible Total** : `2,500 * 4 = 10,000 $`
- **Risque Total** : `1,000 $`
- **Frais Totaux** : `20.52 $`
- **Ratio Risque/Récompense Global** : `10,000 / 1,000 = 10.00`

### Avec Récupération de Perte (`recovery = true`)

#### Scénario : Trade 3 Gagnant
- **Profit Potentiel** :
  - Trade 1 : `2,500 * 1 = 2,500 $`
  - Trade 2 : `2,500 * 1 + 250 = 2,750 $`
  - Trade 3 : `2,500 * 1 + 250 * 2 = 3,000 $`
  - Trade 4 : `2,500 * 1 + 250 * 3 = 3,250 $`
- **Prix de Sortie** :
  - Trade 1 : `100 + (2,500 * 100 / 2,500) = 200 $`
  - Trade 2 : `50 + (2,750 * 50 / 2,500) = 50 + 55 = 105 $`
  - Trade 3 : `25 + (3,000 * 25 / 2,500) = 25 + 30 = 55 $`
  - Trade 4 : `12.5 + (3,250 * 12.5 / 2,500) = 12.5 + 16.25 = 28.75 $`
- **Gain Cible Ajusté** :
  - Trade 1 : `((200 - 100) / 100) * 100 = 100 %`
  - Trade 2 : `((105 - 50) / 50) * 100 = 110 %`
  - Trade 3 : `((55 - 25) / 25) * 100 = 120 %`
  - Trade 4 : `((28.75 - 12.5) / 12.5) * 100 = 130 %`
- **Ratio Risque/Récompense** :
  - Trade 1 : `2,500 / 250 = 10.00`
  - Trade 2 : `2,750 / 250 = 11.00`
  - Trade 3 : `3,000 / 250 = 12.00`
  - Trade 4 : `3,250 / 250 = 13.00`

#### Profil des Trades (Tableau)
| Trade | Prix d’Entrée ($) | Montant Total ($) | Prix de Liquidation ($) | Prix de Sortie ($) | Profit Potentiel ($) | Frais ($) | Ratio Risque/Récompense |
|-------|-------------------|-------------------|-------------------------|--------------------|----------------------|-----------|-------------------------|
| 1     | 100.00            | 2,500.00          | 90.00                   | 200.00             | 2,500.00             | 5.13      | 10.00                   |
| 2     | 50.00             | 2,500.00          | 45.00                   | 105.00             | 2,750.00             | 5.13      | 11.00                   |
| 3     | 25.00             | 2,500.00          | 22.50                   | 55.00              | 3,000.00             | 5.13      | 12.00                   |
| 4     | 12.50             | 2,500.00          | 11.25                   | 28.75              | 3,250.00             | 5.13      | 13.00                   |

#### Résultats Globaux (Trade 3 Gagnant)
- **Profit Cible Total** : `3,000 $` (seul Trade 3 atteint `targetPrice`)
- **Risque Total** : `250 * 2 = 500 $` (pertes de Trades 1 et 2)
- **Frais Totaux** : `20.52 $`
- **Ratio Risque/Récompense Global** : `3,000 / 500 = 6.00`

#### Scénario : Trade 4 Gagnant
- **Profit Potentiel** : Identique au tableau ci-dessus.
- **Résultats Globaux** :
  - Profit Cible Total : `3,250 $` (seul Trade 4 atteint `targetPrice`)
  - Risque Total : `250 * 3 = 750 $` (pertes de Trades 1, 2 et 3)
  - Frais Totaux : `20.52 $`
  - Ratio Risque/Récompense Global : `3,250 / 750 ≈ 4.33`

## Comparaison

### Variante 1 vs Variante 2
- **Entrée des Prix** :
  - **Variante 1** : `entryPrices = [100, 90, 80]` saisis manuellement.
  - **Variante 2** : `entryPrices = [100, 50, 25, 12.5]` générés avec `drop = 50 %`, arrêt à `stopLoss = 20`.
- **Nombre de Trades** :
  - Variante 1 : `3`.
  - Variante 2 : `4`.
- **Montant par Trade (sans levier)** :
  - Variante 1 : `333.33 $`.
  - Variante 2 : `250 $`.
- **Résultats** :
  - **Sans Récupération** :
    - Variante 1 : Profit total `9,999.99 $`, risque `999.99 $`, ratio global `10.00`.
    - Variante 2 : Profit total `10,000 $`, risque `1,000 $`, ratio global `10.00`.
  - **Avec Récupération** :
    - Variante 1 (Trade 2 gagnant) : Profit `3,666.66 $`, risque `333.33 $`, ratio global `11.00`.
    - Variante 1 (Trade 3 gagnant) : Profit `3,999.99 $`, risque `666.66 $`, ratio global `6.00`.
    - Variante 2 (Trade 3 gagnant) : Profit `3,000 $`, risque `500 $`, ratio global `6.00`.
    - Variante 2 (Trade 4 gagnant) : Profit `3,250 $`, risque `750 $`, ratio global `4.33`.

### Sans Récupération
- **Variante 1** : Profit constant (`3,333.33 $`) par trade, `targetPrice` double `entryPrice`.
- **Variante 2** : Profit constant (`2,500 $`) par trade, `targetPrice` double `entryPrice`.

### Avec Récupération
- **Variante 1** :
  - Trade 2 gagnant : `targetPrice = [200, 189, 176]`, profits croissants (`3,333.33, 3,666.66, 3,999.99 $`).
  - Trade 3 gagnant : Mêmes `targetPrice`, seul Trade 3 rentable.
- **Variante 2** :
  - Trade 3 gagnant : `targetPrice = [200, 105, 55, 28.75]`, profits croissants (`2,500, 2,750, 3,000, 3,250 $`).
  - Trade 4 gagnant : Mêmes `targetPrice`, seul Trade 4 rentable.

## Remarques
- Le **prix minimum acceptable** (`stopLoss = 20 $`) est utilisé dans la Variante 2 pour arrêter la génération des prix d’entrée.
- Les pertes sont basées sur `baseTradeAmount`, car le prix de liquidation intervient avant `stopLoss`.
- Les profits avec récupération augmentent avec le rang du trade, reflétant les pertes cumulées des trades précédents.
- Une validation dans `validations.ts` pourrait exclure les trades où `entryPrice < stopLoss` (ex. : Trade 4 dans Variante 2) si désiré.
- Les frais ne sont pas inclus dans le `profit` ou `targetPrice`, mais sont comptabilisés dans `totalFees`.

Pour des ajustements (ex. : inclure les frais dans `profit`, autre `drop`, exclusion de `entryPrice < stopLoss`), veuillez préciser !