# Flux de l’Application : Simulateur de Positions de Trading (Crypto)

## 1. Aperçu

**Objectif** : Ce document décrit le flux utilisateur et les interactions principales de l’application web **Simulateur de Positions de Trading (Crypto)**, développée avec React, Vite, TypeScript, et TailwindCSS. Il détaille les étapes du parcours utilisateur, de la configuration des paramètres de trading à la visualisation des résultats, pour les deux variantes (entrée manuelle et calculée). Le flux inclut les validations, les alertes (via react-toastify), et les interactions avec l’interface (formulaire, tableau, carte résumé).

**Portée** :

- Application client-side, sans backend.
- Supporte deux variantes : Variante 1 (points d’entrée manuels) et Variante 2 (points d’entrée calculés via pourcentages de baisse).
- Interface bilingue (français/anglais), accessible, avec infobulles et toasts interactifs.

---

## 2. Parcours Utilisateur

### 2.1. Étape 1 : Accès à l’Application

- **Action** : L’utilisateur accède à l’application via un navigateur (Chrome, Firefox, Safari, Edge) sur desktop ou mobile (min 320px).
- **Interface** :
  - L’en-tête affiche le titre « Simulateur de Trading Crypto » (bleu foncé, texte blanc, fond gris).
  - Deux onglets sont visibles : « Variante 1 : Entrée Manuelle » et « Variante 2 : Calculée » (onglet actif surligné en bleu).
- **Flux** :
  - Par défaut, l’onglet « Variante 1 » est sélectionné.
  - L’utilisateur peut basculer vers « Variante 2 » en cliquant sur l’onglet correspondant.
  - La langue par défaut (français ou anglais) est définie selon les préférences du navigateur ou un sélecteur de langue (via react-i18next).

### 2.2. Étape 2 : Configuration des Paramètres

- **Action** : L’utilisateur remplit le formulaire pour configurer les paramètres de simulation.
- **Interface** :
  - **Section Formulaire** (gauche sur desktop, pleine largeur sur mobile) :
    - **Champs Communs** :
      - Solde Total : Champ numérique (ex. : 1000).
      - Levier : Champ numérique (max 100, ex. : 10).
      - Prix Stop-Loss : Champ numérique (ex. : 20).
      - Pourcentage Gain Cible : Champ numérique (défaut : 100).
      - Frais Maker : Champ numérique (défaut : 0,1).
      - Frais Taker : Champ numérique (défaut : 0,2).
      - Frais Financement : Champ numérique (défaut : 0,01).
      - Durée Trade : Champ numérique (défaut : 10).
      - Récupération Pertes : Case à cocher (cochée).
      - Symbole : Menu déroulant (BTC/USDT, ETH/USDT, SOL/USDT).
      - Chaque champ a une icône « ? » pour une infobulle (activée au clic).
    - **Variante 1** :
      - Nombre de Trades : Champ numérique (ex. : 3).
      - Prix d’Entrée : Liste dynamique de champs numériques (générée selon Nombre de Trades).
    - **Variante 2** :
      - Prix d’Entrée Initial : Champ numérique (ex. : 100).
      - Pourcentages de Baisse : Liste dynamique (max 99), avec boutons « + Ajouter % » et « - Supprimer % » (ex. : 50, 50).
    - **Boutons** (alignés à droite) :
      - « Simuler les Trades » (bleu, désactivé si entrées invalides).
      - « Réinitialiser » (gris, toujours actif).
- **Validations en Temps Réel** :
  - Les champs sont validés lors de la saisie (ex. : Solde Total > 0, Levier ≤ 100).
  - Erreurs inline affichées sous les champs invalides (ex. : « Prix Stop-Loss doit être < Prix d’Entrée »).
  - Toasts (react-toastify, bas à droite, fermeture au clic) pour :
    - Solde < 100 $ : « Solde trop faible : minimum 100 $ requis. »
    - Levier = 0 : « Levier doit être supérieur à 0. »
    - Durée = 0 : « Durée de trade à 0 : frais de financement ignorés. »
    - Saisie irréaliste (`soldeTotal × levier < 100 $`) : « Saisie irréaliste : position totale inférieure à 100 $. » (bloque simulation).
- **Interactions** :
  - L’utilisateur clique sur une icône « ? » pour voir une infobulle (ex. : « Levier : Multiplie la taille de la position »).
  - Dans Variante 1, ajuster « Nombre de Trades » ajoute/supprime des champs Prix d’Entrée.
  - Dans Variante 2, cliquer sur « + Ajouter % » ajoute un champ pourcentage (max 99).
  - Cliquer sur « Réinitialiser » efface tous les champs et restaure les valeurs par défaut.
  - Le bouton « Simuler les Trades » s’active uniquement si toutes les validations passent.

### 2.3. Étape 3 : Simulation des Trades

- **Action** : L’utilisateur clique sur « Simuler les Trades » pour lancer la simulation.
- **Logique** :
  - **Variante 1** :
    - Divise le Solde Total par Nombre de Trades pour obtenir `montantParTrade` (min 100 $).
    - Calcule pour chaque trade : valeur position, gain brut, frais (maker, taker, financement basé sur durée), gain net, prix sortie, prix liquidation.
  - **Variante 2** :
    - Calcule les prix de liquidation itérativement à partir du Prix d’Entrée Initial et des Pourcentages de Baisse (ex. : 100 $ → 50 $ → 25 $).
    - Détermine `nombreDeTrades` (max 99 ou jusqu’à prix liquidation ≤ stop-loss).
    - Calcule `montantParTrade` et autres métriques comme Variante 1.
  - Si solde insuffisant, arrête au dernier trade valide et affiche toast : « Solde épuisé : impossible de financer tous les trades. »
  - Applique la récupération des pertes (si activée) : ajoute pertes cumulées au gain cible, réinitialise après trade réussi.
- **Flux** :
  - Les calculs sont effectués côté client (TypeScript, arrondi à 2 décimales).
  - Les entrées utilisateur sont conservées après simulation pour permettre des ajustements.

### 2.4. Étape 4 : Visualisation des Résultats

- **Action** : Les résultats s’affichent dans la section Résultats.
- **Interface** :
  - **Section Résultats** (droite sur desktop, sous formulaire sur mobile) :
    - **Tableau par Trade** :
      - 10 colonnes : Numéro Trade, Symbole, Prix d’Entrée, Prix Sortie, Prix Liquidation, Montant Investi, Valeur Position, Frais Payés, Gain Brut, Profit/Perte Net.
      - Défilement vertical (≤ 50 trades).
      - Triable par colonne (icônes flèches).
      - Pertes en rouge, profits en vert.
    - **Carte Résumé** :
      - Affiche Solde Final, Pertes Cumulées, Gains Totaux, ROI (%).
      - Style : fond blanc, ombre, coins arrondis.
- **Interactions** :
  - L’utilisateur clique sur une colonne pour trier (ex. : trier par Profit/Perte Net).
  - Les toasts restent visibles jusqu’à clic pour fermeture.
  - L’utilisateur peut revenir au formulaire pour ajuster les paramètres et relancer la simulation.

### 2.5. Étape 5 : Ajustements et Nouvelle Simulation

- **Action** : L’utilisateur modifie les paramètres et relance la simulation.
- **Flux** :
  - Les entrées précédentes sont conservées (ex. : Solde Total reste 1000 $).
  - L’utilisateur peut cliquer sur « Réinitialiser » pour effacer toutes les entrées.
  - Nouvelle simulation suit les mêmes étapes (validations, calculs, affichage).
- **Interactions** :
  - Basculer entre Variante 1 et Variante 2 via les onglets.
  - Changer la langue (français/anglais) via un sélecteur (si implémenté).

---

## 3. Flux Spécifiques

### 3.1. Gestion des Erreurs

- **Validation Échouée** :
  - Ex. : Prix Stop-Loss ≥ Prix d’Entrée.
  - Affiche erreur inline (ex. : « Prix Stop-Loss doit être < Prix d’Entrée »).
  - Bouton « Simuler » désactivé.
- **Saisie Irréaliste** :
  - Si `soldeTotal × levier < 100 $`, toast : « Saisie irréaliste : position totale inférieure à 100 $. »
  - Simulation bloquée.
- **Solde Insuffisant** :
  - Toast : « Solde épuisé : impossible de financer tous les trades. »
  - Résultats affichés jusqu’au dernier trade valide.

### 3.2. Infobulles

- L’utilisateur clique sur une icône « ? » pour afficher une infobulle (ex. : « Taux de Financement : Frais toutes les 3h pour la durée spécifiée »).
- Infobulle disparaît au clic suivant ou en cliquant ailleurs.

### 3.3. Accessibilité

- Navigation clavier : tabulation pour parcourir champs, onglets, boutons.
- Labels ARIA pour formulaires et tableau (ex. : `aria-label="Solde Total"`).
- Toasts accessibles via lecteurs d’écran (ex. : NVDA).

---

## 4. Diagrammes de Flux (Description Textuelle)

### 4.1. Flux Global

1. **Démarrer** : Accès à l’application, onglet Variante 1 sélectionné.
2. **Configurer** : Saisir paramètres (communs + spécifiques à la variante).
3. **Valider** :
   - Si valide : Activer bouton « Simuler ».
   - Si invalide : Afficher erreurs inline/toasts, désactiver bouton.
4. **Simuler** : Calculer trades (montant, prix sortie/liquidation, frais, pertes).
5. **Afficher** : Rendre tableau et carte résumé, gérer toasts pour erreurs.
6. **Ajuster** : Modifier paramètres ou réinitialiser, retourner à Configurer.

### 4.2. Flux Variante 1

- Saisir Nombre de Trades → Générer champs Prix d’Entrée.
- Valider chaque Prix d’Entrée > Stop-Loss.
- Calculer `montantParTrade = soldeTotal / nombreDeTrades`.
- Simuler chaque trade avec récupération des pertes (si activée).

### 4.3. Flux Variante 2

- Saisir Prix d’Entrée Initial et Pourcentages de Baisse.
- Calculer prix de liquidation itérativement jusqu’à ≤ Stop-Loss.
- Déterminer `nombreDeTrades`, puis `montantParTrade`.
- Simuler trades, prix d’entrée = prix liquidation précédent.

---

## 5. Hypothèses

- L’utilisateur comprend les concepts de trading (levier, stop-loss, frais).
- Les toasts ne s’empilent pas excessivement (limite gérée par react-toastify).
- La langue est sélectionnée au chargement ou via un sélecteur (non détaillé dans le cahier des charges).

---

## 6. Glossaire

- **Toast** : Notification temporaire (via react-toastify) pour erreurs ou alertes.
- **Infobulle** : Texte explicatif affiché au clic sur icône « ? ».
- **Variante 1** : Simulation avec prix d’entrée saisis manuellement.
- **Variante 2** : Simulation avec prix d’entrée calculés via pourcentages de baisse.
- **Récupération des Pertes** : Ajoute pertes cumulées au gain cible, réinitialisé après trade réussi.
