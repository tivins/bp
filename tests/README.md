# Tests pour l'application BP

Ce dossier contient les tests automatisés pour l'application Blueprint (BP).

## Configuration

### Prérequis

Pour exécuter les tests, vous devez installer les dépendances :

```bash
npm install
```

### Installation de Playwright

Les navigateurs Playwright seront installés automatiquement lors de la première exécution des tests, ou vous pouvez les installer manuellement :

```bash
npx playwright install
```

## Structure des tests

- `test-page.html` - Page de test avec l'application BP intégrée
- `basic.spec.ts` - Tests de base pour les fonctionnalités principales
- `interactive.spec.ts` - Tests des interactions utilisateur (clics, glisser-déposer, etc.)
- `advanced.spec.ts` - Tests avancés et cas limites
- `helpers/test-utils.ts` - Utilitaires pour faciliter l'écriture des tests

## Exécution des tests

### Tous les tests
```bash
npm test
```

### Interface utilisateur (mode visuel)
```bash
npm run test:ui
```

### Tests en mode visible (avec navigateur ouvert)
```bash
npm run test:headed
```

### Tests en mode debug
```bash
npm run test:debug
```

### Tests spécifiques
```bash
npx playwright test basic.spec.ts
npx playwright test interactive.spec.ts
npx playwright test advanced.spec.ts
```

## Fonctionnalités testées

### Tests de base
- Chargement de l'application
- Ajout de nœuds
- Suppression de nœuds
- Validation du blueprint
- Centrage de la vue

### Tests interactifs
- Menu contextuel (clic droit)
- Sélection de nœuds
- Glisser-déposer de nœuds
- Création de liens
- Propriétés des nœuds
- Raccourcis clavier
- Zoom et panoramique

### Tests avancés
- Sélection multiple
- Validation avec différentes configurations
- Redimensionnement du canvas
- Création/suppression rapide
- Maintien de l'état
- Cas limites
- Performance avec de nombreux nœuds

## Captures d'écran

Les captures d'écran des échecs sont automatiquement sauvegardées dans le dossier `tests/screenshots/`.

## Rapports

Les rapports de test HTML sont générés dans le dossier `playwright-report/` après l'exécution des tests.

## Développement

Pour ajouter de nouveaux tests :

1. Créez un nouveau fichier `.spec.ts` dans le dossier `tests/`
2. Utilisez les utilitaires de `helpers/test-utils.ts` pour simplifier l'écriture
3. Suivez les conventions de nommage existantes
4. Testez vos modifications avec `npm run test:headed` pour voir l'exécution

## Dépannage

Si les tests échouent :

1. Vérifiez que le serveur de développement est démarré (`npm run http`)
2. Vérifiez que l'application se charge correctement dans le navigateur
3. Consultez les captures d'écran dans `tests/screenshots/`
4. Exécutez les tests en mode debug pour voir l'exécution étape par étape
