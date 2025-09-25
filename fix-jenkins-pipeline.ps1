# Script de diagnostic et correction du pipeline Jenkins
Write-Host "DIAGNOSTIC DU PIPELINE JENKINS" -ForegroundColor Yellow

Write-Host ""
Write-Host "PROBLEMES POSSIBLES ET SOLUTIONS :" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. PROBLÈME DOCKER :" -ForegroundColor Red
Write-Host "   - Jenkins ne peut pas acceder a Docker depuis son conteneur" -ForegroundColor Gray
Write-Host "   - Solution : Utiliser un Jenkinsfile simplifie" -ForegroundColor Green

Write-Host ""
Write-Host "2. PROBLÈME NODE.JS :" -ForegroundColor Red
Write-Host "   - Node.js non installe dans Jenkins" -ForegroundColor Gray
Write-Host "   - Solution : Installer Node.js dans Jenkins" -ForegroundColor Green

Write-Host ""
Write-Host "3. PROBLÈME GIT :" -ForegroundColor Red
Write-Host "   - Git non configure correctement" -ForegroundColor Gray
Write-Host "   - Solution : Verifier la configuration Git" -ForegroundColor Green

Write-Host ""
Write-Host "SOLUTIONS RECOMMANDEES :" -ForegroundColor Magenta

Write-Host ""
Write-Host "OPTION 1 - Jenkinsfile Simplifie :" -ForegroundColor Yellow
Write-Host "1. Allez dans Jenkins > ToDo-API-Pipeline > Configurer" -ForegroundColor White
Write-Host "2. Dans 'Pipeline', changez le Script Path vers : Jenkinsfile-simple-github" -ForegroundColor White
Write-Host "3. Sauvegardez et relancez le build" -ForegroundColor White

Write-Host ""
Write-Host "OPTION 2 - Installation Node.js dans Jenkins :" -ForegroundColor Yellow
Write-Host "1. Allez dans Manage Jenkins > Manage Plugins" -ForegroundColor White
Write-Host "2. Installez 'NodeJS Plugin'" -ForegroundColor White
Write-Host "3. Allez dans Manage Jenkins > Global Tool Configuration" -ForegroundColor White
Write-Host "4. Configurez Node.js version 18" -ForegroundColor White

Write-Host ""
Write-Host "OPTION 3 - Jenkins avec Docker Socket :" -ForegroundColor Yellow
Write-Host "1. Arretez Jenkins : docker stop jenkins-server" -ForegroundColor White
Write-Host "2. Redemarrez avec Docker socket" -ForegroundColor White

Write-Host ""
Write-Host "POUR DIAGNOSTIQUER LE PROBLEME :" -ForegroundColor Cyan
Write-Host "1. Allez dans Jenkins > ToDo-API-Pipeline > Build 1" -ForegroundColor White
Write-Host "2. Cliquez sur 'Console Output'" -ForegroundColor White
Write-Host "3. Regardez les erreurs detaillees" -ForegroundColor White

Write-Host ""
Write-Host "STATUT ACTUEL :" -ForegroundColor Blue
Write-Host "Jenkins : Fonctionnel" -ForegroundColor Green
Write-Host "GitHub : Connecte" -ForegroundColor Green
Write-Host "Docker : Disponible" -ForegroundColor Green
Write-Host "Pipeline : Echoue (Build 1)" -ForegroundColor Red

Write-Host ""
Write-Host "RECOMMANDATION :" -ForegroundColor Magenta
Write-Host "Utilisez l'OPTION 1 avec le Jenkinsfile simplifie pour un demarrage rapide !" -ForegroundColor Green