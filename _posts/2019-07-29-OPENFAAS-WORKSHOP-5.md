---
layout:     post
title:      "OpenFaaS Lab 5"
subtitle:   "Autoscaling your function"
date:       2019-07-29 20:02:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"	
comments: true
tags: [ Guide ]
---

# Lab 5

* Scaling

To show off the scaling we will a very simple echo function

```bash
git clone https://github.com/alexellis/echo-fn \
 && cd echo-fn \
 && faas-cli template store pull golang-http \
 && faas-cli deploy \
  --label com.openfaas.scale.max=10 \
  --label com.openfaas.scale.min=1 --gateway $ip:31112
```

As one can see the minimum number of function replicas will be 1, while the maximum is 10. 

The scaling is handled by OpenFaas based on Prometheus R.E.D (requests, errors, duration) metrics. By default uses rps as its scaling metric but is is completely configurable.

Now head over to the UI to confirm there is only 1 replica up and running.

Run the following snippet and watch the replicas go up and then back down

```bash
for i in {0..10000};
do
   echo -n "Post $i" | faas-cli invoke go-echo --gateway $ip:31112 && echo;
done;
```

![scaling](scaling.png)