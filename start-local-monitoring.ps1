# start-local-monitoring.ps1
# Script pour démarrer le système de monitoring local complet

Write-Host "DÉMARRAGE DU SYSTÈME DE MONITORING LOCAL" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier Docker
Write-Host "1. Vérification de Docker..." -ForegroundColor Green
try {
    $dockerVersion = docker --version
    Write-Host "   ✅ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker non trouvé. Veuillez l'installer." -ForegroundColor Red
    exit 1
}

# 2. Démarrer le système de monitoring complet
Write-Host "2. Démarrage du système de monitoring local..." -ForegroundColor Green
Write-Host "   📊 Prometheus pour la collecte de métriques" -ForegroundColor White
Write-Host "   📈 Grafana pour la visualisation" -ForegroundColor White
Write-Host "   🐳 Application ToDo API" -ForegroundColor White
Write-Host "   📊 Node Exporter pour les métriques système" -ForegroundColor White
Write-Host "   🐳 cAdvisor pour les métriques Docker" -ForegroundColor White

docker-compose -f docker-compose-local-monitoring.yml up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Système de monitoring démarré avec succès !" -ForegroundColor Green
} else {
    Write-Host "   ❌ Erreur lors du démarrage du système" -ForegroundColor Red
    exit 1
}

# 3. Attendre que les services démarrent
Write-Host "3. Attente du démarrage des services..." -ForegroundColor Green
Start-Sleep -Seconds 30

# 4. Vérifier les services
Write-Host "4. Vérification des services..." -ForegroundColor Green

# Vérifier l'application ToDo API
try {
    $todoResponse = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -ErrorAction Stop
    if ($todoResponse.StatusCode -eq 200) {
        Write-Host "   ✅ ToDo API: http://localhost:3000" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  ToDo API en cours de démarrage..." -ForegroundColor Yellow
}

# Vérifier Prometheus
try {
    $prometheusResponse = Invoke-WebRequest -Uri "http://localhost:9090" -UseBasicParsing -ErrorAction Stop
    if ($prometheusResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Prometheus: http://localhost:9090" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Prometheus en cours de démarrage..." -ForegroundColor Yellow
}

# Vérifier Grafana
try {
    $grafanaResponse = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -ErrorAction Stop
    if ($grafanaResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Grafana: http://localhost:3001" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Grafana en cours de démarrage..." -ForegroundColor Yellow
}

# 5. Collecter les métriques locales
Write-Host "5. Collecte des métriques locales d'empreinte carbone..." -ForegroundColor Green
node local-metrics-collector.js

# 6. Afficher les informations d'accès
Write-Host ""
Write-Host "SYSTÈME DE MONITORING LOCAL DÉMARRÉ !" -ForegroundColor Magenta
Write-Host ""
Write-Host "ACCÈS AUX SERVICES :" -ForegroundColor Yellow
Write-Host "   🌐 ToDo API: http://localhost:3000" -ForegroundColor White
Write-Host "   📊 Prometheus: http://localhost:9090" -ForegroundColor White
Write-Host "   📈 Grafana: http://localhost:3001" -ForegroundColor White
Write-Host "   📊 Node Exporter: http://localhost:9100" -ForegroundColor White
Write-Host "   🐳 cAdvisor: http://localhost:8081" -ForegroundColor White
Write-Host ""
Write-Host "CONNEXION GRAFANA :" -ForegroundColor Yellow
Write-Host "   👤 Utilisateur: admin" -ForegroundColor White
Write-Host "   🔑 Mot de passe: admin123" -ForegroundColor White
Write-Host ""
Write-Host "MÉTRIQUES D'EMPREINTE CARBONE :" -ForegroundColor Yellow
Write-Host "   📊 Métriques Prometheus: http://localhost:3000/metrics" -ForegroundColor White
Write-Host "   🌱 Métriques carbone: http://localhost:3000/carbon-metrics" -ForegroundColor White
Write-Host ""
Write-Host "CONFIGURATION GRAFANA :" -ForegroundColor Yellow
Write-Host "   1. Accédez à Grafana: http://localhost:3001" -ForegroundColor White
Write-Host "   2. Ajoutez Prometheus comme source de données" -ForegroundColor White
Write-Host "   3. URL Prometheus: http://prometheus:9090" -ForegroundColor White
Write-Host "   4. Créez un dashboard avec les métriques d'empreinte carbone" -ForegroundColor White

# 7. Ouvrir les services
Write-Host ""
Write-Host "OUVERTURE DES SERVICES :" -ForegroundColor Yellow
try {
    Start-Process "http://localhost:3000"  # ToDo API
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3001"  # Grafana
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:9090" # Prometheus
    Write-Host "   Services ouverts dans le navigateur" -ForegroundColor Green
} catch {
    Write-Host "   Ouvrez manuellement les URLs ci-dessus" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "MONITORING LOCAL TERMINÉ !" -ForegroundColor Magenta
Write-Host "Votre système de monitoring local avec métriques d'empreinte carbone est opérationnel !" -ForegroundColor Magenta
