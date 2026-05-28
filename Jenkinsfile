pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                withCredentials([file(credentialsId: '.env-portofolio-bank', variable: 'ENV_FILE')]) {
                    bat 'copy %ENV_FILE% .env'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browser') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Automation Test') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {

            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
            cleanWs()
        }

        success {
            echo 'Automation Test Success'
        }

        failure {
            echo 'Automation Test Failed'
        }
    }
}