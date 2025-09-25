# 🌱 Pipeline ToDo API - Guide Complet d'Exécution

## 🎯 Vue d'Ensemble

Système complet de mesure d'empreinte carbone **LOCAL** pour pipeline CI/CD avec :
- ✅ **API REST ToDo** avec fonctionnalités avancées
- ✅ **Tests automatisés** (unitaires, intégration, performance)
- ✅ **Pipeline Jenkins** avec collecte automatique des métriques
- ✅ **Système de monitoring local** (Prometheus + Grafana)
- ✅ **Métriques système** (CPU, mémoire, Docker, réseau)

---

## 🚀 **ÉTAPE 1 : Exécuter l'Application sur Docker**

### **1.1 Construire l'Image Docker**

```bash
# Construire l'image Docker
docker build -t todo-api .

# Vérifier que l'image est créée
docker images | grep todo-api
```

### **1.2 Démarrer l'Application**

```bash
# Démarrer l'application en arrière-plan
docker run -d --name todo-api -p 3000:3000 todo-api

# Vérifier que l'application fonctionne
curl http://localhost:3000/health

# Tester l'API
curl http://localhost:3000/tasks
```

### **1.3 Accéder à l'Interface Web**

```bash
# Ouvrir l'interface web dans le navigateur
start http://localhost:3000

# Ou manuellement : http://localhost:3000
```

### **1.4 Vérifier les Métriques**

```bash
# Vérifier les métriques Prometheus (format Prometheus)
curl http://localhost:3000/metrics

# Vérifier les métriques d'empreinte carbone (même format)
curl http://localhost:3000/carbon-metrics

# Les deux endpoints retournent les métriques au format Prometheus :
# - cpu_cores_total : Nombre de cores CPU
# - cpu_usage_percent : Utilisation CPU en %
# - memory_* : Métriques de mémoire
# - power_* : Consommation électrique
# - co2_emissions_kg : Émissions CO2
```

---

## 🧪 **ÉTAPE 2 : Exécuter les Tests**

### **2.1 Tests Locaux**

```bash
# Installer les dépendances
npm install

# Exécuter tous les tests
npm test

# Tests spécifiques
npm run test:unit          # Tests unitaires
npm run test:integration   # Tests d'intégration API
npm run test:performance   # Tests de performance lourds
```

### **2.2 Tests avec Docker**

```bash
# Exécuter les tests dans un conteneur
docker run --rm -v ${PWD}:/app -w /app node:18 npm test
```

---

## 🚀 **ÉTAPE 3 : Exécuter le Pipeline Jenkins**

### **3.1 Démarrer Jenkins**

```bash
# Démarrer Jenkins avec Docker
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts

# Attendre que Jenkins démarre (2-3 minutes)
# Accéder à Jenkins sur http://localhost:8080
```

### **3.2 Configuration Jenkins**

1. **Accéder à Jenkins** : http://localhost:8080
2. **Récupérer le mot de passe initial** :
   ```bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. **Installer les plugins suggérés**
4. **Créer un utilisateur administrateur**

### **3.3 Créer le Pipeline**

1. **Nouveau Pipeline** → **Pipeline**
2. **Nom** : `todo-api-pipeline`
3. **Configuration** → **Pipeline script from SCM**
4. **SCM** : Git
5. **Repository URL** : URL de votre repository
6. **Script Path** : `Jenkinsfile`

### **3.4 Exécuter le Pipeline**

```bash
# Le pipeline exécutera automatiquement :
# - Tests unitaires, intégration, performance
# - Build Docker
# - Collecte des métriques d'empreinte carbone
# - Mise à jour du dashboard Grafana
```

---

## 📊 **ÉTAPE 4 : Visualiser la Consommation de Ressources**

### **4.1 Démarrer le Système de Monitoring**

```bash
# Démarrer le système complet de monitoring local
.\start-local-monitoring.ps1

# Ou manuellement :
docker-compose -f docker-compose-local-monitoring.yml up -d
```

### **4.2 Collecter les Métriques Locales**

```bash
# Collecter les métriques d'empreinte carbone
node local-metrics-collector.js

# Vérifier le rapport généré
type local-metrics-report.json

# Le rapport contient :
# - Métriques système (CPU, mémoire, Docker, réseau)
# - Calcul de l'empreinte carbone locale
# - Facteurs d'émission locaux (France)
```

### **4.3 Accéder aux Services de Monitoring**

| Service | URL | Description |
|---------|-----|-------------|
| **🌐 ToDo API** | http://localhost:3000 | Application principale |
| **📊 Prometheus** | http://localhost:9090 | Collecte de métriques |
| **📈 Grafana** | http://localhost:3001 | Visualisation des métriques |
| **📊 Node Exporter** | http://localhost:9100 | Métriques système |
| **🐳 cAdvisor** | http://localhost:8081 | Métriques Docker |

### **4.4 Configuration Grafana**

1. **Accéder à Grafana** : http://localhost:3001
2. **Connexion** :
   - **Utilisateur** : `admin`
   - **Mot de passe** : `admin123`
3. **Ajouter Prometheus comme source de données** :
   - **URL** : `http://prometheus:9090`
   - **Type** : Prometheus
   - **Nom** : `prometheus-local`
4. **Créer un dashboard** avec les métriques d'empreinte carbone :
   - **CPU** : `cpu_usage_percent`
   - **Mémoire** : `memory_used_percent`
   - **Puissance** : `power_watts`, `power_kwh`
   - **CO2** : `co2_emissions_kg`

---

## 📊 **Métriques Visualisées**

### **Métriques Système (Prometheus)**
- 🖥️ **CPU** : `cpu_cores_total`, `cpu_usage_percent`
- 💾 **Mémoire** : `memory_total_bytes`, `memory_used_bytes`, `memory_used_percent`
- 🐳 **Docker** : Métriques via cAdvisor (port 8081)
- 🌐 **Réseau** : Métriques via Node Exporter (port 9100)

### **Métriques d'Empreinte Carbone (Prometheus)**
- ⚡ **Puissance** : `power_watts`, `power_kwh`
- 🌍 **CO2** : `co2_emissions_kg`
- 📊 **Facteur** : `electricity_factor` (0.057 kg CO2e/kWh pour la France)
- 📈 **Temps Réel** : Collecte automatique toutes les 15 secondes

---

## 🎯 **Exécution en Une Seule Commande**

```bash
# Script complet d'automatisation
.\start-local-monitoring.ps1

# Ce script exécute automatiquement :
# 1. Démarrage du système de monitoring
# 2. Collecte des métriques locales
# 3. Ouverture des services dans le navigateur
```

## ✅ **Vérification Rapide**

```bash
# 1. Vérifier que l'application fonctionne
curl http://localhost:3000/health

# 2. Vérifier les métriques
curl http://localhost:3000/metrics

# 3. Vérifier Prometheus
curl http://localhost:9090/api/v1/targets

# 4. Vérifier Grafana
curl http://localhost:3001/api/health

# 5. Collecter les métriques locales
node local-metrics-collector.js
```

---

## 🔧 **Dépannage**

### **Problèmes Courants**

1. **Ports occupés** :
   ```bash
   # Vérifier les ports utilisés
   netstat -an | findstr :3000
   netstat -an | findstr :9090
   netstat -an | findstr :3001
   ```

2. **Conteneurs qui ne démarrent pas** :
   ```bash
   # Vérifier les logs
   docker logs todo-api
   docker logs prometheus-local
   docker logs grafana-local
   ```

3. **Métriques non visibles** :
   ```bash
   # Vérifier que Prometheus collecte les métriques
   curl http://localhost:9090/api/v1/targets
   
   # Vérifier les métriques de l'application
   curl http://localhost:3000/metrics
   curl http://localhost:3000/carbon-metrics
   ```

### **Redémarrage du Système**

```bash
# Arrêter tous les conteneurs
docker-compose -f docker-compose-local-monitoring.yml down

# Redémarrer
docker-compose -f docker-compose-local-monitoring.yml up -d
```

### **Gestion des Conteneurs Docker**

```bash
# Vérifier les conteneurs en cours
docker ps -a

# Arrêter un conteneur spécifique
docker stop todo-api

# Supprimer un conteneur
docker rm todo-api

# Redémarrer l'application ToDo
docker run -d --name todo-api -p 3000:3000 todo-api

# Vérifier les logs en cas de problème
docker logs todo-api
```

---

## 🌱 **Green DevOps Local**

Ce système implémente les principes de **Green DevOps Local** :
- 🔄 **Mesure automatique** de l'empreinte carbone locale
- 📊 **Prometheus + Grafana** pour monitoring temps réel
- 🎯 **Optimisation continue** des ressources locales
- 🌍 **Calcul d'impact** basé sur facteurs d'émission locaux
- 📈 **Métriques système** (CPU, mémoire, Docker, réseau)

**Votre pipeline CI/CD local mesure maintenant automatiquement son empreinte carbone !** 🌱📊
