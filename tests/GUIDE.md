# Guide d'utilisation du système de tests BP

## 🎯 Vue d'ensemble

Ce système de tests automatisés utilise **Playwright** pour tester l'application Blueprint (BP) de manière interactive. Il me permet de "voir", "cliquer", "glisser-déposer" et interagir avec l'application comme un utilisateur réel.

## 🚀 Démarrage rapide

### 1. Installation
```bash
# Installer les dépendances
npm install

# Installer Playwright
npx playwright install
```

### 2. Exécution des tests
```bash
# Tests rapides (recommandé pour commencer)
node tests/run-tests.js

# Ou directement avec Playwright
npm test
```

## 📁 Structure des tests

```
tests/
├── simple-test.html          # Page de test simplifiée (fonctionnelle)
├── test-page.html           # Page de test complète (en développement)
├── simple.spec.ts           # Tests de base qui fonctionnent
├── basic.spec.ts            # Tests avancés
├── interactive.spec.ts      # Tests d'interactions
├── advanced.spec.ts         # Tests de cas limites
├── custom.spec.ts           # Tests avec utilitaires
├── helpers/
│   └── test-utils.ts        # Utilitaires pour les tests
├── run-tests.js             # Script de démarrage
└── GUIDE.md                 # Ce guide
```

## 🧪 Types de tests disponibles

### Tests de base (`simple.spec.ts`)
- ✅ Chargement de l'application
- ✅ Ajout/suppression de nœuds
- ✅ Sélection de nœuds
- ✅ Glisser-déposer
- ✅ Raccourcis clavier
- ✅ Menu contextuel (clic droit)

### Tests interactifs (`interactive.spec.ts`)
- Clics et sélections
- Glisser-déposer de nœuds
- Création de liens
- Zoom et panoramique
- Propriétés des nœuds

### Tests avancés (`advanced.spec.ts`)
- Sélection multiple
- Validation de blueprints
- Redimensionnement du canvas
- Performance avec de nombreux nœuds
- Cas limites

## 🎮 Fonctionnalités testées

### Interactions de base
- **Clic gauche** : Sélectionner un nœud
- **Clic droit** : Menu contextuel (ajouter un nœud)
- **Glisser-déposer** : Déplacer les nœuds
- **Touche Suppr** : Supprimer le nœud sélectionné

### Contrôles de test
- **Add Node** : Ajouter un nœud
- **Clear All** : Supprimer tous les nœuds
- **Center View** : Centrer la vue
- **Validate BP** : Valider le blueprint

### Raccourcis clavier
- `Delete` : Supprimer le nœud sélectionné
- `Escape` : Désélectionner

## 🔧 Commandes disponibles

### Tests
```bash
# Tous les tests
npm test

# Tests spécifiques
npx playwright test simple.spec.ts
npx playwright test interactive.spec.ts

# Mode visuel (recommandé pour le développement)
npm run test:ui

# Tests avec navigateur visible
npm run test:headed

# Mode debug
npm run test:debug
```

### Serveur de développement
```bash
# Démarrer le serveur
npm run http

# Accéder à l'application
# http://localhost:8080/tests/simple-test.html
```

## 📊 Rapports et débogage

### Rapports HTML
```bash
npx playwright show-report
```

### Captures d'écran
Les captures d'écran des échecs sont sauvegardées dans `test-results/`

### Logs détaillés
```bash
npx playwright test --reporter=list
```

## 🛠️ Développement et personnalisation

### Ajouter de nouveaux tests
1. Créez un nouveau fichier `.spec.ts` dans `tests/`
2. Utilisez les utilitaires de `helpers/test-utils.ts`
3. Suivez les conventions de nommage existantes

### Exemple de test simple
```typescript
import { test, expect } from '@playwright/test';

test('mon nouveau test', async ({ page }) => {
  await page.goto('/tests/simple-test.html');
  await page.click('#add-node');
  await expect(page.locator('#node-count')).toHaveText('Nodes: 1');
});
```

### Utiliser les utilitaires
```typescript
import { BPTestUtils } from './helpers/test-utils';

test('test avec utilitaires', async ({ page }) => {
  const testUtils = new BPTestUtils(page);
  await testUtils.addNode();
  expect(await testUtils.getNodeCount()).toBe(1);
});
```

## 🐛 Dépannage

### Problèmes courants

1. **Port déjà utilisé**
   ```bash
   # Arrêter les processus Node.js
   taskkill /f /im node.exe
   ```

2. **Tests qui échouent**
   - Vérifiez que le serveur fonctionne : `curl http://localhost:8080/simple-test.html`
   - Consultez les captures d'écran dans `test-results/`
   - Exécutez en mode debug : `npm run test:debug`

3. **Modules non trouvés**
   - Vérifiez que le build est à jour : `npm run build`
   - Vérifiez les chemins dans les fichiers HTML

### Logs utiles
```bash
# Tests avec logs détaillés
npx playwright test --reporter=line

# Tests avec traces
npx playwright test --trace=on
```

## 📈 Performance

### Optimisations
- Les tests s'exécutent en parallèle par défaut
- Utilisez `--workers=1` pour les tests séquentiels
- Les captures d'écran ne sont prises qu'en cas d'échec

### Surveillance
```bash
# Tests avec timing
npx playwright test --reporter=html --timeout=60000
```

## 🎯 Prochaines étapes

1. **Tests de l'application complète** : Intégrer les vrais modules BP
2. **Tests de performance** : Mesurer les performances avec de nombreux nœuds
3. **Tests de compatibilité** : Tester sur différents navigateurs
4. **Tests d'intégration** : Tester avec des données réelles

## 📞 Support

Pour toute question ou problème :
1. Consultez les logs dans `test-results/`
2. Vérifiez la configuration dans `playwright.config.ts`
3. Testez avec `npm run test:debug` pour voir l'exécution étape par étape
