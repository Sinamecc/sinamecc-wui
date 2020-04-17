pipeline {
    agent any;

    stages {

        stage ("Building docker image") {
            steps {
                    echo "Step: Building docker image"
                    sh 'docker build -t sinamecc_frontend:dev .'
            }   
        }

        stage ("Restarting docker container") {
            steps {
                echo "Step: Stopping current container"
                sh 'test ! -z "`docker ps | grep sinamecc_frontend_dev`" && (docker stop sinamecc_frontend_dev && docker rm sinamecc_frontend_dev) || echo "sinamecc_frontend_dev does not exists"'

                echo "Step: Running new container"
                sh 'docker run -d -e "DJANGO_SETTINGS_MODULE=config.settings.stage_aws" --name sinamecc_frontend_dev sinamecc_frontend:dev'
            }   
        }
    }
}