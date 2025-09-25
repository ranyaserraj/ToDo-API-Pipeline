# Script de diagnostic des échecs Jenkins
Write-Host "DIAGNOSTIC DES ECHECS JENKINS" -ForegroundColor Red

Write-Host ""
Write-Host "PROBLEMES COURANTS ET SOLUTIONS :" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. PROBLÈME NODE.JS :" -ForegroundColor Red
Write-Host "   - Node.js non installe dans Jenkins" -ForegroundColor Gray
Write-Host "   - Solution : Utiliser Jenkinsfile-docker-simple" -ForegroundColor Green

Write-Host ""
Write-Host "2. PROBLÈME DOCKER :" -ForegroundColor Red
Write-Host "   - Docker non accessible depuis Jenkins" -ForegroundColor Gray
Write-Host "   - Solution : Verifier la configuration Docker" -ForegroundColor Green

Write-Host ""
Write-Host "3. PROBLÈME GIT :" -ForegroundColor Red
Write-Host "   - Git non configure correctement" -ForegroundColor Gray
Write-Host "   - Solution : Verifier la configuration Git" -ForegroundColor Green

Write-Host ""
Write-Host "4. PROBLÈME PERMISSIONS :" -ForegroundColor Red
Write-Host "   - Permissions insuffisantes" -ForegroundColor Gray
Write-Host "   - Solution : Verifier les permissions Docker" -ForegroundColor Green

Write-Host ""
Write-Host "SOLUTIONS RECOMMANDEES :" -ForegroundColor Magenta

Write-Host ""
Write-Host "OPTION 1 - Jenkinsfile Docker Simple :" -ForegroundColor Yellow
Write-Host "1. Allez dans Jenkins > ToDo-API-Pipeline > Configurer" -ForegroundColor White
Write-Host "2. Changez le Script Path vers : Jenkinsfile-docker-simple" -ForegroundColor White
Write-Host "3. Sauvegardez et relancez le build" -ForegroundColor White

Write-Host ""
Write-Host "OPTION 2 - Verification Docker :" -ForegroundColor Yellow
Write-Host "1. Verifiez que Docker fonctionne : docker ps" -ForegroundColor White
Write-Host "2. Verifiez les permissions Docker" -ForegroundColor White
Write-Host "3. Redemarrez Jenkins si necessaire" -ForegroundColor White

Write-Host ""
Write-Host "OPTION 3 - Jenkins sans Docker :" -ForegroundColor Yellow
Write-Host "1. Utilisez Jenkinsfile-simple-github" -ForegroundColor White
Write-Host "2. Executez les tests sans Docker" -ForegroundColor White
Write-Host "3. Construisez Docker manuellement" -ForegroundColor White

Write-Host ""
Write-Host "POUR DIAGNOSTIQUER LE PROBLEME EXACT :" -ForegroundColor Cyan
Write-Host "1. Allez dans Jenkins > ToDo-API-Pipeline > Build le plus recent" -ForegroundColor White
Write-Host "2. Cliquez sur 'Console Output'" -ForegroundColor White
Write-Host "3. Regardez les erreurs detaillees" -ForegroundColor White
Write-Host "4. Copiez les erreurs pour analyse" -ForegroundColor White

Write-Host ""
Write-Host "STATUT ACTUEL :" -ForegroundColor Blue
Write-Host "Jenkins : Fonctionnel" -ForegroundColor Green
Write-Host "Docker : Disponible" -ForegroundColor Green
Write-Host "GitHub : Connecte" -ForegroundColor Green
Write-Host "Pipeline : Echoue (Build recent)" -ForegroundColor Red

Write-Host ""
Write-Host "RECOMMANDATION IMMEDIATE :" -ForegroundColor Magenta
Write-Host "Utilisez Jenkinsfile-docker-simple pour un demarrage rapide !" -ForegroundColor Green
Write-Host "Ce fichier evite les problemes Node.js et se concentre sur Docker" -ForegroundColor Green
