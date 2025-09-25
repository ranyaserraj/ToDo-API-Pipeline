# Script de configuration automatique de Jenkins pour le pipeline ToDo API
Write-Host "Configuration de Jenkins pour le pipeline ToDo API" -ForegroundColor Green

# Attendre que Jenkins soit completement initialise
Write-Host "Attente de l'initialisation de Jenkins..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verifier que Jenkins est accessible
Write-Host "Verification de l'acces a Jenkins..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 10
    Write-Host "Jenkins est accessible sur http://localhost:8080" -ForegroundColor Green
} catch {
    Write-Host "Jenkins n'est pas encore accessible. Veuillez attendre et reessayer." -ForegroundColor Red
    Write-Host "Mot de passe initial: 2912997a746e4392ae4a6bb56c652577" -ForegroundColor Yellow
    Write-Host "Ouvrez http://localhost:8080 dans votre navigateur" -ForegroundColor Cyan
    exit
}

Write-Host ""
Write-Host "Instructions pour configurer le pipeline :" -ForegroundColor Cyan
Write-Host "1. Ouvrez http://localhost:8080 dans votre navigateur" -ForegroundColor White
Write-Host "2. Utilisez le mot de passe: 2912997a746e4392ae4a6bb56c652577" -ForegroundColor White
Write-Host "3. Installez les plugins suggeres" -ForegroundColor White
Write-Host "4. Creez un utilisateur administrateur" -ForegroundColor White
Write-Host "5. Creez un nouveau job 'ToDo-API-Pipeline'" -ForegroundColor White
Write-Host "6. Selectionnez 'Pipeline' comme type de projet" -ForegroundColor White
Write-Host "7. Dans 'Pipeline', selectionnez 'Pipeline script from SCM'" -ForegroundColor White
Write-Host "8. Choisissez 'Git' comme SCM" -ForegroundColor White
Write-Host "9. URL du repository: file:///C:/Users/pc/Desktop/pipeline" -ForegroundColor White
Write-Host "10. Script path: Jenkinsfile" -ForegroundColor White
Write-Host "11. Sauvegardez et lancez le build !" -ForegroundColor White

Write-Host ""
Write-Host "Votre pipeline Jenkinsfile est pret dans le repertoire courant" -ForegroundColor Green
Write-Host "Repertoire du projet: C:\Users\pc\Desktop\pipeline" -ForegroundColor Blue
Write-Host "Jenkinsfile: Jenkinsfile" -ForegroundColor Blue
Write-Host "Image Docker: todo-api-jenkins:latest" -ForegroundColor Blue

Write-Host ""
Write-Host "Le pipeline executera automatiquement :" -ForegroundColor Magenta
Write-Host "   Tests unitaires" -ForegroundColor Green
Write-Host "   Tests d'integration" -ForegroundColor Green  
Write-Host "   Tests de performance LOURDS" -ForegroundColor Green
Write-Host "   Construction Docker" -ForegroundColor Green
Write-Host "   Deploiement et validation" -ForegroundColor Green