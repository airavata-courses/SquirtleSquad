#!/bin/bash
# My first script

echo "Tunnelling local host now"

cd SquirtleSquad/Kubes2/

#view pods
kubectl get pods

sleep 30

ngrok http 8080