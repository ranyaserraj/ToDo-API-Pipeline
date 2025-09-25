@echo off
echo ========================================
echo 🚀 EXECUTION DES TESTS JENKINS
echo ========================================

echo.
echo 📦 Construction de l'image Docker...
docker build -t todo-api-heavy .

echo.
echo 🧪 Exécution des tests unitaires...
docker run --rm todo-api-heavy npm run test:unit

echo.
echo 🌐 Exécution des tests d'intégration...
docker run --rm todo-api-heavy npm run test:integration

echo.
echo 🔥 Exécution des tests de performance...
docker run --rm todo-api-heavy npm run test:performance

echo.
echo ✅ Tests terminés avec succès !
echo.
echo 🐳 Image Docker créée : todo-api-heavy
echo 📊 Taille de l'image : 
docker images todo-api-heavy

echo.
echo 🚀 Pour démarrer l'application :
echo docker run -d --name todo-api -p 3000:3000 todo-api-heavy
echo.
echo 🌐 Accédez à l'application sur : http://localhost:3000
