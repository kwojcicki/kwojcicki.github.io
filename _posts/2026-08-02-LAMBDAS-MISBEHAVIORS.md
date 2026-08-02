---
layout: post
title: "Demystifying AWS Lambda misbehavior's"
subtitle: "Techniques to diagnose slow, crashing, stalling and never ending Lambdas"
date: 2026-08-02 12:13:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

# Introduction

AWS Lambda's are not truly ephemeral (you can read more [in this post](./2026-01-11-STATEFUL_LAMBDAS.md)), instead they are short lived stateFUL instances. Lambda instances can be reused across requests for up to two hours, while this is much shorter than a long living EC2 instance this behavior brings in your typical class of stateful bugs.

This post outlines symptoms, diagnosis and remediation for common bugs introduced when developers forget to pay attention to statefullness within their Lambda functions. The examples utilize Typescript to illustrate the point but both the symptoms and fixes are universal to all languages.

These notes are around Lambda functions not Durable Functions.

# Slow, crashing or OOMing

This class of bugs is characterized by resource contention, either: CPU, memory, network, etc. The Lambda function performs more concurrent or residual work than
intended, resulting in increased latency or invocation failure. These symptoms may worsen across warm invocations when unfinished work resumes in a reused execution environment.

**Example**:

```typescript
const getEmployeeData = (employeeIds: number[]): Promise<Employee[]> => {
    const employeePromises = [];
    for(const employee of employeeIds){
        employeePromises.push(dbService.getEmployee(employee));
    }

    return Promise.all(employeePromises); // problem
}
```

`Promise.all` is the problematic piece of code, it will immediately throw if any of the promises themselves throw (you can think of promises as threads, or subprocesses). This error will bubble up and return an error to the user. However the remaining promises will continue executing upon the resumption of the Lambda instance. This can lead to recurring resource exhaustion.

Imagine the first Lambda invocation has `10_000` employee IDs, one of those promises may fail very quickly and the Lambda will return an error. The next invocation brings in an additional `10_000` employee IDs, the previous `9_999` promises will continue executing (likely in a retry state as their previous request had timed out). This results in a negative pinwheel effect where the Lambda cannot make progress as it immediately crashes or moves at a snail pace.

**Remediation**:

The general advice would be to:
- utilize cancellation tokens
- await all subprocesses before returning
    - audit logs validating each unique `AWS_LAMBDA_LOG_STREAM_NAME` does not have interwoven requestIds 
- prevent unbounded amounts of work by limiting concurrency
- load shed
- add timeouts
- monitor your key infrastructure resource usage

# Stalled

This class of bug is characterized by resource starvation or pool exhaustion. The Lambda function stops making forward progress while waiting for a finite resource, such as a network socket, database connection, file descriptor, stream, or lock. Invocations may initially succeed but begin stalling after repeated reuse exhausts the available resource pool, eventually causing the function to time out.

**Example**:

```typescript
const processFile = async (): Promise<void> => {
    const records = [];
    const getCommand = new GetObjectCommand({
        Key: 'test/testfile.txt',
        Bucket: 'bucketname',
      });

    const data = await s3.send(getCommand);

    const parser = data.Body.pipe(
        parse({
            from_line: 2,
            to_line: 10,
        }),
    );
    for await (const record of parser) {
        records.push(record);
    }
    return records;
};
```

The Node JS AWS SDK has a maxSocket limit of 50, the socket is held until the underlying response body has been closed. In this case the csv `parse` library does not fully close the stream if a partial read is being done. Thus on the 51st run the Lambda will attempt to open a connection to S3, but since all the previous sockets are still used it will wait indefinitely for the socket until the Lambda time's out.

**Remediation**:

To prevent this class of failure, give every acquired resource an explicit lifecycle, add logs when an allocated resource is acquired and then subsequent logs when the resource is released. Consume or destroy response bodies, close streams, files, and sockets, release pooled connections, cancel timers and background work, and remove event listeners.

# Never ending

This class of bug is characterized by completed business logic without a completed invocation. The handler’s return path remains blocked by an unresolved promise or future, a child-process wait, a deadlock, or cleanup code that never finishes. Logs may indicate that the expected work is complete, yet the function continues running until it reaches its configured timeout.

**Example**:

```typescript
 export const handler = async (): void => {
    const worker = await startWorker(event);

    try {
        const result = await worker.run();
        console.log("Business work complete");
        return result;
    } finally {
        console.log("Cleanup started");
        await worker.close();
        console.log("Cleanup complete");
    }
};
```

Lambda only returns the response to the client once the handler has completed. The `.close()` on the worker may hang indefinitely causing the runtime to continue until the Lambda terminates it at it's preconfigured timeout. The same failure appears across runtimes as an unresolved promise or future, blocking network call, deadlock, child-process join, unbounded polling loop, retry loop, or cleanup operation that never returns.

**Remediation**:

Work that is on the hotpath must complete before the client receives their response, any code that is not critical to the hotpath should be moved to an async process. Either a background thread, done by a downstream system or within a Lambda extension.

Paired boundary logs, as with the section above regarding releasing unused resources.

# Never ending NodeJS

While the other causes have all been language agnostic the NodeJS callback handler has an interesting behavior that causes the handler to not return until the event loop is completely empty  (this behavior can be overridden with `callbackWaitsForEmptyEventLoop`). An unterminated background process will cause the event loop to never be empty, hence your function will seem like its done but never return. The advice from the "Never ending" section above applies to this case as well with the caveat that a background thread is still considered to be part of the hotpath.