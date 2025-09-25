# 🚀 Guide Configuration Pipeline Jenkins - ToDo API

## 📋 Informations de Connexion Jenkins

- **URL Jenkins :** http://localhost:8080
- **Mot de passe initial :** `2912997a746e4392ae4a6bb56c652577`

## 🔧 Configuration du Pipeline

### Étape 1 : Accès à Jenkins
1. Ouvrez votre navigateur
2. Allez sur http://localhost:8080
3. Utilisez le mot de passe : `2912997a746e4392ae4a6bb56c652577`

### Étape 2 : Installation des Plugins
1. Sélectionnez "Install suggested plugins"
2. Attendez l'installation (5-10 minutes)
3. Créez un utilisateur administrateur

### Étape 3 : Création du Job Pipeline
1. Cliquez sur "New Item"
2. Nom : `ToDo-API-Pipeline`
3. Type : `Pipeline`
4. Cliquez "OK"

### Étape 4 : Configuration du Pipeline
1. Dans la section "Pipeline" :
   - **Definition :** Pipeline script from SCM
   - **SCM :** Git
   - **Repository URL :** `file:///C:/Users/pc/Desktop/pipeline`
   - **Script Path :** `Jenkinsfile`
2. Cliquez "Save"

### Étape 5 : Exécution du Pipeline
1. Cliquez sur "Build Now"
2. Surveillez la progression dans "Build History"
3. Cliquez sur le numéro de build pour voir les détails

## 🎯 Ce que le Pipeline Exécute

### Tests Automatisés
- ✅ **Tests Unitaires** (28 tests)
- ✅ **Tests d'Intégration** (23 tests) 
- ✅ **Tests de Performance LOURDS** (8 tests)

### Construction Docker
- 🐳 **Image :** `todo-api-jenkins:latest`
- ⚡ **Temps :** ~1-2 secondes
- 📦 **Taille :** Optimisée avec Alpine

### Déploiement
- 🚀 **Conteneur :** `todo-api-jenkins`
- 🌐 **Port :** 3000
- ✅ **Validation :** Health check + API tests

## 📊 Métriques de Performance

### Tests Unitaires
- **Durée :** ~1.5 secondes
- **Mémoire :** 92.56 MB max
- **Couverture :** 47.29%

### Tests d'Intégration  
- **Durée :** ~2.3 secondes
- **Mémoire :** 112.58 MB max
- **Couverture :** 61.01%

### Tests de Performance LOURDS
- **Durée :** ~31 secondes
- **Mémoire :** 183.91 MB max
- **Tests :** 1000 tâches, CRUD massif, requêtes simultanées

## 🔍 Surveillance des Résultats

### Interface Jenkins
- **Console Output :** Logs détaillés de chaque étape
- **Test Results :** Résultats des tests avec couverture
- **Build Status :** Succès/Échec avec indicateurs visuels

### Métriques Disponibles
- ⏱️ **Temps d'exécution** par étape
- 🧠 **Utilisation mémoire** en temps réel
- 📈 **Couverture de code** par fichier
- 🔥 **Tests de performance** avec alertes

## 🚨 Alertes et Monitoring

### Fuites Mémoire
- ⚠️ **Alerte :** Si > 50MB de différence
- 📊 **Rapport :** Mémoire max/moyenne

### Tests Échoués
- ❌ **Tests d'intégration :** 8 échecs attendus (fonctionnalités avancées)
- ❌ **Performance :** 1 échec attendu (PayloadTooLargeError)

## 🌐 Accès à l'Application

Une fois le pipeline terminé avec succès :
- **URL Application :** http://localhost:3000
- **API Health :** http://localhost:3000/health
- **Interface Web :** http://localhost:3000/index.html

## 📁 Fichiers du Projet

- **Jenkinsfile :** Pipeline de déploiement
- **Dockerfile :** Image Docker optimisée
- **package.json :** Dépendances Node.js
- **server.js :** API REST Express
- **tasks.js :** Logique métier
- **tests/ :** Tests unitaires, intégration, performance

## 🎉 Résultat Attendu

Le pipeline Jenkins exécutera automatiquement tous les tests et déploiera l'application ToDo API avec :
- ✅ Tests automatisés complets
- ✅ Construction Docker optimisée  
- ✅ Déploiement et validation
- ✅ Monitoring des performances
- ✅ Baseline lourd pour comparaison future
