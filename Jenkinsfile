pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
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
        
        stage('Unit Tests Only') {
            steps {
                echo '🧪 Exécution des tests unitaires uniquement...'
                sh 'npm run test:unit'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Construction de l\'image Docker...'
                sh '''
                    docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                    docker images ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }
        
        stage('Test Docker Image') {
            steps {
                echo '🧪 Test de l\'image Docker...'
                sh '''
                    docker run --rm ${IMAGE_NAME}:${BUILD_NUMBER} npm run test:unit
                '''
            }
        }
        
        stage('Collect Metrics') {
            steps {
                echo '📊 Collecte des métriques...'
                sh '''
                    node local-metrics-collector.js
                    echo "Métriques collectées:"
                    cat local-metrics-report.json
                '''
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
            echo '✅ Pipeline terminé avec succès !'
        }
        failure {
            echo '❌ Pipeline échoué !'
        }
    }
}
