---
layout: post
title: "Demyisting AWS Lambda Misbehaviors"
subtitle: "Techniques to diagnose slow, crashing, stalling and never ending Lambdas"
date: 2026-06-07 13:44:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

# Introduction

AWS Lambda's are not truly ephemeral, instead they should be treated as short lived stateFUL instances. Lambda instances can be reused across requests for up to two hours, while this is much shorter lived than a long living EC2 webserver instance this behavior brings in your typical class of stateful bugs. Proper cleanup is a necessity when developing a Lambda, you cannot just assume you are receiving a clean slate and that you may leave the Lambda in whatever state you want.

This post utilizes Typescript as its language of choice but the following pieces of advice are applicable to all languages with similar resolutions.

# Slow, crashing or OOMing

**Example**:

```typescript
const getEmployeeData = (employeeIds: number[]): Employee[] => {
    const employeePromises = [];
    for(const employee of employeeIds){
        employeePromises.push(dbService.getEmployee(employee));
    }

    return Promise.all(employeePromises); // problem
}
```

**Explanation**: 

The problematic piece of code above is the `Promise.all`, it will immidiately throw if any of the promises themselves throw (you can think of promises as threads, or subprocesses). This error will likely bubble up to your lambda handler and immiadtely return some sort of error to the user. However the remaining promises will continue executing upon the resumption of the Lambda instance. This can lead to a recurring thundering herd.

Imagine the first lambda invocation has `10_000` employee IDs, one of those promises may fail very quickly and the Lambda will return an error. The next invocation brings in an additional `10_000` employee IDs, the previous `9_999` promises will continue executing (likely in a retry state as their previous request had expired). This results in a negative pinwheel effect where the Lambda cannot make progress as it immiadetly crashes or moves at a snail pace.

**Diagnosis**:

Each Lambda instance is assigned a unique `AWS_LAMBDA_LOG_STREAM_NAME`, by exaiming the requestId and locating any interwoven logs you'll be able to identify the leftover processes that are causing subsequent failures or slowdowns.

**Remediation**:

For this specific example a simple fix would be to use Promise.settled

```typescript
const getEmployeeData = (employeeIds: number[]): Employee[] => {
    const employeePromises = [];
    for(const employee of employeeIds){
        employeePromises.push(dbService.getEmployee(employee));
    }

    return Promise.allSettled(employeePromises); // remediation
}
```

The general advice would be to utilize cancellation tokens, awaiting all subprocesses before returning, preventing unbounded amount of work and load shedding as necessary. 

# Stalled

**Example**:

```typescript
const processFile = async () => {
    const records = [];
    const parser = fs.createReadStream(`.csv`).pipe(
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

**Explanation**:

**Diagnosis**:

The general advice would be to ensure any streams, files, sockets, handlers are closed upon finishing the required work.

**Remediation**:

```typescript
const processFile = async () => {
    const records = [];
    const parser = fs.createReadStream(`.csv`).pipe(
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

**Remediation**:

# Never ending

**Example**:

```typescript
import test from "node:test";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const viewport = {
    deviceScaleFactor: 1,
    hasTouch: false,
    height: 1080,
    isLandscape: true,
    isMobile: false,
    width: 1920,
};
const browser = await puppeteer.launch({
    args: await puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
    defaultViewport: viewport,
    executablePath: await chromium.executablePath(),
    headless: "shell",
});

const page = await browser.newPage();
await page.goto("https://example.com");
const pageTitle = await page.title();
await browser.close();
```

**Explanation**:

**Diagnosis**:

Diagnosis is luckily quite simple. Your lambda logs indictate all work has been completed yet the lambda continues executing and eventually times out.

**Remediation**:

Swap to 