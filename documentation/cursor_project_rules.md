# Règles du Projet : Simulateur de Positions de Trading (Crypto)

## 1. Aperçu

**Objectif** : Ce document définit les règles, conventions, et bonnes pratiques pour le développement, la collaboration, et la maintenance de l’application web **Simulateur de Positions de Trading (Crypto)**, une application client-side construite avec **React**, **Vite**, **TypeScript**, et **TailwindCSS**. Ces règles assurent la cohérence du code, la qualité, l’accessibilité, et la facilité de maintenance, tout en respectant les exigences décrites dans `project_requirements_document.md`.

**Portée** :

- Conventions pour le code (TypeScript, React, TailwindCSS).
- Règles pour les tests (Vitest), l’internationalisation (react-i18next), et les notifications (react-toastify).
- Directives pour la collaboration (commits, revues de code).
- Références aux livrables :
  - `app_flow_document.md` (flux utilisateur).
  - `backend_structure_document.md` (architecture logicielle).
  - `frontend_guidelines_document.md` (conventions UI).
  - `implementation_plan.md` (étapes de développement).
  - `project_requirements_document.md` (exigences).
  - `tech_stack_document.md` (pile technologique).

## 2. Conventions de Code

### 2.1. TypeScript

- **Typage Strict** :
  - Définir des interfaces dans `src/utils/types.ts` (ex. : `InputParameters`, `Trade`, `Summary`).
  - Éviter `any` ; utiliser `unknown` si nécessaire.
  - Référence : `backend_structure_document.md` (section 5.3).
- **Nommage** :
  - Interfaces : PascalCase (ex. : `InputParameters`).
  - Variables/fonctions : camelCase (ex. : `calculateTrade`).
  - Constantes : UPPER_SNAKE_CASE (ex. : `MIN_POSITION_SIZE = 100`).
- **Organisation** :
  - Logique métier dans `src/utils/` (ex. : `calculations.ts`, `validations.ts`).
  - Types dans `src/utils/types.ts`.
- **Annotations** :
  - Commenter les fonctions complexes (ex. : calcul des frais de financement).
  - Exemple :

    ```typescript
    // Calcule les frais totaux (maker, taker, financement) pour un trade
    function calculateFees(params: InputParameters, trade: Trade): number {
      // ...
    }
    ```

- **Référence** : `tech_stack_document.md` (section 2.3).

### 2.2. React

- **Composants** :
  - Utiliser des composants fonctionnels avec hooks (`useState`, `useEffect`).
  - Nommer en PascalCase (ex. : `InputForm.tsx`).
  - Responsabilité unique (ex. : `TradeTable.tsx` pour tableau).
  - Référence : `frontend_guidelines_document.md` (section 4).
- **Props et État** :
  - Typage des props via interfaces (ex. : `interface TradeTableProps { trades: Trade[] }`).
  - Préférer l’état local (`useState`) sauf pour `App.tsx` (variante, résultats).
- **Performance** :
  - Utiliser `React.memo` pour composants statiques (ex. : `SummaryCard`).
  - Utiliser `useMemo` pour calculs coûteux (ex. : résultats pour ≤ 50 trades).
- **Conventions** :
  - Destructurer les props : `function TradeTable({ trades }: TradeTableProps)`.
  - Utiliser des fragments (`<>...</>`) au lieu de `<div>` inutiles.
- **Référence** : `tech_stack_document.md` (section 2.1).

### 2.3. TailwindCSS

- **Classes** :
  - Appliquer directement dans le JSX (pas de CSS séparé sauf variables globales).
  - Exemple : `<div className="bg-gray-800 text-white p-4 rounded-lg">`.
- **Palette** :
  - Bleu/gris : `bg-blue-600`, `text-gray-800`, `bg-white`.
  - Contrastes élevés (WCAG, ratio ≥ 4.5:1, ex. : `text-white` sur `bg-blue-600`).
  - Référence : `frontend_guidelines_document.md` (section 2.2).
- **Organisation** :
  - Grouper les classes par catégorie : disposition (`flex`, `grid`), espacement (`p-`, `m-`), couleurs (`bg-`, `text-`).
  - Exemple : `className="flex justify-end gap-2 bg-blue-600 text-white p-4"`.
- **Variables Globales** :
  - Définir dans `src/index.css` pour toasts et styles réutilisables :

    ```css
    :root {
      --toastify-color-error: #e3342f;
      --toastify-toast-background: #1f2937;
      --toastify-text-color-light: #ffffff;
    }
    ```

- **Référence** : `tech_stack_document.md` (section 2.4).

## 3. Tests

### 3.1. Outil

- **Vitest** : Outil de test unitaire intégré avec Vite.
- **Couverture** : Minimum 90 % pour `calculations.ts`, `validations.ts`, et composants critiques (`InputForm.tsx`).
- **Référence** : `tech_stack_document.md` (section 4.1).

### 3.2. Conventions

- **Structure** :
  - Tests dans `src/tests/` avec suffixe `.test.ts` (ex. : `calculations.test.ts`).
  - Un fichier de test par module/composant.
- **Cas de Test** :
  - Tester les cas nominaux (ex. : calcul trade avec frais).
  - Tester les cas limites (ex. : solde < 100 $, levier = 0).
  - Tester les erreurs (ex. : toast pour saisie irréaliste).
- **Mocks** :
  - Mocker `react-toastify` et `react-i18next` pour tester notifications/traductions.
  - Exemple :

    ```typescript
    vi.mock('react-toastify', () => ({
      toast: { error: vi.fn() },
    }));
    ```

- **Exécution** :
  - Lancer via `npm run test` ou `yarn test`.
  - Configurer CI (GitHub Actions) pour exécuter tests sur chaque push.
- **Référence** : `implementation_plan.md` (phase 7).

### 3.3. Exemple

```typescript
describe('validateCommonParams', () => {
  it('rejects balance less than 100', () => {
    const params = { balance: 50, leverage: 10, /* ... */ };
    expect(validateCommonParams(params)).toEqual({
      balance: 'Solde trop faible : minimum 100 $ requis.',
    });
  });
});
```

## 4. Internationalisation (i18n)

### 4.1. Outil

- `react-i18next` : Support bilingue (français/anglais).
- Référence : `tech_stack_document.md` (section 3.2).

### 4.2. Conventions

- **Fichiers** :
  - Traductions dans `src/i18n/fr.json` et `src/i18n/en.json`.
  - Exemple (`fr.json`) :

```json
{
  "labels": {
    "balance": "Solde Total"
  },
  "errors": {
    "insufficientBalance": "Solde trop faible : minimum 100 $ requis."
  }
}
```

- **Clés** :

  - Utiliser une structure hiérarchique (ex. : `errors.insufficientBalance`, `labels.balance`).
  - Préfixer par catégorie (ex. : `errors`, `labels`, `buttons`).

- **Utilisation** :

  - Importer `useTranslation` dans les composants.
  - Exemple :

```typescript
const { t } = useTranslation();
<div>{t('labels.balance')}</div>
```

- **Maintenance** :

  - Ajouter toute nouvelle chaîne dans les deux langues.
  - Vérifier les traductions avec un locuteur natif si possible.
  - Référence : `frontend_guidelines_document.md` (section 8).

---

## 5. Notifications (react-toastify)

### 5.1. Conventions

- **Position** : Bas à droite (`position: 'bottom-right'`).

- **Comportement** : Fermeture au clic (`autoClose: false`, `closeOnClick: true`).

- **Types** :

  - `toast.error` : Erreurs critiques (ex. : solde < 100 \$).
  - `toast.info` : Alertes informatives (ex. : durée = 0).

- **Style** :

  - Bleu/gris via TailwindCSS (ex. : `bg-gray-800 text-white border-blue-600`).
  - Définir variables globales dans `src/index.css` :

```css
:root {
  --toastify-color-error: #ca3a3a;
  --toastify-color-info: #5082ba;
  --toastify-toast-background: #202020;
  --toastify-text-color-light: #ffffff;
}
```

- **Accessibilité** :

  - Ajouter `ariaLabel` pour chaque toast (ex. : `ariaLabel: 'Erreur de validation'`).
  - Tester avec lecteurs d'écran (NVDA, VoiceOver).
  - Référence : `frontend_guidelines_document.md` (section 7).

Voici la transcription en **Markdown** des sections 5.2 à 7 visibles sur l’image :

### 5.2. Exemple

```typescript
toast.error(t('errors.unrealisticInput'), {
  position: 'bottom-right',
  autoClose: false,
  closeOnClick: true,
  className: 'bg-gray-800 text-white border border-blue-600 rounded-lg p-4',
  ariaLabel: 'Erreur saisie invalide',
});
```

---

## 6. Accessibilité

- **Champs de formulaire** :

  - Ajouter `aria-label` ou `aria-labelledby` pour chaque input (ex. : `input aria-label="Solde Total"`).
  - Associer labels via `htmlFor` (ex. : `<label htmlFor="balance">Solde Total</label>`).

- **Tableaux** :

  - Utiliser `<thead>`, `<tbody>`, et `scope="col"` pour les en-têtes.
  - Ajouter `aria-sort` pour colonnes triables.

- **Toasts** :

  - S'assurer que les toasts sont annoncés par les lecteurs d’écran.

- **Navigation** :

  - Supporter la tabulation pour onglets, champs, boutons.
  - Focus visible pour les éléments interactifs (ex. : `focus:ring-2 focus:ring-blue-600`).

- **Tests** :

  - Utiliser un outil comme axe ou Lighthouse pour vérifier la conformité WCAG.
  - Référence : `project_requirements_document.md` (section 5.1).

---

## 7. Collaboration

### 7.1. Gestion du Code

- **Git** :

  - Utiliser un dépôt Git (ex. : GitHub, GitLab).
  - Branche principale : `main`.
  - Branches de fonctionnalités : `feature/nom-fonctionnalite` (ex. : `feature/input-form`).

- **Commits** :

  - Messages clairs, en anglais, suivant le format : `<type>(scope): <description>`.
  - Types : `feat`, `fix`, `docs`, `style`, `test`, `chore`.
  - Exemple : `feat(form): add amount field`.

- **Pull Requests (PR)** :

  - Chaque fonctionnalité dans une PR séparée.

  - Inclure description, tests associés, et captures d’écran (si UI).

  - Relecture par au moins un développeur.

  - Référence : `implementation_plan.md` (phase 7).

### 7.2. Outils

- **Éditeur** :

  - Recommandé : VS Code ou Cursor pour support TypeScript/TailwindCSS.
  - Extensions : ESLint, Prettier, TailwindCSS IntelliSense.
  - Référence : `tech_stack_document.md` (section 5.3).

- **Linting** :

  - Utiliser ESLint avec configuration TypeScript/React.
  - Configurer Prettier pour formater le code (`npm run format`).

- **CI/CD** :

  - Configurer GitHub Actions pour exécuter tests/linting sur chaque push.
  - Vérifier couverture des tests (minimum 90 %).

Voici la transcription en **Markdown** des sections 8 à 11 présentes dans cette dernière image :

## 8. Performance

### Objectifs

- Gérer ≥ 50 trades sans latence notable.
- Temps de chargement initial < 2s (Vite optimisé).

### Pratiques

- Minimiser les re-rendus avec `React.memo` et `useMemo`.
- Optimiser TailwindCSS (purge des classes inutiles via `vite.config.ts`).
- Tester sur mobile (minimum 300px) pour fluidité.

### Outils

- Utiliser Chrome DevTools pour profiler les performances.
- Vérifier bundle size avec `vite build --report`.

- Référence : `frontend_guidelines_document.md` (section 9).

---

## 9. Documentation

### Fichiers Obligatoires

- `README.md` : Instructions d’installation, lancement, et structure du projet.
- `project_requirements_document.md` : Exigences fonctionnelles, non fonctionnelles, et techniques.
- `app_flow_document.md` : Description des flux utilisateur et wireframe.
- `design_system_document.md` : Composants UI et règles d’interface.
- `frontend_guidelines_document.md` : Conventions pour l’interface utilisateur.
- `implementation_plan.md` : Étapes et planification du développement.
- `tech_stack_document.md` : Détails de la pile technologique.

### Contenu

- Inclure un glossaire pour termes techniques (ex. : « levier », « Toast »).
- Décrire les prérequis (Node.js ≥ 18, npm/yarn).
- Fournir des exemples clairs pour l’installation et l’utilisation.

#### Exemple pour `README.md`

```markdown
## Installation

1. Cloner le dépôt : `git clone <url>`
2. Installer les dépendances : `npm install`
3. Lancer le serveur de développement : `npm run dev`
```

### Maintenance

- Mettre à jour la documentation à chaque changement majeur.

- S’assurer que tous les livrables sont accessibles dans le dépôt.

- Référence : `implementation_plan.md` (section 8).

---

## 10. Hypothèses

- Les développeurs sont familiers avec React, TypeScript, et TailwindCSS.
- Aucun backend ou persistance n’est requis pour la version initiale.
- L’équipe de développement compte 1-5 personnes.
- Environnement de développement stable (Node.js ≥ 18).

---

## 11. Glossaire

- **TypeScript** : Langage ajoutant un typage statique à JavaScript.
- **React Hook** : Fonction pour gérer l’état ou les effets (ex. : `useState`, `useEffect`).
- **TailwindCSS** : Framework CSS utilitaire pour styling rapide.
- **Vite** : Outil de bundling rapide.
- **react-toastify** : Bibliothèque pour afficher des notifications interactives.
- **react-i18next** : Bibliothèque pour l’internationalisation bilingue.
