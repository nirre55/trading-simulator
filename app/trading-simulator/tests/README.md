# Organisation des Tests

Pour améliorer la maintainabilité et la lisibilité des tests, nous avons organisé les tests en dossiers :

## Structure des dossiers

- **components/** : Tests pour les composants React
  - **ui/** : Composants d'interface utilisateur de base
  - **forms/** : Composants de formulaires
  - **features/** : Composants fonctionnels complexes
  - **layout/** : Composants de mise en page
- **utils/** : Tests pour les utilitaires (calculs, validations)
- **integration/** : Tests d'intégration
- **i18n/** : Tests d'internationalisation

## Bonnes pratiques

1. **Nommage cohérent** : Utiliser le même format de nommage pour tous les fichiers de test (ex: `ComponentName.test.tsx`).
2. **Co-location** : Les tests suivent la même structure que le code source.
3. **Séparation** : Tests unitaires vs tests d'intégration.
4. **Isolation** : Chaque test unitaire est isolé et indépendant.

Cette organisation facilite la navigation dans les tests et améliore la collaboration.
