# 🚀 Configuration Jenkins avec GitHub - ToDo API Pipeline

## 📋 Informations GitHub
- **Repository :** https://github.com/ranyaserraj/ToDo-API-Pipeline.git
- **Branche principale :** `main`
- **Jenkinsfile :** Disponible dans le repository

## 🔧 Configuration Jenkins avec GitHub

### Étape 1 : Accès à Jenkins
1. Ouvrez http://localhost:8080
2. Connectez-vous avec vos identifiants

### Étape 2 : Installation des Plugins GitHub
1. Allez dans **Manage Jenkins** > **Manage Plugins**
2. Installez ces plugins :
   - **GitHub Integration Plugin**
   - **Git Plugin**
   - **Pipeline Plugin**
   - **Docker Pipeline Plugin**

### Étape 3 : Configuration GitHub
1. Allez dans **Manage Jenkins** > **Configure System**
2. Dans **GitHub**, ajoutez :
   - **GitHub Server Name :** `github.com`
   - **API URL :** `https://api.github.com`
   - **Credentials :** Créez un token GitHub (Personal Access Token)

### Étape 4 : Création du Job Pipeline
1. **New Item** > **Pipeline**
2. **Nom :** `ToDo-API-Pipeline`
3. **Configuration :**
   - **Definition :** Pipeline script from SCM
   - **SCM :** Git
   - **Repository URL :** `https://github.com/ranyaserraj/ToDo-API-Pipeline.git`
   - **Credentials :** Aucun (repository public)
   - **Branches to build :** `*/main`
   - **Script Path :** `Jenkinsfile`

### Étape 5 : Configuration Webhook GitHub (Optionnel)
1. Sur GitHub, allez dans **Settings** > **Webhooks**
2. **Add webhook :**
   - **Payload URL :** `http://localhost:8080/github-webhook/`
   - **Content type :** `application/json`
   - **Events :** Push events

## 🎯 Pipeline Automatique

### Tests Exécutés
- ✅ **Tests Unitaires** (28 tests)
- ✅ **Tests d'Intégration** (23 tests)
- ✅ **Tests de Performance LOURDS** (8 tests)
- ✅ **Construction Docker**
- ✅ **Déploiement et Validation**

### Métriques Surveillées
- 🧠 **Mémoire :** Surveillance en temps réel
- ⏱️ **Performance :** Temps d'exécution par étape
- 📊 **Couverture :** Code coverage
- 🔥 **Tests LOURDS :** Stress tests et charge

## 🌐 Accès aux Résultats

### Interface Jenkins
- **URL :** http://localhost:8080
- **Job :** ToDo-API-Pipeline
- **Build History :** Historique des exécutions
- **Console Output :** Logs détaillés

### Application Déployée
- **URL :** http://localhost:3000
- **API Health :** http://localhost:3000/health
- **Interface Web :** http://localhost:3000/index.html

## 📁 Structure du Repository

```
ToDo-API-Pipeline/
├── Jenkinsfile                 # Pipeline Jenkins
├── Dockerfile                  # Image Docker
├── package.json               # Dépendances Node.js
├── server.js                  # API REST Express
├── tasks.js                   # Logique métier
├── tasks.unit.test.js         # Tests unitaires
├── tasks.integration.test.js  # Tests d'intégration
├── tasks.performance.test.js  # Tests de performance LOURDS
├── jest.config.js             # Configuration Jest
├── jest.setup.js              # Setup Jest
├── public/                     # Interface web
└── cloud-carbon-footprint/    # Outil d'analyse carbone
```

## 🚀 Commandes Git Utiles

```bash
# Voir le statut
git status

# Ajouter des modifications
git add .
git commit -m "Description des modifications"
git push origin main

# Voir l'historique
git log --oneline

# Synchroniser avec GitHub
git pull origin main
```

## 🎉 Résultat Attendu

Une fois configuré, Jenkins :
1. **Clone automatiquement** le repository GitHub
2. **Exécute tous les tests** (unitaires, intégration, performance)
3. **Construit l'image Docker** optimisée
4. **Déploie l'application** et valide le fonctionnement
5. **Génère des rapports** détaillés avec métriques

Le pipeline est maintenant **entièrement automatisé** avec GitHub ! 🚀
