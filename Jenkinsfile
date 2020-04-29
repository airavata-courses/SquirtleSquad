pipeline {
   agent any
   stages {
       stage('Install docker'){
           steps{
               sh '''
                    sudo apt-get update
                    sudo -n apt-get install -y docker.io
                    sudo systemctl start docker
                    sudo systemctl enable docker
                  '''
               }
        }

        stage('Build') {
            steps {
                sh 'echo "printing the build meter"'
                sh '''
                    echo "test work!"
                    ls -lah
                '''
                }
            }


        stage('Building SessionManagement Service') {
            steps {
                dir('SessionManagement/') {
                       sh '''
                       sudo docker login --username=maxprimex123 --password=Gorprime1!
                       sudo docker build -t maxprimex123/squirtlesquad_sessionmanagement:latest .
                       sudo docker push maxprimex123/squirtlesquad_sessionmanagement:latest
                       '''
                }
            }
        }

        stage('Building UserManagement Service') {
            steps {
                dir('UserManagement/') {
                       sh '''
                       sudo docker login --username=maxprimex123 --password=Gorprime1!
                       sudo docker build -t maxprimex123/squirtlesquad_usermanagement:latest .
                       sudo docker push maxprimex123/squirtlesquad_usermanagement:latest
                       '''
                }
            }
        }

        stage('Building APIGateway Service') {
            steps {
                dir('APIGateway/') {
                       sh '''
                       sudo docker login --username=maxprimex123 --password=Gorprime1!
                       sudo docker build -t maxprimex123/squirtlesquad_apigateway:latest .
                       sudo docker push maxprimex123/squirtlesquad_apigateway:latest
                       '''
                }
            }
        }

        stage('Building ModelExecution Service') {
            steps {
                dir('ModelExecution/') {
                       sh '''
                       sudo docker login --username=maxprimex123 --password=Gorprime1!
                       sudo docker build -t maxprimex123/squirtlesquad_modelexecution:latest .
                       sudo docker push maxprimex123/squirtlesquad_modelexecution:latest
                       '''
                }
            }
        }

        stage('Build Inference Service') {
            steps {
                dir('Inference/') {
                       sh '''
                       sudo docker login --username=maxprimex123 --password=Gorprime1!
                       sudo docker build -t maxprimex123/squirtlesquad_inference:latest .
                       sudo docker push maxprimex123/squirtlesquad_inference:latest
                       '''
                }
            }
        }


        stage('Deploying to Kubernetes'){
            steps{
                dir('Kubes2/') {
                    sh '''
                    sudo ssh  -i id_rsa ubuntu@149.165.171.111 &&
                    cd SquirtleSquad &&
                    git checkout dockerized_services &&
                    cd Kubes2/ &&
                    ls &&
                    kubectl apply -f message.yml &&
                    kubectl apply -f apigateway.yml &&
                    kubectl apply -f usermanagement.yml &&
                    kubectl apply -f sessionmanagement.yml &&
                    kubectl apply -f dataretrieval.yml &&
                    kubectl apply -f modelexecution.yml &&
                    kubectl apply -f inference.yml &&
                    kubectl scale deployment/apigateway deployment/usermanagement deployment/sessionmanagement deployment/dataretrieval deployment/modelexecution deployment/inference --replicas=3 &&
                    '''
                }
            }
        }
    }
}
