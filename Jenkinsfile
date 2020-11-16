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
                // sh 'export A=$(lsof -t -i:8082)'
                sh 'cp /home/ubuntu/.env /var/lib/jenkins/workspace/hep1-instance/.env'
                sh 'npm install'
                sh 'npm update'
                sh 'whoami'
                sh 'pwd'
                sh 'ls -la'
                sh 'yarn'
                sh 'yarn build &'
                sh 'docker build -t frontend .'
                sh 'docker container run -d -p 80:80 --name my-frontend frontend'
            }
        }
        // stage('Deliver') { 
        //     steps {
        //         // sh 'cd ./target'
        //         // sh 'pwd'
        //         // sh 'java -jar ./target/api-0.0.1-SNAPSHOT.jar' 
        //     }
        // }
    }
    post {
        failure {

        mail to: 'dinhlehoang35@gmail.com, hoangledinh65@gmail.com',

             subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
             body: "Something is wrong with ${env.BUILD_URL}"
    }
        success {
            mail to: 'dinhlehoang35@gmail.com, hoangledinh65@gmail.com',
             subject: "Success notification from Jenkins!",
             body: "Success!"

        }
    }
}