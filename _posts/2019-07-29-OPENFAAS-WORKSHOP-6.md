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

# Lab 6

* Faas-flow

As mentioned before [faas-flow](https://github.com/s8sg/faas-flow) is a neat library helping you perform function composition. 

We will use faas-flow to redo what we did in lab2.

```bash
faas template pull https://github.com/s8sg/faas-flow
faas new faas-flow-wc --lang faas-flow
```

Edit `faas-flow-wc.yml` to look like the following:

```yaml
version: 1.0
provider:
  name: openfaas
  gateway: http://127.0.0.1:8080
functions:
  faas-flow-wc:
    lang: faas-flow
    handler: ./faas-flow-wc
    image: faas-flow-wc:latest
    environment:
      read_timeout: 120 # A value larger than `max` of all execution times of Nodes
      write_timeout: 120 # A value larger than `max` of all execution times of Nodes
      write_debug: true
      combine_output: false
    environment_file:
      - flow.yml
```

and create a file called `flow.yml` with the following content
```yaml
environment:
  gateway: "gateway.openfaas:8080" # The address of OpenFaaS gateway, Faas-flow use this to forward completion event
  # gateway: "gateway.openfaas:8080" # For K8s 
  enable_tracing: false # tracing allow to trace internal node execution with opentracing
  enable_hmac: true # hmac adds an extra layer of security by validating the event source
```

Modify `handler.go` with the following:

```go
package function

import (
	faasflow "github.com/s8sg/faas-flow"
)

// Define provide definiton of the workflow
func Define(flow *faasflow.Workflow, context *faasflow.Context) (err error) {
	flow.SyncNode().Apply("filter").Apply("wc").
		Modify(func(data []byte) ([]byte, error) {
			// do something
			return data, nil
		})
	return
}

// DefineStateStore provides the override of the default StateStore
func DefineStateStore() (faasflow.StateStore, error) {
	return nil, nil
}

// ProvideDataStore provides the override of the default DataStore
func DefineDataStore() (faasflow.DataStore, error) {
	return nil, nil
}
```

Next build and deploy the faas-flow function

```bash
faas build -f faas-flow-wc.yml
kind load docker-image faas-flow-wc:latest
faas deploy -f faas-flow-wc.yml --gateway $ip:31112
```

now to test
```bash
kwojcicki@ubuntu:~/workspace/openfaas-workshops$ curl -XPOST $ip:31112/function/faas-flow-wc -d 'Hello of the world'
{"Hello": 1, "world": 1}
```

Same as when we created wc-filtered however now all the function composition logic is stored outside of the function making them easier to use.