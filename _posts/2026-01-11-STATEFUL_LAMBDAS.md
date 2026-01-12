---
layout: post
title: "Abusing AWS Lambda's 'Stateless' model"
subtitle: "Using in-memory caches to speed up lambda's"
date: 2026-01-11 13:44:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

# Introduction

The serverless lambda programming model is typically implemented in a [stateless manner](https://docs.aws.amazon.com/lambda/latest/operatorguide/statelessness-functions.html), with a request lifetime consisting of the following stages:
- the request is received by the lambda service
- the corresponding lambda for the request is identified
- a container/VM (execution environment) is spun up and the lambda's code is fetched and deployed
- the instance runs the lambda code with the request as input
- response is returned and runtime is torn down

AWS Lambda follows the same principal. Utilizing [FireCracker](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/) for their [execution environment](https://docs.aws.amazon.com/lambda/latest/operatorguide/execution-environment.html).

However, tearing down and reinitializing the environment after every request can be expensive. Therefore, sometimes, AWS will keep around an environment longer and reuse it for [subsequent function invocations](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html). The exact time which AWS will keep an instance around for isn't known, but [experiments](https://xebia.com/blog/til-that-aws-lambda-terminates-instances-preemptively/) have shown that it could be as much as 2 hours!

These potential reuses of execution environments allow us programmers to, sometimes, revert back to a stateful way of programming. In particular it gives us the ability to use in-memory caches<sup id="a1">[1](#f1)</sup>. These can either be session based caches (i.e. one key/value pair per user) or generic operational caches.

How useful are these in-memory session based caches? Well it will depend on your users activity patterns, if we assume our users make 1 request every 3 hours then it won't be very useful, but if a user has a burst of activity and then stops, the cache's hit rate should be high.

Let's test this out!

# Example

We'll create a simple Node.js lambda

```javascript
export const handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(process.env['AWS_LAMBDA_LOG_STREAM_NAME']), // unique to each execution environment
  };
  return response;
};
```

and then we'll invoke that lambda, concurrently and repeatedly, multiple times and see how often each environment is reused by the same user.

```javascript
const call = async (startTime) => {
    const uniqueInstances = {};
    let totalRequests = 0;
    while (Date.now() - startTime < 1000 * 10) {
        const resp = await makeRequest({
            hostname
        })
        
        if (!uniqueInstances[resp]) uniqueInstances[resp] = 0;
        uniqueInstances[resp] += 1;
        totalRequests += 1;
        // sleeping to give the potential for another user to "steal" our "assigned" lambda
        await new Promise((r) => setTimeout(r, Math.random() * 1000));
    }

    console.log(uniqueInstances);
    let hitRate = 0;
    for (const logStreamId of Object.keys(uniqueInstances)) {
        hitRate = Math.max(hitRate, uniqueInstances[logStreamId] / totalRequests);
    }

    return hitRate;
}

(async () => {
    try {
        const startTime = Date.now();
        const users = 10;
        const promises = [];
        for (let i = 0; i < users; i++) {
            promises.push(call(startTime));
        }
        const rates = await Promise.all(promises);
        console.log("rates: " + rates);
    } catch (e) {
        console.error(e);
    }
})();
```

Depending on the number of concurrent imitated users and the sleep time between requests the session based hit rates differed. In a sample ran with 10 users and up to 1 second between each request the hit rates were ```rates: 0.63,0.38,0.41,0.45,0.47,0.26,0.46,0.42,0.43,0.36```. Pretty good if each hit means we are saving 1 call to DynamoDB or S3.

In systems I've worked on we've seen in-memory session cache hit rates as high as 90%. However, your milage will vary based on user activity patterns and your exact cache usage, as with most performance enhancements it's good to measure before and after to see if the extra computation is worth it!

# Notes

<b id="f1">[1]</b> Caches aren't the only upside of AWS reusing environments. You can also reactively or preemptively perform work. 

For example if you want to perform post request user analytics (say enriching the logs with what country/state a user is from), you can queue that up to be done during the next request (just be careful of orphaned threads!).

Another common idea is to preemptively establish persistent connections to your databases/external services. [↩](#a1)
