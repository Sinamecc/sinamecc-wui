pipeline {
    agent any;

    stages {

        stage ("Building docker image") {
            steps {
                    echo "Step: Building docker image"
                    sh 'docker build --build-arg env=dev -t sinamecc_frontend:dev .'
            }   
        }

        stage ("Restarting docker container") {
            steps {
                echo "Step: Stopping current container"
                sh 'test ! -z "`docker ps -a | grep sinamecc_frontend_dev`" && (docker stop sinamecc_frontend_dev && docker rm sinamecc_frontend_dev) || echo "sinamecc_frontend_dev does not exists"'

                echo "Step: Running new container"
                sh 'docker run -d --name sinamecc_frontend_dev -p 8016:80 sinamecc_frontend:dev'
            }   
        }
    }
}
