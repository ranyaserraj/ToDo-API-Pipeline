# Script de configuration Jenkins avec GitHub
Write-Host "Configuration Jenkins avec GitHub pour ToDo API Pipeline" -ForegroundColor Green

Write-Host ""
Write-Host "INSTRUCTIONS POUR CONFIGURER JENKINS AVEC GITHUB :" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ouvrez Jenkins : http://localhost:8080" -ForegroundColor White
Write-Host "2. Connectez-vous avec vos identifiants" -ForegroundColor White
Write-Host "3. Installez les plugins GitHub :" -ForegroundColor Yellow
Write-Host "   - GitHub Integration Plugin" -ForegroundColor Gray
Write-Host "   - Git Plugin" -ForegroundColor Gray
Write-Host "   - Pipeline Plugin" -ForegroundColor Gray
Write-Host "   - Docker Pipeline Plugin" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Creez un nouveau job :" -ForegroundColor Yellow
Write-Host "   - Nom : 'ToDo-API-Pipeline'" -ForegroundColor Gray
Write-Host "   - Type : Pipeline" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Configuration du Pipeline :" -ForegroundColor Yellow
Write-Host "   - Definition : Pipeline script from SCM" -ForegroundColor Gray
Write-Host "   - SCM : Git" -ForegroundColor Gray
Write-Host "   - Repository URL : https://github.com/ranyaserraj/ToDo-API-Pipeline.git" -ForegroundColor Gray
Write-Host "   - Branches to build : */main" -ForegroundColor Gray
Write-Host "   - Script Path : Jenkinsfile" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Lancez le build et regardez les resultats !" -ForegroundColor Green

Write-Host ""
Write-Host "VOTRE REPOSITORY GITHUB :" -ForegroundColor Magenta
Write-Host "https://github.com/ranyaserraj/ToDo-API-Pipeline.git" -ForegroundColor Blue
Write-Host "Branche : main" -ForegroundColor Blue
Write-Host "Jenkinsfile : Disponible" -ForegroundColor Blue

Write-Host ""
Write-Host "LE PIPELINE EXECUTERA AUTOMATIQUEMENT :" -ForegroundColor Magenta
Write-Host "   Tests unitaires (28 tests)" -ForegroundColor Green
Write-Host "   Tests d'integration (23 tests)" -ForegroundColor Green
Write-Host "   Tests de performance LOURDS (8 tests)" -ForegroundColor Green
Write-Host "   Construction Docker optimisee" -ForegroundColor Green
Write-Host "   Deploiement et validation" -ForegroundColor Green

Write-Host ""
Write-Host "ACCES A L'APPLICATION :" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host "   http://localhost:3000/health" -ForegroundColor White
Write-Host "   http://localhost:3000/index.html" -ForegroundColor White

Write-Host ""
Write-Host "METRIQUES SURVEILLEES :" -ForegroundColor Yellow
Write-Host "   Memoire en temps reel" -ForegroundColor Gray
Write-Host "   Performance par etape" -ForegroundColor Gray
Write-Host "   Couverture de code" -ForegroundColor Gray
Write-Host "   Tests de charge et stress" -ForegroundColor Gray

Write-Host ""
Write-Host "CONFIGURATION TERMINEE !" -ForegroundColor Green
Write-Host "Votre pipeline Jenkins est maintenant connecte a GitHub !" -ForegroundColor Green