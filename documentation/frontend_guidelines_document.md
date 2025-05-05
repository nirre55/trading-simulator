# Lignes Directrices Frontend : Simulateur de Positions de Trading (Crypto)

## 1. Aperçu

**Objectif** : Ce document définit les lignes directrices pour le développement frontend de l’application web **Simulateur de Positions de Trading (Crypto)**, une application client-side construite avec **React**, **Vite**, **TypeScript**, et **TailwindCSS**. Il couvre les conventions pour l’interface utilisateur (UI), le styling, les composants React, l’accessibilité, l’internationalisation (react-i18next), les notifications (react-toastify), et les pratiques pour garantir une expérience utilisateur cohérente, performante, et accessible.

**Portée** :

- Développement de l’UI pour le formulaire (Variante 1 : entrée manuelle, Variante 2 : calculée), le tableau des résultats, et la carte résumé.
- Conventions pour TailwindCSS (palette bleu/gris, responsive).
- Gestion des interactions (validations, toasts, infobulles).
- Conformité avec les exigences d’accessibilité (WCAG) et de performance (≤ 50 trades).

---

## 2. Conventions d’Interface Utilisateur (UI)

### 2.1. Structure Générale

- **Disposition** :
  - En-tête : Titre centré « Simulateur de Trading Crypto » (bleu foncé, texte blanc, fond gris).
  - Contenu principal : Deux onglets (« Variante 1 : Entrée Manuelle », « Variante 2 : Calculée ») en haut.
  - Formulaire : Gauche (50 % largeur desktop, pleine largeur mobile).
  - Résultats : Droite (50 % largeur desktop, sous formulaire mobile).
- **Responsive** :
  - Minimum 320px pour mobile.
  - Utiliser TailwindCSS breakpoints (ex. : `sm:`, `md:`) pour adapter la disposition.
  - Exemple : `className="md:flex md:space-x-4"` pour alignement desktop.
- **Comportement Mobile** :
  - Onglets empilés verticalement.
  - Boutons « Simuler »/« Réinitialiser » centrés sous formulaire.
  - Tableau avec défilement horizontal si nécessaire.

### 2.2. Palette de Couleurs

- **Couleurs Principales** :
  - Bleu : `bg-blue-600` (boutons, onglets actifs, bordures).
  - Gris : `bg-gray-800` (fonds, toasts), `text-gray-200` (texte secondaire).
  - Blanc : `bg-white` (carte résumé, fonds clairs).
- **Feedback Visuel** :
  - Pertes : Rouge (`text-red-500`).
  - Profits : Vert (`text-green-500`).
  - Erreurs : Rouge clair (`text-red-400`) pour messages inline.
- **Contrastes** :
  - Respecter WCAG (ex. : `text-white` sur `bg-blue-600` pour ratio ≥ 4.5:1).
  - Tester avec outils comme WebAIM Contrast Checker.

### 2.3. Typographie

- **Police** :
  - Utiliser la police système par défaut (`font-sans`) pour performance.
  - Taille : `text-base` (16px) pour texte principal, `text-sm` pour secondaires.
- **Hiérarchie** :
  - Titres : `text-xl` ou `text-2xl` (ex. : en-tête).
  - Labels : `text-base` (ex. : champs formulaire).
  - Erreurs/Toasts : `text-sm` pour clarté.
- **Accessibilité** :
  - Éviter les tailles < 12px.
  - Utiliser `font-bold` pour éléments importants (ex. : erreurs).

---

## 3. Styling avec TailwindCSS

### 3.1. Conventions

- **Application** :
  - Appliquer les classes directement dans le JSX.
  - Exemple : `<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">Simuler</button>`.
- **Organisation** :
  - Grouper par catégorie : disposition (`flex`, `grid`), espacement (`p-`, `m-`), couleurs (`bg-`, `text-`), autres.
  - Exemple : `className="flex justify-end gap-2 bg-white p-4 rounded-lg shadow"`.
- **Réutilisation** :
  - Créer des classes réutilisables dans `src/index.css` pour motifs fréquents.
  - Exemple :

    ```css
    .input-field {
      @apply border rounded p-2 focus:ring-2 focus:ring-blue-600;
    }
    ```

    Usage : `<input className="input-field" />`.

### 3.2. Responsive Design

- **Breakpoints** :
  - `sm` (640px) : Ajustements mineurs (ex. : padding).
  - `md` (768px) : Passage à disposition flex (formulaire/résultats côte à côte).
  - Exemple : `className="w-full md:w-1/2"`.
- **Tableau** :
  - Utiliser `overflow-x-auto` pour défilement horizontal sur mobile.
  - Exemple : `<div className="overflow-x-auto"><table>...</table></div>`.

### 3.3. Toasts

- **Style** :
  - Fond : `bg-gray-800`.
  - Texte : `text-white`.
  - Bordure : `border-blue-600`.
  - Arrondi : `rounded-lg`.
- **Variables Globales** :
  - Définir dans `src/index.css` :

    ```css
    :root {
      --toastify-color-error: #e3342f;
      --toastify-color-info: #3498db;
      --toastify-toast-background: #1f2937;
      --toastify-text-color-light: #ffffff;
      --toastify-toast-bd-radius: 0.5rem;
    }
    ```

---

## 4. Composants React

### 4.1. Conventions

- **Nommage** :
  - PascalCase (ex. : `InputForm.tsx`).
  - Répertoires : `src/components/` (ex. : `components/TradeTable.tsx`).
- **Structure** :
  - Un composant par fichier.
  - Exporter par défaut : `export default InputForm;`.
- **Props** :
  - Typage via interfaces (ex. : `interface TradeTableProps { trades: Trade[] }`).
  - Utiliser le destructuring : `function TradeTable({ trades }: TradeTableProps)`.
- **État** :
  - Préférer `useState` local sauf pour état global (`App.tsx`).
  - Exemple : `const [formData, setFormData] = useState<InputParameters>(initialData);`.

### 4.2. Composants Principaux

1. **InputForm.tsx** :
   - Formulaire avec onglets (Variante 1/2).
   - Gère validations en temps réel, infobulles, et toasts.
   - Exemple :

     ```tsx
     <div className="md:w-1/2 p-4">
       <input
         className="input-field"
         type="number"
         value={formData.balance}
         onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
         aria-label="Solde Total"
       />
       {errors.balance && <ErrorMessage message={errors.balance} />}
     </div>
     ```

2. **TradeTable.tsx** :
   - Tableau responsive, triable.
   - Exemple :

     ```tsx
     <div className="overflow-x-auto">
       <table className="w-full text-left">
         <thead className="bg-gray-800 text-white">
           <tr>
             <th scope="col" className="p-2">Numéro Trade</th>
             {/* ... */}
           </tr>
         </thead>
         <tbody>
           {trades.map((trade) => (
             <tr key={trade.id} className="border-b">
               <td className="p-2">{trade.id}</td>
               {/* ... */}
             </tr>
           ))}
         </tbody>
       </table>
     </div>
     ```

3. **SummaryCard.tsx** :
   - Carte statique pour résumé.
   - Exemple :

     ```tsx
     <div className="bg-white p-4 rounded-lg shadow">
       <h2 className="text-xl font-bold">Résumé</h2>
       <p>Solde Final : {summary.finalBalance} $</p>
       <p>ROI : {summary.roi}%</p>
     </div>
     ```

### 4.3. Performance

- **Mémoïsation** :
  - Utiliser `React.memo` pour `SummaryCard`, `ErrorMessage`.
  - Utiliser `useMemo` pour calculs dans `TradeTable`.
- **Re-rendus** :
  - Minimiser via clés uniques (`key`) dans listes (ex. : trades).
  - Exemple : `<tr key={trade.id}>`.

---

## 5. Accessibilité

### 5.1. Champs de Formulaire

- **Labels** :
  - Associer via `htmlFor` : `<label htmlFor="balance">Solde Total</label>`.
  - Ajouter `aria-label` si label implicite.
- **Erreurs** :
  - Lier erreurs via `aria-describedby` :

    ```tsx
    <input id="balance" aria-describedby="balance-error" />
    <div id="balance-error" className="text-red-400">{errors.balance}</div>
    ```

### 5.2. Tableau

- Utiliser sémantique `<table>` avec `scope="col"`.
- Ajouter `aria-sort` pour colonnes triables.
- Exemple :

  ```tsx
  <th scope="col" aria-sort={sortColumn === 'profit' ? 'ascending' : 'none'}>
    Profit/Perte
  </th>

### 5.1. Toasts et Infobulles

- **Toasts** :
  - Configurer `ariaLabel` :

    ```tsx
    toast.error(t('errors.insufficientBalance'), { ariaLabel: 'Erreur solde insuffisant' });
    ```

  - Tester avec NVDA/VoiceOver.
- **Infobulles** :
  - Rendre accessibles via `aria-describedby` :

    ```tsx
    <button aria-describedby="tooltip-leverage" onClick={toggleTooltip}>?</button>
    ```

---

## 6. Internationalisation (i18n)

### 6.1. Conventions

- **Clés** :
  - Structure : `labels.balance`, `errors.insufficientBalance`, `buttons.simulate`.
  - Exemple (`fr.json`) :

```json
{
  "labels": { "balance": "Solde Total" },
  "errors": { "insufficientBalance": "Solde trop faible : minimum 100 $ requis." }
}
````

- **Utilisation** :

  - Importer `useTranslation` :

```tsx
const { t } = useTranslation();
<label>{t('labels.balance')}</label>
```

### 6.2. Maintenance

- Ajouter nouvelles chaînes dans `fr.json` et `en.json`.
- Vérifier traductions pour clarté et exactitude.

---

## 7. Notifications (react-toastify)

### 7.1. Conventions

- **Position** : `bottom-right`.

- **Comportement** : `autoClose: false`, `closeOnClick: true`.

- **Types** :

  - `error` : Validations critiques (ex. : solde < 100 \$).
  - `info` : Alertes non bloquantes (ex. : durée = 0).

- **Exemple** :

```tsx
if (formData.balance < 100) {
  toast.error(t('errors.insufficientBalance'), {
    position: 'bottom-right',
    autoClose: false,
    closeOnClick: true,
    className: 'bg-gray-800 text-white border border-blue-600 rounded-lg p-4',
    ariaLabel: 'Erreur solde insuffisant',
  });
}
```

### 7.2. Accessibilité

- Ajouter `ariaLabel` pour chaque toast.
- S’assurer que les toasts sont annoncés par lecteurs d’écran.

---

## 8. Gestion des Erreurs UI

- **Erreurs Inline** :
  - Afficher sous chaque champ via `ErrorMessage.tsx`.
  - Exemple : `<ErrorMessage message={errors.balance} />`.

- **Toasts** :
  - Utiliser pour erreurs globales ou bloquantes (ex. : saisie irréaliste).

- **Feedback Visuel** :
  - Bordure rouge sur champs invalides : `border-red-400`.
  - Message clair et traduit.

---

## 9. Performance

- **Objectifs** :
  - Fluidité pour ≤ 50 trades.
  - Temps de rendu initial < 2s.

- **Pratiques** :
  - Minimiser re-rendus avec `React.memo`, `useMemo`.
  - Purger classes TailwindCSS inutilisées (`vite.config.ts`).
  - Optimiser images/icônes si utilisés (ex. : icônes infobulles).

- **Tests** :
  - Profiler avec Chrome DevTools.
  - Vérifier bundle size avec `vite build --report`.

---

## 10. Hypothèses

- Les utilisateurs comprennent les concepts de trading (levier, stop-loss).
- La palette bleu/gris est cohérente pour tous les écrans.
- Aucun composant tiers complexe (ex. : bibliothèques UI) n’est requis.

---

## 11. Glossaire

- **TailwindCSS** : Framework CSS utilitaire.
- **react-toastify** : Bibliothèque pour notifications.
- **react-i18next** : Bibliothèque pour internationalisation.
- **ARIA** : Attributs pour accessibilité (ex. : `aria-label`).
- **Responsive** : Adaptabilité à différentes tailles d’écran.
