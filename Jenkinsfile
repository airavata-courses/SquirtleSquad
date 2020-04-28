pipeline {
   agent any
   stages {
       stage('Install docker'){
           steps{
               sh '''
                      sudo apt --assume-yes install docker.io
                      sudo systemctl start docker
                      sudo systemctl enable docker
                  '''
               }
        }

        stage('Build') {
            steps {
                sh 'echo "printing the build meter"'
                sh '''
                    echo "test"
                    ls -lah
                '''
                }
        } 

        stage('Building SessionManagement Service') {
            steps {
                dir('SessionManagement/') {
                       sh '''
                       sudo docker build -t maxprimex123/squirtlesquad_sessionmanagement:latest .
                       sudo docker login --username=maxprimex123 --password=Gorprime1!
                       sudo docker push maxprimex123/squirtlesquad_sessionmanagement:latest
                       '''
                }
            }
        }

        stage('Building UserManagement Service') {
            steps {
                dir('/UserManagement/') {
                       sh '''
                       sudo docker build -t maxprimex123/squirtlesquad_usermanagement:latest .
                       sudo docker login --username=maxprimex123 --password=Gorprime1!
                       sudo docker push maxprimex123/squirtlesquad_usermanagement:latest
                       '''
                }
            }
        }

        stage('Building APIGateway Service') {
            steps {
                dir('/APIGateway/') {
                       sh '''
                       sudo docker build -t maxprimex123/squirtlesquad_apigateway:latest .
                       sudo docker login --username=maxprimex123 --password=Gorprime1!
                       sudo docker push maxprimex123/squirtlesquad_apigateway:latest
                       '''
                }
            }
        }

        stage('Building ModelExecution Service') {
            steps {
                dir('/ModelExecution/') {
                       sh '''
                       sudo docker build -t maxprimex123/squirtlesquad_modelexecution:latest .
                       sudo docker login --username=maxprimex123 --password=Gorprime1!
                       sudo docker push maxprimex123/squirtlesquad_modelexecution:latest
                       '''
                }
            }
        }

        stage('Build Inference Service') {
            steps {
                dir('/Inference') {
                       sh '''
                       sudo docker build -t maxprimex123/squirtlesquad_inferece:latest .
                       sudo docker login --username=maxprimex123 --password=Gorprime1!
                       sudo docker push maxprimex123/squirtlesquad_inference:latest
                       '''
                }
            }
        }


        stage('Deploying to Kubernetes'){
            steps{
                dir('/Kubes2/') {
                    sh '''
                    sudo ssh  -i id_rsa ubuntu@149.165.171.111 &&
                    sudo apt install git -y &&
                    git clone https://github.com/airavata-courses/SquirtleSquad &&
                    cd SquirtleSquad &&
                    git checkout dockerized_services &&
                    cd SquirtleSquad/Kubes2/ &&
                    kubectl delete deployment,svc apigateway usermanagement sessionmanagement dataretrieval modelexecution inference &&
                    kubectl delete deployment zookeeper-dep kafka-dep &&
                    kubectl delete svc zookeeper kafka-service &&
                    kubectl apply -f message.yml &&
                    kubectl apply -f apigateway.yml &&
                    kubectl apply -f usermanagement.yml &&
                    kubectl apply -f sessionmanagement.yml &&
                    kubectl apply -f dataretrieval.yml &&
                    kubectl apply -f modelexecution.yml &&
                    kubectl apply -f inference.yml &&
                    kubectl scale deployment/apigateway deployment/usermanagement deployment/sessionmanagement deployment/dataretrieval deployment/modelexecution deployment/inference --replicas=3
                    '''
                }
            }
        }
}
