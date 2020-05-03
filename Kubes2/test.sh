kubectl delete deployment,svc --all
kubectl apply -f <(istioctl kube-inject -f message.yml)
kubectl apply -f <(istioctl kube-inject -f apigateway.yml)
kubectl apply -f <(istioctl kube-inject -f sessionmanagement.yml)
kubectl apply -f <(istioctl kube-inject -f usermanagement.yml)
kubectl apply -f <(istioctl kube-inject -f modelexecution.yml)
kubectl apply -f <(istioctl kube-inject -f dataretrieval.yml)
kubectl apply -f <(istioctl kube-inject -f inference.yml)
kubectl get pods
