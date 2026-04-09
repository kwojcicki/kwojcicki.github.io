---
layout: post
title: "AWS SDK JS v3 caching"
subtitle: "Plugging a caching layer directly into the AWS SDK v3 middleware stack"
date: 2026-04-06 09:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Tutorial]
---

<style>
.diagram-wrap {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 24px 20px;
  margin: 28px 0;
  overflow-x: auto;
}
.diagram-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.diagram-box {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #adb5bd;
  border-radius: 8px;
  background: #fff;
  padding: 10px 18px;
  font-family: monospace;
  font-size: 0.82rem;
  white-space: nowrap;
  line-height: 1.4;
}
.diagram-box.blue {
  border-color: #4c9be8;
  background: #e8f4fd;
}
.diagram-box.green {
  border-color: #40c057;
  background: #ebfbee;
}
.diagram-box.red {
  border-color: #fa5252;
  background: #fff5f5;
}
.diagram-box.gray {
  border-color: #adb5bd;
  background: #f8f9fa;
}
.diagram-box .sub {
  font-size: 0.72rem;
  color: #868e96;
  font-family: sans-serif;
  margin-top: 2px;
}
.diagram-arrow-down {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2px 0;
  user-select: none;
}
.diagram-arrow-right {
  display: inline-flex;
  align-items: center;
  margin: 0 6px;
  user-select: none;
}
.diagram-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 0;
}
.diagram-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.diagram-branch {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin: 4px 0;
}
.diagram-branch-label {
  font-size: 0.72rem;
  color: #868e96;
  font-family: sans-serif;
  margin-bottom: 3px;
}
</style>

# Introduction

Amazon Web Services (AWS) powers the internet, [each of outage results in millions of loss potential](https://www.crn.com/news/cloud/2025/amazon-s-outage-root-cause-581m-loss-potential-and-apology-5-aws-outage-takeaways). The AWS SDK is what enables developers to utilize the various AWS services. 

The AWS SDK JS is on its third version, with the latest version introducing a [middleware stack](https://aws.amazon.com/blogs/developer/middleware-stack-modular-aws-sdk-js/) enabling developers to customize the SDK behavior via the middleware.

Common usages for the middleware are: authentication, rate limiting, circuit breaking, request deduplication, shadow testing, tracing and routing routing.  

# The AWS SDK v3 middleware stack

Every SDK client owns a `middlewareStack`. When you call `client.send(command)` the SDK runs the input through an ordered chain of middleware before it ever reaches the HTTP handler. Each middleware can inspect, modify, short-circuit, or post-process the request and response.

<div class="diagram-wrap">
  <div class="diagram-label">AWS SDK v3: the middleware stack</div>
  <div class="diagram-col" style="align-items:center; min-width: 540px; margin: 0 auto;">

    <div class="diagram-box blue">client.send(command)</div>

    <div class="diagram-arrow-down"><svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="0" x2="8" y2="20" stroke="#adb5bd" stroke-width="2"/><polyline points="2,14 8,24 14,14" fill="none" stroke="#adb5bd" stroke-width="2" stroke-linejoin="round"/></svg></div>

    <div style="border: 2px solid #adb5bd; border-radius: 10px; padding: 14px 28px; background: #fff; width: 320px;">
      <div style="text-align:center; font-size:0.78rem; font-weight:600; color:#495057; margin-bottom:12px; font-family:sans-serif;">Middleware Stack</div>
      <div class="diagram-col" style="gap: 6px; width: 100%;">
        <div class="diagram-box blue" style="width:100%; box-sizing:border-box;">
          initialize
          <span class="sub">high priority — runs first</span>
        </div>
        <div class="diagram-arrow-down"><svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="0" x2="8" y2="20" stroke="#adb5bd" stroke-width="2"/><polyline points="2,14 8,24 14,14" fill="none" stroke="#adb5bd" stroke-width="2" stroke-linejoin="round"/></svg></div>
        <div class="diagram-box gray" style="width:100%; box-sizing:border-box;">serialize</div>
        <div class="diagram-arrow-down"><svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="0" x2="8" y2="20" stroke="#adb5bd" stroke-width="2"/><polyline points="2,14 8,24 14,14" fill="none" stroke="#adb5bd" stroke-width="2" stroke-linejoin="round"/></svg></div>
        <div class="diagram-box gray" style="width:100%; box-sizing:border-box;">build</div>
        <div class="diagram-arrow-down"><svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="0" x2="8" y2="20" stroke="#adb5bd" stroke-width="2"/><polyline points="2,14 8,24 14,14" fill="none" stroke="#adb5bd" stroke-width="2" stroke-linejoin="round"/></svg></div>
        <div class="diagram-box gray" style="width:100%; box-sizing:border-box;">finalizeRequest</div>
        <div class="diagram-arrow-down"><svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="0" x2="8" y2="20" stroke="#adb5bd" stroke-width="2"/><polyline points="2,14 8,24 14,14" fill="none" stroke="#adb5bd" stroke-width="2" stroke-linejoin="round"/></svg></div>
        <div class="diagram-box gray" style="width:100%; box-sizing:border-box;">deserialize</div>
      </div>
    </div>

    <div class="diagram-arrow-down"><svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="0" x2="8" y2="20" stroke="#adb5bd" stroke-width="2"/><polyline points="2,14 8,24 14,14" fill="none" stroke="#adb5bd" stroke-width="2" stroke-linejoin="round"/></svg></div>

    <div class="diagram-box green">HTTP handler</div>
    <div class="diagram-arrow-down"><svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="0" x2="8" y2="20" stroke="#adb5bd" stroke-width="2"/><polyline points="2,14 8,24 14,14" fill="none" stroke="#adb5bd" stroke-width="2" stroke-linejoin="round"/></svg></div>
    <div class="diagram-box green">AWS API</div>

  </div>
</div>

# AWS SDK Caching

Caching is typically implemented on a per method basis via:

```typscript
const map: Map<String, Response> = new Map()

const getData = async (id: String) => {
  if(!map.has(id)) {
    const response = await client.send({ id });
    map.set(id, response);
  }

  return map.get(id);
}
```

This leads to a ton of bloat everywhere and actually has a bug for duplicate in-flight requests. The solution is to move it to a middleware.

<div class="diagram-wrap">
  <div class="diagram-label">cache_middleware decision flow</div>
  <svg viewBox="0 0 680 500" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="13" text-anchor="middle" dominant-baseline="middle" style="max-width:680px;display:block;margin:0 auto;">

    <defs>
      <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#adb5bd"/>
      </marker>
    </defs>

    <!-- Row 1: client.send — centred at x=340 -->
    <rect x="260" y="10" width="160" height="34" rx="7" fill="#e8f4fd" stroke="#4c9be8" stroke-width="2"/>
    <text x="340" y="27">client.send(command)</text>

    <!-- Row 2: cacheKey present? — centred at x=340 -->
    <rect x="250" y="90" width="180" height="34" rx="7" fill="#fff9db" stroke="#f59f00" stroke-width="2"/>
    <text x="340" y="107">cacheKey present?</text>

    <!-- Row 3: next(args) at x=75 | store.get at x=490 -->
    <rect x="20"  y="180" width="110" height="34" rx="7" fill="#f8f9fa" stroke="#adb5bd" stroke-width="2"/>
    <text x="75" y="197">next(args)</text>

    <rect x="400" y="180" width="180" height="34" rx="7" fill="#fff9db" stroke="#f59f00" stroke-width="2"/>
    <text x="490" y="197">store.get(cacheKey)</text>

    <!-- Row 4: AWS API (No) at x=75 | Hit at x=400 | Miss AWS API at x=590 -->
    <rect x="20"  y="290" width="110" height="34" rx="7" fill="#ebfbee" stroke="#40c057" stroke-width="2"/>
    <text x="75" y="307">AWS API</text>

    <rect x="328" y="280" width="144" height="54" rx="7" fill="#ebfbee" stroke="#40c057" stroke-width="2"/>
    <text x="400" y="300">return cached value</text>
    <text x="400" y="318" font-size="11" fill="#868e96" font-family="sans-serif">no network call</text>

    <rect x="540" y="290" width="100" height="34" rx="7" fill="#ebfbee" stroke="#40c057" stroke-width="2"/>
    <text x="590" y="307">AWS API</text>

    <!-- Row 5: store.set at x=590 -->
    <rect x="516" y="390" width="148" height="34" rx="7" fill="#f8f9fa" stroke="#adb5bd" stroke-width="2"/>
    <text x="590" y="407">store.set(key, output)</text>

    <!-- Row 6: return output at x=590 -->
    <rect x="532" y="460" width="116" height="34" rx="7" fill="#ebfbee" stroke="#40c057" stroke-width="2"/>
    <text x="590" y="477">return output</text>

    <!-- ── ARROWS ── -->

    <!-- client.send → cacheKey present? -->
    <line x1="340" y1="44" x2="340" y2="88" stroke="#adb5bd" stroke-width="2" marker-end="url(#arr2)"/>

    <!-- cacheKey present? → branch bar at y=152, spanning x=75 to x=490 -->
    <line x1="340" y1="124" x2="340" y2="152" stroke="#adb5bd" stroke-width="2"/>
    <line x1="75"  y1="152" x2="490" y2="152" stroke="#adb5bd" stroke-width="2"/>

    <!-- No leg → next(args) -->
    <line x1="75" y1="152" x2="75" y2="178" stroke="#adb5bd" stroke-width="2" marker-end="url(#arr2)"/>
    <text x="57" y="166" font-size="11" fill="#868e96" font-family="sans-serif">No</text>

    <!-- Yes leg → store.get -->
    <line x1="490" y1="152" x2="490" y2="178" stroke="#adb5bd" stroke-width="2" marker-end="url(#arr2)"/>
    <text x="502" y="166" font-size="11" fill="#868e96" font-family="sans-serif">Yes</text>

    <!-- next(args) → AWS API (No branch) -->
    <line x1="75" y1="214" x2="75" y2="288" stroke="#adb5bd" stroke-width="2" marker-end="url(#arr2)"/>

    <!-- store.get → branch bar at y=252, spanning x=400 to x=590 -->
    <line x1="490" y1="214" x2="490" y2="252" stroke="#adb5bd" stroke-width="2"/>
    <line x1="400" y1="252" x2="590" y2="252" stroke="#adb5bd" stroke-width="2"/>

    <!-- Hit leg -->
    <line x1="400" y1="252" x2="400" y2="278" stroke="#adb5bd" stroke-width="2" marker-end="url(#arr2)"/>
    <text x="382" y="266" font-size="11" fill="#868e96" font-family="sans-serif">Hit</text>

    <!-- Miss leg -->
    <line x1="590" y1="252" x2="590" y2="288" stroke="#adb5bd" stroke-width="2" marker-end="url(#arr2)"/>
    <text x="603" y="266" font-size="11" fill="#868e96" font-family="sans-serif">Miss</text>

    <!-- AWS API → store.set → return output (Miss branch) -->
    <line x1="590" y1="324" x2="590" y2="388" stroke="#adb5bd" stroke-width="2" marker-end="url(#arr2)"/>
    <line x1="590" y1="424" x2="590" y2="458" stroke="#adb5bd" stroke-width="2" marker-end="url(#arr2)"/>

  </svg>
</div>

## aws-sdk-cache-middleware

[aws-sdk-cache-middleware](https://www.npmjs.com/package/aws-sdk-cache-middleware) is a library that allows you to easily move the caching step into the client.

```typescript
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import type { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { createCachingMiddleware } from "aws-sdk-cache-middleware";
import type { CacheInputExtension } from "aws-sdk-cache-middleware";

const cache = new Map<string, GetObjectCommandOutput>();
const s3 = new S3Client({ region: "us-east-1" });

s3.middlewareStack.use(
  createCachingMiddleware<GetObjectCommandOutput>({
    store: {
      get: (key) => cache.get(key),
      set: (key, value) => { cache.set(key, value); },
    },
    onHit:  (key) => console.log(`[HIT]  ${key}`),
    onMiss: (key) => console.log(`[MISS] ${key}`),
  })
);
```

Add `cacheKey` to opt in:

```typescript
const result = await s3.send(
  new GetObjectCommand({
    Bucket: "my-bucket",
    Key: "config.json",
    cacheKey: "s3:my-bucket/config.json",
  } as Parameters<typeof GetObjectCommand>[0] & CacheInputExtension)
);
```

To avoid the cast, use `CachableCommand` — a constructor type helper that adds `cacheKey` to an existing command class:

```typescript
import type { CachableCommand } from "cache_middleware";

type CachableGetObject = CachableCommand<GetObjectCommandInput, GetObjectCommandOutput>;
const CachableGetObjectCommand = GetObjectCommand as unknown as CachableGetObject;

const result = await s3.send(
  new CachableGetObjectCommand({
    Bucket: "my-bucket",
    Key: "config.json",
    cacheKey: "s3:my-bucket/config.json",
  })
);
```

It's that simple to add your favorite caching solution to all your aws-sdk calls.

Full source: [cache_middleware](https://github.com/kwojcicki/cache_middleware).
