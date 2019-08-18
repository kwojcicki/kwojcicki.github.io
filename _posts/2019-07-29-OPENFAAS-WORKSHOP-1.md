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

# Lab 1

* Visiting and using the OpenFaas ui
* Understanding OpenFaas templates + handlers

First lets deploy a bunch of pre created functions

```bash
docker pull functions/alpine:latest
kind load docker-image functions/alpine:latest
docker pull functions/hubstats:latest
kind load docker-image functions/hubstats:latest
docker pull functions/markdown-render:latest
kind load docker-image functions/markdown-render:latest
docker pull functions/nodeinfo:latest
kind load docker-image functions/nodeinfo:latest

faas-cli deploy -f https://raw.githubusercontent.com/openfaas/faas/master/stack.yml --gateway $ip:31112
```

Next visit the OpenFaas UI and try invoking various functions

![lab1-ui](./lab1-ui.png)