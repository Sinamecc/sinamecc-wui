pipeline {
    agent any;

    stages {

        stage ("Building docker image") {
            steps {
                    echo "Step: Building docker image"
                    sh 'docker build --build-arg env=stage -t sinamecc_frontend:stage .'
            }   
        }

        stage ("Restarting docker container") {
            steps {
                echo "Step: Stopping current container"
                sh 'test ! -z "`docker ps | grep sinamecc_frontend_stage`" && (docker stop sinamecc_frontend_stage && docker rm sinamecc_frontend_stage) || echo "sinamecc_frontend_stage does not exists"'

                echo "Step: Running new container"
                sh 'docker run -d --name sinamecc_frontend_stage -p 8026:80 sinamecc_frontend:stage'
            }   
        }
    }
}
