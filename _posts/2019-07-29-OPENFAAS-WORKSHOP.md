---
layout:     post
title:      "OpenFaaS Setup"
subtitle:   "Settuping up OpenFaaS and deploying your first serverless function"
date:       2019-07-29 20:02:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"	
comments: true
tags: [ Guide ]
---

# Getting OpenFaaS up and running

This tutorial is going to help you get [OpenFaas](https://github.com/openfaas/faas) up in running and deploying a simple function. The instructions are geared towards a Ubuntu setup but are generic enough to work with many platforms.

# Prerequisites

### Docker

https://docs.docker.com/install/linux/docker-ce/ubuntu/

### faas-cli/faas

```
curl -sSL https://cli.openfaas.com | sudo sh
```

### helm

```
sudo snap install helm --classic
```

### DinD, [Docker in Docker](https://github.com/kubernetes-sigs/kubeadm-dind-cluster/blob/master/dind-cluster.sh)

As of writing this DinD has fully be deprecated in favor of [KinD](https://kind.sigs.k8s.io/). OpenFaas is great in that it will work with any k8s setup. Local on prem using minikube,DinD,KinD or in the cloud using GKE.

``` 
$ wget https://github.com/kubernetes-sigs/kubeadm-dind-cluster/releases/download/v0.2.0/dind-cluster-v1.14.sh
$ chmod +x dind-cluster-v1.14.sh
```

```
export DOWNLOAD_KUBECTL="non_empty"
export DIND_HTTP_PROXY=$http_proxy
export DIND_HTTPS_PROXY=$https_proxy
export DIND_NO_PROXY=$no_proxy
./dind-cluster-v1.14.sh up
export PATH="$HOME/.kubeadm-dind-cluster:$PATH"
```

### Kubectl

You will need to install Kubectl yourself if not using DinD.

```
sudo snap install kubectl --classic
```

# OpenFaas install

```
kubectl -n kube-system create sa tiller && kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller

helm init --skip-refresh --upgrade --service-account tiller

kubectl apply -f https://raw.githubusercontent.com/openfaas/faas-netes/master/namespaces.yml

helm repo add openfaas https://openfaas.github.io/faas-netes/

helm repo update

kubectl -n openfaas create secret generic basic-auth --from-literal=basic-auth-user=admin --from-literal=basic-auth-password="password"

sleep 20 # waiting for tiller pod to be ready if command below complains about tiller pod not being ready, wait another 10 seconds

helm upgrade openfaas --install openfaas/openfaas --namespace openfaas --set functionNamespace=openfaas-fn --set basic_auth=true --set faasnetes.imagePullPolicy=IfNotPresent
```

# Visiting OpenFaas UI

```
export ip=$(docker inspect kube-master -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')
```

Visit $ip:31112 and when prompted for a username and password use the following admin:password


# Creating OpenFaas functions

If you are using KinD you will need to replace the ```docker save....``` command with the KinD equivalent of loading a docker image into your nodes.

```
export NO_PROXY=$ip
export no_proxy=$ip
mkdir -p ~/workspace/faas
cd ~/workspace/faas
faas login --username admin --password password --gateway $ip:31112
faas new --lang python3 helloworld
# edit handler.py as you please
faas build -f helloworld.yml
docker save helloworld:latest | docker exec -i kube-node-1 docker load
docker save helloworld:latest | docker exec -i kube-node-2 docker load
faas deploy -f helloworld.yml --gateway $ip:31112
```

Visit UI to invoke your function or try out the ```faas invoke``` command.
