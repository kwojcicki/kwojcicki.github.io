---
layout: post
title: "Trade-offs"
subtitle: "Everything is a trade off"
date: 2026-10-24  09:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

An excited university graduate joined our team and exclaimed their desire, to learn how correct decisions are made. That statement came with the implication that there is a right or wrong answer. In a school environment this is true, the teacher is expecting the students to solve problems in specific, "correct", ways and other ways (while potentially correct in terms of completing the task) are deemed incorrect.

Unfortunately in the real world there is no absolutely correct answer, there is a spectrum of trade-offs and one has to pick their poison depending on the team and business context.

### Caching

Caching tends to be universally thought of as a good thing (besides the deviously difficult cache invalidation), but even it has trade-offs. Caches are introduced to scale down and keep downstream systems under lower load. 

The implicit trade-off is you sacrifice system reliability during burst traffic for a reduction in a typical user request duration. 

How do you sacrifice system reliability? 

Imagine you have Redis fronting your favorite database. Black Friday / Cyber Monday comes along, your website gets slammed and the machine hosting your Redis service losses power, now ALL that traffic is hitting your backend (which was purposefully underscaled due to the cache performance) and it falls over resulting in downtime on your highest grossing day.

To compensate you can keep backend services scaled to handle cache failover, which itself is a trade-off between money, service reliability and your ability to ascertain expected system performance without a cache.

### Metrics

Metrics tend to also be thought of as universally good to have.

The trade-off orients itself around money on both the number of metrics your observability system needs to ingest, but also your observability platforms scale to handle more metrics. 

Additionally you have to think about the performance impact of getting these metrics off the local machine and into the observability systems grubby hands. If done in band you increase user request latency, if done out of band you decrease system throughput, if done out of band but periodically you may lose metrics.

### Parallelism

When given N pieces of work, it's tempting, to do them all in parallel, after all thats the best for system throughput! Or is it?

What about the performance impact on the rest of your system when these N pieces of work all get kicked off in parallel? If each bundle of work requires another service to succeed then that service may be overwhelmed and all N bundles will fail.

Alternatively if these N bundles represent unbounded work, any of the bundles has the potential to poison your entire system.

The trade-off you have to make is confidence in your system to handle this unknown amount of work vs staggering the parallelism and increasing request latency.

### Conclusion

Everything is a trade-off.

As software engineers it's increasingly our job to identify these trade-offs and make the decision as to which axis we want to optimize for.

How do we make those decisions? By having [tenants](/blog/TENETS), essentially high level criteria we want our systems and product to meet. When faced with a trade-off we map our tenants to the problem and anticipated longevity of the solution, business context then pick the choice that matches those criteria the best.
