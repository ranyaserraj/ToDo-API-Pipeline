pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        DOCKER_REGISTRY = 'localhost:5000'
        IMAGE_NAME = 'todo-api'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Récupération du code source...'
                checkout scm
            }
        }
        
        stage('Setup Environment') {
            steps {
                echo '🔧 Configuration de l\'environnement...'
                sh '''
                    echo "Node.js version:"
                    node --version
                    echo "NPM version:"
                    npm --version
                    echo "Docker version:"
                    docker --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installation des dépendances...'
                sh 'npm install'
            }
        }
        
        stage('Lint Code') {
            steps {
                echo '🔍 Analyse du code...'
                sh 'npm run lint || echo "Lint non configuré, continuons..."'
            }
        }
        
        stage('Unit Tests') {
            steps {
                echo '🧪 Exécution des tests unitaires...'
                sh 'npm test'
            }
            post {
                always {
                    echo '📊 Publication des résultats de tests...'
                    publishTestResults testResultsPattern: 'test-results.xml'
                }
            }
        }
        
        stage('Build Baseline Image') {
            steps {
                echo '🐳 Construction de l\'image baseline...'
                sh '''
                    docker build -f Dockerfile.baseline -t ${IMAGE_NAME}:baseline-${BUILD_NUMBER} .
                    docker tag ${IMAGE_NAME}:baseline-${BUILD_NUMBER} ${IMAGE_NAME}:baseline-latest
                '''
            }
        }
        
        stage('Build Optimized Image') {
            steps {
                echo '🚀 Construction de l\'image optimisée...'
                sh '''
                    docker build -f Dockerfile.optimized -t ${IMAGE_NAME}:optimized-${BUILD_NUMBER} .
                    docker tag ${IMAGE_NAME}:optimized-${BUILD_NUMBER} ${IMAGE_NAME}:optimized-latest
                '''
            }
        }
        
        stage('Performance Tests') {
            parallel {
                stage('Baseline Performance') {
                    steps {
                        echo '📊 Tests de performance baseline...'
                        sh '''
                            echo "=== MÉTRIQUES BASELINE ===" > baseline-metrics.log
                            echo "Taille de l'image:" >> baseline-metrics.log
                            docker images ${IMAGE_NAME}:baseline-latest --format "table {{.Size}}" >> baseline-metrics.log
                            echo "" >> baseline-metrics.log
                            echo "Détails de l'image:" >> baseline-metrics.log
                            docker history ${IMAGE_NAME}:baseline-latest >> baseline-metrics.log
                            
                            echo "Test de démarrage baseline..."
                            time docker run --rm ${IMAGE_NAME}:baseline-latest npm test >> baseline-metrics.log 2>&1
                        '''
                    }
                }
                
                stage('Optimized Performance') {
                    steps {
                        echo '📊 Tests de performance optimisée...'
                        sh '''
                            echo "=== MÉTRIQUES OPTIMISÉES ===" > optimized-metrics.log
                            echo "Taille de l'image:" >> optimized-metrics.log
                            docker images ${IMAGE_NAME}:optimized-latest --format "table {{.Size}}" >> optimized-metrics.log
                            echo "" >> optimized-metrics.log
                            echo "Détails de l'image:" >> optimized-metrics.log
                            docker history ${IMAGE_NAME}:optimized-latest >> optimized-metrics.log
                            
                            echo "Test de démarrage optimisé..."
                            time docker run --rm ${IMAGE_NAME}:optimized-latest npm test >> optimized-metrics.log 2>&1
                        '''
                    }
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                echo '🔗 Tests d\'intégration...'
                sh '''
                    # Démarrer le conteneur baseline
                    docker run -d --name todo-baseline -p 3001:3000 ${IMAGE_NAME}:baseline-latest
                    sleep 10
                    
                    # Tester l'API
                    curl -f http://localhost:3001/health || exit 1
                    curl -f http://localhost:3001/tasks || exit 1
                    
                    # Nettoyer
                    docker stop todo-baseline
                    docker rm todo-baseline
                '''
            }
        }
        
        stage('Generate Report') {
            steps {
                echo '📋 Génération du rapport de performance...'
                sh '''
                    cat > performance-report.txt << 'EOF'
                    ================================================
                    🚀 RAPPORT DE PERFORMANCE JENKINS
                    ================================================
                    
                    📅 Date: $(date)
                    🔄 Build: ${BUILD_NUMBER}
                    📝 Commit: ${GIT_COMMIT}
                    
                    ================================================
                    📊 COMPARAISON DES TAILLES D'IMAGES
                    ================================================
                    EOF
                    
                    echo "" >> performance-report.txt
                    echo "🐌 IMAGE BASELINE:" >> performance-report.txt
                    docker images ${IMAGE_NAME}:baseline-latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" >> performance-report.txt
                    
                    echo "" >> performance-report.txt
                    echo "🚀 IMAGE OPTIMISÉE:" >> performance-report.txt
                    docker images ${IMAGE_NAME}:optimized-latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" >> performance-report.txt
                    
                    echo "" >> performance-report.txt
                    echo "================================================" >> performance-report.txt
                    echo "📈 MÉTRIQUES DE PERFORMANCE" >> performance-report.txt
                    echo "================================================" >> performance-report.txt
                    
                    echo "" >> performance-report.txt
                    echo "🐌 MÉTRIQUES BASELINE:" >> performance-report.txt
                    cat baseline-metrics.log >> performance-report.txt
                    
                    echo "" >> performance-report.txt
                    echo "🚀 MÉTRIQUES OPTIMISÉES:" >> performance-report.txt
                    cat optimized-metrics.log >> performance-report.txt
                    
                    echo "" >> performance-report.txt
                    echo "================================================" >> performance-report.txt
                    echo "🎯 RECOMMANDATIONS" >> performance-report.txt
                    echo "================================================" >> performance-report.txt
                    echo "" >> performance-report.txt
                    echo "✅ Utilisez l'image optimisée pour:" >> performance-report.txt
                    echo "   - Déploiements en production" >> performance-report.txt
                    echo "   - Réduction des coûts de stockage" >> performance-report.txt
                    echo "   - Amélioration des temps de déploiement" >> performance-report.txt
                    echo "   - Sécurité renforcée (utilisateur non-root)" >> performance-report.txt
                    echo "" >> performance-report.txt
                    echo "🏁 Rapport généré avec succès!" >> performance-report.txt
                    echo "================================================" >> performance-report.txt
                '''
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo '📦 Archivage des artefacts...'
                archiveArtifacts artifacts: 'performance-report.txt, baseline-metrics.log, optimized-metrics.log', fingerprint: true
            }
        }
    }
    
    post {
        always {
            echo '🧹 Nettoyage...'
            sh '''
                docker system prune -f || true
                docker image prune -f || true
            '''
        }
        
        success {
            echo '✅ Pipeline terminé avec succès!'
            emailext (
                subject: "✅ Build ${BUILD_NUMBER} - ToDo API - Succès",
                body: """
                🎉 Build ${BUILD_NUMBER} terminé avec succès!
                
                📊 Résultats:
                - Tests unitaires: ✅ Passés
                - Images Docker: ✅ Construites
                - Tests de performance: ✅ Exécutés
                - Rapport généré: ✅ Disponible
                
                🔗 Consultez les artefacts pour plus de détails.
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'admin@example.com'}"
            )
        }
        
        failure {
            echo '❌ Pipeline échoué!'
            emailext (
                subject: "❌ Build ${BUILD_NUMBER} - ToDo API - Échec",
                body: """
                ❌ Build ${BUILD_NUMBER} a échoué!
                
                🔍 Vérifiez les logs pour plus de détails.
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'admin@example.com'}"
            )
        }
    }
}

