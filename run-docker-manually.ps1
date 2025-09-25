# Script pour exécuter Docker manuellement après le pipeline Jenkins
Write-Host "🐳 EXÉCUTION DOCKER MANUELLE APRÈS JENKINS" -ForegroundColor Green

Write-Host ""
Write-Host "📋 ÉTAPES D'EXÉCUTION :" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. 🏗️ Construction de l'image Docker..." -ForegroundColor Yellow
Write-Host "   docker build -t todo-api:latest ." -ForegroundColor Gray

Write-Host ""
Write-Host "2. 🚀 Démarrage du conteneur..." -ForegroundColor Yellow
Write-Host "   docker stop todo-api-jenkins || true" -ForegroundColor Gray
Write-Host "   docker rm todo-api-jenkins || true" -ForegroundColor Gray
Write-Host "   docker run -d --name todo-api-jenkins -p 3000:3000 todo-api:latest" -ForegroundColor Gray

Write-Host ""
Write-Host "3. 🏥 Test de l'application..." -ForegroundColor Yellow
Write-Host "   curl http://localhost:3000/health" -ForegroundColor Gray
Write-Host "   curl http://localhost:3000/tasks" -ForegroundColor Gray

Write-Host ""
Write-Host "4. 📊 Vérification des logs..." -ForegroundColor Yellow
Write-Host "   docker logs todo-api-jenkins" -ForegroundColor Gray

Write-Host ""
Write-Host "5. 🧹 Nettoyage (optionnel)..." -ForegroundColor Yellow
Write-Host "   docker stop todo-api-jenkins" -ForegroundColor Gray
Write-Host "   docker rm todo-api-jenkins" -ForegroundColor Gray

Write-Host ""
Write-Host "🎯 EXÉCUTION AUTOMATIQUE :" -ForegroundColor Magenta

# Construction de l'image
Write-Host "🏗️ Construction de l'image Docker..." -ForegroundColor Blue
docker build -t todo-api:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Image construite avec succès !" -ForegroundColor Green
    
    # Arrêt des anciens conteneurs
    Write-Host "🧹 Nettoyage des anciens conteneurs..." -ForegroundColor Blue
    docker stop todo-api-jenkins 2>$null
    docker rm todo-api-jenkins 2>$null
    
    # Démarrage du nouveau conteneur
    Write-Host "🚀 Démarrage du conteneur..." -ForegroundColor Blue
    docker run -d --name todo-api-jenkins -p 3000:3000 todo-api:latest
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Conteneur démarré avec succès !" -ForegroundColor Green
        
        # Attente du démarrage
        Write-Host "⏳ Attente du démarrage de l'application..." -ForegroundColor Blue
        Start-Sleep -Seconds 10
        
        # Test de l'application
        Write-Host "🏥 Test de l'application..." -ForegroundColor Blue
        try {
            $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
            Write-Host "✅ Health check réussi !" -ForegroundColor Green
            Write-Host "📊 Réponse: $($healthResponse | ConvertTo-Json)" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Health check échoué: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        try {
            $tasksResponse = Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method GET
            Write-Host "✅ API Tasks fonctionne !" -ForegroundColor Green
            Write-Host "📊 Réponse: $($tasksResponse | ConvertTo-Json)" -ForegroundColor Gray
        } catch {
            Write-Host "❌ API Tasks échoué: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        Write-Host ""
        Write-Host "🌐 APPLICATION DÉPLOYÉE :" -ForegroundColor Magenta
        Write-Host "   URL: http://localhost:3000" -ForegroundColor White
        Write-Host "   Health: http://localhost:3000/health" -ForegroundColor White
        Write-Host "   Tasks: http://localhost:3000/tasks" -ForegroundColor White
        
        Write-Host ""
        Write-Host "📊 LOGS DU CONTENEUR :" -ForegroundColor Yellow
        docker logs --tail 10 todo-api-jenkins
        
    } else {
        Write-Host "❌ Échec du démarrage du conteneur !" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Échec de la construction de l'image !" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 EXÉCUTION TERMINÉE !" -ForegroundColor Green
