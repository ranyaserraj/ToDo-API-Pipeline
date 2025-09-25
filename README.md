# 🚀 Projet ToDo API - Green DevOps

Une mini API REST ToDo avec comparaison de performance Docker entre une image baseline (lourde) et une image optimisée.

## 📋 Fonctionnalités

- **API REST complète** avec Express.js
- **Gestion des tâches** en mémoire (CRUD)
- **Tests unitaires et d'intégration** avec Jest et Supertest
- **Deux Dockerfiles** pour comparaison de performance :
  - `Dockerfile.baseline` : Image lourde non optimisée
  - `Dockerfile.optimized` : Image optimisée avec multi-stage build
- **Pipeline GitHub Actions** pour automatiser la comparaison

## 🛠️ Installation et utilisation

### Prérequis
- Node.js 18+
- Docker
- npm ou yarn

### Installation locale

```bash
# Cloner le projet
git clone <repo-url>
cd pipeline

# Installer les dépendances
npm install

# Démarrer l'API
npm start

# Lancer les tests
npm test
```

### Utilisation avec Docker

#### Image baseline (lourde)
```bash
# Construire l'image baseline
docker build -f Dockerfile.baseline -t todo-api:baseline .

# Lancer le conteneur
docker run -p 3000:3000 todo-api:baseline

# Exécuter les tests
docker run --rm todo-api:baseline npm test
```

#### Image optimisée
```bash
# Construire l'image optimisée
docker build -f Dockerfile.optimized -t todo-api:optimized .

# Lancer le conteneur
docker run -p 3000:3000 todo-api:optimized

# Exécuter les tests
docker run --rm todo-api:optimized npm test
```

## 🔗 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/tasks` | Récupérer toutes les tâches |
| `POST` | `/tasks` | Ajouter une nouvelle tâche |
| `DELETE` | `/tasks/:id` | Supprimer une tâche par ID |
| `GET` | `/health` | Vérifier l'état de l'API |

### Exemples d'utilisation

#### Ajouter une tâche
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"task": "Apprendre Docker"}'
```

#### Récupérer toutes les tâches
```bash
curl http://localhost:3000/tasks
```

#### Supprimer une tâche
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## 🐳 Comparaison des Dockerfiles

### Dockerfile.baseline (Image lourde)
- Utilise `node:18` (image complète)
- Installe toutes les dépendances (dev + production)
- Taille d'image importante
- Temps de build plus long

### Dockerfile.optimized (Image optimisée)
- Utilise `node:18-alpine` (image légère)
- Multi-stage build
- Installe uniquement les dépendances de production
- Utilisateur non-root pour la sécurité
- Taille d'image réduite
- Temps de build optimisé

## 🚀 Pipeline GitHub Actions

Le workflow `.github/workflows/green-devops.yml` automatise :

1. **Job baseline** : Build et test de l'image lourde
2. **Job optimized** : Build et test de l'image optimisée  
3. **Job report** : Génération du rapport de comparaison

### Déclenchement
- Push sur `main` ou `master`
- Pull requests
- Déclenchement manuel (`workflow_dispatch`)

### Métriques collectées
- Taille des images Docker
- Temps d'exécution des tests
- Utilisation mémoire
- Analyse des couches Docker

## 📊 Rapport de performance

Le pipeline génère automatiquement un rapport `report.txt` contenant :
- Comparaison des tailles d'images
- Métriques de performance détaillées
- Recommandations d'optimisation
- Analyse des couches Docker

## 🧪 Tests

Le projet inclut des tests complets :

- **Tests unitaires** : Fonctions de gestion des tâches
- **Tests d'intégration** : API REST avec Supertest
- **Tests de performance** : Gestion de grandes quantités de données

```bash
# Lancer tous les tests
npm test

# Tests avec couverture
npm test -- --coverage
```

## 📁 Structure du projet

```
pipeline/
├── package.json              # Dépendances et scripts
├── server.js                 # Serveur Express
├── tasks.js                  # Logique métier des tâches
├── tasks.test.js             # Tests Jest et Supertest
├── Dockerfile.baseline       # Image Docker lourde
├── Dockerfile.optimized     # Image Docker optimisée
├── .github/
│   └── workflows/
│       └── green-devops.yml  # Pipeline GitHub Actions
└── README.md                 # Documentation
```

## 🎯 Objectifs Green DevOps

Ce projet démontre l'importance de l'optimisation Docker :

- **Réduction de la taille des images** → Moins de stockage et bande passante
- **Amélioration des temps de déploiement** → Meilleure expérience utilisateur
- **Sécurité renforcée** → Utilisateur non-root, image minimale
- **Coûts réduits** → Moins de ressources cloud nécessaires

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**🚀 Happy Coding & Green DevOps! 🌱**
