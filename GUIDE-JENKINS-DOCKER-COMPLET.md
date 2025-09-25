# 🐳 Guide Jenkins avec Docker Complet - ToDo API Pipeline

## ✅ Jenkins Redémarré avec Accès Docker

Jenkins a été redémarré avec accès complet à Docker :
- **Docker Socket :** Monté dans Jenkins
- **Docker Binary :** Accessible depuis Jenkins
- **Volumes :** Persistance des données

## 🔧 Configuration du Pipeline Docker Complet

### Étape 1 : Accès à Jenkins
1. **Ouvrez :** http://localhost:8080
2. **Attendez l'initialisation** (2-3 minutes)
3. **Utilisez le mot de passe :** `2912997a746e4392ae4a6bb56c652577`

### Étape 2 : Configuration du Pipeline
1. **New Item** > **Pipeline**
2. **Nom :** `ToDo-API-Pipeline-Docker`
3. **Configuration :**
   - **Definition :** Pipeline script from SCM
   - **SCM :** Git
   - **Repository URL :** `https://github.com/ranyaserraj/ToDo-API-Pipeline.git`
   - **Branches to build :** `*/main`
   - **Script Path :** `Jenkinsfile-docker-complete`

### Étape 3 : Lancement du Build
1. **Cliquez "Build Now"**
2. **Surveillez la progression** complète

## 🎯 Pipeline Docker Complet

### 📋 Étapes du Pipeline

#### **1. Checkout**
- Récupération du code depuis GitHub

#### **2. Setup Environment**
- Vérification des outils (Node.js, Docker, Git)
- Installation automatique de Node.js si nécessaire

#### **3. Install Dependencies**
- `npm install` pour toutes les dépendances

#### **4. Tests Complets**
- **Tests Unitaires :** 28 tests
- **Tests d'Intégration :** 23 tests
- **Tests de Performance LOURDS :** 8 tests

#### **5. Build Docker Image**
- Construction de l'image Docker optimisée
- Tagging avec numéro de build
- Push vers registry local

#### **6. Run Docker Container**
- Démarrage du conteneur
- Exposition sur port 3000
- Configuration automatique

#### **7. Health Check**
- Vérification de l'endpoint `/health`
- Test de l'API `/tasks`
- Validation du déploiement

#### **8. API Tests**
- Tests complets de l'API déployée
- Création de tâches via API
- Vérification des statistiques

#### **9. Performance Monitoring**
- Monitoring mémoire du conteneur
- Taille de l'image Docker
- Logs du conteneur

## 🚀 Fonctionnalités Avancées

### **🐳 Docker Complet**
- **Build automatique** de l'image
- **Déploiement automatique** du conteneur
- **Tests d'intégration** avec l'API déployée
- **Monitoring** des performances

### **📊 Monitoring en Temps Réel**
- **Mémoire :** Surveillance du conteneur
- **Performance :** Temps d'exécution par étape
- **Logs :** Console output détaillé
- **API :** Tests automatiques des endpoints

### **🔧 Gestion Automatique**
- **Nettoyage :** Arrêt automatique des conteneurs
- **Rapports :** Succès/échec avec détails
- **Notifications :** Statut final du pipeline

## 🌐 Accès à l'Application

Une fois le pipeline terminé avec succès :
- **URL :** http://localhost:3000
- **API Health :** http://localhost:3000/health
- **Interface Web :** http://localhost:3000/index.html
- **API Tasks :** http://localhost:3000/tasks
- **API Stats :** http://localhost:3000/stats

## 📁 Fichiers du Pipeline

- **Jenkinsfile-docker-complete :** Pipeline complet avec Docker
- **Dockerfile :** Image Docker optimisée
- **package.json :** Dépendances Node.js
- **Tests :** Unitaires, intégration, performance

## 🎉 Résultat Attendu

Le pipeline exécutera automatiquement :
- ✅ **Tous les tests** (unitaires, intégration, performance)
- ✅ **Construction Docker** complète
- ✅ **Déploiement automatique** du conteneur
- ✅ **Tests d'API** sur l'application déployée
- ✅ **Monitoring** des performances
- ✅ **Validation** complète du déploiement

## 🔍 Surveillance des Résultats

### Interface Jenkins
- **Console Output :** Logs détaillés de chaque étape
- **Build History :** Historique des exécutions
- **Test Results :** Résultats des tests avec couverture
- **Performance :** Métriques de performance

### Métriques Disponibles
- ⏱️ **Temps d'exécution** par étape
- 🧠 **Utilisation mémoire** du conteneur
- 📈 **Couverture de code** par fichier
- 🔥 **Tests de performance** avec alertes
- 🐳 **Taille de l'image** Docker

## 🚀 Commandes Utiles

```bash
# Voir les conteneurs en cours
docker ps

# Voir les logs du conteneur
docker logs todo-api-jenkins

# Tester l'API
curl http://localhost:3000/health

# Arrêter l'application
docker stop todo-api-jenkins
```

## ✅ Votre Pipeline Docker Complet est Prêt !

Suivez les instructions ci-dessus pour voir le pipeline complet s'exécuter avec Docker, tests, déploiement et monitoring ! 🎯
