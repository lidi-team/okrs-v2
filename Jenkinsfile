pipeline {
    agent any
    //  tools {
    //     maven 'M3'
    // }
    stages {
        stage('Pre') { 
            steps {
                sh 'bash ./pre.sh'
            }
        }

        stage('Build') { 
            steps {
                sh 'yarn build &' 
            }
        }
    }
    post {
        failure {
        mail to: 'dinhlehoang35@gmail.com',
             subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
             body: "Something is wrong with ${env.BUILD_URL}"
    }
        success {
            mail to: 'dinhlehoang35@gmail.com',
             subject: "Success notification from Jenkins!",
             body: "Congratulation!"
        }
    }
}