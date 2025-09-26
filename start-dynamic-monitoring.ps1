# Script PowerShell pour démarrer le système de monitoring dynamique

Write-Host "🚀 DÉMARRAGE DU SYSTÈME DE MONITORING DYNAMIQUE" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier que Docker est actif
Write-Host "1. Vérification de Docker..." -ForegroundColor Green
try {
    docker ps | Out-Null
    Write-Host "   ✅ Docker est actif" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker n'est pas actif. Veuillez démarrer Docker Desktop." -ForegroundColor Red
    exit 1
}

# 2. Vérifier que l'application ToDo est en cours d'exécution
Write-Host "2. Vérification de l'application ToDo..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Application ToDo active" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Application ToDo non accessible" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Application ToDo non accessible. Démarrez l'application d'abord." -ForegroundColor Red
    exit 1
}

# 3. Vérifier que Prometheus est actif
Write-Host "3. Vérification de Prometheus..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9090/api/v1/targets" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Prometheus actif" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Prometheus non accessible" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Prometheus non accessible. Démarrez le monitoring d'abord." -ForegroundColor Red
    exit 1
}

# 4. Vérifier que Grafana est actif
Write-Host "4. Vérification de Grafana..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Grafana actif" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Grafana non accessible" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Grafana non accessible. Démarrez le monitoring d'abord." -ForegroundColor Red
    exit 1
}

# 5. Démarrer le système de monitoring dynamique
Write-Host "5. Démarrage du système de monitoring dynamique..." -ForegroundColor Green
Write-Host "   📊 Collecte des métriques en temps réel" -ForegroundColor Yellow
Write-Host "   📈 Mise à jour automatique du dashboard" -ForegroundColor Yellow
Write-Host "   🔄 Surveillance continue active" -ForegroundColor Yellow
Write-Host ""

# Démarrer le script Node.js en arrière-plan
Start-Process -FilePath "node" -ArgumentList "auto-dynamic-dashboard.js" -WindowStyle Hidden

Write-Host "✅ SYSTÈME DYNAMIQUE DÉMARRÉ !" -ForegroundColor Magenta
Write-Host "==============================" -ForegroundColor Magenta
Write-Host ""
Write-Host "🎯 ACCÈS AUX SERVICES :" -ForegroundColor Yellow
Write-Host "   🌐 ToDo API: http://localhost:3000" -ForegroundColor White
Write-Host "   📊 Prometheus: http://localhost:9090" -ForegroundColor White
Write-Host "   📈 Grafana: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "📋 INSTRUCTIONS GRAFANA :" -ForegroundColor Yellow
Write-Host "   1. Allez sur http://localhost:3001" -ForegroundColor White
Write-Host "   2. Connectez-vous (admin/admin123)" -ForegroundColor White
Write-Host "   3. Cliquez sur 'New' → 'Import'" -ForegroundColor White
Write-Host "   4. Sélectionnez le fichier: dynamic-dashboard.json" -ForegroundColor White
Write-Host "   5. Cliquez sur 'Load'" -ForegroundColor White
Write-Host "   6. Sélectionnez 'prometheus-local' comme source de données" -ForegroundColor White
Write-Host "   7. Cliquez sur 'Import'" -ForegroundColor White
Write-Host ""
Write-Host "🔄 LE DASHBOARD SE METTRA À JOUR AUTOMATIQUEMENT !" -ForegroundColor Green
Write-Host "   📊 Métriques collectées toutes les 30 secondes" -ForegroundColor White
Write-Host "   📈 Dashboard mis à jour en temps réel" -ForegroundColor White
Write-Host "   ⚡ Calcul d'empreinte carbone dynamique" -ForegroundColor White
Write-Host ""
Write-Host "⏹️  Pour arrêter: Appuyez sur Ctrl+C dans le terminal" -ForegroundColor Red


