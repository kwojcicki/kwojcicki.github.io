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

# Lab 2

* Deploying and calling custom functions

Using your favorite language (will use python in this example) we are going to build a word count function. That will take in sentences and return a json objet with keyvalue pairs that hold the word and occurrence

```bash
faas new --lang python3 wc
```
This will generate a folder called wc in your pwd and a wc.yml. Inside the wc folder you will see a `requirements.txt` + `handler.py`. The `handler.py` contains a single method handle(req) which is your entrypoint.

one can directly call the handle method by appending the following to `handler.py`

```python
if __name__ == '__main__':
    print(handle("hello world asd hello"))
```

then call the function as follows

```bash
kwojcicki@ubuntu:~/workspace/openfaas-workshops$ python3 ./wc/handler.py 
hello world asd hello
```

Now lets implement that actual code for counting the # of words

```python
import json


def handle(req):
    """handle a request to the function
    Args:
        req (str): request body
    """

    words = req.split()

    freq = {}

    for word in words:
        if word in freq:
            freq[word] = freq[word] + 1
        else:
            freq[word] = 1

    return json.dumps(freq)

if __name__ == '__main__':
    print(handle("hello world asd hello"))
```

Now running our function locally
```bash
kwojcicki@ubuntu:~/workspace/openfaas-workshops$ python3 ./wc/handler.py 
{"hello": 2, "world": 1, "asd": 1}
```

Great our function runs locally now lets deploy it using OpenFaas.

```bash
faas build -f wc.yml
kind load docker-image wc:latest
faas deploy -f wc.yml --gateway $ip:31112
```

Now you can either invoke your function as in lab1 using the UI or using the CLI/curl address.

```bash
kwojcicki@ubuntu:~/workspace/openfaas-workshops$ curl -XPOST $ip:31112/function/wc -d 'Hello I I am'
{"Hello": 1, "I": 2, "am": 1}
kwojcicki@ubuntu:~/workspace/openfaas-workshops$ echo "Hello I I am" | faas invoke wc --gateway $ip:31112
{"Hello": 1, "I": 2, "am": 1}
```

Great, but what if our function has an error and needs to log something? For the python3 template OpenFaas uses the Forking method of invoking functions as seen below

![watchdog](watchdog.png)

Normally OpenFaas returns the combination of stdout + stderr this can be turned off by adding 

```yaml
    environment:
      write_debug: true
      combine_output: false
```

to your wc.yml as follows:

```yaml
version: 1.0
provider:
  name: openfaas
  gateway: http://http://172.17.0.2:31112
functions:
  wc:
    lang: python3
    handler: ./wc
    image: wc:latest
    environment:
      write_debug: true
      combine_output: false
```

Now OpenFaas will only return the stdout in the response but stderr will still be logged.

Back in `./wc/handler.py` lets `import sys` and then add `sys.stderr.write("Hello from handler!\n")` somewhere in our `handle` function.

Now lets redeploy and invoke our function
```bash
faas build -f wc.yml
kind load docker-image wc:latest
faas deploy -f wc.yml --gateway $ip:31112
echo "Hello I I am" | faas invoke wc --gateway $ip:31112
```

Now using the `faas logs` command we can check out the logs our function is emitting

```bash
kwojcicki@ubuntu:~/workspace/openfaas-workshops$ faas logs wc --since 1m --gateway $ip:31112
...

2019-08-10 15:48:37.058889122 +0000 UTC wc (wc-c75969444-kgxcg) 2019/08/10 15:48:37 stderr: Hello from handler!

2019-08-10 15:48:37.059171373 +0000 UTC wc (wc-c75969444-kgxcg) 2019/08/10 15:48:37 Duration: 0.104399 seconds

2019-08-10 15:48:37.05917626 +0000 UTC wc (wc-c75969444-kgxcg) {"Hello": 1, "I": 2, "am": 1}
```

While using stderr it log is not the best practice with the HTTP watchdog architecture the logging mechanism will improve.