@echo off
echo ========================================
echo    TESTS LOURDS - BASELINE NON OPTIMISE
echo ========================================

echo.
echo 🏋️  DEMARRAGE DES TESTS LOURDS...
echo.

REM Vérifier que Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé ou pas dans le PATH
    pause
    exit /b 1
)

REM Vérifier que npm est installé
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installé ou pas dans le PATH
    pause
    exit /b 1
)

echo ✅ Node.js et npm sont installés

echo.
echo 📦 Installation des dépendances lourdes...
npm install --verbose

if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo.
echo ✅ Dépendances installées avec succès

echo.
echo 🧪 EXECUTION DES TESTS STANDARDS (40 tests)...
echo.
npm test

if %errorlevel% neq 0 (
    echo ❌ Échec des tests standards
    pause
    exit /b 1
)

echo.
echo ✅ Tests standards réussis

echo.
echo 🔥 EXECUTION DES TESTS LOURDS DE PERFORMANCE...
echo ⚠️  ATTENTION: Ces tests peuvent prendre plusieurs minutes
echo ⚠️  et consommer beaucoup de ressources système
echo.
pause

npm run test:heavy

if %errorlevel% neq 0 (
    echo ❌ Échec des tests lourds
    echo 💡 Ceci est normal si le système manque de ressources
    pause
    exit /b 1
)

echo.
echo ✅ Tests lourds terminés

echo.
echo 📊 EXECUTION DE TOUS LES TESTS AVEC COUVERTURE...
echo.
npm run test:all

echo.
echo 🎯 BENCHMARKING DE L'API (optionnel)...
echo 💡 Démarrez le serveur dans un autre terminal avec 'npm start'
echo 💡 Puis appuyez sur une touche pour continuer ou Ctrl+C pour ignorer
pause

echo.
echo 🚀 Démarrage du benchmark...
echo 📈 Test de charge: 100 connexions simultanées pendant 30 secondes
start /B npm start
timeout /t 5 /nobreak >nul
npm run benchmark

echo.
echo 🎉 TESTS LOURDS TERMINÉS !
echo.
echo 📋 Résultats disponibles dans:
echo    - coverage/heavy-test-report.html
echo    - coverage/heavy-junit.xml
echo    - coverage/lcov-report/index.html
echo.
echo 📊 Statistiques générées:
echo    - Couverture de code
echo    - Métriques de performance
echo    - Rapport de mémoire
echo    - Analyse des fuites
echo.

pause
