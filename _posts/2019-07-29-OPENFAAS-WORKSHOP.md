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

# Intro

For this workshop you will need an available k8s cluster. There are many ways to set up a k8s cluster. For this workshop we will assume you have used [KinD](https://github.com/kubernetes-sigs/kind) but I will include limited instructions for minikube + digital ocean.

Recommendation for using KinD vs Minikube vs DO

* KinD if you can create a Ubuntu environment either VM or baremetal.
* Minikube if you cannot create a Ubuntu environment.
* DO if you want to be on the bleeding edge.

# Digital Ocean (DO)

**Limited support can be provided if you pick this option**

From what I have heard OpenFaas on DO is relatively easy to set up but may cost a few dollars in server fees.

[https://github.com/rgee0/openfaas-on-digitalocean](https://github.com/rgee0/openfaas-on-digitalocean)
[https://marketplace.digitalocean.com/apps/openfaas](https://marketplace.digitalocean.com/apps/openfaas)

# Minikube setup

**Limited support can be provided if you pick this option**

I would recommend using KinD but for those that really do not want to use KinD here are the commands that should get you a minikube cluster up and running.

First install from [here](https://kubernetes.io/docs/tasks/tools/install-minikube/)

On Mac/Linux (note if you are launching minikube in a Linux VM you will need to do nested virtualization I would recommend host vmware and the nested vm to be virtualbox)

``` bash
export HTTP_PROXY=http://<proxy hostname:port>
export HTTPS_PROXY=https://<proxy hostname:port>
export NO_PROXY=localhost,127.0.0.1,10.96.0.0/12,192.168.99.0/24,192.168.39.0/24

minikube start --cpus 4 --memory 8192
```

Windows

``` bash
set HTTP_PROXY=http://<proxy hostname:port>
set HTTPS_PROXY=https://<proxy hostname:port>
set NO_PROXY=localhost,127.0.0.1,10.96.0.0/12,192.168.99.1/24,192.168.39.0/24

minikube start --cpus 4 --memory 8192
```

[https://github.com/kubernetes/minikube/blob/master/docs/http_proxy.md](https://github.com/kubernetes/minikube/blob/master/docs/http_proxy.md)

# KinD Setup (on Ubunutu 18.04 LTS)

**Prefered Deployment Option**

KinD can be used on a Ubuntu VM or a baremetal Linux machine. You can get a Ubuntu iso [here](https://ubuntu.com/download/desktop). I would recommend giving the VM 8gb of RAM + 4 cores, a minimum of 4gb + 2 cores is required. A significant amount of memory will be needed a safe bet is 25 to 30GB.

## KinD Proxy setup

For apt to go through a proxy copy and paste the following in your `/etc/environment`

```bash
http_proxy=http://[proxy]:8080
https_proxy=http://[proxy]:8080
ftp_proxy=http://[proxy]:8080
no_proxy="localhost,127.0.0.0,"
```

Append the following to your `~/.bashrc`

```bash
export http_proxy=http://[proxy]:8080
export https_proxy=http://[proxy]:8080
export no_proxy="localhost,127.0.0.0,172.17.0.2"

export HTTPS_PROXY=$https_proxy
export HTTP_PROXY=$http_proxy
export NO_PROXY=$NO_PROXY
```

## KinD Pre-reqs

### KinD Docker

```bash
sudo apt-get update
sudo apt-get install --yes \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install --yes docker-ce docker-ce-cli containerd.io
sudo groupadd docker #may say that group already exists that is okay
sudo usermod -aG docker $USER
newgrp docker
```

Validating:

```bash
kwojcicki@kwojcicki-VirtualBox:~$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

Now we will configure the docker daemon to use a proxy

```bash
sudo mkdir -p /etc/systemd/system/docker.service.d
```

Create a file called `/etc/systemd/system/docker.service.d/http-proxy.conf` and place the following inside 

```bash
[Service]
Environment="HTTP_PROXY=http://[proxy]:8080" "NO_PROXY=localhost,127.0.0.1"
```


```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

Validating:

```bash
docker run hello-world
```

Links used:

[https://docs.docker.com/install/linux/docker-ce/ubuntu/](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
[https://docs.docker.com/install/linux/linux-postinstall/](https://docs.docker.com/install/linux/linux-postinstall/)
[https://docs.docker.com/config/daemon/systemd/#httphttps-proxy](https://docs.docker.com/config/daemon/systemd/#httphttps-proxy)


### KinD Go

```bash
wget https://dl.google.com/go/go1.12.7.linux-amd64.tar.gz
sudo tar -xvf go1.12.7.linux-amd64.tar.gz
sudo mv go /usr/local
export GOROOT=/usr/local/go
export PATH=$PATH:$(/usr/local/go/bin/go env GOPATH)/bin

GO111MODULE="on" /usr/local/go/bin/go get sigs.k8s.io/kind@v0.4.0
```

Links used:

[https://golang.org/doc/code.html#GOPATH](https://golang.org/doc/code.html#GOPATH)

### KinD Creating the Cluster

```bash
kind create cluster
export KUBECONFIG="$(kind get kubeconfig-path --name="kind")"
```


# Deploying OpenFaaS (on any k8s cluster)

**Some alternatives to KinD commands will be provided**

```bash
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-
release/release/stable.txt`/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
```

The above section will install `kubectl` which will be the CLI you use to interact with your k8s cluster. Ensure `kubectl` is working by ensuring `kubectl cluster-info` returns something like the following:

```bash
kwojcicki@kwojcicki-VirtualBox:~/workspace/workshop$ kubectl cluster-info
Kubernetes master is running at https://127.0.0.1:45711
KubeDNS is running at https://127.0.0.1:45711/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

Next we will install helm + tiller (helm charts + tiller help you easily deploy k8s applications using yaml files). The `kind load` command can be omitted if using minikube or DO.

```bash
kubectl -n kube-system create sa tiller && kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
docker pull gcr.io/kubernetes-helm/tiller:v2.14.3
kind load docker-image gcr.io/kubernetes-helm/tiller:v2.14.3
kubectl apply -f https://raw.githubusercontent.com/openfaas/faas-netes/master/namespaces.yml
curl -L https://git.io/get_helm.sh | bash
helm init --skip-refresh --upgrade --service-account tiller
helm repo add openfaas https://openfaas.github.io/faas-netes/
helm repo update
kubectl -n openfaas create secret generic basic-auth --from-literal=basic-auth-user=admin --from-literal=basic-auth-password="password"
```

For KinD users we will need to manually pull the OpenFaas Images and place them inside your k8s cluster using the following commands

```bash
docker pull prom/alertmanager:v0.16.1
kind load docker-image prom/alertmanager:v0.16.1
docker pull openfaas/basic-auth-plugin:0.1.1
kind load docker-image openfaas/basic-auth-plugin:0.1.1
docker pull openfaas/faas-idler:0.1.9
kind load docker-image openfaas/faas-idler:0.1.9
docker pull openfaas/gateway:0.16.0
kind load docker-image openfaas/gateway:0.16.0
docker pull nats-streaming:0.11.2
kind load docker-image nats-streaming:0.11.2
docker pull prom/prometheus:v2.7.1
kind load docker-image prom/prometheus:v2.7.1
docker pull openfaas/queue-worker:0.7.2
kind load docker-image openfaas/queue-worker:0.7.2
docker pull openfaas/faas-netes:0.8.4
kind load docker-image openfaas/faas-netes:0.8.4
```

Now with the images loaded we can deploy OpenFaas using its helm chart

```bash
sleep 20 # waiting for tiller pod to be ready if command below complains about tiller pod not being ready, wait another 10 seconds
helm upgrade openfaas --install openfaas/openfaas --namespace openfaas --set functionNamespace=openfaas-fn --set basic_auth=true --set faasnetes.imagePullPolicy=IfNotPresent --set openfaasImagePullPolicy=IfNotPresent
```

Verify OpenFaas is correctly installed by doing the following

```bash
kwojcicki@kwojcicki-VirtualBox:~/workspace/workshop$ kubectl get po -o wide -A
NAMESPACE     NAME                                         READY   STATUS    RESTARTS   AGE   IP            NODE                 NOMINATED NODE   READINESS GATES
kube-system   coredns-5c98db65d4-j6wx5                     1/1     Running   1          17h   10.244.0.8    kind-control-plane   <none>           <none>
kube-system   coredns-5c98db65d4-k8kgg                     1/1     Running   1          17h   10.244.0.6    kind-control-plane   <none>           <none>
kube-system   etcd-kind-control-plane                      1/1     Running   1          17h   172.17.0.2    kind-control-plane   <none>           <none>
kube-system   kindnet-kw8rn                                1/1     Running   1          17h   172.17.0.2    kind-control-plane   <none>           <none>
kube-system   kube-apiserver-kind-control-plane            1/1     Running   1          17h   172.17.0.2    kind-control-plane   <none>           <none>
kube-system   kube-controller-manager-kind-control-plane   1/1     Running   1          17h   172.17.0.2    kind-control-plane   <none>           <none>
kube-system   kube-proxy-gtstw                             1/1     Running   1          17h   172.17.0.2    kind-control-plane   <none>           <none>
kube-system   kube-scheduler-kind-control-plane            1/1     Running   1          17h   172.17.0.2    kind-control-plane   <none>           <none>
kube-system   tiller-deploy-8557598fbc-zw72x               1/1     Running   1          17h   10.244.0.7    kind-control-plane   <none>           <none>
openfaas      alertmanager-5bc6668bcb-4kvvz                1/1     Running   1          17h   10.244.0.5    kind-control-plane   <none>           <none>
openfaas      basic-auth-plugin-688c68887f-wmwnb           1/1     Running   1          17h   10.244.0.3    kind-control-plane   <none>           <none>
openfaas      faas-idler-68c5494688-f6txf                  1/1     Running   9          17h   10.244.0.2    kind-control-plane   <none>           <none>
openfaas      gateway-d674896cb-c6bwk                      2/2     Running   1          35m   10.244.0.11   kind-control-plane   <none>           <none>
openfaas      nats-58c5874cc4-jzzwn                        1/1     Running   1          17h   10.244.0.10   kind-control-plane   <none>           <none>
openfaas      prometheus-55f6cf8d75-mpzdm                  1/1     Running   1          17h   10.244.0.9    kind-control-plane   <none>           <none>
openfaas      queue-worker-6b5f6cc5f8-rdmjn                1/1     Running   3          17h   10.244.0.4    kind-control-plane   <none>           <none>
```

If a pod is unable is unable to start try `kubectl describe pod [full pod name such as queue-worker-6b5f6cc5f8-rdmjn] -n [the namespace the pod is in from the command above]`.

# Installing the Faas CLI

`curl -sSL https://cli.openfaas.com | sudo sh`

Verifying the install worked:

```bash
kwojcicki@kwojcicki-VirtualBox:~/workspace/faas$ faas version
  ___                   _____           ____
 / _ \ _ __   ___ _ __ |  ___|_ _  __ _/ ___|
| | | | '_ \ / _ \ '_ \| |_ / _` |/ _` \___ \
| |_| | |_) |  __/ | | |  _| (_| | (_| |___) |
 \___/| .__/ \___|_| |_|_|  \__,_|\__,_|____/
      |_|

CLI:
 commit:  e689ec028055cc39ea0d3d17442c0eb5f3d6ac6f
 version: 0.9.0
```

# Deploying your first OpenFaas function

If you are using minikube you will need to do `eval $(minikube docker-env)` once per bash session to configure your local docker daemon to use minikube's docker. This will replace the `kind load` command.

For DO users the best bet is likely to create your own docker hub account and push the images to docker hub.

``` bash
export ip=$(docker inspect kind-control-plane -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}') # this command will have to be replaced with either your DO ip address or your minikube ip: $(minikube ip)
export NO_PROXY=$ip
export no_proxy=$ip
mkdir -p ~/workspace/faas
cd ~/workspace/faas
faas login --username admin --password password --gateway $ip:31112
faas new --lang python3 helloworld
faas build -f helloworld.yml
kind load docker-image helloworld:latest # use above mentioned methods for DO/minikube
faas deploy -f helloworld.yml --gateway $ip:31112
```

Validating your function was deployed:

```bash
kwojcicki@kwojcicki-VirtualBox:~/workspace/faas$ echo "hello :)" | faas invoke helloworld --gateway $ip:31112

hello :)
```

One can also head to the OpenFaas UI ($ip:31112 with username: admin and password: password) to take a look at your function.

# Labs

[Lab 1](./OPENFAAS-WORKSHOP-1)

[Lab 2](./OPENFAAS-WORKSHOP-2)

[Lab 3](./OPENFAAS-WORKSHOP-3)

[Lab 4](./OPENFAAS-WORKSHOP-4)

[Lab 5](./OPENFAAS-WORKSHOP-5)

[Lab 6](./OPENFAAS-WORKSHOP-6)

[Trouble shooting](./TROUBLESHOOTING.md)