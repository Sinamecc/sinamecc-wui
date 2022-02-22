pipeline {
    agent any;

    environment {
        BASE_ECR = "973157324549.dkr.ecr.us-east-2.amazonaws.com"
        ENVIRONMENT = "stage"
        APP = "sinamecc-frontend"
        ECS_CLUSTER_NAME = "sinamecc-cluster-$ENVIRONMENT"
        ECS_SERVICE_NAME = "sinamecc-frontend-$ENVIRONMENT"
    }

    stages {

        stage ("Building docker image") {
            steps {
                echo "Step: Cleaning up local docker"
                sh 'docker system prune -a -f'

                echo "Step: Building docker image"
                sh 'docker build --build-arg env=stage -t $BASE_ECR/$ENVIRONMENT/$APP:$ENVIRONMENT .'
            }
        }

        stage ("Pushing Images and Updating Service to Stage") {
          steps {
            echo "Step: Login ECR"
            sh '/usr/local/bin/aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin $BASE_ECR/$ENVIRONMENT/$APP'

            echo "Step: Pushing base image"
            sh 'docker push $BASE_ECR/$ENVIRONMENT/$APP:$ENVIRONMENT'

            echo "Step: Restarting ECS Service"
            sh '/usr/local/bin/aws ecs update-service --cluster $ECS_CLUSTER_NAME --service $ECS_SERVICE_NAME --force-new-deployment'
          }
        }

        stage ("Waiting on Stage Service to be healthy") {
          steps {
            echo "Step: Waiting on Service to be healthy"
            sh '/usr/local/bin/aws ecs wait services-stable --cluster $ECS_CLUSTER_NAME --service $ECS_SERVICE_NAME'
          }
        }

        stage("Re-tagging stage images for prod") {
          environment {
              ENVIRONMENT = "prod"
              ECS_CLUSTER_NAME = "sinamecc-cluster-$ENVIRONMENT"
              ECS_SERVICE_NAME = "sinamecc-frontend-$ENVIRONMENT"
          }

          steps {
            echo "Step: Re-tagging base docker image for web"
            sh 'docker tag $BASE_ECR/stage/$APP:stage $BASE_ECR/$ENVIRONMENT/$APP:$ENVIRONMENT'
          }
        }

        stage("Pushing Image to Prod and Updating Service") {
          environment {
              ENVIRONMENT = "prod"
              ECS_CLUSTER_NAME = "sinamecc-cluster-$ENVIRONMENT"
              ECS_SERVICE_NAME = "sinamecc-frontend-$ENVIRONMENT"
          }
          steps {
            echo "Step: Login ECR"
            sh '/usr/local/bin/aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin $BASE_ECR/$ENVIRONMENT/$APP'

            echo "Step: Pushing base image"
            sh 'docker push $BASE_ECR/$ENVIRONMENT/$APP:$ENVIRONMENT'

            echo "Step: Restarting ECS Service"
            sh '/usr/local/bin/aws ecs update-service --cluster $ECS_CLUSTER_NAME --service $ECS_SERVICE_NAME --force-new-deployment'
          }
        }

        stage ("Waiting on Prod Service to be healthy") {
          environment {
              ENVIRONMENT = "prod"
              ECS_CLUSTER_NAME = "sinamecc-cluster-$ENVIRONMENT"
              ECS_SERVICE_NAME = "sinamecc-frontend-$ENVIRONMENT"
          }
          steps {
            echo "Step: Waiting on Service to be healthy"
            sh '/usr/local/bin/aws ecs wait services-stable --cluster $ECS_CLUSTER_NAME --service $ECS_SERVICE_NAME'
          }
        }
    }
}
