kubectl delete deployment,svc --all
kubectl apply -f <(istioctl kube-inject -f message.yml)
kubectl apply -f <(istioctl kube-inject -f apigateway.yml)
kubectl delete secret ctmd-config
kubectl create secret generic ctmd-config --from-literal="MongoDB__ConnectionString=mongodb+srv://sathyan:1234@sathyan-cluster-jj8km.mongodb.net/test?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
kubectl apply -f <(istioctl kube-inject -f sessionmanagement.yml)
kubectl delete secret ctmd-config
kubectl create secret generic ctmd-config --from-literal=MongoDB__ConnectionString="mongodb+srv://anuragkumar:Qwerty@123@cluster0-mbssp.mongodb.net/test?retryWrites=true&w=majority"
kubectl apply -f <(istioctl kube-inject -f usermanagement.yml)
kubectl apply -f <(istioctl kube-inject -f modelexecution.yml)
kubectl apply -f <(istioctl kube-inject -f dataretrieval.yml)
kubectl apply -f <(istioctl kube-inject -f inference.yml)
kubectl get pods
