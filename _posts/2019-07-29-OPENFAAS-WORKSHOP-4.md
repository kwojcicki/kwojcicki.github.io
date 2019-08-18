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

# Lab 4

* Async functions and pushing to Kafka

To push to kafka we first need to have a Kafka running make (make sure your pwd is this repo when running the command)

```bash
helm repo add incubator http://storage.googleapis.com/kubernetes-charts-incubator
kubectl create ns kafka
helm upgrade kf incubator/kafka \
    --install \
    --namespace kafka \
    --set imageTag=4.1.3 \
    --set persistence.enabled=false
kubectl -n kafka apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: testclient
  namespace: kafka
spec:
  containers:
  - name: kafka
    image: confluentinc/cp-kafka:5.0.1
    command:
    - sh
    - -c
    - "exec tail -f /dev/null"
EOF
```

Now we will create a function `sleep-produce` that will sleep for a bit and then produce a message to kafka.

```bash
faas new --lang python3 sleep-produce
```

Add the following to `sleep-produce`

```python
import time
from kafka import KafkaProducer

def handle(req):
    """handle a request to the function
    Args:
        req (str): request body
    """

    time.sleep(1)

    producer = KafkaProducer(bootstrap_servers='kf-kafka.kafka:9092')
    producer.send('topic_name', b'some_message_bytes')
    producer.flush()

    print("Sent message to topic")
    return req
```

With `kafka-python` in `./sleep-produce/requirements.txt`

Now lets deploy it

```bash
faas build -f sleep-produce.yml
kind load docker-image sleep-produce:latest
faas deploy -f sleep-produce.yml --gateway $ip:31112
```

Next to test it will we need another console window to consume from kafka

```bash
kubectl -n kafka exec -it testclient -- kafka-console-consumer --bootstrap-server kf-kafka:9092 --topic topic_name --from-beginning
```

This will continue listening until you press `ctrl+c`. In your original window you can now invoke `sleep-produce` and see the resulting message in your Kafka consumer window.

```bash
kwojcicki@ubuntu:~/workspace/openfaas-workshops$ kubectl -n kafka exec -it testclient -- kafka-console-consumer --bootstrap-server kf-kafka:9092 --topic topic_name --from-beginning
some_message_bytes
some_message_bytes
some_message_bytes
some_message_bytes
```

You may have noticed all the functions invocations so far have been synchronous. But what if want to invoke a function async. In OpenFaas its as simple as added `async` to the curl call and you are done!

With your Kafka Consumer shell still open try the following

```bash
kwojcicki@ubuntu:~/workspace/openfaas-workshops$ time curl -XPOST $ip:31112/async-function/sleep-produce

real    0m0.011s
user    0m0.009s
sys     0m0.000s
```

Unlike before the curl call returns immediately and the actual function invocation is queued up and will be called at a later time.

To cleanup the Kafka + testpod containers run the following
```bash
kubectl -n kafka delete po testclient
helm delete --purge kf
```