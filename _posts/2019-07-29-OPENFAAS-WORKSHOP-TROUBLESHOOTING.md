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

# Troubleshooting

### KinD not found

```bash
kwojcicki@ubuntu:~$ kind

Command 'kind' not found, did you mean:

  command 'kid' from deb python-kid
  command 'find' from deb findutils
  command 'kino' from deb kino
  command 'kfind' from deb kfind
  command 'king' from deb king

Try: sudo apt install <deb name>
```

Add the go bin directory to your PATH `export PATH=$PATH:$(/usr/local/go/bin/go env GOPATH)/bin`

### kubectl connection refused when using KinD

```bash
kwojcicki@ubuntu:~$ kubectl get po -o wide -A
The connection to the server 192.168.99.100:8443 was refused - did you specify the right host or port?
```

Export the KinD kubeconfig ```export KUBECONFIG="$(kind get kubeconfig-path --name="kind")"```

### Connection refused to OpenFaas gateway/function

Ensure function/gateway is running `kubectl get po -o wide -A`.

If the pod status is not running then `kubectl describe pod [pod-name] -n [namespace]` to diagnose the problem further.