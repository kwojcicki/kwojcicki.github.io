---
layout:     post
title:      "OpenFaaS Lab 3"
subtitle:   "Chaining functions"
date:       2019-07-29 20:02:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"	
comments: true
tags: [ Guide ]
---

# Lab 3

* Chaining functions on the user and OpenFaaS side

There will be situations where it will be useful to take the output of one function and use it as an input to another. This can be done both client-side and using the API Gateway.


## Chaining functions on the client-side

You can pipe the result of one function into another using curl, the faas-cli or some of your own code. Here's an example:

Pros:
* requires no code - can be done with CLI programs
* fast for development and testing
* easy to model in code

Cons:
* additional latency - each function goes back to the server
* chatty (more messages)

Heres an example

```bash
kwojcicki@ubuntu:~/workspace/openfaas-workshops$ echo -n "" | faas-cli invoke nodeinfo --gateway $ip:31112 | faas-cli invoke markdown --gateway $ip:31112
<p>Hostname: nodeinfo-7dd947cd99-7c8zd</p>

<p>Platform: linux
Arch: x64
CPU count: 6
Uptime: 3378</p>
```

## Chaining functions on the server-side

The easiest way to call one function from another is make a call over HTTP via the OpenFaaS API Gateway. This call does not need to know the external domain name or IP address, it can simply refer to the API Gateway as gateway through a DNS entry.

Pros:
* functions can make use of each other directly
* low latency since the functions can access each other on the same network

Cons:
* requires a code library for making the HTTP request


We are going to be adding onto our wc function in order to filter out common words such as 'a', 'the', 'of'. To do this we will generate 2 more functions, one which will filter out common words from a string `filter` and another to perform the chaining `wc-filtered`. Again these example functions are written in python3 but any language can be used.

Here we will generate one yaml file containing the definition of both the `filter` and `wc-filtered` function.

```bash
faas new --lang python3 filter
faas new --lang python3 wc-filtered --append filter.yml
```

Will write `filter` first, this function will take in a string and return a string without any 'a', 'the', 'of'.

```python
def handle(req):
    """handle a request to the function
    Args:
        req (str): request body
    """

    COMMON_WORDS = {'a', 'the', 'of'}

    words = req.split()
    words = [word for word in words if word.lower() not in COMMON_WORDS]
    return " ".join(words)


if __name__ == '__main__':
    print(handle("hello of the world"))
```


Great now we need to chain these two functions together, `wc-filtered` will do that for us.

```python
import requests

def handle(req):
    """handle a request to the function
    Args:
        req (str): request body
    """

    r = requests.get("http://gateway.openfaas:8080/function/filter", data=req)

    if r.status_code != 200:
        sys.exit("Error with filter, expected: %d, got: %d\n" % (200, r.status_code))

    filter_req = r.text

    r = requests.get("http://gateway.openfaas:8080/function/wc", data=filter_req)

    if r.status_code != 200:
        sys.exit("Error with wc, expected: %d, got: %d\n" % (200, r.status_code))

    return r.json()
```

You may have noticed we are importing `requests` which is not actually part of Pythons standard library. To pull this library we need to add `requests` to `./wc-filtered/requirements.txt`

Now lets deploy `wc-filtered` and `filter` to test them out

```bash
faas build -f filter.yml
kind load docker-image filter:latest
kind load docker-image wc-filtered:latest
faas deploy -f filter.yml --gateway $ip:31112
```

Now lets test it out

```bash
kwojcicki@ubuntu:~/workspace/openfaas-workshops$ echo "hello of the world" | faas invoke filter --gateway $ip:31112
hello world
kwojcicki@ubuntu:~/workspace/openfaas-workshops$ echo "hello of the world" | faas invoke wc-filtered --gateway $ip:31112
{'hello': 1, 'world': 1}
```

One of the problems of doing server-side chaining is the functions become very dependent on one another [faas-flow](https://github.com/s8sg/faas-flow) tries to solve this.